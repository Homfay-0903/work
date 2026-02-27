// package: control
// file: control.proto

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
  }
}

export class DeviceInfoRes extends jspb.Message {
  getDeviceId(): string;
  setDeviceId(value: string): void;

  getVolume(): number;
  setVolume(value: number): void;

  getMacId(): string;
  setMacId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceInfoRes.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceInfoRes): DeviceInfoRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeviceInfoRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceInfoRes;
  static deserializeBinaryFromReader(message: DeviceInfoRes, reader: jspb.BinaryReader): DeviceInfoRes;
}

export namespace DeviceInfoRes {
  export type AsObject = {
    deviceId: string,
    volume: number,
    macId: string,
  }
}

export class PrintReportReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getLanguage(): string;
  setLanguage(value: string): void;

  getPaperSize(): PrintReportReq.PaperSizeMap[keyof PrintReportReq.PaperSizeMap];
  setPaperSize(value: PrintReportReq.PaperSizeMap[keyof PrintReportReq.PaperSizeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PrintReportReq.AsObject;
  static toObject(includeInstance: boolean, msg: PrintReportReq): PrintReportReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PrintReportReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PrintReportReq;
  static deserializeBinaryFromReader(message: PrintReportReq, reader: jspb.BinaryReader): PrintReportReq;
}

export namespace PrintReportReq {
  export type AsObject = {
    scanId: string,
    language: string,
    paperSize: PrintReportReq.PaperSizeMap[keyof PrintReportReq.PaperSizeMap],
  }

  export interface PaperSizeMap {
    INVALID: 0;
    LETTER: 1;
    LEGAL: 2;
    EXECUTIVE: 3;
    A4: 4;
  }

  export const PaperSize: PaperSizeMap;
}

export class TaskNumRes extends jspb.Message {
  getTaskNum(): number;
  setTaskNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TaskNumRes.AsObject;
  static toObject(includeInstance: boolean, msg: TaskNumRes): TaskNumRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TaskNumRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TaskNumRes;
  static deserializeBinaryFromReader(message: TaskNumRes, reader: jspb.BinaryReader): TaskNumRes;
}

export namespace TaskNumRes {
  export type AsObject = {
    taskNum: number,
  }
}

export class ChangeVolumeReq extends jspb.Message {
  getVolume(): number;
  setVolume(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeVolumeReq.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeVolumeReq): ChangeVolumeReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChangeVolumeReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeVolumeReq;
  static deserializeBinaryFromReader(message: ChangeVolumeReq, reader: jspb.BinaryReader): ChangeVolumeReq;
}

export namespace ChangeVolumeReq {
  export type AsObject = {
    volume: number,
  }
}

export class ChangeVolumeRes extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  getVolume(): number;
  setVolume(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeVolumeRes.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeVolumeRes): ChangeVolumeRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChangeVolumeRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeVolumeRes;
  static deserializeBinaryFromReader(message: ChangeVolumeRes, reader: jspb.BinaryReader): ChangeVolumeRes;
}

export namespace ChangeVolumeRes {
  export type AsObject = {
    result: boolean,
    volume: number,
  }
}

export class RestartScanSrvRes extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestartScanSrvRes.AsObject;
  static toObject(includeInstance: boolean, msg: RestartScanSrvRes): RestartScanSrvRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RestartScanSrvRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestartScanSrvRes;
  static deserializeBinaryFromReader(message: RestartScanSrvRes, reader: jspb.BinaryReader): RestartScanSrvRes;
}

export namespace RestartScanSrvRes {
  export type AsObject = {
    result: boolean,
  }
}

