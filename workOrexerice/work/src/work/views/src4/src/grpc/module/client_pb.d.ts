// package: client
// file: client.proto

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

export class ExternalReq extends jspb.Message {
  getPrinter(): ExternalReq.PrinterMap[keyof ExternalReq.PrinterMap];
  setPrinter(value: ExternalReq.PrinterMap[keyof ExternalReq.PrinterMap]): void;

  getUsb(): boolean;
  setUsb(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExternalReq.AsObject;
  static toObject(includeInstance: boolean, msg: ExternalReq): ExternalReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExternalReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExternalReq;
  static deserializeBinaryFromReader(message: ExternalReq, reader: jspb.BinaryReader): ExternalReq;
}

export namespace ExternalReq {
  export type AsObject = {
    printer: ExternalReq.PrinterMap[keyof ExternalReq.PrinterMap],
    usb: boolean,
  }

  export interface PrinterMap {
    INVALID: 0;
    ALL_READY: 1;
    NOT_READY: 2;
    PRINTING: 3;
  }

  export const Printer: PrinterMap;
}

export class NetworkSpeedReq extends jspb.Message {
  getSpeed(): NetworkSpeedReq.SpeedMap[keyof NetworkSpeedReq.SpeedMap];
  setSpeed(value: NetworkSpeedReq.SpeedMap[keyof NetworkSpeedReq.SpeedMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetworkSpeedReq.AsObject;
  static toObject(includeInstance: boolean, msg: NetworkSpeedReq): NetworkSpeedReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NetworkSpeedReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetworkSpeedReq;
  static deserializeBinaryFromReader(message: NetworkSpeedReq, reader: jspb.BinaryReader): NetworkSpeedReq;
}

export namespace NetworkSpeedReq {
  export type AsObject = {
    speed: NetworkSpeedReq.SpeedMap[keyof NetworkSpeedReq.SpeedMap],
  }

  export interface SpeedMap {
    INVALID: 0;
    FAST: 1;
    SLOWER: 2;
    SLOWEST: 3;
  }

  export const Speed: SpeedMap;
}

export class NetSpeedReq extends jspb.Message {
  getStatus(): NetSpeedReq.NetStatusMap[keyof NetSpeedReq.NetStatusMap];
  setStatus(value: NetSpeedReq.NetStatusMap[keyof NetSpeedReq.NetStatusMap]): void;

  getNetSpeed(): number;
  setNetSpeed(value: number): void;

  getSubTime(): number;
  setSubTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NetSpeedReq.AsObject;
  static toObject(includeInstance: boolean, msg: NetSpeedReq): NetSpeedReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NetSpeedReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NetSpeedReq;
  static deserializeBinaryFromReader(message: NetSpeedReq, reader: jspb.BinaryReader): NetSpeedReq;
}

export namespace NetSpeedReq {
  export type AsObject = {
    status: NetSpeedReq.NetStatusMap[keyof NetSpeedReq.NetStatusMap],
    netSpeed: number,
    subTime: number,
  }

  export interface NetStatusMap {
    INVALID: 0;
    NET_GOOD: 1;
    NET_GENERAL: 2;
    NET_BAD: 3;
  }

  export const NetStatus: NetStatusMap;
}

export class PrintResultReq extends jspb.Message {
  getScanId(): string;
  setScanId(value: string): void;

  getResult(): boolean;
  setResult(value: boolean): void;

  getReason(): PrintResultReq.ReasonMap[keyof PrintResultReq.ReasonMap];
  setReason(value: PrintResultReq.ReasonMap[keyof PrintResultReq.ReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PrintResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: PrintResultReq): PrintResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PrintResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PrintResultReq;
  static deserializeBinaryFromReader(message: PrintResultReq, reader: jspb.BinaryReader): PrintResultReq;
}

export namespace PrintResultReq {
  export type AsObject = {
    scanId: string,
    result: boolean,
    reason: PrintResultReq.ReasonMap[keyof PrintResultReq.ReasonMap],
  }

  export interface ReasonMap {
    INVALID: 0;
    FILE_ERR: 1;
    PRINTER_ERR: 2;
    PRINT_TIMEOUT: 3;
  }

  export const Reason: ReasonMap;
}

export class ThirdBindResultReq extends jspb.Message {
  getBindResultType(): ThirdBindResultReq.BindResultTypeMap[keyof ThirdBindResultReq.BindResultTypeMap];
  setBindResultType(value: ThirdBindResultReq.BindResultTypeMap[keyof ThirdBindResultReq.BindResultTypeMap]): void;

  getScanId(): string;
  setScanId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ThirdBindResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: ThirdBindResultReq): ThirdBindResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ThirdBindResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ThirdBindResultReq;
  static deserializeBinaryFromReader(message: ThirdBindResultReq, reader: jspb.BinaryReader): ThirdBindResultReq;
}

export namespace ThirdBindResultReq {
  export type AsObject = {
    bindResultType: ThirdBindResultReq.BindResultTypeMap[keyof ThirdBindResultReq.BindResultTypeMap],
    scanId: string,
  }

  export interface BindResultTypeMap {
    INVALID: 0;
    BIND_SUCCEED: 1;
    BIND_INVALID: 2;
  }

  export const BindResultType: BindResultTypeMap;
}

export class NewVersionReq extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  getForce(): boolean;
  setForce(value: boolean): void;

  getContent(): string;
  setContent(value: string): void;

  getUpdTotalNum(): number;
  setUpdTotalNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewVersionReq.AsObject;
  static toObject(includeInstance: boolean, msg: NewVersionReq): NewVersionReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewVersionReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewVersionReq;
  static deserializeBinaryFromReader(message: NewVersionReq, reader: jspb.BinaryReader): NewVersionReq;
}

export namespace NewVersionReq {
  export type AsObject = {
    version: string,
    force: boolean,
    content: string,
    updTotalNum: number,
  }
}

export class NotifyStateReq extends jspb.Message {
  getState(): NotifyStateReq.NotifyStateMap[keyof NotifyStateReq.NotifyStateMap];
  setState(value: NotifyStateReq.NotifyStateMap[keyof NotifyStateReq.NotifyStateMap]): void;

