/*
 * @Description: 设备相关
 * @Author: WendyGao
 * @Date: 2022-02-22 16:55:06
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-20 18:10:59
 */
import * as types from '../mutation-types'
import { ReturnGetters, IDeviceError, INetSpeedInfo, IExternal } from '../index.d'
import { algError, hwError, cloudError } from '@/config/error-reason'
import { _dotMsg, _deepObjectMerge } from '@/util'
import { ActionContext } from 'vuex'
import { i18n } from '../../i18n'
const moduleState = {
    // 设备信息
    deviceInfo: {
        deviceId: 'N211', // 设备id
        volume: 0, // 设备音量
        mac: '', // mac地址，后台推送
        registered: false, // 是否向状态服务注册成功
        isNetConnect: true, // 网络是否连接正常
        thirdBindType: 0, // 第三方对接类型 0: 无对接, 1: APP对接, 2: 手环对接, 3: 手环+APP对接
        status: 1, // 设备状态 0 无效 1 正常 2 不可用（上次回滚失败）3 上次更新成功 4 上次更新失败
        reSelfCheck: true, // 是否需要重新自检 用于区分普通网络异常和自检网络异常 网络恢复后是否需要重新自检
        renewalStatus: 1, // 设备续费状态 1 未到期正常使用 2 临近到期且在7天内 3 已到期且未超过7天 4 到期且在7天以上
        expirationTime: '', // 设备云服务费过期时间
        aiRenewalStatus: 2, // 未激活 1 未到期正常使用 2 临近到期且在7天内 3 已到期且未超过7天 4 到期且在7天以上 5
        aiExpirationTime: '', // 设备云服务费过期时间
        operationMode: 1, // 设备操作模式 1 触屏操作模式 2 按键操作模式
        btnStatus: null, // 按钮模式选择的状态
        menuPage: 0, // 设置页面的分页，当前页
        reminderStatus: false, // 超时提醒
        deviceType: 5, // 设备类型 1 exp 2 S30 3 M30 4 VAPRO3 5 VAPRO5
        // add address
        timeZone: undefined,
        luminance: 100, // 亮度调整
        contortStatus: true,
        healthPackageEnable: 0,
        logoUrl: '',
        teenagerIsOpen: 0,
        spineReportEnabled: 0,
        beautyEnable: 0, // 美业cmdb开关 0 关 1 开
        WifiStatus: false, // wifi状态
        wifiLevel: 0, //WiFi强度
        WiredNetworkStatus: false, // 有线状态
        codeUrl: "",
        sleepSwitch: false, // 是否开启休眠状态，此状态仅表示在特定页面需要开启休眠倒计时
        isUnStdMode: 1, // 标准模式&&没有定制 0 否 1 是
        noBodyCompositionReport: 0
    },
    // 设备异常 影响到设备使用的异常
    deviceErrors: Array<IDeviceError>(),
    // 外设状态
    external: {
        // 打印机状态 1 已就绪 2 未就绪 3 打印中
        printer: 2,
        // usb状态
        usb: false,
        // 触屏状态
        touch: true
    },
    // 网速信息
    netSpeedInfo: {
        // 上传测速信息
        upLoadNetSpeed: {
            status: 0,
            netSpeed: 0,
            subTime: 0,
            state: true
        },
        // 下载测速信息
        downLoadNetSpeed: {
            status: 0,
            netSpeed: 0,
            subTime: 0
        },
        // 外网连接状态 - 设置中手动检测
        networkState: true,
        // 网速情况 1： 快，2：慢，3：特别慢
        speedStatus: 1
    },
    // 上传任务数量
    uploadTaskSum: 0,
    // 急停状态
    emergencyStop: false,
    // 环境光等级 1 正常 2 弱 3 差
    lightLevel: 1,
    // 设备是否站人
    standPeople: false,
    // 扫描服务重启状态
    recoveryStatus: false,
    // 状态服务连接状态
    statusClient: false
}

