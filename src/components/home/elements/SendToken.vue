<template>
  <b-modal :id="'sendTokenModal_' + tokenId + from3rdParty"
           centered
           lazy
           title="SendToken"
           hide-footer
           hide-header
           ref="sendTokenModal"
           :busy="true"
           @show="showPage"
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
                          :readonly="inheritedRecipient !== '' && from3rdParty"
                          :state="isValidRecipient"
                          list="showHotRecipientList"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <datalist v-if="!from3rdParty"
                      id="showHotRecipientList">
              <option v-if="!aliasAddressList && hotRecipientAddressList"
                      v-for="addr in hotRecipientAddressList.keys()"
                      :key="addr">{{ addr }}</option>
              <option v-if="aliasAddressList"
                      v-for="(addr, index) in aliasAddressList"
                      :key="index">{{ addr + " (" + index + ")" }}</option>
            </datalist>
            <img v-if="!from3rdParty"
                 src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 @click="scanChange"
                 title="scan qr-code">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid recipient address (if using QR code scanner, make sure QR code is correct).
            </b-form-invalid-feedback>
            <div v-if="scanShow && !from3rdParty">
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
                          :readonly="inheritedAmount !== '' && from3rdParty"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidAmount"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isValidNumFormat">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isTokenInsufficient">
              Insufficient token
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative">
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
                             v-model="description"
                             :rows="3"
                             :readonly="inheritedDescription !== '' && from3rdParty"
                             :no-resize="true"
                             aria-describedby="inputDescriptionLiveFeedback"
                             :state="isValidDescription">
            </b-form-textarea>
            <b-form-invalid-feedback id="inputDescriptionLiveFeedback"
                                     v-if="!isValidDescription">
              The length of description is too long. It exceeds the max limit of 140.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS </label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled"
                    @click="nextPage(); addRecipientList();">Continue
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :recipient="recipient"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :description="description"
                        :tx-type="'Send Token'">
          </TokenConfirm>
          <p v-show="sendError"
             class="text-danger"><small>Sorry, transaction send failed! Failed reason: {{ errorMessage }}</small></p>
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
                        :description="description"
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
            <span class="cold-check"
                  v-if="!isValidPublicKey">This cold wallet has invalid public key! If you import this cold wallet manually, please delete it and import it again.</span>
          </b-form-group>
          <b-form-group label="Recipient"
                        label-for="cold-recipient-input">
            <b-form-input id="cold-recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="recipient"
                          :readonly="inheritedRecipient !=='' && from3rdParty"
                          :state="isValidRecipient"
                          list="showColdRecipientList"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <datalist v-if="!from3rdParty"
                      id="showColdRecipientList">
              <option v-if="!aliasAddressList && coldRecipientAddressList"
                      v-for="addr in coldRecipientAddressList.keys()"
                      :key="addr"> {{ addr }}</option>
              <option v-if="aliasAddressList"
                      v-for="(addr, index) in aliasAddressList"
                      :key="index">{{ addr + " (" + index + ")" }}</option>
            </datalist>
            <img v-if="!from3rdParty"
                 src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 title="scan qr-code"
                 @click="scanChange">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid recipient address (if using QR code scanner, make sure QR code is correct).
            </b-form-invalid-feedback>
            <div v-if="scanShow && !from3rdParty">
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
                          v-model="amount"
                          :readonly="inheritedAmount !== '' && from3rdParty"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidAmount"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isValidNumFormat">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision">
              The number in this field is invalid. It may exceed the maximum number of digits after the decimal point.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isTokenInsufficient">
              Insufficient token
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative">
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
                             v-model="description"
                             :rows="3"
                             :no-resize="true"
                             :readonly="inheritedDescription !== '' && from3rdParty"
                             aria-describedby="inputDescriptionLiveFeedback"
                             :state="isValidDescription">
            </b-form-textarea>
            <b-form-invalid-feedback id="inputDescriptionLiveFeedback"
                                     v-if="!isValidDescription">
              The length of description is too long. It exceeds the max limit of 140.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS </label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isSubmitDisabled"
                    @click="nextPage();addRecipientList()">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="getAddressFromDataObject"
                        :recipient="getRecipientFromDataObject"
                        :amount="inputAmount(getAmountFromDataObject)"
                        :fee="getFeeFromDataObject"
                        :description="dataObject.stored_tx.attachment"
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
          <ColdSignature :data-object="dataObject.toJsonForColdSignature()"
                         :qr-total-page="1"
                         v-if="coldPageId===3"
                         @get-signature="getSignature"
                         :cold-public-key="coldAddresses[coldAddress].publicKey"
                         :transaction-bytes="dataObject.toBytes()"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="getAddressFromDataObject"
                        :amount="inputAmount(getAmountFromDataObject)"
                        :fee="getFeeFromDataObject"
                        :recipient="getRecipientFromDataObject"
                        :description="dataObject.stored_tx.attachment"
                        :tx-type="'Send Token'">
          </TokenConfirm>
          <p v-show="sendError"
             class="text-danger"><small>Sorry, transaction send failed! Failed reason: {{ errorMessage }}</small></p>
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
                        :address="getAddressFromDataObject"
                        :recipient="getRecipientFromDataObject"
                        :amount="inputAmount(getAmountFromDataObject)"
                        :description="dataObject.stored_tx.attachment"
                        :fee="getFeeFromDataObject"
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
import Vue from 'vue'
import seedLib from '@/libs/seed.js'
import { CONTRACT_EXEC_FEE, VSYS_PRECISION, API_VERSION, PROTOCOL, OPC_ACCOUNT, SEND_FUNCIDX, SEND_FUNCIDX_SPLIT } from '@/js-v-sdk/src/constants'
import { NETWORK_BYTE } from '@/network'
import { TRANSFER_ATTACHMENT_BYTE_LIMIT, MAX_ALIAS_LENGTH } from '@/constants'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import LRUCache from 'lru-cache'
import BigNumber from 'bignumber.js'
import common from '@/js-v-sdk/src/utils/common'
import Transaction from '@/js-v-sdk/src/transaction'
import { mapActions, mapState } from 'vuex'
var initData = {
    errorMessage: '',
    recipient: this ? (this.from3rdParty ? this.inheritedRecipient : '') : '',
    amount: this ? (this.from3rdParty ? (this.inheritedAmount !== '' ? this.inheritedAmount : 0) : 0) : 0,
    description: this ? (this.from3rdParty ? this.inheritedDescription : '') : '',
    pageId: 1,
    fee: BigNumber(CONTRACT_EXEC_FEE),
    coldPageId: 1,
    address: this ? (this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress) : '',
    coldAddress: this ? (this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress) : '',
    selectedWalletType: this ? this.walletType : 'hotWallet',
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
    functionIndex: this ? (this.isSplit ? SEND_FUNCIDX_SPLIT : SEND_FUNCIDX) : SEND_FUNCIDX_SPLIT,
    tmpRecipient: '',
    aliasAddressList: {}
}
export default {
    name: 'SendToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    props: {
        from3rdParty: {
            type: Boolean,
            default: false
        },
        inheritedAmount: {
            type: String,
            default: ''
        },
        inheritedRecipient: {
            type: String,
            default: ''
        },
        inheritedDescription: {
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
        this.aliasAddressList = this.getAlias()
        let item = window.localStorage.getItem('Cold ' + this.defaultColdAddress + ' sendTokenRecipientAddressList ')
        if (item) {
            this.coldRecipientAddressList.load(JSON.parse(item))
        }
        item = window.localStorage.getItem('Hot ' + this.defaultAddress + ' sendTokenRecipientAddressList ')
        if (item) {
            this.hotRecipientAddressList.load(JSON.parse(item))
        }
    },
    watch: {
        amount(newAmount, oldAmount) {
            let balance = this.selectedWalletType === 'hotWallet' ? this.tokenBalances[this.address] : this.tokenBalances[this.coldAddress]
            if (BigNumber(this.amount).isGreaterThan(BigNumber(balance).minus(this.fee))) {
                this.$nextTick(() => {
                    this.amount = Number(balance)
                })
            }
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account',
            paymentRedirect: 'paymentRedirect'
        }),
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
            if (this.userInfo) {
                return JSON.parse(
                    seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
            }
        },
        seedPhrase() {
            if (this.secretInfo) {
                return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
            }
        },
        wordList() {
            return this.seedPhrase.split(' ')
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        isSubmitDisabled() {
            return !(this.isValidPublicKey && this.recipient && this.isValidRecipient && (this.isValidDescription || !this.description) && this.isValidAmount && !this.isInsufficient)
        },
        isNegative() {
            return BigNumber(this.amount).isLessThan(0)
        },
        isValidNumFormat() {
            return common.isValidNumFormat(this.amount)
        },
        checkPrecision() {
            return common.checkPrecision(BigNumber(this.amount).multipliedBy(this.tokenUnity), 0)
        },
        isTokenInsufficient() {
            let balance = this.selectedWalletType === 'hotWallet' ? this.tokenBalances[this.address] : this.tokenBalances[this.coldAddress]
            return BigNumber(this.amount).isGreaterThan(BigNumber(balance))
        },
        coldAddressInfo() {
            if (this.coldAddresses.hasOwnProperty(this.coldAddress)) {
                return this.coldAddresses[this.coldAddress]
            } else {
                return {'api': 1, 'publicKey': '', 'device': 'unknown'}
            }
        },
        isValidRecipient() {
            let recipient = this.recipient
            if (!recipient) {
                return void 0
            }
            let isValid = false
            let pre = recipient.indexOf('(')
            let lat = recipient.indexOf(')')
            if (pre !== -1) {
                recipient = recipient.substr(pre + 1, lat - pre - 1)
                this.recordTmpRecipient(recipient)
            } else {
                this.recordTmpRecipient(recipient)
                let alias = this.getAlias()
                if (recipient.length <= MAX_ALIAS_LENGTH && alias) {
                    for (let key in alias) {
                        if (recipient.toLowerCase() === alias[key].toLowerCase()) {
                            recipient = key
                            break
                        }
                    }
                }
            }
            try {
                isValid = this.account.checkAddress(recipient)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isValidAmount() {
            if (BigNumber(this.amount).isEqualTo(0)) {
                return true
            }
            return this.checkPrecision && this.isValidNumFormat && !this.isTokenInsufficient && !this.isNegative
        },
        isInsufficient() {
            let balance = this.selectedWalletType === 'hotWallet' ? this.balances[this.address] : this.balances[this.coldAddress]
            return BigNumber(balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
        },
        isValidDescription() {
            if (!this.description) {
                return void 0
            }
            return common.getLength(this.description) <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        getAddressFromDataObject() {
            try {
                return this.account.convertPublicKeyToAddress(this.dataObject.stored_tx.senderPublicKey, this.dataObject.network_byte)
            } catch (e) {

            }
        },
        isValidPublicKey() {
            try {
                if (this.selectedWalletType === 'hotWallet') {
                    return true
                } else {
                    return this.coldAddressInfo.address === this.account.convertPublicKeyToAddress(this.coldAddressInfo.publicKey, NETWORK_BYTE)
                }
            } catch (e) {
                return false
            }
        },
        getFeeFromDataObject() {
            return BigNumber(this.dataObject.stored_tx.fee).dividedBy(VSYS_PRECISION)
        },
        selectedKeypair() {
            if (this.seedPhrase) {
                return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, this.addresses[this.address]).keyPair
            } else {
                return { 'privateKey': '', 'publicKey': '' }
            }
        },
        getAmountFromDataObject() {
            return BigNumber(this.dataObject.stored_tx.functionData[1].value).dividedBy(this.tokenUnity)
        },
        getRecipientFromDataObject() {
            return this.dataObject.stored_tx.functionData[0].value
        },
        dataObject() {
            return this.selectedWalletType === 'hotWallet' ? this.buildTransaction(this.selectedKeypair.publicKey) : this.buildTransaction(this.coldAddressInfo.publicKey)
        }
    },
    methods: {
        ...mapActions(['updateBalance', 'updatePaymentRedirect']),
        inputAmount(num) {
            return BigNumber(num)
        },
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            tra.buildSendTokenTx(publicKey, this.tokenId, this.tmpRecipient, this.amount, this.tokenUnity, this.isSplit, this.description, this.timeStamp)
            return tra
        },
        recordTmpRecipient(recipient) {
            let alias = this.getAlias()
            if (recipient.length <= MAX_ALIAS_LENGTH && alias) {
                for (let key in alias) {
                    if (recipient.toLowerCase() === alias[key].toLowerCase()) {
                        this.tmpRecipient = key
                        break
                    }
                }
            } else {
                this.tmpRecipient = recipient
            }
        },
        sendData(walletType) {
            let sendTx
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                let builtTransaction = this.buildTransaction(this.selectedKeypair.publicKey)
                this.account.buildFromPrivateKey(this.selectedKeypair.privateKey)
                let signature = this.account.getSignature(builtTransaction.toBytes())
                sendTx = builtTransaction.toJsonForSendingTx(signature)
            } else if (walletType === 'coldWallet') {
                let signature = this.coldSignature
                sendTx = this.dataObject.toJsonForSendingTx(signature)
            }
            this.chain.sendExecuteContractTx(sendTx).then(response => {
                if (response.hasOwnProperty('error')) {
                    this.errorMessage = response.message
                    this.sendError = true
                    return
                }
                if (walletType === 'hotWallet') {
                    this.pageId++
                } else {
                    this.coldPageId++
                }
                if (this.from3rdParty) {
                    if (this.paymentRedirect.hasOwnProperty('callback')) {
                        let url = this.paymentRedirect['callback']
                        if (url.indexOf('?') !== -1) {
                            url += '&tx_id=' + response.id
                        } else {
                            url += '?tx_id=' + response.id
                        }
                        let times = 1
                        const updateTask = (interval) => {
                            setTimeout(() => {
                                this.$http.post(url).then(response => {
                                }, respErr => {
                                    times++
                                    if (times <= 5) {
                                        updateTask(10000)
                                    }
                                })
                            }, interval)
                        }
                        updateTask(500)
                    }
                    this.updatePaymentRedirect({})
                    this.$router.push('/')
                } else {
                    for (let delayTime = 6000; delayTime <= 54000; delayTime *= 3) { //  Refresh interval will be 6s, 18s, 54s
                        setTimeout(this.sendBalanceChange, delayTime)
                    }
                }
                this.updateBalance(true)
            }, respErr => {
                this.errorMessage = respErr.message
                if (this.errorMessage === undefined) {
                    this.errorMessage = 'Failed reason: Unknown.Please check network connection!'
                }
                this.sendError = true
            })
            this.$emit('endSendSignal')
        },
        addRecipientList() {
            if (this.selectedWalletType === 'hotWallet') {
                this.hotRecipientAddressList.set(this.recipient, '0')
                window.localStorage.setItem('Hot ' + this.defaultAddress + ' sendTokenRecipientAddressList ', JSON.stringify(this.hotRecipientAddressList.dump()))
            } else {
                this.coldRecipientAddressList.set(this.recipient, '0')
                window.localStorage.setItem('Cold ' + this.defaultColdAddress + ' sendTokenRecipientAddressList ', JSON.stringify(this.coldRecipientAddressList.dump()))
            }
        },
        nextPage() {
            this.sendError = false
            this.hasConfirmed = false
            if (this.selectedWalletType === 'hotWallet') {
                this.pageId++
                this.timeStamp = Date.now() * 1e6
            } else {
                this.coldPageId++
            }
        },
        prevPage() {
            this.sendError = false
            let pageId = this.selectedWalletType === 'hotWallet' ? --this.pageId : --this.coldPageId
            if (pageId === 0) {
                this.$refs.sendTokenModal.hide()
            }
        },
        resetPage() {
            this.recipient = this.from3rdParty ? this.inheritedRecipient : ''
            this.amount = this.from3rdParty ? (this.inheritedAmount !== '' ? this.inheritedAmount : 0) : 0
            this.description = this.from3rdParty ? this.inheritedDescription : ''
            this.tmpRecipient = ''
            this.pageId = 1
            this.coldPageId = 1
            this.coldAddress = ''
            this.scanShow = false
            this.qrInit = false
            this.paused = false
            this.qrErrMsg = void 0
            this.sendError = false
            this.coldSignature = ''
            this.timeStamp = Date.now() * 1e6
            this.address = this.selectedWalletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.selectedWalletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
            this.selectedWalletType = this.walletType
        },
        endSend() {
            this.$refs.sendTokenModal.hide()
        },
        sendBalanceChange() {
            this.$emit('updateToken', 'update')
        },
        scanChange(evt) {
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
                this.recipient = jsonObj.address
                let opc = jsonObj.opc
                let api = jsonObj.api
                let protocol = jsonObj.protocol
                let tempAmount = BigNumber(0)
                let tempDescription = ''
                if (jsonObj.hasOwnProperty('amount')) {
                    tempAmount = BigNumber(jsonObj.amount)
                }
                if (jsonObj.hasOwnProperty('invoice')) {
                    tempDescription = jsonObj.invoice
                }
                this.amount = tempAmount.dividedBy(VSYS_PRECISION).decimalPlaces(8).toString()
                this.description = tempDescription
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
                    this.qrErrMsg = 'Invalid address of recipient.'
                } else {
                    this.qrErrMsg = void 0
                }
            } catch (e) {
                this.recipient = decodeString
                if (!this.isValidRecipient) {
                    this.recipient = 'please scan QR code of recipient'
                    this.paused = false
                }
            }
        },
        getSignature(signature) {
            this.coldSignature = signature
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
                this.selectedWalletType = 'hotWallet'
            } else {
                this.coldPageId = 1
                this.selectedWalletType = 'coldWallet'
            }
            this.scanShow = false
        },
        options(addrs) {
            return Object.keys(addrs).reduce((options, addr) => {
                options.push({ value: addr, text: addr })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a wallet address</span>', disabled: true }])
        },
        showPage() {
            this.selectedWalletType = this ? this.walletType : 'hotWallet'
            this.address = this ? (this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress) : ''
            this.coldAddress = this ? (this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress) : ''
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        getAlias() {
            if (!this.defaultAddress) {
                return {}
            }
            let userData = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            if (userData && userData.hasOwnProperty('alias')) {
                return userData.alias
            } else {
                return {}
            }
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
.cold-check {
    display: block;
    margin-top: 5px;
    font-size: 80%;
    color: #dc3545;
}
.vsys-check {
    display: block;
    margin-top: -10px;
    font-size: 80%;
    color: #dc3545;
}
</style>
