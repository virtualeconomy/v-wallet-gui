<template>
  <div id="manualInputModal"
       ref="manualInputModal"
       class="manualInput">
    <div class="black-title">Manual Input Address
    </div>
    <div class="small-title">Please input you wallet address and public key
    </div>
    <b-form-group label="Cold Wallet Address"
                  label-for="pubKey-input">
      <b-form-input id="pubKey-input"
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
                  label-for="pubKey2-input">
      <b-form-input id="pubKey2-input"
                    class="recipient-input"
                    type="text"
                    v-model="coldPubKey"
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
          :disabled="!isValidColdAddress(coldAddress)"
          @click="sendData">Confirm
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import crypto from '@/utils/crypto'
export default {
    name: 'ManualInput',
    data: function() {
        return {
            coldAddress: '',
            coldPubKey: '',
            device: 'ManualInput'
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
            this.$refs.manualInputModal.hide()
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
        sendData() {
            var obj = {'protocol': 'v.systems', 'opc': 'account', 'address': this.coldAddress, 'api': 1, 'publicKey': this.coldPubKey, 'device': this.device}
            this.$emit('import-cold', this.coldAddress, this.coldPubKey, obj)
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
