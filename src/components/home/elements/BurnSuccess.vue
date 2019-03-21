<template>
  <div>
    <img class="burn-icon"
         src="../../../assets/imgs/icons/operate/ic_burn.svg">
    <div class="infos">
      <b-form-group horizontal
                    class="form-line"
                    label="Burn Amount"
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
export default {
    name: 'IssueConfirm',
    props: {
        address: {
            type: String,
            required: true,
            default: ''
        },
        amount: {
            type: Number,
            required: true,
            default: 0
        },
        fee: {
            type: Number,
            required: true,
            default: 1
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
.burn-icon {
    margin-left: 170px;
}
</style>
