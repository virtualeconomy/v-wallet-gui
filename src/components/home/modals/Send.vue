<template>
  <b-modal id="sendModal"
           centered
           lazy
           title="Send"
           hide-footer
           ref="modal"
           :busy="true"
           @hidden="resetPage">
    <b-tabs>
      <b-tab title="hot wallet"
             active
             :disabled="scanShow">
        <b-container v-show="pageId===1">
          <b-form-group label="Recipient"
                        label-for="recipientInput">
            <b-input-group>
              <b-form-input id="recipientInput"
                            type="text"
                            v-model="recipient"
                            :state="isValidRecipient(recipient)"
                            aria-describedby="inputLiveFeedback">
              </b-form-input>
              <b-input-group-append>
                <b-btn @click="scanChange">Button</b-btn>
              </b-input-group-append>
              <div v-if="scanShow"
                   v-show="!qrInit">
                <p class="qrInfo">Please confirm your browser's camera is available.</p>
                <qrcode-reader @init="onInit"
                               @decode="onDecode"
                               :paused="paused">
                </qrcode-reader>
                <b-btn @click="scanAgain">Scan again</b-btn>
                <b-btn @click="scanChange"
                       :disabled="!recipient || !isValidRecipient(recipient)">Confirm</b-btn>
              </div>
              <b-form-invalid-feedback id="inputLiveFeedback">
                Invalid recipient address.
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="amountInput">
            <b-form-input id="amountInput"
                          type="number"
                          v-model="amount">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Description"
                        label-for="descriptionInput">
            <b-form-textarea id="descriptionInput"
                             v-model="attachment"
                             :rows="3">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Fee: 1">
          </b-form-group>
          <b-button variant="primary"
                    size="lg"
                    @click="prevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    :disabled="isSubmitDisabled"
                    @click="nextPage">Continue
          </b-button>
        </b-container>
        <b-container v-show="pageId===2">
          <Confirm :address="address"
                   :recipient="recipient"
                   :amount="Number(amount)"
                   :fee="fee"
                   :attachment="attachment">
          </Confirm>
          <b-button variant="primary"
                    size="lg"
                    @click="prevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    @click="sendData('hotWallet')">Confirm
          </b-button>
        </b-container>
        <b-container v-show="pageId===3">
          <Success :address="address"
                   :recipient="recipient"
                   :amount="Number(amount)"
                   :fee="fee"
                   :attachment="attachment">
          </Success>
          <b-button variant="primary"
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
      <b-tab title="cold wallet"
             :disabled="noColdAddress || scanShow">
        <b-container v-show="coldPageId===1">
          <b-form-group label="Address"
                        label-for="walletAddress">
            <b-form-select id=walletAddress
                           v-model="coldAddress"
                           :options="options"></b-form-select>
          </b-form-group>
          <b-form-group label="Recipient"
                        label-for="coldRecipientInput">
            <b-input-group>
              <b-form-input id="coldRecipientInput"
                            type="text"
                            v-model="coldRecipient"
                            :state="isValidRecipient(coldRecipient)"
                            aria-describedby="inputLiveFeedback">
              </b-form-input>
              <b-input-group-append>
                <b-btn @click="scanChange">Button</b-btn>
              </b-input-group-append>
              <div v-if="scanShow"
                   v-show="!qrInit">
                <p class="qrInfo">Please confirm your browser's camera is available.</p>
                <qrcode-reader @init="onInit"
                               @decode="onColdDecode"
                               :paused="paused">
                </qrcode-reader>
                <b-btn @click="scanAgain">Scan again</b-btn>
                <b-btn @click="scanChange"
                       :disabled="!coldRecipient || !this.isValidRecipient(coldRecipient)">Confirm</b-btn>
              </div>
              <b-form-invalid-feedback id="inputLiveFeedback">
                Invalid recipient address.
              </b-form-invalid-feedback>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Amount"
                        label-for="coldAmountInput">
            <b-form-input id="coldAmountInput"
                          type="number"
                          v-model="coldAmount">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Description"
                        label-for="coldDescriptionInput">
            <b-form-textarea id="coldDescriptionInput"
                             v-model="coldAttachment"
                             :rows="3">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Fee: 1">
          </b-form-group>
          <b-button variant="primary"
                    size="lg"
                    @click="coldPrevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    :disabled="isColdSubmitDisabled"
                    @click="coldNextPage">Continue
          </b-button>
        </b-container>
        <b-container v-show="coldPageId===2">
          <Confirm :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment">
          </Confirm>
          <b-button variant="primary"
                    size="lg"
                    @click="coldPrevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    @click="coldNextPage">Confirm
          </b-button>
        </b-container>
        <b-container v-show="coldPageId===3">
          <ColdSignature :data-object="dataObject"
                         :is-valid-signature="isValidSignature"
                         :public-key="coldPublicKey"></ColdSignature>
          <b-button variant="primary"
                    size="lg"
                    @click="coldPrevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    @click="coldNextPage">Confirm
          </b-button>
        </b-container>
        <b-container v-show="coldPageId===4">
          <Confirm :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment">
          </Confirm>
          <b-button variant="primary"
                    size="lg"
                    @click="prevPage">Cancle
          </b-button>
          <b-button variant="primary"
                    size="lg"
                    @click="sendData('coldwallet')">Confirm
          </b-button>
        </b-container>
        <b-container v-show="coldPageId===5">
          <Success :address="coldAddress"
                   :recipient="coldRecipient"
                   :amount="Number(coldAmount)"
                   :fee="coldFee"
                   :attachment="coldAttachment">
          </Success>
          <b-button variant="primary"
                    size="lg"
                    @click="endSend">OK
          </b-button>
        </b-container>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
