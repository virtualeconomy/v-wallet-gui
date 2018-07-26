<template>
  <div class="row justify-content-between height-full">
    <div class="col-auto align-self-center text-left tran-head">
      <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
           class="money-icon"
           width="30"
           height="30">
      <span class="title">
        {{ formatter(balance) }}
      </span>
      <p class="text-muted text-des mb-0">
        Available Balance
      </p>
    </div>
    <div class="col-auto align-self-center text-left">
      <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
           class="money-icon"
           width="16"
           height="16">
      <span class="sub-title">
        {{ formatter(total) }}
      </span>
      <p class="text-muted text-des mb-0">
        Total Balance
      </p>
    </div>
    <div class="col align-self-center text-right">
      <b-button variant="dark"
                class="btn-send"
                v-b-modal.sendModal>
        <img
          class="icon-btn"
          src="../../../assets/imgs/icons/wallet/ic_send.svg"><b>Send</b></b-button>
      <b-button variant="dark"
                class="btn-receive"
                v-b-modal.receiveModal>
        <img
          class="icon-btn"
          src="../../../assets/imgs/icons/wallet/ic_receive.svg"><b>Receive</b></b-button>
    </div>
    <Send show="false"
          :balances="balances"
          :cold-addresses="coldAddresses"
          :addresses="addresses"></Send>
    <Receive show="false"
             :address="address"></Receive>
  </div>
</template>

<script>
import Receive from '../modals/Receive'
import Send from '../modals/Send'
import browser from '../../../utils/browser'
export default {
    name: 'TransPane',
    components: {
        Receive,
        Send
    },
    props: {
        balance: {
            type: Number,
            default: 0,
            require: true
        },
        address: {
            type: String,
            default: ''
        },
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true
        },
        addresses: {
            type: Object,
            default: function() {},
            require: true
        },
        balances: {
            type: Object,
            default: function() {},
            require: true
        },
        total: {
            type: Number,
            default: 0,
            require: true
        }
    },
    methods: {
        formatter(num) {
            return browser.numberFormatter(num)
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
.btn-send {
    background-color: @sendColor;
    color: white;
    border: 1px solid @sendColor;
    width: 124px;
    height: 42px;
}
.btn-send:active, .btn-send:hover{
    background-color: #E03146 !important;
    border: 1px solid #E03146 !important;
};
.btn-receive {
    margin-left: 15px;
    background-color: @receiveColor;
    color: white;
    border: 1px solid @receiveColor;
    width: 124px;
    height: 42px;
}
.btn-receive:active, .btn-receive:hover {
    background-color: #1F8F7C !important;
    border: 1px solid #1F8F7C !important;
}
.tran-head {
    padding-left: 38px;
    border-right: 1px solid #EDEDED;
}
.money-icon {
    margin-top: -14px;
}
.icon-btn {
    margin-right: 10px;
}
</style>
