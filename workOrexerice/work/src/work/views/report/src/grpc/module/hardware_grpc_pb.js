// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var hardware_pb = require('./hardware_pb.js')

function serialize_hardware_BacklightReq(arg) {
    if (!(arg instanceof hardware_pb.BacklightReq)) {
        throw new Error('Expected argument of type hardware.BacklightReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_BacklightReq(buffer_arg) {
    return hardware_pb.BacklightReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_hardware_CommonReq(arg) {
    if (!(arg instanceof hardware_pb.CommonReq)) {
        throw new Error('Expected argument of type hardware.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_CommonReq(buffer_arg) {
    return hardware_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_hardware_CommonRes(arg) {
    if (!(arg instanceof hardware_pb.CommonRes)) {
        throw new Error('Expected argument of type hardware.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_CommonRes(buffer_arg) {
    return hardware_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_hardware_PersonCheckRes(arg) {
    if (!(arg instanceof hardware_pb.PersonCheckRes)) {
        throw new Error('Expected argument of type hardware.PersonCheckRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_PersonCheckRes(buffer_arg) {
    return hardware_pb.PersonCheckRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_hardware_ScreenCtrlReq(arg) {
    if (!(arg instanceof hardware_pb.ScreenCtrlReq)) {
        throw new Error('Expected argument of type hardware.ScreenCtrlReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_ScreenCtrlReq(buffer_arg) {
    return hardware_pb.ScreenCtrlReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_hardware_WifiEnableStatusRes(arg) {
    if (!(arg instanceof hardware_pb.WifiEnableStatusRes)) {
        throw new Error('Expected argument of type hardware.WifiEnableStatusRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_WifiEnableStatusRes(buffer_arg) {
    return hardware_pb.WifiEnableStatusRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_hardware_WifiSetReq(arg) {
    if (!(arg instanceof hardware_pb.WifiSetReq)) {
        throw new Error('Expected argument of type hardware.WifiSetReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_hardware_WifiSetReq(buffer_arg) {
    return hardware_pb.WifiSetReq.deserializeBinary(new Uint8Array(buffer_arg))
}

var HardwareService = (exports.HardwareService = {
    // 服务状态请求
    serviceStatus: {
        path: '/hardware.Hardware/ServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 屏幕控制
    screenCtrl: {
        path: '/hardware.Hardware/ScreenCtrl',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.ScreenCtrlReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_ScreenCtrlReq,
        requestDeserialize: deserialize_hardware_ScreenCtrlReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 亮度设置
    backlightSet: {
        path: '/hardware.Hardware/BacklightSet',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.BacklightReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_BacklightReq,
        requestDeserialize: deserialize_hardware_BacklightReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 亮度获取
    backlightGet: {
        path: '/hardware.Hardware/BacklightGet',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 开机站人检查
    personCheck: {
        path: '/hardware.Hardware/PersonCheck',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.PersonCheckRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_PersonCheckRes,
        responseDeserialize: deserialize_hardware_PersonCheckRes
    },
    // 设备自检测请求
    checkSelf: {
        path: '/hardware.Hardware/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 体重测量请求
    weightMeasure: {
        path: '/hardware.Hardware/WeightMeasure',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 体成分测量请求
    bodyMeasure: {
        path: '/hardware.Hardware/BodyMeasure',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // 转盘开始转动
    tableRun: {
        path: '/hardware.Hardware/TableRun',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // WiFi设置
    wifiSet: {
        path: '/hardware.Hardware/WifiSet',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.WifiSetReq,
        responseType: hardware_pb.CommonRes,
        requestSerialize: serialize_hardware_WifiSetReq,
        requestDeserialize: deserialize_hardware_WifiSetReq,
        responseSerialize: serialize_hardware_CommonRes,
        responseDeserialize: deserialize_hardware_CommonRes
    },
    // WiFi启用状态获取
    wifiEnableStatusGet: {
        path: '/hardware.Hardware/WifiEnableStatusGet',
        requestStream: false,
        responseStream: false,
        requestType: hardware_pb.CommonReq,
        responseType: hardware_pb.WifiEnableStatusRes,
        requestSerialize: serialize_hardware_CommonReq,
        requestDeserialize: deserialize_hardware_CommonReq,
        responseSerialize: serialize_hardware_WifiEnableStatusRes,
        responseDeserialize: deserialize_hardware_WifiEnableStatusRes
    }
})

exports.HardwareClient = grpc.makeGenericClientConstructor(HardwareService, 'Hardware')
