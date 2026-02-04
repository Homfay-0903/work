// package: shoulder
// file: shoulder.proto

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

export class ShoulderDetectReq extends jspb.Message {
  getDetectType(): ShoulderDetectReq.DetectTypeMap[keyof ShoulderDetectReq.DetectTypeMap];
  setDetectType(value: ShoulderDetectReq.DetectTypeMap[keyof ShoulderDetectReq.DetectTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ShoulderDetectReq.AsObject;
  static toObject(includeInstance: boolean, msg: ShoulderDetectReq): ShoulderDetectReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ShoulderDetectReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ShoulderDetectReq;
  static deserializeBinaryFromReader(message: ShoulderDetectReq, reader: jspb.BinaryReader): ShoulderDetectReq;
}

export namespace ShoulderDetectReq {
  export type AsObject = {
    detectType: ShoulderDetectReq.DetectTypeMap[keyof ShoulderDetectReq.DetectTypeMap],
  }

  export interface DetectTypeMap {
    INVALID: 0;
    LEFT_ABDUCTION_UP: 1;
    RIGHT_ABDUCTION_UP: 2;
    LEFT_ANTEXION_UP: 3;
    RIGHT_ANTEXION_UP: 4;
    HEAD_READY: 5;
  }

  export const DetectType: DetectTypeMap;
}

