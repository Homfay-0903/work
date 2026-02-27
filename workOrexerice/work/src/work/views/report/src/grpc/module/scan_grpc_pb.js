// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var scan_pb = require('./scan_pb.js')

function serialize_scan_CommonReq(arg) {
    if (!(arg instanceof scan_pb.CommonReq)) {
        throw new Error('Expected argument of type scan.CommonReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_scan_CommonReq(buffer_arg) {
    return scan_pb.CommonReq.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_scan_CommonRes(arg) {
    if (!(arg instanceof scan_pb.CommonRes)) {
        throw new Error('Expected argument of type scan.CommonRes')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_scan_CommonRes(buffer_arg) {
    return scan_pb.CommonRes.deserializeBinary(new Uint8Array(buffer_arg))
}

function serialize_scan_StartScanReq(arg) {
    if (!(arg instanceof scan_pb.StartScanReq)) {
        throw new Error('Expected argument of type scan.StartScanReq')
    }
    return Buffer.from(arg.serializeBinary())
}

function deserialize_scan_StartScanReq(buffer_arg) {
    return scan_pb.StartScanReq.deserializeBinary(new Uint8Array(buffer_arg))
}

var ScanService = (exports.ScanService = {
    // 服务状态请求 - 服务处理完后通过client的ScanServiceStatus上报服务结果
    serviceStatus: {
        path: '/scan.Scan/ServiceStatus',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 自检请求
    checkSelf: {
        path: '/scan.Scan/CheckSelf',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 体围Apose启动姿势合法性检测
    startAposeDetect: {
        path: '/scan.Scan/StartAposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 体态Ipose启动姿势合法性检测
    startIposeDetect: {
        path: '/scan.Scan/StartIposeDetect',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 开始扫描
    startScan: {
        path: '/scan.Scan/StartScan',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.StartScanReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_StartScanReq,
        requestDeserialize: deserialize_scan_StartScanReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 停止扫描，转台停止后发起 - 正常停止
    stopScan: {
        path: '/scan.Scan/StopScan',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 取消扫描，扫描过程中其他异常后发起，不上报图像路径 - 异常停止
    cancelScan: {
        path: '/scan.Scan/CancelScan',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    },
    // 获取深度相机状态
    depthCameraStatus: {
        path: '/scan.Scan/DepthCameraStatus',
        requestStream: false,
        responseStream: false,
        requestType: scan_pb.CommonReq,
        responseType: scan_pb.CommonRes,
        requestSerialize: serialize_scan_CommonReq,
        requestDeserialize: deserialize_scan_CommonReq,
        responseSerialize: serialize_scan_CommonRes,
        responseDeserialize: deserialize_scan_CommonRes
    }
})

exports.ScanClient = grpc.makeGenericClientConstructor(ScanService, 'Scan')
