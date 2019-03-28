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
        <span class="balance">{{ formatter(walletType === 'hot' ? balances[address] : balances[coldAddress]) }} VSYS</span>
      </b-btn>
    </b-form-group>
    <b-form-group label="Recipient"
                  :label-for="'recipient-input' + walletType">
      <b-form-input v-if="walletType==='hot'"
                    :id="'lease-recipient-input' + walletType"
                    class="recipient-input"
                    type="text"
                    v-model="recipient"
                    :state="isValidRecipient(recipient)"
                    list="showHotRecipientList"
                    aria-describedby="inputLiveFeedBack"
                    placeholder="Paste or scan an address.">
      </b-form-input>
      <b-form-input v-else-if="walletType==='cold'"
                    :id="'lease-recipient-input' + walletType"
                    class="recipient-input"
                    type="text"
                    v-model="recipient"
                    :state="isValidRecipient(recipient)"
                    list="showColdRecipientList"
                    aria-describedby="inputLiveFeedBack"
                    placeholder="Paste or scan an address.">
      </b-form-input>
      <datalist id="showHotRecipientList">
        <option v-for="addr in hotRecipientAddressList.keys()"
                :key="addr">{{ addr }}</option>
      </datalist>
      <datalist id="showColdRecipientList">
        <option v-for="addr in coldRecipientAddressList.keys()"
                :key="addr">{{ addr }}</option>
      </datalist>
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
        Invalid recipient address (if using QR code scanner, make sure QR code is correct).
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
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else-if="isNegative(amount)">
        Negative number is not allowed.
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else>
        Invalid Input.
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group>
      <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
    </b-form-group>
    <b-button variant="warning"
              class="btn-continue"
              size="lg"
              block
              :disabled="isSubmitDisabled"
              @click="nextPage(); addRecipientList()">Continue
    </b-button>
  </b-container>
</template>

<script>
import { TX_FEE, VSYS_PRECISION, PROTOCOL, API_VERSION, OPC_ACCOUNT } from '@/constants'
import crypto from '@/utils/crypto'
import browser from '../../../utils/browser'
import LRUCache from 'lru-cache'
import BigNumber from 'bignumber.js'

export default {
    name: 'LeaseInput',
    data: function() {
        return {
            recipient: '',
            amount: BigNumber(0),
            scanShow: false,
            qrInit: false,
            qrErrMsg: void 0,
            paused: false,
            address: this.selectedWalletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress,
            coldAddress: this.selectedWalletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress,
            fee: BigNumber(TX_FEE),
            hotRecipientAddressList: {},
            coldRecipientAddressList: {}
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
    created() {
        this.hotRecipientAddressList = new LRUCache(10)
        this.coldRecipientAddressList = new LRUCache(10)
        let item = window.localStorage.getItem('Hot ' + this.defaultAddress + ' leaseRecipientAddressList ')
        if (item) {
            this.hotRecipientAddressList.load(JSON.parse(item))
        }
        item = window.localStorage.getItem('Cold ' + this.defaultColdAddress + ' leaseRecipientAddressList ')
        if (item) {
            this.coldRecipientAddressList.load(JSON.parse(item))
        }
    },
    computed: {
        isSubmitDisabled() {
            return !(this.recipient && BigNumber(this.amount) > 0 && this.isValidRecipient(this.recipient) && this.isAmountValid(this.walletType))
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
            if (this.scanShow) {
                this.paused = false
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
            try {
                var jsonObj = JSON.parse(decodeString.replace(/"amount":(\d+)/g, '"amount":"$1"')) // The protocol defined amount must use Long type. However, there is no Long type in JS. So we use BigNumber instead. Add quotes (") to amount field to ensure BigNumber parses amount without precision loss.
                this.recipient = jsonObj.address
                var opc = jsonObj.opc
                var api = jsonObj.api
                var protocol = jsonObj.protocol
                if (jsonObj.hasOwnProperty('amount')) {
                    this.amount = BigNumber(jsonObj.amount).dividedBy(VSYS_PRECISION).decimalPlaces(8)
                }
                if (protocol !== PROTOCOL) {
                    this.paused = false
                    this.qrErrMsg = 'Invalid QR code protocol.'
                } else if (api > API_VERSION) {
                    this.paused = false
                    this.qrErrMsg = 'API version mismatch.'
                } else if (opc !== OPC_ACCOUNT) {
                    this.paused = false
                    this.qrErrMsg = 'Wrong operation code in QR code.'
                } else if (!this.isValidRecipient(this.recipient) || this.recipient === '') {
                    this.paused = false
                    this.qrErrMsg = 'Invalid recipient address in QR code.'
                }
            } catch (e) {
                if (this.isValidRecipient(decodeString)) {
                    this.recipient = decodeString
                } else {
                    this.paused = false
                    this.recipient = 'please scan QR code of recipient'
                }
            }
        },
        isAmountValid(type) {
            var amount = this.amount
            if (BigNumber(amount).isEqualTo(0)) {
                return void 0
            }
            return !BigNumber(amount).isNaN() && !this.isWrongFormat(amount) && !this.isInsufficient(amount, type) && !this.isNegative(amount)
        },
        isWrongFormat(amount) {
            if ((amount.toString().split('.')[1] && amount.toString().split('.')[1].length > 8) || /[eE]/.test(amount.toString())) {
                return true
            } else {
                return false
            }
        },
        isInsufficient(amount, type) {
            var balance = type === 'hot' ? this.balances[this.address] : this.balances[this.coldAddress]
            return BigNumber(amount).isGreaterThan(BigNumber(balance).minus(TX_FEE))
        },
        isNegative(amount) {
            return BigNumber(amount).isLessThan(0)
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
                options.push({value: addr, text: addr})
                return options
            }, [{value: '', text: '<span class="text-muted">Please select a wallet address</span>', disabled: true}])
            return res
        },
        resetData() {
            this.recipient = ''
            this.amount = BigNumber(0)
            this.scanShow = false
            this.qrInit = false
            this.qrErrMsg = void 0
            this.paused = false
            this.address = this.selectedWalletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.selectedWalletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        addRecipientList: function() {
            if (this.walletType === 'hot') {
                this.hotRecipientAddressList.set(this.recipient, '1')
                window.localStorage.setItem('Hot ' + this.defaultAddress + ' leaseRecipientAddressList ', JSON.stringify(this.hotRecipientAddressList.dump()))
            } else {
                this.coldRecipientAddressList.set(this.recipient, '1')
                window.localStorage.setItem('Cold ' + this.defaultColdAddress + ' leaseRecipientAddressList ', JSON.stringify(this.coldRecipientAddressList.dump()))
            }
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
    padding-right: 35px;
    height: 48px;
}
.fee-remark {
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
}
</style>
