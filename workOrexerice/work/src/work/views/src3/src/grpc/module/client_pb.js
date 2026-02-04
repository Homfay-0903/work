// source: client.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

goog.exportSymbol('proto.client.AlgServiceStatusReq', null, global);
goog.exportSymbol('proto.client.AlgServiceStatusReq.Status', null, global);
goog.exportSymbol('proto.client.AmbientLightResultReq', null, global);
goog.exportSymbol('proto.client.AmbientLightResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.AposeAngleReq', null, global);
goog.exportSymbol('proto.client.AposeDetectResultReq', null, global);
goog.exportSymbol('proto.client.AposeDetectResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.BIAInfo', null, global);
goog.exportSymbol('proto.client.BacklightResultReq', null, global);
goog.exportSymbol('proto.client.BodyInfo', null, global);
goog.exportSymbol('proto.client.BodyInfo.Sex', null, global);
goog.exportSymbol('proto.client.BodyMeasureResultReq', null, global);
goog.exportSymbol('proto.client.BodyMeasureResultReq.Data', null, global);
goog.exportSymbol('proto.client.BodyMeasureResultReq.Reason', null, global);
goog.exportSymbol('proto.client.ButtonEventReq', null, global);
goog.exportSymbol('proto.client.ButtonEventReq.Event', null, global);
goog.exportSymbol('proto.client.CameraStatus', null, global);
goog.exportSymbol('proto.client.CheckSelfReq', null, global);
goog.exportSymbol('proto.client.CommonReq', null, global);
goog.exportSymbol('proto.client.CommonRes', null, global);
goog.exportSymbol('proto.client.DepthCameraStatusReq', null, global);
goog.exportSymbol('proto.client.ErrorStatusReq', null, global);
goog.exportSymbol('proto.client.ErrorStatusReq.Status', null, global);
goog.exportSymbol('proto.client.ExternalReq', null, global);
goog.exportSymbol('proto.client.ExternalReq.Printer', null, global);
goog.exportSymbol('proto.client.FisheyeCameraStatusReq', null, global);
goog.exportSymbol('proto.client.GestureDetectResultReq', null, global);
goog.exportSymbol('proto.client.GestureDetectResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.GestureIposeResultReq', null, global);
goog.exportSymbol('proto.client.GestureIposeResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.HardwareSelfCheckReq', null, global);
goog.exportSymbol('proto.client.HardwareSelfCheckReq.TableStatus', null, global);
goog.exportSymbol('proto.client.HardwareServiceStatusReq', null, global);
goog.exportSymbol('proto.client.HardwareServiceStatusReq.Status', null, global);
goog.exportSymbol('proto.client.HardwareStatus', null, global);
goog.exportSymbol('proto.client.HardwareStatusReq', null, global);
goog.exportSymbol('proto.client.HardwareStatusReq.Type', null, global);
goog.exportSymbol('proto.client.HeightMeasurementReq', null, global);
goog.exportSymbol('proto.client.IposeDetectResultReq', null, global);
goog.exportSymbol('proto.client.IposeDetectResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.NetSpeedReq', null, global);
goog.exportSymbol('proto.client.NetSpeedReq.NetStatus', null, global);
goog.exportSymbol('proto.client.NetworkSpeedReq', null, global);
goog.exportSymbol('proto.client.NetworkSpeedReq.Speed', null, global);
goog.exportSymbol('proto.client.NewVersionReq', null, global);
goog.exportSymbol('proto.client.NotifyStateReq', null, global);
goog.exportSymbol('proto.client.NotifyStateReq.NotifyState', null, global);
goog.exportSymbol('proto.client.PersonDetectResultReq', null, global);
goog.exportSymbol('proto.client.PersonDetectResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.PrintResultReq', null, global);
goog.exportSymbol('proto.client.PrintResultReq.Reason', null, global);
goog.exportSymbol('proto.client.QRCodeScanResultReq', null, global);
goog.exportSymbol('proto.client.ResistanceBody', null, global);
goog.exportSymbol('proto.client.ResistanceInfo', null, global);
goog.exportSymbol('proto.client.ScanResultReq', null, global);
goog.exportSymbol('proto.client.ScanResultReq.ScanType', null, global);
goog.exportSymbol('proto.client.ScreenStatusReq', null, global);
goog.exportSymbol('proto.client.ScreenStatusReq.Status', null, global);
goog.exportSymbol('proto.client.ShoulderDetectResultReq', null, global);
goog.exportSymbol('proto.client.ShoulderDetectResultReq.DetectType', null, global);
goog.exportSymbol('proto.client.StandStateReq', null, global);
goog.exportSymbol('proto.client.StartShoulderLegalityResultReq', null, global);
goog.exportSymbol('proto.client.StartShoulderLegalityResultReq.DetectResult', null, global);
goog.exportSymbol('proto.client.SurveyorStatusReq', null, global);
goog.exportSymbol('proto.client.SurveyorStatusReq.Status', null, global);
goog.exportSymbol('proto.client.TableBodyMeasureResultReq', null, global);
goog.exportSymbol('proto.client.ThirdBindResultReq', null, global);
goog.exportSymbol('proto.client.ThirdBindResultReq.BindResultType', null, global);
goog.exportSymbol('proto.client.WeightMeasureResultReq', null, global);
goog.exportSymbol('proto.client.WeightMeasureResultReq.Data', null, global);
goog.exportSymbol('proto.client.WeightMeasureResultReq.Reason', null, global);
goog.exportSymbol('proto.client.WifiEnableStatusReq', null, global);
goog.exportSymbol('proto.client.WifiInfo', null, global);
goog.exportSymbol('proto.client.WifiListReq', null, global);
goog.exportSymbol('proto.client.WifiSetErrorCode', null, global);
goog.exportSymbol('proto.client.WifiSetStatusReq', null, global);
goog.exportSymbol('proto.client.WifiSetType', null, global);
goog.exportSymbol('proto.client.WifiStatusReq', null, global);
goog.exportSymbol('proto.client.WiredNetworkStatusReq', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.CommonReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.CommonReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.CommonReq.displayName = 'proto.client.CommonReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.CommonRes = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.CommonRes, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.CommonRes.displayName = 'proto.client.CommonRes';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ExternalReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ExternalReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ExternalReq.displayName = 'proto.client.ExternalReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.NetworkSpeedReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.NetworkSpeedReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.NetworkSpeedReq.displayName = 'proto.client.NetworkSpeedReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.NetSpeedReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.NetSpeedReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.NetSpeedReq.displayName = 'proto.client.NetSpeedReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.PrintResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.PrintResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.PrintResultReq.displayName = 'proto.client.PrintResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ThirdBindResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ThirdBindResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ThirdBindResultReq.displayName = 'proto.client.ThirdBindResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.NewVersionReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.NewVersionReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.NewVersionReq.displayName = 'proto.client.NewVersionReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.NotifyStateReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.NotifyStateReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.NotifyStateReq.displayName = 'proto.client.NotifyStateReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.HardwareServiceStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.HardwareServiceStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.HardwareServiceStatusReq.displayName = 'proto.client.HardwareServiceStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ScreenStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ScreenStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ScreenStatusReq.displayName = 'proto.client.ScreenStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.HardwareSelfCheckReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.HardwareSelfCheckReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.HardwareSelfCheckReq.displayName = 'proto.client.HardwareSelfCheckReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WeightMeasureResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WeightMeasureResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WeightMeasureResultReq.displayName = 'proto.client.WeightMeasureResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WeightMeasureResultReq.Data = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WeightMeasureResultReq.Data, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WeightMeasureResultReq.Data.displayName = 'proto.client.WeightMeasureResultReq.Data';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.BodyInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.BodyInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.BodyInfo.displayName = 'proto.client.BodyInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ResistanceBody = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ResistanceBody, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ResistanceBody.displayName = 'proto.client.ResistanceBody';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ResistanceInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ResistanceInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ResistanceInfo.displayName = 'proto.client.ResistanceInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.BIAInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.BIAInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.BIAInfo.displayName = 'proto.client.BIAInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.BodyMeasureResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.BodyMeasureResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.BodyMeasureResultReq.displayName = 'proto.client.BodyMeasureResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.BodyMeasureResultReq.Data = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.BodyMeasureResultReq.Data, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.BodyMeasureResultReq.Data.displayName = 'proto.client.BodyMeasureResultReq.Data';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.TableBodyMeasureResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.TableBodyMeasureResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.TableBodyMeasureResultReq.displayName = 'proto.client.TableBodyMeasureResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.BacklightResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.BacklightResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.BacklightResultReq.displayName = 'proto.client.BacklightResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.StandStateReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.StandStateReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.StandStateReq.displayName = 'proto.client.StandStateReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ButtonEventReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ButtonEventReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ButtonEventReq.displayName = 'proto.client.ButtonEventReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.HardwareStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.HardwareStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.HardwareStatusReq.displayName = 'proto.client.HardwareStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.AlgServiceStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.AlgServiceStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.AlgServiceStatusReq.displayName = 'proto.client.AlgServiceStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.CheckSelfReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.CheckSelfReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.CheckSelfReq.displayName = 'proto.client.CheckSelfReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.DepthCameraStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.DepthCameraStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.DepthCameraStatusReq.displayName = 'proto.client.DepthCameraStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.FisheyeCameraStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.FisheyeCameraStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.FisheyeCameraStatusReq.displayName = 'proto.client.FisheyeCameraStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.SurveyorStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.SurveyorStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.SurveyorStatusReq.displayName = 'proto.client.SurveyorStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ErrorStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ErrorStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ErrorStatusReq.displayName = 'proto.client.ErrorStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ScanResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ScanResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ScanResultReq.displayName = 'proto.client.ScanResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.AposeDetectResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.AposeDetectResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.AposeDetectResultReq.displayName = 'proto.client.AposeDetectResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.IposeDetectResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.IposeDetectResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.IposeDetectResultReq.displayName = 'proto.client.IposeDetectResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.GestureDetectResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.GestureDetectResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.GestureDetectResultReq.displayName = 'proto.client.GestureDetectResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.PersonDetectResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.PersonDetectResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.PersonDetectResultReq.displayName = 'proto.client.PersonDetectResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.GestureIposeResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.GestureIposeResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.GestureIposeResultReq.displayName = 'proto.client.GestureIposeResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.AmbientLightResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.AmbientLightResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.AmbientLightResultReq.displayName = 'proto.client.AmbientLightResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.ShoulderDetectResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.ShoulderDetectResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.ShoulderDetectResultReq.displayName = 'proto.client.ShoulderDetectResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.StartShoulderLegalityResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.StartShoulderLegalityResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.StartShoulderLegalityResultReq.displayName = 'proto.client.StartShoulderLegalityResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.QRCodeScanResultReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.QRCodeScanResultReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.QRCodeScanResultReq.displayName = 'proto.client.QRCodeScanResultReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.HeightMeasurementReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.HeightMeasurementReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.HeightMeasurementReq.displayName = 'proto.client.HeightMeasurementReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.AposeAngleReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.AposeAngleReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.AposeAngleReq.displayName = 'proto.client.AposeAngleReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WiredNetworkStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WiredNetworkStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WiredNetworkStatusReq.displayName = 'proto.client.WiredNetworkStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WifiStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WifiStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WifiStatusReq.displayName = 'proto.client.WifiStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WifiInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WifiInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WifiInfo.displayName = 'proto.client.WifiInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WifiListReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.client.WifiListReq.repeatedFields_, null);
};
goog.inherits(proto.client.WifiListReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WifiListReq.displayName = 'proto.client.WifiListReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WifiSetStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WifiSetStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WifiSetStatusReq.displayName = 'proto.client.WifiSetStatusReq';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.client.WifiEnableStatusReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.client.WifiEnableStatusReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.client.WifiEnableStatusReq.displayName = 'proto.client.WifiEnableStatusReq';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.CommonReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.CommonReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.CommonReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.CommonReq.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.CommonReq}
 */
proto.client.CommonReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.CommonReq;
  return proto.client.CommonReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.CommonReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.CommonReq}
 */
proto.client.CommonReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.CommonReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.CommonReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.CommonReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.CommonReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.CommonRes.prototype.toObject = function(opt_includeInstance) {
  return proto.client.CommonRes.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.CommonRes} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.CommonRes.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.CommonRes}
 */
proto.client.CommonRes.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.CommonRes;
  return proto.client.CommonRes.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.CommonRes} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.CommonRes}
 */
proto.client.CommonRes.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.CommonRes.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.CommonRes.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.CommonRes} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.CommonRes.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ExternalReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ExternalReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ExternalReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ExternalReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    printer: jspb.Message.getFieldWithDefault(msg, 1, 0),
    usb: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ExternalReq}
 */
proto.client.ExternalReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ExternalReq;
  return proto.client.ExternalReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ExternalReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ExternalReq}
 */
proto.client.ExternalReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.ExternalReq.Printer} */ (reader.readEnum());
      msg.setPrinter(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUsb(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ExternalReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ExternalReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ExternalReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ExternalReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPrinter();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getUsb();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ExternalReq.Printer = {
  INVALID: 0,
  ALL_READY: 1,
  NOT_READY: 2,
  PRINTING: 3
};

/**
 * optional Printer printer = 1;
 * @return {!proto.client.ExternalReq.Printer}
 */
proto.client.ExternalReq.prototype.getPrinter = function() {
  return /** @type {!proto.client.ExternalReq.Printer} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.ExternalReq.Printer} value
 * @return {!proto.client.ExternalReq} returns this
 */
proto.client.ExternalReq.prototype.setPrinter = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional bool usb = 2;
 * @return {boolean}
 */
proto.client.ExternalReq.prototype.getUsb = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.ExternalReq} returns this
 */
proto.client.ExternalReq.prototype.setUsb = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.NetworkSpeedReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.NetworkSpeedReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.NetworkSpeedReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NetworkSpeedReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    speed: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.NetworkSpeedReq}
 */
proto.client.NetworkSpeedReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.NetworkSpeedReq;
  return proto.client.NetworkSpeedReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.NetworkSpeedReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.NetworkSpeedReq}
 */
