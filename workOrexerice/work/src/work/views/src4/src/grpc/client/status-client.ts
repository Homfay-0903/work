/*
 * @Author: yangsheng
 * @Date: 2022-02-18 11:38:40
 * @LastEditTime: 2026-01-06 18:48:28
 * @LastEditors: liutq
 * @Description: 状态通知服务grpc客户端
 * @FilePath: \m30-device-client\src\grpc\client\status-client.ts
 */
import * as grpc from '@grpc/grpc-js'
import { _captureException } from '@/util'
import { NotifyStatusClient } from '../module/notify_status_grpc_pb'
import {
    RegisterReq,
    GetQRCodeReq,
    GetScanInfoReq,
    GetDeviceExpireReq,
    GetAIDeviceExpireReq,
    CreateScanMeasureModeReq,
    CreateScanTypeReq,
    NotifyTaskStatusReq,
    NotifyTaskStatusRes
} from '../module/notify_status_pb'
import { Promisified, promisify } from './promisified-grpc-client'
import store from '@/store'
import { EventBus } from '@/util/event-bus'
import { InterceptorOptions, Metadata, RequesterBuilder, StatusBuilder } from '@grpc/grpc-js'
import { InterceptingCall, ListenerBuilder, NextCall } from '@grpc/grpc-js/build/src/client-interceptors'
import { InterceptingListener, Listener, StatusObject } from '@grpc/grpc-js/build/src/call-stream'
import { _checkTimeZone, _getTimeZone } from '@/util'
import CONFIG from '@/config/index'
import { ControlClient} from '@/grpc/client'

// 测量状态 0 未测量 1 已测量
type measureStatus = 0 | 1

export class StatusClient {
    private originalClient: NotifyStatusClient
    private client: Promisified<NotifyStatusClient>
    private serverAddress: string
    private call: grpc.ClientReadableStream<NotifyTaskStatusRes> | undefined
    constructor(address: string) {
        this.serverAddress = address
        // 实例化客户端并转换为promise接口
        this.originalClient = new NotifyStatusClient(address, grpc.credentials.createInsecure(), {
            interceptors: [this.interceptor],
            // 发送 keepalive 探测消息的频度 ms
            // 'grpc.keepalive_time_ms': 5000,
            // keepalive 应答超时时间 ms
            // 'grpc.keepalive_timeout_ms': 3000,
            // 是否允许在没有任何调用时发送 keepalive
            // 'grpc.keepalive_permit_without_calls': 1,
            // 'grpc.initial_reconnect_backoff_ms': 1000,
            // 'grpc.max_reconnect_backoff_ms': 3000
            // 'grpc.http2.min_time_between_pings_ms': 3000
            // 'grpc-node.max_session_memory': 15
        })
        this.originalClient.waitForReady(new Date().getTime() + 10000, (error) => {
            if (error) {
                window.logger.error('[scan-client]: 状态通知服务连接失败', error)

                this.reconnect()
            } else {
                window.logger.info('[scan-client]: 状态通知服务连接成功')
                store.dispatch('changeStatusClient', true)
                // 状态服务注册
                setTimeout(() => {
                    this.sendVersion()
                }, 1000 * 15)
            }
        })
        this.client = promisify(this.originalClient)
    }

    // 获取客户端
    public getClient() {
        return this.client
    }

    //客户端上传版本
    public sendVersion() {
        // store.getters.deviceInfo.deviceId, store.getters.deviceInfo.mac, CONFIG.PRODUCT_VERSION
        const req = new RegisterReq()
        req.setDeviceId(store.getters.deviceInfo.deviceId)
        req.setDeviceMac(store.getters.deviceInfo.mac)
        req.setDeviceVersion(CONFIG.PRODUCT_VERSION)
        window.logger.info('查看参数', req,CONFIG.PRODUCT_VERSION)
        this.client.register(req).then((res) => {
            store.getters.statusRes = true
            window.logger.info('获取时区日志', res)
        })
        window.logger.info('[status-client]: 客户端上传版本', req.toObject())
    }

