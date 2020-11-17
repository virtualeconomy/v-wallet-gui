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
      <div>
        <b-dropdown v-if="advancedFunctionsStatus"
                    no-caret
                    text="Advanced Functionalities"
                    variant="link">
          <b-dropdown-item @click="depositVsys">Deposit to Contract </b-dropdown-item>
          <b-dropdown-item @click="withdrawVsys">Withdraw from Contract</b-dropdown-item>
        </b-dropdown>
      </div>
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
    <WithdrawOrDepositToken :token-id="tokenId"
                            :address="address"
                            :wallet-type="walletType"
                            :addresses="addresses"
                            :cold-addresses="coldAddresses"
                            :token-balance="balances[address]"
                            :balance="balances[address]"
                            :function-name="functionName"
                            :token-unity="tokenUnity">
    </WithdrawOrDepositToken>
  </div>
</template>

<script>
import CreateToken from '../modals/CreateToken'
import Receive from '../modals/Receive'
import Send from '../modals/Send'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import { mapState } from 'vuex'
import { NETWORK_BYTE } from '@/network'
import { SYSTEM_CONTRACT_TOKEN_ID_TEST, SYSTEM_CONTRACT_TOKEN_ID } from '@/js-v-sdk/src/contract'
import WithdrawOrDepositToken from './WithdrawOrDepositToken'
export default {
    name: 'TokenPane',
    components: {
        CreateToken, Receive, WithdrawOrDepositToken, Send
    },
    data() {
        return {
            inheritedAmount: '',
            inheritedRecipient: '',
            inheritedDescription: '',
            functionName: '',
            tokenUnity: BigNumber(1e8),
            isMobile: false,
            tokenId: ''
        }
    },
    created() {
        if (this.from3rdParty) {
            this.inheritedDescription = this.paymentRedirect.hasOwnProperty('invoice') ? this.paymentRedirect['invoice'] : this.inheritedDescription
            this.inheritedAmount = this.paymentRedirect.hasOwnProperty('amount') ? this.paymentRedirect['amount'] : this.inheritedAmount
            this.inheritedRecipient = this.paymentRedirect.hasOwnProperty('recipient') ? this.paymentRedirect['recipient'] : this.inheritedRecipient
        }
        this.tokenId = String.fromCharCode(NETWORK_BYTE) === 'T' ? SYSTEM_CONTRACT_TOKEN_ID_TEST : SYSTEM_CONTRACT_TOKEN_ID
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
            advancedFunctionsStatus: 'advancedFunctionsStatus',
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
        withdrawVsys() {
            if (this.getDevice === 'Ledger') {
                alert('This feature is not supported')
            } else {
                this.functionName = 'Withdraw'
                this.$root.$emit('bv::show::modal', 'withdrawOrDepositTokenModal_' + this.tokenId)
            }
        },
        depositVsys() {
            if (this.getDevice === 'Ledger') {
                alert('This feature is not supported')
            } else {
                this.functionName = 'Deposit'
                this.$root.$emit('bv::show::modal', 'withdrawOrDepositTokenModal_' + this.tokenId)
            }
        },
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
.add-button {
    background-color: transparent;
    opacity: 1;
    border: none;
    outline: none;
    font-family: Roboto-Bold;
    font-size: 15px;
    color: #FF8837;
    letter-spacing: 0;
    text-align: right;
    line-height: 15px;
    padding-left: 2px;
    padding-right: 2px;
}
</style>