proto.client.NetworkSpeedReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.NetworkSpeedReq.Speed} */ (reader.readEnum());
      msg.setSpeed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.NetworkSpeedReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.NetworkSpeedReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.NetworkSpeedReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NetworkSpeedReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSpeed();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.NetworkSpeedReq.Speed = {
  INVALID: 0,
  FAST: 1,
  SLOWER: 2,
  SLOWEST: 3
};

/**
 * optional Speed speed = 1;
 * @return {!proto.client.NetworkSpeedReq.Speed}
 */
proto.client.NetworkSpeedReq.prototype.getSpeed = function() {
  return /** @type {!proto.client.NetworkSpeedReq.Speed} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.NetworkSpeedReq.Speed} value
 * @return {!proto.client.NetworkSpeedReq} returns this
 */
proto.client.NetworkSpeedReq.prototype.setSpeed = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.NetSpeedReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.NetSpeedReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.NetSpeedReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NetSpeedReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, 0),
    netSpeed: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    subTime: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.NetSpeedReq}
 */
proto.client.NetSpeedReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.NetSpeedReq;
  return proto.client.NetSpeedReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.NetSpeedReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.NetSpeedReq}
 */
proto.client.NetSpeedReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.NetSpeedReq.NetStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setNetSpeed(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSubTime(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.NetSpeedReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.NetSpeedReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.NetSpeedReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NetSpeedReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getNetSpeed();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getSubTime();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.NetSpeedReq.NetStatus = {
  INVALID: 0,
  NET_GOOD: 1,
  NET_GENERAL: 2,
  NET_BAD: 3
};

/**
 * optional NetStatus status = 1;
 * @return {!proto.client.NetSpeedReq.NetStatus}
 */
proto.client.NetSpeedReq.prototype.getStatus = function() {
  return /** @type {!proto.client.NetSpeedReq.NetStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.NetSpeedReq.NetStatus} value
 * @return {!proto.client.NetSpeedReq} returns this
 */
proto.client.NetSpeedReq.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional float net_speed = 2;
 * @return {number}
 */
proto.client.NetSpeedReq.prototype.getNetSpeed = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.NetSpeedReq} returns this
 */
proto.client.NetSpeedReq.prototype.setNetSpeed = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional uint32 sub_time = 3;
 * @return {number}
 */
proto.client.NetSpeedReq.prototype.getSubTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.NetSpeedReq} returns this
 */
proto.client.NetSpeedReq.prototype.setSubTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.PrintResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.PrintResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.PrintResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.PrintResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    scanId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    result: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    reason: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.PrintResultReq}
 */
proto.client.PrintResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.PrintResultReq;
  return proto.client.PrintResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.PrintResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.PrintResultReq}
 */
proto.client.PrintResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setScanId(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setResult(value);
      break;
    case 3:
      var value = /** @type {!proto.client.PrintResultReq.Reason} */ (reader.readEnum());
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.PrintResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.PrintResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.PrintResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.PrintResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getScanId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getResult();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getReason();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.PrintResultReq.Reason = {
  INVALID: 0,
  FILE_ERR: 1,
  PRINTER_ERR: 2,
  PRINT_TIMEOUT: 3
};

/**
 * optional string scan_id = 1;
 * @return {string}
 */
proto.client.PrintResultReq.prototype.getScanId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.PrintResultReq} returns this
 */
proto.client.PrintResultReq.prototype.setScanId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool result = 2;
 * @return {boolean}
 */
proto.client.PrintResultReq.prototype.getResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.PrintResultReq} returns this
 */
proto.client.PrintResultReq.prototype.setResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional Reason reason = 3;
 * @return {!proto.client.PrintResultReq.Reason}
 */
proto.client.PrintResultReq.prototype.getReason = function() {
  return /** @type {!proto.client.PrintResultReq.Reason} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.client.PrintResultReq.Reason} value
 * @return {!proto.client.PrintResultReq} returns this
 */
proto.client.PrintResultReq.prototype.setReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ThirdBindResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ThirdBindResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ThirdBindResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ThirdBindResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    bindResultType: jspb.Message.getFieldWithDefault(msg, 1, 0),
    scanId: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ThirdBindResultReq}
 */
proto.client.ThirdBindResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ThirdBindResultReq;
  return proto.client.ThirdBindResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ThirdBindResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ThirdBindResultReq}
 */
proto.client.ThirdBindResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.ThirdBindResultReq.BindResultType} */ (reader.readEnum());
      msg.setBindResultType(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setScanId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ThirdBindResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ThirdBindResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ThirdBindResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ThirdBindResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBindResultType();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getScanId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ThirdBindResultReq.BindResultType = {
  INVALID: 0,
  BIND_SUCCEED: 1,
  BIND_INVALID: 2
};

/**
 * optional BindResultType bind_result_type = 1;
 * @return {!proto.client.ThirdBindResultReq.BindResultType}
 */
proto.client.ThirdBindResultReq.prototype.getBindResultType = function() {
  return /** @type {!proto.client.ThirdBindResultReq.BindResultType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.ThirdBindResultReq.BindResultType} value
 * @return {!proto.client.ThirdBindResultReq} returns this
 */
proto.client.ThirdBindResultReq.prototype.setBindResultType = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string scan_id = 2;
 * @return {string}
 */
proto.client.ThirdBindResultReq.prototype.getScanId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.ThirdBindResultReq} returns this
 */
proto.client.ThirdBindResultReq.prototype.setScanId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.NewVersionReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.NewVersionReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.NewVersionReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NewVersionReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    version: jspb.Message.getFieldWithDefault(msg, 1, ""),
    force: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    content: jspb.Message.getFieldWithDefault(msg, 3, ""),
    updTotalNum: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.NewVersionReq}
 */
proto.client.NewVersionReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.NewVersionReq;
  return proto.client.NewVersionReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.NewVersionReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.NewVersionReq}
 */
proto.client.NewVersionReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setForce(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setContent(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setUpdTotalNum(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.NewVersionReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.NewVersionReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.NewVersionReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NewVersionReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getVersion();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getForce();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getContent();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getUpdTotalNum();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * optional string version = 1;
 * @return {string}
 */
proto.client.NewVersionReq.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.NewVersionReq} returns this
 */
proto.client.NewVersionReq.prototype.setVersion = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool force = 2;
 * @return {boolean}
 */
proto.client.NewVersionReq.prototype.getForce = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.NewVersionReq} returns this
 */
proto.client.NewVersionReq.prototype.setForce = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional string content = 3;
 * @return {string}
 */
proto.client.NewVersionReq.prototype.getContent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.NewVersionReq} returns this
 */
proto.client.NewVersionReq.prototype.setContent = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int32 upd_total_num = 4;
 * @return {number}
 */
proto.client.NewVersionReq.prototype.getUpdTotalNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.NewVersionReq} returns this
 */
proto.client.NewVersionReq.prototype.setUpdTotalNum = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.NotifyStateReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.NotifyStateReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.NotifyStateReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NotifyStateReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    state: jspb.Message.getFieldWithDefault(msg, 1, 0),
    percent: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.NotifyStateReq}
 */
proto.client.NotifyStateReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.NotifyStateReq;
  return proto.client.NotifyStateReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.NotifyStateReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.NotifyStateReq}
 */
proto.client.NotifyStateReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.NotifyStateReq.NotifyState} */ (reader.readEnum());
      msg.setState(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPercent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.NotifyStateReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.NotifyStateReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.NotifyStateReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.NotifyStateReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getState();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getPercent();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.NotifyStateReq.NotifyState = {
  INVALID: 0,
  UPDATE_SUCCESS: 1,
  UPDATE_FAIL: 2,
  UPDATE_ING: 3,
  ROLLBACK_SUCCESS: 4,
  ROLLBACK_FAIL: 5,
  ROLLBACK_ING: 6
};

/**
 * optional NotifyState state = 1;
 * @return {!proto.client.NotifyStateReq.NotifyState}
 */
proto.client.NotifyStateReq.prototype.getState = function() {
  return /** @type {!proto.client.NotifyStateReq.NotifyState} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.NotifyStateReq.NotifyState} value
 * @return {!proto.client.NotifyStateReq} returns this
 */
proto.client.NotifyStateReq.prototype.setState = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional float percent = 2;
 * @return {number}
 */
proto.client.NotifyStateReq.prototype.getPercent = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.NotifyStateReq} returns this
 */
proto.client.NotifyStateReq.prototype.setPercent = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.HardwareServiceStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.HardwareServiceStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.HardwareServiceStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HardwareServiceStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.HardwareServiceStatusReq}
 */
proto.client.HardwareServiceStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.HardwareServiceStatusReq;
  return proto.client.HardwareServiceStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.HardwareServiceStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.HardwareServiceStatusReq}
 */
proto.client.HardwareServiceStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.HardwareServiceStatusReq.Status} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.HardwareServiceStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.HardwareServiceStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.HardwareServiceStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HardwareServiceStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.HardwareServiceStatusReq.Status = {
  INVALID: 0,
  READY: 1,
  FAULT: 2
};

/**
 * optional Status status = 1;
 * @return {!proto.client.HardwareServiceStatusReq.Status}
 */
proto.client.HardwareServiceStatusReq.prototype.getStatus = function() {
  return /** @type {!proto.client.HardwareServiceStatusReq.Status} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.HardwareServiceStatusReq.Status} value
 * @return {!proto.client.HardwareServiceStatusReq} returns this
 */
proto.client.HardwareServiceStatusReq.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ScreenStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ScreenStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ScreenStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ScreenStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ScreenStatusReq}
 */
proto.client.ScreenStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ScreenStatusReq;
  return proto.client.ScreenStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ScreenStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ScreenStatusReq}
 */
proto.client.ScreenStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.ScreenStatusReq.Status} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ScreenStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ScreenStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ScreenStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ScreenStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ScreenStatusReq.Status = {
  INVALID: 0,
  ON: 1,
  OFF: 2,
  UNKNOWN: 3
};

/**
 * optional Status status = 1;
 * @return {!proto.client.ScreenStatusReq.Status}
 */
proto.client.ScreenStatusReq.prototype.getStatus = function() {
  return /** @type {!proto.client.ScreenStatusReq.Status} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.ScreenStatusReq.Status} value
 * @return {!proto.client.ScreenStatusReq} returns this
 */
proto.client.ScreenStatusReq.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.HardwareSelfCheckReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.HardwareSelfCheckReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.HardwareSelfCheckReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HardwareSelfCheckReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    weightBoardConnect: jspb.Message.getFieldWithDefault(msg, 1, 0),
    fatBoardConnect: jspb.Message.getFieldWithDefault(msg, 2, 0),
    centerCtrlBoard: jspb.Message.getFieldWithDefault(msg, 3, 0),
    tableStatus: jspb.Message.getFieldWithDefault(msg, 4, 0),
    touchIsConnected: jspb.Message.getBooleanFieldWithDefault(msg, 5, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.HardwareSelfCheckReq}
 */
proto.client.HardwareSelfCheckReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.HardwareSelfCheckReq;
  return proto.client.HardwareSelfCheckReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.HardwareSelfCheckReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.HardwareSelfCheckReq}
 */
