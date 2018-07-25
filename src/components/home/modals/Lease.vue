<template>
  <div>
    <b-modal id="leaseModal"
             ref="leaseModal"
             centered
             hide-header
             hide-footer
             @hide="resetPage">
      <button
        class="close btn-close"
        @click="closeModal">
        <img src="../../../assets/imgs/icons/operate/ic_close.svg">
      </button>
      <b-tabs>
        <b-tab title="Hot Wallet"
               active>
          <LeaseInput :balances="balances"
                      @get-data="getData"
                      v-if="pageId===1"
                      :addresses="addresses"
                      :wallet-type="'hot'"
                      :default-address="defaultAddress"
                      ref="addrInput"></LeaseInput>
          <b-container v-else-if="pageId===2">
            <Confirm :tx-type="'lease'"
                     :amount="Number(amount)"
                     :address="address"
                     :recipient="recipient"
                     :fee="fee"></Confirm>
            <p v-show="sendError"
               class="text-danger">
              <small>Sorry, transaction send failed!</small>
            </p>
            <b-row>
              <b-col class="col-lef">
                <b-button
                  class="btn-back"
                  block
                  variant="light"
                  size="lg"
                  @click="prevPage">Back
                </b-button>
              </b-col>
              <b-col class="col-rit">
                <b-button
                  block
                  class="btn-confirm"
                  variant="warning"
                  size="lg"
                  @click="sendData('hotWallet')">Confirm
                </b-button>
              </b-col>
            </b-row>
          </b-container>
          <LeaseSuccess v-else-if="pageId===3"
                        :amount="Number(amount)"
                        :address="recipient"
                        @show-details="showDetails"></LeaseSuccess>
        </b-tab>
        <b-tab title="Cold Wallet"
               :disabled="noColdAddress">
          <LeaseInput :balances="balances"
                      @get-cold-data="getColdData"
                      v-if="coldPageId===1"
                      :wallet-type="'cold'"
                      :cold-addresses="coldAddresses"
                      :default-cold-address="defaultColdAddress"
                      ref="coldAddrInput"></LeaseInput>
          <b-container v-else-if="coldPageId===2">
            <Confirm :tx-type="'lease'"
                     :amount="Number(coldAmount)"
                     :address="coldAddress"
                     :recipient="coldRecipient"
                     :fee="fee"></Confirm>
            <b-row>
              <b-col class="col-lef">
                <b-button
                  class="btn-back"
                  block
                  variant="light"
                  size="lg"
                  @click="prevColdPage">Back
                </b-button>
              </b-col>
              <b-col class="col-rit">
                <b-button
                  block
                  class="btn-confirm"
                  variant="warning"
                  size="lg"
                  @click=nextColdPage>Confirm
                </b-button>
              </b-col>
            </b-row>
          </b-container>
          <ColdSignature :data-object="dataObject"
                         v-if="coldPageId===3"
                         @get-signature="getSignature"
                         @prev-page="prevColdPage"></ColdSignature>
          <b-container v-else-if="coldPageId===4">
            <Confirm :tx-type="'lease'"
                     :amount="Number(coldAmount)"
                     :address="coldAddress"
                     :recipient="coldRecipient"
                     :fee="fee"></Confirm>
            <p v-show="sendError"
               class="text-danger">
              <small>Sorry, transaction send failed!</small>
            </p>
            <b-row>
              <b-col class="col-lef">
                <b-button
                  class="btn-back"
                  block
                  variant="light"
                  size="lg"
                  @click="prevColdPage">Back
                </b-button>
              </b-col>
              <b-col class="col-rit">
                <b-button
                  block
                  class="btn-confirm"
                  variant="warning"
                  size="lg"
                  @click="sendData('coldWallet')">Confirm
                </b-button>
              </b-col>
            </b-row>
          </b-container>
          <LeaseSuccess v-else-if="coldPageId===5"
                        :amount="Number(coldAmount)"
                        @show-details="showDetails"></LeaseSuccess>
        </b-tab>
      </b-tabs>
    </b-modal>
    <TxInfoModal :modal-id="txId"
                 :tx-icon="'leased out'"
                 :tx-address="txAddress"
                 :tx-time="txTimestamp"
                 :tx-fee="fee"
                 :tx-amount="txAmount"
                 :trans-type="'lease'"></TxInfoModal>
  </div>
</template>

