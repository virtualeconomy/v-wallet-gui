<template>
  <div class="home">
    <nav-bar :address="address"
             :cold-addresses="coldAddresses"
             :pub-key="pubKey"
             :username="username"
             :avt-hash="avtHash"
             :get-pri-key="getPriKey"
             :get-seed-phrase="getSeedPhrase"></nav-bar>
    <div class="container-fluid height-full">
      <div class="row height-full">
        <div class="col-auto assets-pane height-full">
          <div class="asset-title">
            <b>Assets</b>
          </div>
          <Asset v-if="address"
                 :address="address"
                 :balance="balance[address]"
                 :selected="address === selectedAddress"
                 class="pointer unselectable"
                 @click.native="selectWallet(address)">
          </Asset>
          <div class="asset-title">
            <b>Cold Wallet</b>
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
                 class="btn-import-cold"><b>Import Cold Wallet</b></b-btn>
          <ImportColdWallet @import-cold="importCold"
                            show="false"></ImportColdWallet>
        </div>
        <div class="col page container">
          <div
            class=""
            bg-variant="white"
            border-variant="primary">
            <div class="trans-pane">
              <trans-pane></trans-pane>
            </div>
            <h3>Transaction Records</h3>
            <div>
              <b-table show-empty
                       stacked="md"
                       :items="items"
                       :fields="fields"
                       :current-page="currentPage"
                       striped="striped"
                       outlined="outlined"
                       :per-page="perPage">
              </b-table>
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

export default {
    name: 'Home',

    data: function() {
        return {
            balance: {},
            selectedAddress: '',
            items: items,
            fields: [
                {
                    key: 'type',
                    label: 'Transaction Type'
                },
                {
                    key: 'title',
                    label: 'Transaction Title'
                },
                {
                    key: 'amount',
                    label: 'Transaction Amount'
                },
                {
                    key: 'action',
                    label: 'action'
                }
            ],
            currentPage: 1,
            perPage: 5,
            totalRows: items.length,
            pageOptions: [ 5, 10, 15 ]
        }
    },

    created() {
        if (!this.address || !Vue.ls.get('pwd')) {
            this.$router.push('/login')
        } else {
            this.getBalance(this.address)
            this.setUsrLocalStorage('lastLogin', new Date().getTime())
            this.selectedAddress = this.address
            for (const addr in this.coldAddresses) {
                this.getBalance(addr)
            }
        }
    },

    mounted() {
        let oldTimeout = INITIAL_SESSION_TIMEOUT
        try {
            oldTimeout = JSON.parse(window.localStorage.getItem(this.address)).sesstionTimeout
        } catch (e) {
            oldTimeout = INITIAL_SESSION_TIMEOUT
        }
        setTimeout(() => {
            console.log('clear sesson')
            Vue.ls.clear()
        }, oldTimeout)
    },

    computed: {
        address() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
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
        coldAddresses() {
            if (this.userInfo && this.userInfo.coldAddresses) {
                return JSON.parse(this.userInfo.coldAddresses)
            }
            return {}
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

        getBalance: function(address) {
            const url = TESTNET_NODE + '/addresses/balance/' + address
            this.$http.get(url).then(response => {
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
        }
    },

    components: {
        ImportColdWallet,
        TransPane,
        NavBar,
        Asset
    }
}
const items = [
    {
        type: 'receive',
        title: 'receive',
        detail: 'from address xxxxxxx',
        amount: '-0.11vee'
    },
    {
        type: 'send',
        title: 'send',
        detail: 'to address yyyyyyy',
        amount: '+0.11vee'
    }
]
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
    border-bottom: solid 1px;
    margin-bottom: 10px;
}
.assets-pane {
    border-right: 1px solid rgb(238, 238, 238);
    text-align: left;
    width: @assetsPaneW;
    height: 100%;
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
   height: 100%;
}
.page {
    background-color: rgb(250, 250, 250);
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
</style>
