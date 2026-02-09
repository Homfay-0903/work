// package: hardware
// file: hardware.proto

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

export class BacklightReq extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BacklightReq.AsObject;
  static toObject(includeInstance: boolean, msg: BacklightReq): BacklightReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BacklightReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BacklightReq;
  static deserializeBinaryFromReader(message: BacklightReq, reader: jspb.BinaryReader): BacklightReq;
}

export namespace BacklightReq {
  export type AsObject = {
    value: number,
  }
}

export class ScreenCtrlReq extends jspb.Message {
  getStatus(): ScreenCtrlReq.StatusMap[keyof ScreenCtrlReq.StatusMap];
  setStatus(value: ScreenCtrlReq.StatusMap[keyof ScreenCtrlReq.StatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScreenCtrlReq.AsObject;
  static toObject(includeInstance: boolean, msg: ScreenCtrlReq): ScreenCtrlReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScreenCtrlReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScreenCtrlReq;
  static deserializeBinaryFromReader(message: ScreenCtrlReq, reader: jspb.BinaryReader): ScreenCtrlReq;
}

export namespace ScreenCtrlReq {
  export type AsObject = {
    status: ScreenCtrlReq.StatusMap[keyof ScreenCtrlReq.StatusMap],
  }

  export interface StatusMap {
    INVALID: 0;
    ON: 1;
    OFF: 2;
  }

  export const Status: StatusMap;
}

export class PersonCheckRes extends jspb.Message {
  getResult(): boolean;
  setResult(value: boolean): void;

  getWeight(): number;
  setWeight(value: number): void;

  getReason(): PersonCheckRes.ReasonMap[keyof PersonCheckRes.ReasonMap];
  setReason(value: PersonCheckRes.ReasonMap[keyof PersonCheckRes.ReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PersonCheckRes.AsObject;
  static toObject(includeInstance: boolean, msg: PersonCheckRes): PersonCheckRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PersonCheckRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PersonCheckRes;
  static deserializeBinaryFromReader(message: PersonCheckRes, reader: jspb.BinaryReader): PersonCheckRes;
}

export namespace PersonCheckRes {
  export type AsObject = {
    result: boolean,
    weight: number,
    reason: PersonCheckRes.ReasonMap[keyof PersonCheckRes.ReasonMap],
  }

  export interface ReasonMap {
    INVALID: 0;
    WEIGHT_BOARD_CONNECT_ERROR: 1;
    CENTER_CONTROL_BOARD_ERROR: 2;
  }

  export const Reason: ReasonMap;
}

export class WifiSetReq extends jspb.Message {
  getType(): WifiSetTypeMap[keyof WifiSetTypeMap];
  setType(value: WifiSetTypeMap[keyof WifiSetTypeMap]): void;

  getValue(): number;
  setValue(value: number): void;

  getSsid(): string;
  setSsid(value: string): void;

  getPass(): string;
  setPass(value: string): void;

  getAutoconnect(): boolean;
  setAutoconnect(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiSetReq.AsObject;
  static toObject(includeInstance: boolean, msg: WifiSetReq): WifiSetReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiSetReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiSetReq;
  static deserializeBinaryFromReader(message: WifiSetReq, reader: jspb.BinaryReader): WifiSetReq;
}

export namespace WifiSetReq {
  export type AsObject = {
    type: WifiSetTypeMap[keyof WifiSetTypeMap],
    value: number,
    ssid: string,
    pass: string,
    autoconnect: boolean,
  }
}

export class WifiEnableStatusRes extends jspb.Message {
  getIsEnabled(): boolean;
  setIsEnabled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WifiEnableStatusRes.AsObject;
  static toObject(includeInstance: boolean, msg: WifiEnableStatusRes): WifiEnableStatusRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WifiEnableStatusRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WifiEnableStatusRes;
  static deserializeBinaryFromReader(message: WifiEnableStatusRes, reader: jspb.BinaryReader): WifiEnableStatusRes;
}

export namespace WifiEnableStatusRes {
  export type AsObject = {
    isEnabled: boolean,
  }
}

export interface WifiSetTypeMap {
  WF_ENABLE: 0;
  WF_SCAN: 1;
  WF_STOP_SCAN: 2;
  WF_CONNECT: 3;
  WF_DISCONNECT: 4;
  WF_DISABLE_AUTO_CONN: 5;
}

export const WifiSetType: WifiSetTypeMap;

