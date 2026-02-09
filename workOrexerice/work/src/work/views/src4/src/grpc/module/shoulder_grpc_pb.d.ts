// GENERATED CODE -- DO NOT EDIT!

// package: shoulder
// file: shoulder.proto

import * as shoulder_pb from "./shoulder_pb";
import * as grpc from "@grpc/grpc-js";

interface IShoulderService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  serviceStatus: grpc.MethodDefinition<shoulder_pb.CommonReq, shoulder_pb.CommonRes>;
  checkSelf: grpc.MethodDefinition<shoulder_pb.CommonReq, shoulder_pb.CommonRes>;
  startShoulderDetect: grpc.MethodDefinition<shoulder_pb.ShoulderDetectReq, shoulder_pb.CommonRes>;
  stopShoulderDetect: grpc.MethodDefinition<shoulder_pb.CommonReq, shoulder_pb.CommonRes>;
}

export const ShoulderService: IShoulderService;

export interface IShoulderServer extends grpc.UntypedServiceImplementation {
  serviceStatus: grpc.handleUnaryCall<shoulder_pb.CommonReq, shoulder_pb.CommonRes>;
  checkSelf: grpc.handleUnaryCall<shoulder_pb.CommonReq, shoulder_pb.CommonRes>;
  startShoulderDetect: grpc.handleUnaryCall<shoulder_pb.ShoulderDetectReq, shoulder_pb.CommonRes>;
  stopShoulderDetect: grpc.handleUnaryCall<shoulder_pb.CommonReq, shoulder_pb.CommonRes>;
}

export class ShoulderClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  serviceStatus(argument: shoulder_pb.CommonReq, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: shoulder_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: shoulder_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: shoulder_pb.CommonReq, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: shoulder_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: shoulder_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  startShoulderDetect(argument: shoulder_pb.ShoulderDetectReq, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  startShoulderDetect(argument: shoulder_pb.ShoulderDetectReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  startShoulderDetect(argument: shoulder_pb.ShoulderDetectReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  stopShoulderDetect(argument: shoulder_pb.CommonReq, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  stopShoulderDetect(argument: shoulder_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
  stopShoulderDetect(argument: shoulder_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<shoulder_pb.CommonRes>): grpc.ClientUnaryCall;
}