proto.client.HardwareSelfCheckReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.HardwareStatus} */ (reader.readEnum());
      msg.setWeightBoardConnect(value);
      break;
    case 2:
      var value = /** @type {!proto.client.HardwareStatus} */ (reader.readEnum());
      msg.setFatBoardConnect(value);
      break;
    case 3:
      var value = /** @type {!proto.client.HardwareStatus} */ (reader.readEnum());
      msg.setCenterCtrlBoard(value);
      break;
    case 4:
      var value = /** @type {!proto.client.HardwareSelfCheckReq.TableStatus} */ (reader.readEnum());
      msg.setTableStatus(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setTouchIsConnected(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.HardwareSelfCheckReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.HardwareSelfCheckReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.HardwareSelfCheckReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HardwareSelfCheckReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getWeightBoardConnect();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getFatBoardConnect();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getCenterCtrlBoard();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getTableStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
  f = message.getTouchIsConnected();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.HardwareSelfCheckReq.TableStatus = {
  INVALID: 0,
  READY: 1,
  FAULT: 2,
  UNCONNECTED: 3
};

/**
 * optional HardwareStatus weight_board_connect = 1;
 * @return {!proto.client.HardwareStatus}
 */
proto.client.HardwareSelfCheckReq.prototype.getWeightBoardConnect = function() {
  return /** @type {!proto.client.HardwareStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.HardwareStatus} value
 * @return {!proto.client.HardwareSelfCheckReq} returns this
 */
proto.client.HardwareSelfCheckReq.prototype.setWeightBoardConnect = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional HardwareStatus fat_board_connect = 2;
 * @return {!proto.client.HardwareStatus}
 */
proto.client.HardwareSelfCheckReq.prototype.getFatBoardConnect = function() {
  return /** @type {!proto.client.HardwareStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.client.HardwareStatus} value
 * @return {!proto.client.HardwareSelfCheckReq} returns this
 */
proto.client.HardwareSelfCheckReq.prototype.setFatBoardConnect = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional HardwareStatus center_ctrl_board = 3;
 * @return {!proto.client.HardwareStatus}
 */
proto.client.HardwareSelfCheckReq.prototype.getCenterCtrlBoard = function() {
  return /** @type {!proto.client.HardwareStatus} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.client.HardwareStatus} value
 * @return {!proto.client.HardwareSelfCheckReq} returns this
 */
proto.client.HardwareSelfCheckReq.prototype.setCenterCtrlBoard = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional TableStatus table_status = 4;
 * @return {!proto.client.HardwareSelfCheckReq.TableStatus}
 */
proto.client.HardwareSelfCheckReq.prototype.getTableStatus = function() {
  return /** @type {!proto.client.HardwareSelfCheckReq.TableStatus} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.client.HardwareSelfCheckReq.TableStatus} value
 * @return {!proto.client.HardwareSelfCheckReq} returns this
 */
proto.client.HardwareSelfCheckReq.prototype.setTableStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};


/**
 * optional bool touch_is_connected = 5;
 * @return {boolean}
 */
proto.client.HardwareSelfCheckReq.prototype.getTouchIsConnected = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.HardwareSelfCheckReq} returns this
 */
proto.client.HardwareSelfCheckReq.prototype.setTouchIsConnected = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WeightMeasureResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WeightMeasureResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WeightMeasureResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WeightMeasureResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    result: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    data: (f = msg.getData()) && proto.client.WeightMeasureResultReq.Data.toObject(includeInstance, f),
    reason: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WeightMeasureResultReq}
 */
proto.client.WeightMeasureResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WeightMeasureResultReq;
  return proto.client.WeightMeasureResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WeightMeasureResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WeightMeasureResultReq}
 */
proto.client.WeightMeasureResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setResult(value);
      break;
    case 2:
      var value = new proto.client.WeightMeasureResultReq.Data;
      reader.readMessage(value,proto.client.WeightMeasureResultReq.Data.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    case 3:
      var value = /** @type {!proto.client.WeightMeasureResultReq.Reason} */ (reader.readEnum());
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WeightMeasureResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WeightMeasureResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WeightMeasureResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WeightMeasureResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResult();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.client.WeightMeasureResultReq.Data.serializeBinaryToWriter
    );
  }
  f = message.getReason();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.WeightMeasureResultReq.Reason = {
  INVALID: 0,
  NOT_STABLE: 1,
  PERSON_LEAVE: 2,
  WEIGHT_BOARD_CONNECT_ERROR: 3,
  CENTER_CONTROL_BOARD_ERROR: 4
};




if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WeightMeasureResultReq.Data.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WeightMeasureResultReq.Data.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WeightMeasureResultReq.Data} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WeightMeasureResultReq.Data.toObject = function(includeInstance, msg) {
  var f, obj = {
    weight: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WeightMeasureResultReq.Data}
 */
proto.client.WeightMeasureResultReq.Data.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WeightMeasureResultReq.Data;
  return proto.client.WeightMeasureResultReq.Data.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WeightMeasureResultReq.Data} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WeightMeasureResultReq.Data}
 */
proto.client.WeightMeasureResultReq.Data.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setWeight(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WeightMeasureResultReq.Data.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WeightMeasureResultReq.Data.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WeightMeasureResultReq.Data} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WeightMeasureResultReq.Data.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getWeight();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
};


/**
 * optional float weight = 1;
 * @return {number}
 */
proto.client.WeightMeasureResultReq.Data.prototype.getWeight = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.WeightMeasureResultReq.Data} returns this
 */
proto.client.WeightMeasureResultReq.Data.prototype.setWeight = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional bool result = 1;
 * @return {boolean}
 */
proto.client.WeightMeasureResultReq.prototype.getResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WeightMeasureResultReq} returns this
 */
proto.client.WeightMeasureResultReq.prototype.setResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional Data data = 2;
 * @return {?proto.client.WeightMeasureResultReq.Data}
 */
proto.client.WeightMeasureResultReq.prototype.getData = function() {
  return /** @type{?proto.client.WeightMeasureResultReq.Data} */ (
    jspb.Message.getWrapperField(this, proto.client.WeightMeasureResultReq.Data, 2));
};


/**
 * @param {?proto.client.WeightMeasureResultReq.Data|undefined} value
 * @return {!proto.client.WeightMeasureResultReq} returns this
*/
proto.client.WeightMeasureResultReq.prototype.setData = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.WeightMeasureResultReq} returns this
 */
proto.client.WeightMeasureResultReq.prototype.clearData = function() {
  return this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.WeightMeasureResultReq.prototype.hasData = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Reason reason = 3;
 * @return {!proto.client.WeightMeasureResultReq.Reason}
 */
proto.client.WeightMeasureResultReq.prototype.getReason = function() {
  return /** @type {!proto.client.WeightMeasureResultReq.Reason} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.client.WeightMeasureResultReq.Reason} value
 * @return {!proto.client.WeightMeasureResultReq} returns this
 */
proto.client.WeightMeasureResultReq.prototype.setReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.BodyInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.client.BodyInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.BodyInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BodyInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    sex: jspb.Message.getFieldWithDefault(msg, 1, 0),
    age: jspb.Message.getFieldWithDefault(msg, 2, 0),
    height: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    weight: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    userId: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.BodyInfo}
 */
proto.client.BodyInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.BodyInfo;
  return proto.client.BodyInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.BodyInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.BodyInfo}
 */
proto.client.BodyInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.BodyInfo.Sex} */ (reader.readEnum());
      msg.setSex(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setAge(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setHeight(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setWeight(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setUserId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.BodyInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.BodyInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.BodyInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BodyInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSex();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getAge();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getHeight();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getWeight();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getUserId();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.BodyInfo.Sex = {
  INVALID: 0,
  MALE: 1,
  FEMALE: 2
};

/**
 * optional Sex sex = 1;
 * @return {!proto.client.BodyInfo.Sex}
 */
proto.client.BodyInfo.prototype.getSex = function() {
  return /** @type {!proto.client.BodyInfo.Sex} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.BodyInfo.Sex} value
 * @return {!proto.client.BodyInfo} returns this
 */
proto.client.BodyInfo.prototype.setSex = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional uint32 age = 2;
 * @return {number}
 */
proto.client.BodyInfo.prototype.getAge = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.BodyInfo} returns this
 */
proto.client.BodyInfo.prototype.setAge = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional float height = 3;
 * @return {number}
 */
proto.client.BodyInfo.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BodyInfo} returns this
 */
proto.client.BodyInfo.prototype.setHeight = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float weight = 4;
 * @return {number}
 */
proto.client.BodyInfo.prototype.getWeight = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BodyInfo} returns this
 */
proto.client.BodyInfo.prototype.setWeight = function(value) {
  return jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional string user_id = 5;
 * @return {string}
 */
proto.client.BodyInfo.prototype.getUserId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.BodyInfo} returns this
 */
proto.client.BodyInfo.prototype.setUserId = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ResistanceBody.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ResistanceBody.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ResistanceBody} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ResistanceBody.toObject = function(includeInstance, msg) {
  var f, obj = {
    leftArm: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    rightArm: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    leftLeg: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    rightLeg: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    torso: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ResistanceBody}
 */
proto.client.ResistanceBody.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ResistanceBody;
  return proto.client.ResistanceBody.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ResistanceBody} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ResistanceBody}
 */
proto.client.ResistanceBody.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLeftArm(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setRightArm(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLeftLeg(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setRightLeg(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setTorso(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ResistanceBody.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ResistanceBody.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ResistanceBody} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ResistanceBody.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLeftArm();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getRightArm();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getLeftLeg();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getRightLeg();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getTorso();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
};


/**
 * optional float left_arm = 1;
 * @return {number}
 */
proto.client.ResistanceBody.prototype.getLeftArm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.ResistanceBody} returns this
 */
proto.client.ResistanceBody.prototype.setLeftArm = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional float right_arm = 2;
 * @return {number}
 */
proto.client.ResistanceBody.prototype.getRightArm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.ResistanceBody} returns this
 */
proto.client.ResistanceBody.prototype.setRightArm = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float left_leg = 3;
 * @return {number}
 */
proto.client.ResistanceBody.prototype.getLeftLeg = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.ResistanceBody} returns this
 */
proto.client.ResistanceBody.prototype.setLeftLeg = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float right_leg = 4;
 * @return {number}
 */
proto.client.ResistanceBody.prototype.getRightLeg = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.ResistanceBody} returns this
 */
proto.client.ResistanceBody.prototype.setRightLeg = function(value) {
  return jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional float torso = 5;
 * @return {number}
 */
proto.client.ResistanceBody.prototype.getTorso = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.ResistanceBody} returns this
 */
proto.client.ResistanceBody.prototype.setTorso = function(value) {
  return jspb.Message.setProto3FloatField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ResistanceInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ResistanceInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ResistanceInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ResistanceInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    res1k: (f = msg.getRes1k()) && proto.client.ResistanceBody.toObject(includeInstance, f),
    res5k: (f = msg.getRes5k()) && proto.client.ResistanceBody.toObject(includeInstance, f),
    res50k: (f = msg.getRes50k()) && proto.client.ResistanceBody.toObject(includeInstance, f),
    res250k: (f = msg.getRes250k()) && proto.client.ResistanceBody.toObject(includeInstance, f),
    res500k: (f = msg.getRes500k()) && proto.client.ResistanceBody.toObject(includeInstance, f),
    res1m: (f = msg.getRes1m()) && proto.client.ResistanceBody.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ResistanceInfo}
 */
proto.client.ResistanceInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ResistanceInfo;
  return proto.client.ResistanceInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ResistanceInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ResistanceInfo}
 */
proto.client.ResistanceInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.client.ResistanceBody;
      reader.readMessage(value,proto.client.ResistanceBody.deserializeBinaryFromReader);
      msg.setRes1k(value);
      break;
    case 2:
      var value = new proto.client.ResistanceBody;
      reader.readMessage(value,proto.client.ResistanceBody.deserializeBinaryFromReader);
      msg.setRes5k(value);
      break;
    case 3:
      var value = new proto.client.ResistanceBody;
      reader.readMessage(value,proto.client.ResistanceBody.deserializeBinaryFromReader);
      msg.setRes50k(value);
      break;
    case 4:
      var value = new proto.client.ResistanceBody;
      reader.readMessage(value,proto.client.ResistanceBody.deserializeBinaryFromReader);
      msg.setRes250k(value);
      break;
    case 5:
      var value = new proto.client.ResistanceBody;
      reader.readMessage(value,proto.client.ResistanceBody.deserializeBinaryFromReader);
      msg.setRes500k(value);
      break;
    case 6:
      var value = new proto.client.ResistanceBody;
      reader.readMessage(value,proto.client.ResistanceBody.deserializeBinaryFromReader);
      msg.setRes1m(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ResistanceInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ResistanceInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ResistanceInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ResistanceInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRes1k();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.client.ResistanceBody.serializeBinaryToWriter
    );
  }
  f = message.getRes5k();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.client.ResistanceBody.serializeBinaryToWriter
    );
  }
  f = message.getRes50k();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.client.ResistanceBody.serializeBinaryToWriter
    );
  }
  f = message.getRes250k();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.client.ResistanceBody.serializeBinaryToWriter
    );
  }
  f = message.getRes500k();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.client.ResistanceBody.serializeBinaryToWriter
    );
  }
  f = message.getRes1m();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.client.ResistanceBody.serializeBinaryToWriter
    );
  }
};


/**
 * optional ResistanceBody res_1K = 1;
 * @return {?proto.client.ResistanceBody}
 */
proto.client.ResistanceInfo.prototype.getRes1k = function() {
  return /** @type{?proto.client.ResistanceBody} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceBody, 1));
};


/**
 * @param {?proto.client.ResistanceBody|undefined} value
 * @return {!proto.client.ResistanceInfo} returns this
*/
proto.client.ResistanceInfo.prototype.setRes1k = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.ResistanceInfo} returns this
 */
