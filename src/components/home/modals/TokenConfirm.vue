<template>
  <div>
    <div class="infos">
      <b-form-group v-if="txType==='Burn Token'"
                    horizontal
                    class="form-line"
                    label="Burn Amount"
                    label-for="amount_confirm">
        <b-form-input id="amount_confirm"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType==='Register New Token'"
                    horizontal
                    class="form-line"
                    label="Total Supply"
                    label-for="amount_confirm">
        <b-form-input id="amount_confirm"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else
                    horizontal
                    class="form-line"
                    label="Issue Amount"
                    label-for="amount_confirm">
        <b-form-input id="amount_confirm"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    label="Type"
                    class="form-line"
                    label-for="tranType">
        <b-form-input id="tranType"
                      :value="txType"
                      class="des"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="From"
                    label-for="walletAddress_confirm">
        <b-form-input id="walletAddress_confirm"
                      v-model="address"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="Fee"
                    label-for="fee_confirm">
        <b-form-input id="fee_confirm"
                      :value="Number(fee) + ' VSYS'"
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
import { TOKEN_FEE } from '../../../constants'
export default {
    name: 'TokenConfirm',
    props: {
        address: {
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
                return BigNumber(TOKEN_FEE)
            }
        },
        txType: {
            type: String,
            require: true,
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
    text-align: center;
    padding-top: 5px;
}
.box {

    overflow-x: visible;
}
.infos {
    width: 409px;
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
