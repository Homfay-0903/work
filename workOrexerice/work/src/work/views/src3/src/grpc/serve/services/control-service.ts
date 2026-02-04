/*
 * @Author: yangsheng
 * @Date: 2022-02-18 16:32:55
 * @LastEditTime: 2022-10-19 15:22:58
 * @LastEditors: ouyaping
 * @Description: 客户端控制服务
 * @FilePath: /vr-3.0-device-client/src/grpc/serve/services/control-service.ts
 */
import store from '@/store'
import {
    CommonRes,
    ExternalReq,
    NetworkSpeedReq,
    NetSpeedReq,
    PrintResultReq,
    ThirdBindResultReq
} from '@/grpc/module/client_pb'
import * as grpc from '@grpc/grpc-js'
import { EventBus } from '@/util/event-bus'

export const ControlService = {
    /**
     * 设备外设状态
     *
     * @param {grpc.ServerUnaryCall<ExternalReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    external(call: grpc.ServerUnaryCall<ExternalReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[control-service]: 设备外设状态', JSON.stringify(req))
        if (req.printer !== 0) {
            store.commit('CHANGE_EXTERNAL', {
                printer: req.printer,
                usb: req.usb
            })
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 网速状态
     *
     * @param {grpc.ServerUnaryCall<NetworkSpeedReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    networkSpeed(call: grpc.ServerUnaryCall<NetworkSpeedReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[control-service]: 网速状态', JSON.stringify(req))
        if (req.speed !== 0) {
            store.commit('CHANGE_NET_SPEED_INFO', {
                speedStatus: req.speed
            })
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 上传网速情况
     *
     * @param {grpc.ServerUnaryCall<NetSpeedReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    upLoadNetSpeed(call: grpc.ServerUnaryCall<NetSpeedReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[control-service]: 上传网速情况', JSON.stringify(req))
        if (req.status !== 0) {
            store.commit('CHANGE_NET_SPEED_INFO', {
                upLoadNetSpeed: {
                    ...req,
                    state: false
                }
            })
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 下载网速情况
     *
     * @param {grpc.ServerUnaryCall<NetSpeedReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    downLoadNetSpeed(call: grpc.ServerUnaryCall<NetSpeedReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[control-service]: 下载网速情况', JSON.stringify(req))
        if (req.status !== 0) {
            store.commit('CHANGE_NET_SPEED_INFO', {
                downLoadNetSpeed: req
            })
        }
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 报告打印结果
     *
     * @param {grpc.ServerUnaryCall<PrintResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    printResult(call: grpc.ServerUnaryCall<PrintResultReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[control-service]: 报告打印结果', JSON.stringify(req))
        let statusCode
        if (req.result) {
            statusCode = 2
        } else {
            const statusPatten = {
                1: 3, // 打印请求失败
                2: 7, // 打印机异常，
                3: 8 // 打印请求超时
            }
            statusCode = statusPatten[req.reason]
        }
        store.commit('CHANGE_REPORT_LIST', {
            scanId: req.scanId,
            statusCode,
            isPrinting: false
        })
        // 回调响应
        callback(null, new CommonRes())
    },

    /**
     * 第三方接口 或滴卡手环上报信息
     *
     * @param {grpc.ServerUnaryCall<ThirdBindResultReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    thirdBindResult(
        call: grpc.ServerUnaryCall<ThirdBindResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('绑定状态推送', JSON.stringify(req))
        const resData = {
            type: req.bindResultType,
            scanId: req.scanId
        }
        // 触发全局事件
        EventBus.$emit('EventAction', 'CardSynthesis', resData)
        // 回调响应
        callback(null, new CommonRes())
    }
}
