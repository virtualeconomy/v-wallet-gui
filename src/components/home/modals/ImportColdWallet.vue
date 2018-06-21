<template>
  <b-modal id="importModal"
           centered
           lazy
           @close="importClose"
           @ok="importOk"
           title="Import Cold Wallet">
    <b-container fluid>
      <b-form-group label="Cold Wallet Adress"
                    label-for="coldAddress"
                    description="Please input your cold wallet address.">
        <b-form-input id="coldAddress"
                      type="text"
                      v-model="content"
                      :state="isValidAddress"
                      aria-describedby="inputLiveHelp inputLiveFeedback"
                      placeholder="cold wallet address">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
          Invalid cold wallet address.
        </b-form-invalid-feedback>
      </b-form-group>
      <p class="qrInfo">Please confirm your browser's camera is available.</p>
      <qrcode-reader @init="onInit"
                     @decode="onDecode"
                     :paused="paused">
      </qrcode-reader>
      <b-btn @click="scanAgain">Scan again</b-btn>
    </b-container>
  </b-modal>
</template>

<script>
import crypto from '@/utils/crypto'
export default {
    name: 'ImportColdWallet',
    data() {
        return {
            paused: false,
            content: ''
        }
    },
    computed: {
        isValidAddress: function() {
            if (!this.content) {
                return true
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(this.content)
            } catch (e) {
                console.log(e)
            }
            return isValid
        }
    },
    methods: {
        importClose: function(evt) {
            console.log('close')
        },
        importOk: function(evt) {
            console.log('ok')
        },
        async onInit(promise) {
            try {
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    throw Error('user denied camera access permission')
                } else if (error.name === 'NotFoundError') {
                    throw Error('no suitable camera device installed')
                } else if (error.name === 'NotSupportedError') {
                    throw Error('page is not served over HTTPS (or localhost)')
                } else if (error.name === 'NotReadableError') {
                    throw Error('mayby camera is already in use')
                } else if (error.name === 'OverconstarinedError') {
                    throw Error('pass constraints do not match any camera')
                } else {
                    throw Error('browser is probably lacking features(WebRTC, Canvas)')
                }
            } finally {
                console.log('onInit')
            }
        },
        onDecode: function(decodeString) {
            this.paused = true
            this.content = decodeString
            console.log(decodeString)
        },
        scanAgain: function() {
            this.paused = false
            this.content = ''
        }
    }
}
</script>

<style scoped>
.scanQrCode {
    margin-bottom: 10px;
}
.qrInfo {
    margin-bottom: 20px;
}
</style>