  getPercent(): number;
  setPercent(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NotifyStateReq.AsObject;
  static toObject(includeInstance: boolean, msg: NotifyStateReq): NotifyStateReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NotifyStateReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NotifyStateReq;
  static deserializeBinaryFromReader(message: NotifyStateReq, reader: jspb.BinaryReader): NotifyStateReq;
}

export namespace NotifyStateReq {
  export type AsObject = {
    state: NotifyStateReq.NotifyStateMap[keyof NotifyStateReq.NotifyStateMap],
    percent: number,
  }

  export interface NotifyStateMap {
    INVALID: 0;
    UPDATE_SUCCESS: 1;
    UPDATE_FAIL: 2;
    UPDATE_ING: 3;
    ROLLBACK_SUCCESS: 4;
    ROLLBACK_FAIL: 5;
    ROLLBACK_ING: 6;
  }

  export const NotifyState: NotifyStateMap;
}

export class HardwareServiceStatusReq extends jspb.Message {
  getStatus(): HardwareServiceStatusReq.StatusMap[keyof HardwareServiceStatusReq.StatusMap];
  setStatus(value: HardwareServiceStatusReq.StatusMap[keyof HardwareServiceStatusReq.StatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HardwareServiceStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: HardwareServiceStatusReq): HardwareServiceStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HardwareServiceStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HardwareServiceStatusReq;
  static deserializeBinaryFromReader(message: HardwareServiceStatusReq, reader: jspb.BinaryReader): HardwareServiceStatusReq;
}

export namespace HardwareServiceStatusReq {
  export type AsObject = {
    status: HardwareServiceStatusReq.StatusMap[keyof HardwareServiceStatusReq.StatusMap],
  }

  export interface StatusMap {
    INVALID: 0;
    READY: 1;
    FAULT: 2;
  }

  export const Status: StatusMap;
}

export class ScreenStatusReq extends jspb.Message {
  getStatus(): ScreenStatusReq.StatusMap[keyof ScreenStatusReq.StatusMap];
  setStatus(value: ScreenStatusReq.StatusMap[keyof ScreenStatusReq.StatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScreenStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: ScreenStatusReq): ScreenStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScreenStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScreenStatusReq;
  static deserializeBinaryFromReader(message: ScreenStatusReq, reader: jspb.BinaryReader): ScreenStatusReq;
}

export namespace ScreenStatusReq {
  export type AsObject = {
    status: ScreenStatusReq.StatusMap[keyof ScreenStatusReq.StatusMap],
  }

  export interface StatusMap {
    INVALID: 0;
    ON: 1;
    OFF: 2;
    UNKNOWN: 3;
  }

  export const Status: StatusMap;
}

export class HardwareSelfCheckReq extends jspb.Message {
  getWeightBoardConnect(): HardwareStatusMap[keyof HardwareStatusMap];
  setWeightBoardConnect(value: HardwareStatusMap[keyof HardwareStatusMap]): void;

  getFatBoardConnect(): HardwareStatusMap[keyof HardwareStatusMap];
  setFatBoardConnect(value: HardwareStatusMap[keyof HardwareStatusMap]): void;

  getCenterCtrlBoard(): HardwareStatusMap[keyof HardwareStatusMap];
  setCenterCtrlBoard(value: HardwareStatusMap[keyof HardwareStatusMap]): void;

