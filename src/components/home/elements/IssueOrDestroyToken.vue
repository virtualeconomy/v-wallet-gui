<template>
  <b-modal :id="'issueOrDestroyTokenModal_' + tokenId"
           centered
           lazy
           title="IssueOrDestroyToken"
           hide-footer
           hide-header
           ref="issueOrDestroyTokenModal"
           :busy="true"
           @hidden="resetPage">
    <button
      class="close btn-close"
      @click="endSend">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs>
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
                          :state="isValidIssuer"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot {{ functionName === 'Issue Token' ? 'issue' : 'destroy' }} token. You are not issuer of this token.
            </b-form-invalid-feedback>
            <b-btn
              block
              variant="light"
              disabled
              class="balance-input"
              readonly>
              <span class="balance-title">
                <img v-if="isCertified"
                     :src="officialTokenSvg"
                     width="20"
                     height="20">
                <img v-else
                     src="@/assets/imgs/icons/wallet/ic_token2.svg"
                     width="20"
                     height="20">
              </span>
              <span class="balance">{{ functionName === 'Issue Token' ? 'Issue Available' : 'Destroy Available' }} {{ formatter(availableAmount) }}
              </span>
            </b-btn>
          </b-form-group>
          <b-form-group :label="functionName === 'Issue Token' ? 'Issue Amount' : 'Destroy Amount'"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidAmount">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isValidNumFormat">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision && !isExceededMaxSupplyOrTokenSufficient">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededMaxSupplyOrTokenSufficient && functionName === 'Issue Token'">
              The total supply can not larger than max supply.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededMaxSupplyOrTokenSufficient && functionName === 'Destroy Token'">
              Insufficient token.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative">
              Negative number is not allowed
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance</span>
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
                        :tx-type="functionName">
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
                :disabled="sendError"
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
          <b-form-group label="Wallet Address"
                        label-for="wallet-address">
            <b-form-input id=coldAddress-input
                          class="address-input"
                          readonly
                          v-model="address"
                          :state="isValidIssuer"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Cannot {{ functionName === 'Issue Token' ? 'issue' : 'destroy' }} token. You are not issuer of this token.
            </b-form-invalid-feedback>
            <b-btn
              block
              variant="light"
              disabled
              class="balance-input"
              readonly>
              <span class="balance-title">
                <img v-if="isCertified"
                     :src="officialTokenSvg"
                     width="20"
                     height="20">
                <img v-else
                     src="@/assets/imgs/icons/wallet/ic_token2.svg"
                     width="20"
                     height="20">
              </span>
              <span class="balance">{{ functionName === 'Issue Token'? 'Issue Available' : 'Destroy Available' }} {{ formatter(availableAmount) }}
              </span>
            </b-btn>
          </b-form-group>
          <b-form-group :label="functionName === 'Issue Token' ? 'Issue Amount' : 'Destroy Amount'"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidAmount">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!isValidNumFormat">
              Invalid format.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="!checkPrecision && !isExceededMaxSupplyOrTokenSufficient">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededMaxSupplyOrTokenSufficient && functionName === 'Issue Token'">
              The total supply can not larger than max supply.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededMaxSupplyOrTokenSufficient && functionName === 'Destroy Token'">
              Insufficient token.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative">
              Negative number is not allowed
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else>
              Invalid Input.
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance</span>
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
                        :amount=inputAmount(amount)
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
                         :qr-total-page="1"
                         v-if="coldPageId===3"
                         :cold-public-key = "coldAddresses[address].publicKey"
                         @get-signature="getSignature"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="functionName">
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
                :disabled="sendError"
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
import { CONTRACT_EXEC_FEE, ISSUE_FUNCIDX, BURN_FUNCIDX, NETWORK_BYTE } from '@/constants.js'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import common from '@/js-v-sdk/src/utils/common'
import Transaction from '@/js-v-sdk/src/transaction'
import BigNumber from 'bignumber.js'
import { mapActions, mapState } from 'vuex'
import certify from '@/utils/certify'
export default {
    name: 'IssueOrDestroyToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    data: function() {
        return {
            errorMessage: '',
            amount: 0,
            pageId: 1,
            fee: BigNumber(CONTRACT_EXEC_FEE),
            coldPageId: 1,
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
        maxSupply: {
            type: BigNumber,
            default: function() {
            },
            require: true
        },
        currentSupply: {
            type: BigNumber,
            default: function() {
            },
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
        },
        functionName: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account'
        }),
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
        wordList() {
            return this.seedPhrase.split(' ')
        },
        isSubmitDisabled() {
            return !(BigNumber(this.amount).isGreaterThan(0) && this.isValidIssuer && this.isValidAmount && !this.isInsufficient)
        },
        isValidAmount() {
            if (BigNumber(this.amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision && this.isValidNumFormat && !this.isExceededMaxSupplyOrTokenSufficient && !this.isNegative
        },
        isInsufficient() {
            return BigNumber(this.balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
        },
        availableAmount() {
            if (!this.isValidIssuer) {
                return 0
            }
            if (this.functionName === 'Issue Token') {
                return this.maxSupply.minus(this.currentSupply)
            }
            if (this.functionName === 'Destroy Token') {
                return this.tokenBalance
            }
        },
        isCertified() {
            return certify.isCertified(this.tokenId)
        },
        officialName() {
            return certify.officialName(this.tokenId)
        },
        officialTokenSvg() {
            try {
                return require('@/assets/imgs/icons/token/' + this.officialName + '.svg')
            } catch (err) {
                return require('@/assets/imgs/icons/wallet/ic_token1.svg')
            }
        },
        isValidNumFormat() {
            return common.isNumFormatValid(this.amount)
        },
        isNegative() {
            return BigNumber(this.amount).isLessThan(0)
        },
        checkPrecision() {
            return common.checkPrecision(BigNumber(this.amount).multipliedBy(this.tokenUnity), 0)
        },
        isExceededMaxSupplyOrTokenSufficient() {
            if (this.functionName === 'Issue Token') {
                return BigNumber(this.amount).isGreaterThan(BigNumber(this.maxSupply - this.currentSupply))
            }
            if (this.functionName === 'Destroy Token') {
                return BigNumber(this.amount).isGreaterThan(BigNumber(this.tokenBalance))
            }
        },
        isValidIssuer() {
            return this.address === this.issuer
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.address].publicKey)
            return tra
        }
    },
    methods: {
        ...mapActions(['updateBalance']),
        inputAmount(num) {
            return BigNumber(num)
        },
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            let functionIndex = this.functionName === 'Issue Token' ? ISSUE_FUNCIDX : BURN_FUNCIDX
            let functionData = {amount: this.amount, unity: this.tokenUnity}
            tra.buildExecuteContractTx(publicKey, this.contractId, functionIndex, functionData, this.timeStamp)
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
                this.updateBalance(true)
                for (let delayTime = 6000; delayTime <= 150000; delayTime *= 5) { //  Refresh interval will be 6s, 30s, 150s
                    setTimeout(this.sendBalanceChange, delayTime)
                }
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
            if (this.walletType === 'hotWallet') {
                this.pageId++
                this.timeStamp = Date.now() * 1e6
            } else {
                this.coldPageId++
            }
        },
        prevPage() {
            this.sendError = false
            let pageId = this.walletType === 'hotWallet' ? --this.pageId : --this.coldPageId
            if (pageId === 0) {
                this.$refs.issueOrDestroyTokenModal.hide()
            }
        },
        resetPage() {
            this.amount = 0
            this.pageId = 1
            this.coldPageId = 1
            this.sendError = false
            this.coldSignature = ''
            this.errorMessage = ''
            this.hasConfirmed = false
        },
        endSend() {
            this.$refs.issueOrDestroyTokenModal.hide()
        },
        sendBalanceChange() {
            this.$emit('updateToken', 'update')
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.coldPageId++
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
