<template>
  <div v-if="leaseRecords.length > 0"
       class="records">
    <div class="title-records">
      <span>Leasing Records</span>
      <div class="show-fee"
           @click="showFee">
        <span class="show-position"> ShowTxFee </span>
        <input class="show-fee2"
               type="checkbox"
               v-model="feeFlag"
               @click="showFee">
      </div>
      <b-dropdown class="pd-select"
                  router-tag="div"
                  no-caret
                  :disable="changeShowDisable"
                  variant="light">
        <template slot="button-content">
          <div style="display: inline-block; margin-right: 10px">
            <img v-if="!changeShowDisable"
                 src="../../../assets/imgs/icons/wallet/ic_filter.svg">
            <img v-if="changeShowDisable"
                 width="16"
                 height="16"
                 src="../../../assets/imgs/icons/wallet/ic_wait.svg">
            <span class="m-1">Latest {{ showingNum }} Records </span>
          </div>
          <img src="../../../assets/imgs/icons/signup/ic_arrow_down.svg">
        </template>
        <b-dropdown-item class="selection"
                         @click="changeShowNum(num)"
                         v-for="num in showNums"
                         :key="num">
          Show {{ num }} records
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="inherit-height">
      <div class="scroll"
           :style="{height: myHeight}">
        <div v-for="record in leaseRecords"
             :key="record.id">
          <Record :tx-record="record"
                  :fee-flag="feeFlag"
                  :cold-pub-key="coldPubKey"
                  :trans-type="transType"
                  :address-index="addressIndex"
                  :address="address"
                  :wallet-type="walletType"
                  :is-canceled="beCanceledList[record.id]"></Record>
        </div>
      </div>
    </div>
  </div>
  <div v-else
       class="records">
    <div class="title-records">
      <span>Leasing Records</span>
      <b-dropdown class="pd-select"
                  router-tag="div"
                  no-caret
                  :disable="changeShowDisable"
                  variant="light">
        <template slot="button-content">
          <div style="display: inline-block; margin-right: 10px">
            <img v-if="!changeShowDisable"
                 src="../../../assets/imgs/icons/wallet/ic_filter.svg">
            <img v-if="changeShowDisable"
                 width="16"
                 height="16"
                 src="../../../assets/imgs/icons/wallet/ic_wait.svg">
            <span class="m-1">Latest {{ showingNum }} Records </span>
          </div>
          <img src="../../../assets/imgs/icons/signup/ic_arrow_down.svg">
        </template>
        <b-dropdown-item class="selection"
                         @click="changeShowNum(num)"
                         v-for="num in showNums"
                         :key="num">Show {{ num }} records
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <img height="50"
         width="50"
         v-if="changeShowDisable"
         src="../../../assets/imgs/icons/wallet/ic_wait.svg">
    <div v-if="!changeShowDisable"
         class="empty">
      There are no transaction records.
    </div>
  </div>
</template>

<script>

import {NODE_IP, LEASE_TX, CANCEL_LEASE_TX} from '../../../constants'
import Vue from 'vue'
import Record from './Record'
import browser from '../../../utils/browser'
import JSONBigNumber from 'json-bignumber'
export default {
    name: 'LeaseRecords',
    components: {
        Record
    },
    created() {
        this.myHeight = (this.isMobile() ? window.innerHeight + 100 : window.innerHeight - 300) + 'px'
        if (this.address && Vue.ls.get('pwd') && this.tabActive === 'lease') {
            this.getLeaseRecords()
        }
    },
    data() {
        return {
            feeFlag: false,
            leaseRecords: [],
            showNums: [10, 50, 100, 200, 500, 1000],
            showingNum: 10,
            changeShowDisable: false,
            response: [],
            downloadFileType: 'csv',
            resFields: {
                transaction_id: 'id',
                sender_address: 'sender',
                sender_public_key: 'senderPublicKey',
                transaction_fee: 'fee',
                'timestamp(in nano second)': 'timestamp',
                signature: 'signature',
                recipient_address: 'recipient',
                amount: 'amount',
                attachment: 'attachment'
            },
            transType: 'lease',
            myHeight: '0',
            beCanceledList: {}
        }
    },
    props: {
        address: {
            type: String,
            default: '',
            require: true
        },
        coldPubKey: {
            type: String,
            default: '',
            require: true
        },
        addressIndex: {
            type: Number,
            default: 0
        },
        walletType: {
            type: String,
            default: '',
            require: true
        },
        tabActive: {
            type: String,
            default: 'trans'
        }
    },
    watch: {
        address(newAddr, oldAddr) {
            if (newAddr === '' || this.tabActive !== 'lease') {
                return
            }
            this.response = []
            this.changeShowDisable = false
            this.showingNum = 10
            if (this.address && Vue.ls.get('pwd')) {
                this.getLeaseRecords()
            }
        }
    },
    methods: {
        isMobile() {
            return browser.isMobile()
        },
        getLeaseRecords() {
            if (this.address) {
                const addr = this.address
                this.changeShowDisable = true
                const recordLimit = this.showingNum
                const url = NODE_IP + '/transactions/address/' + addr + '/limit/' + recordLimit
                let self = this
                this.$http.get(url).then(response => {
                    let rv = []
                    if (addr === this.address && recordLimit === this.showingNum) {
                        this.response = response.body[0]
                        let tempResponse = JSONBigNumber.parse(response.bodyText)[0]
                        for (var i = 0; i < response.body[0].length; i++) {
                            this.response[i].amount = tempResponse[i].amount
                            if (this.response[i].lease) {
                                this.response[i].lease.amount = tempResponse[i].lease.amount
                            }
                        }
                        this.response.forEach(function(v, i) {
                            if (v.type === LEASE_TX || v.type === CANCEL_LEASE_TX) {
                                rv.push(v)
                                if (v.type === CANCEL_LEASE_TX) {
                                    Vue.set(self.beCanceledList, v.lease.id, true)
                                }
                            }
                        })
                        this.leaseRecords = rv
                        this.changeShowDisable = false
                    }
                }, response => {
                    if (addr === this.address && recordLimit === this.showingNum) {
                        this.changeShowDisable = false
                    }
                })
            }
        },
        showFee() {
            if (!this.feeFlag) this.feeFlag = true
            else this.feeFlag = false
        },
        changeShowNum(newNum) {
            if (!this.changeShowDisable) {
                this.showingNum = newNum
                if (this.address && Vue.ls.get('pwd')) {
                    this.getLeaseRecords()
                }
            }
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
    border-radius: 4px;
    margin: 0px 0px;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
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
    height: inherit;
    padding-top: 52px;
    top: -52px;
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
.pd-select {
    position: absolute;
    right: 40px;
    display: flex;
    height: 36px;
    z-index: 100;
    background-color: #FFF;
}
.pd-select:hover, .pd-select:active {
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
.show-fee {
    position: absolute;
    right:250px;
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
</style>