export class CheckSelfRes extends jspb.Message {
  getStatus(): CheckSelfRes.RegisterStatusMap[keyof CheckSelfRes.RegisterStatusMap];
  setStatus(value: CheckSelfRes.RegisterStatusMap[keyof CheckSelfRes.RegisterStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckSelfRes.AsObject;
  static toObject(includeInstance: boolean, msg: CheckSelfRes): CheckSelfRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckSelfRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckSelfRes;
  static deserializeBinaryFromReader(message: CheckSelfRes, reader: jspb.BinaryReader): CheckSelfRes;
}

export namespace CheckSelfRes {
  export type AsObject = {
    status: CheckSelfRes.RegisterStatusMap[keyof CheckSelfRes.RegisterStatusMap],
  }

  export interface RegisterStatusMap {
    INVALID: 0;
    REGISTER_READY: 1;
    SQL_ERR: 2;
    ID_CLASH: 3;
    NET_ABNORMAL: 4;
  }

  export const RegisterStatus: RegisterStatusMap;
}

export class ThirdBindRes extends jspb.Message {
  getStatus(): ThirdBindRes.BindTypeMap[keyof ThirdBindRes.BindTypeMap];
  setStatus(value: ThirdBindRes.BindTypeMap[keyof ThirdBindRes.BindTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ThirdBindRes.AsObject;
  static toObject(includeInstance: boolean, msg: ThirdBindRes): ThirdBindRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ThirdBindRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ThirdBindRes;
  static deserializeBinaryFromReader(message: ThirdBindRes, reader: jspb.BinaryReader): ThirdBindRes;
}

export namespace ThirdBindRes {
  export type AsObject = {
    status: ThirdBindRes.BindTypeMap[keyof ThirdBindRes.BindTypeMap],
  }

  export interface BindTypeMap {
    INVALID: 0;
    NONE: 1;
    APP_BIND: 2;
    CARD_BIND: 3;
    BOTH_BIND: 4;
    QRCODE_BIND: 5;
    FACE_BIND: 6;
    IDENTIFYCARD_BIND: 7;
  }

  export const BindType: BindTypeMap;
}

export class ChangeTimeZoneReq extends jspb.Message {
  getTimeZone(): string;
  setTimeZone(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChangeTimeZoneReq.AsObject;
  static toObject(includeInstance: boolean, msg: ChangeTimeZoneReq): ChangeTimeZoneReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChangeTimeZoneReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChangeTimeZoneReq;
  static deserializeBinaryFromReader(message: ChangeTimeZoneReq, reader: jspb.BinaryReader): ChangeTimeZoneReq;
}

export namespace ChangeTimeZoneReq {
  export type AsObject = {
    timeZone: string,
  }
}

export class WeightResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getWeight(): number;
  setWeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeightResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: WeightResultReq): WeightResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WeightResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeightResultReq;
  static deserializeBinaryFromReader(message: WeightResultReq, reader: jspb.BinaryReader): WeightResultReq;
}

export namespace WeightResultReq {
  export type AsObject = {
    scanId: string,
    weight: number,
  }
}

export class TurnTableResistanceReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getRawCode(): number;
  setRawCode(value: number): void;

  getEnCode(): number;
  setEnCode(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TurnTableResistanceReq.AsObject;
  static toObject(includeInstance: boolean, msg: TurnTableResistanceReq): TurnTableResistanceReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TurnTableResistanceReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TurnTableResistanceReq;
  static deserializeBinaryFromReader(message: TurnTableResistanceReq, reader: jspb.BinaryReader): TurnTableResistanceReq;
}

export namespace TurnTableResistanceReq {
  export type AsObject = {
    scanId: string,
    rawCode: number,
    enCode: number,
  }
}

export class BodyResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  hasData(): boolean;
  clearData(): void;
  getData(): BodyResultReq.Data | undefined;
  setData(value?: BodyResultReq.Data): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BodyResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: BodyResultReq): BodyResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BodyResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BodyResultReq;
  static deserializeBinaryFromReader(message: BodyResultReq, reader: jspb.BinaryReader): BodyResultReq;
}

export namespace BodyResultReq {
  export type AsObject = {
    scanId: string,
    data?: BodyResultReq.Data.AsObject,
  }

  export class Data extends jspb.Message {
    hasBodyInfo(): boolean;
    clearBodyInfo(): void;
    getBodyInfo(): BodyInfo | undefined;
    setBodyInfo(value?: BodyInfo): void;

    hasResInfo(): boolean;
    clearResInfo(): void;
    getResInfo(): ResistanceInfo | undefined;
    setResInfo(value?: ResistanceInfo): void;

    hasSecondResInfo(): boolean;
    clearSecondResInfo(): void;
    getSecondResInfo(): ResistanceInfo | undefined;
    setSecondResInfo(value?: ResistanceInfo): void;

    hasBiaInfo(): boolean;
    clearBiaInfo(): void;
    getBiaInfo(): BIAInfo | undefined;
    setBiaInfo(value?: BIAInfo): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Data.AsObject;
    static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Data;
    static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
  }

  export namespace Data {
    export type AsObject = {
      bodyInfo?: BodyInfo.AsObject,
      resInfo?: ResistanceInfo.AsObject,
      secondResInfo?: ResistanceInfo.AsObject,
      biaInfo?: BIAInfo.AsObject,
    }
  }
}

export class BodyInfo extends jspb.Message {
  getSex(): BodyInfo.SexMap[keyof BodyInfo.SexMap];
  setSex(value: BodyInfo.SexMap[keyof BodyInfo.SexMap]): void;

