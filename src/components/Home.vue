<template>
  <div class="home">
    <div class="nav">
      <nav-bar :address="address"
               :cold-address="coldAddress"
               :pub-key="pubKey"
               :pri-key="priKey"
               :seed-phrase="seedPhrase"></nav-bar>
    </div>
    <div class="trans-pane">
      <trans-pane></trans-pane>
    </div>
    <div class="assets-pane">
      <div>
        <div>
          <Asset :address="address"
                 :balance="this.balance.address">
          </Asset>
          <Asset v-if="coldAddress"
                 :address="coldAddress"
                 :balance="this.balance.coldAddress">
          </Asset>
        </div>
        <b-btn @click="$root.$emit('bv::show::modal', 'importModal', 'importModal')"
               variant="primary">Import Cold Wallet</b-btn>
        <ImportColdWallet :hot-address="address"
                          @import-cold="importCold"
                          show="false"></ImportColdWallet>
      </div>
    </div>
    <div class="records-pane">
      <h3>Transaction Records</h3>
      <div>
        <b-table show-empty
                 stacked="md"
                 :items="items"
                 :fields="fields"
                 :current-page="currentPage"
                 :per-page="perPage">
        </b-table>
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
        if (!this.address) {
            this.$router.push('/login')
        }
        this.getBalance(this.address)
        console.log(this.address)
    },
    mounted() {
        let oldTimeout = INITIAL_SESSION_TIMEOUT
        try {
            oldTimeout = JSON.parse(window.localStorage.getItem(this.address)).sesstionTimeout
        } catch (e) {
            oldTimeout = INITIAL_SESSION_TIMEOUT
        }
        setTimeout(() => {
            console.log('clear')
            Vue.ls.clear()
        }, oldTimeout)
    },
    computed: {
        address() {
            return Vue.ls.get('address')
        },
        pubKey() {
            return this.secretInfo.pubKey
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
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
        getBalance(address) {
            const url = TESTNET_NODE + '/assets/balance/' + address

            this.$http.get(url).then(response => {
                this.balance[address] = response.body.balances['VEE'] ? response.body.balances['VEE'] + ' VEE' : '0 VEE'
            }, response => {
                console.log(response)
            })
        },
        importCold(coldAddress) {
            console.log('cold address' + coldAddress)
            this.coldAddress = coldAddress
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        priKey() {
            return seedLib.fromExistingPhrase(this.seedPhrase()).keyPair.privateKey
        }
    },
    data: function() {
        return {
            balance: [],
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
