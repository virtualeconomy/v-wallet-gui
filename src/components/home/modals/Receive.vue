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
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-container
      fluid
      class="modal-c">
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
          <img src="@/assets/imgs/icons/operate/ic_copy.svg">
        </b-btn>
      </b-form-group>
      <b-form-group label="Amount"
                    class="forms"
                    label-for="amountInput">
        <b-form-input id="amountInput"
                      class="input-t"
                      v-model="amount"
                      aria-describedby="inputLiveFeedback"
                      :state="isAmountValid(amount)"
                      min="0">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-if="!checkPrecision(amount)">
          The number in this field is invalid. The minimum unit of amount is 0.00000001.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-else-if="isNegative(amount)">
          Negative number is not allowed.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-else-if="!isNumFormatValid(amount)">
          Invalid format.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-else>
          Invalid Input.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Invoice"
                    style="text-align: left"
                    label-for="descriptionInput">
        <b-form-textarea id="descriptionInput"
                         v-model="invoice"
                         :rows="3"
                         :no-resize="true"
                         :state="isValidInvoice">
        </b-form-textarea>
      </b-form-group>
      <div id="address-qrcode">
        <img :src="getQrCodeImg">
      </div>
      <b-button variant="warning"
                class="btn-o"
                block
                size="lg"
                @click="closeModal">OK
      </b-button>
    </b-container>
  </b-modal>
</template>

<script>
import jrQrcode from 'jr-qrcode'
import { PROTOCOL, OPC_ACCOUNT, VSYS_PRECISION, TRANSFER_ATTACHMENT_BYTE_LIMIT } from '@/constants.js'
import BigNumber from 'bignumber.js'
import common from '@/utils/common'
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
            invoice: '',
            amount: BigNumber(0)
        }
    },
    computed: {
        receivedObject() {
            return {
                protocol: PROTOCOL,
                api: this.api,
                opc: OPC_ACCOUNT,
                address: this.address,
                amount: this.transferAmount,
                invoice: this.invoice
            }
        },
        isValidInvoice() {
            if (!this.invoice) {
                return void 0
            }
            return common.getLength(this.invoice) <= TRANSFER_ATTACHMENT_BYTE_LIMIT
        },
        getQrCodeImg() {
            const options = {
                padding: 10,
                width: 180,
                height: 180,
                correctLevel: 2,
                reverse: false,
                background: '#ffffff',
                foreground: '#000000'
            }
            if (common.getLength(this.invoice) > TRANSFER_ATTACHMENT_BYTE_LIMIT || this.invoice === '') {
                delete this.receivedObject.invoice
            }
            if (!this.isAmountValid(this.amount)) {
                delete this.receivedObject.amount
            }
            const text = JSON.stringify(this.receivedObject).replace(/"amount":"(\d+)"/g, '"amount":$1') // The protocol defined amount must use Long type. However, there is no Long type in JS. So we use BigNumber instead. But when BigNumber serializes to JSON, it is written in string. We need remove quotes (") here to transfer to Long type in JSON.
            const imgBase64 = jrQrcode.getQrBase64(text, options)
            return imgBase64
        },
        transferAmount() {
            if (this.amount) {
                return BigNumber(this.amount).multipliedBy(VSYS_PRECISION)
            }
        },
        api() {
            if (common.getLength(this.invoice) > TRANSFER_ATTACHMENT_BYTE_LIMIT || this.invoice === '') {
                return 1
            } else {
                return 2
            }
        }
    },
    methods: {
        closeModal() {
            this.amount = 0
            this.$refs.receiveModal.hide()
        },
        isAmountValid(amount) {
            if (BigNumber(amount).isEqualTo(0)) {
                return void 0
            }
            return this.checkPrecision(amount) && this.isNumFormatValid(amount) && !this.isNegative(amount)
        },
        isNegative(amount) {
            return BigNumber(amount).isLessThan(0)
        },
        isNumFormatValid(amount) {
            return common.isNumFormatValid(amount)
        },
        checkPrecision(amount) {
            return common.checkPrecision(amount, 8)
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
input[type=number] {
    -moz-appearance:textfield !important;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
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
