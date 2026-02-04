/*
 * @Description: 测量相关
 * @Author: WendyGao
 * @Date: 2022-02-22 16:50:04
 * @LastEditors: liutq
 * @LastEditTime: 2025-09-29 10:46:49
 */
import { IMeasureInfo, ReturnGetters } from '../index.d'

import * as types from '../mutation-types'
import { _addZero, _deepObjectMerge, _deepClone } from '@/util'
import { v4 as uuidv4 } from 'uuid'
import { ActionContext } from 'vuex'
import { EventBus } from '@/util/event-bus'
import { NotifyTaskStatusRes } from '@/grpc/module/notify_status_pb'
import { _changeTimeZone } from '@/util'
import state from './device'
import settingState from './other'
import localConfig from '@/config/local'
function dataEncrypt(params: any) {
    let email = params
    if (email.indexOf('@') > -1) {
        // 截取账号名
        const name = email.substr(0, email.indexOf('@'))
        // 截取后缀
        const suffix = email.substr(email.indexOf('@'), email.length)
        const len = name.length
        if (len >= 9) {
            email = name.substr(0, 4) + '***' + name.substr(len - 4, len) + suffix
        } else if (len > 5) {
            email = name.substr(0, 2) + '***' + name.substr(len - 2, len) + suffix
        } else {
            email = name + suffix
        }
        // else if (len === 3) {
        //     email = name.substr(0, 1) + '*' + name.substr(len - 1, len) + suffix
        // }
    } else {
        const phoneLen = email.length
        if (state.state.deviceInfo.deviceType === 4 || state.state.deviceInfo.deviceType === 5) {
            email = email.substr(0, 3) + '****' + email.substr(phoneLen - 4)
        } else if (phoneLen > 14) {
            email = email.substr(0, 7) + '****' + email.substr(phoneLen - 4)
        } else if (phoneLen === 14) {
            email = email.substr(0, 6) + '****' + email.substr(phoneLen - 4)
        } else if (phoneLen > 7) {
            email = email.substr(0, 5) + '*'.repeat(phoneLen - 7) + email.substr(phoneLen - 2)
        }
    }
    return email
}

// 当前测量信息
const initMesInfo = {
    // 扫描id
    scanId: '',
    // 扫描时间：第一次选择测量项目时间
    scanTime: 0,
    // 启动方式 1 按键启动 2 站台启动 3 地垫站人启动
    startMode: 0,
    // 加入打印队列时是否自动打印 0 手动 1 自动
    printType: 1,
    // 未测量的项目
    unScanItems: [2, 3, 1],
    // 调查状态
    nutritionStatus: 0,
    // 手动加入打印队列 无电流营养分析报告成成功可以自动打印
    handleStatus: 0,
    // 扫码用户信息
    userInfo: {
        isNewUser: true,
        phoneNum: ''
    },
    // 体重测量信息
    weight: {
        // 是否进入了测量页面
        isMeasurement: false,
        // 是否测量成功
        status: false,
        // 是否测量
        isMeasured: false,
        weight: 0,
        /**
         * 合成状态 -1合成中 0失败 1成功
         * 1、如果是测量过程中推送合成状态直接修改测量信息，测量完成后再加入报告列表
         * 2、如果测量完成后推送合成状态，直接修改报告列表中的状态
         */
        composeStatus: -1
    },
    // 体成分测量信息
    mass: {
        isMeasurement: false,
        status: false,
        isMeasured: false,
        composeStatus: -1
    },
    // 体态测量信息
    shape: {
        isMeasurement: false,
        status: false,
        isMeasured: false,
        composeStatus: -1
    },
    // 脊柱测量信息
    spine: {
        isMeasurement: false,
        status: false,
        isMeasured: false,
        composeStatus: -1
    },
    // 围度测量信息
    girth: {
        isMeasurement: false,
        status: false,
        isMeasured: false,
        composeStatus: -1
    },
    // 肩部测量信息
    shoulder: {
        isMeasurement: false,
        status: false,
        active: 0,
        isMeasured: false,
        composeStatus: -1
    },
    // 增加时区
    utc: '',
    // 服务器返回的测量时间
    createTime: '',
    deviceMode: settingState.state.settingInfo.deviceMode,
    // vApro5下测了无电流
    isMeasureWu: false,
    // vApro5下测了身体围度测量
    isMeasureWd: false,
    nutrition: 2,
    recordReport: null,
    height: 0
}
// 报告列表
const reportList = [
    {
        // 扫描id
        scanId: '',
        // 扫描时间：第一次选择测量项目时间
        scanTime: 0,
        // 重新打印时间
        reprintTime: 0,
        // 手机号
        phoneNum: '18729569141',
        // 打印状态
        statusCode: 2,
        // 打印排队序号
        printWait: 0,
        // 调查状态
        nutritionStatus: 0,
        // 手动加入打印队列 无电流营养分析报告成成功可以自动打印
        handleStatus: 0,
        // 报告绑定状态是否已经扫码或者序列号绑定
        bindStatus: true,
        isPrinting: false,
        printType: 0,
        // 体成分测量信息
        mass: {
            isMeasurement: false,
            status: true,
            isMeasured: true,
            composeStatus: -1
        },
        // 体围测量信息
        girth: {
            isMeasurement: false,
            status: true,
            isMeasured: true,
            composeStatus: -1
        },
        // 体态测量信息
        shape: {
            isMeasurement: false,
            status: true,
            isMeasured: true,
            composeStatus: -1
        },
        // 脊柱测量信息
        spine: {
            isMeasurement: false,
            status: false,
            isMeasured: false,
            composeStatus: -1
        },
        // 围度测量信息
        shoulder: {
            isMeasurement: false,
            status: true,
            active: 0,
            isMeasured: true,
            composeStatus: -1
        },
        // vApro5下测了无电流
        isMeasureWu: false,
        // vApro5下测了身体围度测量
        isMeasureWd: false,
        nutrition: 2,
        recordReport: null,
        height: 0
    }
]

