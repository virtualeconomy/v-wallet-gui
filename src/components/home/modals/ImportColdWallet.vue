<template>
  <b-modal id="importModal"
           centered
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
                      placeholder="cold wallet address">
        </b-form-input>
      </b-form-group>
      <b-button class="scanQrCode"
                type="button"
                variant="primary"
                @click="openCamera">Scan</b-button>
      <p class="qrInfo">Please confirm your browser's camera is available.</p>
      <qrcode-reader @decode="onDecode"
                     :paused="paused"
                     @onInit="onInit">
      </qrcode-reader>
    </b-container>
  </b-modal>
</template>

<script>
export default {
    name: 'ImportColdWallet',
    data() {
        return {
            paused: false,
            content: ''
        }
    },
    methods: {
        importClose: function(evt) {
            console.log('close')
        },
        importOk: function(evt) {
            console.log('ok')
        },
        openCamera: function() {
            console.log(this)
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
                this.paused = true
                console.log(promise)
            }
        },
        onDecode: function(decodeString) {
            this.paused = true
            this.content = decodeString

            console.log(decodeString)
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