type IState = typeof moduleState

const moduleGetters = {
    deviceInfo: (state: IState) => state.deviceInfo,
    external: (state: IState) => state.external,
    netSpeedInfo: (state: IState) => state.netSpeedInfo,
    emergencyStop: (state: IState) => state.emergencyStop,
    standPeople: (state: IState) => state.standPeople,
    lightLevel: (state: IState) => state.lightLevel,
    deviceErrors: (state: IState) => state.deviceErrors,
    recoveryStatus: (state: IState) => state.recoveryStatus,
    statusClient: (state: IState) => state.statusClient,
    uploadTaskSum: (state: IState) => state.uploadTaskSum,
    // 设备可用状态
    deviceUsable: (state: IState) => {
        const usable = {
            mass: true,
            shape: true,
            gesture: true,
            shoulder: true,
            weight: true,
            errorTip: i18n.t('common.device-usable.error-tip0')
        }
        state.deviceErrors.forEach((err) => {
            // 包含影响手势识别的异常
            if (err.affectGt) {
                usable.gesture = false
            }
            // 包含影响体成分的异常
            if (err.affectBm) {
                usable.mass = false
            }
            // 包含影响体态评估的异常
            if (err.affectBs) {
                usable.shape = false
            }
            // 包含影响肩部识别的异常
            if (err.affectShd) {
                usable.shoulder = false
            }
            // 包含影响体重的异常
            if (err.affectWe) {
                usable.weight = false
            }
        })
        // 核心控制板异常
        const ctrlIdx = state.deviceErrors.findIndex((item) => {
            return item.title === '0001'
        })
        // 不可重启异常
        const cantRestIdx = state.deviceErrors.findIndex((item) => {
            return item.canRestart === false
        })
        // 转台未连接
        const tableIdx = state.deviceErrors.findIndex((item) => {
            return item.title === '0011'
        })
        // 鱼眼相机异常
        const cameraError = state.deviceErrors.findIndex((item) => {
            return item.id === 3
        })
        if (cameraError > -1) {
            usable.errorTip = i18n.t('common.device-usable.error-tip3')
        }
        // 待机页异常提醒
        if (!usable.mass || !usable.shape) {
            // 核心控制板异常
            if (ctrlIdx > -1) {
                usable.errorTip = i18n.t('common.device-usable.error-tip1')
                // 有不可重启恢复的异常
            } else if (cantRestIdx > -1) {
                // 只有转台异常
                if (tableIdx > -1 && (state.deviceErrors.length === 1 || state.deviceErrors.length === 2)) {
                    usable.errorTip = i18n.t('common.device-usable.error-tip2')
                } else {
                    usable.errorTip = i18n.t('common.device-usable.error-tip3')
                }
            }
        }
        return usable
    },
    // 根据显示优先级过滤后的设备异常列表
    filterDeviceErrors: (state: IState) => {
        let filterErrors
        const deviceErrorList = state.deviceErrors
        console.log(deviceErrorList)
        // 体成分体态都异常 > 网络 > 数据库、设备id > 单个异常
        const hardwareErrorList = deviceErrorList.filter((item) => {
            return item.childModule === 3
        })
        const isMassErr = hardwareErrorList.some((item) => {
            return item.affectBm === true
        })
        const isShapeErr = hardwareErrorList.some((item) => {
            return item.affectBs === true
        })
        // 两项都异常 只显示硬件异常
        if (isMassErr && isShapeErr) {
            filterErrors = hardwareErrorList.sort((a, b) => {
                return a.id - b.id
            })
        } else {
            //  网络 > 数据库、设备id > 单个异常
            deviceErrorList.sort((a, b) => {
                return a.childModule - b.childModule
            })
            if (!deviceErrorList.length) {
                return []
            }
            const childModule = deviceErrorList[0].childModule
            // 筛选出当前分类的错误列表
            filterErrors = deviceErrorList.filter((item) => {
                return item.childModule === childModule
            })
        }

        return filterErrors
    },
    // 获取设备异常id数组
    deviceErrorIds: (state: IState) => {
        const result: number[] = []
        if (state.deviceErrors.length) {
            state.deviceErrors.forEach((v) => {
                result.push(v.id)
            })
        }
        return result
    },
    // 待机页判断是否直接跳转到恢复页。部分异常即使站人也不用跳转
    checkPeople: (state: IState) => {
        const errors = state.deviceErrors.filter((item) => {
            // 转盘异常导致的不检测站人恢复
            return item.id !== 8
        })
        return errors.length > 0
    }
}
type IGetters = ReturnGetters<typeof moduleGetters>

