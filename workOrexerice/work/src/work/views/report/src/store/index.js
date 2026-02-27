import Vue from 'vue'
import Vuex from 'vuex'
import { findUserInfo } from '@/assets/js/apolloGql.js'
import * as types from './mutation-types'
import { changeFormat, formatDate, repeatDate } from '@/assets/js/util.js'
import actions from '@/qiankun/globalState'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 登录token
        timeInterVal: '',
        nowTime: '',
        // 登录用户信息
        userInfo: {},
        // 设备过期时间
        deviceExpireDate: '',
        // 续费信息
        renewal: {
            // 续费状态 0 不需要提醒 1 过期前7天提醒 2 已过期提醒 3 过期7天已冻结提醒
            status: 0,
            // 过期时间 已格式化
            expireDate: '',
            // 冻结时间 已格式化
            freezeDate: '',
            // 支付成功
            paySuccess: false,
            // 是否已提醒支付状态
            isRemind: true,
            // 是否显示顶部续费提醒
            showRemind: false
        },
        // 活动权限
        activityPerm: false,
        // 续费记录
        renewalLength: 0,
        // 重新进入支付平台状态
        replaceStatus: false,
        // 新增数量
        newCount: {
            bindList: null,
            reportList: null
        }
    },
    getters: {
        // 暂无
    },
    mutations: {
        [types.SET_TOKEN_TIMEINTERVAL](state, val) {
            if (val === 0) {
                clearInterval(state.timeInterVal)
            }
        },
        [types.SET_USER_INFO](state, userorigin) {
            const userInfo = userorigin.SET_USER_INFO || userorigin
            state.userInfo = userInfo
            if (userInfo.dataStorageExpireDate !== null) {
                // console.log(userInfo.dataStorageExpireDate)
                state.renewal.status = userInfo.renewalStatus
                if (!repeatDate(userInfo.dataStorageExpireDate)) {
                    state.renewal.expireDate = changeFormat(userInfo.dataStorageExpireDate)
                    let freezeDate = new Date(userInfo.dataStorageExpireDate.replace(/\./g, '/'))
                    freezeDate.setDate(freezeDate.getDate() + 7)
                    state.renewal.freezeDate = changeFormat(formatDate(freezeDate))
                }
            } else {
                // 过期时间为 null 普通用户不需要提醒
                state.renewal.status = 0
            }
        },
        [types.RESET_STATES](state) {
            state.userInfo = {}
            state.nowTime = ''
            state.timeInterVal = ''
        },
        [types.SET_RENEWAL](state, payload) {
            state.renewal[payload.key] = payload.val
            if (payload.SET_RENEWAL) {
                state.renewal = payload.SET_RENEWAL
            }
        },
        [types.SET_RENEWAL_LENGHT](state, payload) {
            state.renewalLength = payload.SET_RENEWAL_LENGHT
        },
        [types.SET_DEVICE_EXOIRE](state, val) {
            state.deviceExpireDate = val.SET_DEVICE_EXOIRE
        },
        [types.SHOW_REMIND](state, val) {
            state.renewal.showRemind = val.SHOW_REMIND
        },
        [types.REPLACE_STATUS](state, val) {
            state.replaceStatus = val.REPLACE_STATUS
        },
        [types.REPORT_COUNT](state, val) {
            const count = {
                ...state.newCount,
                ...val
            }
            state.newCount = count
        }
    },
    actions: {
        async getUserInfo({ commit }, apollo) {
            return new Promise((resolve, reject) => {
                apollo.clients.defaultClient
                    .query({
                        query: findUserInfo,
                        fetchPolicy: 'network-only'
                    })
                    .then(res => {
                        const result = res.data.findUserInfo
                        if (result.code === 200) {
                            if (result.data.deviceId) {
                                window.localStorage.setItem('deviceId', result.data.deviceId)
                            }
                            if (result.data.reportMode) {
                                window.localStorage.setItem('reportMode', result.data.reportMode)
                            }
                            actions.setGlobalState({ SET_USER_INFO: result.data })
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
            })
        },
        setUserInfo({ commit }, userInfo) {
            commit(types.SET_USER_INFO, userInfo)
        },
        resetStates({ commit }) {
            commit(types.RESET_STATES)
        },
        setNewCount({ commit }, newCount) {
            commit(types.REPORT_COUNT, newCount)
        },
        resetNewCount({ commit }) {
            commit(types.REPORT_COUNT, {
                bindList: null,
                reportList: null
            })
        }
    }
})
