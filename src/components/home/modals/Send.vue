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
             active>
        <b-container v-show="pageId===1">
          <b-form-group label="Recipient"
                        label-for="recipientInput">
            <b-form-input id="recipientInput"
                          type="text"
                          v-model="recipient"
                          :state="isValidRecipient"
                          aria-describedby="inputLiveFeedback">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
              Invalid recipient address.
            </b-form-invalid-feedback>
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
      <b-tab title="cold wallet">
        <b-container v-show="coldPageId===1">
          <b-form-group label="coldRecipient"
                        label-for="coldRecipientInput">
            <b-form-input id="coldRecipientInput"
                          type="text"
                          v-model="coldRecipient">
            </b-form-input>
          </b-form-group>
          <b-form-group label="coldAmount"
                        label-for="coldAmountInput">
            <b-form-input id="coldAmountInput"
                          type="number"
                          v-model="coldAmount">
            </b-form-input>
          </b-form-group>
          <b-form-group label="coldDescription"
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
                    @click="sendData('coldWallet')">Confirm
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
import { TESTNET_NODE, ADDRESS_LENGTH } from '@/constants.js'
import Confirm from './Confirm'
import Success from './Success'
import crypto from '@/utils/crypto'
export default {
    name: 'Send',
    components: {Success, Confirm},
    data: function() {
        return {
            recipient: '',
            amount: 0,
            attachment: '',
            pageId: 1,
            fee: 1,
            coldRecipient: '',
            coldAmount: 0,
            coldAttachment: '',
            coldPageId: 1,
            coldFee: 1
        }
    },
    computed: {
        address() {
            return Vue.ls.get('address')
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.address))
        },
        coldAddresses() {
            if (this.userInfo && this.userInfo.coldAddresses) {
                return JSON.parse(this.userInfo.coldAddresses)
            }
            return {}
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
        isValidRecipient() {
            if (!this.recipient) {
                return true
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(this.recipient)
            } catch (e) {
                console.log(e)
            }
            console.log(isValid)
            return isValid
        },
        isSubmitDisabled() {
            return !(this.recipient.length === ADDRESS_LENGTH && this.amount > 0 && this.isValidRecipient)
        },
        isColdSubmitDisabled() {
            return !(this.coldRecipient.length === ADDRESS_LENGTH && this.coldAmount > 0)
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
                fee: 1,
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
            this.pageId--
            if (this.pageId === 0) {
                this.$refs.modal.hide()
                this.pageId = 1
            }
        },
        coldPrevPage: function() {
            this.coldPageId--
            if (this.coldPageId === 0) {
                this.$ref.modal.hide()
                this.pageId = 1
            }
        },
        resetPage: function() {
            this.pageId = 1
            this.coldPageId = 1
        },
        endSend: function() {
            this.$refs.modal.hide()
        }
    }
}
</script>

<style scoped>

</style>
