<template>
  <div class="row justify-content-between height-full">
    <div class="col-auto align-self-center text-left tran-head">
      <img src="@/assets/imgs/icons/wallet/Symbol_Yellow.svg"
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
      <img src="@/assets/imgs/icons/wallet/Symbol_Yellow.svg"
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
      <b-button variant="white"
                class="btn-creat"
                @click="createToken">
        <img v-if="!isMobile"
             class="icon-btn"
             src="@/assets/imgs/icons/wallet/ic_new_token_yellow.svg"><b>Create Token</b></b-button>
      <b-button variant="dark"
                class="btn-send"
                v-b-modal.sendModal>
        <img v-if="!isMobile"
             class="icon-btn"
             src="@/assets/imgs/icons/wallet/ic_send.svg"><b>Send</b></b-button>
      <b-button variant="dark"
                class="btn-receive"
                v-b-modal.receiveModal>
        <img v-if="!isMobile"
             class="icon-btn"
             src="@/assets/imgs/icons/wallet/ic_receive.svg"><b> {{ !isMobile ? 'Receive':'Recv' }} </b></b-button>
    </div>
    <Send :balances="balances"
          :inherited-amount="inheritedAmount"
          :inherited-description="inheritedDescription"
          :inherited-recipient="inheritedRecipient"
          :from3rd-party="from3rdParty"
          :cold-addresses="coldAddresses"
          :addresses="addresses"
          :selected-address="address"
          :wallet-type="walletType"></Send>
    <Receive show="false"
             :address="address"></Receive>
    <CreateToken show="false"
                 :balances="balances"
                 :cold-addresses="coldAddresses"
                 :addresses="addresses"
                 :selected-address="address"
                 :wallet-type="walletType"></CreateToken>
  </div>
</template>

<script>
import CreateToken from '../modals/CreateToken'
import Receive from '../modals/Receive'
import Send from '../modals/Send'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import { mapState } from 'vuex'

export default {
    name: 'TokenPane',
    components: {
        CreateToken, Receive, Send
    },
    data() {
        return {
            inheritedAmount: '',
            inheritedRecipient: '',
            inheritedDescription: '',
            isMobile: false
        }
    },
    created() {
        if (this.from3rdParty) {
            if (this.paymentRedirect.hasOwnProperty('invoice')) {
                this.inheritedDescription = this.paymentRedirect['invoice']
            }
            this.inheritedAmount = this.paymentRedirect['amount']
            this.inheritedRecipient = this.paymentRedirect['recipient']
        }
        this.isMobile = browser.isMobile()
    },
    mounted() {
        if (this.from3rdParty) {
            this.$root.$emit('bv::show::modal', 'sendModal')
        }
    },
    computed: {
        ...mapState({
            paymentRedirect: 'paymentRedirect',
            available: 'available',
            total: 'total'
        }),
        getDevice() {
            if (this.coldAddresses && this.coldAddresses[this.address] && this.coldAddresses[this.address].hasOwnProperty('device')) {
                return this.coldAddresses[this.address].device
            }
            return ''
        },
        from3rdParty() {
            return JSON.stringify(this.paymentRedirect) !== '{}' && this.$route.query.hasOwnProperty('redirect') && !this.paymentRedirect.hasOwnProperty('token')
        }
    },
    props: {
        balance: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
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
        walletType: {
            type: String,
            default: 'hotWallet',
            require: true
        }
    },
    methods: {
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        createToken() {
            if (this.getDevice === 'Ledger') {
                alert('This feature is not supported')
            } else {
                this.$root.$emit('bv::show::modal', 'createTokenModal', '#btnShow')
            }
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
.btn-send:active, .btn-send:hover{
    background-color: #E03146 !important;
    border: 1px solid #E03146 !important;
};
.btn-receive {
    margin-bottom: 6px;
    margin-left: 15px;
    background-color: @receiveColor;
    color: white;
    border: 1px solid @receiveColor;
    width: 150px;
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
.btn-creat {
    margin-bottom: 6px;
    border-color: #FF8837;
    color: #FF8837;
    margin-right: 15px;
    font-size: 17px;
    font-weight:lighter;
    height: 42px;
}
.btn-send {
    margin-bottom: 6px;
    background-color: @sendColor;
    color: white;
    border: 1px solid @sendColor;
    width: 124px;
    height: 42px;
}
</style>
