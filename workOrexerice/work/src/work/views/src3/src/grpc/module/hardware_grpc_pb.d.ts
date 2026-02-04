// GENERATED CODE -- DO NOT EDIT!

// package: hardware
// file: hardware.proto

import * as hardware_pb from "./hardware_pb";
import * as grpc from "@grpc/grpc-js";

interface IHardwareService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  serviceStatus: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  screenCtrl: grpc.MethodDefinition<hardware_pb.ScreenCtrlReq, hardware_pb.CommonRes>;
  backlightSet: grpc.MethodDefinition<hardware_pb.BacklightReq, hardware_pb.CommonRes>;
  backlightGet: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  personCheck: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.PersonCheckRes>;
  checkSelf: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  weightMeasure: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  bodyMeasure: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  tableRun: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  wifiSet: grpc.MethodDefinition<hardware_pb.WifiSetReq, hardware_pb.CommonRes>;
  wifiEnableStatusGet: grpc.MethodDefinition<hardware_pb.CommonReq, hardware_pb.WifiEnableStatusRes>;
}

export const HardwareService: IHardwareService;

export interface IHardwareServer extends grpc.UntypedServiceImplementation {
  serviceStatus: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  screenCtrl: grpc.handleUnaryCall<hardware_pb.ScreenCtrlReq, hardware_pb.CommonRes>;
  backlightSet: grpc.handleUnaryCall<hardware_pb.BacklightReq, hardware_pb.CommonRes>;
  backlightGet: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  personCheck: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.PersonCheckRes>;
  checkSelf: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  weightMeasure: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  bodyMeasure: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  tableRun: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.CommonRes>;
  wifiSet: grpc.handleUnaryCall<hardware_pb.WifiSetReq, hardware_pb.CommonRes>;
  wifiEnableStatusGet: grpc.handleUnaryCall<hardware_pb.CommonReq, hardware_pb.WifiEnableStatusRes>;
}

export class HardwareClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  serviceStatus(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  screenCtrl(argument: hardware_pb.ScreenCtrlReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  screenCtrl(argument: hardware_pb.ScreenCtrlReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  screenCtrl(argument: hardware_pb.ScreenCtrlReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightSet(argument: hardware_pb.BacklightReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightSet(argument: hardware_pb.BacklightReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightSet(argument: hardware_pb.BacklightReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightGet(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightGet(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightGet(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  personCheck(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.PersonCheckRes>): grpc.ClientUnaryCall;
  personCheck(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.PersonCheckRes>): grpc.ClientUnaryCall;
  personCheck(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.PersonCheckRes>): grpc.ClientUnaryCall;
  checkSelf(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  weightMeasure(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  weightMeasure(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  weightMeasure(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyMeasure(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyMeasure(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyMeasure(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  tableRun(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  tableRun(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  tableRun(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiSet(argument: hardware_pb.WifiSetReq, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiSet(argument: hardware_pb.WifiSetReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiSet(argument: hardware_pb.WifiSetReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiEnableStatusGet(argument: hardware_pb.CommonReq, callback: grpc.requestCallback<hardware_pb.WifiEnableStatusRes>): grpc.ClientUnaryCall;
  wifiEnableStatusGet(argument: hardware_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.WifiEnableStatusRes>): grpc.ClientUnaryCall;
  wifiEnableStatusGet(argument: hardware_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<hardware_pb.WifiEnableStatusRes>): grpc.ClientUnaryCall;
}
