<template>
  <b-modal id="createTokenModal"
           centered
           lazy
           title="Create Token"
           hide-footer
           hide-header
           ref="createTokenModal"
           :busy="true"
           style="padding-left: 0px;"
           @hidden="resetPage">
    <button
      class="close btn-close"
      @click="endSend">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs @input="hideQrScan">
      <b-tab title="Hot Wallet"
             :disabled="!pageId"
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
                             placeholder="Max 140 characters. When you have done, this content can not be revised"
                             :state="isValidDescription(contractDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Token Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="tokenDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="Max 140 characters. When you have done, this content can not be revised"
                             :state="isValidDescription(tokenDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Max Supply"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
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
                                     v-else-if="isNegative">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isBiggerThanMax">
              Please reduce Unity scale.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <span style="font-size: 15px !important;color: #9091A3;">Unity: 10<sup>{{ unity }}</sup> (The minimum amount will be {{ formatter(1/Math.pow(10, unity)) }} Token)</span>
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
          <div v-if="tokenSplitStatus"
               style="margin-top: 10px;">
            <span>
              <img id="img_read"
                   @click="changeIcon"
                   style="font-size: 15px;z-index: 100;"
                   src="@/assets/imgs/icons/signup/ic_check.svg"> Support split/reverse-split token<span style="font-size: 13px;color: #9091A3;letter-spacing: 0;"> (Attention: cannot change after created)</span>
            </span>
          </div>
          <b-form-group style="margin-top: 10px;">
            <label class="fee-remark">Transaction Fee {{ Number(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance.</span>
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
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Register New Token'">
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
             :disabled="noColdAddress || !coldPageId"
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
                             v-model="contractDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="Max 140 characters. When you have done, this content can not be revised"
                             :state="isValidDescription(contractDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Token Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="tokenDescription"
                             :rows="2"
                             :no-resize="true"
                             placeholder="Max 140 characters. When you have done, this content can not be revised"
                             :state="isValidDescription(tokenDescription)">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Max Supply"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="amount"
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
                                     v-else-if="isNegative">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isBiggerThanMax">
              Please reduce Unity scale.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <span style="font-size: 15px !important;color: #9091A3;">Unity: 10<sup>{{ unity }}</sup> (The minimum amount will be {{ formatter(1/Math.pow(10, unity)) }} Token)</span>
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
          <div v-if="tokenSplitStatus"
               style="margin-top: 10px;">
            <span>
              <img id="img_read_cold"
                   @click="changeIcon"
                   style="font-size: 15px;z-index: 100;"
                   src="@/assets/imgs/icons/signup/ic_check.svg"> Support split/merge token<span style="font-size: 13px;color: #9091A3;letter-spacing: 0;"> (Attention: cannot change after created)</span>
            </span>
          </div>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ Number(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance.</span>
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
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Register New Token'">
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
                @click=" getQrArray(); nextPage()">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="coldPageId===3"
                     class="text-left">
          <ColdSignature :data-object="dataObject.toJsonForColdSignature()"
                         :qr-total-page="qrPage"
                         :qr-array="getArray"
                         v-if="coldPageId===3"
                         :cold-public-key="coldAddresses[coldAddress].publicKey"
                         @get-signature="getSignature"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Register New Token'">
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
          <TokenSuccess :address="coldAddress"
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
    </b-tabs>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { TOKEN_CONTRACT, TOKEN_CONTRACT_WITH_SPLIT } from '@/js-v-sdk/src/contract'
import seedLib from '@/libs/seed.js'
import { NETWORK_BYTE, TRANSFER_ATTACHMENT_BYTE_LIMIT, CONTRACT_REGISTER_FEE } from '@/constants.js'
import TokenConfirm from './TokenConfirm'
import TokenSuccess from './TokenSuccess'
import ColdSignature from './ColdSignature'
import browser from '@/utils/browser'
import Transaction from '@/js-v-sdk/src/transaction'
import BigNumber from 'bignumber.js'
import imgread1 from '@/assets/imgs/icons/signup/ic_check.svg'
import imgread2 from '@/assets/imgs/icons/signup/ic_check_selected.svg'
import common from '@/js-v-sdk/src/utils/common'
import { mapActions, mapState } from 'vuex'
var initData = {
    errorMessage: '',
    qrArray: new Array(0),
    support: false,
    amount: 0,
    qrTotalPage: 1,
    pageId: 1,
    fee: BigNumber(CONTRACT_REGISTER_FEE),
    coldPageId: 1,
    address: this ? (this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress) : '',
    coldAddress: this ? (this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress) : '',
    unity: 8,
    sendError: false,
    coldSignature: '',
    maxUnity: 16,
    timeStamp: Date.now() * 1e6,
    hasConfirmed: false,
    tokenId: '',
    selectedWalletType: this ? this.walletType : 'hotWallet',
    contractDescription: '',
    tokenDescription: ''
}
export default {
    name: 'CreateToken',
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
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account',
            tokenSplitStatus: 'tokenSplitStatus'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
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
            return !(!this.isInsufficient && (this.isValidDescription(this.contractDescription) || !this.contractDescription) && (this.isValidDescription(this.tokenDescription) || !this.tokenDescription) && this.isValidAmount)
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        isNegative() {
            return BigNumber(this.amount).isLessThan(0)
        },
        isBiggerThanMax() {
            let maxValue = BigNumber(2).exponentiatedBy(63).minus(1)
            let unityValue = BigNumber(10).exponentiatedBy(this.unity)
            let value = BigNumber(this.amount).multipliedBy(unityValue)
            return value.isGreaterThan(maxValue)
        },
        isValidNumFormat() {
            return common.isNumFormatValid(this.amount)
        },
        checkPrecision() {
            return common.checkPrecision(this.amount, this.unity)
        },
        isValidAmount() {
            if (BigNumber(this.amount).isEqualTo(0) || this.isInsufficient) {
                return void 0
            }
            return this.checkPrecision && this.isValidNumFormat && !this.isBiggerThanMax && !this.isNegative
        },
        isValidDescription() {
            return function(description) {
                if (!description) {
                    return void 0
                }
                return common.getLength(description) <= TRANSFER_ATTACHMENT_BYTE_LIMIT
            }
        },
        isInsufficient() {
            let balance = this.selectedWalletType === 'hotWallet' ? this.balances[this.address] : this.balances[this.coldAddress]
            return BigNumber(balance).isLessThan(BigNumber(CONTRACT_REGISTER_FEE))
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.coldAddress].publicKey)
            return tra
        },
        qrPage() {
            return this.qrTotalPage
        },
        getArray() {
            return this.qrArray
        }
    },
    methods: {
        ...mapActions(['updateBalance', 'changeEventPool', 'changeAddTokenStatus']),
        getQrArray() {
            const qrSize = 300
            let tempDataObject = JSON.parse(JSON.stringify(this.dataObject.toJsonForColdSignature()))
            const text = JSON.stringify(tempDataObject)
            let page = Math.ceil(text.length / qrSize)
            let textArray = Array(page)
            this.qrTotalPage = page
            for (let i = 0; i < this.qrTotalPage; i++) {
                textArray[i] = text.slice(i * qrSize, (i + 1) * qrSize)
            }
            this.qrArray = textArray
        },
        changeIcon() {
            let imgId = this.selectedWalletType === 'hotWallet' ? 'img_read' : 'img_read_cold'
            if (this.support === false) {
                document.getElementById(imgId).src = imgread2
                this.support = true
            } else {
                document.getElementById(imgId).src = imgread1
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
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            let initData = {amount: this.amount, unity: BigNumber(Math.pow(10, this.unity)), token_description: this.tokenDescription}
            let contract = this.support === false ? TOKEN_CONTRACT : TOKEN_CONTRACT_WITH_SPLIT
            tra.buildRegisterContractTx(publicKey, contract, initData, this.contractDescription, this.timeStamp)
            return tra
        },
        sendData(walletType) {
            let sendTx
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                let builtTransaction = this.buildTransaction(this.getKeypair(this.addresses[this.address]).publicKey)
                this.account.buildFromPrivateKey(this.getKeypair(this.addresses[this.address]).privateKey)
                let signature = this.account.getSignature(builtTransaction.toBytes())
                sendTx = builtTransaction.toJsonForSendingTx(signature)
            } else if (walletType === 'coldWallet') {
                let signature = this.coldSignature
                sendTx = this.dataObject.toJsonForSendingTx(signature)
            }
            this.chain.sendRegisterContractTx(sendTx).then(response => {
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
                let tokenId = common.contractIDToTokenID(response.contractId)
                let stopParaArr = []
                for (let delayTime = 6000; delayTime <= 150000; delayTime *= 5) { //  Refresh interval will be 6s, 30s, 150s
                    let stopPara = setTimeout(this.sendToAdd, delayTime, tokenId)
                    stopParaArr.push(stopPara)
                }
                let tmp = {'newToken': stopParaArr}
                let eventPool = this.$store.state.eventPool
                Vue.set(eventPool, tokenId, tmp)
                this.changeEventPool(eventPool)
                this.updateBalance(true)
            }, respErr => {
                this.errorMessage = respErr.message
                if (this.errorMessage === undefined) {
                    this.errorMessage = 'Failed reason: Unknown.Please check network connection!'
                }
                this.sendError = true
            })
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
                this.$refs.createTokenModal.hide()
            }
        },
        resetPage() {
            this.unity = 8
            this.qrTotalPage = 1
            this.qrArray = new Array(0)
            this.amount = 0
            this.pageId = 1
            this.coldPageId = 1
            this.sendError = false
            this.coldSignature = ''
            this.support = false
            this.address = this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
            this.selectedWalletType = this.walletType
            this.contractDescription = ''
            this.tokenDescription = ''
        },
        endSend() {
            this.$refs.createTokenModal.hide()
        },
        sendToAdd(tokenId) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            let tokens = {}
            if (userInfo && userInfo.tokens) {
                tokens = JSON.parse(userInfo.tokens)
            }
            if (tokenId in tokens) {
                if (this.$store.state.eventPool) {
                    let eventPool = this.$store.state.eventPool
                    if (eventPool[tokenId] && eventPool[tokenId].newToken) {
                        let stopArr = eventPool[tokenId].newToken
                        for (let i in stopArr) {
                            clearTimeout(stopArr[i])
                        }
                        Vue.delete(eventPool, tokenId)
                    }
                    this.changeEventPool(eventPool)
                }
            } else {
                this.chain.getContractInfo(common.tokenIDToContractID(tokenId)).then(response => {
                    Vue.set(tokens, tokenId, response.info[1].data)
                    this.setUsrLocalStorage('tokens', JSON.stringify(tokens))
                    this.changeAddTokenStatus()
                }, respError => {
                })
            }
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.coldPageId++
        },
        hideQrScan(tabIndex) {
            this.resetPage()
            if (tabIndex === 0) {
                this.selectedWalletType = 'hotWallet'
                this.pageId = 1
            } else {
                this.selectedWalletType = 'coldWallet'
                this.coldPageId = 1
            }
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
.vsys-check {
    display: block;
    margin-top: -10px;
    font-size: 80%;
    color: #dc3545;
}
</style>
