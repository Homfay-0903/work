/*
 * @Author: yangsheng
 * @Date: 2022-02-18 11:38:40
 * @LastEditTime: 2025-07-29 16:04:40
 * @LastEditors: liyunfei12354 3090384495@qq.com
 * @Description: 控制服务grpc客户端
 * @FilePath: \m30-device-client\src\grpc\client\control-client.ts
 */
import * as grpc from '@grpc/grpc-js'
import { _captureException } from '@/util'
import store from '@/store'
import { MeasureClient, SettingsClient } from '../module/control_grpc_pb'
import {
    CommonReq,
    PrintReportReq,
    ChangeVolumeReq,
    WeightResultReq,
    BodyResultReq,
    ScanResultReq,
    ShoulderResultReq,
    ResistanceBody,
    ResistanceInfo,
    ChangeTimeZoneReq,
    TurnTableResistanceReq,
    EvalWeightResultReq
} from '../module/control_pb'
import { Promisified, promisify } from './promisified-grpc-client'

export class ControlClient {
    private measureClient: Promisified<MeasureClient>
    private settingsClient: Promisified<SettingsClient>
    constructor(address: string) {
        // 实例化客户端并转换为promise接口
        this.measureClient = promisify(
            new MeasureClient(address, grpc.credentials.createInsecure(), {
                interceptors: [this.interceptor],
                // // 发送 keepalive 探测消息的频度 ms
                // 'grpc.keepalive_time_ms': 2000,
                // // keepalive 应答超时时间 ms
                // 'grpc.keepalive_timeout_ms': 1000,
                // // 是否允许在没有任何调用时发送 keepalive
                // 'grpc.keepalive_permit_without_calls': 1,
                // 'grpc.http2.min_time_between_pings_ms': 3000
            })
        )
        this.settingsClient = promisify(
            new SettingsClient(address, grpc.credentials.createInsecure(), {
                interceptors: [this.interceptor],
                // // 发送 keepalive 探测消息的频度 ms
                // 'grpc.keepalive_time_ms': 2000,
                // // keepalive 应答超时时间 ms
                // 'grpc.keepalive_timeout_ms': 1000,
                // // 是否允许在没有任何调用时发送 keepalive
                // 'grpc.keepalive_permit_without_calls': 1,
                // 'grpc.http2.min_time_between_pings_ms': 3000
            })
        )
    }

    // 获取控制服务客户端
    public getClient() {
        return {
            measureClient: this.measureClient,
            settingsClient: this.settingsClient
        }
    }

    /**
     * 获取设备信息 - 设备ID、音量
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async deviceInfo() {
        const data = await this.settingsClient.deviceInfo(new CommonReq())
        window.logger.info('[control-client]: 获取设备信息 - 设备ID、音量', data.toObject())
        return data.toObject()
    }

    /**
     * 获取第三方接口绑定类型
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async thirdBind() {
        const data = await this.settingsClient.thirdBind(new CommonReq())
        window.logger.info('[control-client]: 获取第三方接口绑定类型', data.toObject())
        return data.toObject()
    }

    /**
     * 设置设备时区
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async changeTimeZone(timeZone: string) {
        const req = new ChangeTimeZoneReq()
        req.setTimeZone(timeZone)
        window.logger.info('[control-client]: 获取设备时区', timeZone)
        return await this.settingsClient.changeTimeZone(req)
    }

    /**
     * 报告打印请求
     *
     * @param {string} scanId 扫描ID
     * @return {*}
     * @memberof ControlClient
     */
    public async printReport(scanId: string, language: string, paperSize: any) {
        const req = new PrintReportReq()
        req.setScanId(scanId)
        req.setLanguage(language)
        req.setPaperSize(paperSize)
        window.logger.info('[control-client]: 报告打印请求')
        return await this.settingsClient.printReport(req)
    }

    /**
     * 设备关机
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async deviceClose() {
        window.logger.info('[control-client]: 设备关机请求')
        return await this.settingsClient.deviceClose(new CommonReq())
    }

    /**
     * 上传任务数量 - 关机前获取
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async taskNum() {
        window.logger.info('[control-client]: 上传任务数量 - 关机前获取')
        const data = await this.settingsClient.taskNum(new CommonReq())
        return data.toObject()
    }

    /**
     * 获取上传速度
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async upLoadNetSpeed() {
        window.logger.info('[control-client]: 获取上传速度')
        return await this.settingsClient.upLoadNetSpeed(new CommonReq())
    }

    /**
     * 获取下载速度
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async downLoadNetSpeed() {
        window.logger.info('[control-client]: 获取下载速度')
        return await this.settingsClient.downLoadNetSpeed(new CommonReq())
    }

    /**
     * 修改设备音量
     *
     * @param {number} volume
     * @return {*}
     * @memberof ControlClient
     */
    public async changeVolume(volume: number) {
        const req = new ChangeVolumeReq()
        req.setVolume(volume)
        window.logger.info('[control-client]: 修改设备音量', req.toObject())
        return await this.settingsClient.changeVolume(req)
    }

    /**
     * 重启扫描服务
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async restartScanSrv() {
        const data = await this.settingsClient.restartScanSrv(new CommonReq())
        window.logger.info('[control-client]: 重启扫描服务', data.toObject())
        return data.toObject()
    }

    /**
     * 发起自检
     *
     * @return {*}
     * @memberof ControlClient
     */
    public async checkSelf() {
        const data = await this.settingsClient.checkSelf(new CommonReq())
        window.logger.info('[control-client]: 发起自检', data.toObject())
        return data.toObject()
    }

