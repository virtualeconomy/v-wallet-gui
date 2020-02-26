<template>
  <div class="home"
       @mousemove=resetSessionClearTimeout>
    <nav-bar :addresses="addresses"
             :address="selectedAddress"
             class="navibar"
             :cold-addresses="coldAddresses"
             :username="username"
             :avt-hash="avtHash"
             :get-public-key="getPublicKey"
             :get-private-key="getPrivateKey"
             :get-seed-phrase="getSeedPhrase"
             :set-usr-local-storage="setUsrLocalStorage"
             @delete-cold="deleteCold"></nav-bar>
    <div class="container-fluid height-full contents">
      <div class="row height-full div-main">
        <div class="col-auto col-xs-1 assets-pane height-full">
          <div class="asset-title">
            <img
              src="../assets/imgs/icons/wallet/ic_assets_line.svg"><b class="title-assets">Accounts</b>
            <b-button class="add-token-button text-decoration-none"
                      variant="link"
                      v-b-modal.addAccountModal>&oplus;</b-button>
            <AddAccount show="false"
                        @refreshAccount="refreshAccount"></AddAccount>
          </div>
          <Asset v-if="addresses"
                 v-for="(index, address) in addresses"
                 :key="address"
                 :address="address"
                 :balance="balance[address]"
                 :selected="address === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(address, 'hotWallet')">
          </Asset>
          <div>
            <span>
              <img
                src="../assets/imgs/icons/wallet/ic_wallet_line.svg"><b class="title-assets">Cold Wallet</b>
              <b-btn @click="sortStatus"
                     size="sm"
                     align="left"
                     variant="link"
                     class="sort">
                <img class="sort-image"
                     src="../assets/imgs/icons/wallet/ic_sort_down.svg">
              </b-btn>
            </span>
          </div>
          <Asset v-if="coldAddresses&&sortFlag===0"
                 v-for="(coldPublicKey, coldAddress) in coldAddresses"
                 :address="coldAddress"
                 :key="coldAddress"
                 :balance="balance[coldAddress]"
                 :selected="coldAddress === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(coldAddress, 'coldWallet')">
          </Asset>
          <Asset v-if="coldAddresses&&sortFlag===1"
                 v-for="(coldPublicKey, coldAddress) in sortedAddresses"
                 :address="coldAddress"
                 :key="coldAddress"
                 :balance="balance[coldAddress]"
                 :selected="coldAddress === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(coldAddress, 'coldWallet')">
          </Asset>
          <b-btn @click="$root.$emit('bv::show::modal', 'importModal', 'importModal')"
                 size="sm"
                 variant="link"
                 class="btn-import-cold">
            <img
              class="mb-1"
              src="../assets/imgs/icons/wallet/ic_import.svg"><b class="title-assets">Monitor Cold Wallet</b></b-btn>
          <ImportColdWallet @import-cold="importCold"
                            show="false"
                            :address="address"></ImportColdWallet>
        </div>
        <div class="col page container">
          <div
            class="height-full"
            bg-variant="white"
            border-variant="primary">
            <b-tabs @input="tranTabChange">
              <b-tab active>
                <template slot="title">
                  <div>
                    <img
                      class="img-active"
                      src="../assets/imgs/icons/wallet/ic_polygon_solid.svg">
                    <img
                      class="img-nonactive"
                      src="../assets/imgs/icons/wallet/ic_polygon_line.svg">
                    <span class="tab-title">Asset</span>
                  </div>
                </template>
                <div class="token-pane">
                  <TokenPane :balance="balance[selectedAddress]"
                             :address="selectedAddress"
                             :wallet-type="walletType"
                             :balances="balance"
                             :cold-addresses="coldAddresses"
                             :addresses="addresses"></TokenPane>
                </div>
                <div class="f-records">
                  <TokenRecords :address="selectedAddress"
                                :addresses="addresses"
                                :cold-addresses="coldAddresses"
                                :wallet-type="walletType"
                                :balances="balance"
                                :active-tab="activeTab">
                  </TokenRecords>
                </div>
              </b-tab>
              <b-tab>
                <template slot="title">
                  <div>
                    <img
                      class="img-active"
                      src="../assets/imgs/icons/wallet/ic_transaction_solid.svg">
                    <img
                      class="img-nonactive"
                      src="../assets/imgs/icons/wallet/ic_transaction_line.svg">
                    <span class="tab-title">Transaction</span>
                  </div>
                </template>
                <div class="f-records">
                  <TransactionRecords :address="selectedAddress"
                                      :active-tab="activeTab"></TransactionRecords>
                </div>
              </b-tab>
              <b-tab>
                <template slot="title">
                  <div>
                    <img
                      class="img-active"
                      src="../assets/imgs/icons/wallet/ic_minting_Solid.svg">
                    <img
                      class="img-nonactive"
                      src="../assets/imgs/icons/wallet/ic_minting_Line.svg">
                    <span class="tab-title">Minting</span>
                  </div>
                </template>
                <div class="lease-pane">
                  <LeasePane :cold-addresses="coldAddresses"
                             :addresses="addresses"
                             :balance="balance"
                             :address="selectedAddress"
                             :wallet-type="walletType">
                  </LeasePane>
                </div>
                <div class="f-records">
                  <LeaseRecords :address="selectedAddress"
                                :active-tab="activeTab"
                                :wallet-type="walletType"
                                :cold-public-key="coldPublicKey"
                                :address-index="addresses[selectedAddress]"
                                :cold-addresses="coldAddresses"
                                :addresses="addresses"
                                :node-list="nodeList"
                                :update-lease-records-flag="updateLeaseRecordsFlag"
                                :balance="balance"></LeaseRecords>
                </div>
                <SendToken :from3rd-party="from3rdParty"
                           :token-id="tokenId"
                           :token-balances="tokenBalances"
                           :balances="balance"
                           :inherited-recipient="inheritedRecipient"
                           :inherited-amount="inheritedAmount"
                           :inherited-description="inheritedDescription"
                           :cold-addresses="coldAddresses"
                           :addresses="addresses"
                           :selected-address="address"
                           :wallet-type="walletType"
                           :is-split="isSplit"
                           :token-unity="unity">
                </SendToken>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './home/elements/NavBar'
