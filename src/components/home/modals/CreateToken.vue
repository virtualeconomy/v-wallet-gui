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
          <b-form-group >
            <b-form-radio-group v-model="tokenMethod"
                                plain
                                style="display: flex;flex-direction: column"
                                @change="changeRadioState"
                                :options="tokenSplitStatus?selectedOptions1:selectedOptions2"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Contract"
                        label-for="descriptionInput"
                        v-show="tokenMethod==='NFT'">
            <b-form-select id=address-input
                           v-model="nftContractID"
                           :options="options(contracts,'con')"></b-form-select>
            <div class="mt">Cannot see your NFT contract?</div>
            <div class="no_nft_tips">You can <span @click="openContracts"
                                                   class="tips_color">Create NFT contract</span> or add existing contract in <span @click="openContracts"
                                                                                                                                   class="tips_color">management panel.</span></div>
            <span v-if="!isValidIssuer"
                  class="contract-check">You are not issuer of this nft contract.</span>
          </b-form-group>
          <b-form-group label="Contract Description"
                        label-for="descriptionInput"
                        v-show="tokenMethod!=='NFT'">
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
                        label-for="amount-input"
                        v-show="tokenMethod!=='NFT'">
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
          <b-form-group v-show="tokenMethod!=='NFT'">
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
          <b-form-group style="margin-top: 10px;">
            <label class="fee-remark">Transaction Fee {{ Number(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    size="lg"
                    block
                    :disabled="tokenMethod==='NFT'?!isValidContract:isSubmitDisabled"
                    @click="nextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="pageId===2">
          <TokenConfirm :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="txType">
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
          <TokenSuccess :address="address"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="txType">
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
          <b-form-group >
            <b-form-radio-group v-model="tokenMethod"
                                plain
                                style="display: flex;flex-direction: column"
                                @change="changeRadioState"
                                :options="tokenSplitStatus?selectedOptions1:selectedOptions2"></b-form-radio-group>
          </b-form-group>
          <b-form-group label="Contract"
                        label-for="descriptionInput"
                        v-show="tokenMethod==='NFT'">
            <b-form-select id=address-input
                           v-model="nftContractID"
                           :options="options(contracts,'con')"></b-form-select>
            <div class="mt">Cannot see your NFT contract?</div>
            <div class="no_nft_tips">You can <span @click="openContracts"
                                                   class="tips_color">Create NFT contract</span> or add existing contract in <span @click="openContracts"
                                                                                                                                   class="tips_color">management panel.</span></div>
            <span v-if="!isValidIssuer"
                  class="contract-check">You are not issuer of this nft contract.</span>
          </b-form-group>
          <b-form-group label="Contract Description"
                        label-for="descriptionInput"
                        v-show="tokenMethod!=='NFT'">
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
                        label-for="cold-amount-input"
                        v-show="tokenMethod!=='NFT'">
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
          <b-form-group v-show="tokenMethod!=='NFT'">
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
          <b-form-group>
            <label class="fee-remark">Transaction Fee {{ Number(fee) }} VSYS</label>
            <span v-if="isInsufficient"
                  class="vsys-check">Insufficient VSYS balance.</span>
          </b-form-group>
          <b-button variant="warning"
                    class="btn-continue"
                    block
                    size="lg"
                    :disabled="tokenMethod==='NFT'?!isValidContract:isSubmitDisabled"
                    @click="nextPage">Continue
          </b-button>
        </b-container>
        <b-container v-if="coldPageId===2">
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="txType">
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
                         :transaction-bytes="dataObject.toBytes()"
                         @get-signature="getSignature"
                         @next-page="nextPage"
                         @prev-page="prevPage"></ColdSignature>
        </b-container>
        <b-container v-show="coldPageId===4">
          <TokenConfirm :address="coldAddress"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="txType">
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
          <TokenSuccess :address="coldAddress"
                        :amount=inputAmount(amount)
                        :fee="fee"
                        :tx-type="txType">
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
import { CONTRACT_REGISTER_FEE, CONTRACT_EXEC_FEE } from '@/js-v-sdk/src/constants'
import { TRANSFER_ATTACHMENT_BYTE_LIMIT } from '@/constants'
import { NETWORK_BYTE } from '@/network'
import TokenConfirm from './TokenConfirm'
import TokenSuccess from './TokenSuccess'
import ColdSignature from './ColdSignature'
import browser from '@/utils/browser'
import Transaction from '@/js-v-sdk/src/transaction'
import BigNumber from 'bignumber.js'
import common from '@/js-v-sdk/src/utils/common'
import { mapActions, mapState } from 'vuex'
import { TokenContractDataGenerator, NonFungibleTokenContractDataGenerator, getContractFunctionIndex } from '@/js-v-sdk/src/data'
import { NFT } from '@/js-v-sdk/src/contract_type'
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
    txType: 'Register New Token',
    selectedWalletType: this ? this.walletType : 'hotWallet',
    contractDescription: '',
    tokenDescription: '',
    selectedNFTContract: false,
    nftContractID: '',
    tokenMethod: 'FT',
    selectedOptions1: [
        {text: 'Fungible Token', value: 'FT'},
        {text: 'Fungible Token with split/reverse-split function', value: 'FTWF'},
        {text: 'Non Fungible Token', value: 'NFT'}
    ],
    selectedOptions2: [
        {text: 'Fungible Token', value: 'FT'},
        {text: 'Non Fungible Token', value: 'NFT'}
    ],
    isValidIssuer: true,
    contracts: {}
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
    watch: {
        nftContractID(newContractId, oldContractId) {
            if (newContractId) {
                try {
                    this.getContractInfo()
                } catch (e) {
                    console.log(e)
                }
            }
        },
        address(newAddress, oldAddress) {
            if (newAddress && this.nftContractID) {
                try {
                    this.getContractInfo()
                } catch (e) {
                    console.log(e)
                }
            }
        },
        coldAddress(newAddress, oldAddress) {
            if (newAddress && this.nftContractID) {
                try {
                    this.getContractInfo()
                } catch (e) {
                    console.log(e)
                }
            }
        }
    },
    created() {
        this.getContracts()
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
        isValidContract() {
            return this.nftContractID && this.isValidIssuer
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
            return common.isValidNumFormat(this.amount)
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
            return BigNumber(balance).isLessThan(this.fee)
        },
        selectedKeypair() {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, this.addresses[this.address]).keyPair
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.coldAddress].publicKey)
            if (this.selectedNFTContract) {
                tra['stored_tx']['functionExplain'] = 'Issue NFT'
            } else {
                tra['stored_tx']['contractInitExplain'] = 'Create token' + (this.support === false ? ' ' : ' (support split) ') + 'with max supply ' + BigNumber(tra['stored_tx']['initData'][0]['value']).dividedBy(tra['stored_tx']['initData'][1]['value'])
                tra['stored_tx']['contractInitTextual'] = 'init(max=' + BigNumber(tra['stored_tx']['initData'][0]['value']).dividedBy(tra['stored_tx']['initData'][1]['value']) + ',unity= ' + BigNumber(tra['stored_tx']['initData'][1]['value']) + ",tokenDescription='" + tra['stored_tx']['initData'][2]['value'] + "')"
            }
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
        ...mapActions(['updateBalance', 'changeEventPool', 'changeAddTokenStatus', 'addTokenUpdateEventPool']),
        changeRadioState(val) {
            switch (val) {
            case 'NFT':
                this.fee = BigNumber(CONTRACT_EXEC_FEE)
                this.selectedNFTContract = true
                this.amount = 1
                this.support = false
                this.txType = 'Issue NFT'
                this.getContracts()
                break
            case 'FT':
                this.fee = BigNumber(CONTRACT_REGISTER_FEE)
                this.selectedNFTContract = false
                this.amount = 0
                this.support = false
                this.txType = 'Register New Token'
                break
            case 'FTWF':
                this.fee = BigNumber(CONTRACT_REGISTER_FEE)
                this.selectedNFTContract = false
                this.amount = 0
                this.support = true
                this.txType = 'Register New Token'
                break
            }
        },
        getContractInfo() {
            this.chain.getContractInfo(this.nftContractID).then(response => {
                let issuer = response.info[0].data
                let address = this.selectedWalletType === 'hotWallet' ? this.address : this.coldAddress
                this.isValidIssuer = issuer === address
            }, respError => {
            })
        },
        openContracts() {
            this.$refs.createTokenModal.hide()
            this.$root.$emit('bv::show::modal', 'contractManagementModal')
        },
        getContracts() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            if (userInfo && userInfo.contracts) {
                let contracts = JSON.parse(userInfo.contracts)
                for (let contract in contracts) {
                    if (contracts[contract] === 'NFT') {
                        Vue.set(this.contracts, contract, contracts[contract])
                    }
                }
            }
        },
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
            if (this.selectedNFTContract) {
                let dataGenerator = new NonFungibleTokenContractDataGenerator()
                let initData = dataGenerator.createIssueData(this.tokenDescription)
                let functionIndex = getContractFunctionIndex(NFT, 'ISSUE')
                tra.buildExecuteContractTx(publicKey, this.nftContractID, functionIndex, initData, this.timeStamp, this.tokenDescription)
            } else {
                let contract = this.support === false ? TOKEN_CONTRACT : TOKEN_CONTRACT_WITH_SPLIT
                let dataGenerator = new TokenContractDataGenerator()
                let initData = dataGenerator.createInitData(this.amount, BigNumber(Math.pow(10, this.unity)), this.tokenDescription)
                tra.buildRegisterContractTx(publicKey, contract, initData, this.contractDescription, this.timeStamp)
            }
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
            if (this.selectedNFTContract) {
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
                    let tokenId = common.contractIDToTokenID(this.nftContractID)
                    this.addTokenUpdateEventPool(tokenId)
                    this.updateBalance(true)
                }, respErr => {
                    this.errorMessage = respErr.message
                    if (this.errorMessage === undefined) {
                        this.errorMessage = 'Failed reason: Unknown.Please check network connection!'
                    }
                    this.sendError = true
                })
            } else {
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
                    this.addTokenUpdateEventPool(tokenId)
                    this.updateBalance(true)
                }, respErr => {
                    this.errorMessage = respErr.message
                    if (this.errorMessage === undefined) {
                        this.errorMessage = 'Failed reason: Unknown.Please check network connection!'
                    }
                    this.sendError = true
                })
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
            this.timeStamp = Date.now() * 1e6
            this.fee = BigNumber(CONTRACT_REGISTER_FEE)
            this.address = this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
            this.selectedWalletType = this.walletType
            this.contractDescription = ''
            this.tokenDescription = ''
            this.tokenMethod = 'FT'
            this.nftContractID = ''
            this.txType = 'Register New Token'
            this.selectedNFTContract = false
            this.isValidIssuer = true
            this.getContracts()
        },
        endSend() {
            this.$refs.createTokenModal.hide()
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
        options(addrs, type) {
            return Object.keys(addrs).reduce((options, addr) => {
                options.push({ value: addr, text: addr })
                return options
            }, [{ value: '', text: '<span class="text-muted">Please select a ' + (type === 'con' ? 'contract</span>' : 'wallet address</span>'), disabled: true }])
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        }
    }
}
</script>

<style scoped lang="less">
.mt{
    margin-top: 10px;
}
.no_nft_tips{
    color: #9091a3;
    font-size: 13px
}
.tips_color{
    cursor: pointer;
    color: #FF8737;
    font-size: 12px
}
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
.contract-check {
    display: block;
    font-size: 80%;
    color: #dc3545;
}
</style>
