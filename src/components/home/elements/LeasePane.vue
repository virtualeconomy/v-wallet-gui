<template>
  <div class="row justify-content-between height-full">
    <div class="col-auto align-self-center text-left tran-head">
      <span class="title">
        {{ total }} VEE
      </span>
      <p class="text-muted text-des mb-0">
        Balance
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <span class="sub-title">
        {{ available }} VEE
      </span>
      <p class="text-muted text-des mb-0">
        Available
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <span class="sub-title">
        {{ leasedIn }} VEE
      </span>
      <p class="text-muted text-des mb-0">
        Leased In
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <span class="sub-title">
        {{ leasedOut }} VEE
      </span>
      <p class="text-muted text-des mb-0">
        Leased Out
      </p>
    </div>
    <div class="col align-self-center text-right">
      <b-button variant="dark"
                class="btn-leasing"
                v-b-modal.leaseModal>
        <b>Start Leasing</b>
      </b-button>
      <b-button variant="dark"
                class="btn-help">
        <img src="../../../assets/imgs/icons/wallet/ic_help.svg">
      </b-button>
    </div>
    <Lease show="false"
           :balances="balance"
           :cold-addresses="coldAddresses"></Lease>
  </div>
</template>

<script>
import Lease from '../modals/Lease'
import { TESTNET_NODE } from '@/constants.js'
import Vue from 'vue'

export default {
    name: 'LeasePane',
    components: {
        Lease
    },
    data() {
        return {
            balance: {},
            available: 0,
            leasedIn: 0,
            leasedOut: 0,
            total: 0
        }
    },
    created() {
        if (this.address) {
            this.getBalanceDetail(this.address)
        }
    },
    props: {
        address: {
            type: String,
            default: '',
            require: true
        },
        coldAddresses: {
            type: Object,
            default: function() {}
        }
    },
    methods: {
        getBalanceDetail: function(address) {
            const url = TESTNET_NODE + '/addresses/balance/details/' + address
            this.$http.get(url).then(response => {
                Vue.set(this.balance, address, response.body)
                this.balance = response.body
                this.total = this.balance.regular
                this.available = this.balance.available
                this.leasedOut = this.balance.regular - this.balance.available
                this.leasedIn = this.balance.effective - this.balance.available
            }, response => {
                Vue.set(this.balance, address, 0)
            })
        }
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/style/common';
@import '../../../assets/style/variables';
.height-full {
    height: 100%;
}
.title {
    font-size: 200%;
    line-height: 120%;
}
.tran-head {
    padding-left: 38px;
    border-right: 1px solid #EDEDED;
}
.btn-leasing {
    background: #FF8737;
    border-radius: 4px;
    border: 1px solid #FF8737;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    width: 144px;
    height: 42px;
}
.btn-leasing:active, .btn-leasing:hover {
    background-color: #EB7D34 !important;
    border: 1px solid #EB7D34 !important;
}
.btn-help {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    height: 44px;
    margin-left: 8px;
}
.btn-help:active, .btn-help:hover {
    background-color: #E8E9ED !important;
    border: 1px solid #E8E9ED !important;
}
</style>
