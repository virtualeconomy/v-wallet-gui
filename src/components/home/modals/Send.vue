<template>
  <b-modal id="sendModal"
           centered
           lazy
           title="Send"
           hide-footer
           ref="modal"
           :busy="true"
           @hidden="resetPage">
    <b-container v-show="pageId===1">
      <b-tabs>
        <b-tab title="hot wallet"
               active>
          <b-form-group label="Recipient"
                        label-for="recipientInput">
            <b-form-input id="recipientInput"
                          type="text"
                          v-model="recipient">
            </b-form-input>
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
        </b-tab>
        <b-tab title="cold wallet">
          <b-form-group label="Recipient"
                        label-for="recipientInput">
            <b-form-input id="recipientInput"
                          type="text"
                          v-model="recipient">
            </b-form-input>
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
        </b-tab>
      </b-tabs>
      <b-button variant="primary"
                size="lg"
                @click="prevPage">Cancle</b-button>
      <b-button variant="primary"
                size="lg"
                :disabled="isSubmitDisabled"
                @click="nextPage">Continue</b-button>
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
                @click="prevPage">Cancle</b-button>
      <b-button variant="primary"
                size="lg"
                @click="sendData">Confirm</b-button>
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
                @click="endSend">OK</b-button>
    </b-container>
  </b-modal>
</template>

<script>
import transaction from '@/utils/transaction'
import Vue from 'vue'
import seedLib from '@/libs/seed.js'
import { TESTNET_NODE, ADDRESS_LENGTH } from '@/constants.js'
import Confirm from './Confirm'
import Success from './Success'
export default {
    name: 'Send',
    components: {Success, Confirm},
    data: function() {
        return {
            recipient: '',
            amount: 0,
            attachment: '',
            pageId: 1,
            fee: 1
        }
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
        checkRecipient() {
            return this.recipient.length === ADDRESS_LENGTH
        },
        checkAmount() {
            return this.amount > 0
        },
        isSubmitDisabled() {
            return !this.checkRecipient || !this.checkAmount
        }
    },
    methods: {
        sendData: function() {
            const dataInfo = {
                recipient: this.recipient,
                assetId: 'VEE',
                amount: Number(this.amount),
                feeAssetId: 'VEE',
                fee: 1,
                attachment: this.attachment,
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
            console.log(this.pageId)
        },
        prevPage: function() {
            this.pageId--
            console.log(this.pageId)
            if (this.pageId === 0) {
                this.$refs.modal.hide()
                this.pageId = 1
            }
        },
        resetPage: function() {
            this.pageId = 1
        },
        endSend: function() {
            this.$refs.modal.hide()
        }
    }
}
</script>

<style scoped>

</style>
