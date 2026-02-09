// package: notifyStatus
// file: notify_status.proto

import * as jspb from "google-protobuf";

export class CommonReq extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonReq.AsObject;
  static toObject(includeInstance: boolean, msg: CommonReq): CommonReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonReq;
  static deserializeBinaryFromReader(message: CommonReq, reader: jspb.BinaryReader): CommonReq;
}

export namespace CommonReq {
  export type AsObject = {
  }
}

export class CommonRes extends jspb.Message {
  getCode(): CommonRes.CodeMap[keyof CommonRes.CodeMap];
  setCode(value: CommonRes.CodeMap[keyof CommonRes.CodeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonRes.AsObject;
  static toObject(includeInstance: boolean, msg: CommonRes): CommonRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonRes;
  static deserializeBinaryFromReader(message: CommonRes, reader: jspb.BinaryReader): CommonRes;
}

export namespace CommonRes {
  export type AsObject = {
    code: CommonRes.CodeMap[keyof CommonRes.CodeMap],
  }

  export interface CodeMap {
    OK: 0;
  }

  export const Code: CodeMap;
}

export class RegisterReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getDeviceMac(): string;
  setDeviceMac(value: string): void;

  getDeviceVersion(): string;
  setDeviceVersion(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterReq.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterReq): RegisterReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterReq;
  static deserializeBinaryFromReader(message: RegisterReq, reader: jspb.BinaryReader): RegisterReq;
}

export namespace RegisterReq {
  export type AsObject = {
    deviceId: string,
    deviceMac: string,
    deviceVersion: string,
  }
}

export class RegisterRes extends jspb.Message {
  getStatus(): boolean;
  setStatus(value: boolean): void;

  getTimeZone(): string;
  setTimeZone(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterRes.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterRes): RegisterRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterRes;
  static deserializeBinaryFromReader(message: RegisterRes, reader: jspb.BinaryReader): RegisterRes;
}

export namespace RegisterRes {
  export type AsObject = {
    status: boolean,
    timeZone: string,
  }
}

export class GetQRCodeReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getScanId(): string;
  setScanId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetQRCodeReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetQRCodeReq): GetQRCodeReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetQRCodeReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetQRCodeReq;
  static deserializeBinaryFromReader(message: GetQRCodeReq, reader: jspb.BinaryReader): GetQRCodeReq;
}

export namespace GetQRCodeReq {
  export type AsObject = {
    deviceId: string,
    scanId: string,
  }
}

export class GetQRCodeRes extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getScanId(): string;
  setScanId(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getIsThirdCode(): boolean;
  setIsThirdCode(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetQRCodeRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetQRCodeRes): GetQRCodeRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetQRCodeRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetQRCodeRes;
  static deserializeBinaryFromReader(message: GetQRCodeRes, reader: jspb.BinaryReader): GetQRCodeRes;
}

export namespace GetQRCodeRes {
  export type AsObject = {
    deviceId: string,
    scanId: string,
    data: Uint8Array | string,
    isThirdCode: boolean,
  }
}

export class GetScanInfoReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getScanId(): string;
  setScanId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetScanInfoReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetScanInfoReq): GetScanInfoReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetScanInfoReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetScanInfoReq;
  static deserializeBinaryFromReader(message: GetScanInfoReq, reader: jspb.BinaryReader): GetScanInfoReq;
}

export namespace GetScanInfoReq {
  export type AsObject = {
    deviceId: string,
    scanId: string,
  }
}

export class ScanInfo extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getScanId(): string;
  setScanId(value: string): void;

  getBiaStatus(): TaskStatusMap[keyof TaskStatusMap];
  setBiaStatus(value: TaskStatusMap[keyof TaskStatusMap]): void;

  getEvalStatus(): TaskStatusMap[keyof TaskStatusMap];
  setEvalStatus(value: TaskStatusMap[keyof TaskStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScanInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ScanInfo): ScanInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScanInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScanInfo;
  static deserializeBinaryFromReader(message: ScanInfo, reader: jspb.BinaryReader): ScanInfo;
}

export namespace ScanInfo {
  export type AsObject = {
    id: string,
    scanId: string,
    biaStatus: TaskStatusMap[keyof TaskStatusMap],
    evalStatus: TaskStatusMap[keyof TaskStatusMap],
  }
}