  getTableStatus(): HardwareSelfCheckReq.TableStatusMap[keyof HardwareSelfCheckReq.TableStatusMap];
  setTableStatus(value: HardwareSelfCheckReq.TableStatusMap[keyof HardwareSelfCheckReq.TableStatusMap]): void;

  getTouchIsConnected(): boolean;
  setTouchIsConnected(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HardwareSelfCheckReq.AsObject;
  static toObject(includeInstance: boolean, msg: HardwareSelfCheckReq): HardwareSelfCheckReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HardwareSelfCheckReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HardwareSelfCheckReq;
  static deserializeBinaryFromReader(message: HardwareSelfCheckReq, reader: jspb.BinaryReader): HardwareSelfCheckReq;
}

export namespace HardwareSelfCheckReq {
  export type AsObject = {
    weightBoardConnect: HardwareStatusMap[keyof HardwareStatusMap],
    fatBoardConnect: HardwareStatusMap[keyof HardwareStatusMap],
    centerCtrlBoard: HardwareStatusMap[keyof HardwareStatusMap],
    tableStatus: HardwareSelfCheckReq.TableStatusMap[keyof HardwareSelfCheckReq.TableStatusMap],
    touchIsConnected: boolean,
  }

  export interface TableStatusMap {
    INVALID: 0;
    READY: 1;
    FAULT: 2;
    UNCONNECTED: 3;
  }

  export const TableStatus: TableStatusMap;
}

export class WeightMeasureResultReq extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  hasData(): boolean;
  clearData(): void;
  getData(): WeightMeasureResultReq.Data | undefined;
  setData(value?: WeightMeasureResultReq.Data): void;

  getReason(): WeightMeasureResultReq.ReasonMap[keyof WeightMeasureResultReq.ReasonMap];
  setReason(value: WeightMeasureResultReq.ReasonMap[keyof WeightMeasureResultReq.ReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeightMeasureResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: WeightMeasureResultReq): WeightMeasureResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WeightMeasureResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeightMeasureResultReq;
  static deserializeBinaryFromReader(message: WeightMeasureResultReq, reader: jspb.BinaryReader): WeightMeasureResultReq;
}

export namespace WeightMeasureResultReq {
  export type AsObject = {
    result: boolean,
    data?: WeightMeasureResultReq.Data.AsObject,
    reason: WeightMeasureResultReq.ReasonMap[keyof WeightMeasureResultReq.ReasonMap],
  }

  export class Data extends jspb.Message {
    getWeight(): number;
    setWeight(value: number): void;

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
      weight: number,
    }
  }

  export interface ReasonMap {
    INVALID: 0;
    NOT_STABLE: 1;
    PERSON_LEAVE: 2;
    WEIGHT_BOARD_CONNECT_ERROR: 3;
    CENTER_CONTROL_BOARD_ERROR: 4;
  }

  export const Reason: ReasonMap;
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

  getUserId(): string;
  setUserId(value: string): void;

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
    userId: string,
  }

  export interface SexMap {
    INVALID: 0;
    MALE: 1;
    FEMALE: 2;
  }

  export const Sex: SexMap;
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

export class BodyMeasureResultReq extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  getIsFirst(): boolean;
  setIsFirst(value: boolean): void;

  hasData(): boolean;
  clearData(): void;
  getData(): BodyMeasureResultReq.Data | undefined;
  setData(value?: BodyMeasureResultReq.Data): void;

  getReason(): BodyMeasureResultReq.ReasonMap[keyof BodyMeasureResultReq.ReasonMap];
  setReason(value: BodyMeasureResultReq.ReasonMap[keyof BodyMeasureResultReq.ReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BodyMeasureResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: BodyMeasureResultReq): BodyMeasureResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BodyMeasureResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BodyMeasureResultReq;
  static deserializeBinaryFromReader(message: BodyMeasureResultReq, reader: jspb.BinaryReader): BodyMeasureResultReq;
}

export namespace BodyMeasureResultReq {
  export type AsObject = {
    result: boolean,
    isFirst: boolean,
    data?: BodyMeasureResultReq.Data.AsObject,
    reason: BodyMeasureResultReq.ReasonMap[keyof BodyMeasureResultReq.ReasonMap],
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

  export interface ReasonMap {
    INVALID: 0;
    RESISTANCE_MEASURE_ERROR: 1;
    FAT_BOARD_CONNECT: 2;
    CENTER_CTRL_BOARD: 3;
    HEIGHT_ERROR: 4;
    SEX_ERROR: 5;
    AGE_ERROR: 6;
  }

  export const Reason: ReasonMap;
}

export class TableBodyMeasureResultReq extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  getOriginresistance(): number;
  setOriginresistance(value: number): void;

