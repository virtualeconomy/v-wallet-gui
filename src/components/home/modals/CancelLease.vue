<template>
  <b-modal :id="'cancelLeaseModal_' + modalId"
           centered
           hide-footer
           hide-header
           ref="cancelLeaseModal"
           @hidden="resetPage">
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-container v-if="page==='confirm'"
                 class="cl-modal">
      <div class="md-content">
        <div class="cl-title">
          <div class="cl-icon">
            <img src="@/assets/imgs/icons/wallet/ic_leasing_cancel.svg"
                 width="60px"
                 height="60px">
          </div>
          <div class="cl-amount">{{ formatter(amount) }} VSYS</div>
        </div>
        <div class="cl-address">
          <label>From</label>
          <span>{{ address }}</span>
        </div>
        <div class="cl-address">
          <label>To</label>
          <span>{{ recipient }}</span>
        </div>
        <div class="cl-fee">
          <label>Fee</label>
          <span>{{ formatter(fee) }} VSYS</span>
        </div>
      </div>
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
            @click="closeModal">Back
          </b-button>
        </b-col>
        <b-col class="col-rit">
          <b-button
            block
            class="btn-confirm"
            variant="warning"
            size="lg"
            :disabled="hasConfirmed"
            @click="sendCancelLease">Confirm
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else-if="page==='success'">
      <CancelSuccess @show-details="showDetails"></CancelSuccess>
    </b-container>
    <b-container v-else-if="page==='cold' && getDevice==='Ledger'"
                 class="text-left">
      <LedgerConfirm :tx-info="dataObject.toJsonForColdSignature()"
                     :transaction-bytes="dataObject.toBytes()"
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
            @click="prevPage">Back
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else-if="page==='cold'"
                 class="text-left">
      <ColdSignature :data-object="dataObject.toJsonForColdSignature()"
                     :cold-public-key="this.coldPublicKey"
                     :transaction-bytes="dataObject.toBytes()"
                     @get-signature="getSignature"
                     @prev-page="prevPage"></ColdSignature>
    </b-container>
  </b-modal>
</template>

<script>
import Confirm from './Confirm'
import { TX_FEE } from '@/js-v-sdk/src/constants'
import { NETWORK_BYTE } from '@/network'
import ColdSignature from './ColdSignature'
import CancelSuccess from './CancelSuccess'
import TxInfoModal from '../elements/TxInfoModal'
import seedLib from '@/libs/seed'
import Vue from 'vue'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import LedgerConfirm from './LedgerConfirm'
import Transaction from '@/js-v-sdk/src/transaction'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'CancelLease',
    components: { TxInfoModal, CancelSuccess, ColdSignature, Confirm, LedgerConfirm },
    data: function() {
        return {
            errorMessage: '',
            page: 'confirm',
            timestamp: Date.now() * 1e6,
            coldSignature: '',
            sendError: false,
            signed: false,
            hasConfirmed: false
        }
    },
    props: {
        walletType: {
            type: String,
            default: '',
            require: true
        },
        address: {
            type: String,
            default: '',
            require: true
        },
        amount: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            },
            require: true
        },
        fee: {
            type: BigNumber,
            default: function() {
                return BigNumber(TX_FEE)
            },
            require: true
        },
        recipient: {
            type: String,
            default: '',
            require: true
        },
        modalId: {
            type: String,
            default: '',
            require: true
        },
        coldSigned: {
            type: Boolean,
            default: false
        },
        coldPublicKey: {
            type: String,
            default: ''
        },
        addressIndex: {
            type: Number,
            default: 0,
            require: true
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            account: 'account'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        selectedKeypair() {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, this.addressIndex).keyPair
        },
        dataObject() {
            let tra = this.buildTransaction(this.coldPublicKey)
            return tra
        },
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
        coldAddressInfo() {
            let addrInfo = {'api': 1, 'publicKey': '', 'device': 'unknown'}
            if (this.userInfo && this.userInfo.hasOwnProperty('coldAddresses')) {
                let object = JSON.parse(this.userInfo.coldAddresses)
                if (object.hasOwnProperty(this.address)) {
                    addrInfo = object[this.address]
                }
            }
            return addrInfo
        }
    },
    methods: {
        ...mapActions(['updateBalance']),
        resetPage() {
            this.page = 'confirm'
            this.timestamp = Date.now() * 1e6
            this.signed = false
            this.sendError = false
            this.coldSignature = ''
            this.hasConfirmed = false
        },
        closeModal() {
            this.$refs.cancelLeaseModal.hide()
        },
        buildTransaction(publicKey) {
            let tra = new Transaction(NETWORK_BYTE)
            tra.buildCancelLeasingTx(publicKey, this.modalId, this.timeStamp)
            return tra
        },
        sendCancelLease() {
            let sendTx
            if (this.walletType === 'coldWallet') {
                if (!this.signed) {
                    this.page = 'cold'
                    return
                } else {
                    let signature = this.coldSignature
                    sendTx = this.dataObject.toJsonForSendingTx(signature)
                }
            } else {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                let builtTransaction = this.buildTransaction(this.selectedKeypair.publicKey)
                this.account.buildFromPrivateKey(this.selectedKeypair.privateKey)
                let signature = this.account.getSignature(builtTransaction.toBytes())
                sendTx = builtTransaction.toJsonForSendingTx(signature)
            }
            this.chain.sendCancelLeasingTx(sendTx).then(response => {
                this.page = 'success'
                this.updateBalance(true)
            }, respErr => {
                this.errorMessage = respErr.message
                if (this.errorMessage === undefined) {
                    this.errorMessage = 'Unknown. Please check network connection!'
                }
                this.sendError = true
            })
        },
        prevPage() {
            this.page = 'confirm'
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.signed = true
            this.page = 'confirm'
        },
        showDetails() {
            this.$emit('show-details', this.timestamp)
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        }
    }
}
</script>

<style scoped lang="less">
.cl-modal {
    text-align: center;
    .cl-title {
        padding: 24px 0;
        border-bottom: 1px solid #1111;
        .cl-icon {
            margin-bottom: 10px;
        }
    }
    .md-content {
        padding: 40px 24px;
        padding-top: 0;
    }
    .cl-amount {
        font-size: 28px;
        color: #181B3A;
        letter-spacing: 0;
        text-align: center;
    }
    .cl-address {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 15px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
    .cl-fee {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 15px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
}
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
</style>
