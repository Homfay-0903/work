import store from '@/store'
import * as grpc from '@grpc/grpc-js'
import { EventBus } from '@/util/event-bus'
import { hwError } from '@/config/error-reason'
import localConfig from '@/config/local'

import {
    CommonReq,
    CommonRes,
    WiredNetworkStatusReq,
    WifiStatusReq,
    WifiListReq,
    WifiSetStatusReq
} from '@/grpc/module/client_pb'

export const NetworkService = {
    /**
     * 有线网连接状态上报
     *
     * @param call
     * @param callback
     */
    wiredNetworkStatus(
        call: grpc.ServerUnaryCall<WiredNetworkStatusReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 有线网连接状态上报', JSON.stringify(req))
        store.commit('CHANGE_DEVICE_INFO', {
            WiredNetworkStatus: req.isconnected
        })
        EventBus.$emit('EventAction', 'wiredNetworkStatus', req)
        callback(null, new CommonRes())
    },

    /**
     * Wifi连接状态上报
     *
     * @param call
     * @param callback
     */
    wifiStatus(call: grpc.ServerUnaryCall<WifiStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: Wifi连接状态上报', JSON.stringify(req))
        store.commit('CHANGE_DEVICE_INFO', {
            WifiStatus: req.isconnected,
            wifiLevel: req.level
        })
        
        EventBus.$emit('EventAction', 'WifiStatus', req)
        callback(null, new CommonRes())
    },

    /**
     * Wifi扫描列表上报
     *
     * @param call
     * @param callback
     */
    wifiList(call: grpc.ServerUnaryCall<WifiListReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.debug('[hardware-service]: Wifi扫描列表上报', JSON.stringify(req))
        EventBus.$emit('EventAction', 'WifiList', req)
        callback(null, new CommonRes())
    },

    /**
     * Wifi设置结果上报
     *
     * @param call
     * @param callback
     */
    wifiSetStatus(call: grpc.ServerUnaryCall<WifiSetStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: Wifi设置结果上报', JSON.stringify(req))
        EventBus.$emit('EventAction', 'WifiSetStatus', req)
        callback(null, new CommonRes())
    }
}