export class GetScanInfoRes extends jspb.Message {
  hasScanInfo(): boolean;
  clearScanInfo(): void;
  getScanInfo(): ScanInfo | undefined;
  setScanInfo(value?: ScanInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetScanInfoRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetScanInfoRes): GetScanInfoRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetScanInfoRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetScanInfoRes;
  static deserializeBinaryFromReader(message: GetScanInfoRes, reader: jspb.BinaryReader): GetScanInfoRes;
}

export namespace GetScanInfoRes {
  export type AsObject = {
    scanInfo?: ScanInfo.AsObject,
  }
}

export class CreateScanTypeReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getScanId(): string;
  setScanId(value: string): void;

  getBiaMeasure(): number;
  setBiaMeasure(value: number): void;

  getEvalMeasure(): number;
  setEvalMeasure(value: number): void;

  getGirthMeasure(): number;
  setGirthMeasure(value: number): void;

  getShoulderJointEval(): number;
  setShoulderJointEval(value: number): void;

  getUtc(): string;
  setUtc(value: string): void;

  getTimeZone(): string;
  setTimeZone(value: string): void;

  getScanMode(): number;
  setScanMode(value: number): void;

  getNutrition(): number;
  setNutrition(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getBeauty(): number;
  setBeauty(value: number): void;

  getWeightMeasure(): number;
  setWeightMeasure(value: number): void;

  getAthlete(): number;
  setAthlete(value: number): void;

  getBalanceMeasure(): number;
  setBalanceMeasure(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateScanTypeReq.AsObject;
  static toObject(includeInstance: boolean, msg: CreateScanTypeReq): CreateScanTypeReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateScanTypeReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateScanTypeReq;
  static deserializeBinaryFromReader(message: CreateScanTypeReq, reader: jspb.BinaryReader): CreateScanTypeReq;
}

export namespace CreateScanTypeReq {
  export type AsObject = {
    deviceId: string,
    scanId: string,
    biaMeasure: number,
    evalMeasure: number,
    girthMeasure: number,
    shoulderJointEval: number,
    utc: string,
    timeZone: string,
    scanMode: number,
    nutrition: number,
    height: number,
    beauty: number,
    weightMeasure: number,
    athlete: number,
    balanceMeasure: number,
  }
}

export class CreateScanTypeRes extends jspb.Message {
  getCreateTime(): number;
  setCreateTime(value: number): void;

  getScanId(): string;
  setScanId(value: string): void;

  getCodeNum(): string;
  setCodeNum(value: string): void;

  getScanTime(): string;
  setScanTime(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateScanTypeRes.AsObject;
  static toObject(includeInstance: boolean, msg: CreateScanTypeRes): CreateScanTypeRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateScanTypeRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateScanTypeRes;
  static deserializeBinaryFromReader(message: CreateScanTypeRes, reader: jspb.BinaryReader): CreateScanTypeRes;
}

export namespace CreateScanTypeRes {
  export type AsObject = {
    createTime: number,
    scanId: string,
    codeNum: string,
    scanTime: string,
  }
}

export class CreateScanMeasureModeReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getIsGirthEvalCombo(): number;
  setIsGirthEvalCombo(value: number): void;

  getScanMode(): number;
  setScanMode(value: number): void;

  getCreateTime(): number;
  setCreateTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateScanMeasureModeReq.AsObject;
  static toObject(includeInstance: boolean, msg: CreateScanMeasureModeReq): CreateScanMeasureModeReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateScanMeasureModeReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateScanMeasureModeReq;
  static deserializeBinaryFromReader(message: CreateScanMeasureModeReq, reader: jspb.BinaryReader): CreateScanMeasureModeReq;
}

export namespace CreateScanMeasureModeReq {
  export type AsObject = {
    scanId: string,
    isGirthEvalCombo: number,
    scanMode: number,
    createTime: number,
  }
}

export class GetDeviceExpireReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeviceExpireReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeviceExpireReq): GetDeviceExpireReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeviceExpireReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeviceExpireReq;
  static deserializeBinaryFromReader(message: GetDeviceExpireReq, reader: jspb.BinaryReader): GetDeviceExpireReq;
}

export namespace GetDeviceExpireReq {
  export type AsObject = {
    deviceId: string,
  }
}

export class GetDeviceExpireRes extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getStatus(): GetDeviceExpireRes.DeviceExpireStatusMap[keyof GetDeviceExpireRes.DeviceExpireStatusMap];
  setStatus(value: GetDeviceExpireRes.DeviceExpireStatusMap[keyof GetDeviceExpireRes.DeviceExpireStatusMap]): void;

  getExpirationTime(): number;
  setExpirationTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDeviceExpireRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetDeviceExpireRes): GetDeviceExpireRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDeviceExpireRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDeviceExpireRes;
  static deserializeBinaryFromReader(message: GetDeviceExpireRes, reader: jspb.BinaryReader): GetDeviceExpireRes;
}