  getAge(): number;
  setAge(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getWeight(): number;
  setWeight(value: number): void;

  getUserid(): string;
  setUserid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BodyInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BodyInfo): BodyInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BodyInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BodyInfo;
  static deserializeBinaryFromReader(message: BodyInfo, reader: jspb.BinaryReader): BodyInfo;
}

export namespace BodyInfo {
  export type AsObject = {
    sex: BodyInfo.SexMap[keyof BodyInfo.SexMap],
    age: number,
    height: number,
    weight: number,
    userid: string,
  }

  export interface SexMap {
    INVALID: 0;
    MALE: 1;
    FEMALE: 2;
  }

  export const Sex: SexMap;
}

export class ResistanceInfo extends jspb.Message {
  hasRes1k(): boolean;
  clearRes1k(): void;
  getRes1k(): ResistanceBody | undefined;
  setRes1k(value?: ResistanceBody): void;

  hasRes5k(): boolean;
  clearRes5k(): void;
  getRes5k(): ResistanceBody | undefined;
  setRes5k(value?: ResistanceBody): void;

  hasRes50k(): boolean;
  clearRes50k(): void;
  getRes50k(): ResistanceBody | undefined;
  setRes50k(value?: ResistanceBody): void;

  hasRes250k(): boolean;
  clearRes250k(): void;
  getRes250k(): ResistanceBody | undefined;
  setRes250k(value?: ResistanceBody): void;

  hasRes500k(): boolean;
  clearRes500k(): void;
  getRes500k(): ResistanceBody | undefined;
  setRes500k(value?: ResistanceBody): void;

  hasRes1m(): boolean;
  clearRes1m(): void;
  getRes1m(): ResistanceBody | undefined;
  setRes1m(value?: ResistanceBody): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResistanceInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ResistanceInfo): ResistanceInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResistanceInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResistanceInfo;
  static deserializeBinaryFromReader(message: ResistanceInfo, reader: jspb.BinaryReader): ResistanceInfo;
}

export namespace ResistanceInfo {
  export type AsObject = {
    res1k?: ResistanceBody.AsObject,
    res5k?: ResistanceBody.AsObject,
    res50k?: ResistanceBody.AsObject,
    res250k?: ResistanceBody.AsObject,
    res500k?: ResistanceBody.AsObject,
    res1m?: ResistanceBody.AsObject,
  }
}

export class ResistanceBody extends jspb.Message {
  getLeftArm(): number;
  setLeftArm(value: number): void;

  getRightArm(): number;
  setRightArm(value: number): void;

  getLeftLeg(): number;
  setLeftLeg(value: number): void;

  getRightLeg(): number;
  setRightLeg(value: number): void;

  getTorso(): number;
  setTorso(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResistanceBody.AsObject;
  static toObject(includeInstance: boolean, msg: ResistanceBody): ResistanceBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResistanceBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResistanceBody;
  static deserializeBinaryFromReader(message: ResistanceBody, reader: jspb.BinaryReader): ResistanceBody;
}

export namespace ResistanceBody {
  export type AsObject = {
    leftArm: number,
    rightArm: number,
    leftLeg: number,
    rightLeg: number,
    torso: number,
  }
}

export class BIAInfo extends jspb.Message {
  getPbf(): number;
  setPbf(value: number): void;

  getFfm(): number;
  setFfm(value: number): void;

  getBfm(): number;
  setBfm(value: number): void;

  getLmra(): number;
  setLmra(value: number): void;

  getLmla(): number;
  setLmla(value: number): void;

  getLmtr(): number;
  setLmtr(value: number): void;

  getLmrl(): number;
  setLmrl(value: number): void;

  getLmll(): number;
  setLmll(value: number): void;

  getLm(): number;
  setLm(value: number): void;

  getTm(): number;
  setTm(value: number): void;

  getEcfra(): number;
  setEcfra(value: number): void;

  getEcfla(): number;
  setEcfla(value: number): void;

  getEcftr(): number;
  setEcftr(value: number): void;

  getEcfrl(): number;
  setEcfrl(value: number): void;

  getEcfll(): number;
  setEcfll(value: number): void;

  getEcwra(): number;
  setEcwra(value: number): void;

  getEcwla(): number;
  setEcwla(value: number): void;

  getEcwtr(): number;
  setEcwtr(value: number): void;

  getEcwrl(): number;
  setEcwrl(value: number): void;

