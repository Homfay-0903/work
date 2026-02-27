// GENERATED CODE -- DO NOT EDIT!

// package: client
// file: client.proto

import * as client_pb from "./client_pb";
import * as grpc from "@grpc/grpc-js";

interface IControlService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  external: grpc.MethodDefinition<client_pb.ExternalReq, client_pb.CommonRes>;
  networkSpeed: grpc.MethodDefinition<client_pb.NetworkSpeedReq, client_pb.CommonRes>;
  upLoadNetSpeed: grpc.MethodDefinition<client_pb.NetSpeedReq, client_pb.CommonRes>;
  downLoadNetSpeed: grpc.MethodDefinition<client_pb.NetSpeedReq, client_pb.CommonRes>;
  printResult: grpc.MethodDefinition<client_pb.PrintResultReq, client_pb.CommonRes>;
  thirdBindResult: grpc.MethodDefinition<client_pb.ThirdBindResultReq, client_pb.CommonRes>;
}

export const ControlService: IControlService;

export interface IControlServer extends grpc.UntypedServiceImplementation {
  external: grpc.handleUnaryCall<client_pb.ExternalReq, client_pb.CommonRes>;
  networkSpeed: grpc.handleUnaryCall<client_pb.NetworkSpeedReq, client_pb.CommonRes>;
  upLoadNetSpeed: grpc.handleUnaryCall<client_pb.NetSpeedReq, client_pb.CommonRes>;
  downLoadNetSpeed: grpc.handleUnaryCall<client_pb.NetSpeedReq, client_pb.CommonRes>;
  printResult: grpc.handleUnaryCall<client_pb.PrintResultReq, client_pb.CommonRes>;
  thirdBindResult: grpc.handleUnaryCall<client_pb.ThirdBindResultReq, client_pb.CommonRes>;
}

