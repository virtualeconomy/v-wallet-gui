<template>
  <div class="lease-success">
    <img src="@/assets/imgs/icons/operate/ic_success_circle.svg">
    <div>
      <p class="p-tips">Your transaction is on the way!</p>
      <p class="p-info">You have leased {{ amount }} VSYS</p>
    </div>
    <b-button variant="warning"
              class="btn-detail"
              @click="showDetails">View Details</b-button>
  </div>
</template>
<script>
import TxInfoModal from '../elements/TxInfoModal'
import { TX_FEE } from '@/js-v-sdk/src/constants'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
export default {
    name: 'LeaseSuccess',
    components: { TxInfoModal },
    data: function() {
        return {
            fee: BigNumber(TX_FEE)
        }
    },
    props: {
        dataObject: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    computed: {
        amount() {
            return browser.bigNumberFormatter(BigNumber(this.dataObject.stored_tx.amount).dividedBy(1e8))
        }
    },
    methods: {
        showDetails() {
            this.$emit('show-details')
        }
    }
}
</script>

<style scoped>
.lease-success {
    text-align: center;
}
.p-tips {
    font-size: 28px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 5px;
}
.p-info {
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: center;
}
.btn-detail {
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    height: 44px;
    width: 220px;
    margin-top: 7px;
}
</style>