proto.client.ResistanceInfo.prototype.clearRes1k = function() {
  return this.setRes1k(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.ResistanceInfo.prototype.hasRes1k = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ResistanceBody res_5K = 2;
 * @return {?proto.client.ResistanceBody}
 */
proto.client.ResistanceInfo.prototype.getRes5k = function() {
  return /** @type{?proto.client.ResistanceBody} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceBody, 2));
};


/**
 * @param {?proto.client.ResistanceBody|undefined} value
 * @return {!proto.client.ResistanceInfo} returns this
*/
proto.client.ResistanceInfo.prototype.setRes5k = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.ResistanceInfo} returns this
 */
proto.client.ResistanceInfo.prototype.clearRes5k = function() {
  return this.setRes5k(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.ResistanceInfo.prototype.hasRes5k = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ResistanceBody res_50K = 3;
 * @return {?proto.client.ResistanceBody}
 */
proto.client.ResistanceInfo.prototype.getRes50k = function() {
  return /** @type{?proto.client.ResistanceBody} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceBody, 3));
};


/**
 * @param {?proto.client.ResistanceBody|undefined} value
 * @return {!proto.client.ResistanceInfo} returns this
*/
proto.client.ResistanceInfo.prototype.setRes50k = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.ResistanceInfo} returns this
 */
proto.client.ResistanceInfo.prototype.clearRes50k = function() {
  return this.setRes50k(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.ResistanceInfo.prototype.hasRes50k = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ResistanceBody res_250K = 4;
 * @return {?proto.client.ResistanceBody}
 */
proto.client.ResistanceInfo.prototype.getRes250k = function() {
  return /** @type{?proto.client.ResistanceBody} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceBody, 4));
};


/**
 * @param {?proto.client.ResistanceBody|undefined} value
 * @return {!proto.client.ResistanceInfo} returns this
*/
proto.client.ResistanceInfo.prototype.setRes250k = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.ResistanceInfo} returns this
 */
proto.client.ResistanceInfo.prototype.clearRes250k = function() {
  return this.setRes250k(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.ResistanceInfo.prototype.hasRes250k = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ResistanceBody res_500K = 5;
 * @return {?proto.client.ResistanceBody}
 */
proto.client.ResistanceInfo.prototype.getRes500k = function() {
  return /** @type{?proto.client.ResistanceBody} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceBody, 5));
};


/**
 * @param {?proto.client.ResistanceBody|undefined} value
 * @return {!proto.client.ResistanceInfo} returns this
*/
proto.client.ResistanceInfo.prototype.setRes500k = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.ResistanceInfo} returns this
 */
proto.client.ResistanceInfo.prototype.clearRes500k = function() {
  return this.setRes500k(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.ResistanceInfo.prototype.hasRes500k = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional ResistanceBody res_1M = 6;
 * @return {?proto.client.ResistanceBody}
 */
proto.client.ResistanceInfo.prototype.getRes1m = function() {
  return /** @type{?proto.client.ResistanceBody} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceBody, 6));
};


/**
 * @param {?proto.client.ResistanceBody|undefined} value
 * @return {!proto.client.ResistanceInfo} returns this
*/
proto.client.ResistanceInfo.prototype.setRes1m = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.ResistanceInfo} returns this
 */
proto.client.ResistanceInfo.prototype.clearRes1m = function() {
  return this.setRes1m(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.ResistanceInfo.prototype.hasRes1m = function() {
  return jspb.Message.getField(this, 6) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.BIAInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.client.BIAInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.BIAInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BIAInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    pbf: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    ffm: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    bfm: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    lmra: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    lmla: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
    lmtr: jspb.Message.getFloatingPointFieldWithDefault(msg, 6, 0.0),
    lmrl: jspb.Message.getFloatingPointFieldWithDefault(msg, 7, 0.0),
    lmll: jspb.Message.getFloatingPointFieldWithDefault(msg, 8, 0.0),
    lm: jspb.Message.getFloatingPointFieldWithDefault(msg, 9, 0.0),
    tm: jspb.Message.getFloatingPointFieldWithDefault(msg, 10, 0.0),
    ecfra: jspb.Message.getFloatingPointFieldWithDefault(msg, 11, 0.0),
    ecfla: jspb.Message.getFloatingPointFieldWithDefault(msg, 12, 0.0),
    ecftr: jspb.Message.getFloatingPointFieldWithDefault(msg, 13, 0.0),
    ecfrl: jspb.Message.getFloatingPointFieldWithDefault(msg, 14, 0.0),
    ecfll: jspb.Message.getFloatingPointFieldWithDefault(msg, 15, 0.0),
    ecwra: jspb.Message.getFloatingPointFieldWithDefault(msg, 16, 0.0),
    ecwla: jspb.Message.getFloatingPointFieldWithDefault(msg, 17, 0.0),
    ecwtr: jspb.Message.getFloatingPointFieldWithDefault(msg, 18, 0.0),
    ecwrl: jspb.Message.getFloatingPointFieldWithDefault(msg, 19, 0.0),
    ecwll: jspb.Message.getFloatingPointFieldWithDefault(msg, 20, 0.0),
    ecwt: jspb.Message.getFloatingPointFieldWithDefault(msg, 21, 0.0),
    ecf: jspb.Message.getFloatingPointFieldWithDefault(msg, 22, 0.0),
    icw: jspb.Message.getFloatingPointFieldWithDefault(msg, 23, 0.0),
    ecw: jspb.Message.getFloatingPointFieldWithDefault(msg, 24, 0.0),
    tbw: jspb.Message.getFloatingPointFieldWithDefault(msg, 25, 0.0),
    protein: jspb.Message.getFloatingPointFieldWithDefault(msg, 26, 0.0),
    bcm: jspb.Message.getFloatingPointFieldWithDefault(msg, 27, 0.0),
    pbfmra: jspb.Message.getFloatingPointFieldWithDefault(msg, 28, 0.0),
    pbfmla: jspb.Message.getFloatingPointFieldWithDefault(msg, 29, 0.0),
    pbfmtr: jspb.Message.getFloatingPointFieldWithDefault(msg, 30, 0.0),
    pbfmrl: jspb.Message.getFloatingPointFieldWithDefault(msg, 31, 0.0),
    pbfmll: jspb.Message.getFloatingPointFieldWithDefault(msg, 32, 0.0),
    whr: jspb.Message.getFloatingPointFieldWithDefault(msg, 33, 0.0),
    vfa: jspb.Message.getFloatingPointFieldWithDefault(msg, 34, 0.0),
    score: jspb.Message.getFloatingPointFieldWithDefault(msg, 35, 0.0),
    pbfIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 36, 0.0),
    bmiIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 37, 0.0),
    whrIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 38, 0.0),
    wtIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 39, 0.0),
    bfmIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 40, 0.0),
    ffmIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 41, 0.0),
    bmrIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 42, 0.0),
    tmIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 43, 0.0),
    bmcIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 44, 0.0),
    lmIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 45, 0.0),
    tbwIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 46, 0.0),
    proteinIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 47, 0.0),
    ecwIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 48, 0.0),
    icwIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 49, 0.0),
    lmaIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 50, 0.0),
    lmtIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 51, 0.0),
    lmlIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 52, 0.0),
    bfmaIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 53, 0.0),
    bfmtIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 54, 0.0),
    bfmlIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 55, 0.0),
    bcmIval: jspb.Message.getFloatingPointFieldWithDefault(msg, 56, 0.0),
    plmra: jspb.Message.getFloatingPointFieldWithDefault(msg, 57, 0.0),
    plmla: jspb.Message.getFloatingPointFieldWithDefault(msg, 58, 0.0),
    plmtr: jspb.Message.getFloatingPointFieldWithDefault(msg, 59, 0.0),
    plmrl: jspb.Message.getFloatingPointFieldWithDefault(msg, 60, 0.0),
    plmll: jspb.Message.getFloatingPointFieldWithDefault(msg, 61, 0.0),
    cmt: jspb.Message.getFloatingPointFieldWithDefault(msg, 62, 0.0),
    cmm: jspb.Message.getFloatingPointFieldWithDefault(msg, 63, 0.0),
    cmf: jspb.Message.getFloatingPointFieldWithDefault(msg, 64, 0.0),
    bmr: jspb.Message.getFloatingPointFieldWithDefault(msg, 65, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.BIAInfo}
 */
proto.client.BIAInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.BIAInfo;
  return proto.client.BIAInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.BIAInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.BIAInfo}
 */
