<template>
  <div>
    <div class="text-input">
      1.Connect Ledger hardware device with USB
      <br>
      2.Enter VSYS app in Ledger device
      <br>
      3.Click "Send Request" on web
      <br>
      4.Confirm the transaction on Ledger device
    </div>
    <div class="image">
      <img class="image-input"
           src="@/assets/imgs/icons/wallet/img_ledger_device_transaction.png">
    </div>
    <b-row class="row">
      <b-col class="col-lef">
      </b-col>
      <b-col class="col-rit">
        <b-button
          block
          class="btn-confirm"
          variant="warning"
          size="lg"
          @click="sendData">Send Request
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import BigNumber from 'bignumber.js'
import { TX_FEE } from '@/constants.js'

export default {
    name: 'LedgerConfirm',
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        },
        recipient: {
            type: String,
            require: true,
            default: ''
        },
        amount: {
            type: BigNumber,
            require: true,
            default: function() {
                return BigNumber(0)
            }
        },
        fee: {
            type: BigNumber,
            require: true,
            default: function() {
                return BigNumber(TX_FEE)
            }
        },
        attachment: {
            type: String,
            default: ''
        },
        txType: {
            type: String,
            require: true,
            default: ''
        }
    },
    methods: {
        sendData() {
            return void 0
        }
    }
}
</script>

<style scoped>
.text-input {
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.image-input {
    background: #FAFAFA;
    margin-left: 70px;
}
.image {
    background: #FAFAFA;
    margin-top: 20px;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.row {
    margin-top: 25px;
    margin-bottom: 5px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
</style>
