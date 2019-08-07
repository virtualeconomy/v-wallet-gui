<template>
  <b-modal :id="'sendTokenModal_' + tokenId"
           centered
           lazy
           title="SendToken"
           hide-footer
           hide-header
           ref="sendTokenModal"
           :busy="true"
           @hidden="resetPage">
    <button
      :disabled="qrInit"
      class="close btn-close"
      @click="endSend">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs @input="hideQrScan">
      <b-tab title="Hot Wallet"
             :disabled="qrInit && !pageId"
             :active="walletType==='hotWallet'">
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
                <img src="@/assets/imgs/icons/wallet/ic_token2.svg"
                     width="20"
                     height="20">
              </span>
              <span class="balance">Token Balance {{ formatter(tokenBalances[address]) }} </span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Recipient"
                        label-for="recipient-input">
            <b-form-input id="recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="recipient"
                          :state="isValidRecipient(recipient)"
                          list="showHotRecipientList"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <datalist id="showHotRecipientList">
              <option v-for="addr in hotRecipientAddressList.keys()"
                      :key="addr">{{ addr }}</option>
            </datalist>
            <img src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 @click="scanChange"
                 title="scan qr-code">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid recipient address (if using QR code scanner, make sure QR code is correct).
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
                       src="@/assets/imgs/icons/wallet/ic_wait.svg">
                </qrcode-reader>
              </div>
              <div class="text-danger text-center"><small>{{ qrErrMsg }}</small></div>
            </div>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('hotWallet')"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isNumFormatValid(amount)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision(amount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isTokenInsufficient(amount, 'hotWallet')">
              Insufficient token
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isInsufficient('hotWallet')">
              Insufficient VSYS balance
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
          <b-form-group label="Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="attachment"
                             :rows="3"
                             :no-resize="true"
                             :state="isValidAttachment(attachment)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS </label>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled('hotWallet')"
                    @click="nextPage(); addRecipientList();">Continue
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :recipient="recipient"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :attachment="attachment"
                        :tx-type="'Send Token'">
          </TokenConfirm>
          <p
            v-show="sendError"
            class="text-danger"><small>Sorry, transaction send failed! {{ errorMessage }}</small></p>
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
                :disabled="hasConfirmed"
                @click="sendData('hotWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="pageId===3">
          <TokenSuccess class="tokenSucced"
                        :address="address"
                        :recipient="recipient"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Send Token'">
          </TokenSuccess>
          <b-button variant="warning"
                    block
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
      <b-tab title="Cold Wallet"
             :disabled="noColdAddress || (qrInit && !coldPageId)"
             :active="walletType==='coldWallet'">
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
                <img src="@/assets/imgs/icons/wallet/ic_token2.svg"
                     width="20"
                     height="20">
              </span>
              <span class="balance">Token Balance {{ formatter(tokenBalances[coldAddress]) }}</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Recipient"
                        label-for="cold-recipient-input">
            <b-form-input id="cold-recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="coldRecipient"
                          :state="isValidRecipient(coldRecipient)"
                          list="showColdRecipientList"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <datalist id="showColdRecipientList">
              <option v-for="addr in coldRecipientAddressList.keys()"
                      :key="addr"> {{ addr }}</option>
            </datalist>
            <img src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 title="scan qr-code"
                 @click="scanChange">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid recipient address (if using QR code scanner, make sure QR code is correct).
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
                       src="@/assets/imgs/icons/wallet/ic_wait.svg">
                </qrcode-reader>
              </div>
              <div class="text-danger text-center"><small>{{ qrErrMsg }}</small></div>
            </div>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="coldAmount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('coldWallet')"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isNumFormatValid(coldAmount)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision(coldAmount)">
              The number in this field is invalid. It may exceed the maximum number of digits after the decimal point.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isTokenInsufficient(coldAmount, 'coldWallet')">
              Insufficient token
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isInsufficient('coldWallet')">
              Insufficient VSYS balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(coldAmount)">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Description"
                        label-for="coldDescriptionInput">
            <b-form-textarea id="coldDescriptionInput"
                             v-model="coldAttachment"
                             :rows="3"
                             :no-resize="true"
                             :state="isValidAttachment(coldAttachment)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS </label>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isSubmitDisabled('coldWallet')"
                    @click="nextPage(); addRecipientList()">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="coldAddress"
                        :recipient="coldRecipient"
                        :amount=inputAmount(coldAmount)
                        :fee="coldFee"
                        :attachment="coldAttachment"
                        :tx-type="'Send Token'">
          </TokenConfirm>
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
                @click="nextPage">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="coldPageId===3"
                     class="text-left">
          <ColdSignature :data-object="dataObject"
                         :qr-total-page="1"
                         v-if="coldPageId===3"
                         @get-signature="getSignature"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(coldAmount)
                        :fee="coldFee"
                        :recipient="coldRecipient"
                        :tx-type="'Send Token'">
          </TokenConfirm>
          <p v-show="sendError">Sorry, transaction send failed! {{ errorMessage }}</p>
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
                @click="sendData('coldWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-show="coldPageId===5">
          <TokenSuccess class="tokenSucced"
                        :address="coldAddress"
                        :recipient="coldRecipient"
                        :amount=inputAmount(coldAmount)
                        :fee="coldFee"
                        :tx-type="'Send Token'">
          </TokenSuccess>
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
import { NODE_IP, CONTRACT_EXEC_FEE, TRANSFER_ATTACHMENT_BYTE_LIMIT, VSYS_PRECISION, FEE_SCALE, API_VERSION, PROTOCOL, OPC_ACCOUNT, OPC_FUNCTION, SEND_FUNCIDX, SEND_FUNCIDX_SPLIT } from '@/constants.js'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import crypto from '@/utils/crypto'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import LRUCache from 'lru-cache'
import BigNumber from 'bignumber.js'
import common from '@/utils/common'
var initData = {
    errorMessage: '',
    opc: '',
    recipient: '',
    amount: BigNumber(0),
    attachment: '',
    pageId: 1,
    fee: BigNumber(CONTRACT_EXEC_FEE),
    coldRecipient: '',
    coldAmount: BigNumber(0),
    coldAttachment: '',
    coldPageId: 1,
    coldFee: BigNumber(CONTRACT_EXEC_FEE),
    address: this ? (this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress) : '',
    coldAddress: this ? (this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress) : '',
    scanShow: false,
    qrInit: false,
    qrErrMsg: void 0,
    paused: false,
    sendError: false,
    coldSignature: '',
    timeStamp: Date.now() * 1e6,
    hasConfirmed: false,
    coldRecipientAddressList: {},
    hotRecipientAddressList: {},
    functionIndex: this ? (this.isSplit ? SEND_FUNCIDX_SPLIT : SEND_FUNCIDX) : SEND_FUNCIDX_SPLIT
}
export default {
    name: 'Send',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    props: {
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
            default: this ? this.defaultAddress : undefined,
            require: true
        },
        tokenId: {
            type: String,
            default: '',
            require: true
        },
        tokenBalances: {
            type: Object,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        tokenUnity: {
            type: BigNumber,
            default: function() {
            },
            require: true
        },
        balances: {
            type: Object,
            default: function() {
            },
            require: true
        },
        isSplit: {
            type: Boolean,
            default: false
        }
    },
    data: function() {
        return initData
    },
    created() {
        this.coldRecipientAddressList = new LRUCache(10)
        this.hotRecipientAddressList = new LRUCache(10)
        let item = window.localStorage.getItem('Cold ' + this.defaultColdAddress + ' sendTokenRecipientAddressList ')
        if (item) {
            this.coldRecipientAddressList.load(JSON.parse(item))
        }
        item = window.localStorage.getItem('Hot ' + this.defaultAddress + ' sendTokenRecipientAddressList ')
        if (item) {
            this.hotRecipientAddressList.load(JSON.parse(item))
        }
    },
    computed: {
        contractId() {
            return transaction.tokenIDToContractID(this.tokenId)
        },
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
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        isSubmitDisabled() {
            return function(type) {
                let recipient = type === 'hotWallet' ? this.recipient : this.coldRecipient
                let attachment = type === 'hotWallet' ? this.attachment : this.coldAttachment
                let address = type === 'hotWallet' ? this.address : this.coldAddress
                return !(recipient && this.isValidRecipient(recipient) && this.isValidAttachment(attachment) && this.isAmountValid(type) && address !== '')
            }
        },
        isAmountValid() {
            return function(type) {
                let amount = type === 'hotWallet' ? this.amount : this.coldAmount
                if (BigNumber(amount).isEqualTo(0)) {
                    return true
                }
                return this.checkPrecision(amount) && this.isNumFormatValid(amount) && !this.isTokenInsufficient(amount, type) && !this.isInsufficient(type) && !this.isNegative(amount)
            }
        },
        isInsufficient() {
            return function(type) {
                let balance = type === 'hotWallet' ? this.balances[this.address] : this.balances[this.coldAddress]
                return BigNumber(balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
            }
        },
        dataObject() {
            return {
                protocol: PROTOCOL,
                api: API_VERSION,
                opc: OPC_FUNCTION,
                address: this.coldAddress,
                senderPublicKey: this.coldAddresses[this.coldAddress].publicKey,
                fee: this.coldFee * VSYS_PRECISION,
                feeScale: FEE_SCALE,
                timestamp: Date.now(),
                attachment: transaction.prepareSendAttachment(this.coldAttachment),
                contractId: this.contractId,
                functionId: this.isSplit ? SEND_FUNCIDX_SPLIT : SEND_FUNCIDX,
                function: transaction.prepareSend(this.coldRecipient, BigNumber(this.coldAmount).multipliedBy(this.tokenUnity)),
                functionExplain: 'send ' + this.coldAmount + ' token to ' + this.coldRecipient
            }
        }
    },
    methods: {
        isValidAttachment(attachment) {
            return common.getLength(attachment) <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        inputAmount(num) {
            return BigNumber(num)
        },
        sendData(walletType) {
            let apiSchema
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                const dataInfo = {
                    contractId: this.contractId,
                    senderPublicKey: this.getKeypair(this.addresses[this.address]).publicKey,
                    fee: CONTRACT_EXEC_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.timeStamp,
                    attachment: transaction.prepareSendAttachment(this.attachment),
                    functionIndex: this.isSplit ? SEND_FUNCIDX_SPLIT : SEND_FUNCIDX,
                    functionData: transaction.prepareSend(this.recipient, BigNumber(this.amount).multipliedBy(this.tokenUnity)),
                    signature: transaction.prepareExecContractSignature(this.contractId, this.isSplit ? SEND_FUNCIDX_SPLIT : SEND_FUNCIDX, transaction.prepareSend(this.recipient, BigNumber(this.amount).multipliedBy(this.tokenUnity)), this.attachment, BigNumber(CONTRACT_EXEC_FEE * VSYS_PRECISION), FEE_SCALE, BigNumber(this.timeStamp), this.getKeypair(this.addresses[this.address]).privateKey)
                }
                apiSchema = dataInfo
            } else if (walletType === 'coldWallet') {
                const coldDataInfo = {
                    contractId: this.dataObject.contractId,
                    senderPublicKey: this.dataObject.senderPublicKey,
                    fee: this.dataObject.fee,
                    feeScale: this.dataObject.feeScale,
                    timestamp: this.dataObject.timestamp,
                    attachment: this.dataObject.attachment,
                    functionIndex: this.dataObject.functionId,
                    functionData: this.dataObject.function,
                    signature: this.coldSignature
                }
                apiSchema = coldDataInfo
            }
            const url = NODE_IP + '/contract/broadcast/execute'
            this.$http.post(url, apiSchema).then(response => {
                if (walletType === 'hotWallet') {
                    this.pageId++
                } else {
                    this.coldPageId++
                }
            }, response => {
                this.errorMessage = response.body.message
                if (this.errorMessage === undefined) {
                    this.errorMessage = 'Failed reason: Unknown.Please check network connection!'
                }
                this.sendError = true
            })
            this.$emit('endSendSignal')
        },
        addRecipientList() {
            if (this.walletType === 'hotWallet') {
                this.hotRecipientAddressList.set(this.recipient, '0')
                window.localStorage.setItem('Hot ' + this.defaultAddress + ' sendTokenRecipientAddressList ', JSON.stringify(this.hotRecipientAddressList.dump()))
            } else {
                this.coldRecipientAddressList.set(this.coldRecipient, '0')
                window.localStorage.setItem('Cold ' + this.defaultColdAddress + ' sendTokenRecipientAddressList ', JSON.stringify(this.coldRecipientAddressList.dump()))
            }
        },
        nextPage() {
            this.sendError = false
            this.hasConfirmed = false
            if (this.walletType === 'hotWallet') {
                this.pageId++
                this.timeStamp = Date.now() * 1e6
            } else {
                this.coldPageId++
            }
        },
        prevPage() {
            this.sendError = false
            let pageId = this.walletType === 'hotWallet' ? this.pageId : this.coldPageId
            if (pageId === 1) {
                this.$refs.sendModal.hide()
            } else {
                if (this.walletType === 'hotWallet') {
                    this.pageId--
                } else {
                    this.coldPageId--
                }
            }
        },
        resetPage() {
            this.opc = ''
            this.recipient = ''
            this.amount = BigNumber(0)
            this.attachment = ''
            this.pageId = 1
            this.coldRecipient = ''
            this.coldAmount = BigNumber(0)
            this.coldAttachment = ''
            this.coldPageId = 1
            this.coldAddress = ''
            this.scanShow = false
            this.qrInit = false
            this.paused = false
            this.qrErrMsg = void 0
            this.sendError = false
            this.coldSignature = ''
            this.address = this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
        },
        endSend() {
            this.$refs.sendTokenModal.hide()
        },
        scanChange(evt) {
            if (!this.qrInit) {
                this.scanShow = !this.scanShow
            }
            if (this.scanShow) {
                this.paused = false
            }
        },
        isValidRecipient(recipient) {
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
        onDecode(decodeString) {
            this.paused = true
            try {
                let jsonObj = JSON.parse(decodeString.replace(/"amount":(\d+)/g, '"amount":"$1"')) // The protocol defined amount must use Long type. However, there is no Long type in JS. So we use BigNumber instead. Add quotes (") to amount field to ensure BigNumber parses amount without precision loss.
                var recipient = jsonObj.address
                let opc = jsonObj.opc
                let api = jsonObj.api
                let protocol = jsonObj.protocol
                if (jsonObj.hasOwnProperty('amount')) {
                    if (this.walletType === 'hotWallet') {
                        this.amount = BigNumber(jsonObj.amount).dividedBy(VSYS_PRECISION).decimalPlaces(8)
                    } else {
                        this.coldAmount = BigNumber(jsonObj.amount).dividedBy(VSYS_PRECISION).decimalPlaces(8)
                    }
                }
                if (jsonObj.hasOwnProperty('invoice')) {
                    if (this.walletType === 'hotWallet') {
                        this.attachment = jsonObj.invoice
                    } else {
                        this.coldAttachment = jsonObj.invoice
                    }
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
                } else if (!this.isValidRecipient(recipient) || recipient === '') {
                    this.paused = false
                    this.qrErrMsg = 'Invalid address of recipient.'
                } else {
                    this.qrErrMsg = void 0
                }
                if (this.walletType === 'hotWallet') {
                    this.recipient = recipient
                } else {
                    this.coldRecipient = recipient
                }
            } catch (e) {
                if (this.isValidRecipient(decodeString)) {
                    recipient = decodeString
                } else {
                    recipient = 'please scan QR code of recipient'
                    this.paused = false
                }
                if (this.walletType === 'hotWallet') {
                    this.recipient = recipient
                } else {
                    this.coldRecipient = recipient
                }
            }
        },
        getSignature(signature) {
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
            this.resetPage()
            if (tabIndex === 0) {
                this.pageId = 1
                this.walletType = 'hotWallet'
            } else {
                this.coldPageId = 1
                this.walletType = 'coldWallet'
            }
            this.scanShow = false
        },
        isNegative(amount) {
            return BigNumber(amount).isLessThan(0)
        },
        isNumFormatValid(amount) {
            return common.isNumFormatValid(amount)
        },
        checkPrecision(amount) {
            return common.checkPrecision(BigNumber(amount).multipliedBy(this.tokenUnity), 0)
        },
        isTokenInsufficient(amount, type) {
            let balance = type === 'hotWallet' ? this.tokenBalances[this.address] : this.tokenBalances[this.coldAddress]
            return BigNumber(amount).isGreaterThan(BigNumber(balance))
        },
        options(addrs) {
            return Object.keys(addrs).reduce((options, addr) => {
                options.push({ value: addr, text: addr })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a wallet address</span>', disabled: true }])
        },
        getKeypair(index) {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, index).keyPair
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
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
    margin-left: 350px;
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
    padding-right: 35px;
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
    border: 1px solid #E8E9ED !important;
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