<script>
import LeaseInput from './LeaseInput'
import Confirm from './Confirm'
import ColdSignature from './ColdSignature'
import Vue from 'vue'
import { TX_FEE, VEE_PRECISION, LEASE_TX, TESTNET_NODE } from '@/constants'
import transaction from '@/utils/transaction'
import seedLib from '@/libs/seed'
import LeaseSuccess from './LeaseSuccess'
import TxInfoModal from '../elements/TxInfoModal'
export default {
    name: 'Lease',
    components: { LeaseSuccess, Confirm, LeaseInput, ColdSignature, TxInfoModal },
    data: function() {
        return {
            amount: 0,
            coldAmount: 0,
            recipient: '',
            coldRecipient: '',
            pageId: 1,
            coldPageId: 1,
            fee: TX_FEE,
            sendError: false,
            coldSignature: '',
            address: '',
            coldAddress: '',
            txId: '',
            txAddress: '',
            txTimestamp: 0,
            txAmount: 0
        }
    },
    props: {
        balances: {
            type: Object,
            default: function() {},
            require: true
        },
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true
        },
        addresses: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    computed: {
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.defaultAddress))
        },
        secretInfo() {
            return JSON.parse(
                seedLib.decryptSeedPhrase(this.userInfo.info, Vue.ls.get('pwd')))
        },
        seedPhrase() {
            return seedLib.decryptSeedPhrase(this.secretInfo.encrSeed, Vue.ls.get('pwd'))
        },
        dataObject() {
            return {
                transactionType: LEASE_TX,
                senderPublicKey: this.coldAddresses[this.coldAddress],
                amount: Number((this.coldAmount * VEE_PRECISION).toFixed(0)),
                fee: this.fee * VEE_PRECISION,
                recipient: this.coldRecipient,
                timestamp: Date.now()
            }
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        defaultAddress() {
            return Vue.ls.get('address')
        },
        defaultColdAddress() {
            return this.noColdAddress ? '' : Object.keys(this.coldAddresses)[0]
        }
    },
    methods: {
        closeModal() {
            this.$refs.leaseModal.hide()
        },
        getData(recipient, amount, address) {
            this.recipient = recipient
            this.amount = amount
            this.address = address
            this.pageId++
        },
        getColdData(recipient, amount, coldAddress) {
            this.coldRecipient = recipient
            this.coldAmount = amount
            this.coldAddress = coldAddress
            this.coldPageId++
        },
        resetPage() {
            if (this.$refs.addrInput) {
                this.$refs.addrInput.resetData()
            }
            if (this.$refs.coldAddrInput) {
                this.$refs.coldAddrInput.resetData()
            }
            this.amount = 0
            this.coldAmount = 0
            this.recipient = ''
            this.coldRecipient = ''
            this.pageId = 1
            this.coldPageId = 1
            this.fee = TX_FEE
            this.sendError = false
            this.coldSignature = ''
            this.coldAddress = ''
        },
        prevPage() {
            this.sendError = false
            this.pageId--
        },
        prevColdPage() {
            this.sendError = false
            this.coldPageId--
        },
        nextColdPage() {
            this.sendError = false
            this.coldPageId++
        },
        sendData(walletType) {
            var apiSchema
            if (walletType === 'hotWallet') {
                const dataInfo = {
                    recipient: this.recipient,
                    amount: Number((this.amount * VEE_PRECISION).toFixed(0)),
                    fee: TX_FEE * VEE_PRECISION,
                    timestamp: Date.now() * 1e6
                }
                apiSchema = transaction.prepareForAPI(dataInfo, this.getKeypair(this.addresses[this.address]), LEASE_TX)
            } else if (walletType === 'coldWallet') {
                apiSchema = transaction.prepareColdForAPI(this.dataObject, this.coldSignature, LEASE_TX)
            }
            const url = TESTNET_NODE + '/leasing/broadcast/lease'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                this.txId = response.body.id
                this.txAddress = response.body.recipient
                this.txTimestamp = response.body.timestamp
                this.txAmount = response.body.amount / VEE_PRECISION
                if (walletType === 'hotWallet') {
                    this.pageId++
                } else {
                    this.coldPageId++
                }
            }, response => {
                this.sendError = true
            })
        },
        getSignature(signature, timestamp) {
            this.coldSignature = signature
            this.dataObject.timestamp *= 1e6
            this.coldPageId++
        },
        showDetails() {
            this.$root.$emit('bv::show::modal', 'txInfoModal_lease' + this.txId)
        },
        getKeypair(index) {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, index).keyPair
        }
    }
}
</script>

<style scoped>
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 20px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.btn-back {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}

</style>
