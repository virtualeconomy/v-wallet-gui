<template>
  <div class="records">
    <div
      class="title-records">
      <span>Transaction Records</span>
      <div v-if="Object.keys(txRecords).length > 0"
           class="show-fee"
           :style="{right: isFullNode ? '488px' : '368px'}"
           @click="showFee">
        <span class="show-position"> ShowTxFee </span>
        <input class="show-fee2"
               type="checkbox"
               v-model="feeFlag"
               @click="showFee">
      </div>
      <b-dropdown
        class="type-select"
        router-tag="div"
        no-caret
        v-show="isFullNode"
        :disabled="changeShowDisable || changeTypeShowDisable"
        variant="light">
        <template
          slot="button-content">
          <div style="display:inline-block; margin-right: 10px;">
            <img v-if="!changeTypeShowDisable"
                 src="@/assets/imgs/icons/wallet/ic_filter.svg">
            <img height="16"
                 width="16"
                 v-if="changeTypeShowDisable"
                 src="@/assets/imgs/icons/wallet/ic_wait.svg">
            <span class="m-1"> Type </span>
          </div>
          <img src="@/assets/imgs/icons/signup/ic_arrow_down.svg">
        </template>
        <b-dropdown-item
          class="selection"
          v-for="(typeValue, type) in showTypes"
          :key="type"
          @click="changeType(type)"> {{ type }} </b-dropdown-item>
      </b-dropdown>
      <b-dropdown
        class="pd-select"
        router-tag="div"
        no-caret
        :disabled="changeShowDisable || changeTypeShowDisable"
        variant="light">
        <template
          slot="button-content">
          <div style="display:inline-block; margin-right: 10px;">
            <img
              v-if="!changeShowDisable"
              src="@/assets/imgs/icons/wallet/ic_filter.svg">
            <img
              height="16"
              width="16"
              v-if="changeShowDisable"
              src="@/assets/imgs/icons/wallet/ic_wait.svg">
            <span class="m-1">Latest {{ showingNum }} Records </span>
          </div>
          <img src="@/assets/imgs/icons/signup/ic_arrow_down.svg">
        </template>
        <b-dropdown-item
          class="selection"
          v-for="num in showNums"
          :key="num"
          @click="changeShowNum(num)">Show {{ num }} records</b-dropdown-item>
      </b-dropdown>
      <json-excel
        class="csv-export"
        :fetch="exportRecords"
        :fields="resFields"
        :type="downloadFileType"
        :name="'txs_' + exportTime + '_' + address + '.' + downloadFileType">
        <b-btn
          class="btn-export"
          :disabled="changeShowDisable || changeTypeShowDisable"
          variant="light"><img src="@/assets/imgs/icons/wallet/ic_export.svg"> Export</b-btn>
      </json-excel>
    </div>
    <div class="inherit-height">
      <div v-if="Object.keys(txRecords).length > 0"
           class="scroll"
           :style="{height: myHeight}">
        <template v-for="(records, monthYear, idx) in txRecords">
          <div :key="monthYear"
               :ref="idx"
               class="monthTtl">{{ monthYear }}</div>
          <div
            :key="monthYear+'c'"
            class="record-content">
            <div v-for="record in records"
                 :key="record.index">
              <TransactionRecord :tx-record="record"
                                 :fee-flag="feeFlag"
                                 :address="address"
                                 :wallet-type="walletType"
                                 :trans-type="transType"></TransactionRecord>
            </div>
          </div>
        </template>
      </div>
      <img height="50"
           width="50"
           v-if="Object.keys(txRecords).length === 0 && (changeShowDisable || changeTypeShowDisable)"
           src="@/assets/imgs/icons/wallet/ic_wait.svg">
      <div v-if="Object.keys(txRecords).length === 0 && !(changeShowDisable || changeTypeShowDisable)"
           class="empty">
        There is no transaction record.
      </div>
    </div>
  </div>
</template>

