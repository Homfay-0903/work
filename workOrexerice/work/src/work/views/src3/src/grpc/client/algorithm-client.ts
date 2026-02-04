import * as grpc from '@grpc/grpc-js'
import { Promisified, promisify } from './promisified-grpc-client'
import { AlgorithmClient as gRPCAlgorithmClient } from '../module/algorithm_grpc_pb'
import { _captureException } from '@/util'
import { CommonReq, ShoulderDetectReq, StartScanReq } from '../module/algorithm_pb'

/**
 * 算法服务grpc客户端
 */
export class AlgorithmClient {
    private client: Promisified<gRPCAlgorithmClient>
    private serverAddress: string
    constructor(address: string) {
        this.serverAddress = address
        // 实例化客户端并转换为promise接口
        this.client = promisify(
            new gRPCAlgorithmClient(address, grpc.credentials.createInsecure(), {
                interceptors: [this.interceptor]
            })
        )
    }

    // 获取客户端
    public getClient() {
        return this.client
    }

    // 重新连接
    public reconnect() {
        this.client.$.close()
        this.client = promisify(
            new gRPCAlgorithmClient(this.serverAddress, grpc.credentials.createInsecure(), {
                interceptors: [this.interceptor]
            })
        )
        this.client.$.waitForReady(new Date().getTime() + 10000, (error) => {
            if (error) {
                window.logger.error('[algorithm-client]: 算法服务连接失败', error)
            } else {
                window.logger.info('[algorithm-client]: 算法服务连接成功')
                this.serviceStatus()
            }
        })
    }

    /**
     * 获取扫描服务状态
     *
     * @return {*}
     * @memberof AlgorithmClient
     */
    public async serviceStatus() {
        window.logger.info('[algorithm-client]: 获取算法服务状态')
        const req = new CommonReq()
        return await this.client.serviceStatus(req)
    }

    /**
     * 发起自检
     *
     * @return {*}
     * @memberof AlgorithmClient
     */
    public async checkSelf() {
        window.logger.info('[algorithm-client]: 发起自检')
        const req = new CommonReq()
        return await this.client.checkSelf(req)
    }

    /**
     * 深度相机状态
     *
     * @return {*}
     * @memberof AlgorithmClient
     */
    public async depthCameraStatus() {
        window.logger.info('[algorithm-client]: 深度相机状态请求')
        return await this.client.depthCameraStatus(new CommonReq())
    }

    /**
     * 主动关闭深度相机（体成分测量时调用）
     * @returns
     */
    public async closeDepthCamera() {
        window.logger.info('[algorithm-client]: 主动关闭深度相机')
        return await this.client.closeDepthCamera(new CommonReq())
    }

    /**
     * 体围apose启动姿势合法性检测
     *
     * @return {*}
     * @memberof ScanClient
     */
    public async startAposeDetect() {
        window.logger.info('[algorithm-client]: 启动Apose姿势合法性检测')
        const req = new CommonReq()
        return await this.client.startAposeDetect(req)
    }

    public async stopAposeDetect() {
        window.logger.info('[algorithm-client]: 停止Apose姿势合法性检测')
        const req = new CommonReq()
        return await this.client.stopAposeDetect(req)
    }

    /**
     * 体态ipose启动姿势合法性检测
     *
     * @return {*}
     * @memberof ScanClient
     */
    public async startIposeDetect() {
        window.logger.info('[algorithm-client]: 启动Ipose姿势合法性检测')
        const req = new CommonReq()
        return await this.client.startIposeDetect(req)
    }

    public async stopIposeDetect() {
        window.logger.info('[algorithm-client]: 停止Ipose姿势合法性检测')
        const req = new CommonReq()
        return await this.client.stopIposeDetect(req)
    }

    /**
     * 开始扫描
     *
     * @param {string} scanId 扫描ID
     * @param {number} scanType 扫描类型 1 体围 2 体态
     * @return {*}
     * @memberof ScanClient
     */
    public async startScan(scanId: string, scanType: StartScanReq.ScanTypeMap[keyof StartScanReq.ScanTypeMap]) {
        window.logger.info('[algorithm-client]: 开始扫描')
        const req = new StartScanReq()
        req.setScanId(scanId)
        req.setScanType(scanType)
        return await this.client.startScan(req)
    }

    /**
     * 停止扫描 - 有测量结果
     *
     * @return {*}
     * @memberof ScanClient
     */
    public async stopScan() {
        window.logger.info('[algorithm-client]: 停止扫描')
        const req = new CommonReq()
        return await this.client.stopScan(req)
    }

    /**
     * 取消扫描 - 设备异常时使用，丢弃测量结果
     *
     * @return {*}
     * @memberof ScanClient
     */
    public async cancelScan() {
        window.logger.info('[algorithm-client]: 取消扫描')
        const req = new CommonReq()
        return await this.client.cancelScan(req)
    }

