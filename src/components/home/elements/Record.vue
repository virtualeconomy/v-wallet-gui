<template>
  <b-container class="record-unit">
    <b-row align-v="center">
      <b-col>
        <img src="../../../assets/imgs/logo-small.png"
             width="20px"
             height="20px">
      </b-col>
      <b-col class="record-detail">
        <b-row>
          <b-col class="title">Sent VEE</b-col>
        </b-row>
        <b-row>
          <b-col class="detail">To: <em>{{ transactionAddress }}</em></b-col>
        </b-row>
      </b-col>
      <b-col class="record-time">
        <b-row>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col class="record-time">| {{ transactionTime }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank">&nbsp;&nbsp;&nbsp;&nbsp;</b-col>
      <b-col class="record-amount">
        <div>
          <span>{{ transactionAmount }}VEE</span>
        </div>
      </b-col>
      <b-col class="record-action">
        ...
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { TESTNET_NODE } from '@/constants.js'

export default {
    name: 'Record',
    data() {
        return {
            transactionAddress: '',
            transactionTime: '',
            transactionAmount: ''
        }
    },
    methods: {
        getTransactionDetail(address) {
            const recordLimit = 2
            const url = TESTNET_NODE + 'transactions/address/' + address + '/limit/' + recordLimit

            this.$http.get(url).then(response => {
                console.log(response)
            }, response => {
                console.log(response)
            })
        }
    }
}
</script>

<style scoped lang="less">
.record-unit {
    height: 32px;
    width: 720px;
    font-size: 16px;
    vertical-align: center;
    background: lightyellow;

    .record-detail {
        .title {
            font-size: 16px;
            font-weight: bold;
        }
        .detail {
            font-size: 12px;
        }
    }
}

</style>
