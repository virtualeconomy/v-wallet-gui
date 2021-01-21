<template>
  <b-modal id="withdrawOrDepositTokenModal"
           centered
           lazy
           title="WithdrawOrDepositToken"
           hide-footer
           hide-header
           ref="withdrawOrDepositTokenModal"
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
             :active="walletType === 'hotWallet'">
        <b-container
          class="text-left"
          v-if="pageId===1">
          <b-form-group label="Contract ID"
                        label-for="contract-input">
            <b-form-input id=contract-input
                          class="contract-input"
                          v-model="contractId"
                          :state="isValidContractId"
                          @input="hideContractError"
                          placeholder="Payment channel contract or Lock contract"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              {{ this.validContractType ? 'Invalid Contract ID' : 'Not PaymentChannel Contract or Lock Contract' }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    @click="checkContract">Check Contract
          </b-button>
          <b-form-group label="Token ID"
                        label-for="address-input"
                        style="margin-top:20px"
                        v-if="!isWaiting && showToken">
            <b-form-input id=address-input
                          class="addr-input"
                          style="text-align: center"
                          readonly
                          v-model="showTokenId"></b-form-input>
            <b-btn
              block
              variant="light"
              disabled
              class="balance-input"
              readonly>
              <span class="balance-title">
                <img src="@/assets/imgs/icons/operate/ic_token2.svg"
                     class="blance_avatar">
              </span>
              <span class="balance">Available {{ functionName === 'Withdraw' ? 'withdraw' : 'deposit' }} amount {{ showTokenBalance }} </span>
            </b-btn>
          </b-form-group>
          <b-form-group style="text-align:center">
            <img height="40"
                 width="40"
                 v-if="isWaiting"
                 style="margin-top:20px"
                 src="@/assets/imgs/icons/wallet/ic_wait.svg">
          </b-form-group>
          <b-form-group label="Amount"
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
                                     v-else-if="!checkPrecision">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededBalance && (this.functionName === 'Deposit')">
              Deposited {{ this.actionName === 'Deposit Token' ? 'token' : 'vsys' }} is larger than balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededContractBalance && (this.functionName === 'Withdraw')">
              Withdrawn {{ this.actionName === 'Withdraw Token' ? 'token' : 'vsys' }} is larger than balance
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
                    @click="nextPage">{{ functionName === 'Withdraw' ? 'Withdraw' : 'Deposit' }}
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="getTxType">
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
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="getTxType">
          </TokenSuccess>
          <b-button variant="warning"
                    block
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
      <b-tab title="Cold Wallet"
             :disabled="!coldPageId || walletType === 'hotWallet'"
             :active="walletType === 'coldWallet'">
        <b-container v-if="coldPageId===1"
                     class="text-left">
          <b-form-group label="Contract ID"
                        label-for="contract-input">
            <b-form-input id=coldContract-input
                          class="contract-input"
                          v-model="contractId"
                          :state="isValidContractId"
                          @input="hideContractError"
                          placeholder="Payment channel contract or Lock contract"
                          aria-describedby="inputLiveFeedback"></b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              {{ this.validContractType ? 'Invalid Contract ID' : 'Not PaymentChannel Contract or Lock Contract' }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    @click="checkContract">Check Contract
          </b-button>
          <b-form-group label="Token ID"
                        label-for="address-input"
                        style="margin-top:20px"
                        v-if="!isWaiting && showToken">
            <b-form-input id=address-input
                          class="addr-input"
                          style="text-align: center"
                          readonly
                          v-model="showTokenId"></b-form-input>
            <b-btn
              block
              variant="light"
              disabled
              class="balance-input"
              readonly>
              <span class="balance-title">
                <img src="@/assets/imgs/icons/operate/ic_token2.svg"
                     class="blance_avatar">
              </span>
              <span class="balance">Available {{ functionName === 'Withdraw' ? 'withdraw' : 'deposit' }} amount {{ showTokenBalance }} </span>
            </b-btn>
          </b-form-group>
          <b-form-group style="text-align:center">
            <img height="40"
                 width="40"
                 v-if="isWaiting"
                 style="margin-top:20px"
                 src="@/assets/imgs/icons/wallet/ic_wait.svg">
          </b-form-group>
          <b-form-group label="Amount"
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
                                     v-else-if="!checkPrecision">
              Invalid format. The number of digits after the decimal point may be larger than the token precision.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededBalance && this.actionName=== 'Deposit Token'">
              Deposited token is larger than balance
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     v-else-if="isExceededContractBalance && (this.functionName === 'Withdraw')">
              Withdrawn {{ this.actionName === 'Withdraw Token' ? 'token' : 'vsys' }} is larger than balance
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
                    @click="nextPage">{{ functionName === 'Withdraw' ? 'Withdraw' : 'Deposit' }}
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="getTxType">
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
                         :transaction-bytes="dataObject.toBytes()"
                         @get-signature="getSignature"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="getTxType">
          </TokenConfirm>
          <p v-show="sendError"
             class="text-danger"><small>Sorry, transaction send failed! Failed reason: {{ errorMessage }}</small>}</p>
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
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :contract-id="contractId"
                        :tx-type="getTxType">
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
import { CONTRACT_EXEC_FEE, WITHDRAW_FUNCIDX, WITHDRAW_FUNCIDX_SPLIT, DEPOSIT_FUNCIDX, DEPOSIT_FUNCIDX_SPLIT, SYSTEM_CONTRACT_DEPOSIT_FUNCIDX, SYSTEM_CONTRACT_WITHDRAW_FUNCIDX, ACCOUNT_ADDR_TYPE, VSYS_PRECISION } from '@/js-v-sdk/src/constants'
import { NETWORK_BYTE } from '@/network'
import { SYSTEM_CONTRACT_TOKEN_ID_TEST, SYSTEM_CONTRACT_TOKEN_ID } from '@/constants'
import TokenConfirm from '../modals/TokenConfirm'
import TokenSuccess from '../modals/TokenSuccess'
import ColdSignature from '../modals/ColdSignature'
import browser from '@/utils/browser'
import common from '@/js-v-sdk/src/utils/common'
import BigNumber from 'bignumber.js'
import base58 from 'base-58'
import { mapActions, mapState } from 'vuex'
import Transaction from '@/js-v-sdk/src/transaction'
import { TokenContractDataGenerator, SystemContractDataGenerator } from '@/js-v-sdk/src/data'
export default {
    name: 'WithdrawToken',
    components: {ColdSignature, TokenSuccess, TokenConfirm},
    data: function() {
        return {
            errorMessage: '',
            amount: 0,
            attachment: '',
            pageId: 1,
            fee: BigNumber(CONTRACT_EXEC_FEE),
            coldPageId: 1,
            sendError: false,
            coldSignature: '',
            timeStamp: Date.now() * 1e6,
            hasConfirmed: false,
            contractId: '',
            validContractType: true,
            tokenId: '',
            isSplit: '',
            tokenUnity: '',
            tokenBalance: BigNumber(0),
            contractBalance: BigNumber(0),
            isWaiting: false,
            showToken: false,
            actionName: ''
        }
    },
    props: {
        balance: {
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
        showTokenBalance() {
            return this.functionName === 'Deposit' ? this.tokenBalance : this.contractBalance
        },
        showTokenId() {
            let systemTokenId = String.fromCharCode(NETWORK_BYTE) === 'M' ? SYSTEM_CONTRACT_TOKEN_ID : SYSTEM_CONTRACT_TOKEN_ID_TEST
            return systemTokenId === this.tokenId ? 'VSYS' : this.tokenId
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
            return !(!this.isInsufficient && this.isValidAmount && this.isValidContractId && this.showToken)
        },
        isValidAmount() {
            if (BigNumber(this.amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision && this.isValidNumFormat && (this.actionName === 'Withdraw Token' || this.actionName === 'Withdraw VSYS' ? !this.isExceededContractBalance : !this.isExceededBalance) && !this.isNegative
        },
        isExceededContractBalance() {
            return BigNumber(this.amount).isGreaterThan(this.contractBalance)
        },
        isExceededBalance() {
            let tokenBalance = this.actionName === 'Deposit VSYS' ? BigNumber(this.tokenBalance).minus(CONTRACT_EXEC_FEE) : this.tokenBalance
            return BigNumber(this.amount).isGreaterThan(tokenBalance)
        },
        isInsufficient() {
            return BigNumber(this.balance).isLessThan(BigNumber(CONTRACT_EXEC_FEE))
        },
        isValidNumFormat() {
            return common.isValidNumFormat(this.amount)
        },
        isNegative() {
            return BigNumber(this.amount).isLessThan(0)
        },
        checkPrecision() {
            return common.checkPrecision(BigNumber(this.amount).multipliedBy(this.tokenUnity), 0)
        },
        getTxType() {
            switch (this.actionName) {
            case 'Deposit Token':
                return 'Deposit Token to Contract'
            case 'Deposit VSYS':
                return 'Deposit VSYS to Contract'
            case 'Withdraw Token':
                return 'Withdraw Token from Contract'
            case 'Withdraw VSYS':
                return 'Withdraw VSYS from Contract'
            }
        },
        isValidContractId() {
            if (!this.contractId) {
                return void 0
            }
            try {
                let contractArr = base58.decode(this.contractId)
                return contractArr && contractArr.length === 26 && contractArr[0] === 6 && this.validContractType
            } catch (e) {
                return false
            }
        },
        selectedKeypair() {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, this.addresses[this.address]).keyPair
        },
        executorContractId() {
            return common.tokenIDToContractID(this.tokenId)
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.address].publicKey)
            tra['stored_tx']['functionExplain'] = this.functionName === 'Deposit' ? 'Deposit Token' : 'Withdraw Token'
            return tra
        }
    },
    methods: {
        ...mapActions(['updateBalance']),
        async checkContract() {
            this.isWaiting = true
            this.chain.getContractInfo(this.contractId).then(async response => {
                if (response.type === 'PaymentChannelContract' || response.type === 'LockContract') {
                    this.sendError = false
                    this.hasConfirmed = false
                    let tokenId = ''
                    let contractInfo = response.info
                    for (let i = 0; i < contractInfo.length; i++) {
                        if (contractInfo[i]['name'] === 'tokenId' && contractInfo[i]['type'] === 'TokenId') {
                            tokenId = contractInfo[i]['data']
                        }
                    }
                    let tokenContract = common.tokenIDToContractID(tokenId)
                    let tokenContractType = ''
                    try {
                        let tokenRes = await this.chain.getContractInfo(tokenContract)
                        this.isSplit = tokenRes.type === 'TokenContractWithSplit'
                        tokenContractType = tokenRes.type
                    } catch (err) {
                        console.log(err)
                    }
                    if (tokenContractType === 'SystemContract') {
                        this.tokenUnity = VSYS_PRECISION
                        this.tokenBalance = this.balance.toString()
                    } else {
                        try {
                            let tokenBalanceRes = await this.chain.getTokenBalance(this.address, tokenId)
                            this.tokenUnity = BigNumber(tokenBalanceRes.unity)
                            this.tokenBalance = BigNumber(tokenBalanceRes.balance).dividedBy(tokenBalanceRes.unity).toString()
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    let systemTokenId = String.fromCharCode(NETWORK_BYTE) === 'M' ? SYSTEM_CONTRACT_TOKEN_ID : SYSTEM_CONTRACT_TOKEN_ID_TEST
                    this.actionName = this.functionName + (tokenId === systemTokenId ? ' VSYS' : ' Token')
                    this.tokenId = tokenId
                    try {
                        let contractBalanceRes = await this.chain.getContractData(this.contractId, 0, ACCOUNT_ADDR_TYPE, this.address)
                        this.contractBalance = BigNumber(contractBalanceRes.value).dividedBy(this.tokenUnity).toString()
                    } catch (err) {
                        console.log(err)
                    }
                    this.validContractType = true
                    this.showToken = true
                } else {
                    this.validContractType = false
                }
                this.isWaiting = false
            }, respErr => {
                this.isWaiting = false
                this.validContractType = false
            })
        },
        inputAmount(num) {
            return BigNumber(num)
        },
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            let dataGenerator = this.actionName === 'Withdraw Token' || this.actionName === 'Deposit Token' ? new TokenContractDataGenerator() : new SystemContractDataGenerator()
            let functionIndex, functionData
            switch (this.actionName) {
            case 'Deposit Token':
                functionIndex = this.isSplit ? DEPOSIT_FUNCIDX_SPLIT : DEPOSIT_FUNCIDX
                functionData = dataGenerator.createDepositData(this.address, this.contractId, this.amount, this.tokenUnity)
                break
            case 'Deposit VSYS':
                functionIndex = SYSTEM_CONTRACT_DEPOSIT_FUNCIDX
                functionData = dataGenerator.createDepositData(this.address, this.contractId, this.amount)
                break
            case 'Withdraw Token':
                functionIndex = this.isSplit ? WITHDRAW_FUNCIDX_SPLIT : WITHDRAW_FUNCIDX
                functionData = dataGenerator.createWithdrawData(this.contractId, this.address, this.amount, this.tokenUnity)
                break
            case 'Withdraw VSYS':
                functionData = dataGenerator.createWithdrawData(this.contractId, this.address, this.amount)
                functionIndex = SYSTEM_CONTRACT_WITHDRAW_FUNCIDX
                break
            }
            tra.buildExecuteContractTx(publicKey, this.executorContractId, functionIndex, functionData, this.timeStamp)
            return tra
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
                this.updateBalance(true)
                if (this.actionName === 'Withdraw Token' || this.actionName === 'Deposit Token') {
                    for (let delayTime = 6000; delayTime <= 54000; delayTime *= 3) { //  Refresh interval will be 6s, 18s, 54s
                        setTimeout(this.sendBalanceChange, delayTime)
                    }
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
                this.$refs.withdrawOrDepositTokenModal.hide()
            }
        },
        resetPage() {
            this.amount = 0
            this.pageId = 1
            this.coldPageId = 1
            this.sendError = false
            this.coldSignature = ''
            this.contractId = ''
            this.validContractType = true
            this.tokenId = ''
            this.actionName = ''
            this.isSplit = ''
            this.tokenUnity = ''
            this.tokenBalance = BigNumber(0)
            this.contractBalance = BigNumber(0)
            this.isWaiting = false
            this.showToken = false
        },
        hideContractError() {
            this.validContractType = void 0
            this.showToken = false
            this.isWaiting = false
        },
        endSend() {
            this.$refs.withdrawOrDepositTokenModal.hide()
        },
        sendBalanceChange() {
            this.$emit('updateToken', 'update')
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.coldPageId++
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        }
    }
}
</script>

<style scoped lang="less">
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
.blance_avatar{
    width: 20px;
    height: 20px;
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
