<template>
  <b-modal :id="'splitTokenModal_' + tokenId"
           centered
           lazy
           title="SplitToken"
           hide-footer
           hide-header
           ref="splitTokenModal"
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
          <b-form-group label="Issuer Wallet Address"
                        label-for="address-input">
            <b-form-input id=address-input
                          class="address-input"
                          readonly
                          v-model="issuer"
                          :state="isValidIssuer(address)"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot split token. You are not issuer of this token.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <div class="unity">Current Unity {{ tokenUnity.toString() }}</div>
          </b-form-group>
          <b-form-group label="New Unity"
                        label-for="amount-input">
            <b-form-input id="recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="newUnity"
                          :state="isValidUnity()"
                          aria-describedby="inputLiveFeedback">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isNumFormatValid(this.newUnity)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(this.newUnity)">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!isInteger()">
              Integer number is allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isGreaterThanMax(this.newUnity)">
              Unity is too large. Please change it to an integer less than 9223372036854775808.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Unity.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance</span>
            <span v-if="!isSplit"
                  class="vsys-check">Cannot change unity. This token does not support split function.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled"
                    @click="nextPage">Change
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="'Split Token'">
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
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="'Split Token'">
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
                          v-model="issuer"
                          :state="isValidIssuer(address)"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot split token. You are not issuer of this token.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <div class="unity">Current Unity {{ tokenUnity.toString() }}</div>
          </b-form-group>
          <b-form-group label="New Unity"
                        label-for="cold-amount-input">
            <b-form-input id="cold-recipient-input"
                          class="recipient-input"
                          type="text"
                          v-model="newUnity"
                          :state="isValidUnity()"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Paste or scan an address.">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isNumFormatValid(this.newUnity)">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(this.newUnity)">
              Negative number is not allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!isInteger()">
              Integer number is allowed.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isGreaterThanMax(this.newUnity)">
              Unity is too large. Please change it to an integer less than 9223372036854775808.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Unity.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance</span>
            <span v-if="!isSplit"
                  class="vsys-check">Cannot change unity. This token does not support split function.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isSubmitDisabled"
                    @click="coldNextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="address"
                        :new-unity="newUnity"
                        :fee="fee"
                        :tx-type="'Split Token'">
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
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="'Split Token'">
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
                        :new-unity="inputUnity"
                        :fee="fee"
                        :tx-type="'Split Token'">
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
import { NODE_IP, CONTRACT_EXEC_FEE, SPLIT_FUNCIDX, VSYS_PRECISION, FEE_SCALE, API_VERSION, PROTOCOL, OPC_FUNCTION } from '@/constants.js'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import common from '@/utils/common'
import BigNumber from 'bignumber.js'
import transaction from '@/utils/transaction'
import { mapActions } from 'vuex'
export default {
    name: 'SplitToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    data: function() {
        return {
            errorMessage: '',
            newUnity: 0,
            attachment: '',
            pageId: 1,
            fee: BigNumber(CONTRACT_EXEC_FEE),
            coldPageId: 5,
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
        balance: {
            type: BigNumber,
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
        issuer: {
            type: String,
            default: '',
            require: true
        },
        address: {
            type: String,
            default: ''
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
            return !(this.isValidIssuer(this.address) && this.isValidUnity() && !this.isInsufficient && this.isSplit)
        },
        isInsufficient() {
            return BigNumber(this.balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
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
                functionId: SPLIT_FUNCIDX,
                function: transaction.prepareSplit(BigNumber(this.newUnity)),
                functionExplain: 'Set token unity to ' + this.newUnity
            }
        },
        inputUnity() {
            return BigNumber(this.newUnity)
        }
    },
    methods: {
        ...mapActions(['updateBalance']),
        isValidIssuer(addr) {
            return addr === this.issuer
        },
        isInteger() {
            return BigNumber(this.newUnity).isInteger()
        },
        isValidUnity() {
            if (BigNumber(this.newUnity).isEqualTo(0)) {
                return void 0
            }
            return this.isNumFormatValid(this.newUnity) && !this.isNegative(this.newUnity) && this.isInteger() && !this.isGreaterThanMax(this.newUnity)
        },
        sendData(walletType) {
            let apiSchema
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.fee = BigNumber(CONTRACT_EXEC_FEE)
                this.feeScale = FEE_SCALE
                const dataInfo = {
                    contractId: this.contractId,
                    senderPublicKey: this.getKeypair(this.addresses[this.address]).publicKey,
                    fee: CONTRACT_EXEC_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.timeStamp,
                    functionIndex: SPLIT_FUNCIDX,
                    functionData: transaction.prepareSplit(BigNumber(this.newUnity)),
                    signature: transaction.prepareExecContractSignature(this.contractId, SPLIT_FUNCIDX, transaction.prepareSplit(BigNumber(this.newUnity)), this.attachment, BigNumber(CONTRACT_EXEC_FEE * VSYS_PRECISION), this.feeScale, BigNumber(this.timeStamp), this.getKeypair(this.addresses[this.address]).privateKey)
                }
                apiSchema = dataInfo
            } else if (walletType === 'coldWallet') {
                const coldDataInfo = {
                    contractId: this.dataObject.contractId,
                    senderPublicKey: this.dataObject.senderPublicKey,
                    fee: this.dataObject.fee,
                    feeScale: this.dataObject.feeScale,
                    timestamp: this.dataObject.timestamp,
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
                    this.hasConfirmed = true
                } else {
                    this.coldPageId++
                }
                this.updateBalance(true)
                for (let delayTime = 6000; delayTime <= 150000; delayTime *= 5) { //  Refresh interval will be 6s, 30s, 150s
                    setTimeout(this.unityChange, delayTime)
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
            this.timeStamp = Date.now() * 1e6
            this.hasConfirmed = false
            this.pageId++
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
            this.newUnity = 0
            this.pageId = 1
            this.coldPageId = 1
            this.sendError = false
            this.coldSignature = ''
        },
        endSend() {
            this.$refs.splitTokenModal.hide()
        },
        unityChange() {
            this.$emit('updateToken', 'update')
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.dataObject.timestamp *= 1e6
            this.coldPageId++
        },
        isNumFormatValid(amount) {
            return common.isNumFormatValid(amount)
        },
        isNegative(amount) {
            return BigNumber(amount).isLessThan(0)
        },
        isGreaterThanMax(newUnity) {
            let maxValue = BigNumber(2).exponentiatedBy(63).minus(1)
            let unityValue = BigNumber(newUnity)
            return unityValue.isGreaterThan(maxValue)
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
