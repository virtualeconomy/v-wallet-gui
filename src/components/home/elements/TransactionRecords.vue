<template>
  <div v-if="Object.keys(txRecords).length > 0"
       class="records">
    <div
      class="title-records">
      <span>Transaction Records</span>
      <div class="show-fee"
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
          @click="changeType(type)"> Type </b-dropdown-item>
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
      <div class="scroll"
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
    </div>
  </div>
  <div v-else
       class="records">
    <div class="title-records">
      <span>Transaction Records</span>
      <b-dropdown
        class="type-select"
        router-tag="div"
        no-caret
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
          @click="changeType(type)"> Type </b-dropdown-item>
      </b-dropdown>
      <b-dropdown class="pd-select"
                  router-tag="div"
                  no-caret
                  :disabled="changeShowDisable || changeTypeShowDisable"
                  variant="light">
        <template slot="button-content">
          <div style="display:inline-block; margin-right: 10px;">
            <img v-if="!changeShowDisable"
                 src="@/assets/imgs/icons/wallet/ic_filter.svg">
            <img height="16"
                 width="16"
                 v-if="changeShowDisable"
                 src="@/assets/imgs/icons/wallet/ic_wait.svg">
            <span class="m-1">Latest {{ showingNum }} Records </span>
          </div>
          <img src="@/assets/imgs/icons/signup/ic_arrow_down.svg">
        </template>
        <b-dropdown-item class="selection"
                         v-for="num in showNums"
                         :key="num"
                         @click="changeShowNum(num)">Show {{ num }} records</b-dropdown-item>
      </b-dropdown>
      <json-excel class="csv-export"
                  :data="response ? [] : response"
                  :fields="resFields"
                  :type="downloadFileType"
                  :name="'txs_' + address + '.' + downloadFileType">
        <b-btn class="btn-export"
               :disabled="changeShowDisable || changeTypeShowDisable"
               variant="light"><img src="@/assets/imgs/icons/wallet/ic_export.svg"> Export</b-btn>
      </json-excel>
    </div>
    <img
      height="50"
      width="50"
      v-if="changeShowDisable || changeTypeShowDisable"
      src="@/assets/imgs/icons/wallet/ic_wait.svg">
    <div
      v-if="!(changeShowDisable && changeTypeShowDisable)"
      class="empty">
      There is no transaction record.
    </div>
  </div>
</template>

<script>
import { NODE_IP, VSYS_PRECISION } from '@/constants'
import TransactionRecord from './TransactionRecord'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import browser from '@/utils/browser'
import base58 from '@/libs/base58'
import crypto from '@/utils/crypto'
import JSONBigNumber from 'json-bignumber'
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
                'timestamp(in nano second)': 'timestamp',
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
                if (this.address && Vue.ls.get('pwd')) {
                    this.getTxRecords('all')
                }
            }
        }
    },
    computed: {
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
                const url = this.showingTypeValue === 0 ? NODE_IP + '/transactions/list?address=' + addr + '&limit=' + recordLimit : NODE_IP + '/transactions/list?address=' + addr + '&limit=' + recordLimit + '&txType=' + txType
                this.$http.get(url).then(response => {
                    if (addr === this.address && recordLimit === this.showingNum && txType === this.showingTypeValue) {
                        this.response = response.body.transactions
                        let count = 0
                        let tempResponse = JSONBigNumber.parse(response.bodyText).transactions
                        for (let i = 0; i < this.response.length; i++) {
                            this.response[i].amount = tempResponse[i].amount
                        }
                        this.txRecords = response.body.transactions.reduce((recList, recItem) => {
                            const month = this.getMonthYearStr(recItem['timestamp'])
                            if (!recList[month]) {
                                Vue.set(recList, month, [])
                            }
                            let senderAddr = recItem['proofs'] ? crypto.buildRawAddress(base58.decode(recItem['proofs'][0]['publicKey'])) : 'no sender'
                            recItem['index'] = ++count
                            recList[month].push(recItem)
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
                }, response => {
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
                        tempResponse[i].amount = this.response[i].amount.dividedBy(VSYS_PRECISION)
                    }
                    tempResponse[i].fee = tempResponse[i].fee / VSYS_PRECISION
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
