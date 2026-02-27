/*
 * @Author: yangsheng
 * @Date: 2022-02-18 16:32:55
 * @LastEditTime: 2022-03-16 17:08:21
 * @LastEditors: liutq
 * @Description: 客户端更新服务
 * @FilePath: /vr-3.0-device-client/src/grpc/serve/services/update-service.ts
 */
import store from '@/store'
import { EventBus } from '@/util/event-bus'
import { CommonRes, NewVersionReq, NotifyStateReq } from '@/grpc/module/client_pb'
import * as grpc from '@grpc/grpc-js'

export const UpdateService = {
    /**
     * 新版本推送
     * @param call
     * @param callback
     */
    newVersion(call: grpc.ServerUnaryCall<NewVersionReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[update-service]: 更新服务新版本推送', JSON.stringify(req))
        store.commit('CHANGE_UPDATE_INFO', {
            hasNewVer: true,
            updStatus: 0,
            rollBackStatus: 0,
            force: req.force,
            version: req.version,
            content: req.content,
            services: req.updTotalNum
        })
        // 回调响应
        callback(null, new CommonRes())
    },

    // 更新状态 - 更新结果&更新进度
    notifyState(call: grpc.ServerUnaryCall<NotifyStateReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[update-service]: 更新服务状态上报', JSON.stringify(req))
        if (req.state !== 0) {
            // 触发全局事件
            EventBus.$emit('EventAction', 'UpdateProgress', req)
        }
        // 回调响应
        callback(null, new CommonRes())
    }
}
