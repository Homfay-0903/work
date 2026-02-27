// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var algorithm_pb = require('./algorithm_pb.js')

function serialize_VRAlgorithm_CommonReq(arg) {
    if (!(arg instanceof algorithm_pb.CommonReq)) {
        throw new Error('Expected argument of type VRAlgorithm.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_VRAlgorithm_CommonReq(buffer_arg) {
    return algorithm_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_VRAlgorithm_CommonRes(arg) {
    if (!(arg instanceof algorithm_pb.CommonRes)) {
        throw new Error('Expected argument of type VRAlgorithm.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_VRAlgorithm_CommonRes(buffer_arg) {
    return algorithm_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_VRAlgorithm_ShoulderDetectReq(arg) {
    if (!(arg instanceof algorithm_pb.ShoulderDetectReq)) {
        throw new Error('Expected argument of type VRAlgorithm.ShoulderDetectReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_VRAlgorithm_ShoulderDetectReq(buffer_arg) {
    return algorithm_pb.ShoulderDetectReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_VRAlgorithm_StartScanReq(arg) {
    if (!(arg instanceof algorithm_pb.StartScanReq)) {
        throw new Error('Expected argument of type VRAlgorithm.StartScanReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_VRAlgorithm_StartScanReq(buffer_arg) {
    return algorithm_pb.StartScanReq.deserializeBinary(new Uint8Array(buffer_arg))
}

var AlgorithmService = (exports.AlgorithmService = {
    // ------------ 通用功能 ------------ //
    // 服务状态请求 - 服务处理完后通过client的ScanServiceStatus上报服务结果
    serviceStatus: {
        path: '/VRAlgorithm.Algorithm/ServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 自检请求
    checkSelf: {
        path: '/VRAlgorithm.Algorithm/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 获取深度相机状态
    depthCameraStatus: {
        path: '/VRAlgorithm.Algorithm/DepthCameraStatus',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 获取鱼眼相机状态
    fisheyeCameraStatus: {
        path: '/VRAlgorithm.Algorithm/FisheyeCameraStatus',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 主动关闭深度相机 仅三相机设备使用
    closeDepthCamera: {
        path: '/VRAlgorithm.Algorithm/CloseDepthCamera',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // ------------ 扫描功能 ------------ //
    // 启动Apose姿势合法性检测
    startAposeDetect: {
        path: '/VRAlgorithm.Algorithm/StartAposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止Apose姿势合法性检测
    stopAposeDetect: {
        path: '/VRAlgorithm.Algorithm/StopAposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 启动Ipose姿势合法性检测
    startIposeDetect: {
        path: '/VRAlgorithm.Algorithm/StartIposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止Ipose姿势合法性检测
    stopIposeDetect: {
        path: '/VRAlgorithm.Algorithm/StopIposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 开始扫描
    startScan: {
        path: '/VRAlgorithm.Algorithm/StartScan',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.StartScanReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_StartScanReq,
        requestDeserialize: deserialize_VRAlgorithm_StartScanReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止扫描，转台停止后发起 - 正常停止
    stopScan: {
        path: '/VRAlgorithm.Algorithm/StopScan',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 取消扫描，扫描过程中其他异常后发起，不上报图像路径 - 异常停止
    cancelScan: {
        path: '/VRAlgorithm.Algorithm/CancelScan',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // ------------ 手势功能 ------------ //
    // 启动手势检测
    startGestureDetect: {
        path: '/VRAlgorithm.Algorithm/StartGestureDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止手势检测
    stopGestureDetect: {
        path: '/VRAlgorithm.Algorithm/StopGestureDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 启动站人检测
    startPersonDetect: {
        path: '/VRAlgorithm.Algorithm/StartPersonDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止站人检测
    stopPersonDetect: {
        path: '/VRAlgorithm.Algorithm/StopPersonDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 启动手势Ipose检测
    startGestureIposeDetect: {
        path: '/VRAlgorithm.Algorithm/StartGestureIposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止手势Ipose检测
    stopGestureIposeDetect: {
        path: '/VRAlgorithm.Algorithm/StopGestureIposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 开启环境光照检测 待机页面，设置-设备检测页
    startAmbientLightDetect: {
        path: '/VRAlgorithm.Algorithm/StartAmbientLightDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 关闭环境光照检测
    stopAmbientLightDetect: {
        path: '/VRAlgorithm.Algorithm/StopAmbientLightDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // ------------ 肩部功能 ------------ //
    // 启动肩部检测
    startShoulderDetect: {
        path: '/VRAlgorithm.Algorithm/StartShoulderDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.ShoulderDetectReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_ShoulderDetectReq,
        requestDeserialize: deserialize_VRAlgorithm_ShoulderDetectReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止肩部检测
    stopShoulderDetect: {
        path: '/VRAlgorithm.Algorithm/StopShoulderDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.ShoulderDetectReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_ShoulderDetectReq,
        requestDeserialize: deserialize_VRAlgorithm_ShoulderDetectReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 启动肩部姿势合法性检测
    startShoulderLegalityDetect: {
        path: '/VRAlgorithm.Algorithm/StartShoulderLegalityDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止肩部姿势合法性检测
    stopShoulderLegalityDetect: {
        path: '/VRAlgorithm.Algorithm/StopShoulderLegalityDetect',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 开始扫描二维码
    startScanQRCode: {
        path: '/VRAlgorithm.Algorithm/StartScanQRCode',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 停止扫描二维码
    stopScanQRCode: {
        path: '/VRAlgorithm.Algorithm/StopScanQRCode',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 开始相机休眠
    startCameraDormant: {
        path: '/VRAlgorithm.Algorithm/StartCameraDormant',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 结束相机休眠
    endCameraDormant: {
        path: '/VRAlgorithm.Algorithm/EndCameraDormant',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 开始身高测量
    startHeightMeasurement: {
        path: '/VRAlgorithm.Algorithm/StartHeightMeasurement',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    },
    // 结束身高测量
    endHeightMeasurement: {
        path: '/VRAlgorithm.Algorithm/EndHeightMeasurement',
        requestStream: false,
        responseStream: false,
        requestType: algorithm_pb.CommonReq,
        responseType: algorithm_pb.CommonRes,
        requestSerialize: serialize_VRAlgorithm_CommonReq,
        requestDeserialize: deserialize_VRAlgorithm_CommonReq,
        responseSerialize: serialize_VRAlgorithm_CommonRes,
        responseDeserialize: deserialize_VRAlgorithm_CommonRes
    }
})

exports.AlgorithmClient = grpc.makeGenericClientConstructor(AlgorithmService, 'Algorithm')