    // 重新连接
    public reconnect() {
        this.originalClient.close()
        this.originalClient = new NotifyStatusClient(this.serverAddress, grpc.credentials.createInsecure(), {
            interceptors: [this.interceptor],
            // 发送 keepalive 探测消息的频度 ms
            // 'grpc.keepalive_time_ms': 5000,
            // keepalive 应答超时时间 ms
            // 'grpc.keepalive_timeout_ms': 3000,
            // 是否允许在没有任何调用时发送 keepalive
            // 'grpc.keepalive_permit_without_calls': 1,
            // 'grpc.initial_reconnect_backoff_ms': 1000,
            // 'grpc.max_reconnect_backoff_ms': 3000
        })
        this.client = promisify(this.originalClient)
        this.client.$.waitForReady(new Date().getTime() + 10000, (error) => {
            if (error) {
                window.logger.error('[scan-client]: 状态通知服务连接失败', error)
                store.dispatch('changeStatusClient', false)
                // 间隔3秒重连
                setTimeout(() => {
                    this.reconnect()
                }, 3000)
            } else {
                window.logger.info('[scan-client]: 状态通知服务连接成功', store.getters.deviceInfo.deviceId)

                store.dispatch('changeStatusClient', true)
                // this.notifyTaskStatus(store.getters.deviceInfo.deviceId)
                EventBus.$emit('EventAction', 'statusClientStatus', true)
            }
        })
    }

    /**
     * 设备注册
     * 设备ID、Mac地址从控制服务获取
     *
     * @param {string} deviceId 设备ID
     * @param {string} deviceMac 设备Mac地址
     * @return {*}
     * @memberof StatusClient
     */
    public async register(deviceId: string, deviceMac: string, deviceVsrsion: string) {
        window.logger.info('[status-client]: 设备注册版本号',deviceVsrsion)
        const req = new RegisterReq()
        req.setDeviceId(deviceId)
        req.setDeviceMac(deviceMac)
        req.setDeviceVersion(deviceVsrsion)
        const data = await this.client.register(req)
        window.logger.info('[status-client]: 设备注册', req.toObject(), data.toObject())
        return data.toObject()
    }

    /**
     * 获取测量二维码
     *
     * @param {string} deviceId 设备ID
     * @param {string} scanId 扫描ID
     * @return {*}
     * @memberof StatusClient
     */
    public async getQRCode(deviceId: string, scanId: string) {
        const req = new GetQRCodeReq()
        req.setDeviceId(deviceId)
        req.setScanId(scanId)
        const data = (await this.client.getQRCode(req)).toObject()
        window.logger.info('[status-client]: 获取测量二维码', req.toObject(), data)
        let QRdata = ''
        if (data.data) {
            QRdata = 'data:image/png;base64,' + data.data
        }
        store.commit('CHANGE_QRCODE', {
            path: QRdata,
            status: true
        })
        return data
    }

    /**
     * 获取测量合成结果信息
     * 网络恢复后主动获取一遍报告列表中未合成成功的扫描结果
     *
     * @param {string} deviceId 设备ID
     * @param {string} scanId 扫描ID
     * @return {*}
     * @memberof StatusClient
     */
    public async getScanInfo(deviceId: string, scanId: string) {
        const req = new GetScanInfoReq()
        req.setDeviceId(deviceId)
        req.setScanId(scanId)
        const data = await this.client.getScanInfo(req)
        window.logger.info('[status-client]: 获取测量合成结果信息', req.toObject(), data.toObject())
        return data.toObject()
    }

    /**
     * 保存测量项目状态
     * 测量结束后将所有测量项目情况上报给云端
     *
     * @param {string} deviceId 设备ID
     * @param {string} scanId 扫描ID
     * @param {measureStatus} mass 体成分是否测量
     * @param {measureStatus} shape 体态是否测量
     * @param {measureStatus} girth 体围是否测量
     * @param {measureStatus} shoulder 肩部是否测量
     * @return {*}
     * @memberof StatusClient
     */
    public async createScanType(
        deviceId: string,
        scanId: string,
        mass: measureStatus,
        shape: measureStatus,
        girth: measureStatus,
        shoulder: measureStatus,
        utc: string,
        timeZone: string,
        scanMode: number,
        nutrition: number,
        height: number,
        beauty: number,
        weightMeasure: number,
        athlete: number,
    ) {
        const req = new CreateScanTypeReq()
        req.setDeviceId(deviceId)
        req.setScanId(scanId)
        req.setBiaMeasure(mass)
        req.setEvalMeasure(shape)
        req.setGirthMeasure(girth)
        req.setShoulderJointEval(shoulder)
        req.setUtc(utc), req.setTimeZone(timeZone)
        req.setScanMode(scanMode === 1 ? 1 : 0)
        req.setNutrition(nutrition)
        req.setHeight(height) 
        req.setBeauty(beauty)
        req.setWeightMeasure(weightMeasure)
        req.setAthlete(athlete)
        window.logger.info('[status-client]: 请求保存测量项目状态', req.toObject())
        const data = await this.client.createScanType(req)
        window.logger.info('[status-client]: 测量项目状态保存成功', data.toObject())
        return data.toObject()
    }