const qrcode = {
    path: 'http://static.weqianduan.com/qrcode.png', // 二维码地址
    status: false // 请求是否响应
}
const moduleState = {
    // 测量信息
    measureInfo: _deepClone(initMesInfo),
    // 测量状态（是否在测量中）
    scanState: false,
    // 成功项数据
    sucItemNum: 0,
    // 报告列表
    reportList: <any[]>[],
    // 自定义页面头部信息
    meteTitle: {
        prev: 'common.jian-bu-gong-neng',
        title: '',
        leave: true, // 是否可离开当前页面状态
        icon: false
    },
    qrcode
}

type IState = typeof moduleState

const moduleGetters = {
    // 测量信息
    measureInfo: (state: IState) => state.measureInfo,
    // 测量成功项数量
    sucItemNum: (state: IState) => state.sucItemNum,
    // 自定义页面头部信息
    meteTitle: (state: IState) => state.meteTitle,
    // 二维码信息
    qrcode: (state: IState) => state.qrcode,
    // 打印列表
    printQueue: (state: IState) => {
        // 按时间倒叙排列
        state.reportList.sort((a, b) => {
            return b.scanTime - a.scanTime
        })

        let index = 0
        const sortPrintList = [...state.reportList]
        // 如果有reprintTime 优先按这个排序，没有的话按scanTime
        // 例：[{b: 1, c: 12}, {b: 4, c:17}, {b: 3}, {b: 6}, {b:5, c: 11}, {b:13}]
        // 排序后：[{"b":3},{"b":6},{"b":5,"c":11},{"b":1,"c":12},{"b":13},{"b":4,"c":17}]
        sortPrintList.sort((a, b) => {
            if (!a.reprintTime && !b.reprintTime) {
                return a.scanTime - b.scanTime
            } else if (a.reprintTime && b.reprintTime) {
                return a.reprintTime - b.reprintTime
            } else if (a.reprintTime) {
                return a.reprintTime - b.scanTime
            } else if (b.reprintTime) {
                return a.scanTime - b.reprintTime
            } else {
                return a.scanTime - b.scanTime
            }
        })
        sortPrintList.forEach((v) => {
            v.printWait = 0
            // 判断是否是打印中
            if (v.statusCode === 1) {
                // 增加打印排队序号
                v.printWait = index
                index++
                // 替换原数组中的打印中状态数据
                const findIndex = state.reportList.findIndex((originVal) => {
                    return originVal.scanId === v.scanId
                })
                state.reportList[findIndex] = v
            }
        })
        return state.reportList.filter((item) => item.bindStatus)
    },
    initMesInfo: (state: IState) => initMesInfo
}
type IGetters = ReturnGetters<typeof moduleGetters>

