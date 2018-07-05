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
                    label-for="coldAddress">
        <b-form-input id="coldAddress"
                      type="text"
                      v-model="coldAddress"
                      :state="isValidAddress"
                      aria-describedby="inputLiveHelp inputLiveFeedback"
                      placeholder="Please input cold wallet address.">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
          Invalid cold wallet address. <span v-if="addressExisted">The address has existed.</span>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Cold Wallet Public Key"
                    label-for="coldPubKey">
        <b-form-input id="coldPubKey"
                      type="text"
                      v-model="coldPubKey"
                      :state="isValidPubKey"
                      aria-describedby="inputLiveHelp inputLiveFeedback"
                      placeholder="Please input Base58-encoded public key of cold wallet.">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
          Invalid cold wallet public key.
        </b-form-invalid-feedback>
      </b-form-group>
      <p class="qrInfo">Tips: Please confirm your browser's camera is available.</p>
      <qrcode-reader @init="onInit"
                     @decode="onDecode"
                     :paused="paused">
        <img v-if="qrInit"
             class="qrcode-waiting"
             height="100"
             width="100"
             src="../../../assets/imgs/icons/wallet/ic_wait.svg">
      </qrcode-reader>
      <b-btn class="scan-again-btn"
             @click="scanAgain">Scan again</b-btn>
    </b-container>
  </b-modal>
</template>

<script>
import crypto from '@/utils/crypto'
import { PUBLIC_KEY_LENGTH } from '@/constants.js'
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
                return void 0
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(this.coldAddress)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isValidPubKey: function() {
            if (!this.coldPubKey) {
                return void 0
            }
            return this.coldPubKey.length === PUBLIC_KEY_LENGTH
        },
        addressExisted: function() {
            return this.coldAddress === this.address
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
            if (this.qrInit || !this.coldAddress || !this.isValidAddress || !this.coldPubKey || !this.isValidPubKey) {
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
.qrcode-waiting {
    margin-left: 100px;
}
.qrInfo {
    margin-bottom: 20px;
    color: #9091a3;
}
.scan-again-btn {
    margin-top: 10px;
}
</style>
