/*
 * @Author: DonWang wangwenqiu@suanier.com
 * @Date: 2023-06-07 10:15:25
 * @LastEditors: liutq
 * @LastEditTime: 2025-06-05 11:54:26
 * @FilePath: \vr-pro3-wechat-frontend\src\store\index.js
 * @Description:
 */
import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import common from './modules/common'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        unit: localStorage.getItem('unit') || 'metric',
        dataArray: [], // 历史数据信息,
        dataArrayMass: [], // 身体成分的历史数据信息,
        waistdataArray: [], // 腰围数据的历史数据信息,
        composition: [], // 提成分数据,
        historyScanId: '', // 历史scanId,
        historyData: {}, // 历史记录数据
        sidebarData: {}, // 侧边栏缓存数据
        newMathTtData: {}, // 新算发二期体态数据
        isNewMathTt: 0 // 是否新算法
    },
    mutations: {
        setUnit(state, payload) {
            state.unit = payload
            localStorage.setItem('unit', payload)
        },
        setDataArray(state, payload) {
            state.dataArray = payload
        },
        setDataArrayMass(state, payload) {
            state.dataArrayMass = payload
        },
        setwaistDataArray(state, payload) {
            state.waistdataArray = payload
            console.log(payload, state.waistdataArray)
        },
        setComposition(state, payload) {
            state.composition = payload
        },
        setHistoryScanId(state, payload) {
            state.historyScanId = payload

        },
        setHistoryData(state, payload) {
            state.historyData = payload

        },
        setSidebarData(state, payload) {
            state.sidebarData = payload
        },
        setNewMathTtData(state, payload) {
            state.newMathTtData = payload
        },
        setIsNewMathTt(state, payload) {
            state.isNewMathTt = payload
        }
    },
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        login,
        common
    }
})

export default store
