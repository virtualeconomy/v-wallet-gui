<template>
  <b-container class="text-left">
    <b-form-group label="Wallet Address"
                  label-for="address-input">
      <b-form-select v-if="walletType==='hotWallet'"
                     id="address-input"
                     class="addr-input"
                     v-model="address"
                     :options="options(addresses)">
      </b-form-select>
      <b-form-select v-else-if="walletType==='coldWallet'"
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
          <img src="@/assets/imgs/icons/wallet/Symbol_Yellow.svg"
               width="20"
               height="20">
        </span>
        <span class="balance">{{ formatter(walletType === 'hotWallet' ? balances[address] : balances[coldAddress]) }} VSYS</span>
      </b-btn>
    </b-form-group>
    <div class="select-node">
      <b-dropdown class="m-2"
                  no-caret
                  id="dropdown-grouped"
                  text="Select Node"
                  size="sm"
                  variant="warning">
        <div style="height:300px;overflow:scroll">
          <b-dropdown-group id="dropdown-group-1"
                            v-for="node in nodeList"
                            :key="node.index"
                            v-if="node.IsSuperNode"
                            :header="showNodeName(node.Address, node.name)">
            <b-dropdown-item-button @click="selectSupernode(node.Address, node.name)"><span style="color: black">Supernode: {{ node.name }}</span></b-dropdown-item-button>
            <b-dropdown-item-button v-if="node.SubNode"
                                    v-for="subNode in node.SubNode"
                                    style="color: black"
                                    @click="selectSubnode(node.Address, subNode.id, subNode.name)"
                                    :key="subNode.index"><span style="color: black">Subnode: {{ subNode.name }}</span></b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
          </b-dropdown-group>
        </div>
      </b-dropdown>
    </div>
    <b-form-group label="Recipient"
                  :label-for="'recipient-input' + walletType">
      <b-form-input v-if="walletType==='hotWallet'"
                    :id="'lease-recipient-input' + walletType"
                    class="recipient-input"
                    type="text"
                    v-model="recipient"
                    :state="isValidRecipient"
                    list="showHotRecipientList"
                    aria-describedby="inputLiveFeedBack"
                    placeholder="Paste or scan an address.">
      </b-form-input>
      <b-form-input v-else-if="walletType==='coldWallet'"
                    :id="'lease-recipient-input' + walletType"
                    class="recipient-input"
                    type="text"
                    v-model="recipient"
                    :state="isValidRecipient"
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
      <img src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
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
                 src="@/assets/imgs/icons/wallet/ic_wait.svg">
          </qrcode-reader>
        </div>
        <div class="text-danger text-center"><small>{{ qrErrMsg }}</small></div>
      </div>
    </b-form-group>
    <b-form-group label="Amount"
                  :label-for="'amount-input' + walletType">
      <b-form-input :id="'amount-input' + walletType"
                    class="amount-input"
                    v-model="amount"
                    aria-describedby="inputLiveFeedback"
                    :state="isValidAmount"
                    onfocus="this.select()">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-if="!checkPrecision">
        The number in this field is invalid. It can include a maximum of 8 digits after the decimal point.
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else-if="isInsufficient">
        Insufficient funds
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else-if="isNegative">
        Negative number is not allowed.
      </b-form-invalid-feedback>
      <b-form-invalid-feedback id="inputLiveFeedback"
                               v-else-if="!isValidNumFormat">
        Invalid format.
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
import { TX_FEE, VSYS_PRECISION, PROTOCOL, API_VERSION, OPC_ACCOUNT } from '@/js-v-sdk/src/constants'
import browser from '@/utils/browser'
import LRUCache from 'lru-cache'
import BigNumber from 'bignumber.js'
import common from '@/js-v-sdk/src/utils/common'
import { mapState } from 'vuex'
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
            fee: BigNumber(TX_FEE),
            hotRecipientAddressList: {},
            coldRecipientAddressList: {},
            tmpRecipient: '',
            isSuperSubNode: false
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
        },
        nodeList: {
            type: Array,
            default: function() { return [] },
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
    watch: {
        amount(newAmount, oldAmount) {
            let balance = this.walletType === 'hotWallet' ? this.balances[this.address] : this.balances[this.coldAddress]
            if (this.fee.isGreaterThan(BigNumber(balance))) {
                this.$nextTick(() => {
                    this.amount = BigNumber(0).toString()
                })
            } else if (BigNumber(this.amount).isGreaterThan(BigNumber(balance).minus(this.fee))) {
                this.$nextTick(() => {
                    this.amount = balance.minus(this.fee).toString()
                })
            }
        }
    },
    computed: {
        ...mapState({
            account: 'account'
        }),
        isValidAmount() {
            if (BigNumber(this.amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision && this.isValidNumFormat && !this.isInsufficient && !this.isNegative
        },
        isNegative() {
            return BigNumber(this.amount).isLessThan(0)
        },
        isValidNumFormat() {
            return common.isValidNumFormat(this.amount)
        },
        checkPrecision() {
            return common.checkPrecision(this.amount, 8)
        },
        isInsufficient() {
            let balance = this.walletType === 'hotWallet' ? this.balances[this.address] : this.balances[this.coldAddress]
            return BigNumber(balance).isLessThan(this.fee)
        },
        isSubmitDisabled() {
            return !(this.recipient && BigNumber(this.amount).isGreaterThan(0) && this.isValidRecipient && this.isValidAmount)
        },
        isSameWithSender() {
            let address = this.walletType === 'hotWallet' ? this.address : this.coldAddress
            return address === this.recipient
        },
        isValidRecipient() {
            let recipient = this.isSuperSubNode ? this.tmpRecipient : this.recipient
            if (!recipient) {
                return void 0
            }
            let isValid = false
            try {
                isValid = this.account.checkAddress(recipient)
            } catch (e) {
                console.log(e)
            }
            return isValid && !this.isSameWithSender
        }
    },
    methods: {
        scanChange() {
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
        onDecode(decodeString) {
            this.qrErrMsg = void 0
            this.paused = true
            try {
                let jsonObj = JSON.parse(decodeString.replace(/"amount":(\d+)/g, '"amount":"$1"')) // The protocol defined amount must use Long type. However, there is no Long type in JS. So we use BigNumber instead. Add quotes (") to amount field to ensure BigNumber parses amount without precision loss.
                this.recipient = jsonObj.address
                let opc = jsonObj.opc
                let api = jsonObj.api
                let protocol = jsonObj.protocol
                if (jsonObj.hasOwnProperty('amount')) {
                    this.amount = BigNumber(jsonObj.amount).dividedBy(VSYS_PRECISION).decimalPlaces(8).toString()
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
                } else if (!this.isValidRecipient || this.recipient === '') {
                    this.paused = false
                    this.qrErrMsg = 'Invalid recipient address in QR code.'
                }
            } catch (e) {
                this.recipient = decodeString
                if (this.isValidRecipient) {
                    this.recipient = decodeString
                } else {
                    this.paused = false
                    this.recipient = 'please scan QR code of recipient'
                }
            }
        },
        nextPage() {
            this.$emit('get-data', this.isSuperSubNode ? this.tmpRecipient : this.recipient, this.amount, this.walletType === 'hotWallet' ? this.address : this.coldAddress, this.walletType, this.fee)
        },
        options(addrs) {
            let res = Object.keys(addrs).reduce((options, addr) => {
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
            this.isSuperSubNode = false
            this.tmpRecipient = ''
            this.fee = BigNumber(TX_FEE)
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        addRecipientList() {
            if (this.walletType === 'hotWallet') {
                if (!this.isSuperSubNode) {
                    this.hotRecipientAddressList.set(this.recipient, '1')
                }
                window.localStorage.setItem('Hot ' + this.defaultAddress + ' leaseRecipientAddressList ', JSON.stringify(this.hotRecipientAddressList.dump()))
            } else {
                if (!this.isSuperSubNode) {
                    this.coldRecipientAddressList.set(this.recipient, '1')
                }
                window.localStorage.setItem('Cold ' + this.defaultColdAddress + ' leaseRecipientAddressList ', JSON.stringify(this.coldRecipientAddressList.dump()))
            }
        },
        showNodeName(address, name) {
            const addrChars = address.split('')
            addrChars.splice(6, 23, '******')
            return name + ' (' + addrChars.join('') + ')'
        },
        selectSupernode(address, name) {
            this.isSuperSubNode = true
            this.tmpRecipient = address
            const addrChars = address.split('')
            addrChars.splice(6, 23, '******')
            let addressDeal = addrChars.join('')
            this.recipient = name + ' Supernode (' + addressDeal + ')'
            this.fee = BigNumber(TX_FEE)
        },
        selectSubnode(address, id, name) {
            this.isSuperSubNode = true
            this.tmpRecipient = address
            const addrChars = address.split('')
            addrChars.splice(6, 23, '******')
            let addressDeal = addrChars.join('')
            this.recipient = name + ' Subnode (' + addressDeal + ')'
            this.fee = BigNumber(TX_FEE).plus(BigNumber(0.00000001).multipliedBy(id))
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
.select-node {
    position: relative;
    display: inline-block;
    float: right;
    margin-top: -15px;
    margin-right: -8px;
}
</style>
