/*
 * @Author: yangsheng
 * @Date: 2022-02-22 20:23:18
 * @LastEditTime: 2023-02-15 18:43:17
 * @LastEditors: liutq
 * @Description: 硬件服务grpc客户端
 * @FilePath: /vr-3.0-device-client/src/grpc/client/hardware-client.ts
 */
import * as grpc from '@grpc/grpc-js'
import { _captureException } from '@/util'
import { HardwareClient as gRPCHardwareClient } from '../module/hardware_grpc_pb'
import { CommonReq, ScreenCtrlReq, BacklightReq, WifiSetReq } from '../module/hardware_pb'
import { Promisified, promisify } from './promisified-grpc-client'

export class HardwareClient {
    private client: Promisified<gRPCHardwareClient>
    constructor(address: string) {
        // 实例化客户端并转换为promise接口
        this.client = promisify(
            new gRPCHardwareClient(address, grpc.credentials.createInsecure(), {
                interceptors: [this.interceptor],
                // 发送 keepalive 探测消息的频度 ms
                'grpc.keepalive_time_ms': 2000,
                // keepalive 应答超时时间 ms
                'grpc.keepalive_timeout_ms': 1000,
                // 是否允许在没有任何调用时发送 keepalive
                'grpc.keepalive_permit_without_calls': 1,
                'grpc.http2.min_time_between_pings_ms': 3000
            })
        )
    }

    // 获取客户端
    public getClient() {
        return this.client
    }

    /**
     * 获取硬件服务状态
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async serviceStatus() {
        window.logger.info('[hardware-client]: 获取硬件服务状态')
        return await this.client.serviceStatus(new CommonReq())
    }

    /**
     * 屏幕状态设置
     *
     * @param {number} status 1 开屏 2 关屏
     * @return {*}
     * @memberof HardwareClient
     */
    public async screenCtrl(status: ScreenCtrlReq.StatusMap[keyof ScreenCtrlReq.StatusMap]) {
        window.logger.info('[hardware-client]: 屏幕状态设置')
        const req = new ScreenCtrlReq()
        req.setStatus(status)
        return await this.client.screenCtrl(req)
    }

    /**
     * 修改屏幕亮度
     *
     * @param {number} volume
     * @return {*}
     * @memberof ControlClient
     */
    public async screenBright(value: number) {
        window.logger.info('[control-client]: 屏幕亮度值', value)
        const req = new BacklightReq()
        req.setValue(value)
        window.logger.info('[control-client]: 修改屏幕亮度', req.toObject())
        return await this.client.backlightSet(req)
    }

    /**
     * 获取屏幕亮度
     *
     * @param {number} volume
     * @return {*}
     * @memberof ControlClient
     */
    public async backlightGet() {
        window.logger.info('[hardware-client]: 获取请求')
        return await this.client.backlightGet(new CommonReq())
    }

    /**
     * 开机站人检测
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async personCheck() {
        window.logger.info('[hardware-client]: 开机站人检测')
        return await this.client.personCheck(new CommonReq())
    }

    /**
     * 硬件自检
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async checkSelf() {
        window.logger.info('[hardware-client]: 硬件自检')
        return await this.client.checkSelf(new CommonReq())
    }

    /**
     * 开始测量体重
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async weightMeasure() {
        window.logger.info('[hardware-client]: 开始测量体重')
        return await this.client.weightMeasure(new CommonReq())
    }

    /**
     * 开始测量体成分
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async bodyMeasure() {
        window.logger.info('[hardware-client]: 开始测量体成分')
        return await this.client.bodyMeasure(new CommonReq())
    }

    /**
     * 设备硬件状态
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async hardwareStatus() {
        window.logger.info('[hardware-client]: 设备硬件状态')
        // const data = await this.client.hardwareStatus(new CommonReq())
        // return data.toObject()
    }

    /**
     * 转台旋转
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async tableRun() {
        window.logger.info('[hardware-client]: 转台旋转')
        return await this.client.tableRun(new CommonReq())
    }
    
    /**
     * WiFi设置
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async wifiSet(data: WifiSetReq.AsObject) {
        window.logger.info('[hardware-client]: wifi设置', data, data.autoconnect)
        const request = new WifiSetReq();
        request.setType(data.type);
        if (data.value) {
            request.setValue(data.value);
        }
        if (data.ssid) {
            request.setSsid(data.ssid);
        }
        if (data.pass) {
            request.setPass(data.pass);
        }
        if (data.autoconnect) {
            request.setAutoconnect(data.autoconnect);
        }
        // window.logger.info('[hardware-client]: request', request)
        window.logger.info('[hardware-client]: request', request.toObject());
        return await this.client.wifiSet(request)
    }

    /**
     * WiFi启用状态获取
     *
     * @return {*}
     * @memberof HardwareClient
     */
    public async wifiEnableStatusGet() {
        window.logger.info('[hardware-client]: WiFi启用状态获取')
        return await this.client.wifiEnableStatusGet(new CommonReq())
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
                        window.logger.debug(`[hardware-client] ${funName} RES:`, JSON.stringify(message?.toObject()))
                        // msgNext(message)
                    },
                    onReceiveStatus: (status: any, statusNext: any) => {
                        let retries = 0
                        const retry = (message: any, retryMetadata: any) => {
                            retries++
                            // window.logger.debug(`[hardware-client] ${funName} RES RETRY ${retries}`)
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
                                            // savedMessageNext(savedReceiveMessage)
                                            // statusNext(retryStatus)
                                            window.logger.error(`[hardware-client] ${funName} ERROR:`, status)
                                            _captureException(
                                                new Error(`[grpc-error]: ${status.code}: ${status.details}`),
                                                {
                                                    tags: {
                                                        grpcService: 'hardware',
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
                window.logger.debug(`[hardware-client] ${funName} REQ:`, JSON.stringify(message?.toObject()))
                next(message)
            },
            cancel: (next: any) => {
                window.logger.debug(`[hardware-client] ${funName} CANCEL`)
                next()
            }
        }

        return new grpc.InterceptingCall(nextCall(options), requester)
    }
}
