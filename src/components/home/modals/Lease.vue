<template>
  <div>
    <b-modal id="leaseModal"
             ref="leaseModal"
             centered
             hide-header
             hide-footer
             @hide="resetPage"
             lazy
             @show="showPage">
      <button
        class="close btn-close"
        @click="closeModal">
        <img src="@/assets/imgs/icons/operate/ic_close.svg">
      </button>
      <b-tabs>
        <b-tab title="Hot Wallet"
               :active="selectedWalletType==='hotWallet'">
          <LeaseInput :balances="balances"
                      @get-data="getData"
                      v-if="pageId===1"
                      :addresses="addresses"
                      :wallet-type="'hotWallet'"
                      :default-address="defaultAddress"
                      :default-cold-address="defaultColdAddress"
                      ref="addrInput"
                      :selected-address="selectedAddress"
                      :selected-wallet-type="selectedWalletType"></LeaseInput>
          <b-container v-else-if="pageId===2">
            <Confirm :tx-type="'lease'"
                     :amount=inputAmount(amount)
                     :address="address"
                     :recipient="recipient"
                     :fee="fee"></Confirm>
            <p v-show="sendError"
               class="text-danger">
              <small>Sorry, transaction send failed! Failed reason: {{ errorMessage }}</small>
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
                  :disabled="hasConfirmed"
                  @click="sendData('hotWallet')">Confirm
                </b-button>
              </b-col>
            </b-row>
          </b-container>
          <LeaseSuccess v-else-if="pageId===3"
                        :amount=inputAmount(amount)
                        :address="recipient"
                        @show-details="showDetails"></LeaseSuccess>
        </b-tab>
        <b-tab title="Cold Wallet"
               :disabled="noColdAddress"
               :active="selectedWalletType==='coldWallet'">
          <LeaseInput :balances="balances"
                      @get-data="getData"
                      v-if="coldPageId===1"
                      :wallet-type="'coldWallet'"
                      :cold-addresses="coldAddresses"
                      :default-address="defaultAddress"
                      :default-cold-address="defaultColdAddress"
                      ref="coldAddrInput"
                      :selected-address="selectedAddress"
                      :selected-wallet-type="selectedWalletType"></LeaseInput>
          <b-container v-else-if="coldPageId===2">
            <Confirm :tx-type="'lease'"
                     :amount=inputAmount(amount)
                     :address="coldAddress"
                     :recipient="recipient"
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
          <b-container v-if="coldPageId===3 && getDevice === 'Ledger'"
                       class="text-left">
            <LedgerConfirm :tx-info="dataObject.toJsonForColdSignature()"
                           :address-info="coldAddressInfo"
                           @get-signature="getSignature"
                           @prev-page="prevPage"></LedgerConfirm>
            <b-row class="row">
              <b-col class="col-back">
                <b-button
                  class="btn-back"
                  block
                  variant="light"
                  size="lg"
                  @click="prevColdPage">Back
                </b-button>
              </b-col>
            </b-row>
          </b-container>
          <b-container v-else-if="coldPageId===3"
                       class="text-left">
            <ColdSignature :data-object="dataObject.toJsonForColdSignature()"
                           v-if="coldPageId===3"
                           @get-signature="getSignature"
                           @prev-page="prevColdPage"></ColdSignature>
          </b-container>
          <b-container v-else-if="coldPageId===4">
            <Confirm :tx-type="'lease'"
                     :amount=inputAmount(amount)
                     :address="coldAddress"
                     :recipient="recipient"
                     :fee="fee"></Confirm>
            <p v-show="sendError"
               class="text-danger">
              <small>Sorry, transaction send failed ! Failed reason: {{ errorMessage }}</small>
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
                        :amount=inputAmount(amount)
                        @show-details="showDetails"></LeaseSuccess>
        </b-tab>
      </b-tabs>
    </b-modal>
    <TxInfoModal :modal-id="txId"
                 :tx-icon="'leased out'"
                 :tx-recipient="txRecipient"
                 :tx-address="txAddress"
                 :tx-time="txTimestamp"
                 :tx-fee="fee"
                 :tx-amount="txAmount"
                 :trans-type="'lease'"
                 :self-send="isRaisingLease"></TxInfoModal>
  </div>
</template>

