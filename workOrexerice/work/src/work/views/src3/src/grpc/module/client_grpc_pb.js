// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var client_pb = require('./client_pb.js')

function serialize_client_AlgServiceStatusReq(arg) {
    if (!(arg instanceof client_pb.AlgServiceStatusReq)) {
        throw new Error('Expected argument of type client.AlgServiceStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_AlgServiceStatusReq(buffer_arg) {
    return client_pb.AlgServiceStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_AmbientLightResultReq(arg) {
    if (!(arg instanceof client_pb.AmbientLightResultReq)) {
        throw new Error('Expected argument of type client.AmbientLightResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_AmbientLightResultReq(buffer_arg) {
    return client_pb.AmbientLightResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_AposeAngleReq(arg) {
    if (!(arg instanceof client_pb.AposeAngleReq)) {
        throw new Error('Expected argument of type client.AposeAngleReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_AposeAngleReq(buffer_arg) {
    return client_pb.AposeAngleReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_AposeDetectResultReq(arg) {
    if (!(arg instanceof client_pb.AposeDetectResultReq)) {
        throw new Error('Expected argument of type client.AposeDetectResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_AposeDetectResultReq(buffer_arg) {
    return client_pb.AposeDetectResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_BacklightResultReq(arg) {
    if (!(arg instanceof client_pb.BacklightResultReq)) {
        throw new Error('Expected argument of type client.BacklightResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_BacklightResultReq(buffer_arg) {
    return client_pb.BacklightResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_BodyMeasureResultReq(arg) {
    if (!(arg instanceof client_pb.BodyMeasureResultReq)) {
        throw new Error('Expected argument of type client.BodyMeasureResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_BodyMeasureResultReq(buffer_arg) {
    return client_pb.BodyMeasureResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ButtonEventReq(arg) {
    if (!(arg instanceof client_pb.ButtonEventReq)) {
        throw new Error('Expected argument of type client.ButtonEventReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ButtonEventReq(buffer_arg) {
    return client_pb.ButtonEventReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_CheckSelfReq(arg) {
    if (!(arg instanceof client_pb.CheckSelfReq)) {
        throw new Error('Expected argument of type client.CheckSelfReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_CheckSelfReq(buffer_arg) {
    return client_pb.CheckSelfReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_CommonReq(arg) {
    if (!(arg instanceof client_pb.CommonReq)) {
        throw new Error('Expected argument of type client.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_CommonReq(buffer_arg) {
    return client_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_CommonRes(arg) {
    if (!(arg instanceof client_pb.CommonRes)) {
        throw new Error('Expected argument of type client.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_CommonRes(buffer_arg) {
    return client_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_DepthCameraStatusReq(arg) {
    if (!(arg instanceof client_pb.DepthCameraStatusReq)) {
        throw new Error('Expected argument of type client.DepthCameraStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_DepthCameraStatusReq(buffer_arg) {
    return client_pb.DepthCameraStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ErrorStatusReq(arg) {
    if (!(arg instanceof client_pb.ErrorStatusReq)) {
        throw new Error('Expected argument of type client.ErrorStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ErrorStatusReq(buffer_arg) {
    return client_pb.ErrorStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ExternalReq(arg) {
    if (!(arg instanceof client_pb.ExternalReq)) {
        throw new Error('Expected argument of type client.ExternalReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ExternalReq(buffer_arg) {
    return client_pb.ExternalReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_FisheyeCameraStatusReq(arg) {
    if (!(arg instanceof client_pb.FisheyeCameraStatusReq)) {
        throw new Error('Expected argument of type client.FisheyeCameraStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_FisheyeCameraStatusReq(buffer_arg) {
    return client_pb.FisheyeCameraStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_GestureDetectResultReq(arg) {
    if (!(arg instanceof client_pb.GestureDetectResultReq)) {
        throw new Error('Expected argument of type client.GestureDetectResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_GestureDetectResultReq(buffer_arg) {
    return client_pb.GestureDetectResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_GestureIposeResultReq(arg) {
    if (!(arg instanceof client_pb.GestureIposeResultReq)) {
        throw new Error('Expected argument of type client.GestureIposeResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_GestureIposeResultReq(buffer_arg) {
    return client_pb.GestureIposeResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_HardwareSelfCheckReq(arg) {
    if (!(arg instanceof client_pb.HardwareSelfCheckReq)) {
        throw new Error('Expected argument of type client.HardwareSelfCheckReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_HardwareSelfCheckReq(buffer_arg) {
    return client_pb.HardwareSelfCheckReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_HardwareServiceStatusReq(arg) {
    if (!(arg instanceof client_pb.HardwareServiceStatusReq)) {
        throw new Error('Expected argument of type client.HardwareServiceStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_HardwareServiceStatusReq(buffer_arg) {
    return client_pb.HardwareServiceStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_HardwareStatusReq(arg) {
    if (!(arg instanceof client_pb.HardwareStatusReq)) {
        throw new Error('Expected argument of type client.HardwareStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_HardwareStatusReq(buffer_arg) {
    return client_pb.HardwareStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_HeightMeasurementReq(arg) {
    if (!(arg instanceof client_pb.HeightMeasurementReq)) {
        throw new Error('Expected argument of type client.HeightMeasurementReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_HeightMeasurementReq(buffer_arg) {
    return client_pb.HeightMeasurementReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_IposeDetectResultReq(arg) {
    if (!(arg instanceof client_pb.IposeDetectResultReq)) {
        throw new Error('Expected argument of type client.IposeDetectResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_IposeDetectResultReq(buffer_arg) {
    return client_pb.IposeDetectResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_NetSpeedReq(arg) {
    if (!(arg instanceof client_pb.NetSpeedReq)) {
        throw new Error('Expected argument of type client.NetSpeedReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_NetSpeedReq(buffer_arg) {
    return client_pb.NetSpeedReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_NetworkSpeedReq(arg) {
    if (!(arg instanceof client_pb.NetworkSpeedReq)) {
        throw new Error('Expected argument of type client.NetworkSpeedReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_NetworkSpeedReq(buffer_arg) {
    return client_pb.NetworkSpeedReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_NewVersionReq(arg) {
    if (!(arg instanceof client_pb.NewVersionReq)) {
        throw new Error('Expected argument of type client.NewVersionReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_NewVersionReq(buffer_arg) {
    return client_pb.NewVersionReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_NotifyStateReq(arg) {
    if (!(arg instanceof client_pb.NotifyStateReq)) {
        throw new Error('Expected argument of type client.NotifyStateReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_NotifyStateReq(buffer_arg) {
    return client_pb.NotifyStateReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_PersonDetectResultReq(arg) {
    if (!(arg instanceof client_pb.PersonDetectResultReq)) {
        throw new Error('Expected argument of type client.PersonDetectResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_PersonDetectResultReq(buffer_arg) {
    return client_pb.PersonDetectResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_PrintResultReq(arg) {
    if (!(arg instanceof client_pb.PrintResultReq)) {
        throw new Error('Expected argument of type client.PrintResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_PrintResultReq(buffer_arg) {
    return client_pb.PrintResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_QRCodeScanResultReq(arg) {
    if (!(arg instanceof client_pb.QRCodeScanResultReq)) {
        throw new Error('Expected argument of type client.QRCodeScanResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_QRCodeScanResultReq(buffer_arg) {
    return client_pb.QRCodeScanResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ScanResultReq(arg) {
    if (!(arg instanceof client_pb.ScanResultReq)) {
        throw new Error('Expected argument of type client.ScanResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ScanResultReq(buffer_arg) {
    return client_pb.ScanResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ScreenStatusReq(arg) {
    if (!(arg instanceof client_pb.ScreenStatusReq)) {
        throw new Error('Expected argument of type client.ScreenStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ScreenStatusReq(buffer_arg) {
    return client_pb.ScreenStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ShoulderDetectResultReq(arg) {
    if (!(arg instanceof client_pb.ShoulderDetectResultReq)) {
        throw new Error('Expected argument of type client.ShoulderDetectResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ShoulderDetectResultReq(buffer_arg) {
    return client_pb.ShoulderDetectResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_StandStateReq(arg) {
    if (!(arg instanceof client_pb.StandStateReq)) {
        throw new Error('Expected argument of type client.StandStateReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_StandStateReq(buffer_arg) {
    return client_pb.StandStateReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_StartShoulderLegalityResultReq(arg) {
    if (!(arg instanceof client_pb.StartShoulderLegalityResultReq)) {
        throw new Error('Expected argument of type client.StartShoulderLegalityResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_StartShoulderLegalityResultReq(buffer_arg) {
    return client_pb.StartShoulderLegalityResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_SurveyorStatusReq(arg) {
    if (!(arg instanceof client_pb.SurveyorStatusReq)) {
        throw new Error('Expected argument of type client.SurveyorStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_SurveyorStatusReq(buffer_arg) {
    return client_pb.SurveyorStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_TableBodyMeasureResultReq(arg) {
    if (!(arg instanceof client_pb.TableBodyMeasureResultReq)) {
        throw new Error('Expected argument of type client.TableBodyMeasureResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_TableBodyMeasureResultReq(buffer_arg) {
    return client_pb.TableBodyMeasureResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_ThirdBindResultReq(arg) {
    if (!(arg instanceof client_pb.ThirdBindResultReq)) {
        throw new Error('Expected argument of type client.ThirdBindResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_ThirdBindResultReq(buffer_arg) {
    return client_pb.ThirdBindResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_WeightMeasureResultReq(arg) {
    if (!(arg instanceof client_pb.WeightMeasureResultReq)) {
        throw new Error('Expected argument of type client.WeightMeasureResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_WeightMeasureResultReq(buffer_arg) {
    return client_pb.WeightMeasureResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_WifiListReq(arg) {
    if (!(arg instanceof client_pb.WifiListReq)) {
        throw new Error('Expected argument of type client.WifiListReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_WifiListReq(buffer_arg) {
    return client_pb.WifiListReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_WifiSetStatusReq(arg) {
    if (!(arg instanceof client_pb.WifiSetStatusReq)) {
        throw new Error('Expected argument of type client.WifiSetStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_WifiSetStatusReq(buffer_arg) {
    return client_pb.WifiSetStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_WifiStatusReq(arg) {
    if (!(arg instanceof client_pb.WifiStatusReq)) {
        throw new Error('Expected argument of type client.WifiStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_WifiStatusReq(buffer_arg) {
    return client_pb.WifiStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_client_WiredNetworkStatusReq(arg) {
    if (!(arg instanceof client_pb.WiredNetworkStatusReq)) {
        throw new Error('Expected argument of type client.WiredNetworkStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_client_WiredNetworkStatusReq(buffer_arg) {
    return client_pb.WiredNetworkStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

// ------------ 控制服务 ------------ //
//
var ControlService = (exports.ControlService = {
    // 设备外设状态 - 打印机、USB
    external: {
        path: '/client.Control/External',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ExternalReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ExternalReq,
        requestDeserialize: deserialize_client_ExternalReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 网速情况 - 用于菜单顶部显示
    networkSpeed: {
        path: '/client.Control/NetworkSpeed',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.NetworkSpeedReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_NetworkSpeedReq,
        requestDeserialize: deserialize_client_NetworkSpeedReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 上传速度上报
    upLoadNetSpeed: {
        path: '/client.Control/UpLoadNetSpeed',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.NetSpeedReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_NetSpeedReq,
        requestDeserialize: deserialize_client_NetSpeedReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 下载速度上报
    downLoadNetSpeed: {
        path: '/client.Control/DownLoadNetSpeed',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.NetSpeedReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_NetSpeedReq,
        requestDeserialize: deserialize_client_NetSpeedReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 打印结果上报
    printResult: {
        path: '/client.Control/PrintResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.PrintResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_PrintResultReq,
        requestDeserialize: deserialize_client_PrintResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 第三方扫码或者滴卡的状态响应
    thirdBindResult: {
        path: '/client.Control/ThirdBindResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ThirdBindResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ThirdBindResultReq,
        requestDeserialize: deserialize_client_ThirdBindResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    }
})

exports.ControlClient = grpc.makeGenericClientConstructor(ControlService, 'Control')
// ------------ 更新服务 ------------ //
//
var UpdateService = (exports.UpdateService = {
    // 新版本推送
    newVersion: {
        path: '/client.Update/NewVersion',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.NewVersionReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_NewVersionReq,
        requestDeserialize: deserialize_client_NewVersionReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 更新状态 - 更新结果&更新进度
    notifyState: {
        path: '/client.Update/NotifyState',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.NotifyStateReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_NotifyStateReq,
        requestDeserialize: deserialize_client_NotifyStateReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    }
})

exports.UpdateClient = grpc.makeGenericClientConstructor(UpdateService, 'Update')
// ------------ 更新服务 ------------ //
//
// ------------ 硬件服务 ------------ //
//
var HardwareService = (exports.HardwareService = {
    // 硬件服务状态
    hardwareServiceStatus: {
        path: '/client.Hardware/HardwareServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.HardwareServiceStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_HardwareServiceStatusReq,
        requestDeserialize: deserialize_client_HardwareServiceStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 屏幕状态上报
    screenStatus: {
        path: '/client.Hardware/ScreenStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ScreenStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ScreenStatusReq,
        requestDeserialize: deserialize_client_ScreenStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 硬件自检响应
    hardwareCheckSelf: {
        path: '/client.Hardware/HardwareCheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.HardwareSelfCheckReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_HardwareSelfCheckReq,
        requestDeserialize: deserialize_client_HardwareSelfCheckReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 体重测量结果上报
    weightMeasureResult: {
        path: '/client.Hardware/WeightMeasureResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.WeightMeasureResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_WeightMeasureResultReq,
        requestDeserialize: deserialize_client_WeightMeasureResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 体成分测量结果上报
    bodyMeasureResult: {
        path: '/client.Hardware/BodyMeasureResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.BodyMeasureResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_BodyMeasureResultReq,
        requestDeserialize: deserialize_client_BodyMeasureResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 转台电阻值上报
    tableBodyMeasureResult: {
        path: '/client.Hardware/TableBodyMeasureResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.TableBodyMeasureResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_TableBodyMeasureResultReq,
        requestDeserialize: deserialize_client_TableBodyMeasureResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 站人状态
    standState: {
        path: '/client.Hardware/StandState',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.StandStateReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_StandStateReq,
        requestDeserialize: deserialize_client_StandStateReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 亮度上报
    backlightResult: {
        path: '/client.Hardware/BacklightResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.BacklightResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_BacklightResultReq,
        requestDeserialize: deserialize_client_BacklightResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 转台停止
    tableStop: {
        path: '/client.Hardware/TableStop',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.CommonReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_CommonReq,
        requestDeserialize: deserialize_client_CommonReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 按钮事件上报
    buttonEvent: {
        path: '/client.Hardware/ButtonEvent',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ButtonEventReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ButtonEventReq,
        requestDeserialize: deserialize_client_ButtonEventReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 硬件状态上报
    hardwareStatus: {
        path: '/client.Hardware/HardwareStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.HardwareStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_HardwareStatusReq,
        requestDeserialize: deserialize_client_HardwareStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    }
})

exports.HardwareClient = grpc.makeGenericClientConstructor(HardwareService, 'Hardware')
// ------------ 硬件服务 ------------ //
//
// ------------ 算法服务 ------------ //
var AlgorithmService = (exports.AlgorithmService = {
    // ------------ 通用功能 ------------ //
    // 服务状态 - 上报后再发起其他请求
    serviceStatus: {
        path: '/client.Algorithm/ServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.AlgServiceStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_AlgServiceStatusReq,
        requestDeserialize: deserialize_client_AlgServiceStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 自检结果
    checkSelf: {
        path: '/client.Algorithm/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.CheckSelfReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_CheckSelfReq,
        requestDeserialize: deserialize_client_CheckSelfReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 深度相机状态
    depthCameraStatus: {
        path: '/client.Algorithm/DepthCameraStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.DepthCameraStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_DepthCameraStatusReq,
        requestDeserialize: deserialize_client_DepthCameraStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 鱼眼相机状态
    fisheyeCameraStatus: {
        path: '/client.Algorithm/FisheyeCameraStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.FisheyeCameraStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_FisheyeCameraStatusReq,
        requestDeserialize: deserialize_client_FisheyeCameraStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 测量人员状态
    surveyorStatus: {
        path: '/client.Algorithm/SurveyorStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.SurveyorStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_SurveyorStatusReq,
        requestDeserialize: deserialize_client_SurveyorStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 测量过程中异常状态
    errorStatus: {
        path: '/client.Algorithm/ErrorStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ErrorStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ErrorStatusReq,
        requestDeserialize: deserialize_client_ErrorStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // ------------ 扫描功能 ------------ //
    // Apose检测结果
    aposeDetectResult: {
        path: '/client.Algorithm/AposeDetectResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.AposeDetectResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_AposeDetectResultReq,
        requestDeserialize: deserialize_client_AposeDetectResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // Ipose检测结果
    iposeDetectResult: {
        path: '/client.Algorithm/IposeDetectResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.IposeDetectResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_IposeDetectResultReq,
        requestDeserialize: deserialize_client_IposeDetectResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 体态、围度扫描结果
    scanResult: {
        path: '/client.Algorithm/ScanResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ScanResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ScanResultReq,
        requestDeserialize: deserialize_client_ScanResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 算法主动请求转盘旋转，使用在倒计时321之后 - 上报后发起转台旋转
    startTable: {
        path: '/client.Algorithm/StartTable',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.CommonReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_CommonReq,
        requestDeserialize: deserialize_client_CommonReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 上报旋转了半圈
    rotateHalf: {
        path: '/client.Algorithm/RotateHalf',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.CommonReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_CommonReq,
        requestDeserialize: deserialize_client_CommonReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 检测客户端状态
    startDetectClientStatus: {
        path: '/client.Algorithm/StartDetectClientStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.CommonReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_CommonReq,
        requestDeserialize: deserialize_client_CommonReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // ------------ 手势功能 ------------ //
    // 手势检测结果
    gestureDetectResult: {
        path: '/client.Algorithm/GestureDetectResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.GestureDetectResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_GestureDetectResultReq,
        requestDeserialize: deserialize_client_GestureDetectResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 站人检测结果
    personDetectResult: {
        path: '/client.Algorithm/PersonDetectResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.PersonDetectResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_PersonDetectResultReq,
        requestDeserialize: deserialize_client_PersonDetectResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 手势Ipose检测结果
    gestureIposeResult: {
        path: '/client.Algorithm/GestureIposeResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.GestureIposeResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_GestureIposeResultReq,
        requestDeserialize: deserialize_client_GestureIposeResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 光照检测结果
    ambientLightResult: {
        path: '/client.Algorithm/AmbientLightResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.AmbientLightResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_AmbientLightResultReq,
        requestDeserialize: deserialize_client_AmbientLightResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // ------------ 肩部功能 ------------ //
    // 肩部检测结果
    shoulderDetectResult: {
        path: '/client.Algorithm/ShoulderDetectResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.ShoulderDetectResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_ShoulderDetectResultReq,
        requestDeserialize: deserialize_client_ShoulderDetectResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 肩部姿势合法性检测结果
    startShoulderLegalityResult: {
        path: '/client.Algorithm/StartShoulderLegalityResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.StartShoulderLegalityResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_StartShoulderLegalityResultReq,
        requestDeserialize: deserialize_client_StartShoulderLegalityResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 二维码扫描结果
    qRCodeScanResult: {
        path: '/client.Algorithm/QRCodeScanResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.QRCodeScanResultReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_QRCodeScanResultReq,
        requestDeserialize: deserialize_client_QRCodeScanResultReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 开始吧推送视频流
    startStream: {
        path: '/client.Algorithm/StartStream',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.CommonReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_CommonReq,
        requestDeserialize: deserialize_client_CommonReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 上报身高测量结果
    heightMeasurementResult: {
        path: '/client.Algorithm/HeightMeasurementResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.HeightMeasurementReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_HeightMeasurementReq,
        requestDeserialize: deserialize_client_HeightMeasurementReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // 上报Apose角度结果
    aposeAngleResult: {
        path: '/client.Algorithm/AposeAngleResult',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.AposeAngleReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_AposeAngleReq,
        requestDeserialize: deserialize_client_AposeAngleReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    }
})

exports.AlgorithmClient = grpc.makeGenericClientConstructor(AlgorithmService, 'Algorithm')
// ------------- 网络状态 开始 ---------- //
//
var NetworkService = (exports.NetworkService = {
    // 有线网连接状态上报
    wiredNetworkStatus: {
        path: '/client.Network/WiredNetworkStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.WiredNetworkStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_WiredNetworkStatusReq,
        requestDeserialize: deserialize_client_WiredNetworkStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // Wifi连接状态上报
    wifiStatus: {
        path: '/client.Network/WifiStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.WifiStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_WifiStatusReq,
        requestDeserialize: deserialize_client_WifiStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // Wifi扫描列表上报
    wifiList: {
        path: '/client.Network/WifiList',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.WifiListReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_WifiListReq,
        requestDeserialize: deserialize_client_WifiListReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    },
    // Wifi设置结果上报
    wifiSetStatus: {
        path: '/client.Network/WifiSetStatus',
        requestStream: false,
        responseStream: false,
        requestType: client_pb.WifiSetStatusReq,
        responseType: client_pb.CommonRes,
        requestSerialize: serialize_client_WifiSetStatusReq,
        requestDeserialize: deserialize_client_WifiSetStatusReq,
        responseSerialize: serialize_client_CommonRes,
        responseDeserialize: deserialize_client_CommonRes
    }
})

exports.NetworkClient = grpc.makeGenericClientConstructor(NetworkService, 'Network')
