// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var update_pb = require('./update_pb.js')

function serialize_update_CommonReq(arg) {
    if (!(arg instanceof update_pb.CommonReq)) {
        throw new Error('Expected argument of type update.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_update_CommonReq(buffer_arg) {
    return update_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_update_CommonRes(arg) {
    if (!(arg instanceof update_pb.CommonRes)) {
        throw new Error('Expected argument of type update.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_update_CommonRes(buffer_arg) {
    return update_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_update_DeviceStatusRes(arg) {
    if (!(arg instanceof update_pb.DeviceStatusRes)) {
        throw new Error('Expected argument of type update.DeviceStatusRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_update_DeviceStatusRes(buffer_arg) {
    return update_pb.DeviceStatusRes.deserializeBinary(new Uint8Array(buffer_arg))
}

var UpdaterService = (exports.UpdaterService = {
    // 设备更新状态 - 开机启动后获取
    deviceStatus: {
        path: '/update.Updater/DeviceStatus',
        requestStream: false,
        responseStream: false,
        requestType: update_pb.CommonReq,
        responseType: update_pb.DeviceStatusRes,
        requestSerialize: serialize_update_CommonReq,
        requestDeserialize: deserialize_update_CommonReq,
        responseSerialize: serialize_update_DeviceStatusRes,
        responseDeserialize: deserialize_update_DeviceStatusRes
    },
    // 开始执行更新
    startUpdateTask: {
        path: '/update.Updater/StartUpdateTask',
        requestStream: false,
        responseStream: false,
        requestType: update_pb.CommonReq,
        responseType: update_pb.CommonRes,
        requestSerialize: serialize_update_CommonReq,
        requestDeserialize: deserialize_update_CommonReq,
        responseSerialize: serialize_update_CommonRes,
        responseDeserialize: deserialize_update_CommonRes
    }
})

exports.UpdaterClient = grpc.makeGenericClientConstructor(UpdaterService, 'Updater')
