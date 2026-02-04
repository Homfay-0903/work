// GENERATED CODE -- DO NOT EDIT!

// package: update
// file: update.proto

import * as update_pb from "./update_pb";
import * as grpc from "@grpc/grpc-js";

interface IUpdaterService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  deviceStatus: grpc.MethodDefinition<update_pb.CommonReq, update_pb.DeviceStatusRes>;
  startUpdateTask: grpc.MethodDefinition<update_pb.CommonReq, update_pb.CommonRes>;
}

export const UpdaterService: IUpdaterService;

export interface IUpdaterServer extends grpc.UntypedServiceImplementation {
  deviceStatus: grpc.handleUnaryCall<update_pb.CommonReq, update_pb.DeviceStatusRes>;
  startUpdateTask: grpc.handleUnaryCall<update_pb.CommonReq, update_pb.CommonRes>;
}

export class UpdaterClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  deviceStatus(argument: update_pb.CommonReq, callback: grpc.requestCallback<update_pb.DeviceStatusRes>): grpc.ClientUnaryCall;
  deviceStatus(argument: update_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<update_pb.DeviceStatusRes>): grpc.ClientUnaryCall;
  deviceStatus(argument: update_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<update_pb.DeviceStatusRes>): grpc.ClientUnaryCall;
  startUpdateTask(argument: update_pb.CommonReq, callback: grpc.requestCallback<update_pb.CommonRes>): grpc.ClientUnaryCall;
  startUpdateTask(argument: update_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<update_pb.CommonRes>): grpc.ClientUnaryCall;
  startUpdateTask(argument: update_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<update_pb.CommonRes>): grpc.ClientUnaryCall;
}