export namespace GetDeviceExpireRes {
  export type AsObject = {
    deviceId: string,
    status: GetDeviceExpireRes.DeviceExpireStatusMap[keyof GetDeviceExpireRes.DeviceExpireStatusMap],
    expirationTime: number,
  }

  export interface DeviceExpireStatusMap {
    NULL: 0;
    NORMAL: 1;
    WARNING_BEFORE: 2;
    WARNING_AFTER: 3;
    UNAVAILABLE: 4;
  }

  export const DeviceExpireStatus: DeviceExpireStatusMap;
}

export class NotifyTaskStatusReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NotifyTaskStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: NotifyTaskStatusReq): NotifyTaskStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NotifyTaskStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NotifyTaskStatusReq;
  static deserializeBinaryFromReader(message: NotifyTaskStatusReq, reader: jspb.BinaryReader): NotifyTaskStatusReq;
}

export namespace NotifyTaskStatusReq {
  export type AsObject = {
    deviceId: string,
  }
}

export class NotifyTaskStatusRes extends jspb.Message {
  getStreamType(): NotifyTaskStatusRes.StreamTypeMap[keyof NotifyTaskStatusRes.StreamTypeMap];
  setStreamType(value: NotifyTaskStatusRes.StreamTypeMap[keyof NotifyTaskStatusRes.StreamTypeMap]): void;

  hasScanInfo(): boolean;
  clearScanInfo(): void;
  getScanInfo(): ScanInfo | undefined;
  setScanInfo(value?: ScanInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NotifyTaskStatusRes.AsObject;
  static toObject(includeInstance: boolean, msg: NotifyTaskStatusRes): NotifyTaskStatusRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NotifyTaskStatusRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NotifyTaskStatusRes;
  static deserializeBinaryFromReader(message: NotifyTaskStatusRes, reader: jspb.BinaryReader): NotifyTaskStatusRes;
}

export namespace NotifyTaskStatusRes {
  export type AsObject = {
    streamType: NotifyTaskStatusRes.StreamTypeMap[keyof NotifyTaskStatusRes.StreamTypeMap],
    scanInfo?: ScanInfo.AsObject,
  }

  export interface StreamTypeMap {
    INVALID: 0;
    SCAN_INFO: 1;
    NOTIFY_TASK: 2;
  }

  export const StreamType: StreamTypeMap;
}

export class GetAIDeviceExpireReq extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAIDeviceExpireReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetAIDeviceExpireReq): GetAIDeviceExpireReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAIDeviceExpireReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAIDeviceExpireReq;
  static deserializeBinaryFromReader(message: GetAIDeviceExpireReq, reader: jspb.BinaryReader): GetAIDeviceExpireReq;
}

export namespace GetAIDeviceExpireReq {
  export type AsObject = {
    deviceId: string,
  }
}

export class GetAIDeviceExpireRes extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getStatus(): GetAIDeviceExpireRes.AIExpireStatusMap[keyof GetAIDeviceExpireRes.AIExpireStatusMap];
  setStatus(value: GetAIDeviceExpireRes.AIExpireStatusMap[keyof GetAIDeviceExpireRes.AIExpireStatusMap]): void;

  getExpirationTime(): number;
  setExpirationTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAIDeviceExpireRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetAIDeviceExpireRes): GetAIDeviceExpireRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAIDeviceExpireRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAIDeviceExpireRes;
  static deserializeBinaryFromReader(message: GetAIDeviceExpireRes, reader: jspb.BinaryReader): GetAIDeviceExpireRes;
}

export namespace GetAIDeviceExpireRes {
  export type AsObject = {
    deviceId: string,
    status: GetAIDeviceExpireRes.AIExpireStatusMap[keyof GetAIDeviceExpireRes.AIExpireStatusMap],
    expirationTime: number,
  }

  export interface AIExpireStatusMap {
    NULL: 0;
    NO_ACTIVE: 1;
    NORMAL: 2;
    WARNING_BEFORE: 3;
    WARNING_AFTER: 4;
    UNAVAILABLE: 5;
  }

  export const AIExpireStatus: AIExpireStatusMap;
}

export interface TaskStatusMap {
  INVALID: 0;
  REGISTER: 1;
  NONE: 2;
  FAILED: 3;
  SUCCESS: 4;
  PROGRESS: 5;
}

export const TaskStatus: TaskStatusMap;

