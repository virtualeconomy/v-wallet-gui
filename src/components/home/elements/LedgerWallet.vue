<template>
  <div id="ledgerWalletModal"
       ref="ledgerWalletModal"
       class="ledgerWallet">
    <div class="black-title">
      Monitor {{ device }} Hardware Device
    </div>
    <div class="small-title"> {{ method === 'ledgerWallet' ? 'Please connect ' + device + ' hardware device with USB as shown in the picture blow and enter VSYS app' : 'Please connect ' + device + ' hardware device with USB' }}
    </div>
    <div class="image"
         align="center">
      <img class="image-input"
           :src= "imgUrl">
    </div>
    <div class="account-form">
      <p class="account-input">Choose your account index and then click "Select"</p>
      <div class="select-pane">
        <b-btn variant="warning"
               class="bar-minus"
               @click="minus"><p class="minus">-</p></b-btn>
        <p class="amount-index">{{ addressIndex }}</p>
        <b-btn variant="warning"
               class="bar-plus"
               @click="plus"><p class="plus">+</p></b-btn>
        <b-btn class="btn-select"
               @click="selectAddress">
          <b>Select</b>
        </b-btn>
      </div>
      <div>
        <b-alert
          class="alert"
          variant="info"
          :show="dismissCountDown"
          dismissible
          @dismissed="dismissCountDown=0"
          @dismiss-count-down="countDownChanged">
          {{ alertMessage }}
        </b-alert>
      </div>
    </div>
    <b-form-group label="Cold Wallet Address"
                  label-for="coldAddress-input">
      <b-form-input id="recipient-input"
                    class="recipient-input"
                    type="text"
                    :state="isValidColdAddress"
                    v-model="coldAddress"
                    aria-describedby="inputLiveFeedback"
                    placeholder="Retrieve cold wallet address from device">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback">
        Invalid ColdAddress
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="Cold Wallet Public Key"
                  label-for="pubKey-input">
      <b-form-input id="pubKey-input"
                    class="recipient-input"
                    type="text"
                    v-model="coldPublicKey"
                    :state="isValidColdPublicKey"
                    aria-describedby="inputLiveFeedback"
                    placeholder="Retrieve public key of cold wallet from device">
      </b-form-input>
      <b-form-invalid-feedback id="inputLiveFeedback">
        Invalid Public Key
      </b-form-invalid-feedback>
    </b-form-group>
    <b-row class="row">
      <b-col class="col-lef">
      </b-col>
      <b-col class="col-rit">
        <b-button
          block
          class="btn-confirm"
          variant="warning"
          size="lg"
          :disabled="isSubmitDisabled"
          @click="sendData">Confirm
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import 'babel-polyfill'
import { NETWORK_BYTE } from '@/network'
import base58 from 'base-58'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import VsysLedger from '@/utils/vsysLedger'
import TrezorConnect from '@/utils/vsysTrezor'
import { mapState } from 'vuex'
import ledgerImg from '@/assets/imgs/icons/wallet/img_ledger_device.png'
import trezorImg from '@/assets/imgs/icons/wallet/img_trezor_device.jpg'
import defaultImg from '@/assets/imgs/icons/wallet/ic_illustration_wallet.svg'

