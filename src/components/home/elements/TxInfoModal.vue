<template>
  <b-modal :id="'txInfoModal_' + transType + modalId"
           ref="infoModal"
           class="tx-modal"
           lazy
           centered
           hide-header
           hide-footer
           @hide="hidden">
    <div class="md-content">
      <button
        class="close btn-close"
        @click="closeModal">
        <img src="../../../assets/imgs/icons/operate/ic_close.svg">
      </button>
      <div class="tx-title">
        <div class="tx-icon">
          <img v-if="txIcon==='sent'"
               src="../../../assets/imgs/icons/wallet/ic_sent.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='received'"
               src="../../../assets/imgs/icons/wallet/ic_received.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leasedin'"
               src="../../../assets/imgs/icons/wallet/ic_leasing_reverse.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leasedout'"
               src="../../../assets/imgs/icons/wallet/ic_leasing.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='cancelleasing'"
               src="../../../assets/imgs/icons/wallet/ic_leasing_cancel.svg"
               width="60px"
               height="60px">
        </div>
        <div :class="txIcon + '-amount'"
             v-if="txIcon !== 'cancelleasing'">{{ txIcon === 'sent' ? '-' : txIcon === 'received' ? '+' : '' }}{{ txAmount }} vee</div>
      </div>
      <div class="tx-address"
           v-if="txIcon !== 'cancelleasing'">
        <label>{{ (txIcon === 'received' || txIcon === 'leasedin') ? 'From' : 'To' }}</label>
        <span>{{ txAddress }}</span>
      </div>
      <div class="tx-id"
           v-if="txIcon === 'cancelleasing'">
        <label>TX</label>
        <span>{{ modalId }}</span>
      </div>
      <div class="tx-block">
        <label>Timestamp</label>
        <span>{{ new Date(txTime / 1000000).toGMTString() }}</span>
      </div>
      <div class="tx-fee">
        <label>Fee</label>
        <span>{{ txFee }} vee</span>
      </div>
      <div class="tx-attachment"
           v-if="txIcon === 'sent' || txIcon === 'received'">
        <label>Attachment</label>
        <span>{{ txAttachment }}</span>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
    name: 'TxInfoModal',
    props: {
        modalId: {
            type: String,
            default: ''
        },
        txIcon: {
            type: String,
            default: ''
        },
        txAddress: {
            type: String,
            default: ''
        },
        txAmount: {
            type: Number,
            default: 0
        },
        txFee: {
            type: Number,
            default: 0
        },
        txBlock: {
            type: Number,
            default: 0
        },
        txTime: {
            type: Number,
            default: 0
        },
        txAttachment: {
            type: String,
            default: ''
        },
        transType: {
            type: String,
            default: 'transfer'
        }
    },
    methods: {
        closeModal() {
            this.$refs.infoModal.hide()
        }
    }
}
</script>

<style scoped lang="less">
.tx-modal {
    text-align: center;
    .tx-title {
        padding: 24px 0;
        border-bottom: 1px solid #1111;
        .tx-icon {
            margin-bottom: 10px;
        }
    }
    .tx-address {
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
    .tx-id {
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
    .tx-block {
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
    .tx-fee {
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
    .tx-attachment {
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
    .sent-amount {
        font-size: 28px;
        color: #F5354B;
        letter-spacing: 0;
        text-align: center;
    }
    .received-amount {
        font-size: 28px;
        color: #23A28C;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedin-amount {
        font-size: 28px;
        color: rgb(183,215,247);
        letter-spacing: 0;
        text-align: center;
    }
    .leasedout-amount {
        font-size: 28px;
        color: rgb(181,224,171);
        letter-spacing: 0;
        text-align: center;
    }
    .md-content {
        padding: 40px 24px;
        padding-top: 0;
    }
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
</style>
