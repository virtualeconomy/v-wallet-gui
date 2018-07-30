<template>
  <b-modal id="sendModal"
           centered
           lazy
           title="Send"
           hide-footer
           hide-header
           ref="sendModal"
           :busy="true"
           @hidden="resetPage">
    <button
      :disabled="qrInit"
      class="close btn-close"
      @click="endSend">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs @input="hideQrScan">
      <b-tab title="Hot Wallet"
             :disabled="qrInit && !pageId"
             active>
        <b-container
          class="text-left"
          v-if="pageId===1">
          <b-form-group label="Wallet Address"
                        label-for="address-input">
            <b-form-select id=address-input
                           class="addr-input"
                           v-model="address"
                           :options="options(addresses)"></b-form-select>
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
              <span class="balance">{{ balances[address] }} VEE</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Recipient"
                        label-for="recipient-input">
            <b-form-input id="recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="recipient"
                          :state="isValidRecipient(recipient)"
                          aria-describedby="inputLiveFeedback"
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
            </div>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
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
          <b-form-group label="Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="attachment"
                             :rows="3"
                             :no-resize="true"
                             :state="isValidAttachment">
            </b-form-textarea>
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
        </b-container>
        <b-container v-if="pageId===2">
          <Confirm :address="address"
                   :recipient="recipient"
                   :amount="Number(amount)"
                   :fee="fee"
                   :attachment="attachment"
                   :tx-type="'transfer'">
          </Confirm>
          <p
            v-show="sendError"
            class="text-danger"><small>Sorry, transaction send failed!</small></p>
          <b-row>
            <b-col class="col-lef">
              <b-button
                class="btn-back"
                block
                variant="light"
                size="lg"
                @click="prevPage">Back
              </b-button>
            </b-col>
            <b-col class="col-rit">
              <b-button
                block
                class="btn-confirm"
                variant="warning"
                size="lg"
                @click="sendData('hotWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="pageId===3">
          <Success :address="address"
                   :recipient="recipient"
                   :amount="Number(amount)"
                   :fee="fee"
                   :attachment="attachment">
          </Success>
          <b-button variant="warning"
                    block
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
      <b-tab title="Cold Wallet"
             :disabled="noColdAddress || (qrInit && !coldPageId)">
        <b-container v-if="coldPageId===1"
                     class="text-left">
          <b-form-group label="Wallet Address"
                        label-for="wallet-address">
            <b-form-select id=wallet-address
                           class="addr-input"
                           v-model="coldAddress"
                           :options="options(coldAddresses)"></b-form-select>
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
              <span class="balance">{{ balances[coldAddress] }} VEE</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Recipient"
                        label-for="cold-recipient-input">
            <b-form-input id="cold-recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="coldRecipient"
                          :state="isValidRecipient(coldRecipient)"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <img src="../../../assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 title="scan qr-code"
                 @click="scanChange">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid recipient address.
            </b-form-invalid-feedback>
            <div v-if="scanShow">
              <div class="qr-info">Please confirm your browser's camera is available.</div>
              <div class="qr-window">
                <qrcode-reader @init="onInit"
                               @decode="onColdDecode"
                               :track="repaintLocation"
                               :paused="paused">
                  <img v-if="qrInit"
                       class="qrcode-waiting center"
                       height="70"
                       width="70"
                       src="../../../assets/imgs/icons/wallet/ic_wait.svg">
                </qrcode-reader>
              </div>
            </div>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="coldAmount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('cold')"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="isWrongFormat(coldAmount)">
              The number in this field is invalid. It can include a maximum of 8 digits after the decimal point.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isInsufficient(coldAmount, 'cold')">
              Insufficient funds
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Description"
                        label-for="coldDescriptionInput">
            <b-form-textarea id="coldDescriptionInput"
                             v-model="coldAttachment"
                             :rows="3"
                             :no-resize="true"
                             :state="isValidColdAttachment">
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            class="fee-remark"
            label="Transaction Fee 0.001 VEE">
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isColdSubmitDisabled"
                    @click="coldNextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <Confirm :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment"
                   :tx-type="'transfer'">
          </Confirm>
          <b-row>
            <b-col class="col-lef">
              <b-button
                class="btn-back"
                block
                variant="light"
                size="lg"
                @click="coldPrevPage">Back
              </b-button>
            </b-col>
            <b-col class="col-rit">
              <b-button
                block
                class="btn-confirm"
                variant="warning"
                size="lg"
                @click="coldNextPage">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="coldPageId===3">
          <ColdSignature :data-object="dataObject"
                         v-if="coldPageId===3"
                         @get-signature="getSignature"
                         @next-page="coldNextPage"
                         @prev-page="coldPrevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <Confirm :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment"
                   :tx-type="'transfer'">
          </Confirm>
          <p v-show="sendError">Sorry, transaction send failed!</p>
          <b-row>
            <b-col class="col-lef">
              <b-button
                class="btn-back"
                block
                variant="light"
                size="lg"
                @click="coldPrevPage">Back
              </b-button>
            </b-col>
            <b-col class="col-rit">
              <b-button
                block
                class="btn-confirm"
                variant="warning"
                size="lg"
                @click="sendData('coldWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-show="coldPageId===5">
          <Success :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment">
          </Success>
          <b-button variant="warning"
                    block
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
import transaction from '@/utils/transaction'
import Vue from 'vue'
import seedLib from '@/libs/seed.js'
import { TESTNET_NODE, TRANSFER_ATTACHMENT_BYTE_LIMIT, VEE_PRECISION, TX_FEE, TRANSFER_TX } from '@/constants.js'
import Confirm from './Confirm'
import Success from './Success'
import crypto from '@/utils/crypto'
import ColdSignature from './ColdSignature'
var initData = {
    recipient: '',
    amount: 0,
    attachment: '',
    pageId: 1,
    fee: TX_FEE,
    coldRecipient: '',
    coldAmount: 0,
    coldAttachment: '',
    coldPageId: 1,
    coldFee: TX_FEE,
    address: this.walletType === 'hotWallet' ? this.selectedAddress : this.default,
    coldAddress: this.walletType === 'hotWallet' ? this.defaultColdAddress : this.selectedAddress,
    scanShow: false,
    qrInit: false,
    paused: false,
    sendError: false,
    coldSignature: ''
}
export default {
    name: 'Send',
    components: {ColdSignature, Success, Confirm},
    props: {
        balances: {
            type: Object,
            default: function() {},
            require: true
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
        walletType: {
            type: String,
            default: 'hotWallet',
            require: true
        },
        selectedAddress: {
            type: String,
            default: this.defaultAddress,
            require: true
        }
    },
    data: function() {
        return initData
    },
    computed: {
        defaultAddress() {
            return Vue.ls.get('address')
        },
        defaultColdAddress() {
            if (this.noColdAddress) return ''
            return Object.keys(this.coldAddresses)[0]
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.defaultAddress))
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        wordList() {
            return this.seedPhrase.split(' ')
        },
        isSubmitDisabled() {
            return !(this.recipient && this.amount > 0 && this.isValidRecipient(this.recipient) && (this.isValidAttachment || !this.attachment) && this.isAmountValid('hot') && this.address !== '')
        },
        isColdSubmitDisabled() {
            return !(this.coldAddress && this.coldRecipient && this.coldAmount > 0 && this.isValidRecipient(this.coldRecipient) && (this.isValidColdAttachment || !this.coldAttachment) && this.isAmountValid('cold') && this.coldAddress !== '')
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        dataObject() {
            return {
                transactionType: TRANSFER_TX,
                senderPublicKey: this.coldAddresses[this.coldAddress],
                assetId: '',
                feeAssetId: '',
                amount: Number((this.coldAmount * VEE_PRECISION).toFixed(0)),
                fee: this.coldFee * VEE_PRECISION,
                recipient: this.coldRecipient,
                attachment: this.coldAttachment,
                timestamp: Date.now()
            }
        },
        isValidAttachment() {
            if (!this.attachment) {
                return void 0
            }
            return this.attachment.length <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        isValidColdAttachment() {
            if (!this.coldAttachment) {
                return void 0
            }
            return this.coldAttachment.length <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        }
    },
    methods: {
        sendData: function(walletType) {
            var apiSchema
            if (walletType === 'hotWallet') {
                const dataInfo = {
                    recipient: this.recipient,
                    assetId: '',
                    amount: Number((this.amount * VEE_PRECISION).toFixed(0)),
                    feeAssetId: '',
                    fee: TX_FEE * VEE_PRECISION,
                    attachment: this.attachment,
                    timestamp: (Date.now() - 1) * 1e6
                }
                apiSchema = transaction.prepareForAPI(dataInfo, this.getKeypair(this.addresses[this.address]), TRANSFER_TX)
            } else if (walletType === 'coldWallet') {
                apiSchema = transaction.prepareColdForAPI(this.dataObject, this.coldSignature, TRANSFER_TX)
            }
            const url = TESTNET_NODE + '/assets/broadcast/transfer'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                if (walletType === 'hotWallet') {
                    this.pageId++
                } else {
                    this.coldPageId++
                }
            }, response => {
                this.sendError = true
            })
        },
        nextPage: function() {
            this.sendError = false
            this.pageId++
        },
        coldNextPage: function() {
            this.sendError = false
            this.coldPageId++
        },
        prevPage: function() {
            this.sendError = false
            if (this.pageId === 1) {
                this.$refs.sendModal.hide()
            } else {
                this.pageId--
            }
        },
        coldPrevPage: function() {
            this.sendError = false
            if (this.coldPageId === 1) {
                this.$refs.sendModal.hide()
            } else {
                this.coldPageId--
            }
        },
        resetPage: function() {
            this.recipient = ''
            this.amount = 0
            this.attachment = ''
            this.pageId = 1
            this.coldRecipient = ''
            this.coldAmount = 0
            this.coldAttachment = ''
            this.coldPageId = 1
            this.coldAddress = ''
            this.scanShow = false
            this.qrInit = false
            this.paused = false
            this.sendError = false
            this.coldSignature = ''
            this.address = this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.walletType === 'hotWallet' ? this.defaultColdAddress : this.selectedAddress
        },
        endSend: function() {
            this.$refs.sendModal.hide()
        },
        scanChange: function(evt) {
            if (!this.qrInit) {
                this.scanShow = !this.scanShow
            }
        },
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
        async onInit(promise) {
            try {
                this.qrInit = true
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
        onDecode: function(decodeString) {
            this.paused = true
            this.recipient = this.getParmFromUrl('recipient', decodeString) || decodeString
            this.amount = this.getParmFromUrl('amount', decodeString)
            if (!this.isValidRecipient(this.recipient) || this.recipient === '') {
                this.paused = false
            }
        },
        onColdDecode: function(decodeString) {
            this.paused = true
            this.coldRecipient = this.getParmFromUrl('recipient', decodeString) || decodeString
            this.coldAmount = this.getParmFromUrl('amount', decodeString)
            if (!this.isValidRecipient(this.coldRecipient) || this.coldRecipient === '') {
                this.paused = false
            }
        },
        getSignature: function(signature) {
            this.coldSignature = signature
            this.dataObject.timestamp *= 1e6
            this.coldPageId++
        },
        repaintLocation(location, ctx) {
            if (location !== null) {
                const {
                    topLeftCorner,
                    topRightCorner,
                    bottomLeftCorner,
                    bottomRightCorner
                } = location
                ctx.strokeStyle = 'orange' // instead of red
                ctx.beginPath()
                ctx.moveTo(topLeftCorner.x, topLeftCorner.y)
                ctx.lineTo(bottomLeftCorner.x, bottomLeftCorner.y)
                ctx.lineTo(bottomRightCorner.x, bottomRightCorner.y)
                ctx.lineTo(topRightCorner.x, topRightCorner.y)
                ctx.lineTo(topLeftCorner.x, topLeftCorner.y)
                ctx.closePath()
                ctx.stroke()
            }
        },
        hideQrScan(tabIndex) {
            if (tabIndex === 0) {
                this.resetPage()
                this.pageId = 1
            } else {
                this.resetPage()
                this.coldPageId = 1
            }
            this.scanShow = false
        },
        isAmountValid(type) {
            var amount = type === 'hot' ? this.amount : this.coldAmount
            if (Number(amount) === 0) {
                return void 0
            }
            return !isNaN(amount) && !this.isWrongFormat(amount) && !this.isInsufficient(amount, type)
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
        options(addrs) {
            return Object.keys(addrs).reduce((options, addr) => {
                options.push({ value: addr, text: addr })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a wallet address</span>', disabled: true }])
        },
        getKeypair: function(index) {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, index).keyPair
        }
    }
}
</script>

<style scoped lang="less">
.scan-ok-btn, .scan-again-btn {
    margin-top: 10px;
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
.recipient-input {
    height: 48px;
}
.amount-input {
    height: 48px;
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
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 20px;
}
.btn-continue {
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    height: 50px;
}
.fee-remark {
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
}
.center {
    text-align: center;
}
.qrcode-waiting {
    vertical-align: middle;
    display: flex;
    margin-right: auto;
    margin-left: auto;
    margin-top: 20px;
}
.qr-window {
    padding: 0 100px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.btn-back {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
</style>
