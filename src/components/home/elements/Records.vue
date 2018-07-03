<template>
  <div v-if="Object.keys(txRecords).length > 0"
       class="records">
    <div class="scroll">
      <template v-for="(records, monthYear) in txRecords">
        <div :key="monthYear"
             class="monthTtl">{{ monthYear }}</div>
        <div v-for="record in records"
             :key="record.id">
          <Record :tx-record="record"
                  :address="address"></Record>
        </div>
      </template>
    </div>
  </div>
  <div v-else
       class="empty">
    <p>There are no transaction records.</p>
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
        if (this.address && Vue.ls.get('pwd')) {
            this.getTxRecords()
        }
    },
    data() {
        return {
            txRecords: {}
        }
    },
    props: {
        address: {
            type: String,
            default: '3N71HkihDfFQubGiQYax9JwfpZ57AcgqKY4',
            require: true
        }
    },
    methods: {
        getMonthYearStr(date) {
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
            const d = new Date(date / 1e6)
            return monthNames[d.getMonth()] + ', ' + d.getFullYear()
        },
        getTxRecords() {
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
                console.log(this.txRecords)
            }, response => {
                console.log(response)
            })
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
    overflow: scroll;
}
.monthTtl {
    height: 44px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid #EDEDF0;
    background: #FAFAFA;
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
    padding: 14px 21px;
}
</style>
