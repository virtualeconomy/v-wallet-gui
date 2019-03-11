<template>
  <div>
    <img src="../../../assets/imgs/icons/operate/ic_success_circle.svg">
    <div class="infos">
      <b-form-group horizontal
                    class="form-line"
                    label="Amount"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(amount) + ' VSYS'"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="From"
                    label-for="walletAddress_success">
        <b-form-input id="walletAddress_success"
                      v-model="address"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="To"
                    label-for="recipientAddress_success">
        <b-form-input id="recipientAddress_success"
                      v-model="recipient"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="Description"
                    label-for="attachment_success">
        <b-form-input id="attachment_success"
                      v-model="attachment"
                      class="des"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="Fee"
                    label-for="fee_success">
        <b-form-input id="fee_success"
                      :value="formatter(fee) + ' VSYS'"
                      class="fee"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import browser from '../../../utils/browser'
import BigNumber from 'bignumber.js'
import { TX_FEE } from '../../../constants'
export default {
    name: 'Confirm',
    props: {
        address: {
            type: String,
            required: true,
            default: ''
        },
        recipient: {
            type: String,
            required: true,
            default: ''
        },
        amount: {
            type: BigNumber,
            required: true,
            default: function() {
                return BigNumber(0)
            }
        },
        fee: {
            type: BigNumber,
            required: true,
            default: function() {
                return BigNumber(TX_FEE)
            }
        },
        attachment: {
            type: String,
            default: ''
        }
    },
    methods: {
        formatter(num) {
            return browser.bigNumberFormatter(num)
        }
    }
}
</script>

<style scoped>
.form-line {
    margin-bottom: 0px;
    border-top: 1px solid #E8E9ED;
    height: 48px;
    text-align: right;
    padding-top: 5px;
}
.infos {
    margin-top: 30px;
    border-bottom: 1px solid #E8E9ED;
    margin-bottom: 40px;
}
.amount {
    font-size: 17px;
    color: #FF8737;
    letter-spacing: 0;
    text-align: right;
}
.addr {
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: right;
}
.des {
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: right;
}
.fee {
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: right;
}
</style>
