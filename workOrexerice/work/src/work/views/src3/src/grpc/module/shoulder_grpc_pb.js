// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var shoulder_pb = require('./shoulder_pb.js')

function serialize_shoulder_CommonReq(arg) {
    if (!(arg instanceof shoulder_pb.CommonReq)) {
        throw new Error('Expected argument of type shoulder.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_shoulder_CommonReq(buffer_arg) {
    return shoulder_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_shoulder_CommonRes(arg) {
    if (!(arg instanceof shoulder_pb.CommonRes)) {
        throw new Error('Expected argument of type shoulder.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_shoulder_CommonRes(buffer_arg) {
    return shoulder_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_shoulder_ShoulderDetectReq(arg) {
    if (!(arg instanceof shoulder_pb.ShoulderDetectReq)) {
        throw new Error('Expected argument of type shoulder.ShoulderDetectReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_shoulder_ShoulderDetectReq(buffer_arg) {
    return shoulder_pb.ShoulderDetectReq.deserializeBinary(new Uint8Array(buffer_arg))
}

var ShoulderService = (exports.ShoulderService = {
    // 服务状态请求 - 服务处理完后通过client的ShoulderServiceStatus上报服务结果
    serviceStatus: {
        path: '/shoulder.Shoulder/ServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: shoulder_pb.CommonReq,
        responseType: shoulder_pb.CommonRes,
        requestSerialize: serialize_shoulder_CommonReq,
        requestDeserialize: deserialize_shoulder_CommonReq,
        responseSerialize: serialize_shoulder_CommonRes,
        responseDeserialize: deserialize_shoulder_CommonRes
    },
    // 自检请求
    checkSelf: {
        path: '/shoulder.Shoulder/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: shoulder_pb.CommonReq,
        responseType: shoulder_pb.CommonRes,
        requestSerialize: serialize_shoulder_CommonReq,
        requestDeserialize: deserialize_shoulder_CommonReq,
        responseSerialize: serialize_shoulder_CommonRes,
        responseDeserialize: deserialize_shoulder_CommonRes
    },
    // 启动肩部检测
    startShoulderDetect: {
        path: '/shoulder.Shoulder/StartShoulderDetect',
        requestStream: false,
        responseStream: false,
        requestType: shoulder_pb.ShoulderDetectReq,
        responseType: shoulder_pb.CommonRes,
        requestSerialize: serialize_shoulder_ShoulderDetectReq,
        requestDeserialize: deserialize_shoulder_ShoulderDetectReq,
        responseSerialize: serialize_shoulder_CommonRes,
        responseDeserialize: deserialize_shoulder_CommonRes
    },
    // 停止检测检测 正常停止；肩部服务自身上报异常后发起
    stopShoulderDetect: {
        path: '/shoulder.Shoulder/StopShoulderDetect',
        requestStream: false,
        responseStream: false,
        requestType: shoulder_pb.CommonReq,
        responseType: shoulder_pb.CommonRes,
        requestSerialize: serialize_shoulder_CommonReq,
        requestDeserialize: deserialize_shoulder_CommonReq,
        responseSerialize: serialize_shoulder_CommonRes,
        responseDeserialize: deserialize_shoulder_CommonRes
    }
})

exports.ShoulderClient = grpc.makeGenericClientConstructor(ShoulderService, 'Shoulder')
