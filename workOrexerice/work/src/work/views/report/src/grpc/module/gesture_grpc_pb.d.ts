// GENERATED CODE -- DO NOT EDIT!

// package: gesture
// file: gesture.proto

import * as gesture_pb from "./gesture_pb";
import * as grpc from "@grpc/grpc-js";

interface IGestureService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  serviceStatus: grpc.MethodDefinition<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  checkSelf: grpc.MethodDefinition<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  startGestureDetect: grpc.MethodDefinition<gesture_pb.GestureDetectReq, gesture_pb.CommonRes>;
  stopGestureDetect: grpc.MethodDefinition<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  startAmbientLightDetect: grpc.MethodDefinition<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  stopAmbientLightDetect: grpc.MethodDefinition<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  fisheyeCameraStatus: grpc.MethodDefinition<gesture_pb.CommonReq, gesture_pb.CommonRes>;
}

export const GestureService: IGestureService;

export interface IGestureServer extends grpc.UntypedServiceImplementation {
  serviceStatus: grpc.handleUnaryCall<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  checkSelf: grpc.handleUnaryCall<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  startGestureDetect: grpc.handleUnaryCall<gesture_pb.GestureDetectReq, gesture_pb.CommonRes>;
  stopGestureDetect: grpc.handleUnaryCall<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  startAmbientLightDetect: grpc.handleUnaryCall<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  stopAmbientLightDetect: grpc.handleUnaryCall<gesture_pb.CommonReq, gesture_pb.CommonRes>;
  fisheyeCameraStatus: grpc.handleUnaryCall<gesture_pb.CommonReq, gesture_pb.CommonRes>;
}

export class GestureClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  serviceStatus(argument: gesture_pb.CommonReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: gesture_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: gesture_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: gesture_pb.CommonReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: gesture_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: gesture_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  startGestureDetect(argument: gesture_pb.GestureDetectReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  startGestureDetect(argument: gesture_pb.GestureDetectReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  startGestureDetect(argument: gesture_pb.GestureDetectReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  stopGestureDetect(argument: gesture_pb.CommonReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  stopGestureDetect(argument: gesture_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  stopGestureDetect(argument: gesture_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  startAmbientLightDetect(argument: gesture_pb.CommonReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  startAmbientLightDetect(argument: gesture_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  startAmbientLightDetect(argument: gesture_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  stopAmbientLightDetect(argument: gesture_pb.CommonReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  stopAmbientLightDetect(argument: gesture_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  stopAmbientLightDetect(argument: gesture_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  fisheyeCameraStatus(argument: gesture_pb.CommonReq, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  fisheyeCameraStatus(argument: gesture_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
  fisheyeCameraStatus(argument: gesture_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<gesture_pb.CommonRes>): grpc.ClientUnaryCall;
}
