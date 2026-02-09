// GENERATED CODE -- DO NOT EDIT!

// package: scan
// file: scan.proto

import * as scan_pb from "./scan_pb";
import * as grpc from "@grpc/grpc-js";

interface IScanService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  serviceStatus: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
  checkSelf: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
  startAposeDetect: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
  startIposeDetect: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
  startScan: grpc.MethodDefinition<scan_pb.StartScanReq, scan_pb.CommonRes>;
  stopScan: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
  cancelScan: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
  depthCameraStatus: grpc.MethodDefinition<scan_pb.CommonReq, scan_pb.CommonRes>;
}

export const ScanService: IScanService;

export interface IScanServer extends grpc.UntypedServiceImplementation {
  serviceStatus: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
  checkSelf: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
  startAposeDetect: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
  startIposeDetect: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
  startScan: grpc.handleUnaryCall<scan_pb.StartScanReq, scan_pb.CommonRes>;
  stopScan: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
  cancelScan: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
  depthCameraStatus: grpc.handleUnaryCall<scan_pb.CommonReq, scan_pb.CommonRes>;
}

export class ScanClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  serviceStatus(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startAposeDetect(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startAposeDetect(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startAposeDetect(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startIposeDetect(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startIposeDetect(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startIposeDetect(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startScan(argument: scan_pb.StartScanReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startScan(argument: scan_pb.StartScanReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  startScan(argument: scan_pb.StartScanReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  stopScan(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  stopScan(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  stopScan(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  cancelScan(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  cancelScan(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  cancelScan(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  depthCameraStatus(argument: scan_pb.CommonReq, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  depthCameraStatus(argument: scan_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
  depthCameraStatus(argument: scan_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<scan_pb.CommonRes>): grpc.ClientUnaryCall;
}
