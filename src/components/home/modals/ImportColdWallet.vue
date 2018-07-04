<template>
  <b-modal id="importModal"
           centered
           lazy
           @cancel="importCancel"
           @hide="importClose"
           @ok="importOk"
           @show="showingUp"
           :ok-disabled="!coldAddress || !isValidAddress"
           :cancel-disabled="qrInit"
           title="Import Cold Wallet">
    <b-container fluid>
      <b-form-group label="Cold Wallet Adress"
                    label-for="coldAddress"
                    description="Please input your cold wallet address.">
        <b-form-input id="coldAddress"
                      type="text"
                      v-model="coldAddress"
                      :state="isValidAddress"
                      aria-describedby="inputLiveHelp inputLiveFeedback"
                      placeholder="cold wallet address">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
          Invalid cold wallet address. <span v-if="addressExisted">The address has existed.</span>
        </b-form-invalid-feedback>
      </b-form-group>
      <p class="qrInfo">Please confirm your browser's camera is available.</p>
      <qrcode-reader @init="onInit"
                     @decode="onDecode"
                     :paused="paused">
      </qrcode-reader>
      <b-btn class="scan-again-btn"
             @click="scanAgain">Scan again</b-btn>
    </b-container>
  </b-modal>
</template>

<script>
import crypto from '@/utils/crypto'
export default {
    name: 'ImportColdWallet',
    props: {
        address: {
            type: String,
            default: '',
            require: true
        }
    },
    data: function() {
        return {
            qrInit: false,
            paused: false,
            coldAddress: '',
            coldPubKey: ''
        }
    },
    computed: {
        isValidAddress: function() {
            if (this.coldAddress === this.address) {
                return false
            }
            if (!this.coldAddress) {
                return true
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(this.coldAddress)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        addressExisted: function() {
            if (this.coldAddress === this.address) {
                return true
            }
            return false
        }
    },
    methods: {
        showingUp() {
            this.coldAddress = ''
        },
        importClose: function(evt) {
            if (this.qrInit) {
                evt.preventDefault()
            }
        },
        importOk: function(evt) {
            if (this.qrInit || !this.coldAddress || !this.isValidAddress) {
                evt.preventDefault()
            } else {
                this.$emit('import-cold', this.coldAddress, this.coldPubKey)
            }
        },
        importCancel: function(evt) {
            if (this.qrInit) {
                evt.preventDefault()
            }
        },
        saveCold: function() {
            const savedInfo = {
                coldAddress: this.coldAddress,
                coldPubKey: this.coldPubKey ? this.coldPubKey : ''
            }
            window.localStorage.setItem(this.hotAddress, JSON.stringify(savedInfo))
        },
        async onInit(promise) {
            try {
                console.log(promise)
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
            let start = decodeString.indexOf('address')
            let end = decodeString.indexOf('&')
            this.coldAddress = decodeString.substring(start + 8, end)

            start = decodeString.indexOf('publicKey')
            end = decodeString.length
            this.coldPubKey = decodeString.substring(start + 10, end)
        },
        scanAgain: function() {
            this.paused = false
            this.coldAddress = ''
        }
    }
}
</script>

<style scoped>
.qrInfo {
    margin-bottom: 20px;
}
.scan-again-btn {
    margin-top: 10px;
}
</style>