// 状态同服务推送的用户信息
type UserInfo = {
    // 是否新用户
    isNewUser: boolean
    // 用户手机号
    phoneNum: string
}

const mutations = {
    [types.CHANGE_MEASURE_INFO](state: IState, measureInfo: any) {
        const newMeatureInfo = _deepObjectMerge(state.measureInfo, measureInfo) as IMeasureInfo
        state.measureInfo = newMeatureInfo
        window.logger.info('修改测量信息:', JSON.stringify(state.measureInfo))
    },
    // 加入报告列表（测量完成后）
    [types.PUSH_REPORT_LIST](state: IState, bindStatus: boolean) {
        window.logger.debug('store加入报告列表:', bindStatus)
        const measureInfo = state.measureInfo
        const measureProject = [measureInfo.girth, measureInfo.shape, measureInfo.shoulder, measureInfo.spine]
        const isM30 = state.measureInfo.scanId.slice(0, 2) === 'M0'
        const isM30S = state.measureInfo.scanId.slice(0, 2) === 'N1'
        const isM30g2l = state.measureInfo.scanId.slice(0, 2) === 'M1'
        const isVAPro5 = state.measureInfo.scanId.slice(0, 2) === 'M6'
        const isVAPro5g2l = state.measureInfo.scanId.slice(0, 2) === 'M2'
        const isVAPro5S = state.measureInfo.scanId.slice(0, 2) === 'N2'
        if (isM30 || isM30g2l || isM30S) {
            measureProject.push(measureInfo.weight)
        }
        if (isVAPro5 || isVAPro5g2l || isVAPro5S) {
            measureProject.push(measureInfo.mass)
        }
        const reportInfo = {
            // 扫描id
            scanId: measureInfo.scanId,
            // 扫描时间：第一次选择测量项目时间
            scanTime: measureInfo.scanTime,
            reprintTime: 0,
            // 手机号
            phoneNum: measureInfo.userInfo.phoneNum,
            // 打印状态
            statusCode: getReportStatus(
                measureProject,
                measureInfo.userInfo.isNewUser,
                measureInfo.printType,
                measureInfo.deviceMode,
                measureInfo.nutritionStatus,
                measureInfo.girth.status,
                measureInfo.isMeasureWu
            ),
            // 打印排队序号
            printWait: 0,
            // 绑定状态
            bindStatus,
            isPrinting: false,
            // 打印方式 0 手动 1 自动
            printType: measureInfo.printType,
            // 体成分测量信息
            mass: measureInfo.mass,
            // 体围测量信息
            girth: measureInfo.girth,
            // 体态测量信息
            shape: measureInfo.shape,
            // 脊柱测量信息
            spine: measureInfo.spine,
            // 围度测量信息
            shoulder: measureInfo.shoulder,
            weight: measureInfo.weight,
            deviceMode: measureInfo.deviceMode,
            // 调查状态
            nutritionStatus: measureInfo.nutritionStatus,
            // 手动加入打印队列 无电流营养分析报告成成功可以自动打印
            handleStatus: measureInfo.handleStatus,
            isMeasureWu: measureInfo.isMeasureWu,
            // vApro5下测了身体围度测量
            isMeasureWd: measureInfo.isMeasureWd,
            nutrition: measureInfo.nutrition,
            height: measureInfo.height
        }
        // 手机号加密
        if (measureInfo.userInfo.phoneNum) {
            reportInfo.phoneNum = dataEncrypt(measureInfo.userInfo.phoneNum)
            // reportInfo.phoneNum =
            //     measureInfo.userInfo.phoneNum.substr(0, 3) + '****' + measureInfo.userInfo.phoneNum.substr(7)
        }
        // 格式化时间
        if (reportInfo.scanTime) {
            const scanDate = new Date(Number(reportInfo.scanTime))
            reportInfo['fmtScanDate'] = `${scanDate.getFullYear()}/${_addZero(scanDate.getMonth() + 1)}/${_addZero(
                scanDate.getDate()
            )}`
            reportInfo['fmtScanTime'] = `${_addZero(scanDate.getHours())}:${_addZero(scanDate.getMinutes())}`
        }
        state.reportList.push(reportInfo)
        window.logger.info('store加入报告列表后:', JSON.stringify(state.reportList))
    },
    // 修改报告列表中报告状态
    [types.CHANGE_REPORT_LIST](state: IState, scanInfo: any) {
        window.logger.info('修改报告列表中报告状态之前:', JSON.stringify(state.reportList), JSON.stringify(scanInfo))
        // 当前报告信息
        state.reportList.forEach((item) => {
            if (item.scanId === scanInfo.scanId) {
                const isM30 = item.scanId.slice(0, 2) === 'M0'
                const isM30S = item.scanId.slice(0, 2) === 'N1'
                const isM30g2l = item.scanId.slice(0, 2) === 'M1'
                const isVAPro5 = item.scanId.slice(0, 2) === 'M6'
                const isVAPro5g2l = state.measureInfo.scanId.slice(0, 2) === 'M2'
                const isVAPro5s = state.measureInfo.scanId.slice(0, 2) === 'N2'
                const measureProject = [item.girth, item.shape, item.shoulder, item.spine]

                if (isM30 || isM30g2l || isM30S) {
                    measureProject.push(item.weight)
                }
                if (isVAPro5 || isVAPro5g2l || isVAPro5s) {
                    measureProject.push(item.mass)
                }
                // 如果测了体成分更新状态
                if (item.weight.status && (isM30 || isM30g2l || isM30S)) {
                    // m30设备体重测量即认为体成分成功
                    item.weight.composeStatus = 1
                }
                // 如果测了体围更新状态
                if (item.girth.status && scanInfo.normalStatus) {
                    item.girth.composeStatus = getComposeStatus(scanInfo.normalStatus)
                }
                // 如果测了体态更新状态
                if (item.shape.status && scanInfo.evalStatus) {
                    item.shape.composeStatus = getComposeStatus(scanInfo.evalStatus)
                }
                // 如果测了体态更新状态
                if (item.spine.status && scanInfo.vertebraStatus)
                    item.spine.composeStatus = getComposeStatus(scanInfo.vertebraStatus)
                // 如果测了体成分更新状态
                if (item.mass.status && scanInfo.biaStatus) {
                    item.mass.composeStatus = getComposeStatus(scanInfo.biaStatus)
                }
                // 修改绑定状态
                if (scanInfo.bindStatus) {
                    item.bindStatus = true
                }
                // 修改用户信息
                if (scanInfo.userInfo) {
                    // item.phoneNum =
                    //     scanInfo.userInfo.phoneNum.substr(0, 3) + '****' + scanInfo.userInfo.phoneNum.substr(7)
                    item.phoneNum = dataEncrypt(scanInfo.userInfo.phoneNum)
                }
                if (scanInfo.isPrinting !== null || scanInfo.isPrinting !== undefined) {
                    item.isPrinting = scanInfo.isPrinting
                }

                // 更新无电流营养分析填写状态
                if (scanInfo.nutritionStatus === 4) {
                    item.nutritionStatus = scanInfo.nutritionStatus
                    // if (item.handleStatus) {
                    //     // 手动加入打印队列状态状态，将打印保证设置成自动
                    //     item.printType = 1
                    //     window.logger.info('[print-list]:打印方式', item.printType)
                    //     // 其他根据打印模式打印
                    // } else {
                    //     item.printType = localConfig.getItem('_vf_print_mode') === 1 ? 1 : 0
                    // }
                    // window.logger.info('[print-list]:重置后打印状态', item.statusCode)
                }
                // 更新打印状态 在无电流下可能会修改打印模式 所以每次都更新报告状态
                item.statusCode = scanInfo.statusCode
                    ? scanInfo.statusCode
                    : getReportStatus(
                          measureProject,
                          scanInfo.userInfo?.isNewUser || false,
                          item.printType,
                          item.deviceMode,
                          item.nutritionStatus,
                          item.girth.status,
                          item.isMeasureWu
                      )
            }
        })
        window.logger.info('修改报告列表中报告状态之后:', JSON.stringify(state.reportList))
    },
    [types.CHANGE_SCAN_STATE](state: IState, scanState: boolean) {
        state.scanState = scanState
    },
    [types.RESTART_STORE](state: IState) {
        state.measureInfo = _deepClone(initMesInfo)
        state.qrcode = { ...qrcode }
        window.logger.debug('[RESTART_STORE]之后:', JSON.stringify(state.measureInfo))
    },
    // 改变设置页面信息
    [types.METE_TITLE](state: IState, pageInfo: any) {
        const newPageInfo = { ...state.meteTitle, ...pageInfo }
        state.meteTitle = newPageInfo
    },
    // 修改二维码信息
    [types.CHANGE_QRCODE](state: IState, qrcode: any) {
        state.qrcode = qrcode
        window.logger.debug('[CHANGE_QRCODE]:', JSON.stringify(qrcode))
    },
    [types.CHANGE_NUMBER](state: IState, flag: boolean) {
        if (flag) {
            let resultNum = 0
            if (state.measureInfo.scanId) {
                const isVAPro5 = state.measureInfo.scanId.slice(0, 2) === 'M6'
                const isVAPro3 = state.measureInfo.scanId.slice(0, 2) === 'M5'
                const isVAPro5g2l = state.measureInfo.scanId.slice(0, 2) === 'M2'
                const isM30 = state.measureInfo.scanId.slice(0, 2) === 'M0'
                const isM30S = state.measureInfo.scanId.slice(0, 2) === 'N1'
                const isM30g2l = state.measureInfo.scanId.slice(0, 2) === 'M1'
                const isVAPro5s = state.measureInfo.scanId.slice(0, 2) === 'N2'
                if (state.measureInfo.girth.isMeasured && state.measureInfo.girth.status) {
                    resultNum++
                }
                if (state.measureInfo.shape.isMeasured && state.measureInfo.shape.status) {
                    resultNum++
                }
                if (state.measureInfo.shoulder.active > 0) {
                    resultNum++
                }
                if (state.measureInfo.weight.status && (isM30 || isVAPro3 || isM30g2l || isM30S)) {
                    resultNum++
                }
                if (state.measureInfo.mass.status && (isVAPro5 || isVAPro5g2l || isVAPro5s)) {
                    resultNum++
                }
            }
            window.logger.info('[存储数据-resultNum]:', resultNum)
            state.sucItemNum = resultNum
        } else {
            state.sucItemNum = 0
        }
    },
    [types.CHANGE_INIT_MESINFO](state: IState, unScanItems: number[]) {
        initMesInfo.unScanItems = unScanItems
        if(unScanItems){
            localConfig.setItem('_vf_unScanItems', unScanItems)
        }
        window.logger.info('修改测量初始化信息:', initMesInfo)
    }
}

