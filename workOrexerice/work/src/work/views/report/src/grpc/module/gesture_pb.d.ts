// package: gesture
// file: gesture.proto

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

export class GestureDetectReq extends jspb.Message {
  getDetectType(): GestureDetectReq.DetectTypeMap[keyof GestureDetectReq.DetectTypeMap];
  setDetectType(value: GestureDetectReq.DetectTypeMap[keyof GestureDetectReq.DetectTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GestureDetectReq.AsObject;
  static toObject(includeInstance: boolean, msg: GestureDetectReq): GestureDetectReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GestureDetectReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GestureDetectReq;
  static deserializeBinaryFromReader(message: GestureDetectReq, reader: jspb.BinaryReader): GestureDetectReq;
}

export namespace GestureDetectReq {
  export type AsObject = {
    detectType: GestureDetectReq.DetectTypeMap[keyof GestureDetectReq.DetectTypeMap],
  }

  export interface DetectTypeMap {
    INVALID: 0;
    GESTURE_DETECT: 1;
    STATION_DETECT: 2;
    I_POSE_DETECT: 3;
  }

  export const DetectType: DetectTypeMap;
}

