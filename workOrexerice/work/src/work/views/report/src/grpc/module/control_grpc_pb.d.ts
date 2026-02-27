// GENERATED CODE -- DO NOT EDIT!

// package: control
// file: control.proto

import * as control_pb from "./control_pb";
import * as grpc from "@grpc/grpc-js";

interface ISettingsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  deviceInfo: grpc.MethodDefinition<control_pb.CommonReq, control_pb.DeviceInfoRes>;
  printReport: grpc.MethodDefinition<control_pb.PrintReportReq, control_pb.CommonRes>;
  deviceClose: grpc.MethodDefinition<control_pb.CommonReq, control_pb.CommonRes>;
  taskNum: grpc.MethodDefinition<control_pb.CommonReq, control_pb.TaskNumRes>;
  upLoadNetSpeed: grpc.MethodDefinition<control_pb.CommonReq, control_pb.CommonRes>;
  downLoadNetSpeed: grpc.MethodDefinition<control_pb.CommonReq, control_pb.CommonRes>;
  changeVolume: grpc.MethodDefinition<control_pb.ChangeVolumeReq, control_pb.ChangeVolumeRes>;
  restartScanSrv: grpc.MethodDefinition<control_pb.CommonReq, control_pb.RestartScanSrvRes>;
  checkSelf: grpc.MethodDefinition<control_pb.CommonReq, control_pb.CheckSelfRes>;
  thirdBind: grpc.MethodDefinition<control_pb.CommonReq, control_pb.ThirdBindRes>;
  changeTimeZone: grpc.MethodDefinition<control_pb.ChangeTimeZoneReq, control_pb.CommonRes>;
}

export const SettingsService: ISettingsService;

export interface ISettingsServer extends grpc.UntypedServiceImplementation {
  deviceInfo: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.DeviceInfoRes>;
  printReport: grpc.handleUnaryCall<control_pb.PrintReportReq, control_pb.CommonRes>;
  deviceClose: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.CommonRes>;
  taskNum: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.TaskNumRes>;
  upLoadNetSpeed: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.CommonRes>;
  downLoadNetSpeed: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.CommonRes>;
  changeVolume: grpc.handleUnaryCall<control_pb.ChangeVolumeReq, control_pb.ChangeVolumeRes>;
  restartScanSrv: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.RestartScanSrvRes>;
  checkSelf: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.CheckSelfRes>;
  thirdBind: grpc.handleUnaryCall<control_pb.CommonReq, control_pb.ThirdBindRes>;
  changeTimeZone: grpc.handleUnaryCall<control_pb.ChangeTimeZoneReq, control_pb.CommonRes>;
}

