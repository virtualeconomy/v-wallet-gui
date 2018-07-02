<template>
  <div>
    <img :src="getQrCodeImg">
    <b-btn @click="scanChange">Scan</b-btn>
    <div v-if="scanShow"
         v-show="!qrInit">
      <p class="qrInfo">Please confirm your browser's camera is available.</p>
      <qrcode-reader @init="onInit"
                     @decode="onDecode"
                     :paused="paused">
      </qrcode-reader>
      <b-btn @click="scanAgain">Scan again</b-btn>
      <b-btn @click="scanChange"
             :disabled="!isValidSignature">Confirm</b-btn>
    </div>
  </div>
</template>

<script>
import jrQrcode from 'jr-qrcode'
import transaction from '@/utils/transaction'
export default {
    name: 'ColdSignature',
    data: function() {
        return {
            qrInit: false,
            paused: false,
            signature: ''
        }
    },
    props: {
        dataObject: {
            type: Object,
            require: true,
            default: function() {}
        },
        isValidSignature: {
            type: Boolean,
            require: true,
            default: false
        },
        publicKey: {
            type: String,
            require: true,
            default: ''
        }
    },
    computed: {
        getQrCodeImg() {
            const options = {
                padding: 10,
                width: 160,
                height: 160,
                correctLevel: 2,
                reverse: false,
                background: '#ffffff',
                foreground: '#000000'
            }
            console.log(JSON.stringify(this.dataObject))
            const imgBase64 = jrQrcode.getQrBase64(JSON.stringify(this.dataObject), options)
            console.log(imgBase64)
            return imgBase64
        },
        scanShow() {
            return !this.isValidSignature
        }
    },
    methods: {
        async onInit(promise) {
            try {
                console.log('hhhhhh')
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
                    throw Error('mayby camera is already in use')
                } else if (error.name === 'OverconstarinedError') {
                    throw Error('pass constraints do not match any camera')
                } else {
                    throw Error('browser is probably lacking features(WebRTC, Canvas)')
                }
            } finally {
                this.qrInit = false
                console.log('kkkk')
            }
        },
        scanChange: function() {
            this.scanShow = !this.scanShow
        },
        onDecode: function(decodeString) {
            this.paused = true
            this.signature = decodeString
            this.isValidSignature = transaction.default.isValidSignature(this.dataObject, this.signature, this.publicKey)
        },
        scanAgain: function() {
            this.paused = false
        }
    }
}
</script>

<style scoped>

</style>