  getEcwll(): number;
  setEcwll(value: number): void;

  getEcwt(): number;
  setEcwt(value: number): void;

  getEcf(): number;
  setEcf(value: number): void;

  getIcw(): number;
  setIcw(value: number): void;

  getEcw(): number;
  setEcw(value: number): void;

  getTbw(): number;
  setTbw(value: number): void;

  getProtein(): number;
  setProtein(value: number): void;

  getBcm(): number;
  setBcm(value: number): void;

  getPbfmra(): number;
  setPbfmra(value: number): void;

  getPbfmla(): number;
  setPbfmla(value: number): void;

  getPbfmtr(): number;
  setPbfmtr(value: number): void;

  getPbfmrl(): number;
  setPbfmrl(value: number): void;

  getPbfmll(): number;
  setPbfmll(value: number): void;

  getWhr(): number;
  setWhr(value: number): void;

  getVfa(): number;
  setVfa(value: number): void;

  getScore(): number;
  setScore(value: number): void;

  getPbfIval(): number;
  setPbfIval(value: number): void;

  getBmiIval(): number;
  setBmiIval(value: number): void;

  getWhrIval(): number;
  setWhrIval(value: number): void;

  getWtIval(): number;
  setWtIval(value: number): void;

  getBfmIval(): number;
  setBfmIval(value: number): void;

  getFfmIval(): number;
  setFfmIval(value: number): void;

  getBmrIval(): number;
  setBmrIval(value: number): void;

  getTmIval(): number;
  setTmIval(value: number): void;

  getBmcIval(): number;
  setBmcIval(value: number): void;

  getLmIval(): number;
  setLmIval(value: number): void;

  getTbwIval(): number;
  setTbwIval(value: number): void;

  getProteinIval(): number;
  setProteinIval(value: number): void;

  getEcwIval(): number;
  setEcwIval(value: number): void;

  getIcwIval(): number;
  setIcwIval(value: number): void;

  getLmaIval(): number;
  setLmaIval(value: number): void;

  getLmtIval(): number;
  setLmtIval(value: number): void;

  getLmlIval(): number;
  setLmlIval(value: number): void;

  getBfmaIval(): number;
  setBfmaIval(value: number): void;

  getBfmtIval(): number;
  setBfmtIval(value: number): void;

  getBfmlIval(): number;
  setBfmlIval(value: number): void;

  getBcmIval(): number;
  setBcmIval(value: number): void;

  getPlmra(): number;
  setPlmra(value: number): void;

  getPlmla(): number;
  setPlmla(value: number): void;

  getPlmtr(): number;
  setPlmtr(value: number): void;

  getPlmrl(): number;
  setPlmrl(value: number): void;

  getPlmll(): number;
  setPlmll(value: number): void;

  getCmt(): number;
  setCmt(value: number): void;

  getCmm(): number;
  setCmm(value: number): void;

  getCmf(): number;
  setCmf(value: number): void;

  getBmr(): number;
  setBmr(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BIAInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BIAInfo): BIAInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BIAInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BIAInfo;
  static deserializeBinaryFromReader(message: BIAInfo, reader: jspb.BinaryReader): BIAInfo;
}

export namespace BIAInfo {
  export type AsObject = {
    pbf: number,
    ffm: number,
    bfm: number,
    lmra: number,
    lmla: number,
    lmtr: number,
    lmrl: number,
    lmll: number,
    lm: number,
    tm: number,
    ecfra: number,
    ecfla: number,
    ecftr: number,
    ecfrl: number,
    ecfll: number,
    ecwra: number,
    ecwla: number,
    ecwtr: number,
    ecwrl: number,
    ecwll: number,
    ecwt: number,
    ecf: number,
    icw: number,
    ecw: number,
    tbw: number,
    protein: number,
    bcm: number,
    pbfmra: number,
    pbfmla: number,
    pbfmtr: number,
    pbfmrl: number,
    pbfmll: number,
    whr: number,
    vfa: number,
    score: number,
    pbfIval: number,
    bmiIval: number,
    whrIval: number,
    wtIval: number,
    bfmIval: number,
    ffmIval: number,
    bmrIval: number,
    tmIval: number,
    bmcIval: number,
    lmIval: number,
    tbwIval: number,
    proteinIval: number,
    ecwIval: number,
    icwIval: number,
    lmaIval: number,
    lmtIval: number,
    lmlIval: number,
    bfmaIval: number,
    bfmtIval: number,
    bfmlIval: number,
    bcmIval: number,
    plmra: number,
    plmla: number,
    plmtr: number,
    plmrl: number,
    plmll: number,
    cmt: number,
    cmm: number,
    cmf: number,
    bmr: number,
  }
}

export class ScanResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getScanType(): ScanResultReq.ScanTypeMap[keyof ScanResultReq.ScanTypeMap];
  setScanType(value: ScanResultReq.ScanTypeMap[keyof ScanResultReq.ScanTypeMap]): void;

