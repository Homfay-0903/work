// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var notify_status_pb = require('./notify_status_pb.js')

function serialize_notifyStatus_CommonRes(arg) {
    if (!(arg instanceof notify_status_pb.CommonRes)) {
        throw new Error('Expected argument of type notifyStatus.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_CommonRes(buffer_arg) {
    return notify_status_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_CreateScanMeasureModeReq(arg) {
    if (!(arg instanceof notify_status_pb.CreateScanMeasureModeReq)) {
        throw new Error('Expected argument of type notifyStatus.CreateScanMeasureModeReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_CreateScanMeasureModeReq(buffer_arg) {
    return notify_status_pb.CreateScanMeasureModeReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_CreateScanTypeReq(arg) {
    if (!(arg instanceof notify_status_pb.CreateScanTypeReq)) {
        throw new Error('Expected argument of type notifyStatus.CreateScanTypeReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_CreateScanTypeReq(buffer_arg) {
    return notify_status_pb.CreateScanTypeReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_CreateScanTypeRes(arg) {
    if (!(arg instanceof notify_status_pb.CreateScanTypeRes)) {
        throw new Error('Expected argument of type notifyStatus.CreateScanTypeRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_CreateScanTypeRes(buffer_arg) {
    return notify_status_pb.CreateScanTypeRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetAIDeviceExpireReq(arg) {
    if (!(arg instanceof notify_status_pb.GetAIDeviceExpireReq)) {
        throw new Error('Expected argument of type notifyStatus.GetAIDeviceExpireReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetAIDeviceExpireReq(buffer_arg) {
    return notify_status_pb.GetAIDeviceExpireReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetAIDeviceExpireRes(arg) {
    if (!(arg instanceof notify_status_pb.GetAIDeviceExpireRes)) {
        throw new Error('Expected argument of type notifyStatus.GetAIDeviceExpireRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetAIDeviceExpireRes(buffer_arg) {
    return notify_status_pb.GetAIDeviceExpireRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetDeviceExpireReq(arg) {
    if (!(arg instanceof notify_status_pb.GetDeviceExpireReq)) {
        throw new Error('Expected argument of type notifyStatus.GetDeviceExpireReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetDeviceExpireReq(buffer_arg) {
    return notify_status_pb.GetDeviceExpireReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetDeviceExpireRes(arg) {
    if (!(arg instanceof notify_status_pb.GetDeviceExpireRes)) {
        throw new Error('Expected argument of type notifyStatus.GetDeviceExpireRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetDeviceExpireRes(buffer_arg) {
    return notify_status_pb.GetDeviceExpireRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetQRCodeReq(arg) {
    if (!(arg instanceof notify_status_pb.GetQRCodeReq)) {
        throw new Error('Expected argument of type notifyStatus.GetQRCodeReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetQRCodeReq(buffer_arg) {
    return notify_status_pb.GetQRCodeReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetQRCodeRes(arg) {
    if (!(arg instanceof notify_status_pb.GetQRCodeRes)) {
        throw new Error('Expected argument of type notifyStatus.GetQRCodeRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetQRCodeRes(buffer_arg) {
    return notify_status_pb.GetQRCodeRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetScanInfoReq(arg) {
    if (!(arg instanceof notify_status_pb.GetScanInfoReq)) {
        throw new Error('Expected argument of type notifyStatus.GetScanInfoReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetScanInfoReq(buffer_arg) {
    return notify_status_pb.GetScanInfoReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_GetScanInfoRes(arg) {
    if (!(arg instanceof notify_status_pb.GetScanInfoRes)) {
        throw new Error('Expected argument of type notifyStatus.GetScanInfoRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_GetScanInfoRes(buffer_arg) {
    return notify_status_pb.GetScanInfoRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_NotifyTaskStatusReq(arg) {
    if (!(arg instanceof notify_status_pb.NotifyTaskStatusReq)) {
        throw new Error('Expected argument of type notifyStatus.NotifyTaskStatusReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_NotifyTaskStatusReq(buffer_arg) {
    return notify_status_pb.NotifyTaskStatusReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_NotifyTaskStatusRes(arg) {
    if (!(arg instanceof notify_status_pb.NotifyTaskStatusRes)) {
        throw new Error('Expected argument of type notifyStatus.NotifyTaskStatusRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_NotifyTaskStatusRes(buffer_arg) {
    return notify_status_pb.NotifyTaskStatusRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_RegisterReq(arg) {
    if (!(arg instanceof notify_status_pb.RegisterReq)) {
        throw new Error('Expected argument of type notifyStatus.RegisterReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_RegisterReq(buffer_arg) {
    return notify_status_pb.RegisterReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_notifyStatus_RegisterRes(arg) {
    if (!(arg instanceof notify_status_pb.RegisterRes)) {
        throw new Error('Expected argument of type notifyStatus.RegisterRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_notifyStatus_RegisterRes(buffer_arg) {
    return notify_status_pb.RegisterRes.deserializeBinary(new Uint8Array(buffer_arg))
}

var NotifyStatusService = (exports.NotifyStatusService = {
    // 注册
    register: {
        path: '/notifyStatus.NotifyStatus/Register',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.RegisterReq,
        responseType: notify_status_pb.RegisterRes,
        requestSerialize: serialize_notifyStatus_RegisterReq,
        requestDeserialize: deserialize_notifyStatus_RegisterReq,
        responseSerialize: serialize_notifyStatus_RegisterRes,
        responseDeserialize: deserialize_notifyStatus_RegisterRes
    },
    // 获取二维码
    getQRCode: {
        path: '/notifyStatus.NotifyStatus/GetQRCode',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.GetQRCodeReq,
        responseType: notify_status_pb.GetQRCodeRes,
        requestSerialize: serialize_notifyStatus_GetQRCodeReq,
        requestDeserialize: deserialize_notifyStatus_GetQRCodeReq,
        responseSerialize: serialize_notifyStatus_GetQRCodeRes,
        responseDeserialize: deserialize_notifyStatus_GetQRCodeRes
    },
    // 获取扫描信息
    getScanInfo: {
        path: '/notifyStatus.NotifyStatus/GetScanInfo',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.GetScanInfoReq,
        responseType: notify_status_pb.GetScanInfoRes,
        requestSerialize: serialize_notifyStatus_GetScanInfoReq,
        requestDeserialize: deserialize_notifyStatus_GetScanInfoReq,
        responseSerialize: serialize_notifyStatus_GetScanInfoRes,
        responseDeserialize: deserialize_notifyStatus_GetScanInfoRes
    },
    // 保存测量类型
    createScanType: {
        path: '/notifyStatus.NotifyStatus/CreateScanType',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.CreateScanTypeReq,
        responseType: notify_status_pb.CreateScanTypeRes,
        requestSerialize: serialize_notifyStatus_CreateScanTypeReq,
        requestDeserialize: deserialize_notifyStatus_CreateScanTypeReq,
        responseSerialize: serialize_notifyStatus_CreateScanTypeRes,
        responseDeserialize: deserialize_notifyStatus_CreateScanTypeRes
    },
    // 获取设备有效期
    getDeviceExpire: {
        path: '/notifyStatus.NotifyStatus/GetDeviceExpire',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.GetDeviceExpireReq,
        responseType: notify_status_pb.GetDeviceExpireRes,
        requestSerialize: serialize_notifyStatus_GetDeviceExpireReq,
        requestDeserialize: deserialize_notifyStatus_GetDeviceExpireReq,
        responseSerialize: serialize_notifyStatus_GetDeviceExpireRes,
        responseDeserialize: deserialize_notifyStatus_GetDeviceExpireRes
    },
    // 获取AI平台使用有效期
    getAIDeviceExpire: {
        path: '/notifyStatus.NotifyStatus/GetAIDeviceExpire',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.GetAIDeviceExpireReq,
        responseType: notify_status_pb.GetAIDeviceExpireRes,
        requestSerialize: serialize_notifyStatus_GetAIDeviceExpireReq,
        requestDeserialize: deserialize_notifyStatus_GetAIDeviceExpireReq,
        responseSerialize: serialize_notifyStatus_GetAIDeviceExpireRes,
        responseDeserialize: deserialize_notifyStatus_GetAIDeviceExpireRes
    },
    // 上报设备当前测量模式-----如：体围体态的快速测量模式，  产康模式， 麦澜德模式
    createScanMeasureMode: {
        path: '/notifyStatus.NotifyStatus/CreateScanMeasureMode',
        requestStream: false,
        responseStream: false,
        requestType: notify_status_pb.CreateScanMeasureModeReq,
        responseType: notify_status_pb.CommonRes,
        requestSerialize: serialize_notifyStatus_CreateScanMeasureModeReq,
        requestDeserialize: deserialize_notifyStatus_CreateScanMeasureModeReq,
        responseSerialize: serialize_notifyStatus_CommonRes,
        responseDeserialize: deserialize_notifyStatus_CommonRes
    },
    // ----------------------------------------------------------
    // 通知任务合成状态
    // TODO: 也可以换成客户端流模式，再商量
    notifyTaskStatus: {
        path: '/notifyStatus.NotifyStatus/NotifyTaskStatus',
        requestStream: false,
        responseStream: true,
        requestType: notify_status_pb.NotifyTaskStatusReq,
        responseType: notify_status_pb.NotifyTaskStatusRes,
        requestSerialize: serialize_notifyStatus_NotifyTaskStatusReq,
        requestDeserialize: deserialize_notifyStatus_NotifyTaskStatusReq,
        responseSerialize: serialize_notifyStatus_NotifyTaskStatusRes,
        responseDeserialize: deserialize_notifyStatus_NotifyTaskStatusRes
    }
})

exports.NotifyStatusClient = grpc.makeGenericClientConstructor(NotifyStatusService, 'NotifyStatus')
