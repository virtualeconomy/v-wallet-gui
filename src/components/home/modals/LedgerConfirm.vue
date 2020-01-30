<template>
  <div>
    <div>
      <b-alert
        class="alert"
        variant="info"
        :show="dismissCountDown"
        dismissible
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        {{ alertMessage }}
      </b-alert>
    </div>
    <div v-if="getDevice === 'Ledger'"
         class="text-input">
      1.Connect Ledger hardware device with USB
      <br>
      2.Enter VSYS app in Ledger device
      <br>
      3.Click "Send Request" on web
      <br>
      4.Confirm the transaction on Ledger device
    </div>
    <div v-if="getDevice === 'Trezor'"
         class="text-input">
      1.Connect Trezor hardware device with USB
      <br>
      2.Click "Send Request" on web
      <br>
      3.Confirm the transaction on Trezor device
    </div>
    <div class="image"
         align="center">
      <img class="image-input"
           :src="imgUrl">
    </div>
    <b-row class="row">
      <b-col class="col-lef">
      </b-col>
      <b-col class="col-rit">
        <b-button
          block
          class="btn-confirm"
          variant="warning"
          size="lg"
          @click="sendData">Send Request
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { PAYMENT_TX, LEASE_TX, CANCEL_LEASE_TX } from '@/js-v-sdk/src/constants'
import { NETWORK_BYTE } from '@/network'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import VsysLedger from '@/utils/vsysLedger'
import TrezorConnect from '@/utils/vsysTrezor'
import ledgerImg from '@/assets/imgs/icons/wallet/img_ledger_device.png'
import trezorImg from '@/assets/imgs/icons/wallet/img_trezor_device.jpg'

export default {
    name: 'LedgerConfirm',
    data: function() {
        return {
            alertMessage: '',
            dismissCountDown: 0
        }
    },
    props: {
        txInfo: {
            type: Object,
            require: true,
            default: function() {}
        },
        addressInfo: {
            type: Object,
            require: true,
            default: function() {}
        },
        transactionBytes: {
            type: Uint8Array,
            require: true,
            default: function() {
            }
        }
    },
    computed: {
        imgUrl() {
            if (this.getDevice === 'Ledger') {
                return ledgerImg
            } else return trezorImg
        },
        getDevice() {
            if (this.addressInfo.hasOwnProperty('device')) {
                return this.addressInfo.device
            }
            return ''
        }
    },
    methods: {
        async sendData() {
            if (!this.txInfo || !this.supportedTxType(this.txInfo['transactionType'])) {
                this.alertMessage = 'Unknown Transaction !'
                this.dismissCountDown = 10
                return void 0
            }
            if (!this.addressInfo || !this.addressInfo['path']) {
                this.alertMessage = 'Invalid ' + this.getDevice + ' address data! Please remove the address and monitor it again.'
                this.dismissCountDown = 10
                return void 0
            }
            let path = this.addressInfo['path']
            this.alertMessage = 'Please confirm transaction on ' + this.getDevice + ' device!'
            this.dismissCountDown = 3
            try {
                let signature
                if (this.getDevice === 'Ledger') {
                    signature = await this.getSignatureFromLedger(path)
                } else if (this.getDevice === 'Trezor') {
                    signature = await this.getSignatureFromTrezor(path)
                } else {
                    this.alertMessage = 'Unknown device for this address'
                }
                if (signature) {
                    this.$emit('get-signature', signature)
                } else if (this.dismissCountDown <= 0) {
                    this.alertMessage = 'Failed to get signature from ' + this.getDevice + ' device!'
                    this.dismissCountDown = 10
                }
            } catch (err) {
                this.alertMessage = err.hasOwnProperty('message') ? err.message : err
                this.dismissCountDown = 10
                return void 0
            }
        },
        async getSignatureFromLedger(path) {
            const transport = await TransportU2F.create()
            let ledger = new VsysLedger(transport, NETWORK_BYTE)
            let signature = await ledger.signTransaction(path, this.transactionBytes)
            return signature
        },
        async getSignatureFromTrezor(path) {
            this.txInfo['path'] = path
            const result = await TrezorConnect.vsysSignTx(this.txInfo)
            if (!result || !result['payload'] || !result['success']) {
                if (result['payload'] && result['payload']['error']) {
                    this.alertMessage = result['payload']['error']
                } else {
                    this.alertMessage = 'Failed to get signature! Please make sure Trezor hardware device is connected.'
                }
                this.dismissCountDown = 5
                return void 0
            }
            return result['payload']['signature']
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        supportedTxType(type) {
            return type === PAYMENT_TX || type === LEASE_TX || type === CANCEL_LEASE_TX
        }
    }
}
</script>

<style scoped>
.text-input {
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.image-input {
    background: #FAFAFA;
}
.image {
    background: #FAFAFA;
    margin-top: 20px;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.row {
    margin-top: 25px;
    margin-bottom: 5px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
</style>
