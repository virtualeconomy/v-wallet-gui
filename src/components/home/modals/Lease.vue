<template>
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
                    :address="address"></LeaseInput>
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
                      :amount="amount"></LeaseSuccess>
      </b-tab>
      <b-tab title="Cold Wallet">
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
// import { TX_FEE } from '@/constants'
import LeaseInput from './LeaseInput'
import Confirm from './Confirm'
import Vue from 'vue'
import { TX_FEE, VEE_PRECISION, LEASE_TX, TESTNET_NODE } from '@/constants'
import transaction from '@/utils/transaction'
import seedLib from '@/libs/seed'
import LeaseSuccess from './LeaseSuccess'
export default {
    name: 'Lease',
    components: { LeaseSuccess, Confirm, LeaseInput },
    data: function() {
        return {
            amount: 0,
            recipient: '',
            pageId: 3,
            fee: TX_FEE,
            sendError: false
        }
    },
    props: {
        balances: {
            type: Object,
            default: function() {},
            require: true
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
        }
    },
    methods: {
        closeModal() {
            this.$refs.leaseModal.hide()
        },
        getData(recipient, amount) {
            this.recipient = recipient
            this.amount = amount
            this.pageId++
        },
        resetPage() {
            this.pageId = 1
        },
        prevPage() {
            this.sendError = false
            this.pageId--
        },
        sendData(walletType) {
            var apiSchema
            if (walletType === 'hotWallet') {
                const dataInfo = {
                    recipient: this.recipient,
                    amount: Number(this.amount) * VEE_PRECISION,
                    fee: TX_FEE * VEE_PRECISION,
                    timestamp: Date.now() * 1e6
                }
                apiSchema = transaction.prepareForAPI(dataInfo, this.keyPair, LEASE_TX)
            }
            const url = TESTNET_NODE + '/leasing/broadcast/lease'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                this.pageId++
            }, response => {
                this.sendError = true
            })
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
