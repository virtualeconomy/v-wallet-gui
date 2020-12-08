<template>

</template>

<script>
import Vue from 'vue'
import browser from '@/utils/browser'
import Transaction from '@/js-v-sdk/src/transaction'
import { NETWORK_BYTE } from '@/network'
import { NFT, LOCK, PAYMENT_CHANNEL } from '@/js-v-sdk/src/contract_type'
import { mapActions, mapState } from 'vuex'
import { TRANSFER_ATTACHMENT_BYTE_LIMIT } from '@/constants'
import seedLib from '@/libs/seed.js'
import common from '@/js-v-sdk/src/utils/common'
import { NON_FUNGIBLE_TOKEN_CONTRACT, LOCK_CONTRACT, PAYMENT_CONTRACT } from '@/js-v-sdk/src/contract'
import { NonFungibleTokenContractDataGenerator, LockContractDataGenerator, PaymentChannelContractDataGenerator } from '@/js-v-sdk/src/data'
import { CONTRACT_REGISTER_FEE } from '@/js-v-sdk/src/constants'
import BigNumber from 'bignumber.js'

var initData = {
    selectedContractType: '',
    selectedAddress: '',
    selectedTokenID: '',
    tokenList: {},
    errorMessage: '',
    qrArray: new Array(0),
    qrTotalPage: 1,
    pageId: 1,
    fee: BigNumber(CONTRACT_REGISTER_FEE),
    coldPageId: 1,
    address: this ? (this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress) : '',
    coldAddress: this ? (this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress) : '',
    sendError: false,
    coldSignature: '',
    timeStamp: Date.now() * 1e6,
    hasConfirmed: false,
    selectedWalletType: this ? this.walletType : 'hotWallet',
    contractDescription: ''
}

export default {
    name: 'CreateContract',
    prop: {
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
        }
    },
    data: function() {
        return initData
    },
    created() {
    },
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account'
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
            return (this.isValidDescription(this.contractDescription) || !this.contractDescription)
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        selectedKeypair() {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, this.addresses[this.address]).keyPair
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.coldAddress].publicKey)
            return tra
        },
        isValidDescription() {
            return function(description) {
                if (!description) {
                    return void 0
                }
                return common.getLength(description) <= TRANSFER_ATTACHMENT_BYTE_LIMIT
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
        ...mapActions(['updateBalance', 'changeEventPool', 'changeAddTokenStatus', 'addTokenUpdateEventPool']),
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
        resetData() {
            this.selectedAddress = ''
            this.selectedContractType = ''
            this.contractDescription = ''
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            let contract = this.selectedContractType === NFT ? NON_FUNGIBLE_TOKEN_CONTRACT : (this.selectedContractType === LOCK ? LOCK_CONTRACT : PAYMENT_CONTRACT)
            let dataGenerator = this.selectedContractType === NFT ? new NonFungibleTokenContractDataGenerator() : (this.selectedContractType === LOCK ? new LockContractDataGenerator() : new PaymentChannelContractDataGenerator())
            let initData = this.selectedContractType === NFT ? dataGenerator.createInitData() : (this.selectedContractType === LOCK ? dataGenerator.createInitData(this.selectedTokenID) : dataGenerator.createInitData(this.selectedTokenID))
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
                let builtTransaction = this.buildTransaction(this.selectedKeypair.publicKey)
                this.account.buildFromPrivateKey(this.selectedKeypair.privateKey)
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
                let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
                Vue.set(userInfo.contract, response.contractId, this.selectedContractType)
                window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
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
                this.$refs.createContractModal.hide()
            }
        },
        resetPage() {
            this.qrTotalPage = 1
            this.qrArray = new Array(0)
            this.pageId = 1
            this.coldPageId = 1
            this.sendError = false
            this.coldSignature = ''
            this.timeStamp = Date.now() * 1e6
            this.address = this.walletType === 'hotWallet' ? this.selectedAddress : this.defaultAddress
            this.coldAddress = this.walletType === 'coldWallet' ? this.selectedAddress : this.defaultColdAddress
            this.selectedWalletType = this.walletType
            this.contractDescription = ''
        },
        endSend() {
            this.$refs.createContractModal.hide()
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
        }
    }
}
</script>

<style scoped>

</style>