<script>
import LeaseInput from './LeaseInput'
import Transaction from '@/js-v-sdk/src/transaction'
import Confirm from './Confirm'
import ColdSignature from './ColdSignature'
import Vue from 'vue'
import { TX_FEE, VSYS_PRECISION, NETWORK_BYTE } from '@/constants'
import seedLib from '@/libs/seed'
import LeaseSuccess from './LeaseSuccess'
import TxInfoModal from '../elements/TxInfoModal'
import BigNumber from 'bignumber.js'
import LedgerConfirm from './LedgerConfirm'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'Lease',
    components: { LeaseSuccess, Confirm, LeaseInput, ColdSignature, TxInfoModal, LedgerConfirm },
    data: function() {
        return {
            amount: BigNumber(0),
            recipient: '',
            pageId: 1,
            coldPageId: 1,
            fee: BigNumber(TX_FEE),
            sendError: false,
            coldSignature: '',
            address: '',
            coldAddress: '',
            txId: '',
            txAddress: '',
            txRecipient: '',
            txTimestamp: 0,
            txAmount: BigNumber(0),
            timestamp: 0,
            hasConfirmed: false,
            isRaisingLease: 'true',
            errorMessage: ''
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
        },
        selectedWalletType: {
            type: String,
            default: 'hotWallet',
            require: true
        },
        selectedAddress: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account'
        }),
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
        getDevice() {
            if (this.coldAddressInfo.hasOwnProperty('device')) {
                return this.coldAddressInfo.device
            }
            return ''
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldAddresses[this.coldAddress].publicKey)
            return tra
        },
        noColdAddress() {
            return Object.keys(this.coldAddresses).length === 0 && this.coldAddresses.constructor === Object
        },
        defaultAddress() {
            return Vue.ls.get('address')
        },
        defaultColdAddress() {
            return this.noColdAddress ? '' : Object.keys(this.coldAddresses)[0]
        },
        coldAddressInfo() {
            if (this.coldAddresses.hasOwnProperty(this.coldAddress)) {
                return this.coldAddresses[this.coldAddress]
            } else {
                return {'api': 1, 'publicKey': '', 'device': 'unknown'}
            }
        }
    },
    methods: {
        ...mapActions(['updateBalance']),
        inputAmount(num) {
            return BigNumber(num)
        },
        closeModal() {
            this.$refs.leaseModal.hide()
        },
        getData(recipient, amount, address, walletType) {
            this.recipient = recipient
            this.amount = BigNumber(amount)
            if (walletType === 'hotWallet') {
                this.address = address
                this.timestamp = Date.now() * 1e6
                this.hasConfirmed = false
                this.pageId++
            } else {
                this.coldAddress = address
                this.coldPageId++
            }
        },
        resetPage() {
            this.amount = BigNumber(0)
            this.recipient = ''
            this.pageId = 1
            this.coldPageId = 1
            this.fee = BigNumber(TX_FEE)
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
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            tra.buildLeasingTx(publicKey, this.recipient, this.amount, this.timeStamp)
            return tra
        },
        sendData(walletType) {
            let sendTx
            if (walletType === 'hotWallet') {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                let builtTransaction = this.buildTransaction(this.getKeypair(this.addresses[this.address]).publicKey)
                this.account.buildFromPrivateKey(this.getKeypair(this.addresses[this.address]).privateKey)
                let signature = this.account.getSignature(builtTransaction.toBytes())
                sendTx = builtTransaction.toJsonForSendingTx(signature)
            } else if (walletType === 'coldWallet') {
                let signature = this.coldSignature
                sendTx = this.dataObject.toJsonForSendingTx(signature)
            }
            this.chain.sendLeasingTx(sendTx).then(response => {
                this.txId = response.id
                this.txAddress = response.proofs[0].address
                this.txRecipient = response.recipient
                this.txTimestamp = response.timestamp
                this.txAmount = BigNumber(response.amount).dividedBy(VSYS_PRECISION)
                if (walletType === 'hotWallet') {
                    this.pageId++
                } else {
                    this.coldPageId++
                }
                this.updateBalance(true)
            }, respErr => {
                this.errorMessage = respErr.message
                if (this.errorMessage === undefined) {
                    this.errorMessage = 'Unknown.Please check network connection!'
                }
                this.sendError = true
            })
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.coldPageId++
        },
        showDetails() {
            this.$root.$emit('bv::hide::modal', 'txInfoModal_lease' + this.txId + this.isRaisingLease)
            this.$root.$emit('bv::show::modal', 'txInfoModal_lease' + this.txId + this.isRaisingLease)
        },
        getKeypair(index) {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, index).keyPair
        },
        showPage() {
            if (this.$refs.addrInput) {
                this.$refs.addrInput.resetData()
            }
            if (this.$refs.coldAddrInput) {
                this.$refs.coldAddrInput.resetData()
            }
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
.col-back {
    padding-left: 10px;
    margin-top: -70px;
    margin-right: 230px;
    margin-left: 5px;
}
.row {
    margin-top: 26px;
    margin-bottom: 10px;
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

</style>
