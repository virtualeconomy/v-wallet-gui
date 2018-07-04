<template>
  <div v-if="Object.keys(txRecords).length > 0"
       class="records">
    <div
      class="tittle-records">
      <span>Transaction Record</span>
      <b-btn
        class="pd-select"
        variant="light">Latest 10 Records</b-btn>
      <b-btn
        class="btn-export"
        variant="light"><img src="../../../assets/imgs/icons/wallet/ic_export.svg"> Export</b-btn>
    </div>
    <div class="inherit-height">
      <div
        class="scroll">
        <template v-for="(records, monthYear, idx) in txRecords">
          <div :key="monthYear"
               :ref="idx"
               class="monthTtl">{{ monthYear }}</div>
          <div
            :key="monthYear+'c'"
            class="record-content">
            <div v-for="record in records"
                 :key="record.id">
              <Record :tx-record="record"
                      :address="address"></Record>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div v-else
       class="empty">
    <span>There are no transaction records.</span>
  </div>
</template>

<script>
import { TESTNET_NODE, TRX_RECORD_LIMIT } from '../../../constants'
import Record from './Record'
import Vue from 'vue'

export default {
    name: 'Records',
    components: {
        Record
    },
    created() {
        console.log(this.address)
        if (this.address && Vue.ls.get('pwd')) {
            this.getTxRecords()
        }
    },
    updated() {
        console.log(this.$refs[0][0].offsetTop)
        console.log(this.$refs[1][0].offsetTop)
    },
    data() {
        return {
            txRecords: {}
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
        address(newAddr, oldAddr) {
            console.log(newAddr, oldAddr)
            this.txRecords = {}
            if (this.address && Vue.ls.get('pwd')) {
                this.getTxRecords()
            }
        }
    },
    computed: {
        monthCounts() {
            return Object.keys(this.txRecords).length
        }
    },
    methods: {
        getMonthYearStr(date) {
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
            const d = new Date(date / 1e6)
            return monthNames[d.getMonth()] + ', ' + d.getFullYear()
        },
        getTxRecords() {
            if (this.address) {
                const recordLimit = TRX_RECORD_LIMIT
                const url = TESTNET_NODE + '/transactions/address/' + this.address + '/limit/' + recordLimit
                this.$http.get(url).then(response => {
                    this.txRecords = response.body[0].reduce((rv, x) => {
                        const aa = this.getMonthYearStr(x['timestamp'])
                        if (!rv[aa]) {
                            Vue.set(rv, aa, [])
                        }
                        rv[aa].push(x)
                        return rv
                    }, {})
                }, response => {
                    console.log(response)
                })
            }
        }
    }
}
</script>

<style scoped lang="less">
.empty {
    border-top: 1px solid #1111;
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
.tittle-records {
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
    position: absolute;
    right: 40px;
    width: 116px;
    height: 36px;
    z-index: 100;
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
    width: 176px;
    height: 36px;
    z-index: 100;
    background-color: #FFF;
    border-color: #E8E9ED;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
    align-items: Center;
    display: flex;
}
</style>
