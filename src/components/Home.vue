<template>
  <div class="home"
       @mousemove=resetSessionClearTimeout>
    <nav-bar :addresses="addresses"
             :address="selectedAddress"
             class="navibar"
             :cold-addresses="coldAddresses"
             :username="username"
             :avt-hash="avtHash"
             :get-pub-key="getPubKey"
             :get-pri-key="getPriKey"
             :get-seed-phrase="getSeedPhrase"
             :set-usr-local-storage="setUsrLocalStorage"
             @delete-cold="deleteCold"></nav-bar>
    <div class="container-fluid height-full contents">
      <div class="row height-full div-main">
        <div class="col-auto col-xs-1 assets-pane height-full">
          <div class="asset-title">
            <img
              src="../assets/imgs/icons/wallet/ic_assets_line.svg"><b class="title-assets">Accounts</b>
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
                 v-for="(coldPubkey, coldAddress) in coldAddresses"
                 :address="coldAddress"
                 :key="coldAddress"
                 :balance="balance[coldAddress]"
                 :selected="coldAddress === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(coldAddress, 'coldWallet')">
          </Asset>
          <Asset v-if="coldAddresses&&sortFlag===1"
                 v-for="(coldPubkey, coldAddress) in sortedAddresses"
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
                      src="../assets/imgs/icons/wallet/ic_transaction_solid.svg">
                    <img
                      class="img-nonactive"
                      src="../assets/imgs/icons/wallet/ic_transaction_line.svg">
                    <span class="tab-title">Transaction</span>
                  </div>
                </template>
                <div class="trans-pane">
                  <trans-pane :balance="balance[selectedAddress]"
                              :address="selectedAddress"
                              :wallet-type="walletType"
                              :balances="balance"
                              :cold-addresses="coldAddresses"
                              :total="total"
                              :addresses="addresses"></trans-pane>
                </div>
                <div class="f-records">
                  <Records :address="selectedAddress"></Records>
                </div>
              </b-tab>
              <b-tab>
                <template slot="title">
                  <div>
                    <img
                      class="img-active"
                      src="../assets/imgs/icons/wallet/ic_card_solid.svg">
                    <img
                      class="img-nonactive"
                      src="../assets/imgs/icons/wallet/ic_card_line.svg">
                    <span class="tab-title">Leasing</span>
                  </div>
                </template>
                <div class="lease-pane">
                  <LeasePane :cold-addresses="coldAddresses"
                             :addresses="addresses"
                             :balance="balance"
                             :available="available"
                             :leased-in="leasedIn"
                             :leased-out="leasedOut"
                             :total="total"
                             :address="selectedAddress"
                             :wallet-type="walletType">
                  </LeasePane>
                </div>
                <div class="f-records">
                  <LeaseRecords :address="selectedAddress"
                                :wallet-type="walletType"
                                :cold-pub-key="coldPubKey"
                                :address-index="addresses[selectedAddress]"></LeaseRecords>
                </div>
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
import TransPane from './home/elements/TransPane'
import Asset from './home/elements/Asset'
import ImportColdWallet from './home/modals/ImportColdWallet'
import Vue from 'vue'
import { INITIAL_SESSION_TIMEOUT, NODE_IP, VSYS_PRECISION } from '@/constants.js'
import seedLib from '@/libs/seed.js'
import Records from './home/elements/Records'
import LeasePane from './home/elements/LeasePane'
import LeaseRecords from './home/elements/LeaseRecords'

export default {
    name: 'Home',
    data: function() {
        return {
            balance: {},
            selectedAddress: '',
            sessionClearTimeout: void 0,
            addresses: {},
            coldAddresses: {},
            sortedAddresses: {},
            walletType: '',
            sortFlag: 0,
            transActive: 'trans',
            available: 0,
            leasedIn: 0,
            leasedOut: 0,
            total: 0
        }
    },

    created() {
        if (!this.address || !Vue.ls.get('pwd')) {
            this.$router.push('/login')
        } else {
            this.getBalance(this.address)
            this.setUsrLocalStorage('lastLogin', new Date().getTime())
            this.selectedAddress = this.address
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
        }
    },

    mounted() {
        this.setSessionClearTimeout()
    },
    beforeDestroy() {
        clearTimeout(this.sessionClearTimeout)
    },

    computed: {
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
        walletAmount() {
            if (this.userInfo && this.userInfo.walletAmount) {
                return this.userInfo.walletAmount
            } else {
                return 1
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
        coldPubKey() {
            if (this.walletType === 'coldWallet') {
                return this.coldAddresses[this.selectedAddress]
            }
        }
    },

    methods: {
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
                this.$router.push('/login')
            }, oldTimeout * 60 * 1000)
        },
        tranTabChange(tabIndex) {
            if (tabIndex === 0) {
                this.transActive = 'trans'
            } else if (tabIndex === 1) {
                this.transActive = 'lease'
                this.getBalance(this.selectedAddress)
            }
        },
        resetSessionClearTimeout() {
            clearTimeout(this.sessionClearTimeout)
            this.setSessionClearTimeout()
        },
        getBalance: function(address) {
            const url = NODE_IP + '/addresses/balance/details/' + address
            this.$http.get(url).then(response => {
                Vue.set(this.balance, address, response.body['available'] / VSYS_PRECISION)
                this.total = response.body.regular / VSYS_PRECISION
                this.available = response.body.available / VSYS_PRECISION
                this.leasedOut = (response.body.regular - response.body.available) / VSYS_PRECISION
                this.leasedIn = (response.body.effective - response.body.available) / VSYS_PRECISION
            }, response => {
                this.$router.push('/warning')
            })
        },
        importCold(coldAddress, pubKey) {
            Vue.set(this.coldAddresses, coldAddress, !pubKey ? '' : pubKey)
            let unsortedColdAddresses = this.coldAddresses
            let sortedColdAddresses = {}
            Object.keys(unsortedColdAddresses).sort().forEach(function(key) {
                sortedColdAddresses[key] = unsortedColdAddresses[key]
            })
            this.sortedAddresses = sortedColdAddresses
            this.getBalance(coldAddress)
            this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
        },
        getSeedPhrase() {
            if (this.secretInfo) {
                return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
            }
        },
        getPriKey(nonce) {
            if (this.secretInfo) {
                return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase(), nonce).keyPair.privateKey
            }
        },
        getPubKey(nonce) {
            if (this.secretInfo) {
                return seedLib.fromExistingPhrasesWithIndex(this.getSeedPhrase(), nonce).keyPair.publicKey
            }
        },
        setUsrLocalStorage(feildname, value) {
            Vue.set(this.userInfo, feildname, value)
            window.localStorage.setItem(this.address, JSON.stringify(this.userInfo))
        },
        selectWallet(addr, type) {
            this.walletType = type
            if (this.selectedAddress !== addr) {
                this.selectedAddress = addr
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
            var addresses = []
            var seedPhrase = this.getSeedPhrase()
            for (var index = 0; index < this.walletAmount; index++) {
                var seed = seedLib.fromExistingPhrasesWithIndex(seedPhrase, index)
                Vue.set(this.addresses, seed.address, index)
            }
            return addresses
        },
        sortStatus() {
            if (this.sortFlag === 0) this.sortFlag = 1
            else this.sortFlag = 0
        }
    },

    components: {
        ImportColdWallet,
        TransPane,
        NavBar,
        Asset,
        Records,
        LeaseRecords,
        LeasePane
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
.trans-pane, .lease-pane {
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
</style>
