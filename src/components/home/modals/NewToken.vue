<template>
  <b-modal id="newTokenModal"
           centered
           lazy
           title="Send"
           hide-footer
           hide-header
           ref="newTokenModal"
           :busy="true"
           style="padding-left: 0px;"
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
          style="text-align: left;"
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
                Balance
              </span>
              <span class="balance">{{ formatter(balances[address]) }} VSYS</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Contract Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="contractDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="You can not change the description later"
                             :state="isValidAttachment(contractDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Token Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="tokenDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="You can not change the description later"
                             :state="isValidAttachment(tokenDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Max Supply"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('hot')"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!checkPrecision(amount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isInsufficient('hot')">
              Insufficient VSYS balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(amount)">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isBiggerThanMax(amount)">
              Too many significant digits for amount. Please reduce unity.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!isNumFormatValid(amount)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <span style="font-size: 15px !important;color: #9091A3;">Unity: 10^{{ unity }}</span>
            <div style="margin-top: 10px;">
              <span class="unity-number">10<sup>0</sup></span>
              <button class="bar-minus"
                      @click="minus">-</button>
              <b-progress :value="unity"
                          :max="maxUnity"
                          variant="warning"
                          show-value
                          class="pg-bar"></b-progress>
              <button class="bar-plus"
                      @click="plus">+</button>
              <span class="unity-number-second">10<sup>16</sup></span>
            </div>
          </b-form-group>
          <div style="margin-top: 10px;">
            <img id="img_read"
                 @click="changeIcon"
                 style="font-size: 15px;z-index: 100;"
                 src="@/assets/imgs/icons/signup/ic_check.svg"> Support split/reverse-split token<span style="font-size: 13px;color: #9091A3;letter-spacing: 0;"> (Attention: cannot change after create)</span>
          </div>
          <b-form-group style="margin-top: 10px;">
            <label class="fee-remark">Transaction Fee {{ Number(fee) }} VSYS</label>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled"
                    @click="nextPage()">Continue
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Register New Token'">
          </TokenConfirm>
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
                :disabled="hasConfirmed"
                @click="sendData('hotWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="pageId===3">
          <TokenSuccess :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Register New Token'">
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
              <span class="balance-title">Balance
              </span>
              <span class="balance">{{ formatter(balances[coldAddress]) }} VSYS</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Contract Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="coldContractDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="You can not change the description later"
                             :state="isValidAttachment(coldContractDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Token Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="coldTokenDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="You can not change the description later"
                             :state="isValidAttachment(coldTokenDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Max Supply"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="coldAmount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('cold')"
                          onfocus="this.select()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!checkPrecision(coldAmount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isInsufficient('cold')">
              Insufficient VSYS balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(coldAmount)">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!isNumFormatValid(coldAmount)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isBiggerThanMax(coldAmount)">
              Too many significant digits for amount. Please reduce unity.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <span style="font-size: 15px !important;color: #9091A3;">Unity: 10^{{ unity }}</span>
            <div style="margin-top: 10px;">
              <span class="unity-number">10<sup>0</sup></span>
              <button class="bar-minus"
                      @click="minus">-</button>
              <b-progress :value="unity"
                          :max="maxUnity"
                          variant="warning"
                          show-value
                          class="pg-bar"></b-progress>
              <button class="bar-plus"
                      @click="plus">+</button>
              <span class="unity-number-second">10<sup>16</sup></span>
            </div>
          </b-form-group>
          <div style="margin-top: 10px;">
            <img id="img_read_cold"
                 @click="changeColdIcon"
                 style="font-size: 15px;z-index: 100;"
                 src="@/assets/imgs/icons/signup/ic_check.svg"> Support split/merge token<span style="font-size: 13px;color: #9091A3;letter-spacing: 0;"> (Attention: cannot change after create)</span>
          </div>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ Number(coldFee) }} VSYS</label>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isColdSubmitDisabled"
                    @click="coldNextPage()">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(coldAmount)
                        :fee="coldFee"
                        :tx-type="'Register New Token'">
          </TokenConfirm>
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
                @click=" getQrArray(); coldNextPage()">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="coldPageId===3"
                     class="text-left">
          <ColdSignature :data-object="dataObject"
                         :qr-total-page="qrPage"
                         :qr-array="getArray"
                         v-if="coldPageId===3"
                         @get-signature="getSignature"
                         @next-page="coldNextPage"
                         @prev-page="coldPrevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(coldAmount)
                        :fee="coldFee"
                        :tx-type="'Register New Token'">
          </TokenConfirm>
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
          <TokenSuccess :address="coldAddress"
                        :amount=inputAmount(coldAmount)
                        :fee="coldFee"
                        :tx-type="'Register New Token'">
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
import { CONTRACT, CONTRACT_WITH_SPLIT } from '@/contract'
import seedLib from '@/libs/seed.js'
import { NODE_IP, OPC_CONTRACT, TRANSFER_ATTACHMENT_BYTE_LIMIT, VSYS_PRECISION, TOKEN_FEE, FEE_SCALE, API_VERSION, PROTOCOL } from '@/constants.js'
import TokenConfirm from './TokenConfirm'
import TokenSuccess from './TokenSuccess'
import ColdSignature from './ColdSignature'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import imgread1 from '@/assets/imgs/icons/signup/ic_check.svg'
import imgread2 from '@/assets/imgs/icons/signup/ic_check_selected.svg'
import base58 from '@/libs/base58'
import bus from '@/assets/bus'
import common from '@/utils/common'
var initData = {
    opc: '',
    qrArray: new Array(0),
    support: false,
    recipient: '',
    amount: BigNumber(0),
    attachment: '',
    qrTotalPage: 1,
    pageId: 1,
    fee: BigNumber(TOKEN_FEE),
    coldRecipient: '',
    coldAmount: BigNumber(0),
    coldPageId: 1,
    coldFee: BigNumber(TOKEN_FEE),
    address: this ? (this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress) : '',
    coldAddress: this ? (this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress) : '',
    scanShow: false,
    qrInit: false,
    qrErrMsg: void 0,
    paused: false,
    unity: 8,
    sendError: false,
    coldSignature: '',
    maxUnity: 16,
    timeStamp: Date.now() * 1e6,
    hasConfirmed: false,
    tokenId: '',
    tokens: {},
    contractDescription: '',
    tokenDescription: '',
    coldContractDescription: '',
    coldTokenDescription: '',
    stopPara: 0,
    stopParaArr: [],
    eventPool: {}
}
export default {
    name: 'NewToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    props: {
        balances: {
            type: Object,
            default: function() {
            },
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
            default: this ? this.defaultAddress : undefined,
            require: true
        }
    },
    data: function() {
        return initData
    },
    watch: {
        eventFlag() {
            for (var i in this.stopParaArr) {
                clearTimeout(this.stopParaArr[i])
            }
        }
    },
    computed: {
        defaultAddress() {
            return Vue.ls.get('address')
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        eventFlag() {
            if (this.$store.state.eventPool) {
                var event = this.$store.state.eventPool
                for (var index in event) {
                    if (index === this.tokenId) {
                        return event[index].removeToken
                    }
                }
            }
            return false
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
            return !(BigNumber(this.amount).isGreaterThan(0) && !this.isInsufficient('hot') && (this.isValidAttachment(this.contractDescription) || !this.contractDescription) && (this.isValidAttachment(this.tokenDescription) || !this.tokenDescription) && this.isAmountValid('hot') && this.address !== '')
        },
        isColdSubmitDisabled() {
            return !(BigNumber(this.coldAmount).isGreaterThan(0) && (this.isValidAttachment(this.coldContractDescription) || !this.coldContractDescription) && (this.isValidAttachment(this.coldTokenDescription) || !this.coldTokenDescription) && this.isAmountValid('cold') && this.coldAddress !== '')
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        dataObject() {
            return {
                protocol: PROTOCOL,
                api: this.coldApi(),
                opc: OPC_CONTRACT,
                address: this.coldAddress,
                senderPublicKey: this.coldAddresses[this.coldAddress].publicKey,
                fee: this.coldFee * VSYS_PRECISION,
                feeScale: FEE_SCALE,
                timestamp: Date.now(),
                contract: this.support === false ? CONTRACT : CONTRACT_WITH_SPLIT,
                description: this.coldContractDescription,
                contractInit: base58.encode(transaction.prepareCreate(BigNumber(this.coldAmount).multipliedBy(BigNumber(Math.pow(10, this.unity))), BigNumber(Math.pow(10, this.unity)), this.coldTokenDescription)[0]),
                contractInitTextual: 'init(max=' + BigNumber(this.coldAmount) + ',unity=' + BigNumber(Math.pow(10, this.unity)) + ',tokenDescription=\'' + this.coldTokenDescription + '\')',
                contractInitExplain: 'Create token ' + (this.support === false ? '' : '(support split)') + ' with max supply ' + BigNumber(this.coldAmount)
            }
        },
        qrPage() {
            return this.qrTotalPage
        },
        getArray() {
            return this.qrArray
        }
    },
    methods: {
        isValidAttachment(attachment) {
            if (!attachment) {
                return void 0
            }
            return common.getLength(attachment) <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        getQrArray() {
            const qrSize = 300
            let tempDataObject = JSON.parse(JSON.stringify(this.dataObject))
            delete tempDataObject.senderPublicKey
            const text = JSON.stringify(tempDataObject)
            var page = Math.ceil(text.length / qrSize)
            var textArray = Array(page)
            if (tempDataObject.opc === 'contract') {
                this.qrTotalPage = page
                for (var i = 0; i < this.qrTotalPage; i++) {
                    textArray[i] = text.slice(i * qrSize, (i + 1) * qrSize)
                }
            }
            this.qrArray = textArray
        },
        changeIcon() {
            if (this.support === false) {
                document.getElementById('img_read').src = imgread2
                this.support = true
            } else {
                document.getElementById('img_read').src = imgread1
                this.support = false
            }
        },
        changeColdIcon() {
            if (this.support === false) {
                document.getElementById('img_read_cold').src = imgread2
                this.support = true
            } else {
                document.getElementById('img_read_cold').src = imgread1
                this.support = false
            }
        },
        inputAmount(num) {
            return BigNumber(num)
        },
        minus() {
            if (this.unity > 0) {
                this.unity--
            }
        },
        plus() {
            if (this.unity < 16) {
                this.unity++
            }
        },
        coldApi: function() {
            return API_VERSION
        },
        sendData: function(walletType) {
            let apiSchema
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                this.feeScale = FEE_SCALE
                const dataInfo = {
                    contract: this.support === false ? CONTRACT : CONTRACT_WITH_SPLIT,
                    senderPublicKey: this.getKeypair(this.addresses[this.address]).publicKey,
                    fee: TOKEN_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.timeStamp,
                    initData: base58.encode(transaction.prepareCreate(BigNumber(this.amount).multipliedBy(BigNumber(Math.pow(10, this.unity))), BigNumber(Math.pow(10, this.unity)), this.tokenDescription)[0]),
                    description: this.contractDescription,
                    signature: transaction.prepareRegContractSignature(this.support === false ? CONTRACT : CONTRACT_WITH_SPLIT, transaction.prepareCreate(BigNumber(this.amount).multipliedBy(BigNumber(Math.pow(10, this.unity))), BigNumber(Math.pow(10, this.unity)), this.tokenDescription), this.contractDescription, BigNumber(this.fee * VSYS_PRECISION), this.feeScale, BigNumber(this.timeStamp), this.getKeypair(this.addresses[this.address]).privateKey)
                }
                apiSchema = dataInfo
            } else if (walletType === 'coldWallet') {
                const coldDataInfo = {
                    contract: this.support === false ? CONTRACT : CONTRACT_WITH_SPLIT,
                    senderPublicKey: this.coldAddresses[this.coldAddress].publicKey,
                    fee: TOKEN_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.dataObject.timestamp,
                    initData: base58.encode(transaction.prepareCreate(BigNumber(this.coldAmount).multipliedBy(BigNumber(Math.pow(10, this.unity))), BigNumber(Math.pow(10, this.unity)), this.coldTokenDescription)[0]),
                    description: this.coldContractDescription,
                    signature: this.coldSignature
                }
                apiSchema = coldDataInfo
            }
            const url = NODE_IP + '/contract/broadcast/register'
            this.$http.post(url, apiSchema).then(response => {
                if (walletType === 'hotWallet') {
                    this.pageId++
                } else {
                    this.coldPageId++
                }
                this.tokenId = transaction.contractIDToTokenID(response.body.contractId)
            }, response => {
                this.sendError = true
            })
            this.$emit('endSendSignal')
        },
        nextPage: function() {
            this.sendError = false
            this.timeStamp = Date.now() * 1e6
            this.hasConfirmed = false
            this.pageId++
        },
        coldNextPage: function() {
            this.sendError = false
            this.coldPageId++
        },
        prevPage: function() {
            this.sendError = false
            if (this.pageId === 1) {
                this.$refs.newTokenModal.hide()
            } else {
                this.pageId--
            }
        },
        coldPrevPage: function() {
            this.sendError = false
            if (this.coldPageId === 1) {
                this.$refs.newTokenModal.hide()
            } else {
                this.coldPageId--
            }
        },
        resetPage: function() {
            this.opc = ''
            this.unity = 8
            this.qrTotalPage = 1
            this.qrArray = new Array(0)
            this.recipient = ''
            this.amount = BigNumber(0)
            this.pageId = 1
            this.coldRecipient = ''
            this.coldAmount = BigNumber(0)
            this.coldPageId = 1
            this.scanShow = false
            this.qrInit = false
            this.paused = false
            this.qrErrMsg = void 0
            this.sendError = false
            this.coldSignature = ''
            this.support = false
            this.address = this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
            this.contractDescription = ''
            this.tokenDescription = ''
            this.coldContractDescription = ''
            this.coldTokenDescription = ''
        },
        endSend: function() {
            this.$refs.newTokenModal.hide()
            for (let delayTime = 6000; delayTime < 150100; delayTime *= 5) { //  Refresh interval will be 6s, 30s, 150s
                this.stopPara = setTimeout(this.sendToAdd, delayTime)
                this.stopParaArr.push(this.stopPara)
            }
            var tmp = {}
            Vue.set(tmp, 'newToken', this.stopParaArr)
            tmp['removeToken'] = false
            Vue.set(this.eventPool, this.tokenId, JSON.parse(JSON.stringify(tmp)))
            this.$store.commit('changeEventPool', this.eventPool)
        },
        sendToAdd: function() {
            if (this.userInfo && this.userInfo.tokens) {
                this.tokens = JSON.parse(this.userInfo.tokens)
            }
            const url = NODE_IP + '/contract/tokenInfo/' + this.tokenId
            this.$http.get(url).then(response => {
                Vue.set(this.tokens, this.tokenId, JSON.parse(JSON.stringify(this.tokenId)))
                this.setUsrLocalStorage('tokens', JSON.stringify(this.tokens))
                let sendFlag = true
                bus.$emit('sendFlag', sendFlag)
            }, respError => {
            })
        },
        setUsrLocalStorage(fieldname, value) {
            Vue.set(this.userInfo, fieldname, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(this.userInfo))
        },
        scanChange: function(evt) {
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
            if (BigNumber(amount).isEqualTo(0) && !this.isInsufficient(type)) {
                return void 0
            }
            return this.checkPrecision(amount) && this.isNumFormatValid(amount) && !this.isBiggerThanMax(amount) && !this.isNegative(amount)
        },
        isNegative(amount) {
            return BigNumber(amount).isLessThan(0)
        },
        isBiggerThanMax(amount) {
            var maxValue = BigNumber(2).exponentiatedBy(63).minus(1)
            var unityValue = BigNumber(10).exponentiatedBy(this.unity)
            var value = BigNumber(amount).multipliedBy(unityValue)
            if (value.isGreaterThan(maxValue)) {
                return true
            } else {
                return false
            }
        },
        isNumFormatValid(amount) {
            return common.isNumFormatValid(amount)
        },
        checkPrecision(amount) {
            return common.checkPrecision(amount, this.unity)
        },
        isInsufficient(type) {
            var balance = type === 'hot' ? this.balances[this.address] : this.balances[this.coldAddress]
            return BigNumber(balance).isLessThan(BigNumber(TOKEN_FEE))
        },
        options(addrs) {
            return Object.keys(addrs).reduce((options, addr) => {
                options.push({ value: addr, text: addr })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a wallet address</span>', disabled: true }])
        },
        getKeypair: function(index) {
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

textarea::-webkit-input-placeholder {
    font-family: Roboto-Regular;
    text-align: left;
    font-size: 15px;
    color: #C0C1CC;
    padding-top: 5px;
    letter-spacing: 0;
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
.col-form-label {
    font-family: Roboto-Regular;
    font-size: 15px;
    color: red !important;
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
</style>
