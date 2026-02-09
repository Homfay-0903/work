import {
    AlgServiceStatusReq,
    AmbientLightResultReq,
    AposeDetectResultReq,
    CheckSelfReq,
    CommonReq,
    CommonRes,
    DepthCameraStatusReq,
    ErrorStatusReq,
    GestureDetectResultReq,
    GestureIposeResultReq,
    IposeDetectResultReq,
    PersonDetectResultReq,
    QRCodeScanResultReq,
    ScanResultReq,
    ShoulderDetectResultReq,
    StartShoulderLegalityResultReq,
    HeightMeasurementReq,
    SurveyorStatusReq,
    FisheyeCameraStatusReq,
    AposeAngleReq,
} from '@/grpc/module/client_pb'
import * as grpc from '@grpc/grpc-js'
import store from '@/store'
import { EventBus } from '@/util/event-bus'

export const AlgorithmService = {
    /**
     * 扫描服务状态上报
     *
     * @param {grpc.ServerUnaryCall<AlgServiceStatusReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    serviceStatus(call: grpc.ServerUnaryCall<AlgServiceStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 算法服务状态上报', JSON.stringify(req))
        // 设置扫描服务状态
        store.dispatch('changeExtService', {
            name: 'alg',
            ready: req.serviceStatus
        })
        if (req.serviceStatus === 2) {
            // 深度相机硬件异常
            store.commit('ADD_DEVICE_ERROR', 3)
            // 鱼眼相机异常
            store.commit('ADD_DEVICE_ERROR', 2)
        }
        // 触发全局事件
        EventBus.$emit('EventAction', 'ServiceStatus', {
            name: 'alg',
            status: req.serviceStatus
        })
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 扫描服务自检结果上报
     *
     * @param {grpc.ServerUnaryCall<CheckSelfReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    checkSelf(call: grpc.ServerUnaryCall<CheckSelfReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 算法服务自检结果上报', JSON.stringify(req))
        // 设置扫描服务自检状态
        store.dispatch('changeExtService', {
            name: 'alg',
            checkSelf: req.result ? 1 : 2
        })
        // 自检失败设置失败错误
        if (!req.result) {
            // 深度相机硬件异常
            if (req.depthCamera === 2) store.commit('ADD_DEVICE_ERROR', 3)
            // 鱼眼相机异常
            if (req.fisheyeCamera === 2) store.commit('ADD_DEVICE_ERROR', 2)
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 深度相机状态
     *
     * @param {grpc.ServerUnaryCall<DepthCameraStatusReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    depthCameraStatus(
        call: grpc.ServerUnaryCall<DepthCameraStatusReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 深度相机状态上报', JSON.stringify(req))
        // 深度相机硬件状态
        if (req.depthCamera === 1) {
            store.commit('REMOVE_DEVICE_ERROR', 3)
        } else if (req.depthCamera === 2) {
            store.commit('ADD_DEVICE_ERROR', 3)
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 鱼眼相机状态
     *
     * @param {grpc.ServerUnaryCall<ColorCameraStatusReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    FisheyeCameraStatus(
        call: grpc.ServerUnaryCall<FisheyeCameraStatusReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        // window.logger.info('[algorithm-fisheyeCamera]: 鱼眼相机状态上报', JSON.stringify(req))
        // // 鱼眼相机状态
        // if (req.fisheyeCamera === 1) {
        //     store.commit('REMOVE_DEVICE_ERROR', 2)
        // } else if (req.fisheyeCamera === 2) {
        //     store.commit('ADD_DEVICE_ERROR', 2)
        // }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 测量人员状态上报
     * @param call
     * @param callback
     */
    surveyorStatus(call: grpc.ServerUnaryCall<SurveyorStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-fisheyeCamera]: 测量人员状态上报', JSON.stringify(req))
        // 上报
        EventBus.$emit('EventAction', 'SurveyorStatus', req.surveyorStatus)
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 测量过程中异常状态上报
     *
     * @param {grpc.ServerUnaryCall<ErrorStatusReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    errorStatus(call: grpc.ServerUnaryCall<ErrorStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 测量过程中异常状态上报', JSON.stringify(req))
        if (req.errorStatus === 1) {
            store.commit('ADD_DEVICE_ERROR', 3)
        } else if (req.errorStatus === 2) {
            // TODO 鱼眼相机异常
        }
        // 上报
        EventBus.$emit('EventAction', 'ScanError', req)
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * Apose检测结果
     *
     * @param {grpc.ServerUnaryCall<AposeDetectResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    aposeDetectResult(
        call: grpc.ServerUnaryCall<AposeDetectResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: Apose检测结果', JSON.stringify(req))
        // 触发pose检测结果上报事件
        EventBus.$emit('EventAction', 'AposeDetectResult', req)
        callback(null, new CommonRes())
    },

    /**
     * Ipose检测结果
     *
     * @param {grpc.ServerUnaryCall<IposeDetectResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    iposeDetectResult(
        call: grpc.ServerUnaryCall<IposeDetectResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: Ipose检测结果', JSON.stringify(req))
        // 触发pose检测结果上报事件
        EventBus.$emit('EventAction', 'IposeDetectResult', req)
        callback(null, new CommonRes())
    },

    /**
     * 体态、围度扫描结果
     *
     * @param {grpc.ServerUnaryCall<ScanResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    scanResult(call: grpc.ServerUnaryCall<ScanResultReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 体态、围度扫描结果', JSON.stringify(req))
        // 触发体态测量结果上报事件
        EventBus.$emit('EventAction', 'ScanResult', req)
        if (req.detectResult && req.scanType === 1) {
            // 修改体围测量信息
            let measureInfo = {
                girth: {
                    status: true
                }
            }
            // 三项合一 体围出体态
            if (store.getters.settingInfo.combineMeasureEnable && store.getters.settingInfo.triMode) {
                const devicePre = store.getters.deviceInfo.deviceId.substring(0, 2);
                const isVE335 = ['38', '39'].includes(devicePre);
                
                 Object.assign(measureInfo, {
                    shape: { status: true },
                    spine: { status: isVE335 || store.getters.deviceInfo.spineReportEnabled }
                });
            }
            
            store.dispatch('changeMeasureInfo', measureInfo)
        } else if (req.detectResult && req.scanType === 2) {
            // 修改体态测量信息

            const devicePre = store.getters.deviceInfo.deviceId.substring(0, 2)
            const isVE335 = ['38', '39'].includes(devicePre)
            const measureInfo = {
                shape: { status: true },
                spine: { status: isVE335 || store.getters.deviceInfo.spineReportEnabled }
            }
            store.dispatch('changeMeasureInfo', measureInfo)
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 请求转盘旋转 - 给硬件发送开始旋转命令
     *
     * @param {grpc.ServerUnaryCall<CommonReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    startTable(call: grpc.ServerUnaryCall<CommonReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 算法请求转盘旋转', JSON.stringify(req))
        // 触发转盘旋转事件
        EventBus.$emit('EventAction', 'StartTable')
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 测量旋转一半 - 播放提醒语音
     *
     * @param {grpc.ServerUnaryCall<CommonReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    rotateHalf(call: grpc.ServerUnaryCall<CommonReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 上报旋转了半圈', JSON.stringify(req))
        // 触发测量旋转一半上报事件
        EventBus.$emit('EventAction', 'RotateHalf')
        // 回调响应
        callback(null, new CommonRes())
    },
    /**
     * 检测客户端状态
     *
     * @param {grpc.ServerUnaryCall<CommonReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    startDetectClientStatus(call: grpc.ServerUnaryCall<CommonReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        // const req = call.request.toObject()
        // window.logger.info('[algorithm-service]: 检测客户端状态')

        // 回调响应
        callback(null, new CommonRes())
    },
    /**
     * 手势检测结果
     *
     * @param {grpc.ServerUnaryCall<GestureDetectResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    gestureDetectResult(
        call: grpc.ServerUnaryCall<GestureDetectResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[gesture-service]: 手势检测结果上报', JSON.stringify(req))
        if (req.detectResult !== 0) {
            // 触发全局事件
            EventBus.$emit('EventAction', 'GestureResult', req.detectResult)
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 站人检测结果
     *
     * @param {grpc.ServerUnaryCall<PersonDetectResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    personDetectResult(
        call: grpc.ServerUnaryCall<PersonDetectResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[gesture-service]: 站人检测结果上报', JSON.stringify(req))
        if (req.detectResult !== 0) {
            // 触发全局事件
            EventBus.$emit('EventAction', 'PersonDetectResult', req.detectResult)
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 手势Ipose检测结果
     *
     * @param {grpc.ServerUnaryCall<GestureIposeResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    gestureIposeResult(
        call: grpc.ServerUnaryCall<GestureIposeResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[gesture-service]: 手势Ipose检测结果', JSON.stringify(req))
        if (req.detectResult !== 0) {
            // 触发全局事件
            EventBus.$emit('EventAction', 'GestureIposeResult', req.detectResult)
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 光照检测结果
     *
     * @param {grpc.ServerUnaryCall<AmbientLightResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    ambientLightResult(
        call: grpc.ServerUnaryCall<AmbientLightResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        if (req.detectResult !== 0) {
            // 设置光照等级
            store.commit('CHANGE_LIGHT_LEVEL', req.detectResult)
            // 光照差 添加到设备异常中
            if (req.detectResult === 3) {
                store.commit('ADD_DEVICE_ERROR', 1)
                // 光照正常 移除
            } else if (req.detectResult === 1) {
                store.commit('REMOVE_DEVICE_ERROR', 1)
            }
        }

        window.logger.info('[ambient-light]: 光照检测结果', JSON.stringify(req))
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 肩部检测结果
     *
     * @param {grpc.ServerUnaryCall<ShoulderDetectResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    shoulderDetectResult(
        call: grpc.ServerUnaryCall<ShoulderDetectResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 肩部检测结果上报', JSON.stringify(req))
        const resData = {
            detectResult: req.detectResult,
            detectType: req.detectType,
            angle: req.angle
        }
        // 触发全局事件
        EventBus.$emit('EventAction', 'shoulderDetectResult', resData)

        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 身高测量检测结果
     * @param call
     * @param callback
     */
    heightMeasurementResult(
        call: grpc.ServerUnaryCall<HeightMeasurementReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 身高测量检测结果', JSON.stringify(req))
        // 触发全局事件
        EventBus.$emit('EventAction', 'heightMeasurementResult', req)

        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 身高检测结果
     * @param call
     * @param callback
     */
    startShoulderLegalityResult(
        call: grpc.ServerUnaryCall<StartShoulderLegalityResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 肩部检测结果上报', JSON.stringify(req))
        // 触发全局事件
        EventBus.$emit('EventAction', 'ShoulderLegalityResult', req.detectResult)

        // 回调响应
        callback(null, new CommonRes())
    },
    // 算法二维码识别结果
    qRCodeScanResult(
        call: grpc.ServerUnaryCall<QRCodeScanResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 二维码识别结果上报', JSON.stringify(req))
        // 触发全局事件
        EventBus.$emit('EventAction', 'QRCodeScanResult', req.data)

        // 回调响应
        callback(null, new CommonRes())
    },
    // 开始上报视频流
    startStream(call: grpc.ServerUnaryCall<CommonReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 开始上报视频流', JSON.stringify(req))
        // 触发全局事件
        EventBus.$emit('EventAction', 'StartedStream')

        // 回调响应
        callback(null, new CommonRes())
    },

    // 体围角度上报
    aposeAngleResult(call: grpc.ServerUnaryCall<AposeAngleReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[algorithm-service]: 体围引导手臂张开角度', JSON.stringify(req))
        // 触发全局事件
        EventBus.$emit('EventAction', 'ArmOpeningAngle', req)

        // 回调响应
        callback(null, new CommonRes())
    }
}
