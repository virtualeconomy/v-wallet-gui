<template>
  <b-modal :id="'txInfoModal_' + modalId"
           class="tx-modal">
    <div>
      <div class="tx-title">
        <div class="tx-icon">
          <img v-if="txIcon==='sent'"
               src="../../../assets/imgs/icons/wallet/ic_sent.svg"
               width="60px"
               height="60px">
          <img v-else
               src="../../../assets/imgs/icons/wallet/ic_received.svg"
               width="60px"
               height="60px">
        </div>
        <div>{{ txIcon === 'sent' ? '-' : '+' }}{{ txAmount }} vee</div>
      </div>
      <div class="tx-address">
        <label>{{ txIcon === 'sent' ? 'To' : 'From' }}</label>
        <span>{{ txAddress }}</span>
      </div>
      <div class="tx-block">
        <label>Timestamp</label>
        <span>{{ new Date(txTime / 1000000).toGMTString() }}</span>
      </div>
      <div class="tx-fee">
        <label>Fee</label>
        <span>{{ txFee }}</span>
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
        txType: {
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
        border-top: 1px dotted #1111;
        padding-top: 10px;
        span {
            float: right;
        }
    }
    .tx-block {
        text-align: left;
        border-top: 1px dotted #1111;
        padding-top: 10px;
        span {
            float: right;
        }
    }
    .tx-fee {
        text-align: left;
        border-top: 1px dotted #1111;
        padding-top: 10px;
        span {
            float: right;
        }
    }
}
</style>
