<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="1">
        <img v-if="txIcon==='sent'"
             src="../../../assets/imgs/icons/ic_sent.svg"
             width="20px"
             height="20px">
        <img v-else
             src="../../../assets/imgs/icons/ic_received.svg"
             width="20px"
             height="20px">
      </b-col>
      <b-col class="record-detail"
             cols="3">
        <b-row>
          <b-col class="title">{{ txType }} VEE</b-col>
        </b-row>
        <b-row>
          <b-col class="detail">{{ txIcon === 'sent' ? 'To' : 'From' }}: {{ txAddress }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-time"
             cols="2">
        <b-row>
          <b-col>&nbsp;&nbsp;&nbsp;&nbsp;</b-col>
        </b-row>
        <b-row>
          <b-col class="record-time">| {{ txTime }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank"
             cols="3"
             md="3"></b-col>
      <b-col class="record-amount"
             cols="2">
        <div>
          <span>{{ txAmount }} VEE</span>
        </div>
      </b-col>
      <b-col class="record-action"
             cols="1">
        <b-dropdown no-caret
                    class="more-btn"
                    variant="link"
                    right>
          <template slot="button-content">
            <img src="../../../assets/imgs/icons/ic_more.svg">
          </template>
          <b-dropdown-item @click="$root.$emit('bv::show::modal', 'txInfoModal_' + txRecord.id, 'txInfoModal_' + txRecord.id)">TX info</b-dropdown-item>
          <b-dropdown-item @click="copyTxId">Copy TX ID</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <textarea class="copy-txid"
              v-model="txId"
              ref="tId"
              readonly></textarea>
    <TxInfoModal :modal-id="txRecord.id"
                 :tx-icon="txIcon"
                 :tx-type="txType"
                 :tx-address="txAddress"
                 :tx-fee="txFee"
                 :tx-amount="txAmount"
                 :tx-block="txBlock"></TxInfoModal>
  </b-container>
</template>

<script>
import TxInfoModal from './TxInfoModal'

export default {
    name: 'Record',
    components: {TxInfoModal},
    props: {
        txRecord: {
            type: Object,
            default: function() {
                return {
                    txType: '',
                    txAddress: '',
                    txTime: '',
                    txAmount: ''
                }
            }
        },
        address: {
            type: String,
            default: ''
        }
    },
    computed: {
        txType() {
            return this.txRecord.sender === this.address ? 'Sent' : 'Received'
        },
        txIcon() {
            return this.txType.toString().toLowerCase()
        },
        txAddress() {
            return this.txType === 'Sent' ? this.txRecord.recipient : this.txRecord.sender
        },
        txTime() {
            return new Date(this.txRecord.timestamp).toDateString()
        },
        txAmount() {
            return this.txRecord.amount
        },
        txFee() {
            return this.txRecord.fee
        },
        txBlock() {
            return this.txRecord.height
        },
        txId() {
            return this.txRecord.id
        }
    },
    methods: {
        copyTxId() {
            this.$refs.tId.select()
            window.document.execCommand('copy')
        }
    }
}
</script>

<style scoped lang="less">
.record-unit {
    font-size: 16px;
    text-align: left;
    vertical-align: middle;
    text-overflow: ellipsis;
    border: 1px solid #EDEDF0;

    .record-icon {
        width: 10%;
    }
    .record-detail {
        .title {
            font-size: 16px;
            font-weight: bold;
        }
        .detail {
            font-size: 10px;
            text-overflow: ellipsis;
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
        }
    }
    .record-time {
        font-size: 10px;
        padding-top: 6px;
    }
    .record-amount {
        padding-top: 4px;
    }
    .record-action {
        .more-btn {
            button {
                background: none;
                border: none;
            }
        }
    }
    .copy-txid {
        position: absolute;
        left: -999999px;
    }
}

</style>
