<template>
  <b-modal id="accountModal"
           title="Account">
    <div>
      <b-form-group label="Wallet Address"
                    label-for="walletAddress">
        <b-form-input id="walletAddress"
                      readonly
                      size="sm"
                      v-model="walletAddress">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Cold Wallet Address"
                    label-for="coldAddress">
        <b-form-input id="coldAddress"
                      readonly
                      size="sm"
                      v-model="coldAddress">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Public Key"
                    label-for="pubKey">
        <b-form-input id="pubKey"
                      readonly
                      size="sm"
                      v-model="pubKey">
        </b-form-input>
      </b-form-group>
    </div>
  </b-modal>
</template>

<script>
export default {
    name: 'Account',
    props: {
        walletAddress: {
            type: String,
            require: true,
            default: ''
        },
        coldAddress: {
            type: String,
            require: true,
            default: ''
        },
        pubKey: {
            type: String,
            require: true,
            default: ''
        },
        priKey: {
            type: String,
            require: true,
            default: ''
        },
        seed: {
            type: String,
            require: true,
            default: ''
        }
    }
}
</script>

<style scoped>

</style>
