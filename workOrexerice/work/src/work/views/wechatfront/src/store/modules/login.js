const state = {
    isShowMenu: true
}
const getters = {
    isShowMenu(state) {
        return state.isShowMenu
    }
}

const mutations = {
    SET_ISSHOWMENU(state, data) {
        state.isShowMenu = data
    }
}

const actions = {
    // 是否显示侧边栏
    setIsShowMenu({ commit }, data) {
        commit('SET_ISSHOWMENU', data)
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