    /**
     * 获取设备到ai期情况
     *
     * @param {string} deviceId 设备ID
     * @return {*}
     * @memberof StatusClient
     */
    public async getAIDeviceExpire(deviceId: string) {
        const req = new GetAIDeviceExpireReq()
        req.setDeviceId(deviceId)
        const data = await this.client.getAIDeviceExpire(req)
        window.logger.info('[status-client]: 获取设备到ai期情况', req.toObject(), data.toObject())
        return data.toObject()
    }

    /**
     * 获取设备ai到期情况
     *
     * @param {string} deviceId 设备ID
     * @return {*}
     * @memberof StatusClient
     */
    public async getDeviceExpire(deviceId: string) {
        const req = new GetDeviceExpireReq()
        req.setDeviceId(deviceId)
        const data = await this.client.getDeviceExpire(req)
        window.logger.info('[status-client]: 获取设备到期情况', req.toObject(), data.toObject())
        return data.toObject()
    }

     /**
     * 获取设备ai到期情况
     *
     * @param {string} deviceId 设备ID
     * @return {*}
     * @memberof StatusClient
     */
    public async createScanMeasureMode(scanId: string, isGirthEvalCombo: number, scanMode: number, createTime: number) {
        const req = new CreateScanMeasureModeReq()
        req.setScanId(scanId)
        req.setIsGirthEvalCombo(isGirthEvalCombo)
        req.setScanMode(scanMode)
        req.setCreateTime(createTime)
        window.logger.info('我要发送', req.toObject())
        const data = await this.client.createScanMeasureMode(req)
        window.logger.info('[status-client]: 发送设备测量是否开启了体态+体重+体围三项', req.toObject(), data.toObject())
        return data.toObject()
    }

    /**
     * 任务合成状态流
     * 自检成功后开启直到设备关机结束
     * 如果流断开则认为网络异常（以是否能连上状态通知服务为准）并定时重连
     *
     * @param {string} deviceId 设备ID
     * @return {*}
     * @memberof StatusClient
     */
    public notifyTaskStatus(deviceId: string) {
        const req = new NotifyTaskStatusReq()
        req.setDeviceId(deviceId)
        window.logger.info('[status-client]: 发起任务合成状态流', req.toObject())
        if (this.call) {
            this.call.destroy()
        }
        this.call = this.originalClient.notifyTaskStatus(req)
        this.call.on('data', (response: NotifyTaskStatusRes) => {
            window.logger.info('[status-client]: 任务合成状态流收到数据', response.toObject())
            // 触发体重数据上报事件
            EventBus.$emit('EventAction', 'NotifyTaskStatus', response.toObject())
            store.dispatch('changeTaskStatus', response.toObject())
        })
        this.call.on('close', () => {
            window.logger.info('[status-client]: 任务合成状态流close')
            // 重新连接
            // this.reconnect()
        })
        this.call.on('end', () => {
            window.logger.info('[status-client]: 任务合成状态流end')
        })
        this.call.on('error', (error) => {
            window.logger.info('[status-client]: 任务合成状态流error', error)
            // 重新连接
            // this.notifyTaskStatusReconnect(deviceId)
        })
        this.call.on('readable', () => {
            window.logger.info(`readable: ${this.call?.read()}`)
        })
    }

    private notifyTaskStatusReconnect(deviceId: string) {
        setTimeout(() => {
            this.notifyTaskStatus(deviceId)
        }, 3000)
    }

