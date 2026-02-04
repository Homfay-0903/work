/*
 * @Description: 外部服务相关
 * @Author: WendyGao
 * @Date: 2022-02-22 13:57:22
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-02-24 21:25:24
 */
import { ActionContext } from 'vuex'
import { ReturnGetters } from '../index.d'

import * as types from '../mutation-types'

// 外部服务列表
const extList = ['alg', 'hardware']

// 0 未知 1 正常/可用 2 失败/不可用
type status = 0 | 1 | 2

interface IExtService {
    // 服务名
    name: string
    // 服务状态
    ready: status
    // 自检状态
    checkSelf: status
}

type IState = typeof moduleState

const moduleState = {
    extServices: Array<IExtService>()
}

const moduleGetters = {
    extServices: (state: IState) => state.extServices,
    // 设备自检信息
    deviceCheckSelfInfo: (state: IState) => {
        const unknownItem = state.extServices.find((item) => item.ready === 0 || item.checkSelf === 0)
        return {
            // 自检是否结束
            isEnd: !unknownItem,
            // 自检结果
            result: false
        }
    }
}
type IGetters = ReturnGetters<typeof moduleGetters>

const mutations = {
    [types.SET_EXT_SERVICES](state: IState, extServices: IExtService[]) {
        // window.logger.debug('SET_EXT_SERVICES', JSON.stringify(extServices))
        state.extServices = extServices
    },
    [types.CHANGE_EXT_SERVICE](state: IState, extService: IExtService) {
        const idx = state.extServices.findIndex((item) => item.name === extService.name)
        if (idx !== -1) {
            const extServices = JSON.parse(JSON.stringify(state.extServices))
            extServices[idx] = { ...extServices[idx], ...extService }
            state.extServices = extServices
            // window.logger.debug('CHANGE_EXT_SERVICE', JSON.stringify(state.extServices))
        }
    }
}

const actions = {
    // 初始化外部服务状态
    initExtServices({ commit }: ActionContext<IState, IGetters>) {
        const list: IExtService[] = []
        extList.forEach((name) => {
            const item: IExtService = {
                name,
                ready: 0,
                checkSelf: 0
            }
            list.push(item)
        })

        commit(types.SET_EXT_SERVICES, list)
    },
    changeExtService({ commit }: ActionContext<IState, IGetters>, extService: IExtService) {
        commit(types.CHANGE_EXT_SERVICE, extService)
    }
}

export default {
    // namespaced: true,
    state: moduleState,
    getters: moduleGetters,
    mutations,
    actions
}
