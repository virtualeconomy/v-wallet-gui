<template>
  <div>
    <img src="../../../assets/imgs/icons/operate/ic_success_circle.svg">
    <div class="infos">
      <b-form-group horizontal
                    class="form-line"
                    label="Amount"
                    label-for="amount">
        <b-form-input id="amount"
                      :value="amount + ' VEE'"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="From"
                    label-for="walletAddress">
        <b-form-input id="walletAddress"
                      v-model="address"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="To"
                    label-for="recipientAddress">
        <b-form-input id="recipientAddress"
                      v-model="recipient"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="Description"
                    label-for="attachment">
        <b-form-input id="attachment"
                      v-model="attachment"
                      class="des"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group horizontal
                    class="form-line"
                    label="Fee"
                    label-for="fee">
        <b-form-input id="fee"
                      :value="fee + 'vee'"
                      class="fee"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
    </div>
  </div>
</template>

<script>
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
            type: Number,
            required: true,
            default: 0
        },
        fee: {
            type: Number,
            required: true,
            default: 1
        },
        attachment: {
            type: String,
            required: true,
            default: ''
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