export default {
    name: 'LedgerWallet',
    data: function() {
        return {
            coldAddress: '',
            coldPublicKey: '',
            addressIndex: 0,
            alertMessage: '',
            dismissCountDown: 0,
            addrPath: ''
        }
    },
    props: {
        method: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState({
            account: 'account'
        }),
        device() {
            if (this.method === 'ledgerWallet') {
                return 'Ledger'
            } else if (this.method === 'trezorWallet') {
                return 'Trezor'
            } else {
                console.error('Unknown device!')
                return ''
            }
        },
        imgUrl() {
            if (this.device === 'Ledger') {
                return ledgerImg
            } else if (this.device === 'Trezor') {
                return trezorImg
            } else {
                return defaultImg
            }
        },
        isValidColdAddress() {
            if (!this.coldAddress) {
                return void 0
            }
            let isValid = false
            try {
                isValid = this.account.checkAddress(this.coldAddress)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isSubmitDisabled() {
            return !(this.isValidColdAddress && this.isValidColdPublicKey)
        },
        isValidColdPublicKey() {
            if (!this.coldPublicKey) {
                return void 0
            }
            let pubKeyArr = base58.decode(this.coldPublicKey)
            return pubKeyArr && pubKeyArr.length === 32
        }
    },
    methods: {
        minus() {
            if (this.addressIndex > 0) {
                this.addressIndex--
            }
        },
        plus() {
            if (this.addressIndex < 10) {
                this.addressIndex++
            }
        },
        async selectAddress() {
            this.alertMessage = 'Please confirm address on ' + this.device + ' device!'
            this.dismissCountDown = 3
            try {
                if (this.device === 'Ledger') {
                    this.selectAddressWithLedger()
                } else if (this.device === 'Trezor') {
                    this.selectAddressWithTrezor()
                }
            } catch (err) {
                this.alertMessage = err.hasOwnProperty('message') ? err.message : err
                this.dismissCountDown = 10
                return void 0
            }
        },
        async selectAddressWithLedger() {
            const transport = await TransportU2F.create()
            let ledger = new VsysLedger(transport, NETWORK_BYTE)
            let path = '44\'/360\'/' + this.addressIndex + '\'/0/0'
            const result = await ledger.getWalletPublicKey(path, true)
            if (!result || !result['publicKey']) {
                this.alertMessage = 'Failed to get Public Key! Please make sure Ledger hardware device is connected and entered VSYS app.'
                this.dismissCountDown = 5
                return void 0
            }
            this.coldPublicKey = result['publicKey']
            this.coldAddress = result['address']
            this.addrPath = path
        },
        async selectAddressWithTrezor() {
            let coinIndex = 1
            if (NETWORK_BYTE === 'M') {
                coinIndex = 360
            }
            let path = 'm/44\'/' + coinIndex + '\'/' + this.addressIndex + '\''
            const result = await TrezorConnect.vsysGetPublicKey({
                path: path,
                showOnTrezor: false
            })
            if (!result || !result['payload'] || !result['success']) {
                if (result['payload'] && result['payload']['error']) {
                    this.alertMessage = result['payload']['error']
                } else {
                    this.alertMessage = 'Failed to get Public Key! Please make sure Trezor hardware device is connected.'
                }
                this.dismissCountDown = 5
                return void 0
            }
            this.coldPublicKey = result['payload']['publicKey']
            this.coldAddress = result['payload']['address']
            this.addrPath = path
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        sendData() {
            let obj = {'protocol': 'v.systems', 'opc': 'account', 'address': this.coldAddress, 'api': 1, 'publicKey': this.coldPublicKey, 'device': this.device, 'path': this.addrPath}
            this.$emit('import-cold', this.coldAddress, this.coldPublicKey, obj)
            this.$emit('close-btn')
        }
    }
}
</script>

<style scoped>
.black-title {
    font-family: Roboto-Regular;
    font-size: 26px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
    margin-top: 15px;
}
.small-title {
    font-family: Roboto-Regular;
    width: 360px;
    margin-left: 40px;
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: center;
}
.image-input {
    background: #FAFAFA;
}
.image {
    background: #FAFAFA;
    margin-top: 20px;
}
.select-input {
    font-family: Roboto-Regular;
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
}
.account-form {
    margin-top: 15px;
    margin-bottom: 15px;
}
.select-pane {
    background: #FAFAFA;
    border-radius: 4px;
    height: 54px;
}
.bar-minus {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    position: absolute;
    margin-left: 10px;
    margin-top: 15px;
}
.minus {
    position: absolute;
    margin: -11px -2px;
}
.bar-plus {
    width: 24px;
    height: 24px;
    margin-top: 15px;
    margin-left: 80px;
    margin-bottom: 15px;
    border-radius: 50%;
}
.plus {
    position: absolute;
    margin: -11px -4px;
}
.amount-index {
    font-size: 15px;
    position: absolute;
    margin-left: 55px;
    margin-top:  15px;

}
.btn-select {
    border-color: #FF8837;
    color: #FF8837;
    background: #FAFAFA;
    border-radius: 4px;
    font-size: 17px;
    font-weight:lighter;
    background:#fafafa;
    margin-left: 230px;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.row {
    margin-top: 25px;
    margin-bottom: 15px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.alert {
    margin-top: 5px;
    margin-bottom: 5px;
}
</style>