import transaction from '@/utils/transaction'
import Vue from 'vue'
import seedLib from '@/libs/seed.js'
import { TESTNET_NODE } from '@/constants.js'
import Confirm from './Confirm'
import Success from './Success'
import crypto from '@/utils/crypto'
import ColdSignature from './ColdSignature'
import Scan from './Scan'
var initData = {
    recipient: '',
    amount: 0,
    attachment: '',
    pageId: 1,
    fee: 1,
    coldRecipient: '',
    coldAmount: 0,
    coldAttachment: '',
    coldPageId: 1,
    coldFee: 1,
    coldAddress: '',
    scanShow: false,
    qrInit: false,
    paused: false,
    isValidSignature: false
}
export default {
    name: 'Send',
    components: {Scan, ColdSignature, Success, Confirm},
    props: {
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    data: function() {
        return initData
    },
    computed: {
        address() {
            return Vue.ls.get('address')
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        wordList() {
            return this.seedPhrase.split(' ')
        },
        keyPair() {
            return seedLib.fromExistingPhrase(this.seedPhrase).keyPair
        },
        isSubmitDisabled() {
            return !(this.recipient && this.amount > 0 && this.isValidRecipient(this.recipient))
        },
        isColdSubmitDisabled() {
            return !(this.coldRecipient && this.coldAmount > 0 && this.isValidRecipient(this.coldRecipient))
        },
        options() {
            var coldOptions = []
            console.log(this.coldAddresses)
            if (!this.coldAddresses) return coldOptions
            let coldAddress
            for (coldAddress in this.coldAddresses) {
                const option = {
                    value: coldAddress,
                    text: coldAddress
                }
                coldOptions.push(option)
            }
            console.log(coldOptions)
            return coldOptions
        },
        noColdAddress() {
            console.log(Object.keys(this.coldAddresses).length)
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        dataObject() {
            return {
                senderPublicKey: this.coldAddresses[this.coldAddress],
                assetId: '',
                feeAssetId: '',
                timestamp: Date.now(),
                amount: this.coldAmount,
                fee: this.coldFee,
                recipient: this.coldRecipient,
                attachment: this.coldAttachment
            }
        },
        coldPublicKey() {
            return this.coldAddresses[this.coldAddress]
        }
    },
    methods: {
        sendData: function(walletType) {
            console.log(walletType)
            const dataInfo = {
                recipient: walletType === 'hotWallet' ? this.recipient : this.coldRecipient,
                assetId: '',
                amount: walletType === 'hotWallet' ? Number(this.amount) : this.coldAmount,
                feeAssetId: '',
                fee: 100000,
                attachment: walletType === 'hotWallet' ? this.attachment : this.coldAttachment,
                timestamp: Date.now()
            }
            const apiSchema = transaction.prepareForAPI(dataInfo, this.keyPair)
            console.log(JSON.stringify(apiSchema))
            const url = TESTNET_NODE + '/assets/broadcast/transfer'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                console.log('success')
                this.pageId++
            }, response => {
                console.log('failed')
                // alert('send transaction failed!')
                this.pageId++
            })
        },
        nextPage: function() {
            this.pageId++
        },
        coldNextPage: function() {
            this.coldPageId++
        },
        prevPage: function() {
            if (this.pageId === 1) {
                this.$refs.modal.hide()
            } else {
                this.pageId--
            }
        },
        coldPrevPage: function() {
            if (this.coldPageId === 1) {
                this.$refs.modal.hide()
            } else {
                this.coldPageId--
            }
        },
        resetPage: function() {
            this.pageId = 1
            this.coldPageId = 1
            this.scanShow = false
        },
        endSend: function() {
            this.$refs.modal.hide()
        },
        scanChange: function(evt) {
            this.scanShow = !this.scanShow
            // if (this.scanShow) {
            //     evt.preventDefault()
            // }
        },
        isValidRecipient: function(recipient) {
            if (!recipient) {
                return true
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(recipient)
            } catch (e) {
                console.log(e)
            }
            console.log(isValid)
            return isValid
        },
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
        getParamValue: function(url, key) {
            var regex = new RegExp(key + '=([^&]*', 'i')
            return url.match(regex)[1]
        },
        onDecode: function(decodeString) {
            this.paused = true
            this.recipient = this.getParamValue(decodeString, 'recipient')
            this.amount = this.getParamValue(decodeString, 'amount')
        },
        onColdDecode: function(decodeString) {
            this.paused = true
            this.coldRecipient = this.getParamValue(decodeString, 'recipient')
            this.coldAmount = this.getParamValue(decodeString, 'amount')
        },
        scanAgain: function() {
            this.paused = false
            this.recipient = ''
        }
    }
}
</script>

<style scoped>

</style>
