<template>
  <div>
    <h3>Transaction Records</h3>
    <div v-if="txRecords.length > 0">
      <div v-for="record in txRecords"
           :key="record.id">
        <Record :tx-record="record"
                :address="address"></Record>
      </div>
    </div>
    <div v-else
         class="empty">
      <p>There are no transaction records.</p>
    </div>
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
            txRecords: []
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
        getTxRecords() {
            const recordLimit = TRX_RECORD_LIMIT
            const url = TESTNET_NODE + '/transactions/address/' + this.address + '/limit/' + recordLimit
            this.$http.get(url).then(response => {
                this.txRecords = response.body[0]
                console.log(this.txRecords)
            }, response => {
                console.log(response)
            })
            return this.txRecords
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

</style>