<script>
import { VSYS_PRECISION, REGISTER_CONTRACT_TX, EXECUTE_CONTRACT_TX, INT32_TYPE, SEND_FUNCIDX, WITHDRAW_FUNCIDX, DEPOSIT_FUNCIDX, SEND_FUNCIDX_SPLIT, WITHDRAW_FUNCIDX_SPLIT, DEPOSIT_FUNCIDX_SPLIT, NFT_CONTRACT_SEND_FUNCIDX, NFT_CONTRACT_DEPOSIT_FUNCIDX, NFT_CONTRACT_WITHDRAW_FUNCIDX } from '@/js-v-sdk/src/constants'
import BigNumber from 'bignumber.js'
import TransactionRecord from './TransactionRecord'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import browser from '@/utils/browser'
import { mapState } from 'vuex'
import common from '@/js-v-sdk/src/utils/common'
import certify from '@/utils/certify'
import convert from '@/js-v-sdk/src/utils/convert'
export default {
    name: 'TransactionRecords',
    components: {
        TransactionRecord,
        JsonExcel
    },
    created() {
        this.myHeight = (this.isMobile() ? window.innerHeight + 180 : window.innerHeight - 180) + 'px'
        if (this.address && Vue.ls.get('pwd') && this.activeTab === 'trans') {
            this.getTxRecords('all')
        }
    },
    data() {
        return {
            feeFlag: false,
            txRecords: {},
            showNums: [10, 50, 100, 200, 500, 1000],
            showTypes: {'Payment': 2, 'Leasing': 3, 'Cancel leasing': 4, 'Register contract': 8, 'Execute contract': 9, 'Show all': 0},
            showingNum: 10,
            showingTypeValue: 0,
            changeShowDisable: false,
            changeTypeShowDisable: false,
            response: [],
            responseExport: [],
            downloadFileType: 'csv',
            resFields: {
                transaction_id: 'id',
                transaction_fee: 'fee',
                timestamp: 'timestamp',
                recipient_address: 'recipient',
                amount: 'amount',
                encoded_attachment: 'attachment'
            },
            transType: 'payment',
            myHeight: '0',
            exportTime: Date.now()
        }
    },
    props: {
        address: {
            type: String,
            default: '',
            require: true
        },
        walletType: {
            type: String,
            default: ''
        },
        activeTab: {
            type: String,
            default: 'trans'
        }
    },
    watch: {
        address(newAddr, oldAddr) {
            if (newAddr === '' || this.activeTab !== 'trans') {
                return
            }
            this.txRecords = {}
            this.changeShowDisable = false
            this.showingNum = 10
            this.showingTypeValue = 0
            this.changeTypeShowDisable = false
            if (this.address && Vue.ls.get('pwd')) {
                this.getTxRecords('all')
            }
        },
        activeTab(newTab, oldTab) {
            if (newTab === 'trans') {
                this.changeShowDisable = false
                this.changeTypeShowDisable = false
                this.showingNum = 10
                this.showingTypeValue = 0
                this.txRecords = {}
                if (this.address && Vue.ls.get('pwd')) {
                    this.getTxRecords('all')
                }
            }
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            isFullNode: 'isFullNode'
        }),
        seedaddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        monthCounts() {
            return Object.keys(this.txRecords).length
        }
    },
    methods: {
        isMobile() {
            return browser.isMobile()
        },
        getMonthYearStr(date) {
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
            const d = new Date(date / 1e6)
            return monthNames[d.getMonth()] + ', ' + d.getFullYear()
        },
        parseExecution(contractType, functionIndex, Data) {
            let functionType = false // Only support send, deposit, withdraw
            let functionData = convert.parseFunctionData(Data)
            let amount = 0
            let recipient = ''
            switch (contractType) {
            case 'TokenContract':
                switch (functionIndex) {
                case SEND_FUNCIDX:
                    functionType = 'Sent'
                    recipient = functionData[0]['data']
                    amount = functionData[1]['data']
                    break
                case WITHDRAW_FUNCIDX:
                    functionType = 'Withdraw'
                    amount = functionData[2]['data']
                    break
                case DEPOSIT_FUNCIDX:
                    functionType = 'Deposit'
                    amount = functionData[2]['data']
                    break
                }
                break
            case 'TokenContractWithSplit':
                switch (functionIndex) {
                case SEND_FUNCIDX_SPLIT:
                    functionType = 'Sent'
                    recipient = functionData[0]['data']
                    amount = functionData[1]['data']
                    break
                case WITHDRAW_FUNCIDX_SPLIT:
                    functionType = 'Withdraw'
                    amount = functionData[2]['data']
                    break
                case DEPOSIT_FUNCIDX_SPLIT:
                    functionType = 'Deposit'
                    amount = functionData[2]['data']
                    break
                }
                break
            case 'NonFungibleContract':
                switch (functionIndex) {
                case NFT_CONTRACT_SEND_FUNCIDX:
                    functionType = 'Sent'
                    recipient = functionData[0]['data']
                    amount = 1
                    break
                case NFT_CONTRACT_WITHDRAW_FUNCIDX:
                    functionType = 'Withdraw'
                    // functionData[2]['data']: token Index
                    amount = 1
                    break
                case NFT_CONTRACT_DEPOSIT_FUNCIDX:
                    functionType = 'Deposit'
                    // functionData[2]['data']: token Index
                    amount = 1
                    break
                }
                break
            }
            return [functionType, amount, recipient]
        },
        getTxRecords(type) {
            if (this.address) {
                const addr = this.address
                if (type === 'all') {
                    this.changeTypeShowDisable = true
                    this.changeShowDisable = true
                } else if (type === 'num') {
                    this.changeShowDisable = true
                } else {
                    this.changeTypeShowDisable = true
                }
                const recordLimit = this.showingNum
                const txType = this.showingTypeValue
                let records = JSON.parse(window.localStorage.getItem(this.seedaddress))
                let tokenRecords = records.tokens ? JSON.parse(records.tokens) : {}
                this.showingTypeValue = this.isFullNode ? this.showingTypeValue : 0
                const getTransactions = () => { return this.showingTypeValue === 0 ? this.chain.getTxHistory(addr, recordLimit) : this.chain.getTxByType(addr, recordLimit, txType) }
                getTransactions().then(response => {
                    if (addr === this.address && recordLimit === this.showingNum && txType === this.showingTypeValue) {
                        this.response = response = this.showingTypeValue === 0 ? response[0] : response.transactions
                        let count = 0
                        this.txRecords = response.reduce((recList, recItem) => {
                            const month = this.getMonthYearStr(recItem['timestamp'])
                            if (!recList[month]) {
                                Vue.set(recList, month, [])
                            }
                            let senderAddr = recItem['proofs'] ? recItem['proofs'][0]['address'] : 'no sender'
                            recItem['index'] = ++count
                            recList[month].push(recItem)
                            if (recItem['type'] === EXECUTE_CONTRACT_TX) {
                                let tokenIndex = 0
                                let functionData = convert.parseFunctionData(recItem['functionData'])
                                for (let index in functionData) {
                                    if (functionData[index]['type'] === INT32_TYPE) {
                                        tokenIndex = functionData[index]['data']
                                        break
                                    }
                                }
                                let tokenId = common.contractIDToTokenID(recItem['contractId'], tokenIndex)
                                if (certify.isCertified(tokenId) || tokenRecords.hasOwnProperty(tokenId)) {
                                    let contractType = certify.isCertified(tokenId) ? certify.getContractType(tokenId) : tokenRecords[tokenId]['contractType']
                                    let [functionType, amount, recipient] = this.parseExecution(contractType, recItem['functionIndex'], recItem['functionData'])
                                    recItem['tokenName'] = certify.isCertified(tokenId) ? certify.officialName(tokenId) : tokenRecords[tokenId]['name']
                                    recItem['functionType'] = functionType
                                    recItem['recipient'] = recipient
                                    recItem['amount'] = amount
                                    recItem['unity'] = certify.isCertified(tokenId) ? certify.getUnity(tokenId) : tokenRecords[tokenId]['unity']
                                    recItem['tokenId'] = tokenId
                                }
                            }
                            if (recItem['type'] === REGISTER_CONTRACT_TX) {
                                let contract = recItem.contract
                                let triggersLength = contract.triggers.length
                                let descriptorsLength = contract.descriptors.length
                                if (triggersLength === 1) {
                                    if (descriptorsLength === 12) {
                                        recItem['contractType'] = 'TokenContractWithSplit'
                                    } else if (descriptorsLength === 6) {
                                        recItem['contractType'] = 'NonFungibleContract'
                                    } else if (descriptorsLength === 11) {
                                        recItem['contractType'] = 'TokenContract'
                                    }
                                } else if (triggersLength === 3 && descriptorsLength === 6) {
                                    recItem['contractType'] = 'PaymentChannelContract'
                                } else if (triggersLength === 3 && descriptorsLength === 1) {
                                    recItem['contractType'] = 'LockContract'
                                }
                            }
                            if (recItem['recipient'] === this.address && this.address === senderAddr) { // send to self
                                let recItemCopy = JSON.parse(JSON.stringify(recItem))
                                recItemCopy['SelfSend'] = true
                                recItemCopy['index'] = ++count
                                recList[month].push(recItemCopy)
                            }
                            return recList
                        }, {})
                        this.changeTypeShowDisable = false
                        this.changeShowDisable = false
                    }
                }, respErr => {
                    if (addr === this.address && recordLimit === this.showingNum && txType === this.showingTypeValue) {
                        this.changeTypeShowDisable = false
                        this.changeShowDisable = false
                    }
                })
            }
        },
        changeShowNum(newNum) {
            if (!this.changeShowDisable) {
                this.showingNum = newNum
                if (this.address && Vue.ls.get('pwd')) {
                    this.getTxRecords('num')
                }
            }
        },
        changeType(newType) {
            if (!this.changeTypeShowDisable) {
                this.showingTypeValue = this.showTypes[newType]
                if (this.address && Vue.ls.get('pwd')) {
                    this.getTxRecords('type')
                }
            }
        },
        showFee() {
            if (!this.feeFlag) this.feeFlag = true
            else this.feeFlag = false
        },
        exportRecords() {
            if (this.response) {
                let tempResponse = JSON.parse(JSON.stringify(this.response))
                for (let i = 0; i < tempResponse.length; i++) {
                    if (tempResponse[i].amount) {
                        tempResponse[i].amount = BigNumber(this.response[i].amount).dividedBy(tempResponse[i].unity ? tempResponse[i].unity : VSYS_PRECISION)
                    }
                    tempResponse[i].fee = tempResponse[i].fee / VSYS_PRECISION
                    tempResponse[i].timestamp = new Date(tempResponse[i].timestamp / 1e6).toLocaleString()
                }
                this.responseExport = tempResponse
            }
            return this.responseExport
        }
    }
}
</script>