  getEnciphermentresistance(): number;
  setEnciphermentresistance(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TableBodyMeasureResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: TableBodyMeasureResultReq): TableBodyMeasureResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TableBodyMeasureResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TableBodyMeasureResultReq;
  static deserializeBinaryFromReader(message: TableBodyMeasureResultReq, reader: jspb.BinaryReader): TableBodyMeasureResultReq;
}

export namespace TableBodyMeasureResultReq {
  export type AsObject = {
    result: boolean,
    originresistance: number,
    enciphermentresistance: number,
  }
}

export class BacklightResultReq extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BacklightResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: BacklightResultReq): BacklightResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BacklightResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BacklightResultReq;
  static deserializeBinaryFromReader(message: BacklightResultReq, reader: jspb.BinaryReader): BacklightResultReq;
}

export namespace BacklightResultReq {
  export type AsObject = {
    value: number,
  }
}

export class StandStateReq extends jspb.Message {
  getPerson(): boolean;
  setPerson(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StandStateReq.AsObject;
  static toObject(includeInstance: boolean, msg: StandStateReq): StandStateReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StandStateReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StandStateReq;
  static deserializeBinaryFromReader(message: StandStateReq, reader: jspb.BinaryReader): StandStateReq;
}

export namespace StandStateReq {
  export type AsObject = {
    person: boolean,
  }
}

export class ButtonEventReq extends jspb.Message {
  getEvent(): ButtonEventReq.EventMap[keyof ButtonEventReq.EventMap];
  setEvent(value: ButtonEventReq.EventMap[keyof ButtonEventReq.EventMap]): void;

  getLongClick(): boolean;
  setLongClick(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ButtonEventReq.AsObject;
  static toObject(includeInstance: boolean, msg: ButtonEventReq): ButtonEventReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ButtonEventReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ButtonEventReq;
  static deserializeBinaryFromReader(message: ButtonEventReq, reader: jspb.BinaryReader): ButtonEventReq;
}

export namespace ButtonEventReq {
  export type AsObject = {
    event: ButtonEventReq.EventMap[keyof ButtonEventReq.EventMap],
    longClick: boolean,
  }

  export interface EventMap {
    INVALID: 0;
    SOFT_SWITCH_PRESS: 1;
    SOFT_SWITCH_RELEASE: 2;
    KEY_UP: 3;
    KEY_DOWN: 4;
    KEY_BACK: 5;
    KEY_ENTER: 6;
    KEY_PRINT: 7;
  }

  export const Event: EventMap;
}

export class HardwareStatusReq extends jspb.Message {
  getType(): HardwareStatusReq.TypeMap[keyof HardwareStatusReq.TypeMap];
  setType(value: HardwareStatusReq.TypeMap[keyof HardwareStatusReq.TypeMap]): void;

  getStatus(): boolean;
  setStatus(value: boolean): void;

  getDetail(): string;
  setDetail(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HardwareStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: HardwareStatusReq): HardwareStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HardwareStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HardwareStatusReq;
  static deserializeBinaryFromReader(message: HardwareStatusReq, reader: jspb.BinaryReader): HardwareStatusReq;
}

export namespace HardwareStatusReq {
  export type AsObject = {
    type: HardwareStatusReq.TypeMap[keyof HardwareStatusReq.TypeMap],
    status: boolean,
    detail: string,
  }

  export interface TypeMap {
    INVALID: 0;
    WEIGHT_BOARD: 1;
    FAT_BOARD: 2;
    CENTER_CTRL_BOARD: 3;
    TABLE: 4;
    TOUCH: 5;
    TABLE_FAULT: 6;
  }

  export const Type: TypeMap;
}

export class AlgServiceStatusReq extends jspb.Message {
  getServiceStatus(): AlgServiceStatusReq.StatusMap[keyof AlgServiceStatusReq.StatusMap];
  setServiceStatus(value: AlgServiceStatusReq.StatusMap[keyof AlgServiceStatusReq.StatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlgServiceStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: AlgServiceStatusReq): AlgServiceStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AlgServiceStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlgServiceStatusReq;
  static deserializeBinaryFromReader(message: AlgServiceStatusReq, reader: jspb.BinaryReader): AlgServiceStatusReq;
}

export namespace AlgServiceStatusReq {
  export type AsObject = {
    serviceStatus: AlgServiceStatusReq.StatusMap[keyof AlgServiceStatusReq.StatusMap],
  }

  export interface StatusMap {
    INVALID: 0;
    READY: 1;
    FAULT: 2;
  }

  export const Status: StatusMap;
}

export class CheckSelfReq extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  getDepthCamera(): CameraStatusMap[keyof CameraStatusMap];
  setDepthCamera(value: CameraStatusMap[keyof CameraStatusMap]): void;

