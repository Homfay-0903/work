/*
 * @Description: do something
 * @Author: WendyGao
 * @Date: 2022-02-09 10:10:58
 * @LastEditors: WendyGao
 * @LastEditTime: 2022-02-22 18:17:40
 */
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = {
    modules
}

export default new Vuex.Store(store)
