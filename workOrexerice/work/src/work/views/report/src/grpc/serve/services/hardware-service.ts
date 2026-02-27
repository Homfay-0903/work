/*
 * @Author: yangsheng
 * @Date: 2022-02-22 20:00:49
 * @LastEditTime: 2024-06-03 14:40:16
 * @LastEditors: DonWang wangwenqiu@suanier.com
 * @Description: 客户端硬件上报服务
 * @FilePath: \m30-device-client\src\grpc\serve\services\hardware-service.ts
 */
import store from '@/store'
import * as grpc from '@grpc/grpc-js'
import { EventBus } from '@/util/event-bus'
import { hwError } from '@/config/error-reason'
import {
    ButtonEventReq,
    CommonReq,
    CommonRes,
    HardwareServiceStatusReq,
    BodyMeasureResultReq,
    HardwareStatusReq,
    ScreenStatusReq,
    HardwareSelfCheckReq,
    StandStateReq,
    WeightMeasureResultReq,
    BacklightResultReq,
    TableBodyMeasureResultReq
} from '@/grpc/module/client_pb'

/**
 * 客户端硬件上报服务
 */
export const HardwareService = {
    /**
     * 硬件服务状态
     *
     * @param {grpc.ServerUnaryCall<HardwareServiceStatusReq, CommonRes>} call
     * @param {grpc.sendUnaryData<CommonRes>} callback
     */
    hardwareServiceStatus(
        call: grpc.ServerUnaryCall<HardwareServiceStatusReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 硬件服务状态上报', JSON.stringify(req))
        // 设置硬件服务状态
        store.dispatch('changeExtService', {
            name: 'hardware',
            ready: req.status
        })
        callback(null, new CommonRes())
    },

    /**
     * 屏幕状态上报
     * @param call
     * @param callback
     */
    screenStatus(call: grpc.ServerUnaryCall<ScreenStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 屏幕状态上报', JSON.stringify(req))
        // 触发全局事件
        EventBus.$emit('EventAction', 'ScreenStatus', req.status)
        callback(null, new CommonRes())
    },

    /**
     * 屏幕状态上报
     * @param call
     * @param callback
     */
    backlightResult(
        call: grpc.ServerUnaryCall<BacklightResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 屏幕亮度上报', JSON.stringify(req))

        const luminance = req.value
        store.dispatch('changeDeviceInfo', { luminance: luminance })
        callback(null, new CommonRes())
    },

    /**
     * 自检响应
     * @param call
     * @param callback
     */
    hardwareCheckSelf(
        call: grpc.ServerUnaryCall<HardwareSelfCheckReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 硬件服务自检结果上报', JSON.stringify(req))
        if (Object.values(req).some((item) => item === 0)) {
            window.logger.warn('硬件自检上报了无效数据')
        } else {
            window.logger.info('硬件自检结果：', req)
            const result = !Object.values(req).some((item) => item !== 1)
            // 自检失败有设备异常
            if (!result) {
                // 体重模块通讯异常
                if (req.weightBoardConnect !== 1) {
                    store.commit('ADD_DEVICE_ERROR', 5)
                }
                // 体脂模块通讯异常
                if (req.fatBoardConnect !== 1) {
                    store.commit('ADD_DEVICE_ERROR', 6)
                }
                // 核心控制模块异常
                if (req.centerCtrlBoard !== 1) {
                    store.commit('ADD_DEVICE_ERROR', 7)
                }
                if (req.tableStatus !== 1) {
                    // 转台未连接 or 转台模块异常
                    store.commit('ADD_DEVICE_ERROR', req.tableStatus === 3 ? 8 : 10)
                }
                // if (req.touchIsConnected) {
                    // 更新触屏状态
                    store.commit('CHANGE_EXTERNAL', {
                        touch: req.touchIsConnected ? true : false
                    })
                // }
            }

            // 设置硬件自检状态
            store.dispatch('changeExtService', {
                name: 'hardware',
                checkSelf: result ? 1 : 2
            })
        }
        callback(null, new CommonRes())
    },

    /**
     * 体重测量结果上报
     * @param call
     * @param callback
     */
    weightMeasureResult(
        call: grpc.ServerUnaryCall<WeightMeasureResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 体重测量结果上报', JSON.stringify(call.request.toObject()), req.data)
        // 触发体重数据上报事件
        EventBus.$emit('EventAction', 'WeightMeasureResult', req)
        callback(null, new CommonRes())
    },

    /**
     * 体成分测量结果上报
     * @param call
     * @param callback
     */
    bodyMeasureResult(
        call: grpc.ServerUnaryCall<BodyMeasureResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 体成分测量结果上报', JSON.stringify(call.request.toObject()))
        // 测量成功修改store中测量状态
        if (req.result) {
            // 修改体成分测量信息
            const measureInfo = {
                mass: {
                    status: true
                }
            }
            store.dispatch('changeMeasureInfo', measureInfo)
        }
        // 触发体成分数据上报事件
        EventBus.$emit('EventAction', 'BodyMeasureResult', req)
        callback(null, new CommonRes())
    },

    /**
     * 电阻测量结果上报
     * @param call
     * @param callback
     */
    tableBodyMeasureResult(
        call: grpc.ServerUnaryCall<TableBodyMeasureResultReq, CommonRes>,
        callback: grpc.sendUnaryData<CommonRes>
    ) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 体成分电阻测量结果上报', JSON.stringify(call.request.toObject()))
        // 测量成功修改store中测量状态
        if (req.result) {
            // 修改体成分测量信息
            const measureInfo = {
                mass: {
                    status: true
                }
            }
            store.dispatch('changeMeasureInfo', measureInfo)
        }
        // 触发体成分数据上报事件
        EventBus.$emit('EventAction', 'BodyMeasureResult', req)
        callback(null, new CommonRes())
    },
    /**
     * 站人状态上报
     * @param call
     * @param callback
     */
    standState(call: grpc.ServerUnaryCall<StandStateReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 站人状态上报', JSON.stringify(req))
        store.commit('CHANGE_STAND_PEOPLE', req.person)
        // 触发全局事件
        EventBus.$emit('EventAction', 'StandState', req.person)
        callback(null, new CommonRes())
    },

    /**
     * 转台停止上报
     * @param call
     * @param callback
     */
    tableStop(call: grpc.ServerUnaryCall<CommonReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        window.logger.info('[hardware-service]: 硬件状态停止事件上报', JSON.stringify(call.request.toObject()))
        // 触发全局事件
        EventBus.$emit('EventAction', 'TableStop')
        callback(null, new CommonRes())
    },

    /**
     * 按钮事件上报
     * @param call
     * @param callback
     */
    buttonEvent(call: grpc.ServerUnaryCall<ButtonEventReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 按钮事件上报', JSON.stringify(req))
        const event = req.event
        if (event !== 0) {
            // 急停状态存储在store中
            if ([1, 2].indexOf(req.event)) {
                store.commit('CHANGE_EMERGENCY_STATE', req.event === 1)
            }
            // 触发全局事件
            EventBus.$emit('ShutDownAction', 'ButtonEvent', req.event, req.longClick)
        }
        callback(null, new CommonRes())
    },

    /**
     * 硬件状态上报
     * @param call
     * @param callback
     */
    hardwareStatus(call: grpc.ServerUnaryCall<HardwareStatusReq, CommonRes>, callback: grpc.sendUnaryData<CommonRes>) {
        const req = call.request.toObject()
        window.logger.info('[hardware-service]: 硬件状态上报', JSON.stringify(req))
        // 红外触摸硬件状态
        if (req.type === 5) {
            // 更新触屏状态
            store.commit('CHANGE_EXTERNAL', {
                touch: req.status
            })
        } else {
            const error = hwError[req.type - 1]
            if (error) {
                if (!req.status) {
                    store.commit('ADD_DEVICE_ERROR', error.id)
                } else {
                    store.commit('REMOVE_DEVICE_ERROR', error.id)
                }
                // 触发全局事件
                EventBus.$emit('EventAction', 'HardwareStatusEvent', req)
            }
        }
        callback(null, new CommonRes())
    }
}
