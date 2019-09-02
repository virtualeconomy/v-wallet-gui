import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import BigNumber from 'bignumber.js'
import JSONBigNumber from 'json-bignumber'
import { NODE_IP, VSYS_PRECISION } from '@/constants.js'
Vue.use(Vuex)
Vue.use(VueResource)

const store = new Vuex.Store({
    state: {
        enableStatus: JSON.parse(window.localStorage.getItem('enableStatus')),
        eventPool: {},
        available: BigNumber(NaN),
        leasedIn: BigNumber(NaN),
        leasedOut: BigNumber(NaN),
        selectedAddress: '',
        total: BigNumber(NaN),
        intervalStatus: false,
        addTokenStatus: 0
    },
    mutations: {
        changeEnableStatus(state, status) {
            state.enableStatus = status
        },
        updateBalance(state) {
            const url = NODE_IP + '/addresses/balance/details/' + state.selectedAddress
            Vue.http.get(url).then(response => {
                let tempResponse = JSONBigNumber.parse(response.bodyText)
                state.total = tempResponse.regular.dividedBy(VSYS_PRECISION)
                state.available = tempResponse.available.dividedBy(VSYS_PRECISION)
                state.leasedOut = tempResponse.regular.minus(tempResponse.available).dividedBy(VSYS_PRECISION)
                state.leasedIn = tempResponse.effective.minus(tempResponse.available).dividedBy(VSYS_PRECISION)
            })
        },
        updateSelectedAddress(state, address) {
            state.selectedAddress = address
        },
        changeEventPool(state, status) {
            state.eventPool = status
        },
        changeAddTokenStatus(state) {
            state.addTokenStatus = state.addTokenStatus === 0 ? 1 : 0
        }
    },
    actions: {
        updateSelectedAddress(context, address) {
            if (context.state['selectedAddress'] && context.state['selectedAddress'] !== address) {
                context.commit('updateSelectedAddress', address)
                context.commit('updateBalance')
            }
            context.commit('updateSelectedAddress', address)
        },
        updateBalance(context, repeatable) {
            if (repeatable && !context.state['intervalStatus']) {
                context.state['intervalStatus'] = true
                const updateTask = (interval) => {
                    setTimeout(() => {
                        let previousValue = context.state['available']
                        context.commit('updateBalance')
                        if (previousValue === context.state['available'] && interval <= 150000) {
                            updateTask(interval * 5)
                        } else {
                            context.state['intervalStatus'] = false
                        }
                    }, interval)
                }
                updateTask(6000)
            }
            context.commit('updateBalance')
        },
        changeEventPool(context, status) {
            context.commit('changeEventPool', status)
        },
        changeAddTokenStatus(context) {
            context.commit('changeAddTokenStatus')
        }
    },
    getters: {
    }
})

export default store
