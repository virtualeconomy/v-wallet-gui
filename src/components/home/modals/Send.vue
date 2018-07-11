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
            <b-form-input
              id="address-input"
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
                          aria-describedby="inputLiveFeedback">
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
                          min="0"
                          onkeypress="return event.charCode >= 48 && event.charCode <= 57">
            </b-form-input>
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
            label="Transaction Fee 100000 VEE">
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
                   :attachment="attachment">
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
                           :options="options"></b-form-select>
            <b-btn
              block
              variant="light"
              disabled
              class="balance-input"
              readonly>
              <span class="balance-title">Balance</span>
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
                          aria-describedby="inputLiveFeedback">
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
              <div class="text-danger text-center"><small>{{ qrErrMsg }}</small></div>
            </div>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          type="number"
                          v-model="coldAmount"
                          min="0"
                          onkeypress="return event.charCode >= 48 && event.charCode <= 57">
            </b-form-input>
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
            label="Transaction Fee 100000 VEE">
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
                   :attachment="coldAttachment">
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
                         :public-key="coldPublicKey"
                         v-if="coldPageId===3"
                         @get-signature="getSignature"></ColdSignature>
          <b-button variant="primary"
                    size="lg"
                    @click="coldPrevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    @click="coldNextPage"
                    :disabled="!isValidSignature">Confirm
          </b-button>
        </b-container>
        <b-container v-show="coldPageId===4">
          <Confirm :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment">
          </Confirm>
          <p v-show="sendError">Sorry, transaction send failed!</p>
          <b-button variant="primary"
                    size="lg"
                    @click="prevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    @click="sendData('coldwallet')">Confirm
          </b-button>
        </b-container>
        <b-container v-show="coldPageId===5">
          <Success :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment">
          </Success>
          <b-button variant="primary"
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
import { TESTNET_NODE, TRANSFER_ATTACHMENT_BYTE_LIMIT, TRANSFER_TX, LEASE_TX } from '@/constants.js'
import Confirm from './Confirm'
import Success from './Success'
import crypto from '@/utils/crypto'
import ColdSignature from './ColdSignature'
var initData = {
    recipient: '',
    amount: 0,
    attachment: '',
    pageId: 0,
    fee: 100000,
    coldRecipient: '',
    coldAmount: 0,
    coldAttachment: '',
    coldPageId: 0,
    coldFee: 100000,
    coldAddress: '',
    scanShow: false,
    qrInit: false,
    paused: false,
    isValidSignature: false,
    sendError: false,
    coldSignature: '',
    coldTimestamp: 0,
    qrErrMsg: void 0
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
        }
    },
    data: function() {
        return initData
    },
    computed: {
        address() {
            return Vue.ls.get('address')
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
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
        keyPair() {
            return seedLib.fromExistingPhrase(this.seedPhrase).keyPair
        },
        isSubmitDisabled() {
            return !(this.recipient && this.amount > 0 && this.isValidRecipient(this.recipient) && (this.isValidAttachment || !this.attachment))
        },
        isColdSubmitDisabled() {
            return !(this.coldAddress && this.coldRecipient && this.coldAmount > 0 && this.isValidRecipient(this.coldRecipient) && (this.isValidColdAttachment || !this.coldAttachment))
        },
        options() {
            return Object.keys(this.coldAddresses).reduce((options, coldAddress) => {
                options.push({ value: coldAddress, text: coldAddress })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a cold wallet address</span>', disabled: true }])
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        dataObject() {
            return {
                senderPublicKey: this.coldAddresses[this.coldAddress],
                assetId: '',
                feeAssetId: '',
                amount: this.coldAmount,
                fee: this.coldFee,
                recipient: this.coldRecipient,
                attachment: this.coldAttachment
            }
        },
        coldPublicKey() {
            return this.coldAddresses[this.coldAddress]
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
                // const dataInfo = {
                //     recipient: this.recipient,
                //     assetId: '',
                //     amount: Number(this.amount),
                //     feeAssetId: '',
                //     fee: this.fee,
                //     attachment: this.attachment,
                //     timestamp: (Date.now() - 1) * 1e6
                // }
                const dataInfo = {
                    recipient: this.recipient,
                    amount: Number(this.amount),
                    fee: this.fee,
                    timestamp: (Date.now() - 1) * 1e6
                }
                apiSchema = transaction.prepareForAPI(dataInfo, this.keyPair, LEASE_TX)
                // apiSchema = transaction.prepareForAPI(dataInfo, this.keyPair, TRANSFER_TX)
            } else if (walletType === 'coldWallet') {
                apiSchema = transaction.prepareColdForAPI(this.dataObject, this.coldSignature, this.coldTimestamp, TRANSFER_TX)
            }
            // const url = TESTNET_NODE + '/assets/broadcast/transfer'
            const url = TESTNET_NODE + '/leasing/boradcast/lease'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                this.pageId++
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
            this.pageId = 0
            this.coldRecipient = ''
            this.coldAmount = 0
            this.coldAttachment = ''
            this.coldPageId = 0
            this.coldAddress = ''
            this.scanShow = false
            this.qrInit = false
            this.paused = false
            this.isValidSignature = false
            this.sendError = false
            this.coldSignature = ''
            this.coldTimestamp = 0
            this.qrErrMsg = void 0
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
        onColdDecode: function(decodeString) {
            this.qrErrMsg = void 0
            this.paused = true
            this.coldRecipient = this.getParmFromUrl('recipient', decodeString) || decodeString
            this.coldAmount = this.getParmFromUrl('amount', decodeString)
            if (!this.isValidRecipient(this.coldRecipient) || this.coldRecipient === '') {
                this.qrErrMsg = 'Sorry, your QR code seems unavalible.'
                this.paused = false
            } else {
                this.scanShow = false
            }
        },
        getSignature: function(signature, timestamp) {
            this.coldSignature = signature
            this.coldTimestamp = timestamp
            this.isValidSignature = transaction.default.isValidSignature(this.dataObject, signature, timestamp)
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
    float: right;
    margin-top: -37px;
    margin-right: 10px;
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
