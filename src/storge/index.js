import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import BigNumber from 'bignumber.js'
import Blockchain from '@/js-v-sdk/src/blockchain'
import Account from '@/js-v-sdk/src/account'
import { VSYS_PRECISION } from '@/js-v-sdk/src/constants'
import { NETWORK_BYTE, TESTNET_IP, MAINNET_IP } from '@/network'
import common from '@/js-v-sdk/src/utils/common'
Vue.use(Vuex)
Vue.use(VueResource)

const store = new Vuex.Store({
    state: {
        account: new Account(NETWORK_BYTE),
        chain: String.fromCharCode(NETWORK_BYTE) === 'M' ? new Blockchain(MAINNET_IP, NETWORK_BYTE) : new Blockchain(TESTNET_IP, NETWORK_BYTE),
        tokenSplitStatus: JSON.parse(window.localStorage.getItem('tokenSplitStatus')),
        tokenManagementStatus: JSON.parse(window.localStorage.getItem('tokenManagementStatus')),
        heightStatus: JSON.parse(window.localStorage.getItem('heightStatus')),
        advancedFunctionsStatus: JSON.parse(window.localStorage.getItem('advancedFunctionsStatus')),
        eventPool: {},
        available: BigNumber(0),
        leasedIn: BigNumber(0),
        leasedOut: BigNumber(0),
        selectedAddress: '',
        total: BigNumber(0),
        intervalStatus: '',
        addTokenStatus: 0,
        paymentRedirect: {},
        assetStatus: false,
        certifiedTokenList: {},
        nodesList: [],
        isFullNode: true
    },
    mutations: {
        updateChain(state, status) {
            state.chain = new Blockchain(status['node'], status['networkByte'])
        },
        updateNodeType(state, status) {
            state.isFullNode = status
        },
        changeSettingsStatus(state, status) {
            state.tokenSplitStatus = status['split']
            state.tokenManagementStatus = status['management']
            state.heightStatus = status['height']
            state.advancedFunctionsStatus = status['advancedFunctionsStatus']
        },
        updateAssetStatus(state, status) {
            state.assetStatus = status
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
            state.available = status['balance'] ? status['balance'] : BigNumber(NaN)
            state.total = BigNumber(NaN)
            state.leasedIn = BigNumber(NaN)
            state.leasedOut = BigNumber(NaN)
        },
        changeEventPool(state, status) {
            state.eventPool = status
        },
        changeAddTokenStatus(state) {
            state.addTokenStatus = state.addTokenStatus === 0 ? 1 : 0
        },
        updatePaymentRedirect(state, status) {
            state.paymentRedirect = status
        },
        updateCertifiedTokenList(state, status) {
            state.certifiedTokenList = status
        }
    },
    actions: {
        updateChain(context, status) {
            context.commit('updateChain', status)
        },
        updateNodeType(context, status) {
            context.commit('updateNodeType', status)
        },
        updatePaymentRedirect(context, status) {
            context.commit('updatePaymentRedirect', status)
        },
        updateCertifiedTokenList(context, status) {
            context.commit('updateCertifiedTokenList', status)
        },
        updateAssetStatus(context, status) {
            context.commit('updateAssetStatus', status)
        },
        updateSelectedAddress(context, status) {
            if (context.state['selectedAddress'] && context.state['selectedAddress'] !== status['address']) {
                context.commit('updateSelectedAddress', status)
                context.commit('updateBalance')
            } else {
                context.commit('updateSelectedAddress', status)
            }
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
        addTokenUpdateEventPool(context, tokenId) {
            let defaultAddress = Vue.ls.get('address')
            let seedaddress = ''
            if (Vue.ls.get('address')) {
                seedaddress = Vue.ls.get('address')
            }
            let timeId = -1
            const updateTask = (interval) => {
                timeId = setTimeout(() => {
                    let userInfo = JSON.parse(window.localStorage.getItem(defaultAddress))
                    let tokens = {}
                    if (userInfo && userInfo.tokens) {
                        tokens = JSON.parse(userInfo.tokens)
                    }
                    if (tokenId in tokens) {
                        if (context.state['eventPool']) {
                            let eventPool = context.state['eventPool']
                            if (eventPool[tokenId] && eventPool[tokenId].timeId) {
                                clearTimeout(eventPool[tokenId].timeId)
                                Vue.delete(eventPool, tokenId)
                            }
                            context.commit('changeEventPool', eventPool)
                        }
                    } else {
                        context.state['chain'].getContractInfo(common.tokenIDToContractID(tokenId)).then(response => {
                            let contractType = response.type
                            let maker = response.info[1].data
                            context.state['chain'].getTokenInfo(tokenId).then(resp => {
                                let tokenInfo = { 'name': tokenId, 'contractType': contractType, 'iconUrl': '', 'maker': maker, 'unity': resp.unity }
                                Vue.set(tokens, tokenId, tokenInfo)
                                let userInfo = JSON.parse(window.localStorage.getItem(defaultAddress))
                                Vue.set(userInfo, 'tokens', JSON.stringify(tokens))
                                window.localStorage.setItem(seedaddress, JSON.stringify(userInfo))
                                context.commit('changeAddTokenStatus')
                            }, resErr => {
                            })
                        }, respError => {
                        })
                    }
                    if (interval <= 54000) {
                        updateTask(interval * 3)
                    }
                }, interval)
                let tmp = {'timeId': timeId}
                let eventPool = context.state['eventPool']
                Vue.set(eventPool, tokenId, tmp)
                context.commit('changeEventPool', eventPool)
            }
            updateTask(6000)
        },
        removeTokenUpdateEventPool(context, tokenId) {
            if (context.state['eventPool']) {
                let eventPool = context.state['eventPool']
                if (eventPool[tokenId] && eventPool[tokenId].timeId !== -1) {
                    clearTimeout(eventPool[tokenId].timeId)
                    Vue.delete(eventPool, tokenId)
                }
                context.commit('changeEventPool', eventPool)
            }
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
            window.localStorage.setItem('advancedFunctionsStatus', status['advancedFunctionsStatus'])
        }
    },
    getters: {
    }
})

export default store