const actions = {
    // 修改测量信息
    changeMeasureInfo({ state, commit, rootGetters }: ActionContext<IState, IGetters>, measureInfo: any) {
        // 判断是否存在scanId，不存在先生成scanId
        if (!state.measureInfo.scanId) {
            window.logger.debug('修改测量信息-重新生成scanId:')
            const deviceInfo = rootGetters.deviceInfo
            const scanId = `${deviceInfo.deviceId}-${uuidv4()}`
            EventBus.$emit('GenScanId', {
                deviceId: deviceInfo.deviceId,
                scanId
            })
            const utc = _changeTimeZone()
            commit(types.CHANGE_MEASURE_INFO, { ...measureInfo, scanId, utc })
        } else {
            window.logger.debug('修改测量信息:')
            commit(types.CHANGE_MEASURE_INFO, measureInfo)
        }
    },
    // 修改任务状态
    changeTaskStatus({ state, commit, rootGetters }: ActionContext<IState, IGetters>, notifyTaskStatus: any) {
        window.logger.info('store修改任务状态:', notifyTaskStatus)
        // 扫码通知
        if (notifyTaskStatus.streamType === 1) {
            window.logger.info('store修改任务状态:', notifyTaskStatus)
            // 如果倒计时结束是才进行扫码或者绑定
            if (notifyTaskStatus.scanInfo?.scanId !== state.measureInfo.scanId) {
                const userInfo: UserInfo = {
                    isNewUser: notifyTaskStatus.scanInfo?.id === '',
                    phoneNum: notifyTaskStatus.scanInfo?.id || ''
                }
                commit(types.CHANGE_REPORT_LIST, { ...notifyTaskStatus.scanInfo, userInfo, bindStatus: true })
            }
        } else if (notifyTaskStatus.streamType === 2) {
            // 测量过程中推送合成状态，直接修改当前测量信息
            if (notifyTaskStatus.scanInfo?.scanId === state.measureInfo.scanId) {
                const newMeasureInfo = { ...state.measureInfo }
                const isM30 = newMeasureInfo.scanId.slice(0, 2) === 'M0'
                const isM30S = state.measureInfo.scanId.slice(0, 2) === 'N1'
                const isM30g2l = newMeasureInfo.scanId.slice(0, 2) === 'M1'
                // 如果测了体成分更新状态
                if (newMeasureInfo.weight.status && (isM30 || isM30g2l || isM30S)) {
                    // m30体重测量就认为体成分成功
                    newMeasureInfo.weight.composeStatus = 1
                }
                // 如果测了体围更新状态
                if (newMeasureInfo.girth.status && notifyTaskStatus.scanInfo.normalStatus) {
                    newMeasureInfo.girth.composeStatus = getComposeStatus(notifyTaskStatus.scanInfo?.normalStatus)
                }
                // 如果测了体态更新状态
                if (newMeasureInfo.shape.status && notifyTaskStatus.scanInfo.evalStatus) {
                    newMeasureInfo.shape.composeStatus = getComposeStatus(notifyTaskStatus.scanInfo?.evalStatus)
                }
                // 如果测了体态更新状态
                if (newMeasureInfo.spine.status && notifyTaskStatus.scanInfo.vertebraStatus) {
                    newMeasureInfo.spine.composeStatus = getComposeStatus(notifyTaskStatus.scanInfo?.vertebraStatus)
                }
                // 如果测了体成分更新状态
                if (newMeasureInfo.mass.status && notifyTaskStatus.scanInfo.biaStatus) {
                    newMeasureInfo.mass.composeStatus = getComposeStatus(notifyTaskStatus.scanInfo?.biaStatus)
                }
                // 是否填了问卷调查
                if (notifyTaskStatus.scanInfo.nutritionStatus === 4) {
                    newMeasureInfo.nutritionStatus = notifyTaskStatus.scanInfo.nutritionStatus
                }
                commit(types.CHANGE_MEASURE_INFO, newMeasureInfo)
                // 该情况在测量中完成后仅修改的本次测量的信息，未修改scode 测量状态的状态
                commit(types.CHANGE_REPORT_LIST, notifyTaskStatus.scanInfo)
            } else {
                // 测量完成后推送合成状态，修改报告列表中测量信息
                commit(types.CHANGE_REPORT_LIST, notifyTaskStatus.scanInfo)
            }
        }
    }
}

