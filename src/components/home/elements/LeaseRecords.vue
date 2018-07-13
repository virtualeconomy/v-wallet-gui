<template>
  <div v-if="leaseRecords.length > 0"
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
                         :key="num">
          Show {{ num }} records
        </b-dropdown-item>
      </b-dropdown>
      <json-excel class="csv-export"
                  :data="response"
                  :fields="resFields"
                  :type="downloadFileType"
                  :name="'txs_' + address + '.' + downloadFileType">
        <b-btn class="btn-export"
               :disabled="changeShowDisable"
               variant="light">
        <img src="../../../assets/imgs/icons/wallet/ic_export.svg"> Export</b-btn>
      </json-excel>
    </div>

    <div class="inherit-height">
      <div class="scroll">
        <div v-for="record in leaseRecords"
             :key="record.id">
          <Record :tx-record="record"
                  :address="address"
                  :type="type"></Record>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
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

import {TESTNET_NODE, TYPE_LEASE, TYPE_CANCEL_LEASE} from '../../../constants'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import Record from './Record'

export default {
    name: 'LeaseRecords',
    components: {
        Record,
        JsonExcel
    },
    created() {
        if (this.address && Vue.ls.get('pwd')) {
            this.getLeaseRecords()
        }
    },
    data() {
        return {
            leaseRecords: [],
            showNums: [10, 50, 100, 200, 500, 1000],
            showingNum: 10,
            changeShowDisable: false,
            response: void 0,
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
            type: 'lease'
        }
    },
    props: {
        address: {
            type: String,
            default: '',
            require: true
        }
    },
    watch: {
        address() {
            this.leaseRecords = {}
            this.response = void 0
            this.changeShowDisable = false
            this.showingNum = 10
            if (this.address && Vue.ls.get('pwd')) {
                this.getLeaseRecords()
            }
        }
    },
    methods: {
        getLeaseRecords() {
            if (this.address) {
                const addr = this.address
                this.changeShowDisable = true
                const recordLimit = this.showingNum
                const url = TESTNET_NODE + '/transactions/address/' + addr + '/limit/' + recordLimit
                let self = this
                this.$http.get(url).then(response => {
                    if (addr === this.address && recordLimit === this.showingNum) {
                        this.response = response.body[0]
                        this.response.forEach(function(v, i) {
                            if (v.type === TYPE_LEASE || v.type === TYPE_CANCEL_LEASE) {
                                self.leaseRecords.push(v)
                            }
                        })
                        this.changeShowDisable = false
                        console.log(this.leaseRecords)
                    }
                }, response => {
                    if (addr === this.address && recordLimit === this.showingNum) {
                        this.changeShowDisable = false
                    }
                })
            }
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
    height: inherit;
}
.scroll {
    height: inherit;
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
.selection {
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
}
</style>
