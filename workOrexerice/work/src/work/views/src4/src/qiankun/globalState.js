import { initGlobalState } from 'qiankun'
import store from '../store/index'
import * as types from '@/store/mutation-types'

// 初始化
export const initialState = {
    [types.SET_DEVICE_EXOIRE]: '',
    [types.SET_RENEWAL]: '',
    [types.SET_USER_INFO]: {},
    [types.SET_RENEWAL_LENGHT]: 0,
    [types.SHOW_REMIND]: true,
    [types.REPLACE_STATUS]: false,
    [types.BACK_API]: process.env.API_HOST,
    PROJECT: 'VR-PRO3', // 所属项目 可不选 默认VD
    ORDER_NAME: 'Visbody-VR-PRO3' // 订单名称 可不写 默认Visbody-D
}
// 初始化 state
const actions = initGlobalState(initialState)
actions.onGlobalStateChange((state, prev) => { // 监听公共状态的变化
    // 这里我把公共状态存到主应用的vuex里了
    store.commit(types.SET_DEVICE_EXOIRE, state)
    store.commit(types.SET_RENEWAL, state)
    store.commit(types.SET_USER_INFO, state)
    // 续费记录条数
    store.commit(types.SET_RENEWAL_LENGHT, state)
    // 弹框关闭
    store.commit(types.SHOW_REMIND, state)
    // 重新加载支付套餐
    store.commit(types.REPLACE_STATUS, state)
})

export default actions