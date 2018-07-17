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
          <div class="cl-amount">{{ amount }} vee</div>
        </div>
        <div class="cl-address">
          <label>To</label>
          <span>{{ address }}</span>
        </div>
        <div class="cl-fee">
          <label>Fee</label>
          <span>{{ fee }} vee</span>
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
                     @prev-page="prevPage"></ColdSignature>
    </b-container>
  </b-modal>
</template>

<script>
import Confirm from './Confirm'
import {CANCEL_LEASE_TX, VEE_PRECISION, TESTNET_NODE, TX_FEE} from '../../../constants'
import transaction from '@/utils/transaction'
import ColdSignature from './ColdSignature'
import CancelSuccess from './CancelSuccess'
import TxInfoModal from '../elements/TxInfoModal'
export default {
    name: 'CancelLease',
    components: { TxInfoModal, CancelSuccess, ColdSignature, Confirm },
    data: function() {
        return {
            page: 'confirm',
            timestamp: 0,
            coldSignature: '',
            coldTimestamp: 0,
            sendError: false,
            signed: false
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
            type: Number,
            default: 0,
            require: true
        },
        fee: {
            type: Number,
            default: TX_FEE,
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
        keyPair: {
            type: Object,
            default: function() {}
        },
        txTimestamp: {
            type: Number,
            default: 0,
            require: true
        }
    },
    computed: {
        dataObject() {
            return {
                transactionType: CANCEL_LEASE_TX,
                senderPublicKey: this.coldPubKey,
                fee: this.fee * VEE_PRECISION,
                txId: this.modalId
            }
        }
    },
    methods: {
        resetPage() {
            this.page = 'confirm'
            this.signed = false
            this.sendError = false
            this.coldSignature = ''
            this.coldTimestamp = 0
        },
        closeModal() {
            this.$refs.cancelLeaseModal.hide()
        },
        sendCancelLease() {
            var apiSchema
            if (this.walletType === 'coldWallet') {
                if (!this.signed) {
                    this.page = 'cold'
                } else {
                    this.timestamp = this.coldTimestamp
                    apiSchema = transaction.prepareColdForAPI(this.dataObject, this.coldSignature, this.coldTimestamp)
                }
            } else {
                const dataInfo = {
                    txId: this.modalId,
                    fee: this.fee * VEE_PRECISION,
                    timestamp: Date.now() * 1e6
                }
                this.timestamp = dataInfo.timestamp
                apiSchema = transaction.prepareForAPI(dataInfo, this.keyPair, CANCEL_LEASE_TX)
            }
            const url = TESTNET_NODE + '/leasing/broadcast/cancel'
            this.$http.post(url, JSON.stringify(apiSchema)).then(response => {
                this.page = 'success'
            }, response => {
                this.sendError = true
            })
        },
        prevPage() {
            this.page = 'confirm'
        },
        getSignature(signature, timestamp) {
            this.coldSignature = signature
            this.coldTimestamp = timestamp
            this.signed = true
            this.page = 'confirm'
        },
        showDetails() {
            this.$emit('show-details', this.timestamp)
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