export class SettingsClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  deviceInfo(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.DeviceInfoRes>): grpc.ClientUnaryCall;
  deviceInfo(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.DeviceInfoRes>): grpc.ClientUnaryCall;
  deviceInfo(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.DeviceInfoRes>): grpc.ClientUnaryCall;
  printReport(argument: control_pb.PrintReportReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  printReport(argument: control_pb.PrintReportReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  printReport(argument: control_pb.PrintReportReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  deviceClose(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  deviceClose(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  deviceClose(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  taskNum(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.TaskNumRes>): grpc.ClientUnaryCall;
  taskNum(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.TaskNumRes>): grpc.ClientUnaryCall;
  taskNum(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.TaskNumRes>): grpc.ClientUnaryCall;
  upLoadNetSpeed(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  upLoadNetSpeed(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  upLoadNetSpeed(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  downLoadNetSpeed(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  downLoadNetSpeed(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  downLoadNetSpeed(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  changeVolume(argument: control_pb.ChangeVolumeReq, callback: grpc.requestCallback<control_pb.ChangeVolumeRes>): grpc.ClientUnaryCall;
  changeVolume(argument: control_pb.ChangeVolumeReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.ChangeVolumeRes>): grpc.ClientUnaryCall;
  changeVolume(argument: control_pb.ChangeVolumeReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.ChangeVolumeRes>): grpc.ClientUnaryCall;
  restartScanSrv(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.RestartScanSrvRes>): grpc.ClientUnaryCall;
  restartScanSrv(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.RestartScanSrvRes>): grpc.ClientUnaryCall;
  restartScanSrv(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.RestartScanSrvRes>): grpc.ClientUnaryCall;
  checkSelf(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.CheckSelfRes>): grpc.ClientUnaryCall;
  checkSelf(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CheckSelfRes>): grpc.ClientUnaryCall;
  checkSelf(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CheckSelfRes>): grpc.ClientUnaryCall;
  thirdBind(argument: control_pb.CommonReq, callback: grpc.requestCallback<control_pb.ThirdBindRes>): grpc.ClientUnaryCall;
  thirdBind(argument: control_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.ThirdBindRes>): grpc.ClientUnaryCall;
  thirdBind(argument: control_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.ThirdBindRes>): grpc.ClientUnaryCall;
  changeTimeZone(argument: control_pb.ChangeTimeZoneReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  changeTimeZone(argument: control_pb.ChangeTimeZoneReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  changeTimeZone(argument: control_pb.ChangeTimeZoneReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
}

interface IMeasureService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  weightResult: grpc.MethodDefinition<control_pb.WeightResultReq, control_pb.CommonRes>;
  bodyResult: grpc.MethodDefinition<control_pb.BodyResultReq, control_pb.CommonRes>;
  scanResult: grpc.MethodDefinition<control_pb.ScanResultReq, control_pb.CommonRes>;
  shoulderResult: grpc.MethodDefinition<control_pb.ShoulderResultReq, control_pb.CommonRes>;
  turnTableResistance: grpc.MethodDefinition<control_pb.TurnTableResistanceReq, control_pb.CommonRes>;
  evalWeightResult: grpc.MethodDefinition<control_pb.EvalWeightResultReq, control_pb.CommonRes>;
  balanceResult: grpc.MethodDefinition<control_pb.BalanceResultReq, control_pb.CommonRes>;
}

export const MeasureService: IMeasureService;

export interface IMeasureServer extends grpc.UntypedServiceImplementation {
  weightResult: grpc.handleUnaryCall<control_pb.WeightResultReq, control_pb.CommonRes>;
  bodyResult: grpc.handleUnaryCall<control_pb.BodyResultReq, control_pb.CommonRes>;
  scanResult: grpc.handleUnaryCall<control_pb.ScanResultReq, control_pb.CommonRes>;
  shoulderResult: grpc.handleUnaryCall<control_pb.ShoulderResultReq, control_pb.CommonRes>;
  turnTableResistance: grpc.handleUnaryCall<control_pb.TurnTableResistanceReq, control_pb.CommonRes>;
  evalWeightResult: grpc.handleUnaryCall<control_pb.EvalWeightResultReq, control_pb.CommonRes>;
  balanceResult: grpc.handleUnaryCall<control_pb.BalanceResultReq, control_pb.CommonRes>;
}

export class MeasureClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  weightResult(argument: control_pb.WeightResultReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  weightResult(argument: control_pb.WeightResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  weightResult(argument: control_pb.WeightResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyResult(argument: control_pb.BodyResultReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyResult(argument: control_pb.BodyResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyResult(argument: control_pb.BodyResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  scanResult(argument: control_pb.ScanResultReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  scanResult(argument: control_pb.ScanResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  scanResult(argument: control_pb.ScanResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  shoulderResult(argument: control_pb.ShoulderResultReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  shoulderResult(argument: control_pb.ShoulderResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  shoulderResult(argument: control_pb.ShoulderResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  turnTableResistance(argument: control_pb.TurnTableResistanceReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  turnTableResistance(argument: control_pb.TurnTableResistanceReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  turnTableResistance(argument: control_pb.TurnTableResistanceReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  evalWeightResult(argument: control_pb.EvalWeightResultReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  evalWeightResult(argument: control_pb.EvalWeightResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  evalWeightResult(argument: control_pb.EvalWeightResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  balanceResult(argument: control_pb.BalanceResultReq, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  balanceResult(argument: control_pb.BalanceResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
  balanceResult(argument: control_pb.BalanceResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<control_pb.CommonRes>): grpc.ClientUnaryCall;
}