    private retry_interceptor(options: InterceptorOptions, nextCall: NextCall): any {
        let savedMetadata: Metadata
        let savedSendMessage: any
        let savedReceiveMessage: any
        let savedMessageNext: any
        const maxRetries = 50
        const requester = new RequesterBuilder()
            .withStart(function (
                metadata: Metadata,
                listener: InterceptingListener,
                next: (metadata: Metadata, listener: InterceptingListener | Listener) => void
            ): void {
                savedMetadata = metadata
                const new_listener = new ListenerBuilder()
                    .withOnReceiveMessage(function (message: any, next: any) {
                        savedReceiveMessage = message
                        savedMessageNext = next
                        // for response streaming
                        if (options?.method_definition?.responseStream === true) {
                            savedMessageNext(savedReceiveMessage)
                        }
                    })
                    .withOnReceiveStatus(function (status: any, next: any) {
                        let retries = 0
                        const retry = function (message: any, metadata: any) {
                            retries++
                            const newCall = nextCall(options)
                            let receivedMessage: any
                            newCall.start(metadata, {
                                onReceiveMessage: function (message: any) {
                                    receivedMessage = message
                                },
                                onReceiveStatus: async function (status: StatusObject) {
                                    if (status.code !== grpc.status.OK) {
                                        if (retries <= maxRetries) {
                                            window.logger.debug('Retrying request', { retries, options })
                                            retry(message, metadata)
                                        } else if (savedMessageNext) {
                                            savedMessageNext(receivedMessage)
                                            next(status)
                                        } else {
                                            next(status)
                                        }
                                    } else {
                                        const new_status: any = new StatusBuilder().withCode(grpc.status.OK).build()
                                        savedMessageNext(receivedMessage)
                                        next(new_status)
                                    }
                                }
                            })
                            newCall.sendMessage(message)
                            newCall.halfClose()
                        }
                        if (status.code !== grpc.status.OK) {
                            window.logger.debug('Retrying due to status', status)
                            retry(savedSendMessage, savedMetadata)
                        } else {
                            // not to send last chunk twice for response stream
                            if (options?.method_definition?.responseStream === false) {
                                savedMessageNext(savedReceiveMessage)
                            }
                            next(status)
                        }
                    })
                    .build()
                next(metadata, new_listener)
            })
            .withSendMessage(function (message, next) {
                savedSendMessage = message
                next(message)
            })
            .build()
        return new InterceptingCall(nextCall(options), requester)
    }

    /**
     * 拦截器
     *
     * 请求失败时会尝试3次
     * @private
     * @param {*} options
     * @param {*} nextCall
     * @return {*}
     * @memberof HwClient
     *
     */
    private interceptor(options: any, nextCall: any) {
        let savedMetadata: any
        let savedSendMessage: any
        let savedReceiveMessage: any
        let savedMessageNext: any
        // 异常重试次数
        const maxRetries = 3
        const path: string[] = options.method_definition.path.split('/')
        // 获取方法名
        const funName: string = path.length > 0 ? path[path.length - 1] : ''
        const requester = {
            start: (metadata: any, listener: any, next: any) => {
                savedMetadata = metadata
                next(metadata, {
                    onReceiveMessage: (message: any, msgNext: any) => {
                        savedReceiveMessage = message
                        savedMessageNext = msgNext
                        window.logger.debug(`[status-client] ${funName} RES:`, JSON.stringify(message?.toObject()))
                        msgNext(message)
                    },
                    onReceiveStatus: (status: any, statusNext: any) => {
                        let retries = 0
                        const retry = (message: any, retryMetadata: any) => {
                            retries++
                            // window.logger.debug(`[status-client] ${funName} RES RETRY ${retries}`)
                            const newCall = nextCall(options)
                            newCall.start(retryMetadata, {
                                onReceiveMessage: (retryMsg: any) => {
                                    savedReceiveMessage = retryMsg
                                },
                                onReceiveStatus: (retryStatus: any) => {
                                    if (retryStatus.code !== grpc.status.OK) {
                                        if (retries < maxRetries) {
                                            retry(message, retryMetadata)
                                        } else {
                                            store.dispatch('changeDeviceInfo', { contortStatus: false })
                                            // savedMessageNext(savedReceiveMessage)
                                            // statusNext(retryStatus)
                                            window.logger.error(`[status-client] ${funName} ERROR:`, status)
                                            _captureException(
                                                new Error(`[grpc-error]: ${status.code}: ${status.details}`),
                                                {
                                                    tags: {
                                                        grpcService: 'status',
                                                        grpcFunName: funName
                                                    }
                                                }
                                            )
                                        }
                                    } else {
                                        savedMessageNext(savedReceiveMessage)
                                        statusNext({ code: grpc.status.OK })
                                    }
                                }
                            })
                        }
                        if (status.code !== grpc.status.OK) {
                            retry(savedSendMessage, savedMetadata)
                        } else {
                            savedMessageNext(savedReceiveMessage)
                            statusNext(status)
                        }
                    }
                })
            },
            sendMessage: (message: any, next: any) => {
                savedSendMessage = message
                window.logger.debug(`[status-client] ${funName} REQ:`, JSON.stringify(message?.toObject()))
                next(message)
            },
            cancel: (next: any) => {
                window.logger.debug(`[status-client] ${funName} CANCEL`)
                next()
            }
        }

        return new grpc.InterceptingCall(nextCall(options), requester)
    }
}
