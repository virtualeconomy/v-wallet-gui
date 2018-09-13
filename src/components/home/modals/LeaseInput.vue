<template>
  <b-container class="text-left">
    <b-form-group label="Wallet Address"
                  label-for="address-input">
      <b-form-select v-if="walletType==='hot'"
                     id="address-input"
                     class="addr-input"
                     v-model="address"
                     :options="options(addresses)">
      </b-form-select>
      <b-form-select v-else-if="walletType==='cold'"
                     id="address-input"
                     class="addr-input"
                     v-model="coldAddress"
                     :options="options(coldAddresses)">
      </b-form-select>
      <b-btn
        block
        variant="light"
        disabled
        class="balance-input"
        readonly>
        <span class="balance-title">
          <img src="../../../assets/imgs/icons/wallet/Symbol_Yellow.svg"
               width="20"
               height="20">
        </span>
        <span class="balance">{{ walletType === 'hot' ? balances[address] : balances[coldAddress] }} VEE</span>
      </b-btn>
    </b-form-group>
    <b-form-group label="Recipient"
                  :label-for="'recipient-input' + walletType">
      <b-form-input :id="'lease-recipient-input' + walletType"
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
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-if="isSameWithSender">
        Recipient should not be the same as the sender address.
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else>
        Invalid recipient address.
      </b-form-invalid-feedback>
      <div v-if="scanShow">
        <div class="qr-info">Please confirm your browser's camera is available.</div>
        <div class="qr-window">
          <qrcode-reader @init="onInit"
                         @decode="onDecode"
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
                  :abel-for="'amount-input' + walletType">
      <b-form-input :id="'amount-input' + walletType"
                    class="amount-input"
                    v-model="amount"
                    aria-describedby="inputLiveFeedback"
                    :state="isAmountValid(walletType)"
                    onfocus="this.select()">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-if="isWrongFormat(amount)">
        The number in this field is invalid. It can include a maximum of 8 digits after the decimal point.
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else-if="isInsufficient(amount, walletType)">
        Insufficient funds
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <label class="fee-remark">Transaction Fee {{ fee }} VEE</label>
    </b-form-group>
    <b-button variant="warning"
              class="btn-continue"
              size="lg"
              block
              :disabled="isSubmitDisabled"
              @click="nextPage">Continue
    </b-button>
  </b-container>
</template>

<script>
import { TX_FEE } from '@/constants'
import crypto from '@/utils/crypto'

export default {
    name: 'LeaseInput',
    data: function() {
        return {
            recipient: '',
            amount: 0,
            scanShow: false,
            qrInit: false,
            qrErrMsg: void 0,
            paused: false,
            address: this.selectedWalletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress,
            coldAddress: this.selectedWalletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress,
            fee: TX_FEE
        }
    },
    props: {
        balances: {
            type: Object,
            default: function() {},
            require: true
        },
        walletType: {
            type: String,
            default: '',
            require: true
        },
        coldAddresses: {
            type: Object,
            default: function() {}
        },
        addresses: {
            type: Object,
            default: function() {}
        },
        defaultAddress: {
            type: String,
            default: ''
        },
        defaultColdAddress: {
            type: String,
            default: ''
        },
        selectedAddress: {
            type: String,
            default: '',
            require: true
        },
        selectedWalletType: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        isSubmitDisabled() {
            return !(this.recipient && this.amount > 0 && this.isValidRecipient(this.recipient) && this.isAmountValid(this.walletType))
        },
        isSameWithSender() {
            var thisAddr = this.walletType === 'hot' ? this.address : this.coldAddress
            return thisAddr === this.recipient
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
            return isValid && !this.isSameWithSender
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
            this.recipient = this.getParmFromUrl('recipient', decodeString) || this.getParmFromUrl('address', decodeString) || decodeString
            this.amount = this.getParmFromUrl('amount', decodeString)
            if (!this.isValidRecipient(this.recipient) || this.recipient === '') {
                this.paused = false
                this.qrErrMsg = 'Sorry, your QR code seems unavalible.'
            }
        },
        getParmFromUrl: function(key, url) {
            var regex = new RegExp(key + '=([^&]*)', 'i')
            if (url.match(regex)) {
                return url.match(regex)[1]
            } else {
                if (key === 'recipient') {
                    return ''
                } else if (key === 'amount') {
                    return 0
                }
            }
        },
        isAmountValid(type) {
            var amount = this.amount
            if (Number(amount) === 0) {
                return void 0
            }
            return !isNaN(Number(amount)) && !this.isWrongFormat(amount) && !this.isInsufficient(amount, type)
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
        nextPage() {
            if (this.walletType === 'hot') {
                this.$emit('get-data', this.recipient, this.amount, this.address)
            } else if (this.walletType === 'cold') {
                this.$emit('get-cold-data', this.recipient, this.amount, this.coldAddress)
            }
        },
        options(addrs) {
            var res = Object.keys(addrs).reduce((options, addr) => {
                options.push({ value: addr, text: addr })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a wallet address</span>', disabled: true }])
            return res
        },
        resetData() {
            this.recipient = ''
            this.amount = 0
            this.scanShow = false
            this.qrInit = false
            this.qrErrMsg = void 0
            this.paused = false
            this.address = this.selectedWalletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.selectedWalletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
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
    border: 1px solid #E8E9ED !important;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    opacity: 1;
    background-color: #FAFAFA;
    height: 37px;
}
.qr-code {
    width: 26px;
    cursor: pointer;
    position: absolute;
    margin-top: -37px;
    margin-left: 380px;
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
