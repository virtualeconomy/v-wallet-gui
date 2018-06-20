<template>
  <div class="home">
    <div class="nav">
      <nav-bar></nav-bar>
    </div>
    <div class="trans-pane">
      <trans-pane></trans-pane>
    </div>
    <div class="assets-pane">
      <div>
        <div v-for="asset in assets"
             :key="asset.address">
          <Asset :title="asset.title"
                 :address="asset.address"
                 :balance="asset.balance">
          </Asset>
        </div>
        <b-btn @click="$root.$emit('bv::show::modal', 'importModal', $event.target)"
               variant="primary">Import Cold Wallet</b-btn>
        <ImportColdWallet :cold-address="coldAddress"
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
import { INITIAL_SESSION_TIMEOUT } from '@/constants.js'

export default {
    name: 'Home',
    components: {
        ImportColdWallet,
        TransPane,
        NavBar,
        Asset
    },
    mounted() {
        setTimeout(() => {
            Vue.ls.clear()
        }, window.localStorage.getItem(this.assets.address ? this.assets.address : INITIAL_SESSION_TIMEOUT))
    },
    data: function() {
        return {
            assets: [
                {
                    title: 'Asset',
                    address: Vue.ls.get('address'),
                    balance: '0vee'
                }
            ],
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
            pageOptions: [ 5, 10, 15 ],
            coldAddress: ''
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
