<template>
  <div class="text-left">
    <b-form-group label="Wallet Address"
                  label-for="address-input">
      <b-form-input id="address-input"
                    type="text"
                    :value="address"
                    class="addr-input"
                    readonly>
      </b-form-input>
      <b-btn
        block
        variant="light"
        disabled
        class="balance-input"
        readonly>
        <span class="balance-title">Balance</span>
        <span class="balance">{{ balances[address] }}</span>
      </b-btn>
    </b-form-group>
    <b-form-group label="Recipient"
                  label-for="recipient-input">
      <b-form-input id="recipient-input"
                    class="recipient-input"
                    type="text"
                    v-model="recipient"
                    :state="isValidRecipient(recipient)"
                    aria-describedby="inputLiveFeedBack"
                    placeholder="Paste or scan an address.">
      </b-form-input>
      <img src="../../../assets/imgs/icons/operate/ic_qr_code_line.svg"
           v-b-tooltip.hover
           class="qr-code"
           @click="scanChange"
           title="scan qr-code">
      <b-form-invalid-feedback id="inputLiveFeedback">
        Invalid recipient address.
      </b-form-invalid-feedback>
      <div v-if="scanShow">
        <div class="qr-info">Please confirm your browser's camera is available.</div>
        <div class="qr-window">
          <qrcode-reader @init="onInit"
                         @decode="onDecode"
                         :track="repaintLocation"
                         :paused="paused">
            <img v-if="qrInit"
                 class="qrcode-waiting center"
                 height="70"
                 width="70"
                 src="../../../assets/imgs/icons/wallet/ic_wait.svg">
          </qrcode-reader>
        </div>
        <div class="text-danger text-center"><small>{{ qrErrMsg }}</small></div>
      </div>
    </b-form-group>
    <b-form-group label="Amount"
                  label-for="amount-input">
      <b-form-input id="amount-input"
                    class="amount-input"
                    type="number"
                    v-model="amount"
                    aria-describedby="inputLiveFeedback"
                    min="0"
                    step="1e-8"
                    :state="isAmountValid('hot')"
                    onfocus="this.select()">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-if="isWrongFormat(amount)">
        The number in this field is invalid. It can include a maximum of 8 digits after the decimal point.
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else-if="isInsufficient(amount, 'hot')">
        Insufficient funds
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group
      class="fee-remark"
      label="Transaction Fee 0.001 VEE">
    </b-form-group>
    <b-button variant="warning"
              class="btn-continue"
              size="lg"
              block
              :disabled="isSubmitDisabled"
              @click="nextPage">Continue
    </b-button>
  </div>
</template>

<script>
import Vue from 'vue'
import { TX_FEE } from '@/constants'

export default {
    name: 'LeaseInput',
    data: function() {
        return {
            recipient: '',
            amount: 0,
            scanShow: false,
            qrInit: false,
            qrErrMsg: void 0,
            paused: false
        }
    },
    props: {
        balances: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    computed: {
        address() {
            return Vue.ls.get('address')
        }
    },
    methods: {
        isValidRecipient: function(recipient) {
            if (!recipient) {
                return void 0
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(recipient)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        scanChange: function() {
            if (!this.qrInit) {
                this.scanShow = !this.scanShow
            }
        },
        async onInit(promise) {
            try {
                this.qrInit = true
                this.qrErrMsg = void 0
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    throw Error('user denied camera access permission')
                } else if (error.name === 'NotFoundError') {
                    throw Error('no suitable camera device installed')
                } else if (error.name === 'NotSupportedError') {
                    throw Error('page is not served over HTTPS (or localhost)')
                } else if (error.name === 'NotReadableError') {
                    throw Error('maybe camera is already in use')
                } else if (error.name === 'OverconstarinedError') {
                    throw Error('pass constraints do not match any camera')
                } else {
                    throw Error('browser is probably lacking features(WebRTC, Canvas)')
                }
            } finally {
                this.qrInit = false
            }
        },
        onDecode: function(decodeString) {
            this.qrErrMsg = void 0
            this.paused = true
            this.recipient = this.getParmFromUrl('recipient', decodeString) || decodeString
            this.amount = this.getParmFromUrl('amount', decodeString)
            if (!this.isValidRecipient(this.recipient) || this.recipient === '') {
                this.paused = false
                this.qrErrMsg = 'Sorry, your QR code seems unavalible.'
            } else {
                this.scanShow = false
            }
        },
        isAmountValid(type) {
            var amount = type === 'hot' ? this.amount : this.coldAmount
            if (amount === 0) {
                return void 0
            }
            return !this.isWrongFormat(amount) && !this.isInsufficient(amount, type)
        },
        isWrongFormat(amount) {
            if (amount.toString().split('.')[1] && amount.toString().split('.')[1].length > 8) {
                return true
            } else {
                return false
            }
        },
        isInsufficient(amount, type) {
            var balance = type === 'hot' ? this.balances[this.address] : this.balances[this.coldAddress]
            return amount > balance - TX_FEE
        },
        isSubmitDisabled() {
            return !(this.recipient && this.amount > 0 && this.isValidRecipient(this.recipient) && this.isAmountValid('hot'))
        },
        nextPage() {
            this.$emit('getData', this.a)
        }

    }
}
</script>

<style scoped>
.addr-input {
    border: 1px solid #E8E9ED;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
    background-color: #FFF;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    height: 48px !important;
}
.balance-title {
    float: left;
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
}
.balance {
    float: right;
    font-size: 15px;
    color: #FF8737;
    letter-spacing: 0;
    text-align: right;
}
.balance-input {
    border: 1px solid #E8E9ED;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    opacity: 1;
    background-color: #FAFAFA;
    height: 37px;
}
.qr-code {
    width: 26px;
    cursor: pointer;
    float: right;
    margin-top: -37px;
    margin-right: 10px;
}
.qr-info {
    text-align: left;
    color: #9091a3;
}
.qr-window {
    padding: 0 100px;
}
.qrcode-waiting {
    vertical-align: middle;
    display: flex;
    margin-right: auto;
    margin-left: auto;
    margin-top: 20px;
}
.recipient-input {
    height: 48px;
}
.fee-remark {
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
}
</style>
