import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        enableStatus: JSON.parse(window.localStorage.getItem('enableStatus'))
    },
    mutations: {
        changeEnableStatus(state, status) {
            state.enableStatus = status
        }
    },
    actions: {
    },
    getters: {
    }
})

export default store
