/*
 * @Description: 其他状态
 * @Author: WendyGao
 * @Date: 2022-02-22 16:49:40
 * @LastEditors: liyunfei 3090384495@qq.com
 * @LastEditTime: 2026-01-20 18:12:03
 */
import localConfig from '@/config/local'
import CONFIG from '@/config/index'
import { ReturnGetters } from '../index.d'
import * as types from '../mutation-types'
import { initMesInfo } from './measure'
const moduleState = {
    // 页面信息配置
    pageInfo: {
        // 右侧操作按钮说明
        btnList: [],
        // 是否开启1分钟未操作超时
        openNotOperated: false,
        // 是否显示按键信息（触屏模式下页面中右上角的物理按键操作提示默认隐藏，在按下物理按键时马上唤醒显示）
        display: false
    },
    // 设置信息
    settingInfo: {
        // 设置列表页下标 高亮的设置项 用于从子设置页面返回到设置首页
        menuType: 0,
        // 设置页面的分页，当前页
        menuPage: 0,
        // 打印模式 0 关闭打印 1 自动打印 2 手动打印
        printMode: 2,
        // 设置项 子菜单高亮下标
        childActive: 0,
        // 手势识别状态 0 关闭 1 开启
        gestureState: 1,
        // 动态实验室状态 0 关闭 1 开启
        dynamicLaboratory: 1,
        // 报告绑定方式 1 序列号 2 二维码
        reportbindType: 1,
        // 当前语言
        i18n: localConfig.getItem('_vf_i18n').replace(/"/g, '') || CONFIG.REGIONAL || 'zh',
        // vapro3设备模式 1 产康模式 2 标准模式
        deviceMode: 2,
        // 设置当前页面
        pageSize: 4,
        // vapro5身高开启开关
        heightOpen: 0,
        wifibtn: 0,
        deviceViewReport: false, // 设备端查看报告开关
        beauty: 0, // 设备上美业模式是否打开 0 关闭 1 开启
        Athlete: 0, // 设备上运动员模式是否打开 0 关闭 1 开启
        combineMeasureEnable: 0, // 是否开启了 体重+体围+体态 默认值为0
        triMode: 0, // 是否满足三项合一可测量条件 默认值必须为 0
    },
    // 版本更新信息
    updateInfo: {
        // 是否有版本更新
        hasNewVer: false,
        // 更新状态 0 更新中 1 更新完成 2 更新成功
        updStatus: 0,
        // 服务更新完成个数
        updNumber: 0,
        // 回滚状态 0 回滚中/更新失败 1 回滚完成/成功 2 回滚失败
        rollBackStatus: 0,
        // 是否为强制更新
        force: false,
        // 更新版本号
        version: '',
        // 更新内容
        content: '',
        // 更新的服务个数
        services: 0
    },
    // 显示关机确认页
    openShutDownView: false
}

type IState = typeof moduleState

const moduleGetters = {
    pageInfo: (state: IState) => state.pageInfo,
    settingInfo: (state: IState) => state.settingInfo,
    updateInfo: (state: IState) => state.updateInfo,
    openShutDownView: (state: IState) => state.openShutDownView
}
type IGetters = ReturnGetters<typeof moduleGetters>

const mutations = {
    [types.CHANGE_OPEN_SHUT_DOEN_VIEW](state: IState, openShutDownView: boolean) {
        state.openShutDownView = openShutDownView
    },
    [types.CHANGE_PAGE_INFO](state: IState, pageInfo: any) {
        const newPageInfo = { ...state.pageInfo, ...pageInfo }
        state.pageInfo = newPageInfo
    },
    [types.CHANGE_SETTING_INFO](state: IState, settingInfo: any) {
        // 是否满足开启三项合一可测量条件
        if(Object.keys(settingInfo).indexOf('triMode') > -1){
            window.logger.info('triMode', `triMode${settingInfo.triMode}`)
            localConfig.setItem('_vf_tri_mode', settingInfo.triMode)
        }
        // 是否设备端设置了开启三项合一测量
        if(Object.keys(settingInfo).indexOf('combineMeasureEnable') > -1){
            window.logger.info('combineMeasureEnable', `combineMeasureEnable${settingInfo.combineMeasureEnable}`)
            localConfig.setItem('_vf_combine_measure_enable', settingInfo.combineMeasureEnable)
        }
        // combineMeasureEnable
        // 身高开启状态
        if (Object.keys(settingInfo).indexOf('heightOpen') > -1) {
            localConfig.setItem('_vf_height_open', settingInfo.heightOpen)
        }
        // 缓存打印模式
        if (Object.keys(settingInfo).indexOf('printMode') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_print_mode', settingInfo.printMode)
        }
        // 缓存手势识别开关
        if (Object.keys(settingInfo).indexOf('gestureState') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_gesture_state', settingInfo.gestureState)
        }
        // 缓存动态实验室开关
        if (Object.keys(settingInfo).indexOf('dynamicLaboratory') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_lab_switch', settingInfo.dynamicLaboratory)
            if (!settingInfo.dynamicLaboratory) {
                initMesInfo.unScanItems.pop()
            } else {
                initMesInfo.unScanItems.push(4)
            }
        }
        // 缓存报告绑定方式
        if (Object.keys(settingInfo).indexOf('reportbindType') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_report_bind_type', settingInfo.reportbindType)
        }
        // 设置本地语言环境
        if (Object.keys(settingInfo).indexOf('i18n') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_i18n', settingInfo.i18n)
        }
        // 打印纸张大小设置
        if (Object.keys(settingInfo).indexOf('pageSize') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_page_size', settingInfo.pageSize)
        }
        // 设置设备模式
        if (Object.keys(settingInfo).indexOf('deviceMode') > -1) {
            window.logger.info('settingInfo', `保存到本地的设备模式${settingInfo.deviceMode}`)
            // 保存到本地
            localConfig.setItem('_vf_device_mode', settingInfo.deviceMode)

            initMesInfo.deviceMode = settingInfo.deviceMode
        }
        // 美业模式本地存储
        if (Object.keys(settingInfo).indexOf('beauty') > -1) {
            window.logger.info('settingInfo', `保存到本地的美业模式${settingInfo.beauty}`)
            // 保存到本地
            localConfig.setItem('_vf_beauty', settingInfo.beauty)
        }
        if (Object.keys(settingInfo).indexOf('wifibtn') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_wifibtn', settingInfo.wifibtn)
        }
        if (Object.keys(settingInfo).indexOf('deviceViewReport') > -1) {
            // 保存到本地
            localConfig.setItem('_vf_device_view_report', settingInfo.deviceViewReport)
        }
        if (Object.keys(settingInfo).indexOf('Athlete') > -1) {
            window.logger.info('settingInfo', `保存到本地的运动员模式${settingInfo.Athlete}`)
            // 保存到本地
            localConfig.setItem('_vf_Athlete', settingInfo.Athlete)
        }
        const newInfo = { ...state.settingInfo, ...settingInfo }
        state.settingInfo = newInfo
    },
    [types.CHANGE_UPDATE_INFO](state: IState, updateInfo: any) {
        const newInfo = { ...state.updateInfo, ...updateInfo }
        state.updateInfo = newInfo
        // window.logger.debug('CHANGE_UPDATE_INFO:', JSON.stringify(newInfo))
    }
}

const actions = {}

export default {
    // namespaced: true,
    state: moduleState,
    getters: moduleGetters,
    mutations,
    actions
}