    /**
     * 上报体重数据
     * @param data 体重数据
     * @returns
     */
    public async weightResult(data: WeightResultReq.AsObject) {
        window.logger.info('[control-client]: 上报体重数据', data)
        const req = new WeightResultReq()
        req.setScanId(data.scanId)
        req.setWeight(data.weight)
        return this.measureClient.weightResult(req)
    }

    /**
     * 体态测量中的体重上报
     * @param data 体重数据
     * @returns
     */
    public async evalWeightResult(data: EvalWeightResultReq.AsObject) {
        window.logger.info('[control-client]: 上报体重数据', data)
        const req = new EvalWeightResultReq()
        req.setScanId(data.scanId)
        req.setWeight(data.weight)
        return this.measureClient.evalWeightResult(req)
    }

    /**
     * 上报体成分测量结果
     * @param data 体成分数据
     * @returns
     */
    public async bodyResult(data: any) {
        // window.logger.info('[control-client]: 上报体成分测量结果传入', data)
        window.logger.info(
            '[control-client]: 上报体成分测量结果传入',
            data.scanId,
            JSON.stringify(data?.data?.resInfo?.res5k),
            JSON.stringify(data?.data?.resInfo?.res50k),
            JSON.stringify(data?.data?.resInfo?.res250k)
        )
        const info = data?.data?.resInfo
        const req = new BodyResultReq()
        const res5k = new ResistanceBody()

        res5k.setLeftArm(info.res5k.leftArm)
        res5k.setRightArm(info.res5k.rightArm)
        res5k.setLeftLeg(info.res5k.leftLeg)
        res5k.setRightLeg(info.res5k.rightLeg)
        res5k.setTorso(info.res5k.torso)

        const res50k = new ResistanceBody()
        res50k.setLeftArm(info.res50k.leftArm)
        res50k.setRightArm(info.res50k.rightArm)
        res50k.setLeftLeg(info.res50k.leftLeg)
        res50k.setRightLeg(info.res50k.rightLeg)
        res50k.setTorso(info.res50k.torso)

        const resInfo = new ResistanceInfo()
        resInfo.setRes5k(res5k)
        resInfo.setRes50k(res50k)
        // 判断是否有250k电阻信息
        if (data?.data?.resInfo?.res250k) {
            const res250k = new ResistanceBody()
            res250k.setLeftArm(info.res250k.leftArm)
            res250k.setRightArm(info.res250k.rightArm)
            res250k.setLeftLeg(info.res250k.leftLeg)
            res250k.setRightLeg(info.res250k.rightLeg)
            res250k.setTorso(info.res250k.torso)
            resInfo.setRes250k(res250k)
        }
        const massInfo = new BodyResultReq.Data()
        massInfo.setResInfo(resInfo)

        req.setScanId(data.scanId)
        req.setData(massInfo)
        window.logger.info('[control-client]: 上报体成分测量结果', JSON.stringify(req.toObject()))
        return this.measureClient.bodyResult(req)
    }
    /**
     * 上报电阻数据结果
     * @param data 体成分数据
     * @returns
     */
    public turnTableResistance(data: any) {
        window.logger.info('[control-client]: 上报体成分电阻传入', data.scanId, JSON.stringify(data))
        const req = new TurnTableResistanceReq()
        req.setScanId(data.scanId)
        req.setEnCode(data.enciphermentresistance)
        req.setRawCode(data.originresistance)
        window.logger.info('[control-client]: 上报体成分电阻结果', JSON.stringify(req.toObject()))
        return this.measureClient.turnTableResistance(req)
    }
    /**
     * 上报体态、体围测量结果
     * @param data 测量数据
     * @returns
     */
    public async scanResult(data: any) {
        window.logger.info('[control-client]: 上报体态、体围测量结果', data)
        const req = new ScanResultReq()
        req.setScanId(data.scanId)
        req.setScanType(data.scanType)
        req.setImagePath(data.imagePath)
        req.setImageRawPath(data.imagePath)
        return this.measureClient.scanResult(req)
    }

    /**
     * 上报肩部测量结果
     * @param data 肩部数据
     * @returns
     */
    public async shoulderResult(data: any) {
        window.logger.info('[control-client]: 上报肩部测量结果', data)
        const req = new ShoulderResultReq()
        req.setScanId(data.scanId)
        req.setMeasureTime(data.measureTime)
        req.setLeftAbduction(data.leftAbduction)
        req.setLeftAntexion(data.leftAntexion)
        req.setRightAbduction(data.rightAbduction)
        req.setRightAntexion(data.rightAntexion)
        return this.measureClient.shoulderResult(req)
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
                        window.logger.debug(`[control-client] ${funName} RES:`, JSON.stringify(message?.toObject()))
                        // msgNext(message)
                    },
                    onReceiveStatus: (status: any, statusNext: any) => {
                        let retries = 0
                        const retry = (message: any, retryMetadata: any) => {
                            retries++
                            // window.logger.debug(`[control-client] ${funName} RES RETRY ${retries}`)
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
                                            window.logger.error(`[control-client] ${funName} ERROR:`, status)
                                            _captureException(
                                                new Error(`[grpc-error]: ${status.code}: ${status.details}`),
                                                {
                                                    tags: {
                                                        grpcService: 'control',
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
                window.logger.debug(`[control-client] ${funName} REQ:`, JSON.stringify(message?.toObject()))
                next(message)
            },
            cancel: (next: any) => {
                window.logger.debug(`[control-client] ${funName} CANCEL`)
                next()
            }
        }

        return new grpc.InterceptingCall(nextCall(options), requester)
    }
}