export class ControlClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  external(argument: client_pb.ExternalReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  external(argument: client_pb.ExternalReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  external(argument: client_pb.ExternalReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  networkSpeed(argument: client_pb.NetworkSpeedReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  networkSpeed(argument: client_pb.NetworkSpeedReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  networkSpeed(argument: client_pb.NetworkSpeedReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  upLoadNetSpeed(argument: client_pb.NetSpeedReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  upLoadNetSpeed(argument: client_pb.NetSpeedReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  upLoadNetSpeed(argument: client_pb.NetSpeedReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  downLoadNetSpeed(argument: client_pb.NetSpeedReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  downLoadNetSpeed(argument: client_pb.NetSpeedReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  downLoadNetSpeed(argument: client_pb.NetSpeedReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  printResult(argument: client_pb.PrintResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  printResult(argument: client_pb.PrintResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  printResult(argument: client_pb.PrintResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  thirdBindResult(argument: client_pb.ThirdBindResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  thirdBindResult(argument: client_pb.ThirdBindResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  thirdBindResult(argument: client_pb.ThirdBindResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
}

interface IUpdateService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  newVersion: grpc.MethodDefinition<client_pb.NewVersionReq, client_pb.CommonRes>;
  notifyState: grpc.MethodDefinition<client_pb.NotifyStateReq, client_pb.CommonRes>;
}

export const UpdateService: IUpdateService;

export interface IUpdateServer extends grpc.UntypedServiceImplementation {
  newVersion: grpc.handleUnaryCall<client_pb.NewVersionReq, client_pb.CommonRes>;
  notifyState: grpc.handleUnaryCall<client_pb.NotifyStateReq, client_pb.CommonRes>;
}

export class UpdateClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  newVersion(argument: client_pb.NewVersionReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  newVersion(argument: client_pb.NewVersionReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  newVersion(argument: client_pb.NewVersionReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  notifyState(argument: client_pb.NotifyStateReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  notifyState(argument: client_pb.NotifyStateReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  notifyState(argument: client_pb.NotifyStateReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
}

interface IHardwareService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  hardwareServiceStatus: grpc.MethodDefinition<client_pb.HardwareServiceStatusReq, client_pb.CommonRes>;
  screenStatus: grpc.MethodDefinition<client_pb.ScreenStatusReq, client_pb.CommonRes>;
  hardwareCheckSelf: grpc.MethodDefinition<client_pb.HardwareSelfCheckReq, client_pb.CommonRes>;
  weightMeasureResult: grpc.MethodDefinition<client_pb.WeightMeasureResultReq, client_pb.CommonRes>;
  bodyMeasureResult: grpc.MethodDefinition<client_pb.BodyMeasureResultReq, client_pb.CommonRes>;
  tableBodyMeasureResult: grpc.MethodDefinition<client_pb.TableBodyMeasureResultReq, client_pb.CommonRes>;
  standState: grpc.MethodDefinition<client_pb.StandStateReq, client_pb.CommonRes>;
  backlightResult: grpc.MethodDefinition<client_pb.BacklightResultReq, client_pb.CommonRes>;
  tableStop: grpc.MethodDefinition<client_pb.CommonReq, client_pb.CommonRes>;
  buttonEvent: grpc.MethodDefinition<client_pb.ButtonEventReq, client_pb.CommonRes>;
  hardwareStatus: grpc.MethodDefinition<client_pb.HardwareStatusReq, client_pb.CommonRes>;
}

export const HardwareService: IHardwareService;

export interface IHardwareServer extends grpc.UntypedServiceImplementation {
  hardwareServiceStatus: grpc.handleUnaryCall<client_pb.HardwareServiceStatusReq, client_pb.CommonRes>;
  screenStatus: grpc.handleUnaryCall<client_pb.ScreenStatusReq, client_pb.CommonRes>;
  hardwareCheckSelf: grpc.handleUnaryCall<client_pb.HardwareSelfCheckReq, client_pb.CommonRes>;
  weightMeasureResult: grpc.handleUnaryCall<client_pb.WeightMeasureResultReq, client_pb.CommonRes>;
  bodyMeasureResult: grpc.handleUnaryCall<client_pb.BodyMeasureResultReq, client_pb.CommonRes>;
  tableBodyMeasureResult: grpc.handleUnaryCall<client_pb.TableBodyMeasureResultReq, client_pb.CommonRes>;
  standState: grpc.handleUnaryCall<client_pb.StandStateReq, client_pb.CommonRes>;
  backlightResult: grpc.handleUnaryCall<client_pb.BacklightResultReq, client_pb.CommonRes>;
  tableStop: grpc.handleUnaryCall<client_pb.CommonReq, client_pb.CommonRes>;
  buttonEvent: grpc.handleUnaryCall<client_pb.ButtonEventReq, client_pb.CommonRes>;
  hardwareStatus: grpc.handleUnaryCall<client_pb.HardwareStatusReq, client_pb.CommonRes>;
}

export class HardwareClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  hardwareServiceStatus(argument: client_pb.HardwareServiceStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareServiceStatus(argument: client_pb.HardwareServiceStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareServiceStatus(argument: client_pb.HardwareServiceStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  screenStatus(argument: client_pb.ScreenStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  screenStatus(argument: client_pb.ScreenStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  screenStatus(argument: client_pb.ScreenStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareCheckSelf(argument: client_pb.HardwareSelfCheckReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareCheckSelf(argument: client_pb.HardwareSelfCheckReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareCheckSelf(argument: client_pb.HardwareSelfCheckReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  weightMeasureResult(argument: client_pb.WeightMeasureResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  weightMeasureResult(argument: client_pb.WeightMeasureResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  weightMeasureResult(argument: client_pb.WeightMeasureResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyMeasureResult(argument: client_pb.BodyMeasureResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyMeasureResult(argument: client_pb.BodyMeasureResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  bodyMeasureResult(argument: client_pb.BodyMeasureResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  tableBodyMeasureResult(argument: client_pb.TableBodyMeasureResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  tableBodyMeasureResult(argument: client_pb.TableBodyMeasureResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  tableBodyMeasureResult(argument: client_pb.TableBodyMeasureResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  standState(argument: client_pb.StandStateReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  standState(argument: client_pb.StandStateReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  standState(argument: client_pb.StandStateReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightResult(argument: client_pb.BacklightResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightResult(argument: client_pb.BacklightResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  backlightResult(argument: client_pb.BacklightResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  tableStop(argument: client_pb.CommonReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  tableStop(argument: client_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  tableStop(argument: client_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  buttonEvent(argument: client_pb.ButtonEventReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  buttonEvent(argument: client_pb.ButtonEventReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  buttonEvent(argument: client_pb.ButtonEventReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareStatus(argument: client_pb.HardwareStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareStatus(argument: client_pb.HardwareStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  hardwareStatus(argument: client_pb.HardwareStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
}

interface IAlgorithmService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  serviceStatus: grpc.MethodDefinition<client_pb.AlgServiceStatusReq, client_pb.CommonRes>;
  checkSelf: grpc.MethodDefinition<client_pb.CheckSelfReq, client_pb.CommonRes>;
  depthCameraStatus: grpc.MethodDefinition<client_pb.DepthCameraStatusReq, client_pb.CommonRes>;
  fisheyeCameraStatus: grpc.MethodDefinition<client_pb.FisheyeCameraStatusReq, client_pb.CommonRes>;
  surveyorStatus: grpc.MethodDefinition<client_pb.SurveyorStatusReq, client_pb.CommonRes>;
  errorStatus: grpc.MethodDefinition<client_pb.ErrorStatusReq, client_pb.CommonRes>;
  aposeDetectResult: grpc.MethodDefinition<client_pb.AposeDetectResultReq, client_pb.CommonRes>;
  iposeDetectResult: grpc.MethodDefinition<client_pb.IposeDetectResultReq, client_pb.CommonRes>;
  scanResult: grpc.MethodDefinition<client_pb.ScanResultReq, client_pb.CommonRes>;
  startTable: grpc.MethodDefinition<client_pb.CommonReq, client_pb.CommonRes>;
  rotateHalf: grpc.MethodDefinition<client_pb.CommonReq, client_pb.CommonRes>;
  startDetectClientStatus: grpc.MethodDefinition<client_pb.CommonReq, client_pb.CommonRes>;
  gestureDetectResult: grpc.MethodDefinition<client_pb.GestureDetectResultReq, client_pb.CommonRes>;
  personDetectResult: grpc.MethodDefinition<client_pb.PersonDetectResultReq, client_pb.CommonRes>;
  gestureIposeResult: grpc.MethodDefinition<client_pb.GestureIposeResultReq, client_pb.CommonRes>;
  ambientLightResult: grpc.MethodDefinition<client_pb.AmbientLightResultReq, client_pb.CommonRes>;
  shoulderDetectResult: grpc.MethodDefinition<client_pb.ShoulderDetectResultReq, client_pb.CommonRes>;
  startShoulderLegalityResult: grpc.MethodDefinition<client_pb.StartShoulderLegalityResultReq, client_pb.CommonRes>;
  qRCodeScanResult: grpc.MethodDefinition<client_pb.QRCodeScanResultReq, client_pb.CommonRes>;
  startStream: grpc.MethodDefinition<client_pb.CommonReq, client_pb.CommonRes>;
  heightMeasurementResult: grpc.MethodDefinition<client_pb.HeightMeasurementReq, client_pb.CommonRes>;
  aposeAngleResult: grpc.MethodDefinition<client_pb.AposeAngleReq, client_pb.CommonRes>;
}

export const AlgorithmService: IAlgorithmService;

export interface IAlgorithmServer extends grpc.UntypedServiceImplementation {
  serviceStatus: grpc.handleUnaryCall<client_pb.AlgServiceStatusReq, client_pb.CommonRes>;
  checkSelf: grpc.handleUnaryCall<client_pb.CheckSelfReq, client_pb.CommonRes>;
  depthCameraStatus: grpc.handleUnaryCall<client_pb.DepthCameraStatusReq, client_pb.CommonRes>;
  fisheyeCameraStatus: grpc.handleUnaryCall<client_pb.FisheyeCameraStatusReq, client_pb.CommonRes>;
  surveyorStatus: grpc.handleUnaryCall<client_pb.SurveyorStatusReq, client_pb.CommonRes>;
  errorStatus: grpc.handleUnaryCall<client_pb.ErrorStatusReq, client_pb.CommonRes>;
  aposeDetectResult: grpc.handleUnaryCall<client_pb.AposeDetectResultReq, client_pb.CommonRes>;
  iposeDetectResult: grpc.handleUnaryCall<client_pb.IposeDetectResultReq, client_pb.CommonRes>;
  scanResult: grpc.handleUnaryCall<client_pb.ScanResultReq, client_pb.CommonRes>;
  startTable: grpc.handleUnaryCall<client_pb.CommonReq, client_pb.CommonRes>;
  rotateHalf: grpc.handleUnaryCall<client_pb.CommonReq, client_pb.CommonRes>;
  startDetectClientStatus: grpc.handleUnaryCall<client_pb.CommonReq, client_pb.CommonRes>;
  gestureDetectResult: grpc.handleUnaryCall<client_pb.GestureDetectResultReq, client_pb.CommonRes>;
  personDetectResult: grpc.handleUnaryCall<client_pb.PersonDetectResultReq, client_pb.CommonRes>;
  gestureIposeResult: grpc.handleUnaryCall<client_pb.GestureIposeResultReq, client_pb.CommonRes>;
  ambientLightResult: grpc.handleUnaryCall<client_pb.AmbientLightResultReq, client_pb.CommonRes>;
  shoulderDetectResult: grpc.handleUnaryCall<client_pb.ShoulderDetectResultReq, client_pb.CommonRes>;
  startShoulderLegalityResult: grpc.handleUnaryCall<client_pb.StartShoulderLegalityResultReq, client_pb.CommonRes>;
  qRCodeScanResult: grpc.handleUnaryCall<client_pb.QRCodeScanResultReq, client_pb.CommonRes>;
  startStream: grpc.handleUnaryCall<client_pb.CommonReq, client_pb.CommonRes>;
  heightMeasurementResult: grpc.handleUnaryCall<client_pb.HeightMeasurementReq, client_pb.CommonRes>;
  aposeAngleResult: grpc.handleUnaryCall<client_pb.AposeAngleReq, client_pb.CommonRes>;
}

export class AlgorithmClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  serviceStatus(argument: client_pb.AlgServiceStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: client_pb.AlgServiceStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  serviceStatus(argument: client_pb.AlgServiceStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: client_pb.CheckSelfReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: client_pb.CheckSelfReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  checkSelf(argument: client_pb.CheckSelfReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  depthCameraStatus(argument: client_pb.DepthCameraStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  depthCameraStatus(argument: client_pb.DepthCameraStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  depthCameraStatus(argument: client_pb.DepthCameraStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  fisheyeCameraStatus(argument: client_pb.FisheyeCameraStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  fisheyeCameraStatus(argument: client_pb.FisheyeCameraStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  fisheyeCameraStatus(argument: client_pb.FisheyeCameraStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  surveyorStatus(argument: client_pb.SurveyorStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  surveyorStatus(argument: client_pb.SurveyorStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  surveyorStatus(argument: client_pb.SurveyorStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  errorStatus(argument: client_pb.ErrorStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  errorStatus(argument: client_pb.ErrorStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  errorStatus(argument: client_pb.ErrorStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  aposeDetectResult(argument: client_pb.AposeDetectResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  aposeDetectResult(argument: client_pb.AposeDetectResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  aposeDetectResult(argument: client_pb.AposeDetectResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  iposeDetectResult(argument: client_pb.IposeDetectResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  iposeDetectResult(argument: client_pb.IposeDetectResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  iposeDetectResult(argument: client_pb.IposeDetectResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  scanResult(argument: client_pb.ScanResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  scanResult(argument: client_pb.ScanResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  scanResult(argument: client_pb.ScanResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startTable(argument: client_pb.CommonReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startTable(argument: client_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startTable(argument: client_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  rotateHalf(argument: client_pb.CommonReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  rotateHalf(argument: client_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  rotateHalf(argument: client_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startDetectClientStatus(argument: client_pb.CommonReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startDetectClientStatus(argument: client_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startDetectClientStatus(argument: client_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  gestureDetectResult(argument: client_pb.GestureDetectResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  gestureDetectResult(argument: client_pb.GestureDetectResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  gestureDetectResult(argument: client_pb.GestureDetectResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  personDetectResult(argument: client_pb.PersonDetectResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  personDetectResult(argument: client_pb.PersonDetectResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  personDetectResult(argument: client_pb.PersonDetectResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  gestureIposeResult(argument: client_pb.GestureIposeResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  gestureIposeResult(argument: client_pb.GestureIposeResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  gestureIposeResult(argument: client_pb.GestureIposeResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  ambientLightResult(argument: client_pb.AmbientLightResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  ambientLightResult(argument: client_pb.AmbientLightResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  ambientLightResult(argument: client_pb.AmbientLightResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  shoulderDetectResult(argument: client_pb.ShoulderDetectResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  shoulderDetectResult(argument: client_pb.ShoulderDetectResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  shoulderDetectResult(argument: client_pb.ShoulderDetectResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startShoulderLegalityResult(argument: client_pb.StartShoulderLegalityResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startShoulderLegalityResult(argument: client_pb.StartShoulderLegalityResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startShoulderLegalityResult(argument: client_pb.StartShoulderLegalityResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  qRCodeScanResult(argument: client_pb.QRCodeScanResultReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  qRCodeScanResult(argument: client_pb.QRCodeScanResultReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  qRCodeScanResult(argument: client_pb.QRCodeScanResultReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startStream(argument: client_pb.CommonReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startStream(argument: client_pb.CommonReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  startStream(argument: client_pb.CommonReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  heightMeasurementResult(argument: client_pb.HeightMeasurementReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  heightMeasurementResult(argument: client_pb.HeightMeasurementReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  heightMeasurementResult(argument: client_pb.HeightMeasurementReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  aposeAngleResult(argument: client_pb.AposeAngleReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  aposeAngleResult(argument: client_pb.AposeAngleReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  aposeAngleResult(argument: client_pb.AposeAngleReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
}

interface INetworkService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  wiredNetworkStatus: grpc.MethodDefinition<client_pb.WiredNetworkStatusReq, client_pb.CommonRes>;
  wifiStatus: grpc.MethodDefinition<client_pb.WifiStatusReq, client_pb.CommonRes>;
  wifiList: grpc.MethodDefinition<client_pb.WifiListReq, client_pb.CommonRes>;
  wifiSetStatus: grpc.MethodDefinition<client_pb.WifiSetStatusReq, client_pb.CommonRes>;
}

export const NetworkService: INetworkService;

export interface INetworkServer extends grpc.UntypedServiceImplementation {
  wiredNetworkStatus: grpc.handleUnaryCall<client_pb.WiredNetworkStatusReq, client_pb.CommonRes>;
  wifiStatus: grpc.handleUnaryCall<client_pb.WifiStatusReq, client_pb.CommonRes>;
  wifiList: grpc.handleUnaryCall<client_pb.WifiListReq, client_pb.CommonRes>;
  wifiSetStatus: grpc.handleUnaryCall<client_pb.WifiSetStatusReq, client_pb.CommonRes>;
}

export class NetworkClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  wiredNetworkStatus(argument: client_pb.WiredNetworkStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wiredNetworkStatus(argument: client_pb.WiredNetworkStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wiredNetworkStatus(argument: client_pb.WiredNetworkStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiStatus(argument: client_pb.WifiStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiStatus(argument: client_pb.WifiStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiStatus(argument: client_pb.WifiStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiList(argument: client_pb.WifiListReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiList(argument: client_pb.WifiListReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiList(argument: client_pb.WifiListReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiSetStatus(argument: client_pb.WifiSetStatusReq, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiSetStatus(argument: client_pb.WifiSetStatusReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
  wifiSetStatus(argument: client_pb.WifiSetStatusReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<client_pb.CommonRes>): grpc.ClientUnaryCall;
}
