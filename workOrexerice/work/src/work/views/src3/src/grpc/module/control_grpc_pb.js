// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var control_pb = require('./control_pb.js')

function serialize_control_BalanceResultReq(arg) {
    if (!(arg instanceof control_pb.BalanceResultReq)) {
        throw new Error('Expected argument of type control.BalanceResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_BalanceResultReq(buffer_arg) {
    return control_pb.BalanceResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_BodyResultReq(arg) {
    if (!(arg instanceof control_pb.BodyResultReq)) {
        throw new Error('Expected argument of type control.BodyResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_BodyResultReq(buffer_arg) {
    return control_pb.BodyResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_ChangeTimeZoneReq(arg) {
    if (!(arg instanceof control_pb.ChangeTimeZoneReq)) {
        throw new Error('Expected argument of type control.ChangeTimeZoneReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_ChangeTimeZoneReq(buffer_arg) {
    return control_pb.ChangeTimeZoneReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_ChangeVolumeReq(arg) {
    if (!(arg instanceof control_pb.ChangeVolumeReq)) {
        throw new Error('Expected argument of type control.ChangeVolumeReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_ChangeVolumeReq(buffer_arg) {
    return control_pb.ChangeVolumeReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_ChangeVolumeRes(arg) {
    if (!(arg instanceof control_pb.ChangeVolumeRes)) {
        throw new Error('Expected argument of type control.ChangeVolumeRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_ChangeVolumeRes(buffer_arg) {
    return control_pb.ChangeVolumeRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_CheckSelfRes(arg) {
    if (!(arg instanceof control_pb.CheckSelfRes)) {
        throw new Error('Expected argument of type control.CheckSelfRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_CheckSelfRes(buffer_arg) {
    return control_pb.CheckSelfRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_CommonReq(arg) {
    if (!(arg instanceof control_pb.CommonReq)) {
        throw new Error('Expected argument of type control.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_CommonReq(buffer_arg) {
    return control_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_CommonRes(arg) {
    if (!(arg instanceof control_pb.CommonRes)) {
        throw new Error('Expected argument of type control.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_CommonRes(buffer_arg) {
    return control_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_DeviceInfoRes(arg) {
    if (!(arg instanceof control_pb.DeviceInfoRes)) {
        throw new Error('Expected argument of type control.DeviceInfoRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_DeviceInfoRes(buffer_arg) {
    return control_pb.DeviceInfoRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_EvalWeightResultReq(arg) {
    if (!(arg instanceof control_pb.EvalWeightResultReq)) {
        throw new Error('Expected argument of type control.EvalWeightResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_EvalWeightResultReq(buffer_arg) {
    return control_pb.EvalWeightResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_PrintReportReq(arg) {
    if (!(arg instanceof control_pb.PrintReportReq)) {
        throw new Error('Expected argument of type control.PrintReportReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_PrintReportReq(buffer_arg) {
    return control_pb.PrintReportReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_RestartScanSrvRes(arg) {
    if (!(arg instanceof control_pb.RestartScanSrvRes)) {
        throw new Error('Expected argument of type control.RestartScanSrvRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_RestartScanSrvRes(buffer_arg) {
    return control_pb.RestartScanSrvRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_ScanResultReq(arg) {
    if (!(arg instanceof control_pb.ScanResultReq)) {
        throw new Error('Expected argument of type control.ScanResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_ScanResultReq(buffer_arg) {
    return control_pb.ScanResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_ShoulderResultReq(arg) {
    if (!(arg instanceof control_pb.ShoulderResultReq)) {
        throw new Error('Expected argument of type control.ShoulderResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_ShoulderResultReq(buffer_arg) {
    return control_pb.ShoulderResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_TaskNumRes(arg) {
    if (!(arg instanceof control_pb.TaskNumRes)) {
        throw new Error('Expected argument of type control.TaskNumRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_TaskNumRes(buffer_arg) {
    return control_pb.TaskNumRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_ThirdBindRes(arg) {
    if (!(arg instanceof control_pb.ThirdBindRes)) {
        throw new Error('Expected argument of type control.ThirdBindRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_ThirdBindRes(buffer_arg) {
    return control_pb.ThirdBindRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_TurnTableResistanceReq(arg) {
    if (!(arg instanceof control_pb.TurnTableResistanceReq)) {
        throw new Error('Expected argument of type control.TurnTableResistanceReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_TurnTableResistanceReq(buffer_arg) {
    return control_pb.TurnTableResistanceReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_control_WeightResultReq(arg) {
    if (!(arg instanceof control_pb.WeightResultReq)) {
        throw new Error('Expected argument of type control.WeightResultReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_control_WeightResultReq(buffer_arg) {
    return control_pb.WeightResultReq.deserializeBinary(new Uint8Array(buffer_arg))
}

// 系统设置相关
var SettingsService = (exports.SettingsService = {
    // 获取设备ID和设备的音量
    deviceInfo: {
        path: '/control.Settings/DeviceInfo',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.DeviceInfoRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_DeviceInfoRes,
        responseDeserialize: deserialize_control_DeviceInfoRes
    },
    // 打印报告
    printReport: {
        path: '/control.Settings/PrintReport',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.PrintReportReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_PrintReportReq,
        requestDeserialize: deserialize_control_PrintReportReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 设备关机
    deviceClose: {
        path: '/control.Settings/DeviceClose',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 关机前--推送上传任务数量
    taskNum: {
        path: '/control.Settings/TaskNum',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.TaskNumRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_TaskNumRes,
        responseDeserialize: deserialize_control_TaskNumRes
    },
    // 上传速度
    upLoadNetSpeed: {
        path: '/control.Settings/UpLoadNetSpeed',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 下载速度
    downLoadNetSpeed: {
        path: '/control.Settings/DownLoadNetSpeed',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 音量调整
    changeVolume: {
        path: '/control.Settings/ChangeVolume',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.ChangeVolumeReq,
        responseType: control_pb.ChangeVolumeRes,
        requestSerialize: serialize_control_ChangeVolumeReq,
        requestDeserialize: deserialize_control_ChangeVolumeReq,
        responseSerialize: serialize_control_ChangeVolumeRes,
        responseDeserialize: deserialize_control_ChangeVolumeRes
    },
    // 深度相机掉线重启
    restartScanSrv: {
        path: '/control.Settings/RestartScanSrv',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.RestartScanSrvRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_RestartScanSrvRes,
        responseDeserialize: deserialize_control_RestartScanSrvRes
    },
    // 自检时推送-设备注册
    checkSelf: {
        path: '/control.Settings/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.CheckSelfRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_CheckSelfRes,
        responseDeserialize: deserialize_control_CheckSelfRes
    },
    // 获取第三方对接信息
    thirdBind: {
        path: '/control.Settings/ThirdBind',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.CommonReq,
        responseType: control_pb.ThirdBindRes,
        requestSerialize: serialize_control_CommonReq,
        requestDeserialize: deserialize_control_CommonReq,
        responseSerialize: serialize_control_ThirdBindRes,
        responseDeserialize: deserialize_control_ThirdBindRes
    },
    // 设置时区
    changeTimeZone: {
        path: '/control.Settings/ChangeTimeZone',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.ChangeTimeZoneReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_ChangeTimeZoneReq,
        requestDeserialize: deserialize_control_ChangeTimeZoneReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    }
})

exports.SettingsClient = grpc.makeGenericClientConstructor(SettingsService, 'Settings')
// 测量相关
var MeasureService = (exports.MeasureService = {
    // 上报体重信息
    weightResult: {
        path: '/control.Measure/WeightResult',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.WeightResultReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_WeightResultReq,
        requestDeserialize: deserialize_control_WeightResultReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 体成分测量结果-电阻等信息
    bodyResult: {
        path: '/control.Measure/BodyResult',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.BodyResultReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_BodyResultReq,
        requestDeserialize: deserialize_control_BodyResultReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 扫描测量结果 - 体围、体态
    scanResult: {
        path: '/control.Measure/ScanResult',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.ScanResultReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_ScanResultReq,
        requestDeserialize: deserialize_control_ScanResultReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 肩关节动态体态数据
    shoulderResult: {
        path: '/control.Measure/ShoulderResult',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.ShoulderResultReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_ShoulderResultReq,
        requestDeserialize: deserialize_control_ShoulderResultReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 悠健四电级转台电阻抗数据
    turnTableResistance: {
        path: '/control.Measure/TurnTableResistance',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.TurnTableResistanceReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_TurnTableResistanceReq,
        requestDeserialize: deserialize_control_TurnTableResistanceReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 体态测量时上报体重信息
    evalWeightResult: {
        path: '/control.Measure/EvalWeightResult',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.EvalWeightResultReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_EvalWeightResultReq,
        requestDeserialize: deserialize_control_EvalWeightResultReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    },
    // 平衡项目数据
    balanceResult: {
        path: '/control.Measure/BalanceResult',
        requestStream: false,
        responseStream: false,
        requestType: control_pb.BalanceResultReq,
        responseType: control_pb.CommonRes,
        requestSerialize: serialize_control_BalanceResultReq,
        requestDeserialize: deserialize_control_BalanceResultReq,
        responseSerialize: serialize_control_CommonRes,
        responseDeserialize: deserialize_control_CommonRes
    }
})

exports.MeasureClient = grpc.makeGenericClientConstructor(MeasureService, 'Measure')
