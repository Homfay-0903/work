// package: update
// file: update.proto

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

export class DeviceStatusRes extends jspb.Message {
  getStatus(): DeviceStatusRes.StatusMap[keyof DeviceStatusRes.StatusMap];
  setStatus(value: DeviceStatusRes.StatusMap[keyof DeviceStatusRes.StatusMap]): void;

  getIsHasUpdate(): boolean;
  setIsHasUpdate(value: boolean): void;

  getVersion(): string;
  setVersion(value: string): void;

  getUpdateContent(): string;
  setUpdateContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeviceStatusRes.AsObject;
  static toObject(includeInstance: boolean, msg: DeviceStatusRes): DeviceStatusRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeviceStatusRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeviceStatusRes;
  static deserializeBinaryFromReader(message: DeviceStatusRes, reader: jspb.BinaryReader): DeviceStatusRes;
}

export namespace DeviceStatusRes {
  export type AsObject = {
    status: DeviceStatusRes.StatusMap[keyof DeviceStatusRes.StatusMap],
    isHasUpdate: boolean,
    version: string,
    updateContent: string,
  }

  export interface StatusMap {
    INVALID: 0;
    NORMAL: 1;
    UN_AVAILABLE: 2;
    UPDATE_SUCCESS: 3;
    UPDATE_FAILED: 4;
  }

  export const Status: StatusMap;
}