const mutations = {
    [types.STATUS_CLIENT](state: IState, status: any) {
        state.statusClient = status
    },
    [types.CHANGE_DEVICE_INFO](state: IState, deviceInfo: any) {
        const newInfo = { ...state.deviceInfo, ...deviceInfo }
        state.deviceInfo = newInfo
        // window.logger.info('[store]: 设备信息更新', JSON.stringify(newInfo))
    },
    [types.ADD_DEVICE_ERROR](state: IState, errorId: number) {
        const oldError = state.deviceErrors.find((item) => item.id === errorId)
        console.log(`所有异常信息${JSON.stringify(state.deviceErrors)}`)
        if (oldError) {
            window.logger.warn('[store]: 设备异常已存在', errorId)
        } else {
            const allError = algError.concat(hwError, cloudError, algError)
            const errorInfo = allError.find((item) => item.id === errorId)
            if (errorInfo) {
                state.deviceErrors.push(errorInfo)
                _dotMsg({
                    action: 'error',
                    msg: 'device error',
                    code: errorInfo.title,
                    name: errorInfo.name
                })
            } else {
                window.logger.warn('[store]: 无效的设备异常码', errorId)
            }
        }
    },
    [types.CHANGE_UPLOAD_TASK_SUM](state: IState, taskSum: any) {
        state.uploadTaskSum = taskSum
    },
    [types.REMOVE_DEVICE_ERROR](state: IState, errorId: number) {
        const oldErrorIdx = state.deviceErrors.findIndex((item) => item.id === errorId)
        if (oldErrorIdx > -1) {
            state.deviceErrors.splice(oldErrorIdx, 1)
        }
    },
    [types.RESET_DEVICE_ERROR](state: IState, empty: Array<IDeviceError>) {
        state.deviceErrors = empty
    },
    // 外设状态修改
    [types.CHANGE_EXTERNAL](state: IState, external: IState['external']) {
        state.external = _deepObjectMerge(state.external, external) as IExternal
    },
    [types.CHANGE_NET_SPEED_INFO](state: IState, netSpeedInfo: any) {
        state.netSpeedInfo = _deepObjectMerge(state.netSpeedInfo, netSpeedInfo) as INetSpeedInfo
    },
    [types.CHANGE_EMERGENCY_STATE](state: IState, status: boolean) {
        state.emergencyStop = status
    },
    [types.CHANGE_LIGHT_LEVEL](state: IState, level: number) {
        state.lightLevel = level
    },
    [types.CHANGE_RECOVERY_STATUS](state: IState, recoveryStatus: boolean) {
        state.recoveryStatus = recoveryStatus
    },
    [types.CHANGE_STAND_PEOPLE](state: IState, status: boolean) {
        state.standPeople = status
    }
}

const actions = {
    changeStatusClient({ state, commit }: ActionContext<IState, IGetters>, status: any) {
        commit(types.STATUS_CLIENT, status)
    },
    // CHANGE_DEVICE_INFO
    changeDeviceInfo({ state, commit, rootGetters }: ActionContext<IState, IGetters>, type: any) {
        commit(types.CHANGE_DEVICE_INFO, type)
    }
}

export default {
    // namespaced: true,
    state: moduleState,
    getters: moduleGetters,
    mutations,
    actions
}
