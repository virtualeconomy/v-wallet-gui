<template>
  <b-modal :id="'depositTokenModal_' + tokenId"
           centered
           lazy
           title="DepositToken"
           hide-footer
           hide-header
           ref="depositTokenModal"
           :busy="true"
           @hidden="resetPage">
    <button
      class="close btn-close"
      @click="endSend">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs>
      <b-tab title="Hot Wallet"
             :disabled="walletType==='coldWallet'"
             :active="walletType==='hotWallet'">
        <b-container
          class="text-left"
          v-if="pageId===1">
          <b-form-group label="Contract ID"
                        label-for="contract-input">
            <b-form-input id=contract-input
                          class="contract-input"
                          readonly
                          v-model="contractId"
                          :state="isValidContractId(contractId)"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid Contract ID
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="amount-input">
            <b-form-input id="amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!checkPrecision(amount) && !isExceededBalance(amount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededBalance(amount)">
              Deposited token is larger than balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(amount)">
              Negative number is not allowed
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
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient()"
                  class="vsys-check">Insufficient VSYS balance</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="isSubmitDisabled()"
                    @click="nextPage">Deposit
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="'Deposit Token to Contract'">
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
                        :contract-id="contractId"
                        :tx-type="'Deposit Token to Contract'">
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
          <b-form-group label="Contract ID"
                        label-for="contract-input">
            <b-form-input id=coldContract-input
                          class="contract-input"
                          readonly
                          v-model="contractId"
                          :state="isValidContractId(contractId)"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid Contract ID
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="cold-amount-input">
            <b-form-input id="cold-amount-input"
                          class="amount-input"
                          v-model="amount"
                          aria-describedby="inputLiveFeedback"
                          :state="isAmountValid()">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-if="!checkPrecision(amount) && !isExceededBalance(amount)">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededBalance(amount)">
              Deposited token is larger than balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isNegative(amount)">
              Negative number is not allowed
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
            <label class="fee-remark">Transaction Fee {{ formatter(fee) }} VSYS</label>
            <span v-if="isInsufficient()"
                  class="vsys-check">Insufficient VSYS balance</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="isSubmitDisabled()"
                    @click="coldNextPage">Deposit
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="'Deposit Token to Contract'">
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
                        :contract-id="contractId"
                        :tx-type="'Deposit Token to Contract'">
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
          <TokenSuccess class="tokenSucced"
                        :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="'Deposit Token to Contract'">
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
import { NODE_IP, CONTRACT_EXEC_FEE, VSYS_PRECISION, FEE_SCALE, API_VERSION, PROTOCOL, OPC_FUNCTION, DEPOSIT_FUNCIDX, DEPOSIT_FUNCIDX_SPLIT } from '@/constants.js'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import common from '@/utils/common'
import BigNumber from 'bignumber.js'
import base58 from '@/libs/base58'
import transaction from '@/utils/transaction'
export default {
    name: 'DepositToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    data: function() {
        return {
            amount: BigNumber(0),
            pageId: 1,
            fee: BigNumber(CONTRACT_EXEC_FEE),
            coldPageId: 1,
            sendError: false,
            coldSignature: '',
            timeStamp: Date.now() * 1e6,
            hasConfirmed: false,
            attachment: '',
            contractId: this.contract()
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
        address: {
            type: String,
            default: ''
        },
        isSplit: {
            type: Boolean,
            default: false
        }
    },
    computed: {
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
        dataObject() {
            return {
                protocol: PROTOCOL,
                api: this.coldApi(),
                opc: OPC_FUNCTION,
                address: this.address,
                senderPublicKey: this.coldAddresses[this.address].publicKey,
                fee: this.fee * VSYS_PRECISION,
                feeScale: FEE_SCALE,
                timestamp: Date.now(),
                attachment: '',
                contractId: this.contractId,
                functionId: this.isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX,
                function: transaction.prepareDeposit(this.address, this.contractId, BigNumber(this.amount).multipliedBy(this.tokenUnity)),
                functionExplain: 'Deposit ' + this.amount + ' token to ' + this.contractId
            }
        }
    },
    methods: {
        inputAmount(num) {
            return BigNumber(num)
        },
        coldApi: function() {
            return API_VERSION
        },
        contract: function() {
            return transaction.tokenIDToContractID(this.tokenId)
        },
        isSubmitDisabled() {
            return !(!this.isInsufficient() && this.isAmountValid() && this.isValidContractId(this.contractId))
        },
        sendData: function(walletType) {
            let apiSchema
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                this.fee = BigNumber(CONTRACT_EXEC_FEE)
                this.feeScale = FEE_SCALE
                const dataInfo = {
                    contractId: this.contractId,
                    senderPublicKey: this.getKeypair(this.addresses[this.address]).publicKey,
                    fee: CONTRACT_EXEC_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.timeStamp,
                    functionIndex: this.isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX,
                    functionData: transaction.prepareDeposit(this.address, this.contractId, BigNumber(this.amount).multipliedBy(this.tokenUnity)),
                    signature: transaction.prepareExecContractSignature(this.contractId, this.isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX, transaction.prepareDeposit(this.address, this.contractId, BigNumber(this.amount).multipliedBy(this.tokenUnity)), this.attachment, BigNumber(CONTRACT_EXEC_FEE * VSYS_PRECISION), this.feeScale, BigNumber(this.timeStamp), this.getKeypair(this.addresses[this.address]).privateKey)
                }
                apiSchema = dataInfo
            } else if (walletType === 'coldWallet') {
                const coldDataInfo = {
                    contractId: this.contractId,
                    senderPublicKey: this.coldAddresses[this.address].publicKey,
                    fee: CONTRACT_EXEC_FEE * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: this.dataObject.timestamp,
                    functionIndex: this.isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX,
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
                this.sendError = true
            })
        },
        nextPage: function() {
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
            this.amount = BigNumber(0)
            this.pageId = 1
            this.coldPageId = 1
            this.paused = false
            this.sendError = false
            this.coldSignature = ''
        },
        endSend: function() {
            for (let delayTime = 6000; delayTime < 30100; delayTime *= 5) { //  Refresh interval will be 6s, 30s, 150s
                setTimeout(this.sendBalanceChange, delayTime)
            }
            this.$refs.depositTokenModal.hide()
        },
        sendBalanceChange: function() {
            this.$emit('updateBalance', 'update')
        },
        getSignature: function(signature) {
            this.coldSignature = signature
            this.dataObject.timestamp *= 1e6
            this.coldPageId++
        },
        isAmountValid() {
            var amount = this.amount
            if (BigNumber(amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision(amount) && this.isNumFormatValid(amount) && !this.isExceededBalance(amount) && !this.isNegative(amount)
        },
        isNumFormatValid(amount) {
            return common.isNumFormatValid(amount)
        },
        isNegative(amount) {
            return BigNumber(amount).isLessThan(0)
        },
        checkPrecision(amount) {
            return common.checkPrecision(BigNumber(amount).multipliedBy(this.tokenUnity), 0)
        },
        isExceededBalance(amount) {
            return BigNumber(amount).isGreaterThan(this.tokenBalance)
        },
        isInsufficient() {
            return BigNumber(this.balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
        },
        isValidContractId(contractId) {
            var contractArr = base58.decode(contractId)
            if (contractArr) {
                if (contractArr.length === 26 && contractArr[0] === 6) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
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
.contract-input {
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
</style>
