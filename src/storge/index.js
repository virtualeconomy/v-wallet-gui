import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        enableStatus: JSON.parse(window.localStorage.getItem('enableStatus')),
        eventPool: {},
        refreshEvent: {},
        refreshStatus: 0,
        addTokenStatus: 0
    },
    mutations: {
        changeEnableStatus(state, status) {
            state.enableStatus = status
        },
        changeEventPool(state, status) {
            state.eventPool = status
        },
        changeRefreshEvent(state, status) {
            state.refreshEvent = status
        },
        changeRefreshStatus(state) {
            state.refreshStatus = state.refreshStatus === 0 ? 1 : 0
        },
        changeAddTokenStatus(state) {
            state.addTokenStatus = state.addTokenStatus === 0 ? 1 : 0
        }
    },
    actions: {
    },
    getters: {
    }
})

export default store
