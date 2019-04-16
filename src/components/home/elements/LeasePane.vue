<template>
  <div class="row justify-content-between height-full">
    <div class="col-auto align-self-center text-left tran-head">
      <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
           class="money-icon"
           width="30"
           height="30">
      <span class="title">
        {{ formatter(available) }}
      </span>
      <p class="text-muted text-des mb-0">
        Available Balance
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
           width="16"
           height="16">
      <span class="sub-title">
        {{ formatter(total) }}
      </span>
      <p class="text-muted text-des mb-0">
        Total Balance
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
           width="16"
           height="16">
      <span class="sub-title">
        {{ formatter(leasedIn) }}
      </span>
      <p class="text-muted text-des mb-0">
        Leased In
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
           width="16"
           height="16">
      <span class="sub-title">
        {{ formatter(leasedOut) }}
      </span>
      <p class="text-muted text-des mb-0">
        Leased Out
      </p>
    </div>
    <div class="col align-self-center text-right">
      <b-button class="btn-list"
                @click="redirectToVsysrate()">
        <b>List of nodes</b>
      </b-button>
      <b-button variant="dark"
                class="btn-leasing"
                v-b-modal.leaseModal>
        <b>Start Leasing</b>
      </b-button>
      <b-button variant="dark"
                id="leaseHelp"
                class="btn-help">
        <img src="../../../assets/imgs/icons/wallet/ic_help.svg">
      </b-button>
    </div>
    <b-popover target="leaseHelp"
               placement="bottom"
               title="Quick note"
               triggers="click blur">
      <div class="quick-note">
        <div>
          <span>You can only transfer or trade VSYSs that aren’t leased. The leased amount cannot be transferred or traded by you or anyone else.</span>
        </div>
        <div class="description-split"></div>
        <div>
          <div class="quick-icon">
            <img src="../../../assets/imgs/icons/wallet/ic_leasing_cancel.svg"
                 width="40"
                 height="40">
          </div>
          <span>You can cancel a leasing transaction as soon as it appears in the blockchain which usually occurs in a minute or less.</span>
        </div>
        <div class="description-split"></div>
        <div><a href="http://vsysrate.com"
                target="_blank" >List of nodes</a><span> You can lease your coins to supernode to get lease rewards</span></div>
      </div>
    </b-popover>
    <Lease show="false"
           :balances="balance"
           :cold-addresses="coldAddresses"
           :addresses="addresses"
           :selected-address="address"
           :selected-wallet-type="walletType"
           @endLeaseSignal="endLeaseSignal"></Lease>
  </div>
</template>

<script>
import Lease from '../modals/Lease'
import browser from '../../../utils/browser'
import BigNumber from 'bignumber.js'

export default {
    name: 'LeasePane',
    components: {
        Lease
    },
    props: {
        addresses: {
            type: Object,
            default: function() {},
            require: true
        },
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true
        },
        balance: {
            type: Object,
            default: function() {},
            require: true
        },
        available: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        leasedIn: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        leasedOut: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        total: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        address: {
            type: String,
            default: '',
            require: true
        },
        walletType: {
            type: String,
            default: '',
            require: true
        }
    },
    methods: {
        redirectToVsysrate() {
            window.open('http://vsysrate.com')
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        endLeaseSignal() {
            this.$emit('updateInfo')
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
.money-icon {
    margin-top: -14px;
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
    margin-left: 8px;
}
.btn-leasing:active, .btn-leasing:hover {
    background-color: #EB7D34 !important;
    border: 1px solid #EB7D34 !important;
}
.btn-list{
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E8E9ED;
    font-size: 17px;
    color: #FF8737;
    letter-spacing: 0;
    width: 144px;
    height: 42px;
}
.btn-list:active, .btn-leasing:hover {
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
.description-split {
    margin: 10px 0;
    height: 0;
    border-bottom: 1px dashed #e2e2e2;
}
.quick-icon {
    float: left;
    margin: auto 10px;
}
.quick-note {
    color: #9ba6b2;
    font-size: 13px;
    line-height: 18px;
}
</style>
