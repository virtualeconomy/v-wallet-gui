<template>
  <div>
    <img src="../../../assets/imgs/icons/operate/ic_success_circle.svg">
    <div>
      <p class="p-tips">Your transaction is on the way!</p>
      <p class="p-info">You have leased {{ formatter(amount) }} VSYS</p>
    </div>
    <b-button variant="warning"
              class="btn-detail"
              @click="showDetails">View Details</b-button>
  </div>
</template>
<script>
import TxInfoModal from '../elements/TxInfoModal'
import { TX_FEE } from '../../../constants'
import browser from '../../../utils/browser'
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
        amount: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        address: {
            type: String,
            default: '',
            require: true
        },
        txId: {
            type: String,
            default: '',
            require: true
        }
    },
    methods: {
        showDetails() {
            this.$emit('show-details')
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        }
    }
}
</script>

<style scoped>
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
