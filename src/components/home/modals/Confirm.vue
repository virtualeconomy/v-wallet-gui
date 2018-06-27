<template>
  <div>
    <b-form-group horizontal
                  label="From"
                  label-for="walletAddress">
      <b-form-input id="walletAddress"
                    v-model="address"
                    readonly
                    :plaintext="true">
      </b-form-input>
    </b-form-group>
    <b-form-group horizontal
                  label="To"
                  label-for="recipientAddress">
      <b-form-input id="recipientAddress"
                    v-model="recipient"
                    readonly
                    :plaintext="true">
      </b-form-input>
    </b-form-group>
    <b-form-group horizontal
                  label="Amount"
                  label-for="amount">
      <b-form-input id="amount"
                    v-model="amount"
                    readonly
                    :plaintext="true">
      </b-form-input>
    </b-form-group>
    <b-form-group horizontal
                  label="Description"
                  label-for="attachment">
      <b-form-input id="attachment"
                    v-model="attachment"
                    readonly
                    :plaintext="true">
      </b-form-input>
    </b-form-group>
    <b-form-group horizontal
                  label="Fee"
                  label-for="fee">
      <b-form-input id="fee"
                    v-model="fee"
                    readonly
                    :plaintext="true">
      </b-form-input>
    </b-form-group>
  </div>
</template>

<script>
export default {
    name: 'Confirm',
    props: {
        address: {
            type: String,
            required: true
        },
        recipient: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        fee: {
            type: Number,
            required: true
        },
        attachment: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>

</style>
