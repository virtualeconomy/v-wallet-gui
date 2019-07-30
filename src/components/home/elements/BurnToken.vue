<template>
  <b-modal :id="'burnTokenModal_' + tokenId"
           centered
           lazy
           title="burnToken"
           hide-footer
           hide-header
           ref="burnTokenModal"
           :busy="true"
           @hidden="resetPage">
    <button
      class="close btn-close"
      @click="endSend">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs @input="hideQrScan">
      <b-tab title="Hot Wallet"
             :disabled="walletType === 'coldWallet'"
             :active="walletType==='hotWallet'">
        <b-container
          class="text-left"
          v-if="pageId===1">
          <b-form-group label="Wallet Address"
                        label-for="address-input">
            <b-form-input id=address-input
                          class="address-input"
                          readonly
                          v-model="address"
                          :state="isValidIssuer(address)"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot destroy token. You are not issuer of this token.
            </b-form-invalid-feedback>
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
              <span class="balance">Destroy Available {{ formatter(tokenBalance) }}</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Destroy Amount"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('hot')">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isNumFormatValid(amount)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision(amount) && !isTokenInsufficient(amount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isTokenInsufficient(amount)">
              Insufficient token
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
            <span v-if="isInsufficient()"
                  class="vsys-check">Insufficient VSYS balance</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled('hot')"
                    @click="nextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Destroy Token'">
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
                @click="sendData('hotWallet')">Confirm
              </b-button>
            </b-col>
          </b-row>
        </b-container>
        <b-container v-if="pageId===3">
          <TokenSuccess class="tokenSucced"
                        :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Destroy Token'">
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
          <b-form-group label="Wallet Address"
                        label-for="wallet-address">
            <b-form-input id=coldAddress-input
                          class="address-input"
                          readonly
                          v-model="address"
                          :state="isValidIssuer(address)"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot destroy token. You are not issuer of this token.
            </b-form-invalid-feedback>
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
              <span class="balance">Destroy Available {{ formatter(tokenBalance) }}</span>
            </b-btn>
          </b-form-group>
          <b-form-group label="Destroy Amount"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid('cold')">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isNumFormatValid(amount)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision(amount) && !isTokenInsufficient(amount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isTokenInsufficient(amount)">
              Insufficient token
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
            <span v-if="isInsufficient()"
                  class="vsys-check">Insufficient VSYS balance</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isSubmitDisabled('cold')"
                    @click="coldNextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Destroy Token'">
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
                @click="coldNextPage">Confirm
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
                         @next-page="coldNextPage"
                         @prev-page="coldPrevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'Destroy Token'">
          </TokenConfirm>
          <p v-show="sendError">Sorry, transaction send failed! {{ errorMessage }}</p>
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
          <TokenSuccess class="tokenSucced"
                        :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="'DestroyToken'">
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
import { NODE_IP, OPC_FUNCTION, CONTRACT_EXEC_FEE, BURN_FUNCIDX, TRANSFER_ATTACHMENT_BYTE_LIMIT, VSYS_PRECISION, FEE_SCALE, API_VERSION, PROTOCOL, OPC_ACCOUNT } from '@/constants.js'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import common from '@/utils/common'
import BigNumber from 'bignumber.js'
import transaction from '@/utils/transaction'
export default {
    name: 'BurnToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    data: function() {
        return {
            errorMessage: '',
            amount: BigNumber(0),
            attachment: '',
            pageId: 1,
            fee: BigNumber(CONTRACT_EXEC_FEE),
            coldPageId: 5,
            scanShow: false,
            sendError: false,
            coldSignature: '',
            timeStamp: Date.now() * 1e6,
            hasConfirmed: false
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
        addresses: {
            type: Object,
            default: function() {},
            require: true
        },
        balance: {
            type: Object,
            default: function() {},
            require: true
        },
        address: {
            type: String,
            default: ''
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
        issuer: {
            type: String,
            default: '',
            require: true
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
        dataObject() {
            return {
                protocol: PROTOCOL,
                api: API_VERSION,
                opc: OPC_FUNCTION,
                address: this.address,
                senderPublicKey: this.coldAddresses[this.address].publicKey,
                fee: this.fee * VSYS_PRECISION,
                feeScale: FEE_SCALE,
                timestamp: Date.now(),
                attachment: '',
                contractId: this.contractId,
                functionId: BURN_FUNCIDX,
                function: transaction.prepareIssueAndBurn(BigNumber(this.amount).multipliedBy(this.tokenUnity)),
                functionExplain: 'Destroy ' + this.amount + ' Token'
            }
        },
        isValidAttachment() {
            if (!this.attachment) {
                return void 0
            }
            return this.attachment.length <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        isSubmitDisabled(type) {
            return !(BigNumber(this.amount).isGreaterThan(0) && this.isValidIssuer(this.address) && (this.isValidAttachment || !this.attachment) && this.isAmountValid(type) && !this.isInsufficient())
        }
    },
    methods: {
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
                this.feeScale = FEE_SCALE
                const dataInfo = {
                    contractId: this.contractId,
                    senderPublicKey: this.getKeypair(this.addresses[this.address]).publicKey,
                    fee: CONTRACT_EXEC_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.timeStamp,
                    functionIndex: BURN_FUNCIDX,
                    functionData: transaction.prepareIssueAndBurn(BigNumber(this.amount).multipliedBy(this.tokenUnity)),
                    signature: transaction.prepareExecContractSignature(this.contractId, BURN_FUNCIDX, transaction.prepareIssueAndBurn(BigNumber(this.amount).multipliedBy(this.tokenUnity)), this.attachment, BigNumber(CONTRACT_EXEC_FEE * VSYS_PRECISION), this.feeScale, BigNumber(this.timeStamp), this.getKeypair(this.addresses[this.address]).privateKey)
                }
                apiSchema = dataInfo
            } else if (walletType === 'coldWallet') {
                const coldDataInfo = {
                    contractId: this.contractId,
                    senderPublicKey: this.coldAddresses[this.address].publicKey,
                    fee: CONTRACT_EXEC_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.dataObject.timestamp,
                    functionIndex: BURN_FUNCIDX,
                    functionData: transaction.prepareIssueAndBurn(BigNumber(this.amount).multipliedBy(this.tokenUnity)),
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
        },
        nextPage() {
            this.pageId++
            this.timeStamp = Date.now() * 1e6
            this.hasConfirmed = false
        },
        coldNextPage() {
            this.sendError = false
            this.coldPageId++
        },
        prevPage() {
            this.sendError = false
            if (this.pageId === 1) {
                this.$refs.sendModal.hide()
            } else {
                this.pageId--
            }
        },
        coldPrevPage() {
            this.sendError = false
            if (this.coldPageId === 1) {
                this.$refs.sendModal.hide()
            } else {
                this.coldPageId--
            }
        },
        resetPage() {
            this.amount = BigNumber(0)
            this.pageId = 1
            this.coldPageId = 1
            this.scanShow = false
            this.qrInit = false
            this.paused = false
            this.qrErrMsg = void 0
            this.sendError = false
            this.coldSignature = ''
        },
        endSend() {
            for (let delayTime = 6000; delayTime <= 150000; delayTime *= 5) { //  Refresh interval will be 6s, 30s, 150s
                setTimeout(this.sendBalanceChange, delayTime)
            }
            this.$refs.burnTokenModal.hide()
        },
        sendBalanceChange() {
            this.$emit('updateBalance', 'update')
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
                var jsonObj = JSON.parse(decodeString.replace(/"amount":(\d+)/g, '"amount":"$1"')) // The protocol defined amount must use Long type. However, there is no Long type in JS. So we use BigNumber instead. Add quotes (") to amount field to ensure BigNumber parses amount without precision loss.
                this.recipient = jsonObj.address
                var opc = jsonObj.opc
                var api = jsonObj.api
                var protocol = jsonObj.protocol
                if (jsonObj.hasOwnProperty('amount')) {
                    this.amount = BigNumber(jsonObj.amount).dividedBy(VSYS_PRECISION).decimalPlaces(8)
                }
                if (jsonObj.hasOwnProperty('invoice')) {
                    this.attachment = jsonObj.invoice
                }
                if (protocol !== PROTOCOL) {
                    this.paused = false
                    this.qrErrMsg = 'Invalid QR code protocol.'
                } else if (api !== API_VERSION) {
                    this.paused = false
                    this.qrErrMsg = 'API version mismatch.'
                } else if (opc !== OPC_ACCOUNT) {
                    this.paused = false
                    this.qrErrMsg = 'Wrong operation code in QR code.'
                } else if (!this.isValidRecipient(this.recipient) || this.recipient === '') {
                    this.paused = false
                    this.qrErrMsg = 'Invalid address of recipient.'
                } else {
                    this.qrErrMsg = void 0
                }
            } catch (e) {
                if (this.isValidRecipient(decodeString)) {
                    this.recipient = decodeString
                } else {
                    this.recipient = 'please scan QR code of recipient'
                    this.paused = false
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
            var amount = this.amount
            if (BigNumber(amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision(amount) && this.isNumFormatValid(amount) && !this.isTokenInsufficient(amount) && !this.isNegative(amount)
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
        isTokenInsufficient(amount) {
            return BigNumber(amount).isGreaterThan(BigNumber(this.tokenBalance))
        },
        isInsufficient() {
            return BigNumber(this.balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
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
        },
        isValidIssuer(recipient) {
            return recipient === this.issuer
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
.address-input {
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
.tokenSucced {
    text-align: center;
}
.vsys-check {
    display: block;
    margin-top: -10px;
    font-size: 80%;
    color: #dc3545;
}
</style>
