// GENERATED CODE -- DO NOT EDIT!

// package: notifyStatus
// file: notify_status.proto

import * as notify_status_pb from "./notify_status_pb";
import * as grpc from "@grpc/grpc-js";

interface INotifyStatusService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  register: grpc.MethodDefinition<notify_status_pb.RegisterReq, notify_status_pb.RegisterRes>;
  getQRCode: grpc.MethodDefinition<notify_status_pb.GetQRCodeReq, notify_status_pb.GetQRCodeRes>;
  getScanInfo: grpc.MethodDefinition<notify_status_pb.GetScanInfoReq, notify_status_pb.GetScanInfoRes>;
  createScanType: grpc.MethodDefinition<notify_status_pb.CreateScanTypeReq, notify_status_pb.CreateScanTypeRes>;
  getDeviceExpire: grpc.MethodDefinition<notify_status_pb.GetDeviceExpireReq, notify_status_pb.GetDeviceExpireRes>;
  getAIDeviceExpire: grpc.MethodDefinition<notify_status_pb.GetAIDeviceExpireReq, notify_status_pb.GetAIDeviceExpireRes>;
  createScanMeasureMode: grpc.MethodDefinition<notify_status_pb.CreateScanMeasureModeReq, notify_status_pb.CommonRes>;
  notifyTaskStatus: grpc.MethodDefinition<notify_status_pb.NotifyTaskStatusReq, notify_status_pb.NotifyTaskStatusRes>;
}

export const NotifyStatusService: INotifyStatusService;

export interface INotifyStatusServer extends grpc.UntypedServiceImplementation {
  register: grpc.handleUnaryCall<notify_status_pb.RegisterReq, notify_status_pb.RegisterRes>;
  getQRCode: grpc.handleUnaryCall<notify_status_pb.GetQRCodeReq, notify_status_pb.GetQRCodeRes>;
  getScanInfo: grpc.handleUnaryCall<notify_status_pb.GetScanInfoReq, notify_status_pb.GetScanInfoRes>;
  createScanType: grpc.handleUnaryCall<notify_status_pb.CreateScanTypeReq, notify_status_pb.CreateScanTypeRes>;
  getDeviceExpire: grpc.handleUnaryCall<notify_status_pb.GetDeviceExpireReq, notify_status_pb.GetDeviceExpireRes>;
  getAIDeviceExpire: grpc.handleUnaryCall<notify_status_pb.GetAIDeviceExpireReq, notify_status_pb.GetAIDeviceExpireRes>;
  createScanMeasureMode: grpc.handleUnaryCall<notify_status_pb.CreateScanMeasureModeReq, notify_status_pb.CommonRes>;
  notifyTaskStatus: grpc.handleServerStreamingCall<notify_status_pb.NotifyTaskStatusReq, notify_status_pb.NotifyTaskStatusRes>;
}

export class NotifyStatusClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  register(argument: notify_status_pb.RegisterReq, callback: grpc.requestCallback<notify_status_pb.RegisterRes>): grpc.ClientUnaryCall;
  register(argument: notify_status_pb.RegisterReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.RegisterRes>): grpc.ClientUnaryCall;
  register(argument: notify_status_pb.RegisterReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.RegisterRes>): grpc.ClientUnaryCall;
  getQRCode(argument: notify_status_pb.GetQRCodeReq, callback: grpc.requestCallback<notify_status_pb.GetQRCodeRes>): grpc.ClientUnaryCall;
  getQRCode(argument: notify_status_pb.GetQRCodeReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetQRCodeRes>): grpc.ClientUnaryCall;
  getQRCode(argument: notify_status_pb.GetQRCodeReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetQRCodeRes>): grpc.ClientUnaryCall;
  getScanInfo(argument: notify_status_pb.GetScanInfoReq, callback: grpc.requestCallback<notify_status_pb.GetScanInfoRes>): grpc.ClientUnaryCall;
  getScanInfo(argument: notify_status_pb.GetScanInfoReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetScanInfoRes>): grpc.ClientUnaryCall;
  getScanInfo(argument: notify_status_pb.GetScanInfoReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetScanInfoRes>): grpc.ClientUnaryCall;
  createScanType(argument: notify_status_pb.CreateScanTypeReq, callback: grpc.requestCallback<notify_status_pb.CreateScanTypeRes>): grpc.ClientUnaryCall;
  createScanType(argument: notify_status_pb.CreateScanTypeReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.CreateScanTypeRes>): grpc.ClientUnaryCall;
  createScanType(argument: notify_status_pb.CreateScanTypeReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.CreateScanTypeRes>): grpc.ClientUnaryCall;
  getDeviceExpire(argument: notify_status_pb.GetDeviceExpireReq, callback: grpc.requestCallback<notify_status_pb.GetDeviceExpireRes>): grpc.ClientUnaryCall;
  getDeviceExpire(argument: notify_status_pb.GetDeviceExpireReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetDeviceExpireRes>): grpc.ClientUnaryCall;
  getDeviceExpire(argument: notify_status_pb.GetDeviceExpireReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetDeviceExpireRes>): grpc.ClientUnaryCall;
  getAIDeviceExpire(argument: notify_status_pb.GetAIDeviceExpireReq, callback: grpc.requestCallback<notify_status_pb.GetAIDeviceExpireRes>): grpc.ClientUnaryCall;
  getAIDeviceExpire(argument: notify_status_pb.GetAIDeviceExpireReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetAIDeviceExpireRes>): grpc.ClientUnaryCall;
  getAIDeviceExpire(argument: notify_status_pb.GetAIDeviceExpireReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.GetAIDeviceExpireRes>): grpc.ClientUnaryCall;
  createScanMeasureMode(argument: notify_status_pb.CreateScanMeasureModeReq, callback: grpc.requestCallback<notify_status_pb.CommonRes>): grpc.ClientUnaryCall;
  createScanMeasureMode(argument: notify_status_pb.CreateScanMeasureModeReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.CommonRes>): grpc.ClientUnaryCall;
  createScanMeasureMode(argument: notify_status_pb.CreateScanMeasureModeReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<notify_status_pb.CommonRes>): grpc.ClientUnaryCall;
  notifyTaskStatus(argument: notify_status_pb.NotifyTaskStatusReq, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<notify_status_pb.NotifyTaskStatusRes>;
  notifyTaskStatus(argument: notify_status_pb.NotifyTaskStatusReq, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<notify_status_pb.NotifyTaskStatusRes>;
}