proto.client.BIAInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbf(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setFfm(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBfm(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmra(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmla(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmtr(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmrl(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmll(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLm(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setTm(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcfra(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcfla(value);
      break;
    case 13:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcftr(value);
      break;
    case 14:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcfrl(value);
      break;
    case 15:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcfll(value);
      break;
    case 16:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwra(value);
      break;
    case 17:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwla(value);
      break;
    case 18:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwtr(value);
      break;
    case 19:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwrl(value);
      break;
    case 20:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwll(value);
      break;
    case 21:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwt(value);
      break;
    case 22:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcf(value);
      break;
    case 23:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setIcw(value);
      break;
    case 24:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcw(value);
      break;
    case 25:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setTbw(value);
      break;
    case 26:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setProtein(value);
      break;
    case 27:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBcm(value);
      break;
    case 28:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbfmra(value);
      break;
    case 29:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbfmla(value);
      break;
    case 30:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbfmtr(value);
      break;
    case 31:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbfmrl(value);
      break;
    case 32:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbfmll(value);
      break;
    case 33:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setWhr(value);
      break;
    case 34:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setVfa(value);
      break;
    case 35:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setScore(value);
      break;
    case 36:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPbfIval(value);
      break;
    case 37:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBmiIval(value);
      break;
    case 38:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setWhrIval(value);
      break;
    case 39:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setWtIval(value);
      break;
    case 40:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBfmIval(value);
      break;
    case 41:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setFfmIval(value);
      break;
    case 42:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBmrIval(value);
      break;
    case 43:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setTmIval(value);
      break;
    case 44:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBmcIval(value);
      break;
    case 45:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmIval(value);
      break;
    case 46:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setTbwIval(value);
      break;
    case 47:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setProteinIval(value);
      break;
    case 48:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setEcwIval(value);
      break;
    case 49:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setIcwIval(value);
      break;
    case 50:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmaIval(value);
      break;
    case 51:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmtIval(value);
      break;
    case 52:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLmlIval(value);
      break;
    case 53:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBfmaIval(value);
      break;
    case 54:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBfmtIval(value);
      break;
    case 55:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBfmlIval(value);
      break;
    case 56:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBcmIval(value);
      break;
    case 57:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPlmra(value);
      break;
    case 58:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPlmla(value);
      break;
    case 59:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPlmtr(value);
      break;
    case 60:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPlmrl(value);
      break;
    case 61:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPlmll(value);
      break;
    case 62:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setCmt(value);
      break;
    case 63:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setCmm(value);
      break;
    case 64:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setCmf(value);
      break;
    case 65:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBmr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.BIAInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.BIAInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.BIAInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BIAInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPbf();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getFfm();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getBfm();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getLmra();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getLmla();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
  f = message.getLmtr();
  if (f !== 0.0) {
    writer.writeFloat(
      6,
      f
    );
  }
  f = message.getLmrl();
  if (f !== 0.0) {
    writer.writeFloat(
      7,
      f
    );
  }
  f = message.getLmll();
  if (f !== 0.0) {
    writer.writeFloat(
      8,
      f
    );
  }
  f = message.getLm();
  if (f !== 0.0) {
    writer.writeFloat(
      9,
      f
    );
  }
  f = message.getTm();
  if (f !== 0.0) {
    writer.writeFloat(
      10,
      f
    );
  }
  f = message.getEcfra();
  if (f !== 0.0) {
    writer.writeFloat(
      11,
      f
    );
  }
  f = message.getEcfla();
  if (f !== 0.0) {
    writer.writeFloat(
      12,
      f
    );
  }
  f = message.getEcftr();
  if (f !== 0.0) {
    writer.writeFloat(
      13,
      f
    );
  }
  f = message.getEcfrl();
  if (f !== 0.0) {
    writer.writeFloat(
      14,
      f
    );
  }
  f = message.getEcfll();
  if (f !== 0.0) {
    writer.writeFloat(
      15,
      f
    );
  }
  f = message.getEcwra();
  if (f !== 0.0) {
    writer.writeFloat(
      16,
      f
    );
  }
  f = message.getEcwla();
  if (f !== 0.0) {
    writer.writeFloat(
      17,
      f
    );
  }
  f = message.getEcwtr();
  if (f !== 0.0) {
    writer.writeFloat(
      18,
      f
    );
  }
  f = message.getEcwrl();
  if (f !== 0.0) {
    writer.writeFloat(
      19,
      f
    );
  }
  f = message.getEcwll();
  if (f !== 0.0) {
    writer.writeFloat(
      20,
      f
    );
  }
  f = message.getEcwt();
  if (f !== 0.0) {
    writer.writeFloat(
      21,
      f
    );
  }
  f = message.getEcf();
  if (f !== 0.0) {
    writer.writeFloat(
      22,
      f
    );
  }
  f = message.getIcw();
  if (f !== 0.0) {
    writer.writeFloat(
      23,
      f
    );
  }
  f = message.getEcw();
  if (f !== 0.0) {
    writer.writeFloat(
      24,
      f
    );
  }
  f = message.getTbw();
  if (f !== 0.0) {
    writer.writeFloat(
      25,
      f
    );
  }
  f = message.getProtein();
  if (f !== 0.0) {
    writer.writeFloat(
      26,
      f
    );
  }
  f = message.getBcm();
  if (f !== 0.0) {
    writer.writeFloat(
      27,
      f
    );
  }
  f = message.getPbfmra();
  if (f !== 0.0) {
    writer.writeFloat(
      28,
      f
    );
  }
  f = message.getPbfmla();
  if (f !== 0.0) {
    writer.writeFloat(
      29,
      f
    );
  }
  f = message.getPbfmtr();
  if (f !== 0.0) {
    writer.writeFloat(
      30,
      f
    );
  }
  f = message.getPbfmrl();
  if (f !== 0.0) {
    writer.writeFloat(
      31,
      f
    );
  }
  f = message.getPbfmll();
  if (f !== 0.0) {
    writer.writeFloat(
      32,
      f
    );
  }
  f = message.getWhr();
  if (f !== 0.0) {
    writer.writeFloat(
      33,
      f
    );
  }
  f = message.getVfa();
  if (f !== 0.0) {
    writer.writeFloat(
      34,
      f
    );
  }
  f = message.getScore();
  if (f !== 0.0) {
    writer.writeFloat(
      35,
      f
    );
  }
  f = message.getPbfIval();
  if (f !== 0.0) {
    writer.writeFloat(
      36,
      f
    );
  }
  f = message.getBmiIval();
  if (f !== 0.0) {
    writer.writeFloat(
      37,
      f
    );
  }
  f = message.getWhrIval();
  if (f !== 0.0) {
    writer.writeFloat(
      38,
      f
    );
  }
  f = message.getWtIval();
  if (f !== 0.0) {
    writer.writeFloat(
      39,
      f
    );
  }
  f = message.getBfmIval();
  if (f !== 0.0) {
    writer.writeFloat(
      40,
      f
    );
  }
  f = message.getFfmIval();
  if (f !== 0.0) {
    writer.writeFloat(
      41,
      f
    );
  }
  f = message.getBmrIval();
  if (f !== 0.0) {
    writer.writeFloat(
      42,
      f
    );
  }
  f = message.getTmIval();
  if (f !== 0.0) {
    writer.writeFloat(
      43,
      f
    );
  }
  f = message.getBmcIval();
  if (f !== 0.0) {
    writer.writeFloat(
      44,
      f
    );
  }
  f = message.getLmIval();
  if (f !== 0.0) {
    writer.writeFloat(
      45,
      f
    );
  }
  f = message.getTbwIval();
  if (f !== 0.0) {
    writer.writeFloat(
      46,
      f
    );
  }
  f = message.getProteinIval();
  if (f !== 0.0) {
    writer.writeFloat(
      47,
      f
    );
  }
  f = message.getEcwIval();
  if (f !== 0.0) {
    writer.writeFloat(
      48,
      f
    );
  }
  f = message.getIcwIval();
  if (f !== 0.0) {
    writer.writeFloat(
      49,
      f
    );
  }
  f = message.getLmaIval();
  if (f !== 0.0) {
    writer.writeFloat(
      50,
      f
    );
  }
  f = message.getLmtIval();
  if (f !== 0.0) {
    writer.writeFloat(
      51,
      f
    );
  }
  f = message.getLmlIval();
  if (f !== 0.0) {
    writer.writeFloat(
      52,
      f
    );
  }
  f = message.getBfmaIval();
  if (f !== 0.0) {
    writer.writeFloat(
      53,
      f
    );
  }
  f = message.getBfmtIval();
  if (f !== 0.0) {
    writer.writeFloat(
      54,
      f
    );
  }
  f = message.getBfmlIval();
  if (f !== 0.0) {
    writer.writeFloat(
      55,
      f
    );
  }
  f = message.getBcmIval();
  if (f !== 0.0) {
    writer.writeFloat(
      56,
      f
    );
  }
  f = message.getPlmra();
  if (f !== 0.0) {
    writer.writeFloat(
      57,
      f
    );
  }
  f = message.getPlmla();
  if (f !== 0.0) {
    writer.writeFloat(
      58,
      f
    );
  }
  f = message.getPlmtr();
  if (f !== 0.0) {
    writer.writeFloat(
      59,
      f
    );
  }
  f = message.getPlmrl();
  if (f !== 0.0) {
    writer.writeFloat(
      60,
      f
    );
  }
  f = message.getPlmll();
  if (f !== 0.0) {
    writer.writeFloat(
      61,
      f
    );
  }
  f = message.getCmt();
  if (f !== 0.0) {
    writer.writeFloat(
      62,
      f
    );
  }
  f = message.getCmm();
  if (f !== 0.0) {
    writer.writeFloat(
      63,
      f
    );
  }
  f = message.getCmf();
  if (f !== 0.0) {
    writer.writeFloat(
      64,
      f
    );
  }
  f = message.getBmr();
  if (f !== 0.0) {
    writer.writeFloat(
      65,
      f
    );
  }
};


/**
 * optional float PBF = 1;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbf = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbf = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional float FFM = 2;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getFfm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setFfm = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float BFM = 3;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBfm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBfm = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float LMRA = 4;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmra = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmra = function(value) {
  return jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional float LMLA = 5;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmla = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmla = function(value) {
  return jspb.Message.setProto3FloatField(this, 5, value);
};


/**
 * optional float LMTR = 6;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmtr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 6, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmtr = function(value) {
  return jspb.Message.setProto3FloatField(this, 6, value);
};


/**
 * optional float LMRL = 7;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmrl = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 7, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmrl = function(value) {
  return jspb.Message.setProto3FloatField(this, 7, value);
};


/**
 * optional float LMLL = 8;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmll = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 8, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmll = function(value) {
  return jspb.Message.setProto3FloatField(this, 8, value);
};


/**
 * optional float LM = 9;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 9, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLm = function(value) {
  return jspb.Message.setProto3FloatField(this, 9, value);
};


/**
 * optional float TM = 10;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getTm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 10, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setTm = function(value) {
  return jspb.Message.setProto3FloatField(this, 10, value);
};


/**
 * optional float ECFRA = 11;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcfra = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 11, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcfra = function(value) {
  return jspb.Message.setProto3FloatField(this, 11, value);
};


/**
 * optional float ECFLA = 12;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcfla = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 12, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcfla = function(value) {
  return jspb.Message.setProto3FloatField(this, 12, value);
};


/**
 * optional float ECFTR = 13;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcftr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 13, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcftr = function(value) {
  return jspb.Message.setProto3FloatField(this, 13, value);
};


/**
 * optional float ECFRL = 14;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcfrl = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 14, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcfrl = function(value) {
  return jspb.Message.setProto3FloatField(this, 14, value);
};


/**
 * optional float ECFLL = 15;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcfll = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 15, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcfll = function(value) {
  return jspb.Message.setProto3FloatField(this, 15, value);
};


/**
 * optional float ECWRA = 16;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwra = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 16, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwra = function(value) {
  return jspb.Message.setProto3FloatField(this, 16, value);
};


/**
 * optional float ECWLA = 17;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwla = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 17, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwla = function(value) {
  return jspb.Message.setProto3FloatField(this, 17, value);
};


/**
 * optional float ECWTR = 18;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwtr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 18, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwtr = function(value) {
  return jspb.Message.setProto3FloatField(this, 18, value);
};


/**
 * optional float ECWRL = 19;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwrl = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 19, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwrl = function(value) {
  return jspb.Message.setProto3FloatField(this, 19, value);
};


/**
 * optional float ECWLL = 20;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwll = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 20, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwll = function(value) {
  return jspb.Message.setProto3FloatField(this, 20, value);
};


/**
 * optional float ECWT = 21;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwt = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 21, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwt = function(value) {
  return jspb.Message.setProto3FloatField(this, 21, value);
};


/**
 * optional float ECF = 22;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcf = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 22, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcf = function(value) {
  return jspb.Message.setProto3FloatField(this, 22, value);
};


/**
 * optional float ICW = 23;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getIcw = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 23, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setIcw = function(value) {
  return jspb.Message.setProto3FloatField(this, 23, value);
};


/**
 * optional float ECW = 24;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcw = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 24, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcw = function(value) {
  return jspb.Message.setProto3FloatField(this, 24, value);
};


/**
 * optional float TBW = 25;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getTbw = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 25, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setTbw = function(value) {
  return jspb.Message.setProto3FloatField(this, 25, value);
};


/**
 * optional float PROTEIN = 26;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getProtein = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 26, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setProtein = function(value) {
  return jspb.Message.setProto3FloatField(this, 26, value);
};


/**
 * optional float BCM = 27;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBcm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 27, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBcm = function(value) {
  return jspb.Message.setProto3FloatField(this, 27, value);
};


/**
 * optional float PBFMRA = 28;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbfmra = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 28, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbfmra = function(value) {
  return jspb.Message.setProto3FloatField(this, 28, value);
};


/**
 * optional float PBFMLA = 29;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbfmla = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 29, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbfmla = function(value) {
  return jspb.Message.setProto3FloatField(this, 29, value);
};


/**
 * optional float PBFMTR = 30;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbfmtr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 30, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbfmtr = function(value) {
  return jspb.Message.setProto3FloatField(this, 30, value);
};


/**
 * optional float PBFMRL = 31;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbfmrl = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 31, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbfmrl = function(value) {
  return jspb.Message.setProto3FloatField(this, 31, value);
};


/**
 * optional float PBFMLL = 32;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbfmll = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 32, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbfmll = function(value) {
  return jspb.Message.setProto3FloatField(this, 32, value);
};


/**
 * optional float WHR = 33;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getWhr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 33, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setWhr = function(value) {
  return jspb.Message.setProto3FloatField(this, 33, value);
};


/**
 * optional float VFA = 34;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getVfa = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 34, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setVfa = function(value) {
  return jspb.Message.setProto3FloatField(this, 34, value);
};


/**
 * optional float SCORE = 35;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getScore = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 35, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setScore = function(value) {
  return jspb.Message.setProto3FloatField(this, 35, value);
};


/**
 * optional float PBF_IVAL = 36;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPbfIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 36, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPbfIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 36, value);
};


/**
 * optional float BMI_IVAL = 37;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBmiIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 37, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBmiIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 37, value);
};


/**
 * optional float WHR_IVAL = 38;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getWhrIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 38, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setWhrIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 38, value);
};


/**
 * optional float WT_IVAL = 39;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getWtIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 39, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setWtIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 39, value);
};


/**
 * optional float BFM_IVAL = 40;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBfmIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 40, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBfmIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 40, value);
};


/**
 * optional float FFM_IVAL = 41;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getFfmIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 41, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setFfmIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 41, value);
};


/**
 * optional float BMR_IVAL = 42;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBmrIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 42, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBmrIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 42, value);
};


/**
 * optional float TM_IVAL = 43;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getTmIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 43, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setTmIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 43, value);
};


/**
 * optional float BMC_IVAL = 44;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBmcIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 44, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBmcIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 44, value);
};


/**
 * optional float LM_IVAL = 45;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 45, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 45, value);
};


/**
 * optional float TBW_IVAL = 46;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getTbwIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 46, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setTbwIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 46, value);
};


/**
 * optional float PROTEIN_IVAL = 47;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getProteinIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 47, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setProteinIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 47, value);
};


/**
 * optional float ECW_IVAL = 48;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getEcwIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 48, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setEcwIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 48, value);
};


/**
 * optional float ICW_IVAL = 49;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getIcwIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 49, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setIcwIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 49, value);
};


/**
 * optional float LMA_IVAL = 50;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmaIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 50, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmaIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 50, value);
};


/**
 * optional float LMT_IVAL = 51;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmtIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 51, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmtIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 51, value);
};


/**
 * optional float LML_IVAL = 52;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getLmlIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 52, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setLmlIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 52, value);
};


/**
 * optional float BFMA_IVAL = 53;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBfmaIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 53, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBfmaIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 53, value);
};


/**
 * optional float BFMT_IVAL = 54;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBfmtIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 54, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBfmtIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 54, value);
};


/**
 * optional float BFML_IVAL = 55;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBfmlIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 55, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBfmlIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 55, value);
};


/**
 * optional float BCM_IVAL = 56;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBcmIval = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 56, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBcmIval = function(value) {
  return jspb.Message.setProto3FloatField(this, 56, value);
};


/**
 * optional float PLMRA = 57;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPlmra = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 57, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPlmra = function(value) {
  return jspb.Message.setProto3FloatField(this, 57, value);
};


/**
 * optional float PLMLA = 58;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPlmla = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 58, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPlmla = function(value) {
  return jspb.Message.setProto3FloatField(this, 58, value);
};


/**
 * optional float PLMTR = 59;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPlmtr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 59, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPlmtr = function(value) {
  return jspb.Message.setProto3FloatField(this, 59, value);
};


/**
 * optional float PLMRL = 60;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPlmrl = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 60, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPlmrl = function(value) {
  return jspb.Message.setProto3FloatField(this, 60, value);
};


/**
 * optional float PLMLL = 61;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getPlmll = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 61, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setPlmll = function(value) {
  return jspb.Message.setProto3FloatField(this, 61, value);
};


/**
 * optional float CMT = 62;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getCmt = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 62, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setCmt = function(value) {
  return jspb.Message.setProto3FloatField(this, 62, value);
};


/**
 * optional float CMM = 63;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getCmm = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 63, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setCmm = function(value) {
  return jspb.Message.setProto3FloatField(this, 63, value);
};


/**
 * optional float CMF = 64;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getCmf = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 64, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setCmf = function(value) {
  return jspb.Message.setProto3FloatField(this, 64, value);
};


/**
 * optional float BMR = 65;
 * @return {number}
 */
proto.client.BIAInfo.prototype.getBmr = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 65, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.BIAInfo} returns this
 */
proto.client.BIAInfo.prototype.setBmr = function(value) {
  return jspb.Message.setProto3FloatField(this, 65, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.BodyMeasureResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.BodyMeasureResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.BodyMeasureResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BodyMeasureResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    result: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    isFirst: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    data: (f = msg.getData()) && proto.client.BodyMeasureResultReq.Data.toObject(includeInstance, f),
    reason: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.BodyMeasureResultReq}
 */
proto.client.BodyMeasureResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.BodyMeasureResultReq;
  return proto.client.BodyMeasureResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.BodyMeasureResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.BodyMeasureResultReq}
 */
proto.client.BodyMeasureResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setResult(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsFirst(value);
      break;
    case 3:
      var value = new proto.client.BodyMeasureResultReq.Data;
      reader.readMessage(value,proto.client.BodyMeasureResultReq.Data.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    case 4:
      var value = /** @type {!proto.client.BodyMeasureResultReq.Reason} */ (reader.readEnum());
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.BodyMeasureResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.BodyMeasureResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.BodyMeasureResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BodyMeasureResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResult();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getIsFirst();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.client.BodyMeasureResultReq.Data.serializeBinaryToWriter
    );
  }
  f = message.getReason();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.BodyMeasureResultReq.Reason = {
  INVALID: 0,
  RESISTANCE_MEASURE_ERROR: 1,
  FAT_BOARD_CONNECT: 2,
  CENTER_CTRL_BOARD: 3,
  HEIGHT_ERROR: 4,
  SEX_ERROR: 5,
  AGE_ERROR: 6
};




if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.BodyMeasureResultReq.Data.prototype.toObject = function(opt_includeInstance) {
  return proto.client.BodyMeasureResultReq.Data.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.BodyMeasureResultReq.Data} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BodyMeasureResultReq.Data.toObject = function(includeInstance, msg) {
  var f, obj = {
    bodyInfo: (f = msg.getBodyInfo()) && proto.client.BodyInfo.toObject(includeInstance, f),
    resInfo: (f = msg.getResInfo()) && proto.client.ResistanceInfo.toObject(includeInstance, f),
    secondResInfo: (f = msg.getSecondResInfo()) && proto.client.ResistanceInfo.toObject(includeInstance, f),
    biaInfo: (f = msg.getBiaInfo()) && proto.client.BIAInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.BodyMeasureResultReq.Data}
 */
proto.client.BodyMeasureResultReq.Data.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.BodyMeasureResultReq.Data;
  return proto.client.BodyMeasureResultReq.Data.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.BodyMeasureResultReq.Data} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.BodyMeasureResultReq.Data}
 */
proto.client.BodyMeasureResultReq.Data.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.client.BodyInfo;
      reader.readMessage(value,proto.client.BodyInfo.deserializeBinaryFromReader);
      msg.setBodyInfo(value);
      break;
    case 2:
      var value = new proto.client.ResistanceInfo;
      reader.readMessage(value,proto.client.ResistanceInfo.deserializeBinaryFromReader);
      msg.setResInfo(value);
      break;
    case 3:
      var value = new proto.client.ResistanceInfo;
      reader.readMessage(value,proto.client.ResistanceInfo.deserializeBinaryFromReader);
      msg.setSecondResInfo(value);
      break;
    case 4:
      var value = new proto.client.BIAInfo;
      reader.readMessage(value,proto.client.BIAInfo.deserializeBinaryFromReader);
      msg.setBiaInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.BodyMeasureResultReq.Data.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.BodyMeasureResultReq.Data.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.BodyMeasureResultReq.Data} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BodyMeasureResultReq.Data.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBodyInfo();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.client.BodyInfo.serializeBinaryToWriter
    );
  }
  f = message.getResInfo();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.client.ResistanceInfo.serializeBinaryToWriter
    );
  }
  f = message.getSecondResInfo();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.client.ResistanceInfo.serializeBinaryToWriter
    );
  }
  f = message.getBiaInfo();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.client.BIAInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional BodyInfo body_info = 1;
 * @return {?proto.client.BodyInfo}
 */
proto.client.BodyMeasureResultReq.Data.prototype.getBodyInfo = function() {
  return /** @type{?proto.client.BodyInfo} */ (
    jspb.Message.getWrapperField(this, proto.client.BodyInfo, 1));
};


/**
 * @param {?proto.client.BodyInfo|undefined} value
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
*/
proto.client.BodyMeasureResultReq.Data.prototype.setBodyInfo = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
 */
proto.client.BodyMeasureResultReq.Data.prototype.clearBodyInfo = function() {
  return this.setBodyInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.Data.prototype.hasBodyInfo = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ResistanceInfo res_info = 2;
 * @return {?proto.client.ResistanceInfo}
 */
proto.client.BodyMeasureResultReq.Data.prototype.getResInfo = function() {
  return /** @type{?proto.client.ResistanceInfo} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceInfo, 2));
};


/**
 * @param {?proto.client.ResistanceInfo|undefined} value
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
*/
proto.client.BodyMeasureResultReq.Data.prototype.setResInfo = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
 */
proto.client.BodyMeasureResultReq.Data.prototype.clearResInfo = function() {
  return this.setResInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.Data.prototype.hasResInfo = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ResistanceInfo second_res_info = 3;
 * @return {?proto.client.ResistanceInfo}
 */
proto.client.BodyMeasureResultReq.Data.prototype.getSecondResInfo = function() {
  return /** @type{?proto.client.ResistanceInfo} */ (
    jspb.Message.getWrapperField(this, proto.client.ResistanceInfo, 3));
};


/**
 * @param {?proto.client.ResistanceInfo|undefined} value
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
*/
proto.client.BodyMeasureResultReq.Data.prototype.setSecondResInfo = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
 */
proto.client.BodyMeasureResultReq.Data.prototype.clearSecondResInfo = function() {
  return this.setSecondResInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.Data.prototype.hasSecondResInfo = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional BIAInfo bia_info = 4;
 * @return {?proto.client.BIAInfo}
 */
proto.client.BodyMeasureResultReq.Data.prototype.getBiaInfo = function() {
  return /** @type{?proto.client.BIAInfo} */ (
    jspb.Message.getWrapperField(this, proto.client.BIAInfo, 4));
};


/**
 * @param {?proto.client.BIAInfo|undefined} value
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
*/
proto.client.BodyMeasureResultReq.Data.prototype.setBiaInfo = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.BodyMeasureResultReq.Data} returns this
 */
proto.client.BodyMeasureResultReq.Data.prototype.clearBiaInfo = function() {
  return this.setBiaInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.Data.prototype.hasBiaInfo = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bool result = 1;
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.prototype.getResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.BodyMeasureResultReq} returns this
 */
proto.client.BodyMeasureResultReq.prototype.setResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional bool is_first = 2;
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.prototype.getIsFirst = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.BodyMeasureResultReq} returns this
 */
proto.client.BodyMeasureResultReq.prototype.setIsFirst = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional Data data = 3;
 * @return {?proto.client.BodyMeasureResultReq.Data}
 */
proto.client.BodyMeasureResultReq.prototype.getData = function() {
  return /** @type{?proto.client.BodyMeasureResultReq.Data} */ (
    jspb.Message.getWrapperField(this, proto.client.BodyMeasureResultReq.Data, 3));
};


/**
 * @param {?proto.client.BodyMeasureResultReq.Data|undefined} value
 * @return {!proto.client.BodyMeasureResultReq} returns this
*/
proto.client.BodyMeasureResultReq.prototype.setData = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.client.BodyMeasureResultReq} returns this
 */
proto.client.BodyMeasureResultReq.prototype.clearData = function() {
  return this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.client.BodyMeasureResultReq.prototype.hasData = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional Reason reason = 4;
 * @return {!proto.client.BodyMeasureResultReq.Reason}
 */
proto.client.BodyMeasureResultReq.prototype.getReason = function() {
  return /** @type {!proto.client.BodyMeasureResultReq.Reason} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.client.BodyMeasureResultReq.Reason} value
 * @return {!proto.client.BodyMeasureResultReq} returns this
 */
proto.client.BodyMeasureResultReq.prototype.setReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.TableBodyMeasureResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.TableBodyMeasureResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.TableBodyMeasureResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.TableBodyMeasureResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    result: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    originresistance: jspb.Message.getFieldWithDefault(msg, 2, 0),
    enciphermentresistance: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.TableBodyMeasureResultReq}
 */
proto.client.TableBodyMeasureResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.TableBodyMeasureResultReq;
  return proto.client.TableBodyMeasureResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.TableBodyMeasureResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.TableBodyMeasureResultReq}
 */
proto.client.TableBodyMeasureResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setResult(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setOriginresistance(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setEnciphermentresistance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.TableBodyMeasureResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.TableBodyMeasureResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.TableBodyMeasureResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.TableBodyMeasureResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResult();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getOriginresistance();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getEnciphermentresistance();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * optional bool result = 1;
 * @return {boolean}
 */
proto.client.TableBodyMeasureResultReq.prototype.getResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.TableBodyMeasureResultReq} returns this
 */
proto.client.TableBodyMeasureResultReq.prototype.setResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional uint32 originResistance = 2;
 * @return {number}
 */
proto.client.TableBodyMeasureResultReq.prototype.getOriginresistance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.TableBodyMeasureResultReq} returns this
 */
proto.client.TableBodyMeasureResultReq.prototype.setOriginresistance = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint32 enciphermentResistance = 3;
 * @return {number}
 */
proto.client.TableBodyMeasureResultReq.prototype.getEnciphermentresistance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.TableBodyMeasureResultReq} returns this
 */
proto.client.TableBodyMeasureResultReq.prototype.setEnciphermentresistance = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.BacklightResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.BacklightResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.BacklightResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BacklightResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.BacklightResultReq}
 */
