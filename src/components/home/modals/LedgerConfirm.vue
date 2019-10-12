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
                this.alertMessage = 'Invalid Ledger address data! Please remove the address and monitor it again.'
                this.dismissCountDown = 10
                return void 0
            }
            let path = this.addressInfo['path']
            this.alertMessage = 'Please confirm transaction on Ledger device!'
            this.dismissCountDown = 3
            try {
                const transport = await TransportU2F.create()
                let ledger = new VsysLedger(transport, NETWORK_BYTE)
                let signature = await ledger.signTransaction(path, this.transactionBytes)
                this.$emit('get-signature', signature)
            } catch (err) {
                this.alertMessage = err.hasOwnProperty('message') ? err.message : err
                this.dismissCountDown = 10
                return void 0
            }
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