    /**
     * 启动手势检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async startGestureDetect() {
        window.logger.info('[algorithm-client]: 启动手势检测')
        return await this.client.startGestureDetect(new CommonReq())
    }

    /**
     * 停止手势检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async stopGestureDetect() {
        window.logger.info('[algorithm-client]: 停止手势检测')
        return await this.client.stopGestureDetect(new CommonReq())
    }

    /**
     * 启动站人检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async startPersonDetect() {
        window.logger.info('[algorithm-client]: 启动站人检测')
        return await this.client.startPersonDetect(new CommonReq())
    }

    /**
     * 停止站人检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async stopPersonDetect() {
        window.logger.info('[algorithm-client]: 停止站人检测')
        return await this.client.stopPersonDetect(new CommonReq())
    }

    /**
     * 启动手势Ipose检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async startGestureIposeDetect() {
        window.logger.info('[algorithm-client]: 启动手势Ipose检测')
        return await this.client.startGestureIposeDetect(new CommonReq())
    }

    /**
     * 停止手势Ipose检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async stopGestureIposeDetect() {
        window.logger.info('[algorithm-client]: 停止手势Ipose检测')
        return await this.client.stopGestureIposeDetect(new CommonReq())
    }

    /**
     * 开启环境光照检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async startAmbientLightDetect() {
        // window.logger.info('[gesture-client]: 开始环境光检测')
        return await this.client.startAmbientLightDetect(new CommonReq())
    }

    /**
     * 启动肩部检测
     *
     * @param {number} detectType 1 左外展上举 2 右外展上举 3 左前屈上举 4 右前屈上举
     * @return {*}
     * @memberof ShoulderClient
     */
    public async startShoulderDetect(
        detectType: ShoulderDetectReq.DetectTypeMap[keyof ShoulderDetectReq.DetectTypeMap]
    ) {
        window.logger.info('[algorithm-client]: 启动肩部检测')
        const req = new ShoulderDetectReq()
        req.setDetectType(detectType)
        return await this.client.startShoulderDetect(req)
    }

    /**
     * 停止肩部检测
     *
     * @return {*}
     * @memberof ShoulderClient
     */
    public async stopShoulderDetect(
        detectType: ShoulderDetectReq.DetectTypeMap[keyof ShoulderDetectReq.DetectTypeMap]
    ) {
        window.logger.info('[algorithm-client]: 停止肩部检测')
        const req = new ShoulderDetectReq()
        req.setDetectType(detectType)
        return await this.client.stopShoulderDetect(req)
    }

    /**
     * 启动肩部姿势合法性检测
     *
     * @return {*}
     * @memberof ShoulderClient
     */
    public async startShoulderLegalityDetect() {
        window.logger.info('[algorithm-client]: 启动肩部姿势合法性检测')
        return await this.client.startShoulderLegalityDetect(new CommonReq())
    }

    /**
     * 停止肩部姿势合法性检测
     *
     * @return {*}
     * @memberof ShoulderClient
     */
    public async stopShoulderLegalityDetect() {
        window.logger.info('[algorithm-client]: 停止肩部姿势合法性检测')
        return await this.client.stopShoulderLegalityDetect(new CommonReq())
    }

    /**
     * 关闭环境光照检测
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async stopAmbientLightDetect() {
        window.logger.info('[algorithm-client]: 停止环境光检测')
        return await this.client.stopAmbientLightDetect(new CommonReq())
    }

    /**
     * 开始身高测量
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async startHeightMeasurement() {
        window.logger.info('[algorithm-client]: 开始身高测量')
        return await this.client.startHeightMeasurement(new CommonReq())
    }

    /**
     * 结束身高测量
     *
     * @return {*}
     * @memberof GestureClient
     */
    public async endHeightMeasurement() {
        window.logger.info('[algorithm-client]: 结束身高测量')
        return await this.client.endHeightMeasurement(new CommonReq())
    }

    /**
     * 开启二维码识别
     * @returns
     */
    public async startScanQRCode() {
        window.logger.info('[algorithm-client]: 开启二维码识别')
        return await this.client.startScanQRCode(new CommonReq())
    }

    /**
     * 停止二维码识别
     * @returns
     */
    public async stopScanQRCode() {
        window.logger.info('[algorithm-client]: 停止二维码识别')
        return await this.client.stopScanQRCode(new CommonReq())
    }

    /**
     * 拦截器
     *
     * 请求失败时会尝试3次∂
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
                        window.logger.debug(`[algorithm-client] ${funName} RES:`, JSON.stringify(message?.toObject()))
                        // msgNext(message)
                    },
                    onReceiveStatus: (status: any, statusNext: any) => {
                        let retries = 0
                        const retry = (message: any, retryMetadata: any) => {
                            retries++
                            // window.logger.debug(`[scan-client] ${funName} RES RETRY ${retries}`)
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
                                            window.logger.error(`[algorithm-client] ${funName} ERROR:`, status)
                                            _captureException(
                                                new Error(`[grpc-error]: ${status.code}: ${status.details}`),
                                                {
                                                    tags: {
                                                        grpcService: 'scan',
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
                window.logger.debug(`[algorithm-client] ${funName} REQ:`, JSON.stringify(message?.toObject()))
                next(message)
            },
            cancel: (next: any) => {
                window.logger.debug(`[algorithm-client] ${funName} CANCEL`)
                next()
            }
        }

        return new grpc.InterceptingCall(nextCall(options), requester)
    }
}