  getFisheyeCamera(): CameraStatusMap[keyof CameraStatusMap];
  setFisheyeCamera(value: CameraStatusMap[keyof CameraStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckSelfReq.AsObject;
  static toObject(includeInstance: boolean, msg: CheckSelfReq): CheckSelfReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckSelfReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckSelfReq;
  static deserializeBinaryFromReader(message: CheckSelfReq, reader: jspb.BinaryReader): CheckSelfReq;
}

export namespace CheckSelfReq {
  export type AsObject = {
    result: boolean,
    depthCamera: CameraStatusMap[keyof CameraStatusMap],
    fisheyeCamera: CameraStatusMap[keyof CameraStatusMap],
  }
}

export class DepthCameraStatusReq extends jspb.Message {
  getDepthCamera(): CameraStatusMap[keyof CameraStatusMap];
  setDepthCamera(value: CameraStatusMap[keyof CameraStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepthCameraStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: DepthCameraStatusReq): DepthCameraStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DepthCameraStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepthCameraStatusReq;
  static deserializeBinaryFromReader(message: DepthCameraStatusReq, reader: jspb.BinaryReader): DepthCameraStatusReq;
}

export namespace DepthCameraStatusReq {
  export type AsObject = {
    depthCamera: CameraStatusMap[keyof CameraStatusMap],
  }
}

export class FisheyeCameraStatusReq extends jspb.Message {
  getFisheyeCamera(): CameraStatusMap[keyof CameraStatusMap];
  setFisheyeCamera(value: CameraStatusMap[keyof CameraStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FisheyeCameraStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: FisheyeCameraStatusReq): FisheyeCameraStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FisheyeCameraStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FisheyeCameraStatusReq;
  static deserializeBinaryFromReader(message: FisheyeCameraStatusReq, reader: jspb.BinaryReader): FisheyeCameraStatusReq;
}

export namespace FisheyeCameraStatusReq {
  export type AsObject = {
    fisheyeCamera: CameraStatusMap[keyof CameraStatusMap],
  }
}

export class SurveyorStatusReq extends jspb.Message {
  getSurveyorStatus(): SurveyorStatusReq.StatusMap[keyof SurveyorStatusReq.StatusMap];
  setSurveyorStatus(value: SurveyorStatusReq.StatusMap[keyof SurveyorStatusReq.StatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SurveyorStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: SurveyorStatusReq): SurveyorStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SurveyorStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SurveyorStatusReq;
  static deserializeBinaryFromReader(message: SurveyorStatusReq, reader: jspb.BinaryReader): SurveyorStatusReq;
}

export namespace SurveyorStatusReq {
  export type AsObject = {
    surveyorStatus: SurveyorStatusReq.StatusMap[keyof SurveyorStatusReq.StatusMap],
  }

  export interface StatusMap {
    INVALID: 0;
    ONE_PERSON: 1;
    MUTIPLE_PERSON: 2;
    NO_PERSON: 3;
  }

  export const Status: StatusMap;
}

export class ErrorStatusReq extends jspb.Message {
  getErrorStatus(): ErrorStatusReq.StatusMap[keyof ErrorStatusReq.StatusMap];
  setErrorStatus(value: ErrorStatusReq.StatusMap[keyof ErrorStatusReq.StatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorStatusReq): ErrorStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ErrorStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorStatusReq;
  static deserializeBinaryFromReader(message: ErrorStatusReq, reader: jspb.BinaryReader): ErrorStatusReq;
}

export namespace ErrorStatusReq {
  export type AsObject = {
    errorStatus: ErrorStatusReq.StatusMap[keyof ErrorStatusReq.StatusMap],
  }

  export interface StatusMap {
    INVALID: 0;
    DEPTH_CAMERA_ERROR: 1;
    FISHEYE_CAMERA_ERROR: 2;
  }

  export const Status: StatusMap;
}

export class ScanResultReq extends jspb.Message {
  getDetectResult(): boolean;
  setDetectResult(value: boolean): void;

  getScanId(): string;
  setScanId(value: string): void;

  getScanType(): ScanResultReq.ScanTypeMap[keyof ScanResultReq.ScanTypeMap];
  setScanType(value: ScanResultReq.ScanTypeMap[keyof ScanResultReq.ScanTypeMap]): void;

  getImagePath(): string;
  setImagePath(value: string): void;

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
    detectResult: boolean,
    scanId: string,
    scanType: ScanResultReq.ScanTypeMap[keyof ScanResultReq.ScanTypeMap],
    imagePath: string,
  }

  export interface ScanTypeMap {
    INVALID: 0;
    BODY_SCAN_NORMAL: 1;
    BODY_SCAN_POSTURE: 2;
  }

  export const ScanType: ScanTypeMap;
}

export class AposeDetectResultReq extends jspb.Message {
  getDetectResult(): AposeDetectResultReq.DetectResultMap[keyof AposeDetectResultReq.DetectResultMap];
  setDetectResult(value: AposeDetectResultReq.DetectResultMap[keyof AposeDetectResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AposeDetectResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: AposeDetectResultReq): AposeDetectResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AposeDetectResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AposeDetectResultReq;
  static deserializeBinaryFromReader(message: AposeDetectResultReq, reader: jspb.BinaryReader): AposeDetectResultReq;
}

export namespace AposeDetectResultReq {
  export type AsObject = {
    detectResult: AposeDetectResultReq.DetectResultMap[keyof AposeDetectResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    A_POSE_READY: 1;
    A_POSE_RAISE: 2;
    A_POSE_FALL: 3;
  }

  export const DetectResult: DetectResultMap;
}

export class IposeDetectResultReq extends jspb.Message {
  getDetectResult(): IposeDetectResultReq.DetectResultMap[keyof IposeDetectResultReq.DetectResultMap];
  setDetectResult(value: IposeDetectResultReq.DetectResultMap[keyof IposeDetectResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IposeDetectResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: IposeDetectResultReq): IposeDetectResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IposeDetectResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IposeDetectResultReq;
  static deserializeBinaryFromReader(message: IposeDetectResultReq, reader: jspb.BinaryReader): IposeDetectResultReq;
}

export namespace IposeDetectResultReq {
  export type AsObject = {
    detectResult: IposeDetectResultReq.DetectResultMap[keyof IposeDetectResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    I_POSE_READY: 1;
  }

  export const DetectResult: DetectResultMap;
}

export class GestureDetectResultReq extends jspb.Message {
  getDetectResult(): GestureDetectResultReq.DetectResultMap[keyof GestureDetectResultReq.DetectResultMap];
  setDetectResult(value: GestureDetectResultReq.DetectResultMap[keyof GestureDetectResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GestureDetectResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: GestureDetectResultReq): GestureDetectResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GestureDetectResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GestureDetectResultReq;
  static deserializeBinaryFromReader(message: GestureDetectResultReq, reader: jspb.BinaryReader): GestureDetectResultReq;
}

export namespace GestureDetectResultReq {
  export type AsObject = {
    detectResult: GestureDetectResultReq.DetectResultMap[keyof GestureDetectResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    LEFT_HAND: 1;
    RIGHT_HAND: 2;
    BOTH_HAND: 3;
  }

  export const DetectResult: DetectResultMap;
}

export class PersonDetectResultReq extends jspb.Message {
  getDetectResult(): PersonDetectResultReq.DetectResultMap[keyof PersonDetectResultReq.DetectResultMap];
  setDetectResult(value: PersonDetectResultReq.DetectResultMap[keyof PersonDetectResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PersonDetectResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: PersonDetectResultReq): PersonDetectResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PersonDetectResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PersonDetectResultReq;
  static deserializeBinaryFromReader(message: PersonDetectResultReq, reader: jspb.BinaryReader): PersonDetectResultReq;
}

export namespace PersonDetectResultReq {
  export type AsObject = {
    detectResult: PersonDetectResultReq.DetectResultMap[keyof PersonDetectResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    STATION_PERSON: 1;
  }

  export const DetectResult: DetectResultMap;
}

export class GestureIposeResultReq extends jspb.Message {
  getDetectResult(): GestureIposeResultReq.DetectResultMap[keyof GestureIposeResultReq.DetectResultMap];
  setDetectResult(value: GestureIposeResultReq.DetectResultMap[keyof GestureIposeResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GestureIposeResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: GestureIposeResultReq): GestureIposeResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GestureIposeResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GestureIposeResultReq;
  static deserializeBinaryFromReader(message: GestureIposeResultReq, reader: jspb.BinaryReader): GestureIposeResultReq;
}

export namespace GestureIposeResultReq {
  export type AsObject = {
    detectResult: GestureIposeResultReq.DetectResultMap[keyof GestureIposeResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    I_POSE: 1;
  }

  export const DetectResult: DetectResultMap;
}

export class AmbientLightResultReq extends jspb.Message {
  getDetectResult(): AmbientLightResultReq.DetectResultMap[keyof AmbientLightResultReq.DetectResultMap];
  setDetectResult(value: AmbientLightResultReq.DetectResultMap[keyof AmbientLightResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AmbientLightResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: AmbientLightResultReq): AmbientLightResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AmbientLightResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AmbientLightResultReq;
  static deserializeBinaryFromReader(message: AmbientLightResultReq, reader: jspb.BinaryReader): AmbientLightResultReq;
}

export namespace AmbientLightResultReq {
  export type AsObject = {
    detectResult: AmbientLightResultReq.DetectResultMap[keyof AmbientLightResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    OK: 1;
    WEAK: 2;
    DARK: 3;
  }

  export const DetectResult: DetectResultMap;
}

export class ShoulderDetectResultReq extends jspb.Message {
  getDetectResult(): boolean;
  setDetectResult(value: boolean): void;

  getDetectType(): ShoulderDetectResultReq.DetectTypeMap[keyof ShoulderDetectResultReq.DetectTypeMap];
  setDetectType(value: ShoulderDetectResultReq.DetectTypeMap[keyof ShoulderDetectResultReq.DetectTypeMap]): void;

  getAngle(): number;
  setAngle(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShoulderDetectResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: ShoulderDetectResultReq): ShoulderDetectResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ShoulderDetectResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShoulderDetectResultReq;
  static deserializeBinaryFromReader(message: ShoulderDetectResultReq, reader: jspb.BinaryReader): ShoulderDetectResultReq;
}

export namespace ShoulderDetectResultReq {
  export type AsObject = {
    detectResult: boolean,
    detectType: ShoulderDetectResultReq.DetectTypeMap[keyof ShoulderDetectResultReq.DetectTypeMap],
    angle: number,
  }

  export interface DetectTypeMap {
    INVALID: 0;
    LEFT_ABDUCTION_UP: 1;
    RIGHT_ABDUCTION_UP: 2;
    LEFT_ANTEXION_UP: 3;
    RIGHT_ANTEXION_UP: 4;
  }

  export const DetectType: DetectTypeMap;
}

export class StartShoulderLegalityResultReq extends jspb.Message {
  getDetectResult(): StartShoulderLegalityResultReq.DetectResultMap[keyof StartShoulderLegalityResultReq.DetectResultMap];
  setDetectResult(value: StartShoulderLegalityResultReq.DetectResultMap[keyof StartShoulderLegalityResultReq.DetectResultMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartShoulderLegalityResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: StartShoulderLegalityResultReq): StartShoulderLegalityResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StartShoulderLegalityResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartShoulderLegalityResultReq;
  static deserializeBinaryFromReader(message: StartShoulderLegalityResultReq, reader: jspb.BinaryReader): StartShoulderLegalityResultReq;
}

export namespace StartShoulderLegalityResultReq {
  export type AsObject = {
    detectResult: StartShoulderLegalityResultReq.DetectResultMap[keyof StartShoulderLegalityResultReq.DetectResultMap],
  }

  export interface DetectResultMap {
    INVALID: 0;
    HEAD_READY: 1;
  }

  export const DetectResult: DetectResultMap;
}

export class QRCodeScanResultReq extends jspb.Message {
  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QRCodeScanResultReq.AsObject;
  static toObject(includeInstance: boolean, msg: QRCodeScanResultReq): QRCodeScanResultReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QRCodeScanResultReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QRCodeScanResultReq;
  static deserializeBinaryFromReader(message: QRCodeScanResultReq, reader: jspb.BinaryReader): QRCodeScanResultReq;
}

export namespace QRCodeScanResultReq {
  export type AsObject = {
    data: string,
  }
}

export class HeightMeasurementReq extends jspb.Message {
  getHeight(): number;
  setHeight(value: number): void;

  getIsOcclusion(): boolean;
  setIsOcclusion(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HeightMeasurementReq.AsObject;
  static toObject(includeInstance: boolean, msg: HeightMeasurementReq): HeightMeasurementReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HeightMeasurementReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HeightMeasurementReq;
  static deserializeBinaryFromReader(message: HeightMeasurementReq, reader: jspb.BinaryReader): HeightMeasurementReq;
}

export namespace HeightMeasurementReq {
  export type AsObject = {
    height: number,
    isOcclusion: boolean,
  }
}

export class AposeAngleReq extends jspb.Message {
  getLeftAngle(): number;
  setLeftAngle(value: number): void;

  getRightAngle(): number;
  setRightAngle(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AposeAngleReq.AsObject;
  static toObject(includeInstance: boolean, msg: AposeAngleReq): AposeAngleReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AposeAngleReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AposeAngleReq;
  static deserializeBinaryFromReader(message: AposeAngleReq, reader: jspb.BinaryReader): AposeAngleReq;
}

export namespace AposeAngleReq {
  export type AsObject = {
    leftAngle: number,
    rightAngle: number,
  }
}

export class WiredNetworkStatusReq extends jspb.Message {
  getIsconnected(): boolean;
  setIsconnected(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WiredNetworkStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: WiredNetworkStatusReq): WiredNetworkStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WiredNetworkStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WiredNetworkStatusReq;
  static deserializeBinaryFromReader(message: WiredNetworkStatusReq, reader: jspb.BinaryReader): WiredNetworkStatusReq;
}

export namespace WiredNetworkStatusReq {
  export type AsObject = {
    isconnected: boolean,
  }
}

export class WifiStatusReq extends jspb.Message {
  getSsid(): string;
  setSsid(value: string): void;

  getIsconnected(): boolean;
  setIsconnected(value: boolean): void;

  getLevel(): number;
  setLevel(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: WifiStatusReq): WifiStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiStatusReq;
  static deserializeBinaryFromReader(message: WifiStatusReq, reader: jspb.BinaryReader): WifiStatusReq;
}

export namespace WifiStatusReq {
  export type AsObject = {
    ssid: string,
    isconnected: boolean,
    level: number,
  }
}

export class WifiInfo extends jspb.Message {
  getSsid(): string;
  setSsid(value: string): void;

  getLevel(): number;
  setLevel(value: number): void;

  getIsconnected(): boolean;
  setIsconnected(value: boolean): void;

  getIsautoconnect(): boolean;
  setIsautoconnect(value: boolean): void;

  getIsencrypt(): boolean;
  setIsencrypt(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WifiInfo): WifiInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiInfo;
  static deserializeBinaryFromReader(message: WifiInfo, reader: jspb.BinaryReader): WifiInfo;
}

export namespace WifiInfo {
  export type AsObject = {
    ssid: string,
    level: number,
    isconnected: boolean,
    isautoconnect: boolean,
    isencrypt: boolean,
  }
}

export class WifiListReq extends jspb.Message {
  clearListList(): void;
  getListList(): Array<WifiInfo>;
  setListList(value: Array<WifiInfo>): void;
  addList(value?: WifiInfo, index?: number): WifiInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiListReq.AsObject;
  static toObject(includeInstance: boolean, msg: WifiListReq): WifiListReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiListReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiListReq;
  static deserializeBinaryFromReader(message: WifiListReq, reader: jspb.BinaryReader): WifiListReq;
}

export namespace WifiListReq {
  export type AsObject = {
    listList: Array<WifiInfo.AsObject>,
  }
}

export class WifiSetStatusReq extends jspb.Message {
  getType(): WifiSetTypeMap[keyof WifiSetTypeMap];
  setType(value: WifiSetTypeMap[keyof WifiSetTypeMap]): void;

  getValue(): number;
  setValue(value: number): void;

  getReason(): string;
  setReason(value: string): void;

  getErrorcode(): WifiSetErrorCodeMap[keyof WifiSetErrorCodeMap];
  setErrorcode(value: WifiSetErrorCodeMap[keyof WifiSetErrorCodeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiSetStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: WifiSetStatusReq): WifiSetStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiSetStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiSetStatusReq;
  static deserializeBinaryFromReader(message: WifiSetStatusReq, reader: jspb.BinaryReader): WifiSetStatusReq;
}

export namespace WifiSetStatusReq {
  export type AsObject = {
    type: WifiSetTypeMap[keyof WifiSetTypeMap],
    value: number,
    reason: string,
    errorcode: WifiSetErrorCodeMap[keyof WifiSetErrorCodeMap],
  }
}

export class WifiEnableStatusReq extends jspb.Message {
  getSsid(): string;
  setSsid(value: string): void;

  getIsconnected(): boolean;
  setIsconnected(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiEnableStatusReq.AsObject;
  static toObject(includeInstance: boolean, msg: WifiEnableStatusReq): WifiEnableStatusReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiEnableStatusReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiEnableStatusReq;
  static deserializeBinaryFromReader(message: WifiEnableStatusReq, reader: jspb.BinaryReader): WifiEnableStatusReq;
}

export namespace WifiEnableStatusReq {
  export type AsObject = {
    ssid: string,
    isconnected: boolean,
  }
}

export interface HardwareStatusMap {
  INVALID: 0;
  READY: 1;
  BUSY: 2;
  FAULT: 3;
  UNKNOWN: 4;
}

export const HardwareStatus: HardwareStatusMap;

export interface CameraStatusMap {
  CAMERA_INVALID: 0;
  CAMERA_READY: 1;
  CAMERA_FAULT: 2;
}

export const CameraStatus: CameraStatusMap;

export interface WifiSetTypeMap {
  WF_ENABLE: 0;
  WF_SCAN_FINISHED: 1;
  WF_CONNECT: 2;
  WF_DISCONNECT: 3;
  WF_DISABLE_AUTO_CONN: 4;
}

export const WifiSetType: WifiSetTypeMap;

export interface WifiSetErrorCodeMap {
  WF_CONNECT_OK: 0;
  WF_CONNECT_TIMEOUT: 1;
  WF_PASSWORD_ERROR: 2;
  WF_NOT_FOUND: 3;
  WF_PROTOCOL_ERROR: 4;
  WF_NOT_RUNNING: 5;
  WF_NETWORK_ERROR: 6;
  WF_IP_ERROR: 7;
  WF_CMD_ERROR: 8;
  WF_OTHER_ERROR: 9;
}

export const WifiSetErrorCode: WifiSetErrorCodeMap;