<style scoped lang="less">
.empty {
    padding: 24px 0;
    background-color: #1111;
}
.records {
    background: #FFFFFF;
    border: 1px solid #E8E9ED;
    height: 900px;
    border-radius: 4px;
    margin: 0px 0px;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 900px;
}
.monthTtl {
    height: 44px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid #EDEDF0;
    background: #FFF;
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
    padding: 14px 21px;
}
.inherit-height {
    position: relative;
    padding-top: 52px;
    height: inherit;
    top:-52px;
    margin-bottom: -52px;
}
.title-records {
    background: #FAFAFA;
    padding: 8px 20px;
    border-bottom: 1px solid #EDEDF0;
    height: 52px;
    text-align: left;
    font-size: 17px;
    color: #010102;
    letter-spacing: 0;
    display: flex;
    align-items: Center;
}
.csv-export {
    position: absolute;
    right: 40px;
    z-index: 100;
}
.btn-export {
    width: 116px;
    height: 36px;
    background-color: #FFF;
    border-color: #E8E9ED;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
    align-items: Center;
    display: flex;
    justify-content:center;
    img {
        margin-right: 8px;
    }
}
.show-fee {
    position: absolute;
    right:488px;
    width: 116px;
    height: 36px;
    border-color: #E8E9ED;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
    align-items: Center;
    display: flex;
    justify-content:center;
}
.show-fee2 {
    position: absolute;
    right:7px;
    width: 15px;
    height: 30px;
    display: flex;
    z-index: 100;
    cursor:pointer;
    background-color: #FFF;
}
.pd-select {
    position: absolute;
    right: 166px;
    display: flex;
    height: 36px;
    z-index: 100;
    background-color: #FFF;
}
.pd-select:hover, .pd-select:active {
    background-color: #FAFAFA !important;
}
.type-select {
    position: absolute;
    right: 380px;
    display: flex;
    height: 36px;
    z-index: 100;
    background-color: #FFF;
}
.type-select:hover, .type-select:active {
    background-color: #FAFAFA !important;
}
.selection {
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
}
.show-position {
    position: absolute;
    left: 13px;
}
.m-1 {
    width: 116px;
    height: 36px;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
}
</style>
