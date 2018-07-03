<template>
  <div class="home">
    <nav-bar :address="address"
             class="navibar"
             :cold-addresses="coldAddresses"
             :pub-key="pubKey"
             :username="username"
             :avt-hash="avtHash"
             :get-pri-key="getPriKey"
             :get-seed-phrase="getSeedPhrase"
             :set-usr-local-storage="setUsrLocalStorage"
             @delete-cold="deleteCold"></nav-bar>
    <div class="container-fluid height-full contents">
      <div class="row height-full div-main">
        <div class="col-auto assets-pane height-full">
          <div class="asset-title">
            <img
              src="../assets/imgs/icons/wallet/ic_assets_line.svg"><b class="title-assets">Assets</b>
          </div>
          <Asset v-if="address"
                 :address="address"
                 :balance="balance[address]"
                 :selected="address === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(address)">
          </Asset>
          <div class="asset-title">
            <img
              src="../assets/imgs/icons/wallet/ic_wallet_line.svg"><b class="title-assets">Cold Wallet</b>
          </div>
          <Asset v-if="coldAddresses"
                 v-for="(coldPubkey, coldAddress) in coldAddresses"
                 :address="coldAddress"
                 :key="coldAddress"
                 :balance="balance[coldAddress]"
                 :selected="coldAddress === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(coldAddress)">
          </Asset>
          <b-btn @click="$root.$emit('bv::show::modal', 'importModal', 'importModal')"
                 size="sm"
                 variant="link"
                 class="btn-import-cold">
            <img
              class="mb-1"
              src="../assets/imgs/icons/wallet/ic_import.svg"><b class="title-assets">Import Cold Wallet</b></b-btn>
          <ImportColdWallet @import-cold="importCold"
                            show="false"></ImportColdWallet>
        </div>
        <div class="col page container">
          <div
            class="height-full"
            bg-variant="white"
            border-variant="primary">
            <div class="trans-pane">
              <trans-pane :balance="balance[selectedAddress]"
                          :address="selectedAddress"
                          :cold-addresses="coldAddresses"></trans-pane>
            </div>
            <div class="f-records">
              <Records :address="selectedAddress"></Records>
            </div>
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
import { INITIAL_SESSION_TIMEOUT, TESTNET_NODE } from '@/constants.js'
import seedLib from '@/libs/seed.js'
import Records from './home/elements/Records'

export default {
    name: 'Home',
    data: function() {
        return {
            balance: {},
            selectedAddress: '',
            sessionClearTimeout: void 0,
            coldAddresses: {}
        }
    },

    created() {
        if (!this.address || !Vue.ls.get('pwd')) {
            this.$router.push('/login')
        } else {
            this.getBalance(this.address)
            this.setUsrLocalStorage('lastLogin', new Date().getTime())
            this.selectedAddress = this.address
            if (this.userInfo && this.userInfo.coldAddresses) {
                this.coldAddresses = JSON.parse(this.userInfo.coldAddresses)
            }
            for (const addr in this.coldAddresses) {
                this.getBalance(addr)
            }
        }
    },

    mounted() {
        console.log('mounted')
        this.setSessionClearTimeout()
    },
    updated() {
        console.log('updated')
        this.resetSessionClearTimeout()
    },
    beforeDestroy() {
        console.log('beforeDestroy')
        clearTimeout(this.sessionClearTimeout)
    },

    computed: {
        address() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
            // return '3P6N2EnapoRxazL7otmV3srTuJVcMW2MQWG'
        },
        pubKey() {
            if (this.secretInfo) {
                return this.secretInfo.pubKey
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
        wordList() {
            return this.seedPhrase.split(' ')
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
                console.log('clear sesson')
                Vue.ls.clear()
                this.$router.push('/login')
            }, oldTimeout)
        },

        resetSessionClearTimeout() {
            clearTimeout(this.sessionClearTimeout)
            this.setSessionClearTimeout()
        },

        getBalance: function(address) {
            const url = TESTNET_NODE + '/addresses/balance/' + address
            this.$http.get(url).then(response => {
                // for testing
                // if (this.coldAddresses[address] !== void 0) {
                //     Vue.set(this.balance, address, response.body['balance'] + 10)
                // } else {
                //     Vue.set(this.balance, address, response.body['balance'] + 50)
                // }
                Vue.set(this.balance, address, response.body['balance'])
            }, response => {
                Vue.set(this.balance, address, 0)
            })
        },
        importCold(coldAddress, pubKey) {
            Vue.set(this.coldAddresses, coldAddress, !pubKey ? '' : pubKey)
            this.getBalance(coldAddress)
            console.log(this.coldAddresses)
            this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
        },
        getSeedPhrase() {
            if (this.secretInfo) {
                return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
            }
        },
        getPriKey() {
            if (this.secretInfo) {
                return seedLib.fromExistingPhrase(this.getSeedPhrase()).keyPair.privateKey
            }
        },
        setUsrLocalStorage(feildname, value) {
            Vue.set(this.userInfo, feildname, value)
            window.localStorage.setItem(this.address, JSON.stringify(this.userInfo))
        },
        selectWallet(addr) {
            if (this.selectedAddress !== addr) {
                this.selectedAddress = addr
                this.getBalance(addr)
            }
        },
        deleteCold(addr) {
            Vue.delete(this.coldAddresses, addr)
            this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
        }
    },

    components: {
        ImportColdWallet,
        TransPane,
        NavBar,
        Asset,
        Records
    }
}
</script>
<style scoped lang="less">
@import '../assets/style/variables';
@import '../assets/style/common';
.home {
    width: 100%;
    height: 100%;
}
.trans-pane {
    height:@trxDivH;
    width: 100%;
}
.assets-pane {
    border-right: 1px solid rgb(238, 238, 238);
    text-align: left;
    width: @assetsPaneW;
    height: 100%;
    padding-left: 20px;
    padding-right: 20px;
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
    color: @veeColor;
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
    z-index:99999;
}
.title-assets {
    margin-left: 10px;
    font-size: 15px;
    font: Roboto-Regular;
}
.contents {
    padding-top: 64px;
    overflow: hidden;
}
.div-main {
    border-top: 1px solid rgb(232, 232, 236);
}
.f-records {
    height: -webkit-fill-available;
    padding-bottom: 150px;
}
</style>
