<template>
  <b-modal id="receiveModal"
           centered
           title="Receive">
    <b-container fluid>
      <b-form-group label="Asset"
                    label-for="assetInput">
        <b-form-input id="assetInput"
                      value="VEE"
                      readonly>
        </b-form-input>
      </b-form-group>
      <b-form-group label="Address"
                    label-for="addressInput">
        <b-form-input id="addressInput"
                      type="text">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Amount"
                    label-for="amountInput">
        <b-form-input id="amountInput"
                      type="number">
        </b-form-input>
      </b-form-group>
    </b-container>
  </b-modal>
</template>

<script>
export default {
    name: 'Receive'
}
</script>

<style scoped>

</style>