proto.client.BacklightResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.BacklightResultReq;
  return proto.client.BacklightResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.BacklightResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.BacklightResultReq}
 */
proto.client.BacklightResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setValue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.BacklightResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.BacklightResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.BacklightResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.BacklightResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 value = 1;
 * @return {number}
 */
proto.client.BacklightResultReq.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.BacklightResultReq} returns this
 */
proto.client.BacklightResultReq.prototype.setValue = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.StandStateReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.StandStateReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.StandStateReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.StandStateReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    person: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.StandStateReq}
 */
proto.client.StandStateReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.StandStateReq;
  return proto.client.StandStateReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.StandStateReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.StandStateReq}
 */
proto.client.StandStateReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPerson(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.StandStateReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.StandStateReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.StandStateReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.StandStateReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPerson();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool person = 1;
 * @return {boolean}
 */
proto.client.StandStateReq.prototype.getPerson = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.StandStateReq} returns this
 */
proto.client.StandStateReq.prototype.setPerson = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ButtonEventReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ButtonEventReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ButtonEventReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ButtonEventReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    event: jspb.Message.getFieldWithDefault(msg, 1, 0),
    longClick: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ButtonEventReq}
 */
proto.client.ButtonEventReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ButtonEventReq;
  return proto.client.ButtonEventReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ButtonEventReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ButtonEventReq}
 */
proto.client.ButtonEventReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.ButtonEventReq.Event} */ (reader.readEnum());
      msg.setEvent(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLongClick(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ButtonEventReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ButtonEventReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ButtonEventReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ButtonEventReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEvent();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getLongClick();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ButtonEventReq.Event = {
  INVALID: 0,
  SOFT_SWITCH_PRESS: 1,
  SOFT_SWITCH_RELEASE: 2,
  KEY_UP: 3,
  KEY_DOWN: 4,
  KEY_BACK: 5,
  KEY_ENTER: 6,
  KEY_PRINT: 7
};

/**
 * optional Event event = 1;
 * @return {!proto.client.ButtonEventReq.Event}
 */
proto.client.ButtonEventReq.prototype.getEvent = function() {
  return /** @type {!proto.client.ButtonEventReq.Event} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.ButtonEventReq.Event} value
 * @return {!proto.client.ButtonEventReq} returns this
 */
proto.client.ButtonEventReq.prototype.setEvent = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional bool long_click = 2;
 * @return {boolean}
 */
proto.client.ButtonEventReq.prototype.getLongClick = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.ButtonEventReq} returns this
 */
proto.client.ButtonEventReq.prototype.setLongClick = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.HardwareStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.HardwareStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.HardwareStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HardwareStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, 0),
    status: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    detail: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.HardwareStatusReq}
 */
proto.client.HardwareStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.HardwareStatusReq;
  return proto.client.HardwareStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.HardwareStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.HardwareStatusReq}
 */
proto.client.HardwareStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.HardwareStatusReq.Type} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setStatus(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setDetail(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.HardwareStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.HardwareStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.HardwareStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HardwareStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getStatus();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getDetail();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.HardwareStatusReq.Type = {
  INVALID: 0,
  WEIGHT_BOARD: 1,
  FAT_BOARD: 2,
  CENTER_CTRL_BOARD: 3,
  TABLE: 4,
  TOUCH: 5,
  TABLE_FAULT: 6
};

/**
 * optional Type type = 1;
 * @return {!proto.client.HardwareStatusReq.Type}
 */
proto.client.HardwareStatusReq.prototype.getType = function() {
  return /** @type {!proto.client.HardwareStatusReq.Type} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.HardwareStatusReq.Type} value
 * @return {!proto.client.HardwareStatusReq} returns this
 */
proto.client.HardwareStatusReq.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional bool status = 2;
 * @return {boolean}
 */
proto.client.HardwareStatusReq.prototype.getStatus = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.HardwareStatusReq} returns this
 */
proto.client.HardwareStatusReq.prototype.setStatus = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional string detail = 3;
 * @return {string}
 */
proto.client.HardwareStatusReq.prototype.getDetail = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.HardwareStatusReq} returns this
 */
proto.client.HardwareStatusReq.prototype.setDetail = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.AlgServiceStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.AlgServiceStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.AlgServiceStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AlgServiceStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    serviceStatus: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.AlgServiceStatusReq}
 */
proto.client.AlgServiceStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.AlgServiceStatusReq;
  return proto.client.AlgServiceStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.AlgServiceStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.AlgServiceStatusReq}
 */
proto.client.AlgServiceStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.AlgServiceStatusReq.Status} */ (reader.readEnum());
      msg.setServiceStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.AlgServiceStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.AlgServiceStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.AlgServiceStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AlgServiceStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getServiceStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.AlgServiceStatusReq.Status = {
  INVALID: 0,
  READY: 1,
  FAULT: 2
};

/**
 * optional Status service_status = 1;
 * @return {!proto.client.AlgServiceStatusReq.Status}
 */
proto.client.AlgServiceStatusReq.prototype.getServiceStatus = function() {
  return /** @type {!proto.client.AlgServiceStatusReq.Status} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.AlgServiceStatusReq.Status} value
 * @return {!proto.client.AlgServiceStatusReq} returns this
 */
proto.client.AlgServiceStatusReq.prototype.setServiceStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.CheckSelfReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.CheckSelfReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.CheckSelfReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.CheckSelfReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    result: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    depthCamera: jspb.Message.getFieldWithDefault(msg, 2, 0),
    fisheyeCamera: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.CheckSelfReq}
 */
proto.client.CheckSelfReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.CheckSelfReq;
  return proto.client.CheckSelfReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.CheckSelfReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.CheckSelfReq}
 */
proto.client.CheckSelfReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setResult(value);
      break;
    case 2:
      var value = /** @type {!proto.client.CameraStatus} */ (reader.readEnum());
      msg.setDepthCamera(value);
      break;
    case 3:
      var value = /** @type {!proto.client.CameraStatus} */ (reader.readEnum());
      msg.setFisheyeCamera(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.CheckSelfReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.CheckSelfReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.CheckSelfReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.CheckSelfReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResult();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getDepthCamera();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getFisheyeCamera();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional bool result = 1;
 * @return {boolean}
 */
proto.client.CheckSelfReq.prototype.getResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.CheckSelfReq} returns this
 */
