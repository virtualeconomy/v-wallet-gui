<template>
  <b-modal id="receiveModal"
           ref="receiveModal"
           centered
           hide-footer
           hide-header
           lazy
           title="Receive">
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-container
      fluid
      class="modal-c">
      <!-- <b-form-group label="Asset"
                    label-for="assetInput">
        <b-form-input id="assetInput"
                      value="VEE"
                      readonly>
        </b-form-input>
      </b-form-group> -->
      <b-form-group label="Address"
                    class="forms"
                    label-for="addressInput">
        <b-form-input id="addressInput"
                      class="input-t"
                      type="text"
                      readonly
                      v-model="address">
        </b-form-input>
        <textarea
          v-model="address"
          ref="addrToCopy"
          class="hidden"
          readonly>
        </textarea>
        <b-btn
          id="btn-cpy"
          class="btn-copy"
          v-b-popover.click.topright="'Copied!'"
          @click="copyAddr"
          variant="link">
          <img src="../../../assets/imgs/icons/operate/ic_copy.svg">
        </b-btn>
      </b-form-group>
      <b-form-group label="Amount"
                    class="forms"
                    label-for="amountInput">
        <b-form-input id="amountInput"
                      class="input-t"
                      type="number"
                      v-model="amount"
                      min="0">
        </b-form-input>
        <div id="address-qrcode">
          <img :src="getQrCodeImg">
        </div>
        <b-button variant="warning"
                  class="btn-o"
                  block
                  size="lg"
                  @click="closeModal">OK
        </b-button>
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
                width: 180,
                height: 180,
                correctLevel: 2,
                reverse: false,
                background: '#ffffff',
                foreground: '#000000'
            }
            const imgBase64 = jrQrcode.getQrBase64(text, options)
            return imgBase64
        }
    },
    methods: {
        closeModal() {
            this.$refs.receiveModal.hide()
        },
        copyAddr() {
            this.$refs.addrToCopy.select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', 'btn-cpy')
            this.isCpyDisable = true
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', 'btn-cpy')
                this.isCpyDisable = false
            }, 400)
        }
    }
}
</script>

<style scoped lang="less">
#address-qrcode {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 40px;
}
.forms {
    text-align: left;
}
.input-t {
    height: 48px;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.modal-c {
    padding-top: 24px
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.btn-o {
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    height: 44px;
}
.btn-copy {
    position: absolute;
    right:0;
    margin-right: 30px;
    margin-top: -43px;
}
.hidden {
    font-size: 12pt;
    border: 0px;
    padding: 0px;
    margin: 0px;
    position: absolute;
    left: -9999px;
    top: 0px;
}
</style>
