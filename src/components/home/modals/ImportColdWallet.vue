<template>
  <b-modal id="importModal"
           centered
           title="Import Cold Wallet">
    <b-container fluid>
      <b-form-group label="Cold Wallet Adress"
                    label-for="coldAddress"
                    description="Please input your cold wallet address.">
        <b-form-input id="coldAddress"
                      type="text"
                      placeholder="cold wallet address">
        </b-form-input>
      </b-form-group>
    </b-container>
  </b-modal>
</template>

<script>
export default {
    name: 'ImportColdWallet',
    data() {
        return {
            coldWalletAddress: {
                type: String,
                default: '',
                validator: function(value) {
                    return crypto.default.isValidAddress(value)
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