proto.client.CheckSelfReq.prototype.setResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional CameraStatus depth_camera = 2;
 * @return {!proto.client.CameraStatus}
 */
proto.client.CheckSelfReq.prototype.getDepthCamera = function() {
  return /** @type {!proto.client.CameraStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.client.CameraStatus} value
 * @return {!proto.client.CheckSelfReq} returns this
 */
proto.client.CheckSelfReq.prototype.setDepthCamera = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional CameraStatus fisheye_camera = 3;
 * @return {!proto.client.CameraStatus}
 */
proto.client.CheckSelfReq.prototype.getFisheyeCamera = function() {
  return /** @type {!proto.client.CameraStatus} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.client.CameraStatus} value
 * @return {!proto.client.CheckSelfReq} returns this
 */
proto.client.CheckSelfReq.prototype.setFisheyeCamera = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.DepthCameraStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.DepthCameraStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.DepthCameraStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.DepthCameraStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    depthCamera: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.DepthCameraStatusReq}
 */
proto.client.DepthCameraStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.DepthCameraStatusReq;
  return proto.client.DepthCameraStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.DepthCameraStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.DepthCameraStatusReq}
 */
proto.client.DepthCameraStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.CameraStatus} */ (reader.readEnum());
      msg.setDepthCamera(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.DepthCameraStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.DepthCameraStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.DepthCameraStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.DepthCameraStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDepthCamera();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional CameraStatus depth_camera = 1;
 * @return {!proto.client.CameraStatus}
 */
proto.client.DepthCameraStatusReq.prototype.getDepthCamera = function() {
  return /** @type {!proto.client.CameraStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.CameraStatus} value
 * @return {!proto.client.DepthCameraStatusReq} returns this
 */
proto.client.DepthCameraStatusReq.prototype.setDepthCamera = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.FisheyeCameraStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.FisheyeCameraStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.FisheyeCameraStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.FisheyeCameraStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    fisheyeCamera: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.FisheyeCameraStatusReq}
 */
proto.client.FisheyeCameraStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.FisheyeCameraStatusReq;
  return proto.client.FisheyeCameraStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.FisheyeCameraStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.FisheyeCameraStatusReq}
 */
proto.client.FisheyeCameraStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.CameraStatus} */ (reader.readEnum());
      msg.setFisheyeCamera(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.FisheyeCameraStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.FisheyeCameraStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.FisheyeCameraStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.FisheyeCameraStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFisheyeCamera();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional CameraStatus fisheye_camera = 1;
 * @return {!proto.client.CameraStatus}
 */
proto.client.FisheyeCameraStatusReq.prototype.getFisheyeCamera = function() {
  return /** @type {!proto.client.CameraStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.CameraStatus} value
 * @return {!proto.client.FisheyeCameraStatusReq} returns this
 */
proto.client.FisheyeCameraStatusReq.prototype.setFisheyeCamera = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.SurveyorStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.SurveyorStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.SurveyorStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.SurveyorStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    surveyorStatus: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.SurveyorStatusReq}
 */
proto.client.SurveyorStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.SurveyorStatusReq;
  return proto.client.SurveyorStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.SurveyorStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.SurveyorStatusReq}
 */
proto.client.SurveyorStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.SurveyorStatusReq.Status} */ (reader.readEnum());
      msg.setSurveyorStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.SurveyorStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.SurveyorStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.SurveyorStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.SurveyorStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSurveyorStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.SurveyorStatusReq.Status = {
  INVALID: 0,
  ONE_PERSON: 1,
  MUTIPLE_PERSON: 2,
  NO_PERSON: 3
};

/**
 * optional Status surveyor_status = 1;
 * @return {!proto.client.SurveyorStatusReq.Status}
 */
proto.client.SurveyorStatusReq.prototype.getSurveyorStatus = function() {
  return /** @type {!proto.client.SurveyorStatusReq.Status} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.SurveyorStatusReq.Status} value
 * @return {!proto.client.SurveyorStatusReq} returns this
 */
proto.client.SurveyorStatusReq.prototype.setSurveyorStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ErrorStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ErrorStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ErrorStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ErrorStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    errorStatus: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ErrorStatusReq}
 */
proto.client.ErrorStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ErrorStatusReq;
  return proto.client.ErrorStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ErrorStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ErrorStatusReq}
 */
proto.client.ErrorStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.ErrorStatusReq.Status} */ (reader.readEnum());
      msg.setErrorStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ErrorStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ErrorStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ErrorStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ErrorStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErrorStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ErrorStatusReq.Status = {
  INVALID: 0,
  DEPTH_CAMERA_ERROR: 1,
  FISHEYE_CAMERA_ERROR: 2
};

/**
 * optional Status error_status = 1;
 * @return {!proto.client.ErrorStatusReq.Status}
 */
proto.client.ErrorStatusReq.prototype.getErrorStatus = function() {
  return /** @type {!proto.client.ErrorStatusReq.Status} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.ErrorStatusReq.Status} value
 * @return {!proto.client.ErrorStatusReq} returns this
 */
proto.client.ErrorStatusReq.prototype.setErrorStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ScanResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ScanResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ScanResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ScanResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    scanId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    scanType: jspb.Message.getFieldWithDefault(msg, 3, 0),
    imagePath: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ScanResultReq}
 */
proto.client.ScanResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ScanResultReq;
  return proto.client.ScanResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ScanResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ScanResultReq}
 */
proto.client.ScanResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setDetectResult(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setScanId(value);
      break;
    case 3:
      var value = /** @type {!proto.client.ScanResultReq.ScanType} */ (reader.readEnum());
      msg.setScanType(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setImagePath(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ScanResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ScanResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ScanResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ScanResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getScanId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getScanType();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getImagePath();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ScanResultReq.ScanType = {
  INVALID: 0,
  BODY_SCAN_NORMAL: 1,
  BODY_SCAN_POSTURE: 2
};

/**
 * optional bool detect_result = 1;
 * @return {boolean}
 */
proto.client.ScanResultReq.prototype.getDetectResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.ScanResultReq} returns this
 */
proto.client.ScanResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional string scan_id = 2;
 * @return {string}
 */
proto.client.ScanResultReq.prototype.getScanId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.ScanResultReq} returns this
 */
proto.client.ScanResultReq.prototype.setScanId = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional ScanType scan_type = 3;
 * @return {!proto.client.ScanResultReq.ScanType}
 */
proto.client.ScanResultReq.prototype.getScanType = function() {
  return /** @type {!proto.client.ScanResultReq.ScanType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.client.ScanResultReq.ScanType} value
 * @return {!proto.client.ScanResultReq} returns this
 */
proto.client.ScanResultReq.prototype.setScanType = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional string image_path = 4;
 * @return {string}
 */
proto.client.ScanResultReq.prototype.getImagePath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.ScanResultReq} returns this
 */
proto.client.ScanResultReq.prototype.setImagePath = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.AposeDetectResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.AposeDetectResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.AposeDetectResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AposeDetectResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.AposeDetectResultReq}
 */
proto.client.AposeDetectResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.AposeDetectResultReq;
  return proto.client.AposeDetectResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.AposeDetectResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.AposeDetectResultReq}
 */
proto.client.AposeDetectResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.AposeDetectResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.AposeDetectResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.AposeDetectResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.AposeDetectResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AposeDetectResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.AposeDetectResultReq.DetectResult = {
  INVALID: 0,
  A_POSE_READY: 1,
  A_POSE_RAISE: 2,
  A_POSE_FALL: 3
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.AposeDetectResultReq.DetectResult}
 */
proto.client.AposeDetectResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.AposeDetectResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.AposeDetectResultReq.DetectResult} value
 * @return {!proto.client.AposeDetectResultReq} returns this
 */
proto.client.AposeDetectResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.IposeDetectResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.IposeDetectResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.IposeDetectResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.IposeDetectResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.IposeDetectResultReq}
 */
proto.client.IposeDetectResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.IposeDetectResultReq;
  return proto.client.IposeDetectResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.IposeDetectResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.IposeDetectResultReq}
 */
proto.client.IposeDetectResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.IposeDetectResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.IposeDetectResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.IposeDetectResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.IposeDetectResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.IposeDetectResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.IposeDetectResultReq.DetectResult = {
  INVALID: 0,
  I_POSE_READY: 1
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.IposeDetectResultReq.DetectResult}
 */
proto.client.IposeDetectResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.IposeDetectResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.IposeDetectResultReq.DetectResult} value
 * @return {!proto.client.IposeDetectResultReq} returns this
 */
proto.client.IposeDetectResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.GestureDetectResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.GestureDetectResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.GestureDetectResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.GestureDetectResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.GestureDetectResultReq}
 */
proto.client.GestureDetectResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.GestureDetectResultReq;
  return proto.client.GestureDetectResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.GestureDetectResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.GestureDetectResultReq}
 */
proto.client.GestureDetectResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.GestureDetectResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.GestureDetectResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.GestureDetectResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.GestureDetectResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.GestureDetectResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.GestureDetectResultReq.DetectResult = {
  INVALID: 0,
  LEFT_HAND: 1,
  RIGHT_HAND: 2,
  BOTH_HAND: 3
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.GestureDetectResultReq.DetectResult}
 */
proto.client.GestureDetectResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.GestureDetectResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.GestureDetectResultReq.DetectResult} value
 * @return {!proto.client.GestureDetectResultReq} returns this
 */
proto.client.GestureDetectResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.PersonDetectResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.PersonDetectResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.PersonDetectResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.PersonDetectResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.PersonDetectResultReq}
 */
proto.client.PersonDetectResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.PersonDetectResultReq;
  return proto.client.PersonDetectResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.PersonDetectResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.PersonDetectResultReq}
 */
proto.client.PersonDetectResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.PersonDetectResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.PersonDetectResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.PersonDetectResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.PersonDetectResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.PersonDetectResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.PersonDetectResultReq.DetectResult = {
  INVALID: 0,
  STATION_PERSON: 1
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.PersonDetectResultReq.DetectResult}
 */
proto.client.PersonDetectResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.PersonDetectResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.PersonDetectResultReq.DetectResult} value
 * @return {!proto.client.PersonDetectResultReq} returns this
 */
proto.client.PersonDetectResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.GestureIposeResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.GestureIposeResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.GestureIposeResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.GestureIposeResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.GestureIposeResultReq}
 */
proto.client.GestureIposeResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.GestureIposeResultReq;
  return proto.client.GestureIposeResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.GestureIposeResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.GestureIposeResultReq}
 */
proto.client.GestureIposeResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.GestureIposeResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.GestureIposeResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.GestureIposeResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.GestureIposeResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.GestureIposeResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.GestureIposeResultReq.DetectResult = {
  INVALID: 0,
  I_POSE: 1
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.GestureIposeResultReq.DetectResult}
 */
proto.client.GestureIposeResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.GestureIposeResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.GestureIposeResultReq.DetectResult} value
 * @return {!proto.client.GestureIposeResultReq} returns this
 */
proto.client.GestureIposeResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.AmbientLightResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.AmbientLightResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.AmbientLightResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AmbientLightResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.AmbientLightResultReq}
 */
proto.client.AmbientLightResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.AmbientLightResultReq;
  return proto.client.AmbientLightResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.AmbientLightResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.AmbientLightResultReq}
 */
proto.client.AmbientLightResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.AmbientLightResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.AmbientLightResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.AmbientLightResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.AmbientLightResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AmbientLightResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.AmbientLightResultReq.DetectResult = {
  INVALID: 0,
  OK: 1,
  WEAK: 2,
  DARK: 3
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.AmbientLightResultReq.DetectResult}
 */
proto.client.AmbientLightResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.AmbientLightResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.AmbientLightResultReq.DetectResult} value
 * @return {!proto.client.AmbientLightResultReq} returns this
 */
proto.client.AmbientLightResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.ShoulderDetectResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.ShoulderDetectResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.ShoulderDetectResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ShoulderDetectResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    detectType: jspb.Message.getFieldWithDefault(msg, 2, 0),
    angle: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.ShoulderDetectResultReq}
 */
proto.client.ShoulderDetectResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.ShoulderDetectResultReq;
  return proto.client.ShoulderDetectResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.ShoulderDetectResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.ShoulderDetectResultReq}
 */
proto.client.ShoulderDetectResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setDetectResult(value);
      break;
    case 2:
      var value = /** @type {!proto.client.ShoulderDetectResultReq.DetectType} */ (reader.readEnum());
      msg.setDetectType(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setAngle(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.ShoulderDetectResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.ShoulderDetectResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.ShoulderDetectResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.ShoulderDetectResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getDetectType();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getAngle();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.ShoulderDetectResultReq.DetectType = {
  INVALID: 0,
  LEFT_ABDUCTION_UP: 1,
  RIGHT_ABDUCTION_UP: 2,
  LEFT_ANTEXION_UP: 3,
  RIGHT_ANTEXION_UP: 4
};

/**
 * optional bool detect_result = 1;
 * @return {boolean}
 */
proto.client.ShoulderDetectResultReq.prototype.getDetectResult = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.ShoulderDetectResultReq} returns this
 */
proto.client.ShoulderDetectResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional DetectType detect_type = 2;
 * @return {!proto.client.ShoulderDetectResultReq.DetectType}
 */
proto.client.ShoulderDetectResultReq.prototype.getDetectType = function() {
  return /** @type {!proto.client.ShoulderDetectResultReq.DetectType} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.client.ShoulderDetectResultReq.DetectType} value
 * @return {!proto.client.ShoulderDetectResultReq} returns this
 */
proto.client.ShoulderDetectResultReq.prototype.setDetectType = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional float angle = 3;
 * @return {number}
 */
proto.client.ShoulderDetectResultReq.prototype.getAngle = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.ShoulderDetectResultReq} returns this
 */
proto.client.ShoulderDetectResultReq.prototype.setAngle = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.StartShoulderLegalityResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.StartShoulderLegalityResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.StartShoulderLegalityResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.StartShoulderLegalityResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    detectResult: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.StartShoulderLegalityResultReq}
 */
