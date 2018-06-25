<template>
  <div class="home">
    <div class="nav">
      <nav-bar></nav-bar>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto">
          <div>
            <div>
              <Asset v-if="address"
                     :address="address"
                     :balance="balance[address]">
              </Asset>
              <Asset v-if="coldAddress"
                     :address="coldAddress"
                     :balance="balance[coldAddress]">
              </Asset>
            </div>
            <b-btn @click="$root.$emit('bv::show::modal', 'importModal', 'importModal')"
                   variant="primary">Import Cold Wallet</b-btn>
            <ImportColdWallet @import-cold="importCold"
                              show="false"></ImportColdWallet>
          </div>
        </div>
        <div class="col container">
          <b-jumbotron
            class="col"
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
          </b-jumbotron>
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
    components: {
        ImportColdWallet,
        TransPane,
        NavBar,
        Asset
    },
    created() {
        if (!this.address || !Vue.ls.get('pwd')) {
            this.$router.push('/login')
        } else {
            this.getBalance(this.address)
        }
    },
    mounted() {
        setTimeout(() => {
            Vue.ls.clear()
        }, window.localStorage.getItem(this.address ? this.address : INITIAL_SESSION_TIMEOUT))
    },
    computed: {
        address() {
            return Vue.ls.get('address')
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        wordList() {
            return this.seedPhrase.split(' ')
        },
        buttonTimeStr() {
            if (this.timeLeft > 0) {
                return '(' + this.timeLeft + 's)'
            }
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
        importCold: function(coldAddress) {
            console.log('cold address' + coldAddress)
            this.coldAddress = coldAddress
            this.getBalance(coldAddress)
        }
    },
    data: function() {
        return {
            balance: {},
            coldAddress: '',
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
.nav {
    width: 100%;
    height: @topNavH;
    background-color: @navBgColor;
}
.trans-pane {
    height:@trxDivH;
    width: 100%;
    border-bottom: solid 1px;
    margin-bottom: 10px;
}
.assets-pane {
    float: left;
    border-right: 1px solid @bdBgColor;
    text-align: left;
    width: @assetsPaneW;
    height: 100%;
    .asset {
        padding-left: 20px;
        margin-top: 16px;
    }
    button {
        width: @btnWMid * 3;
        height: @btnHMid;
        margin-top: 12px;
    }
}
.records-pane {
    border-left: 1px solid @bdBgColor;
    text-align: left;
    div {
        display: inline-block;
    }
}

</style>
