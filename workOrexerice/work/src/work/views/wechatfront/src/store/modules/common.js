const state = {
    scanId: '',
    tcScanId: ''
}
const getters = {
    scanId(state) {
        return state.scanId
    },
    tcScanId(state) {
        return state.tcScanId
    }
}

const mutations = {
    scanId(state, scanId) {
        state.scanId = scanId
    },
    tcScanId(state, tcScanId) {
        state.tcScanId = tcScanId
    }
}

export default {
    state,
    mutations,
    getters
}
