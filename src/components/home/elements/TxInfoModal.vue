<template>
  <b-modal :id="'txInfoModal_' + transType + modalId + selfSend"
           ref="infoModal"
           class="tx-modal"
           lazy
           centered
           hide-header
           hide-footer>
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
          <img v-else-if="txIcon==='leased in'"
               src="../../../assets/imgs/icons/wallet/ic_leasing_reverse.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased out'"
               src="../../../assets/imgs/icons/wallet/ic_leasing.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased out canceled'"
               src="../../../assets/imgs/icons/wallet/ic_leasing_cancel.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased in canceled'"
               src="../../../assets/imgs/icons/wallet/ic_leasing_cancel_in.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='create contract'"
               src="../../../assets/imgs/icons/wallet/ic_contract_signup.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='execution contract success'"
               src="../../../assets/imgs/icons/wallet/ic_exec_success.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='execution contract fail'"
               src="../../../assets/imgs/icons/wallet/ic_exec_fail.svg"
               width="60px"
               height="60px">
        </div>
        <div :class="txClass + '-amount'">{{ txIcon === 'sent' ? '-' : txIcon === 'received' ? '+' : '' }}{{ formatter(txAmount) }} VSYS</div>
      </div>
      <div class="tx-address">
        <label>{{ (txIcon === 'received' || txIcon === 'leased in' || txIcon === 'leased in canceled') ? 'From' : 'To' }}</label>
        <span>{{ displayAddress }}</span>
      </div>
      <div class="tx-timestamp">
        <label>Timestamp</label>
        <span>{{ new Date(txTime / 1000000).toLocaleString() }}</span>
      </div>
      <div class="tx-fee">
        <label>Fee</label>
        <span>{{ formatter(txFee) || 0 }} VSYS</span>
      </div>
      <div class="tx-attachment"
           v-if="txIcon === 'sent' || txIcon === 'received'">
        <label>Attachment</label>
        <span>{{ txAttachment }}</span>
        <span class="tx-attachment-whole">{{ txAttachment }}</span>
      </div>
      <div class="tx-id">
        <label>ID</label>
        <img src="../../../assets/imgs/icons/wallet/ic_magnifier.svg"
             @click="txInfo">
        <span>{{ displayId }}</span>
      </div>
      <div v-if="txBlock"
           class="tx-block">
        <label>Block Height</label>
        <span>{{ txBlock }}</span>
      </div>
      <div v-if="heightStatus"
           class="tx-status">
        <label>Block Confirmation</label>
        <span v-if="differenceHeight > 30">{{ differenceHeight }}(Confirmed)</span>
        <span v-else-if="differenceHeight <= 30 && differenceHeight >= 0">{{ differenceHeight }}(Unconfirmed)</span>
      </div>
      <div class="tx-status">
        <label>Status</label>
        <span>{{ txStatus }}</span>
      </div>
    </div>
  </b-modal>
</template>

<script>
import browser from '../../../utils/browser'
import BigNumber from 'bignumber.js'
import { TX_FEE, TX_TEST_EXPLORER, NETWORK_BYTE, TX_EXPLORER } from '../../../constants'
export default {
    name: 'TxInfoModal',
    props: {
        differenceHeight: {
            type: Number,
            default: 0
        },
        heightStatus: {
            type: Boolean,
            default: false
        },
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
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            }
        },
        txFee: {
            type: BigNumber,
            default: function() {
                return BigNumber(TX_FEE)
            }
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
            default: 'payment'
        },
        selfSend: {
            type: String,
            default: ''
        },
        txBlock: {
            type: Number,
            default: 0
        },
        txStatus: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            networkType: String.fromCharCode(NETWORK_BYTE)
        }
    },
    computed: {
        txClass() {
            return this.txIcon.replace(/\s+/g, '')
        },
        displayId() {
            if (this.isMobile() && this.modalId.length > 24) {
                return this.modalId.substring(0, 23) + '...'
            } else {
                return this.modalId
            }
        },
        displayAddress() {
            if (this.isMobile() && this.txAddress.length > 24) {
                return this.txAddress.substring(0, 23) + '...'
            } else {
                return this.txAddress
            }
        }
    },
    methods: {
        isMobile() {
            return browser.isMobile()
        },
        txInfo() {
            if (this.networkType === 'T') {
                window.open(TX_TEST_EXPLORER + this.modalId)
            } else {
                window.open(TX_EXPLORER + this.modalId)
            }
        },
        closeModal() {
            this.$refs.infoModal.hide()
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
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
            font-size: 13px;
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
        img {
            width: 30px;
            height: 22px;
            float: right;
        }
        span {
            float:right;
            font-size: 13px;
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
            font-size: 13px;
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
    .tx-timestamp {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
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
    .tx-status {
        text-align: left;
        border-bottom: 1px solid #E8E9ED;
        height: 48px;
        padding-top: 15px;
        span {
            float:right;
            font-size: 13px;
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
            font-size: 13px;
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
            font-size: 13px;
            color: #4F515E;
            letter-spacing: 0;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 300px;
            position: relative;
            display: inline-block;
        }
        label {
            font-size: 15px;
            color: #9091A3;
            letter-spacing: 0;
        }
    }
    .tx-attachment .tx-attachment-whole{
        visibility: hidden;
        background-color: #DEE2E6;
        color: black;
        text-align: right;
        border-radius: 6px;
        padding: 0px;
        word-wrap:break-word;
        position:absolute;
        z-index:1;
        right:35px;
    }
    .tx-attachment:hover .tx-attachment-whole {
         visibility: visible;
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
        color: #86BEF7;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedout-amount {
        font-size: 28px;
        color: #73CC5A;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedoutcanceled-amount {
        font-size: 28px;
        color: #FF7A8A;
        letter-spacing: 0;
        text-align: center;
    }
    .leasedincanceled-amount {
        font-size: 28px;
        color: #FFD192;
        letter-spacing: 0;
        text-align: center;
    }
    .executioncontractsuccess-amount{
        font-size: 0px;
    }
    .executioncontractfail-amount{
        font-size: 0px;
    }
    .createcontract-amount{
        font-size: 0px;
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
