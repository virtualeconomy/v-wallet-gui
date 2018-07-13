<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="auto">
        <img v-if="txIcon==='sent'"
             src="../../../assets/imgs/icons/wallet/ic_sent.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='received'"
             src="../../../assets/imgs/icons/wallet/ic_received.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='leasedin'"
             src="../../../assets/imgs/icons/wallet/ic_leasing_reverse.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='leasedout'"
             src="../../../assets/imgs/icons/wallet/ic_leasing.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='cancelleasing'"
             src="../../../assets/imgs/icons/wallet/ic_leasing_cancel.svg"
             width="32px"
             height="32px">
      </b-col>
      <b-col class="record-detail"
             v-if="type==='transfer'"
             cols="auto">
        <b-row>
          <b-col class="title">{{ txType }} VEE</b-col>
        </b-row>
        <b-row>
          <b-col class="detail-1"
                 cols="auto">{{ txIcon === 'sent' ? 'To' : 'From' }}:</b-col>
          <b-col class="detail-2">{{ txAddressShow }}</b-col>
          <b-col class="detail-3"
                 cols="auto"></b-col>
          <b-col class="detail-4">{{ txHourStr }}:{{ txMinuteStr }}, {{ txMonthStr }}  {{ txDayStr }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-detail"
             v-if="type==='lease'"
             cols="auto">
        <b-row>
          <b-col class="title">{{ txTitle }}</b-col>
        </b-row>
        <b-row>
          <b-col class="detail-1"
                 cols="auto">{{ txIcon === 'leasedout' ? 'To' : 'From' }}:</b-col>
          <b-col class="detail-2">{{ txAddressShow }}</b-col>
          <b-col class="detail-3"
                 cols="auto"></b-col>
          <b-col class="detail-4">{{ txHourStr }}:{{ txMinuteStr }}, {{ txMonthStr }}  {{ txDayStr }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank"></b-col>
      <b-col :class="txIcon === 'sent' ? 'record-amount-s' : 'record-amount-r'"
             cols="auto">
        <div>
          <span v-if="type==='transfer'">{{ txIcon === 'sent' ? '-' : '+' }}{{ txIcon === 'sent' ? txAmount + txFee : txAmount }}</span>
          <span v-if="type==='lease'">{{ txIcon === 'leasedOut' ? txAmount + txFee : txAmount }}</span>
          <span> VEE</span>
        </div>
      </b-col>
      <b-col class="record-action"
             cols="auto">
        <b-dropdown no-caret
                    class="more-btn"
                    variant="link"
                    right>
          <template slot="button-content">
            <div
              @mouseover="hoverIco"
              @mouseout="unhoverIco">
              <img
                v-if="hovered"
                src="../../../assets/imgs/icons/wallet/ic_more_hover.svg">
              <img
                v-if="!hovered"
                src="../../../assets/imgs/icons/wallet/ic_more.svg">
            </div>
          </template>
          <b-dropdown-item @click="$root.$emit('bv::show::modal', 'txInfoModal_' + txRecord.id, 'txInfoModal_' + txRecord.id)">TX info</b-dropdown-item>
          <b-dropdown-item v-if="type==='lease'">Cancel Leasing</b-dropdown-item>
          <b-dropdown-item @click="copyTxId">Copy TX ID</b-dropdown-item>
          <b-dropdown-item @click="$root.$emit('bv::show::modal', 'cancelLeaseModal_' + txRecord.id, 'cancelLeaseModal_' + txRecord.id)">Cancel Lease</b-dropdown-item>
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
                 :tx-time="txRecord.timestamp"
                 :tx-fee="txFee"
                 :tx-amount="txAmount"
                 :tx-block="txBlock"
                 :tx-attachment="txAttachment"></TxInfoModal>
    <CancelLease :modal-id="txRecord.id"
                 :wallet-type="walletType"
                 :address="txAddress"
                 :amount="txAmount">
    </CancelLease>
  </b-container>
</template>

<script>
import TxInfoModal from './TxInfoModal'
import base58 from '@/libs/base58'
import converters from '@/libs/converters'
import { VEE_PRECISION } from '@/constants'
import CancelLease from '../modals/CancelLease'

export default {
    name: 'Record',
    components: { CancelLease, TxInfoModal },
    data: function() {
        return {
            hovered: false
        }
    },
    props: {
        txRecord: {
            type: Object,
            default: function() {
                return {
                    txType: '',
                    txAddress: '',
                    txTime: '',
                    txAmount: '',
                    txAttachment: ''
                }
            }
        },
        address: {
            type: String,
            default: ''
        },
        walletType: {
            type: String,
            default: '',
            require: true
        },
        type: {
            type: String,
            default: 'transfer',
            require: true
        }
    },
    computed: {
        txType() {
            if (this.txRecord['type'] === 4) {
                if (this.txRecord.sender === this.address) {
                    return 'Sent'
                } else {
                    return 'Received'
                }
            } else if (this.txRecord['type'] === 11) {
                return 'Received'
            } else if (this.txRecord['type'] === 8) {
                if (this.txRecord.sender === this.address) {
                    return 'LeasedOut'
                } else {
                    return 'LeasedIn'
                }
            } else if (this.txRecord['type'] === 9) {
                return 'CancelLeasing'
            } else {
                return ''
            }
        },
        txIcon() {
            return this.txType.toString().toLowerCase()
        },
        txAddress() {
            return this.txType === 'Sent' ? this.txRecord.recipient : this.txRecord.sender
        },
        txAddressShow() {
            if (this.txAddress) {
                const addrChars = this.txAddress.split('')
                addrChars.splice(6, 23, '******')
                return addrChars.join('')
            }
        },
        txTitle() {
            if (this.txType === 'LeasedOut') {
                return 'Start Leasing'
            } else if (this.txType === 'LeasedIn') {
                return 'Incoming Leasing'
            } else if (this.txType === 'CancelLeasing') {
                return 'Cancel Leasing'
            }
        },
        txTime() {
            return new Date(this.txRecord.timestamp / 1e6).toDateString()
        },
        txHourStr() {
            const hour = new Date(this.txRecord.timestamp / 1e6).getHours()
            if (hour < 10) {
                return '0' + hour
            }
            return hour.toString()
        },
        txMinuteStr() {
            const minute = new Date(this.txRecord.timestamp / 1e6).getMinutes()
            if (minute < 10) {
                return '0' + minute
            }
            return minute.toString()
        },
        txMonthStr() {
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
            const d = new Date(this.txRecord.timestamp / 1e6)
            return monthNames[d.getMonth()]
        },
        txDayStr() {
            const date = new Date(this.txRecord.timestamp / 1e6).getDate()
            if (date < 10) {
                return '0' + date
            }
            return date.toString()
        },
        txAmount() {
            return this.txRecord.amount / VEE_PRECISION
        },
        txFee() {
            return this.txRecord.fee / VEE_PRECISION
        },
        txBlock() {
            return this.txRecord.height
        },
        txId() {
            return this.txRecord.id
        },
        txAttachment() {
            var value = this.txRecord.attachment === void 0 ? '' : this.txRecord.attachment
            var bytes = base58.decode(value)
            try {
                return converters.byteArrayToString(bytes)
            } catch (e) {
                return ''
            }
        }
    },
    methods: {
        copyTxId() {
            this.$refs.tId.select()
            window.document.execCommand('copy')
        },
        hoverIco() {
            this.hovered = true
        },
        unhoverIco() {
            this.hovered = false
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
    border-bottom: 1px solid #EDEDF0;
    padding: 12px 0;
    .record-icon {
        margin-left: 20px;
        text-align: right;
    }
    .record-detail {
        .title {
            font-size: 17px;
            color: #181B3A;
            letter-spacing: 0;
        }
        .detail-1 {
            font-family: Roboto-Regular;
            font-size: 13px;
            color: #9091A3;
            letter-spacing: 0;
            padding-right: 0px;
        }
        .detail-2 {
            font-size: 13px;
            color: #696B8A;
            letter-spacing: 0;
            padding-left: 4px;
            padding-right: 10px;
            min-width: 145px;
        }
        .detail-3 {
            background: #E8E9ED;
            padding: 0px;
            padding-left: 1px;
        }
        .detail-4 {
            font-size: 12px;
            color: #9091A3;
            letter-spacing: 0;
            padding-left: 10px;
        }
        padding-left: 0px;
    }
    .record-amount-s {
        font-size: 17px;
        color: #F5354B;
        letter-spacing: 0;
        text-align: right;
        padding-right: 0px;
    }
    .record-amount-r {
        font-size: 17px;
        color: #23A28C;
        letter-spacing: 0;
        text-align: right;
        padding-right: 0px;
    }
    .record-action {
        padding-left: 0px;
        .more-btn {
            background: none;
            border: none;
            padding-left: 0px;
            padding-right: 10px;
        }
    }
    .copy-txid {
        position: absolute;
        left: -999999px;
    }
}

</style>