/**
 * 获取报告状态
 * @param scanStatus 测量状态
 * @param isNewUser 是否新用户
 * @returns
 */
const getReportStatus = (
    scanStatus: Array<any>,
    isNewUser: boolean,
    printType: number,
    deviceMode: number,
    nutritionStatus: number,
    girthStatus: boolean,
    isMeasureWuStatus: boolean
): number => {
    if (isNewUser) {
        // 注册中
        return 4
    }
    // 过滤是否有合成中的状态
    const synthesizingItem = scanStatus.find((item) => {
        return item.status && item.composeStatus === -1
    })
    if (synthesizingItem) {
        // 合成中
        return 0
    }
    // 产康模式下测量了体围，判断调查问卷状态
    if (deviceMode === 1 && isMeasureWuStatus && nutritionStatus !== 4 && girthStatus) {
        return 0
    }
    let scanNum: number = 0
    let errScanNum: number = 0
    scanStatus.forEach((item) => {
        if (item.status) {
            scanNum++
        }
        if (item.composeStatus === 0) {
            errScanNum++
        }
    })
    if (scanNum > errScanNum) {
        // 测量成功项目大于合成失败项目就可以生成报告，返回生成成功
        return printType ? 1 : 10
    } else {
        // 生成失败
        return 9
    }
}

/**
 * 获取合成状态
 * @param status 状态通知服务推送的状态
 * @returns 合成状态 -1 | 0 | 1
 */
const getComposeStatus = (status: number) => {
    let composeStatus = -1
    switch (status) {
        case 1:
            composeStatus = -1
            break
        case 3:
            composeStatus = 0
            break
        case 4:
            composeStatus = 1
            break
        case 5:
            composeStatus = -1
            break
        default:
            composeStatus = -1
            break
    }
    return composeStatus
}

export default {
    // namespaced: true,
    state: moduleState,
    getters: moduleGetters,
    mutations,
    actions
}
export { initMesInfo }
