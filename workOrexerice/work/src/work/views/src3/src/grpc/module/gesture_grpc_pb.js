// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var gesture_pb = require('./gesture_pb.js')

function serialize_gesture_CommonReq(arg) {
    if (!(arg instanceof gesture_pb.CommonReq)) {
        throw new Error('Expected argument of type gesture.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_gesture_CommonReq(buffer_arg) {
    return gesture_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_gesture_CommonRes(arg) {
    if (!(arg instanceof gesture_pb.CommonRes)) {
        throw new Error('Expected argument of type gesture.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_gesture_CommonRes(buffer_arg) {
    return gesture_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_gesture_GestureDetectReq(arg) {
    if (!(arg instanceof gesture_pb.GestureDetectReq)) {
        throw new Error('Expected argument of type gesture.GestureDetectReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_gesture_GestureDetectReq(buffer_arg) {
    return gesture_pb.GestureDetectReq.deserializeBinary(new Uint8Array(buffer_arg))
}

var GestureService = (exports.GestureService = {
    // 服务状态请求 - 服务处理完后通过client的GestureServiceStatus上报服务结果
    serviceStatus: {
        path: '/gesture.Gesture/ServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.CommonReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_CommonReq,
        requestDeserialize: deserialize_gesture_CommonReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    },
    // 自检请求
    checkSelf: {
        path: '/gesture.Gesture/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.CommonReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_CommonReq,
        requestDeserialize: deserialize_gesture_CommonReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    },
    // 启动手势检测
    startGestureDetect: {
        path: '/gesture.Gesture/StartGestureDetect',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.GestureDetectReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_GestureDetectReq,
        requestDeserialize: deserialize_gesture_GestureDetectReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    },
    // 停止检测 正常停止；手势服务自身上报异常后发起
    stopGestureDetect: {
        path: '/gesture.Gesture/StopGestureDetect',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.CommonReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_CommonReq,
        requestDeserialize: deserialize_gesture_CommonReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    },
    // 开启环境光照检测 待机页面，设置-设备检测页
    startAmbientLightDetect: {
        path: '/gesture.Gesture/StartAmbientLightDetect',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.CommonReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_CommonReq,
        requestDeserialize: deserialize_gesture_CommonReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    },
    // 关闭环境光照检测
    stopAmbientLightDetect: {
        path: '/gesture.Gesture/StopAmbientLightDetect',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.CommonReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_CommonReq,
        requestDeserialize: deserialize_gesture_CommonReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    },
    // 获取鱼眼相机状态
    fisheyeCameraStatus: {
        path: '/gesture.Gesture/FisheyeCameraStatus',
        requestStream: false,
        responseStream: false,
        requestType: gesture_pb.CommonReq,
        responseType: gesture_pb.CommonRes,
        requestSerialize: serialize_gesture_CommonReq,
        requestDeserialize: deserialize_gesture_CommonReq,
        responseSerialize: serialize_gesture_CommonRes,
        responseDeserialize: deserialize_gesture_CommonRes
    }
})

exports.GestureClient = grpc.makeGenericClientConstructor(GestureService, 'Gesture')