  getImagePath(): string;
  setImagePath(value: string): void;

  getImageRawPath(): string;
  setImageRawPath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScanResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: ScanResultReq): ScanResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScanResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScanResultReq;
  static deserializeBinaryFromReader(message: ScanResultReq, reader: jspb.BinaryReader): ScanResultReq;
}

export namespace ScanResultReq {
  export type AsObject = {
    scanId: string,
    scanType: ScanResultReq.ScanTypeMap[keyof ScanResultReq.ScanTypeMap],
    imagePath: string,
    imageRawPath: string,
  }

  export interface ScanTypeMap {
    INVALID: 0;
    BODY_SCAN_NORMAL: 1;
    BODY_SCAN_POSTURE: 2;
  }

  export const ScanType: ScanTypeMap;
}

export class ShoulderResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getMeasureTime(): number;
  setMeasureTime(value: number): void;

  getLeftAbduction(): number;
  setLeftAbduction(value: number): void;

  getRightAbduction(): number;
  setRightAbduction(value: number): void;

  getLeftAntexion(): number;
  setLeftAntexion(value: number): void;

  getRightAntexion(): number;
  setRightAntexion(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShoulderResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: ShoulderResultReq): ShoulderResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ShoulderResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShoulderResultReq;
  static deserializeBinaryFromReader(message: ShoulderResultReq, reader: jspb.BinaryReader): ShoulderResultReq;
}

export namespace ShoulderResultReq {
  export type AsObject = {
    scanId: string,
    measureTime: number,
    leftAbduction: number,
    rightAbduction: number,
    leftAntexion: number,
    rightAntexion: number,
  }
}

export class EvalWeightResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getWeight(): number;
  setWeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EvalWeightResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: EvalWeightResultReq): EvalWeightResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EvalWeightResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EvalWeightResultReq;
  static deserializeBinaryFromReader(message: EvalWeightResultReq, reader: jspb.BinaryReader): EvalWeightResultReq;
}

export namespace EvalWeightResultReq {
  export type AsObject = {
    scanId: string,
    weight: number,
  }
}

export class Point extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Point.AsObject;
  static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Point;
  static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class BalanceItemData extends jspb.Message {
  clearPointsList(): void;
  getPointsList(): Array<Point>;
  setPointsList(value: Array<Point>): void;
  addPoints(value?: Point, index?: number): Point;

  getArea(): number;
  setArea(value: number): void;

  getSpeed(): number;
  setSpeed(value: number): void;

  getDistance(): number;
  setDistance(value: number): void;

  getSwayIndex(): number;
  setSwayIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BalanceItemData.AsObject;
  static toObject(includeInstance: boolean, msg: BalanceItemData): BalanceItemData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BalanceItemData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BalanceItemData;
  static deserializeBinaryFromReader(message: BalanceItemData, reader: jspb.BinaryReader): BalanceItemData;
}

export namespace BalanceItemData {
  export type AsObject = {
    pointsList: Array<Point.AsObject>,
    area: number,
    speed: number,
    distance: number,
    swayIndex: number,
  }
}

export class BalanceResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getStatus(): number;
  setStatus(value: number): void;

  hasEyeCloseData(): boolean;
  clearEyeCloseData(): void;
  getEyeCloseData(): BalanceItemData | undefined;
  setEyeCloseData(value?: BalanceItemData): void;

  hasEyeOpenData(): boolean;
  clearEyeOpenData(): void;
  getEyeOpenData(): BalanceItemData | undefined;
  setEyeOpenData(value?: BalanceItemData): void;

  getMeasureTime(): number;
  setMeasureTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BalanceResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: BalanceResultReq): BalanceResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BalanceResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BalanceResultReq;
  static deserializeBinaryFromReader(message: BalanceResultReq, reader: jspb.BinaryReader): BalanceResultReq;
}

export namespace BalanceResultReq {
  export type AsObject = {
    scanId: string,
    status: number,
    eyeCloseData?: BalanceItemData.AsObject,
    eyeOpenData?: BalanceItemData.AsObject,
    measureTime: number,
  }
}

