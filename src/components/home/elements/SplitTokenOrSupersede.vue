<template>
  <b-modal :id="'splitTokenOrSupersedeModal_' + tokenId"
           centered
           lazy
           title="SplitTokenOrSupersede"
           hide-footer
           hide-header
           ref="splitTokenOrSupersedeModal"
           :busy="true"
           @hidden="resetPage">
    <button
      class="close btn-close"
      @click="endSend">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs>
      <b-tab title="Hot Wallet"
             :disabled="!pageId || walletType==='coldWallet'"
             :active="walletType==='hotWallet'">
        <b-container
          class="text-left"
          v-if="pageId===1">
          <b-form-group :label="functionName === 'Split Token' ? 'Issuer Wallet Address' : 'Maker Wallet Address'"
                        label-for="address-input">
            <b-form-input id=address-input
                          class="address-input"
                          readonly
                          v-model="issuerOrMaker"
                          :state="isValidMakerOrIssuer"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot {{ functionName === 'Split Token' ? 'split' : 'supersede' }} token. You are not {{ functionName === 'Split Token' ? 'issuer' : 'maker' }} of this token.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <div v-if="functionName === 'Split Token'"
                 class="unity">Current Unity {{ tokenUnity.toString() }}</div>
          </b-form-group>
          <b-form-group v-if="functionName === 'Supersede'"
                        label="New Issuer"
                        label-for="amount-input">
            <b-form-input id="recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="newIssuer"
                          :state="isValidIssuer"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <img src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 @click="scanChange"
                 title="scan qr-code">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid Address or Same as Current Issuer (if using QR code scanner, make sure QR code is correct).
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
          <b-form-group v-if="functionName === 'Split Token' && unityInputMode === 0">
            <span style="font-size: 15px !important;color: #9091A3;">New Unity: 10<sup>{{ barUnity }}</sup> (The minimum amount will be {{ formatter(1/Math.pow(10, barUnity)) }} Token)</span>
            <div style="margin-top: 10px;">
              <span class="unity-number">10<sup>0</sup></span>
              <button class="bar-minus"
                      @click="minus">-</button>
              <b-progress :value="barUnity"
                          :max="maxUnity"
                          variant="warning"
                          show-value
                          class="pg-bar"></b-progress>
              <button class="bar-plus"
                      @click="plus">+</button>
              <span class="unity-number-second">10<sup>16</sup></span>
            </div>
          </b-form-group>
          <b-form-group v-if="functionName === 'Split Token' && unityInputMode === 1"
                        label="New Unity"
                        label-for="amount-input">
            <b-form-input id="recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="newUnity"
                          :state="isValidUnity"
                          aria-describedby="inputLiveFeedback">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isValidNumFormat">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!isInteger">
              Integer number is allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isGreaterThanMax">
              Unity is too large. Please change it to an integer less than 9223372036854775808.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Unity.
            </b-form-invalid-feedback>
            <p v-show="!isMultipleOfTwoOrFive && isValidUnity"
               class="text-danger"><small>Warnning: If the Unity is not a multiple of 2 or 5, the amount display issue would be occurred. And you might not pay in fully precision.</small></p>
          </b-form-group>
          <button v-if="functionName === 'Split Token'"
                  class="unity-mode-btn"
                  @click="changeUnityMode">{{ unityInputMode === 0 ? 'Free Input Mode' : 'Slider Bar Mode' }}</button>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance</span>
            <span v-if="!isSplit && functionName === 'Split Token'"
                  class="vsys-check">Cannot change unity. This token does not support split function.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled"
                    @click="nextPage">{{ functionName === 'Split Token' ? 'Change' : 'Continue' }}
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :new-issuer="newIssuer"
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="functionName">
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
                @click="sendData('hotWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="pageId===3">
          <TokenSuccess class="tokenSucced"
                        :address="address"
                        :new-issuer="newIssuer"
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="functionName">
          </TokenSuccess>
          <b-button variant="warning"
                    block
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
      <b-tab title="Cold Wallet"
             :disabled="!coldPageId || walletType==='hotWallet'"
             :active="walletType==='coldWallet'">
        <b-container v-if="coldPageId===1"
                     class="text-left">
          <b-form-group :label="functionName === 'Split Token' ? 'Wallet Address' : 'Maker Wallet Address'"
                        label-for="wallet-address">
            <b-form-input id=coldAddress-input
                          class="address-input"
                          readonly
                          v-model="issuerOrMaker"
                          :state="isValidMakerOrIssuer"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot {{ functionName === 'Split Token' ? 'split' : 'supersede' }} token. You are not {{ functionName === 'Split Token' ? 'issuer' : 'maker' }} of this token.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <div v-if="functionName === 'Split Token'"
                 class="unity">Current Unity {{ tokenUnity.toString() }}</div>
          </b-form-group>
          <b-form-group v-if="functionName === 'Supersede'"
                        label="New Issuer"
                        label-for="cold-amount-input">
            <b-form-input id="cold-recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="newIssuer"
                          :state="isValidIssuer"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <img src="@/assets/imgs/icons/operate/ic_qr_code_line.svg"
                 v-b-tooltip.hover
                 class="qr-code"
                 @click="scanChange"
                 title="scan qr-code">
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid Address or Same as Current Issuer (if using QR code scanner, make sure QR code is correct).
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
          <b-form-group v-if="functionName === 'Split Token' && unityInputMode === 0">
            <span style="font-size: 15px !important;color: #9091A3;">New Unity: 10<sup>{{ barUnity }}</sup> (The minimum amount will be {{ formatter(1/Math.pow(10, barUnity)) }} Token)</span>
            <div style="margin-top: 10px;">
              <span class="unity-number">10<sup>0</sup></span>
              <button class="bar-minus"
                      @click="minus">-</button>
              <b-progress :value="barUnity"
                          :max="maxUnity"
                          variant="warning"
                          show-value
                          class="pg-bar"></b-progress>
              <button class="bar-plus"
                      @click="plus">+</button>
              <span class="unity-number-second">10<sup>16</sup></span>
            </div>
          </b-form-group>
          <b-form-group v-if="functionName === 'Split Token' && unityInputMode === 1"
                        label="New Unity"
                        label-for="cold-amount-input">
            <b-form-input id="cold-recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="newUnity"
                          :state="isValidUnity"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isValidNumFormat">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!isInteger">
              Integer number is allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isGreaterThanMax">
              Unity is too large. Please change it to an integer less than 9223372036854775808.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Unity.
            </b-form-invalid-feedback>
          </b-form-group>
          <p v-show="!isMultipleOfTwoOrFive && isValidUnity && unityInputMode === 1"
             class="text-danger"><small>Warnning: If the Unity is not a multiple of 2 or 5, the amount display issue would be occurred. And you might not pay in fully precision.</small></p>
          <button v-if="functionName === 'Split Token'"
                  class="unity-mode-btn"
                  @click="changeUnityMode">{{ unityInputMode === 0 ? 'Free Input Mode' : 'Slider Bar Mode' }}</button>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance</span>
            <span v-if="!isSplit && functionName === 'Split Token'"
                  class="vsys-check">Cannot change unity. This token does not support split function.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isSubmitDisabled"
                    @click="nextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="address"
                        :new-issuer="newIssuer"
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="functionName">
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
                         :transaction-bytes="dataObject.toBytes()"
                         :qr-total-page="1"
                         v-if="coldPageId===3"
                         :cold-public-key = "coldAddresses[address].publicKey"
                         @get-signature="getSignature"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="address"
                        :new-issuer="newIssuer"
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="functionName">
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
                        :address="address"
                        :new-issuer="newIssuer"
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="functionName">
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
import { CONTRACT_EXEC_FEE, SPLIT_FUNCIDX, SUPERSEDE_FUNCIDX, FEE_SCALE, API_VERSION, PROTOCOL, OPC_ACCOUNT } from '@/js-v-sdk/src/constants'
import { NETWORK_BYTE } from '@/network'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import common from '@/js-v-sdk/src/utils/common'
import Transaction from '@/js-v-sdk/src/transaction'
import BigNumber from 'bignumber.js'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'SplitTokenOrSupersede',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    data: function() {
        return {
            errorMessage: '',
            barUnity: 8,
            newUnity: 0,
            newIssuer: '',
            pageId: 1,
            fee: BigNumber(CONTRACT_EXEC_FEE),
            coldPageId: 1,
            scanShow: false,
            qrInit: false,
            qrErrMsg: void 0,
            maxUnity: 16,
            paused: false,
            sendError: false,
            coldSignature: '',
            timeStamp: Date.now() * 1e6,
            hasConfirmed: false,
            unityInputMode: 0
        }
    },
    props: {
        tokenBalance: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        balance: {
            type: BigNumber,
            default: function() {
            },
            require: true
        },
        issuerOrMaker: {
            type: String,
            default: function() {
            },
            require: true
        },
        isSplit: {
            type: Boolean,
            default: false
        },
        tokenUnity: {
            type: BigNumber,
            default: function() {
            },
            require: true
        },
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true// Can not be removed ,cause this is an inherited property may be used somewhere
        },
        maxSupply: {
            type: BigNumber,
            default: function() {
            },
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
        tokenId: {
            type: String,
            default: '',
            require: true
        },
        maker: {
            type: String,
            default: '',
            require: true
        },
        issuer: {
            type: String,
            default: '',
            require: true
        },
        functionName: {
            type: String,
            default: 'Split Token',
            require: true
        },
        address: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account'
        }),
        newFinalUnity() {
            return this.unityInputMode === 0 ? Math.pow(10, this.barUnity) : this.newUnity
        },
        contractId() {
            return common.tokenIDToContractID(this.tokenId)
        },
        defaultAddress() {
            return Vue.ls.get('address')
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
        isSubmitDisabled() {
            if (this.unityInputMode === 0 && this.functionName === 'Split Token') {
                return false
            } else {
                return !(this.isValidMakerOrIssuer && !this.isInsufficient && (this.functionName === 'Split Token' ? (this.isSplit && this.isValidUnity) : this.isValidIssuer))
            }
        },
        isInsufficient() {
            return BigNumber(this.balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
        },
        inputUnity() {
            return this.unityInputMode === 0 ? BigNumber(Math.pow(10, this.barUnity)) : BigNumber(this.newUnity)
        },
        isValidUnity() {
            if (BigNumber(this.newUnity).isEqualTo(0)) {
                return void 0
            }
            return this.isValidNumFormat && !this.isNegative && this.isInteger && !this.isGreaterThanMax
        },
        isValidIssuer() {
            let issuer = this.newIssuer
            if (!issuer) {
                return void 0
            }
            if (this.issuer === issuer) {
                return false
            }
            let isValid = false
            try {
                isValid = this.account.checkAddress(issuer)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isValidMakerOrIssuer() {
            return this.address === this.issuerOrMaker
        },
        isValidNumFormat() {
            return common.isValidNumFormat(this.newUnity)
        },
        isNegative() {
            return BigNumber(this.newUnity).isLessThan(0)
        },
        isGreaterThanMax() {
            let maxValue = BigNumber(2).exponentiatedBy(63).minus(1)
            let unityValue = BigNumber(this.newUnity)
            return unityValue.isGreaterThan(maxValue)
        },
        isMultipleOfTwoOrFive() {
            return this.newUnity % 2 === 0 || this.newUnity % 5 === 0
        },
        isInteger() {
            return BigNumber(this.newUnity).isInteger()
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.address].publicKey)
            return tra
        }
    },
    methods: {
        ...mapActions(['updateBalance']),
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            let functionIndex = this.functionName === 'Split Token' ? SPLIT_FUNCIDX : SUPERSEDE_FUNCIDX
            let functionData = this.functionName === 'Split Token' ? {'new_unity': BigNumber(this.newFinalUnity)} : {'new_issuer': (this.newIssuer)}
            tra.buildExecuteContractTx(publicKey, this.contractId, functionIndex, functionData, this.timeStamp)
            return tra
        },
        sendData(walletType) {
            let sendTx
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.fee = BigNumber(CONTRACT_EXEC_FEE)
                this.feeScale = FEE_SCALE
                let builtTransaction = this.buildTransaction(this.getKeypair(this.addresses[this.address]).publicKey)
                this.account.buildFromPrivateKey(this.getKeypair(this.addresses[this.address]).privateKey)
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
                    this.hasConfirmed = true
                } else {
                    this.coldPageId++
                }
                this.updateBalance(true)
                if (this.functionName === 'Split Token') {
                    for (let delayTime = 6000; delayTime <= 54000; delayTime *= 3) { //  Refresh interval will be 6s, 18s, 54s
                        setTimeout(this.unityChange, delayTime)
                    }
                }
            }, respErr => {
                this.errorMessage = respErr.body.message
                if (this.errorMessage === undefined) {
                    this.errorMessage = 'Failed reason: Unknown.Please check network connection!'
                }
                this.sendError = true
            })
        },
        nextPage() {
            if (this.walletType === 'hotWallet') {
                this.timeStamp = Date.now() * 1e6
                this.hasConfirmed = false
                this.pageId++
            } else {
                this.sendError = false
                this.coldPageId++
            }
        },
        prevPage() {
            this.sendError = false
            let pageId = this.walletType === 'hotWallet' ? --this.pageId : --this.coldPageId
            if (pageId === 0) {
                this.$refs.splitTokenOrSupersedeModal.hide()
            }
        },
        resetPage() {
            this.sendError = false
            this.timeStamp = Date.now() * 1e6
            this.errorMessage = ''
            this.newUnity = 0
            this.barUnity = 8
            this.newIssuer = ''
            this.pageId = 1
            this.coldPageId = 1
            this.scanShow = false
            this.qrInit = false
            this.qrErrMsg = void 0
            this.paused = false
            this.unityInputMode = 0
            this.coldSignature = ''
        },
        endSend() {
            this.$refs.splitTokenOrSupersedeModal.hide()
        },
        unityChange() {
            this.$emit('updateToken', 'update')
        },
        changeUnityMode() {
            this.unityInputMode = this.unityInputMode === 0 ? 1 : 0
        },
        minus() {
            if (this.barUnity > 0) {
                this.barUnity--
            }
        },
        plus() {
            if (this.barUnity < 16) {
                this.barUnity++
            }
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
                this.newIssuer = jsonObj.address
                let opc = jsonObj.opc
                let api = jsonObj.api
                let protocol = jsonObj.protocol
                if (protocol !== PROTOCOL) {
                    this.paused = false
                    this.qrErrMsg = 'Invalid QR code protocol.'
                } else if (api > API_VERSION) {
                    this.paused = false
                    this.qrErrMsg = 'API version mismatch.'
                } else if (opc !== OPC_ACCOUNT) {
                    this.paused = false
                    this.qrErrMsg = 'Wrong operation code in QR code.'
                } else if (!this.isValidIssuer) {
                    this.paused = false
                    this.qrErrMsg = 'Invalid address of new issuer.'
                } else {
                    this.qrErrMsg = void 0
                }
            } catch (e) {
                this.newIssuer = decodeString
                if (!this.isValidIssuer) {
                    this.newIssuer = 'please scan QR code of new issuer'
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
.address-input {
    border: 1px solid #E8E9ED;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
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
.tokenSucced {
    text-align: center;
}
.unity-mode-btn {
    background: transparent;
    margin-bottom: 6px;
    border: none;
    color: #FF8837;
    margin-right: 15px;
    font-size: 16px;
    font-weight: lighter;
    height: 25px;
}
.unity-number {
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.unity-number-second {
    position:absolute;
    margin-left: 332px;
    margin-top: 2px;
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.bar-minus {
    position: absolute;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin-left: 2px;
    color: #fff !important;
    background-color: #FF8737 !important;
    border-color: #FF8737 !important;
    border-radius: 50%;
}
.bar-plus {
    position: absolute;
    margin-left: 307px;
    margin-right: 2px;
    color: #fff !important;
    background-color: #FF8737 !important;
    border-color: #FF8737 !important;
    width: 24px;
    height: 24px;
    border-radius: 50%;
}
.pg-bar {
    position: absolute;
    margin-top: -18px;
    margin-left: 55px;
    padding-top: 0px;
    width: 271px;
    height: 16px;
}
.vsys-check {
    display: block;
    margin-top: -10px;
    font-size: 80%;
    color: #dc3545;
}
.unity {
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: left;
}
</style>