proto.client.StartShoulderLegalityResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.StartShoulderLegalityResultReq;
  return proto.client.StartShoulderLegalityResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.StartShoulderLegalityResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.StartShoulderLegalityResultReq}
 */
proto.client.StartShoulderLegalityResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.StartShoulderLegalityResultReq.DetectResult} */ (reader.readEnum());
      msg.setDetectResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.StartShoulderLegalityResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.StartShoulderLegalityResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.StartShoulderLegalityResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.StartShoulderLegalityResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDetectResult();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.client.StartShoulderLegalityResultReq.DetectResult = {
  INVALID: 0,
  HEAD_READY: 1
};

/**
 * optional DetectResult detect_result = 1;
 * @return {!proto.client.StartShoulderLegalityResultReq.DetectResult}
 */
proto.client.StartShoulderLegalityResultReq.prototype.getDetectResult = function() {
  return /** @type {!proto.client.StartShoulderLegalityResultReq.DetectResult} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.StartShoulderLegalityResultReq.DetectResult} value
 * @return {!proto.client.StartShoulderLegalityResultReq} returns this
 */
proto.client.StartShoulderLegalityResultReq.prototype.setDetectResult = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.QRCodeScanResultReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.QRCodeScanResultReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.QRCodeScanResultReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.QRCodeScanResultReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.QRCodeScanResultReq}
 */
proto.client.QRCodeScanResultReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.QRCodeScanResultReq;
  return proto.client.QRCodeScanResultReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.QRCodeScanResultReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.QRCodeScanResultReq}
 */
proto.client.QRCodeScanResultReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.QRCodeScanResultReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.QRCodeScanResultReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.QRCodeScanResultReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.QRCodeScanResultReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string data = 1;
 * @return {string}
 */
proto.client.QRCodeScanResultReq.prototype.getData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.QRCodeScanResultReq} returns this
 */
proto.client.QRCodeScanResultReq.prototype.setData = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.HeightMeasurementReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.HeightMeasurementReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.HeightMeasurementReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HeightMeasurementReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    height: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    isOcclusion: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.HeightMeasurementReq}
 */
proto.client.HeightMeasurementReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.HeightMeasurementReq;
  return proto.client.HeightMeasurementReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.HeightMeasurementReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.HeightMeasurementReq}
 */
proto.client.HeightMeasurementReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setHeight(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsOcclusion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.HeightMeasurementReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.HeightMeasurementReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.HeightMeasurementReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.HeightMeasurementReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeight();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getIsOcclusion();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional float height = 1;
 * @return {number}
 */
proto.client.HeightMeasurementReq.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.client.HeightMeasurementReq} returns this
 */
proto.client.HeightMeasurementReq.prototype.setHeight = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional bool is_occlusion = 2;
 * @return {boolean}
 */
proto.client.HeightMeasurementReq.prototype.getIsOcclusion = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.HeightMeasurementReq} returns this
 */
proto.client.HeightMeasurementReq.prototype.setIsOcclusion = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.AposeAngleReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.AposeAngleReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.AposeAngleReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AposeAngleReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    leftAngle: jspb.Message.getFieldWithDefault(msg, 1, 0),
    rightAngle: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.AposeAngleReq}
 */
proto.client.AposeAngleReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.AposeAngleReq;
  return proto.client.AposeAngleReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.AposeAngleReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.AposeAngleReq}
 */
proto.client.AposeAngleReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLeftAngle(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setRightAngle(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.AposeAngleReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.AposeAngleReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.AposeAngleReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.AposeAngleReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLeftAngle();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getRightAngle();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional int32 left_angle = 1;
 * @return {number}
 */
proto.client.AposeAngleReq.prototype.getLeftAngle = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.AposeAngleReq} returns this
 */
proto.client.AposeAngleReq.prototype.setLeftAngle = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 right_angle = 2;
 * @return {number}
 */
proto.client.AposeAngleReq.prototype.getRightAngle = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.AposeAngleReq} returns this
 */
proto.client.AposeAngleReq.prototype.setRightAngle = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WiredNetworkStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WiredNetworkStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WiredNetworkStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WiredNetworkStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    isconnected: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WiredNetworkStatusReq}
 */
proto.client.WiredNetworkStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WiredNetworkStatusReq;
  return proto.client.WiredNetworkStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WiredNetworkStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WiredNetworkStatusReq}
 */
proto.client.WiredNetworkStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsconnected(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WiredNetworkStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WiredNetworkStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WiredNetworkStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WiredNetworkStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIsconnected();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool isConnected = 1;
 * @return {boolean}
 */
proto.client.WiredNetworkStatusReq.prototype.getIsconnected = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WiredNetworkStatusReq} returns this
 */
proto.client.WiredNetworkStatusReq.prototype.setIsconnected = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WifiStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WifiStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WifiStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    ssid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    isconnected: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    level: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WifiStatusReq}
 */
proto.client.WifiStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WifiStatusReq;
  return proto.client.WifiStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WifiStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WifiStatusReq}
 */
proto.client.WifiStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSsid(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsconnected(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setLevel(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WifiStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WifiStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WifiStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSsid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getIsconnected();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getLevel();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * optional string ssid = 1;
 * @return {string}
 */
proto.client.WifiStatusReq.prototype.getSsid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.WifiStatusReq} returns this
 */
proto.client.WifiStatusReq.prototype.setSsid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool isConnected = 2;
 * @return {boolean}
 */
proto.client.WifiStatusReq.prototype.getIsconnected = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WifiStatusReq} returns this
 */
proto.client.WifiStatusReq.prototype.setIsconnected = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional uint32 level = 3;
 * @return {number}
 */
proto.client.WifiStatusReq.prototype.getLevel = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.WifiStatusReq} returns this
 */
proto.client.WifiStatusReq.prototype.setLevel = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WifiInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WifiInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WifiInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    ssid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    level: jspb.Message.getFieldWithDefault(msg, 2, 0),
    isconnected: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    isautoconnect: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
    isencrypt: jspb.Message.getBooleanFieldWithDefault(msg, 5, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WifiInfo}
 */
proto.client.WifiInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WifiInfo;
  return proto.client.WifiInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WifiInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WifiInfo}
 */
proto.client.WifiInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSsid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setLevel(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsconnected(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsautoconnect(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsencrypt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WifiInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WifiInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WifiInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSsid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLevel();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getIsconnected();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getIsautoconnect();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
  f = message.getIsencrypt();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * optional string ssid = 1;
 * @return {string}
 */
proto.client.WifiInfo.prototype.getSsid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.WifiInfo} returns this
 */
proto.client.WifiInfo.prototype.setSsid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint32 level = 2;
 * @return {number}
 */
proto.client.WifiInfo.prototype.getLevel = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.WifiInfo} returns this
 */
proto.client.WifiInfo.prototype.setLevel = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional bool isConnected = 3;
 * @return {boolean}
 */
proto.client.WifiInfo.prototype.getIsconnected = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WifiInfo} returns this
 */
proto.client.WifiInfo.prototype.setIsconnected = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional bool isAutoConnect = 4;
 * @return {boolean}
 */
proto.client.WifiInfo.prototype.getIsautoconnect = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WifiInfo} returns this
 */
proto.client.WifiInfo.prototype.setIsautoconnect = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};


/**
 * optional bool isencrypt = 5;
 * @return {boolean}
 */
proto.client.WifiInfo.prototype.getIsencrypt = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WifiInfo} returns this
 */
proto.client.WifiInfo.prototype.setIsencrypt = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.client.WifiListReq.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WifiListReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WifiListReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WifiListReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiListReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    listList: jspb.Message.toObjectList(msg.getListList(),
    proto.client.WifiInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WifiListReq}
 */
proto.client.WifiListReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WifiListReq;
  return proto.client.WifiListReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WifiListReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WifiListReq}
 */
proto.client.WifiListReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.client.WifiInfo;
      reader.readMessage(value,proto.client.WifiInfo.deserializeBinaryFromReader);
      msg.addList(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WifiListReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WifiListReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WifiListReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiListReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getListList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.client.WifiInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated WifiInfo list = 1;
 * @return {!Array<!proto.client.WifiInfo>}
 */
proto.client.WifiListReq.prototype.getListList = function() {
  return /** @type{!Array<!proto.client.WifiInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.client.WifiInfo, 1));
};


/**
 * @param {!Array<!proto.client.WifiInfo>} value
 * @return {!proto.client.WifiListReq} returns this
*/
proto.client.WifiListReq.prototype.setListList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.client.WifiInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.client.WifiInfo}
 */
proto.client.WifiListReq.prototype.addList = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.client.WifiInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.client.WifiListReq} returns this
 */
proto.client.WifiListReq.prototype.clearListList = function() {
  return this.setListList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WifiSetStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WifiSetStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WifiSetStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiSetStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, 0),
    value: jspb.Message.getFieldWithDefault(msg, 2, 0),
    reason: jspb.Message.getFieldWithDefault(msg, 3, ""),
    errorcode: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WifiSetStatusReq}
 */
proto.client.WifiSetStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WifiSetStatusReq;
  return proto.client.WifiSetStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WifiSetStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WifiSetStatusReq}
 */
proto.client.WifiSetStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.client.WifiSetType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setValue(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setReason(value);
      break;
    case 4:
      var value = /** @type {!proto.client.WifiSetErrorCode} */ (reader.readEnum());
      msg.setErrorcode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WifiSetStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WifiSetStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WifiSetStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiSetStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getValue();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getReason();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getErrorcode();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
};


/**
 * optional WifiSetType type = 1;
 * @return {!proto.client.WifiSetType}
 */
proto.client.WifiSetStatusReq.prototype.getType = function() {
  return /** @type {!proto.client.WifiSetType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.client.WifiSetType} value
 * @return {!proto.client.WifiSetStatusReq} returns this
 */
proto.client.WifiSetStatusReq.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional uint32 value = 2;
 * @return {number}
 */
proto.client.WifiSetStatusReq.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.client.WifiSetStatusReq} returns this
 */
proto.client.WifiSetStatusReq.prototype.setValue = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string reason = 3;
 * @return {string}
 */
proto.client.WifiSetStatusReq.prototype.getReason = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.WifiSetStatusReq} returns this
 */
proto.client.WifiSetStatusReq.prototype.setReason = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional WifiSetErrorCode errorCode = 4;
 * @return {!proto.client.WifiSetErrorCode}
 */
proto.client.WifiSetStatusReq.prototype.getErrorcode = function() {
  return /** @type {!proto.client.WifiSetErrorCode} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.client.WifiSetErrorCode} value
 * @return {!proto.client.WifiSetStatusReq} returns this
 */
proto.client.WifiSetStatusReq.prototype.setErrorcode = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.client.WifiEnableStatusReq.prototype.toObject = function(opt_includeInstance) {
  return proto.client.WifiEnableStatusReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.client.WifiEnableStatusReq} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiEnableStatusReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    ssid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    isconnected: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.client.WifiEnableStatusReq}
 */
proto.client.WifiEnableStatusReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.client.WifiEnableStatusReq;
  return proto.client.WifiEnableStatusReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.client.WifiEnableStatusReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.client.WifiEnableStatusReq}
 */
proto.client.WifiEnableStatusReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSsid(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsconnected(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.client.WifiEnableStatusReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.client.WifiEnableStatusReq.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.client.WifiEnableStatusReq} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.client.WifiEnableStatusReq.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSsid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getIsconnected();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional string ssid = 1;
 * @return {string}
 */
proto.client.WifiEnableStatusReq.prototype.getSsid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.client.WifiEnableStatusReq} returns this
 */
proto.client.WifiEnableStatusReq.prototype.setSsid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool isConnected = 2;
 * @return {boolean}
 */
proto.client.WifiEnableStatusReq.prototype.getIsconnected = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.client.WifiEnableStatusReq} returns this
 */
proto.client.WifiEnableStatusReq.prototype.setIsconnected = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * @enum {number}
 */
proto.client.HardwareStatus = {
  INVALID: 0,
  READY: 1,
  BUSY: 2,
  FAULT: 3,
  UNKNOWN: 4
};

/**
 * @enum {number}
 */
proto.client.CameraStatus = {
  CAMERA_INVALID: 0,
  CAMERA_READY: 1,
  CAMERA_FAULT: 2
};

/**
 * @enum {number}
 */
proto.client.WifiSetType = {
  WF_ENABLE: 0,
  WF_SCAN_FINISHED: 1,
  WF_CONNECT: 2,
  WF_DISCONNECT: 3,
  WF_DISABLE_AUTO_CONN: 4
};

/**
 * @enum {number}
 */
proto.client.WifiSetErrorCode = {
  WF_CONNECT_OK: 0,
  WF_CONNECT_TIMEOUT: 1,
  WF_PASSWORD_ERROR: 2,
  WF_NOT_FOUND: 3,
  WF_PROTOCOL_ERROR: 4,
  WF_NOT_RUNNING: 5,
  WF_NETWORK_ERROR: 6,
  WF_IP_ERROR: 7,
  WF_CMD_ERROR: 8,
  WF_OTHER_ERROR: 9
};

goog.object.extend(exports, proto.client);
