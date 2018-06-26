<template>
  <div>
    <h3>Transaction Records</h3>
    <div v-for="record in transactionRecords"
         :key="record.transactionAddress">
      <Record :transaction-address="record.transactionAddress"
              transaction-time="record.transactionTime"
              :transaction-amount="record.transactionAmount"></Record>
    </div>
  </div>
</template>

<script>
import { TESTNET_NODE } from '../../../constants'
import Record from './Record'
import Vue from 'vue'

export default {
    name: 'Records',
    components: {
        Record
    },
    created() {
        if (this.address && Vue.ls.get('pwd')) {
            this.getTransactionRecord()
        }
    },
    props: {
        address: {
            type: String,
            default: '3N71HkihDfFQubGiQYax9JwfpZ57AcgqKY4',
            require: true
        }
    },
    data() {
        return {
            transactionRecords: [
                {
                    transactionAddress: '3N71HkihDfFQubGiQYax9JwfpZ57AcgqKY4',
                    transactionTime: '12:23, JUN 16',
                    transactionAmount: '-100'
                },
                {
                    transactionAddress: '3N71HkihDfFQubGiQYax9JwfpZ57AcgqKY4',
                    transactionTime: '12:23, JUN 16',
                    transactionAmount: '-100'
                },
                {
                    transactionAddress: '3N71HkihDfFQubGiQYax9JwfpZ57AcgqKY4',
                    transactionTime: '12:23, JUN 16',
                    transactionAmount: '-100'
                }
            ]
        }
    },
    methods: {
        getTransactionRecord() {
            const recordLimit = 2
            const url = TESTNET_NODE + '/transactions/address/' + this.address + '/limit/' + recordLimit

            console.log(url)
            this.transactionRecords = [
                {
                    transactionAddress: '3N71HkihDfFQubGiQYax9JwfpZ57AcgqKY4',
                    transactionTime: '12:23, JUN 16',
                    transactionAmount: '-100'
                }
            ]

            console.log(this.transactionRecords)
            this.$http.get(url).then(response => {
                console.log(response)
            }, response => {
                console.log(response)
            })
            return this.transactionRecords
        }
    }
}
</script>

<style scoped>

</style>
