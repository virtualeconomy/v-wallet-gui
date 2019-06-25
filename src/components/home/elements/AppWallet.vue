<template>
  <div id="appWalletModal"
       ref="appWalletModal"
       class="appWallet">
    <div class="black-title">Monitor Mobile Cold Wallet
    </div>
    <div class="small-title">You can scan the QR Code of cold wallet if your <br>browser's camera is available
    </div>
    <div class="scan-pane">
      <qrcode-reader @init="onInit"
                     @decode="onDecode"
                     :paused="paused">
        <img v-if="qrInit"
             class="qrcode-waiting"
             height="100"
             width="100"
             src="@/assets/imgs/icons/wallet/ic_wait.svg">
      </qrcode-reader>
      <button class="scan-again-btn"
              variant="warning"
              @click="scanAgain"
              centered>Scan again</button>
    </div>
    <b-form-group label="Cold Wallet Address"
                  label-for="coldAddress-input">
      <b-form-input id="recipient-input"
                    class="recipient-input"
                    type="text"
                    :state="isValidColdAddress(coldAddress)"
                    v-model="coldAddress"
                    aria-describedby="inputLiveFeedback"
                    placeholder="Please input cold wallet address">
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
                    :state="isValidColdPubKey(coldPubKey)"
                    v-model="coldPubKey"
                    aria-describedby="inputLiveFeedback"
                    placeholder="Please input public key of cold wallet">
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
          :disabled="isSubmitDisabled()"
          @click="sendData">Confirm
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import crypto from '@/utils/crypto'
import { PROTOCOL, API_VERSION, OPC_ACCOUNT } from '@/constants.js'
import base58 from '@/libs/base58'
export default {
    name: 'AppWallet',
    data: function() {
        return {
            coldAddress: '',
            jsonObj: '',
            qrInit: false,
            paused: false,
            coldPubKey: '',
            opc: '',
            api: '',
            protocol: ''
        }
    },
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    methods: {
        closeModal() {
            this.$refs.appWalletModal.hide()
        },
        async onInit(promise) {
            try {
                this.qrInit = true
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    throw Error('user denied camera access permission')
                } else if (error.name === 'NotFoundError') {
                    throw Error('no suitable camera device installed')
                } else if (error.name === 'NotSupportedError') {
                    throw Error('page is not served over HTTPS (or localhost)')
                } else if (error.name === 'NotReadableError') {
                    throw Error('maybe camera is already in use')
                } else if (error.name === 'OverconstarinedError') {
                    throw Error('pass constraints do not match any camera')
                } else {
                    throw Error('browser is probably lacking features(WebRTC, Canvas)')
                }
            } finally {
                this.qrInit = false
            }
        },
        onDecode: function(decodeString) {
            this.paused = true
            try {
                this.jsonObj = JSON.parse(decodeString)
                this.coldAddress = this.jsonObj.address
                this.coldPubKey = this.jsonObj.publicKey
                this.opc = this.jsonObj.opc
                this.api = this.jsonObj.api
                this.protocol = this.jsonObj.protocol
            } catch (e) {
                this.paused = false
            }
            if (!this.isValidColdAddress(this.coldAddress)) {
                this.coldAddress = 'please scan QR code of cold wallet address'
                this.paused = false
            } else if (this.api > API_VERSION || this.protocol !== PROTOCOL || this.opc !== OPC_ACCOUNT) {
                this.coldAddress = 'invalid QR code'
                this.paused = false
            } else if (!this.isValidColdPubKey(this.coldPubKey)) {
                this.coldPubKey = 'invalid public key'
                this.paused = false
            }
        },
        scanAgain: function() {
            this.paused = false
            this.coldAddress = ''
        },
        isValidColdAddress: function(addr) {
            if (!addr) {
                return void 0
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(addr)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isValidColdPubKey: function(pubkey) {
            if (!pubkey) {
                return void 0
            }
            var pubkeyArr = base58.decode(pubkey)
            return pubkeyArr && pubkeyArr.length === 32
        },
        isSubmitDisabled() {
            return !(this.isValidColdAddress(this.coldAddress) && this.isValidColdPubKey(this.coldPubKey))
        },
        sendData() {
            return void 0
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
    margin-bottom: 30px;
}
.qrcode-waiting {
    margin-left: 100px;
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
.scan-pane {
    width: 320px;
    margin: auto;
}
.scan-again-btn {
     background: none;
     border: none;
     margin-top: 10px;
     letter-spacing: 0;
     width: 100px;
     margin-left: 110px;
     font-family: Roboto-Regular;
     font-size: 15px;
     color: #FF8737;
 }
</style>