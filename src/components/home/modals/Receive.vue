<template>
  <b-modal id="receiveModal"
           centered
           ok-only
           lazy
           title="Receive">
    <b-container fluid>
      <b-form-group label="Asset"
                    label-for="assetInput">
        <b-form-input id="assetInput"
                      value="VEE"
                      readonly>
        </b-form-input>
      </b-form-group>
      <b-form-group label="Amount"
                    label-for="amountInput">
        <b-form-input id="amountInput"
                      type="number"
                      v-model="amount">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Address"
                    label-for="addressInput">
        <b-form-input id="addressInput"
                      type="text"
                      readonly
                      v-model="address">
        </b-form-input>
        <div id="address-qrcode">
          <img :src="getQrCodeImg">
        </div>
      </b-form-group>
    </b-container>
  </b-modal>
</template>

<script>
import jrQrcode from 'jr-qrcode'
export default {
    name: 'Receive',
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            amount: 0
        }
    },
    computed: {
        getQrCodeImg() {
            const text = window.location.href + '/#send/VEE?recipient=' + this.address + '&amount=' + this.amount
            const options = {
                padding: 10,
                width: 160,
                height: 160,
                correctLevel: 2,
                reverse: false,
                background: '#ffffff',
                foreground: '#000000'
            }
            const imgBase64 = jrQrcode.getQrBase64(text, options)
            return imgBase64
        }
    }
}
</script>

<style scoped lang="less">
#address-qrcode {
    margin-top: 10px;
}

</style>
