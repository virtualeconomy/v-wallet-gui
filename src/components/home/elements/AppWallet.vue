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
      <div class="text-danger text-center"><small>{{ qrErrMsg }}</small></div>
    </div>
    <b-form-group label="Cold Wallet Address"
                  label-for="coldAddress-input">
      <b-form-input id="recipient-input"
                    class="recipient-input"
                    type="text"
                    :state="isValidColdAddress"
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
                    v-model="coldPublicKey"
                    placeholder="Please input public key of cold wallet">
      </b-form-input>
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
import { PROTOCOL, API_VERSION, OPC_ACCOUNT } from '@/js-v-sdk/src/constants'
import { mapState } from 'vuex'
export default {
    name: 'AppWallet',
    data: function() {
        return {
            coldAddress: '',
            jsonObj: '',
            qrInit: false,
            paused: false,
            coldPublicKey: '',
            qrErrMsg: void 0
        }
    },
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapState({
            account: 'account'
        }),
        isSubmitDisabled() {
            return !this.isValidColdAddress || this.qrErrMsg !== void 0
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
        }
    },
    methods: {
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
                let obj = JSON.parse(decodeString)
                obj.device = 'MobileApp'
                this.jsonObj = obj
                this.coldAddress = this.jsonObj.address
                this.coldPublicKey = this.jsonObj.publicKey
                let opc = this.jsonObj.opc
                let api = this.jsonObj.api
                let protocol = this.jsonObj.protocol
                if (protocol !== PROTOCOL) {
                    this.paused = false
                    this.qrErrMsg = 'Invalid QR code protocol.'
                } else if (api > API_VERSION) {
                    this.paused = false
                    this.qrErrMsg = 'API version mismatch.'
                } else if (opc !== OPC_ACCOUNT) {
                    this.paused = false
                    this.qrErrMsg = 'Wrong operation code in QR code.'
                } else if (!this.isValidColdAddress || this.coldAddress === '') {
                    this.paused = false
                    this.qrErrMsg = 'Invalid Cold Address.'
                } else {
                    this.qrErrMsg = void 0
                }
            } catch (e) {
                this.paused = false
            }
        },
        scanAgain: function() {
            this.qrErrMsg = void 0
            this.paused = false
            this.coldAddress = ''
            this.coldPublicKey = ''
        },
        sendData() {
            this.$emit('import-cold', this.coldAddress, this.coldPublicKey, this.jsonObj)
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