import Asset from './home/elements/Asset'
import ImportColdWallet from './home/modals/ImportColdWallet'
import Vue from 'vue'
import { VSYS_PRECISION } from '@/js-v-sdk/src/constants'
import { INITIAL_SESSION_TIMEOUT } from '@/constants'
import {VSYS_RATE} from '../network'
import seedLib from '@/libs/seed.js'
import TransactionRecords from './home/elements/TransactionRecords'
import LeasePane from './home/elements/LeasePane'
import LeaseRecords from './home/elements/LeaseRecords'
import TokenPane from './home/elements/TokenPane'
import TokenRecords from './home/elements/TokenRecords'
import AddToken from './home/modals/AddToken'
import AddAccount from './home/modals/AddAccount'
import BigNumber from 'bignumber.js'
import { mapActions, mapState } from 'vuex'
import SendToken from './home/elements/SendToken'
import common from '@/js-v-sdk/src/utils/common'

export default {
    name: 'Home',
    data: function() {
        return {
            tokenBalances: {},
            balance: {},
            selectedAddress: '',
            sessionClearTimeout: void 0,
            addresses: {},
            coldAddresses: {},
            sortedAddresses: {},
            walletType: '',
            sortFlag: 0,
            activeTab: 'token',
            leasedIn: BigNumber(0),
            leasedOut: BigNumber(0),
            total: BigNumber(0),
            tokenId: '',
            isSplit: false,
            unity: BigNumber(1),
            inheritedAmount: '',
            inheritedRecipient: '',
            inheritedDescription: '',
            updateLeaseRecordsFlag: false,
            nodeList: []
        }
    },
    created() {
        if (!this.address || !Vue.ls.get('pwd')) {
            this.$router.push('/login')
        } else {
            this.$http.get(VSYS_RATE).then(function(result) {
                this.nodeList = result.body.data
            })
            this.getBlockHeight()
            this.setUsrLocalStorage('lastLogin', new Date().getTime())
            this.selectedAddress = this.address
            this.walletType = 'hotWallet'
            let unsortedColdAddresses = {}
            let sortedColdAddresses = {}
            if (this.userInfo && this.userInfo.coldAddresses) {
                unsortedColdAddresses = JSON.parse(this.userInfo.coldAddresses)
            }
            Object.keys(unsortedColdAddresses).sort().forEach(function(key) {
                sortedColdAddresses[key] = unsortedColdAddresses[key]
            })
            this.coldAddresses = unsortedColdAddresses
            this.sortedAddresses = sortedColdAddresses
            this.getAddresses()
            for (const addr in this.addresses) {
                this.getBalance(addr)
            }
            for (const addr in this.coldAddresses) {
                this.getBalance(addr)
            }
            this.updateSelectedAddress({address: this.selectedAddress, balance: this.balance[this.selectedAddress]})
            this.updateBalance(false)
            let localChanging = false
            for (const addr in this.coldAddresses) {
                if (!this.coldAddresses[addr].hasOwnProperty('api')) {
                    localChanging = true
                    let tempObj = {'protocol': 'v.systems', 'opc': 'account', 'address': addr, 'api': 1, 'publicKey': this.coldAddresses[addr]}
                    Vue.set(this.coldAddresses, addr, JSON.parse(JSON.stringify(tempObj)))
                }
                if (!this.coldAddresses[addr].hasOwnProperty('device')) {
                    localChanging = true
                    Vue.set(this.coldAddresses[addr], 'device', 'MobileApp')
                }
            }
            if (localChanging) {
                this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
            }
            if (this.from3rdParty) {
                this.inheritedDescription = this.paymentRedirect.hasOwnProperty('invoice') ? this.paymentRedirect['invoice'] : this.inheritedDescription
                this.inheritedAmount = this.paymentRedirect.hasOwnProperty('amount') ? this.paymentRedirect['amount'] : this.inheritedAmount
                this.inheritedRecipient = this.paymentRedirect.hasOwnProperty('recipient') ? this.paymentRedirect['recipient'] : this.inheritedRecipient
                this.tokenId = this.paymentRedirect['token']
                this.getTokenBalances()
                this.getTokenInfo()
            }
        }
    },
    mounted() {
        this.setSessionClearTimeout()
    },
    beforeDestroy() {
        clearTimeout(this.sessionClearTimeout)
    },
    watch: {
        available(now, old) {
            if (this.balance[this.selectedAddress]) {
                if (this.balance[this.selectedAddress].isEqualTo(old) && !this.balance[this.selectedAddress].isEqualTo(now)) {
                    this.balance[this.selectedAddress] = now
                }
            }
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            available: 'available',
            paymentRedirect: 'paymentRedirect'
        }),
        from3rdParty() {
            return JSON.stringify(this.paymentRedirect) !== '{}' && this.$route.query.hasOwnProperty('redirect') && this.paymentRedirect.hasOwnProperty('token')
        },
        address() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
        },
        username() {
            if (this.userInfo) {
                return this.userInfo.username
            }
        },
        avtHash() {
            if (this.userInfo) {
                return this.userInfo.avtHash
            }
        },
        secretInfo() {
            if (this.userInfo) {
                return JSON.parse(
                    seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
            }
        },
        coldPublicKey() {
            if (this.walletType === 'coldWallet') {
                if (this.coldAddresses[this.selectedAddress]) {
                    return this.coldAddresses[this.selectedAddress].publicKey
                }
            }
        },
        defaultAddress() {
            return Vue.ls.get('address')
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        }
    },
    methods: {
        ...mapActions(['updateSelectedAddress', 'updateBalance', 'updatePaymentRedirect']),
        showErrorMsgBox(errorMessage) {
            const h = this.$createElement
            const titleVNode = h('div', { domProps: { innerHTML: 'Error' }, class: ['error-title'] })
            this.$bvModal.msgBoxOk(errorMessage, {
                title: [titleVNode],
                size: 'sm',
                buttonSize: 'sm',
                headerTextVariant: 'warning',
                okVariant: 'warning',
                headerClass: 'p-2 border-bottom-0',
                footerClass: 'p-2 border-top-0',
                centered: true
            })
                .then(value => {
                    this.updatePaymentRedirect({})
                    this.$router.push('/')
                })
        },
        getTokenBalances() {
            for (const addr in this.addresses) {
                Vue.set(this.tokenBalances, addr, BigNumber(0))
                this.chain.getTokenBalance(addr, this.tokenId).then(response => {
                    let value = BigNumber(response.balance).dividedBy(response.unity)
                    Vue.set(this.tokenBalances, addr, value)
                }, respError => {
                })
            }
            for (const addr in this.coldAddresses) {
                Vue.set(this.tokenBalances, addr, BigNumber(0))
                this.chain.getTokenBalance(addr, this.tokenId).then(response => {
                    let value = BigNumber(response.balance).dividedBy(response.unity)
                    Vue.set(this.tokenBalances, addr, value)
                }, respError => {
                })
            }
        },
        getTokenInfo() {
            let contractId = common.tokenIDToContractID(this.tokenId)
            this.chain.getContractInfo(contractId).then(response => {
                this.isSplit = response.type === 'TokenContractWithSplit'
            }, respError => {
            })
            this.chain.getTokenInfo(this.tokenId).then(response => {
                if (!response.hasOwnProperty('error')) {
                    this.unity = BigNumber(response.unity)
                    this.$root.$emit('bv::show::modal', 'sendTokenModal_' + this.tokenId + 'true')
                } else {
                    this.showErrorMsgBox(response.message)
                }
            }, respError => {
                this.showErrorMsgBox('Unknown.Please check network connection!')
            })
        },
        setSessionClearTimeout() {
            let oldTimeout = INITIAL_SESSION_TIMEOUT
            try {
                const newTimeout = JSON.parse(window.localStorage.getItem(this.address)).sessionTimeout
                oldTimeout = newTimeout || oldTimeout
            } catch (e) {
                oldTimeout = INITIAL_SESSION_TIMEOUT
            }
            this.sessionClearTimeout = setTimeout(() => {
                Vue.ls.clear()
                this.updatePaymentRedirect({})
                this.$router.push('/login')
            }, oldTimeout * 60 * 1000)
        },
        tranTabChange(tabIndex) {
            this.updateBalance(false)
            this.getBalance(this.selectedAddress)
            if (tabIndex === 0) {
                this.activeTab = 'token'
            } else if (tabIndex === 1) {
                this.activeTab = 'trans'
            } else if (tabIndex === 2) {
                this.activeTab = 'lease'
            }
        },
        resetSessionClearTimeout() {
            clearTimeout(this.sessionClearTimeout)
            this.setSessionClearTimeout()
        },
        getBalance: function(address) {
            this.chain.getBalanceDetail(address).then(response => {
                let value = BigNumber(response.available).dividedBy(VSYS_PRECISION)
                let changeStatus = value === this.balance[address]
                Vue.set(this.balance, address, value)
                if (address === this.selectedAddress) {
                    if (changeStatus) {
                        let addrtmp = this.selectedAddress
                        this.selectedAddress = ''
                        setTimeout(() => {
                            this.selectedAddress = addrtmp
                        }, 0)
                    }
                }
            }, respError => {
                Vue.set(this.balance, address, new BigNumber(0))
            })
        },
        getBlockHeight() {
            this.chain.getLastBlock().then(response => {
                let tempTime = new Date(response.timestamp / 1e6).toLocaleString()
                window.localStorage.setItem('globalHeight', response.height)
                window.localStorage.setItem('time', tempTime)
            }, respError => {
                this.$router.push('/warning')
            })
        },
        importCold(coldAddress, pubKey, jsonObj) {
            let coldAddrs = {}
            let userInfo = JSON.parse(window.localStorage.getItem(this.address))
            if (userInfo && userInfo.coldAddresses) {
                coldAddrs = JSON.parse(userInfo.coldAddresses)
            }
            if (coldAddrs && coldAddrs[coldAddress]) {
                alert('Address already exist')
            } else {
                Vue.set(this.coldAddresses, coldAddress, jsonObj)
                let unsortedColdAddresses = this.coldAddresses
                let sortedColdAddresses = {}
                Object.keys(unsortedColdAddresses).sort().forEach(function(key) {
                    sortedColdAddresses[key] = unsortedColdAddresses[key]
                })
                this.sortedAddresses = sortedColdAddresses
                this.getBalance(coldAddress)
                this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
            }
        },
        getSeedPhrase() {
            if (this.secretInfo) {
                return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
            }
        },
        getPrivateKey(nonce) {
            if (this.secretInfo) {
                return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase(), nonce).keyPair.privateKey
            }
        },
        getPublicKey(nonce) {
            if (this.secretInfo) {
                return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase(), nonce).keyPair.publicKey
            }
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        selectWallet(addr, type) {
            this.walletType = type
            if (this.selectedAddress !== addr) {
                this.selectedAddress = addr
                this.updateSelectedAddress({address: addr, balance: this.balance[addr]})
                this.updateLeaseRecordsFlag = true
            } else {
                this.selectedAddress = ''
                setTimeout(() => {
                    this.selectedAddress = addr
                }, 0)
            }
            this.getBalance(addr)
        },
        deleteCold(addr) {
            Vue.delete(this.coldAddresses, addr)
            Vue.delete(this.sortedAddresses, addr)
            this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
        },
        getAddresses() {
            let seedPhrase = this.getSeedPhrase()
            let walletAmount = 1
            let userInfo = JSON.parse(window.localStorage.getItem(this.address))
            if (userInfo && userInfo.walletAmount) {
                walletAmount = userInfo.walletAmount
            }
            for (let index = 0; index < walletAmount; index++) {
                let seed = seedLib.fromExistingPhrasesWithIndex(seedPhrase, index)
                Vue.set(this.addresses, seed.address, index)
            }
        },
        sortStatus() {
            if (this.sortFlag === 0) this.sortFlag = 1
            else this.sortFlag = 0
        },
        refreshAccount() {
            this.getAddresses()
        }
    },
    components: {
        ImportColdWallet,
        NavBar,
        Asset,
        TransactionRecords,
        LeaseRecords,
        LeasePane,
        TokenPane,
        TokenRecords,
        AddToken,
        SendToken,
        AddAccount
    }
}
</script>
<style scoped lang="less">
@import '../assets/style/variables';
@import '../assets/style/common';
.home {
    width: 100%;
    height: 100%;
    min-width: 1000px;
}
.trans-pane, .lease-pane, .token-pane {
    height:@trxDivH;
    width: 100%;
}
.assets-pane {
    overflow-y: auto;
    border-right: 1px solid rgb(238, 238, 238);
    text-align: left;
    width: @assetsPaneW;
    height: 100%;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    background-color: rgb(245, 245, 245);
}
.records-pane {
    border-left: 1px solid @bdBgColor;
    text-align: left;
    div {
        display: inline-block;
    }
}
.height-full {
    max-height: 100%;
    height: inherit;
}
.page {
    background-color: rgb(250, 250, 250);
    padding: 0px 20px;
}
.asset-title {
    padding: 10px;
    margin-top: 10px;
}
.btn-import-cold {
    display: block;
    margin-left: auto;
    margin-right: auto;
    color: @vsysColor;
    z-index: 1000;
}
.pointer {
    cursor: pointer;
}
.unselectable {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.navibar {
    height: 64px;
    width: 100%;
    position: fixed;
    z-index:1000;
}
.title-assets {
    margin-left: 10px;
    font-size: 15px;
    font: Roboto-Regular;
}
.tab-title {
    margin-left: 8px;
}
.error-title {
    color: #FF8737;
}

.contents {
    padding-top: 64px;
    overflow: hidden;
}
.div-main {
    border-top: 1px solid rgb(232, 232, 236);
}
.f-records {
    /*padding-bottom: 120px;*/
}
.tab-pane {
    padding: 0 !important;
}
.sort {
    left: 0px;
    margin-left: 55px;
}
.sort-image {
    left: 0px;
    margin-left: 15px;
}
.input {
    margin-top: -100px;
    top: 100px;
}
.test {
    z-index: 100;
}
.add-token-button {
    z-index: 200;
    font-size: 23px;
    float: right;
    margin-top: -5px;
    padding: 0;
}
</style>
