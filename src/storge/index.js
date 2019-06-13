import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        enableStatus: JSON.parse(window.localStorage.getItem('enableStatus')),
        eventPool: {}
    },
    mutations: {
        changeEnableStatus(state, status) {
            state.enableStatus = status
        },
        changeEventPool(state, status) {
            state.eventPool = status
        }
    },
    actions: {
    },
    getters: {
    }
})

export default store
