<template>
  <b-modal :id="'cancelLeaseModal_' + modalId"
           centered
           hide-footer
           hide-header
           ref="cancelLeaseModal"
           @hidden="resetPage"
           class="cl-modal">
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-container v-if="page==='confirm'">
      <div class="md-content">
        <div class="cl-title">
          <div class="cl-icon">
            <img src="../../../assets/imgs/icons/wallet/ic_leasing_cancel.svg"
                 width="60px"
                 height="60px">
          </div>
          <div class="cl-amount">{{ formatter(amount) }} VSYS</div>
        </div>
        <div class="cl-address">
          <label>To</label>
          <span>{{ address }}</span>
        </div>
        <div class="cl-fee">
          <label>Fee</label>
          <span>{{ formatter(fee) }} VSYS</span>
        </div>
      </div>
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
    <b-container v-else-if="page==='cold'">
      <ColdSignature :data-object="dataObject"
                     @get-signature="getSignature"
                     @prev-page="prevPage"
                     :tx-type="txType"></ColdSignature>
    </b-container>
  </b-modal>
</template>

<script>
import Confirm from './Confirm'
import { CANCEL_LEASE_TX, VSYS_PRECISION, NODE_IP, TX_FEE, FEE_SCALE, PROTOCOL, OPC_TRANSACTION } from '../../../constants'
import transaction from '@/utils/transaction'
import ColdSignature from './ColdSignature'
import CancelSuccess from './CancelSuccess'
import TxInfoModal from '../elements/TxInfoModal'
import seedLib from '@/libs/seed'
import Vue from 'vue'
import browser from '../../../utils/browser'
import BigNumber from 'bignumber.js'
export default {
    name: 'CancelLease',
    components: { TxInfoModal, CancelSuccess, ColdSignature, Confirm },
    data: function() {
        return {
            page: 'confirm',
            timestamp: 0,
            coldSignature: '',
            sendError: false,
            signed: false,
            txType: CANCEL_LEASE_TX,
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
        fromAddress: {
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
            requrie: true
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
        coldPubKey: {
            type: String,
            default: ''
        },
        txTimestamp: {
            type: Number,
            default: 0,
            require: true
        },
        addressIndex: {
            type: Number,
            default: 0,
            require: true
        }
    },
    computed: {
        defaultAddress() {
            return Vue.ls.get('address')
        },
        dataObject() {
            return {
                protocol: PROTOCOL,
                opc: OPC_TRANSACTION,
                transactionType: CANCEL_LEASE_TX,
                senderPublicKey: this.coldPubKey,
                fee: this.fee * VSYS_PRECISION,
                feeScale: FEE_SCALE,
                txId: this.modalId,
                timestamp: Date.now(),
                api: this.coldApi()
            }
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
        }
    },
    methods: {
        resetPage() {
            this.page = 'confirm'
            this.signed = false
            this.sendError = false
            this.coldSignature = ''
            this.hasConfirmed = false
        },
        coldApi: function() {
            return 1
        },
        closeModal() {
            this.$refs.cancelLeaseModal.hide()
        },
        sendCancelLease() {
            var apiSchema
            if (this.walletType === 'coldWallet') {
                if (!this.signed) {
                    this.page = 'cold'
                    return
                } else {
                    apiSchema = transaction.prepareColdForAPI(this.dataObject, this.coldSignature, this.coldPubKey, CANCEL_LEASE_TX)
                }
            } else {
                if (this.hasConfirmed) {
                    return
                }
                this.hasConfirmed = true
                const dataInfo = {
                    txId: this.modalId,
                    fee: this.fee * VSYS_PRECISION,
                    feeScale: FEE_SCALE,
                    timestamp: Date.now() * 1e6
                }
                this.timestamp = dataInfo.timestamp
                apiSchema = transaction.prepareForAPI(dataInfo, this.getKeypair(), CANCEL_LEASE_TX)
            }
            const url = NODE_IP + '/leasing/broadcast/cancel'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                this.page = 'success'
            }, response => {
                this.sendError = true
            })
        },
        prevPage() {
            this.page = 'confirm'
        },
        getSignature(signature) {
            this.coldSignature = signature
            this.dataObject.timestamp *= 1e6
            this.signed = true
            this.page = 'confirm'
        },
        showDetails() {
            this.$emit('show-details', this.timestamp)
        },
        getKeypair() {
            return seedLib.fromExistingPhrasesWithIndex(this.seedPhrase, this.addressIndex).keyPair
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
</style>
