import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import BigNumber from 'bignumber.js'
import Blockchain from '@/js-v-sdk/src/blockchain'
import Account from '@/js-v-sdk/src/account'
import { VSYS_PRECISION } from '@/js-v-sdk/src/constants'
import { NODE_IP, NETWORK_BYTE } from '@/network'
Vue.use(Vuex)
Vue.use(VueResource)

const store = new Vuex.Store({
    state: {
        account: new Account(NETWORK_BYTE),
        chain: new Blockchain(NODE_IP, NETWORK_BYTE),
        tokenSplitStatus: JSON.parse(window.localStorage.getItem('tokenSplitStatus')),
        tokenManagementStatus: JSON.parse(window.localStorage.getItem('tokenManagementStatus')),
        heightStatus: JSON.parse(window.localStorage.getItem('heightStatus')),
        eventPool: {},
        available: BigNumber(NaN),
        leasedIn: BigNumber(NaN),
        leasedOut: BigNumber(NaN),
        selectedAddress: '',
        total: BigNumber(NaN),
        intervalStatus: '',
        addTokenStatus: 0
    },
    mutations: {
        changeSettingsStatus(state, status) {
            state.tokenSplitStatus = status['split']
            state.tokenManagementStatus = status['management']
            state.heightStatus = status['height']
        },
        updateBalance(state) {
            state.chain.getBalanceDetail(state.selectedAddress).then(response => {
                state.total = BigNumber(response.regular).dividedBy(VSYS_PRECISION)
                state.available = BigNumber(response.available).dividedBy(VSYS_PRECISION)
                state.leasedOut = BigNumber(response.regular).minus(response.available).dividedBy(VSYS_PRECISION)
                state.leasedIn = BigNumber(response.effective).minus(response.available).dividedBy(VSYS_PRECISION)
            })
        },
        updateSelectedAddress(state, status) {
            state.selectedAddress = status['address']
            state.available = status['balance']
        },
        changeEventPool(state, status) {
            state.eventPool = status
        },
        changeAddTokenStatus(state) {
            state.addTokenStatus = state.addTokenStatus === 0 ? 1 : 0
        }
    },
    actions: {
        updateSelectedAddress(context, status) {
            if (context.state['selectedAddress'] && context.state['selectedAddress'] !== status['address']) {
                context.commit('updateSelectedAddress', status)
                context.commit('updateBalance')
            }
            context.commit('updateSelectedAddress', status)
        },
        updateBalance(context, repeatable) {
            let randomIdentity = Math.floor(Math.random() * 100)
            context.state['intervalStatus'] = randomIdentity
            if (repeatable) {
                let previousValue = context.state['available']
                const updateTask = (interval) => {
                    setTimeout(() => {
                        context.commit('updateBalance')
                        if (previousValue.isEqualTo(context.state['available']) && randomIdentity === context.state['intervalStatus'] && interval <= 54000) {
                            updateTask(interval * 3)
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
        },
        changeSettingsStatus(context, status) {
            context.commit('changeSettingsStatus', status)
            window.localStorage.setItem('tokenSplitStatus', status['split'])
            window.localStorage.setItem('heightStatus', status['height'])
            window.localStorage.setItem('tokenManagementStatus', status['management'])
        }
    },
    getters: {
    }
})

export default store
