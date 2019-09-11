<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="auto">
        <img v-if="txIcon==='sent'"
             src="@/assets/imgs/icons/wallet/ic_sent.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='received'"
             src="@/assets/imgs/icons/wallet/ic_received.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='leased in'"
             src="@/assets/imgs/icons/wallet/ic_leasing_reverse.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='leased out'"
             src="@/assets/imgs/icons/wallet/ic_leasing.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='leased out canceled'"
             src="@/assets/imgs/icons/wallet/ic_leasing_cancel.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='leased in canceled'"
             src="@/assets/imgs/icons/wallet/ic_leasing_cancel_in.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='register contract' && txStatus === 'Success'"
             src="@/assets/imgs/icons/wallet/ic_contract_signup.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='register contract' && txStatus !== 'Success'"
             src="@/assets/imgs/icons/wallet/ic_exec_fail.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='execute contract function' && txStatus === 'Success'"
             src="@/assets/imgs/icons/wallet/ic_exec_success.svg"
             width="32px"
             height="32px">
        <img v-else-if="txIcon==='execute contract function' && txStatus !== 'Success'"
             src="@/assets/imgs/icons/wallet/ic_exec_fail.svg"
             width="32px"
             height="32px">
      </b-col>
      <b-col class="record-detail"
             v-if="transType==='payment'"
             cols="auto">
        <b-row>
          <b-col class="title">{{ txTitle }}</b-col>
        </b-row>
        <b-row>
          <b-col class="detail-1"
                 cols="auto">{{ (txIcon === 'sent' || txIcon === 'leased out' || txIcon === 'leased out canceled') ? 'To' : 'From' }}:</b-col>
          <b-col class="detail-2">{{ (txIcon === 'sent' || txIcon === 'leased out' || txIcon === 'leased out canceled') ? txRecipientShow : txAddressShow }}</b-col>
          <b-col class="detail-3"
                 cols="auto"></b-col>
          <b-col class="detail-4">{{ txHourStr }}:{{ txMinuteStr }}, {{ txMonthStr }}  {{ txDayStr }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-detail"
             v-if="transType==='lease'"
             cols="auto">
        <b-row>
          <b-col v-if="txIcon === 'leased out'"
                 class="title">{{ txTitle }}<span v-if="leaseStatus === 'canceled'"
                                                  style="color:red"> (Cancelled)</span>
          </b-col>
          <b-col v-else
                 class="title">{{ txTitle }}
          </b-col>
        </b-row>
        <b-row>
          <b-col class="detail-1"
                 cols="auto">{{ (txIcon === 'leased out' || txIcon === 'leased out canceled') ? 'To' : 'From' }}:</b-col>
          <b-col class="detail-2">{{ (txIcon === 'leased out' || txIcon === 'leased out canceled') ? txRecipientShow : txAddressShow }}</b-col>
          <b-col class="detail-3"
                 cols="auto"></b-col>
          <b-col class="detail-4">{{ txHourStr }}:{{ txMinuteStr }}, {{ txMonthStr }}  {{ txDayStr }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank"></b-col>
      <b-col :class="'amount-' + txClass"
             cols="auto">
        <div>
          <span v-if="txIcon === 'sent' || txIcon === 'received'">{{ txIcon === 'sent' ? '-' : '+' }}</span>
          <span v-if="txIcon === 'sent' || txIcon === 'received' || txIcon === 'leased out' || txIcon === 'leased out canceled' || txIcon==='leased in' || txIcon==='leased in canceled'">{{ formatter(txAmount) }} VSYS</span>
        </div>
        <div class="tx-fee"
             v-if="(txIcon === 'sent' || txIcon === 'leased out canceled' || txIcon === 'leased out' || txIcon === 'register contract' || txIcon === 'execute contract function') && feeFlag">
          <span v-if="(!txFee.isEqualTo(0))"> Tx Fee: - {{ formatter(txFee) }} VSYS </span>
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
                src="@/assets/imgs/icons/wallet/ic_more_hover.svg">
              <img
                v-if="!hovered"
                src="@/assets/imgs/icons/wallet/ic_more.svg">
            </div>
          </template>
          <b-dropdown-item @click="showModal">TX info</b-dropdown-item>
          <b-dropdown-item v-if="transType === 'lease' && txIcon==='leased out' && leaseStatus === 'active'"
                           @click="cancelLeasing">Cancel Leasing</b-dropdown-item>
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
                 :height-status="heightStatus"
                 :tx-type="txType"
                 :difference-height="differenceHeight"
                 :tx-address="txAddress"
                 :tx-time="txRecord.timestamp"
                 :tx-fee="txFee"
                 :tx-amount="txAmount"
                 :tx-block="txBlock"
                 :tx-status="txStatus"
                 :contract-type="contractType"
                 :token-id="tokenId"
                 :tx-attachment="txAttachment"
                 :trans-type="transType"
                 :self-send="selfSend"
                 :tx-recipient="txRecipient"
                 :v-if="transType==='payment'"></TxInfoModal>
    <TxInfoModal :modal-id="txRecord.id"
                 :tx-fee="txFee"
                 :difference-height="differenceHeight"
                 :height-status="heightStatus"
                 :tx-time="cancelTime"
                 :tx-icon="'leased out canceled'"
                 :trans-type="'cancelLease'"
                 v-if="transType==='lease'"
                 :tx-amount="txAmount"
                 :tx-address="txAddress"
                 :tx-recipient="txRecipient"></TxInfoModal>
    <CancelLease :modal-id="txRecord.id"
                 :wallet-type="walletType"
                 :address="txAddress"
                 :recipient="txRecipient"
                 :amount="txAmount"
                 :from-address="address"
                 :fee="txFee"
                 :cold-pub-key="coldPubKey"
                 :tx-timestamp="txRecord.timestamp"
                 :address-index="addressIndex"
                 @show-details="showDetails"
                 v-if="transType==='lease'">
    </CancelLease>
  </b-container>
</template>

<script>
import TxInfoModal from './TxInfoModal'
import transaction from '@/utils/transaction'
import base58 from '@/libs/base58'
import converters from '@/libs/converters'
import crypto from '@/utils/crypto'
import CancelLease from '../modals/CancelLease'
import { NODE_IP, PAYMENT_TX, VSYS_PRECISION, LEASE_TX, CANCEL_LEASE_TX, CONTRACT_CREATE_TX, CONTRACT_EXEC_TX } from '@/constants'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'

export default {
    name: 'Record',
    components: { CancelLease, TxInfoModal },
    data: function() {
        return {
            differenceHeight: 0,
            heightStatus: false,
            hovered: false,
            cancelTime: 0,
            showCancelDetails: false,
            contractType: '',
            tokenId: ''
        }
    },
    props: {
        feeFlag: {
            type: Boolean,
            default: false
        },
        txRecord: {
            type: Object,
            default: function() {
                return {
                    txType: '',
                    txAddress: '',
                    txTime: '',
                    txAmount: 0,
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
        transType: {
            type: String,
            default: 'payment',
            require: true
        },
        coldPubKey: {
            type: String,
            default: ''
        },
        addressIndex: {
            type: Number,
            default: 0
        },
        leaseStatus: {
            type: String,
            default: 'active'
        }
    },
    computed: {
        selfSend() {
            if (this.txRecord.recipient === this.address && this.txRecord.SelfSend === true) {
                return 'selfSend'
            } else {
                return ''
            }
        },
        txType() {
            if (this.txRecord['type'] === PAYMENT_TX) {
                if (this.txRecord.recipient === this.address && this.txRecord.SelfSend === undefined) {
                    return 'Received'
                } else {
                    return 'Sent'
                }
            } else if (this.txRecord['type'] === LEASE_TX) {
                if (this.txRecord.recipient === this.address) {
                    return 'Leased In'
                } else {
                    return 'Leased Out'
                }
            } else if (this.txRecord['type'] === CANCEL_LEASE_TX) {
                if (this.txRecord.lease.recipient === this.address) {
                    return 'Leased In Canceled'
                } else {
                    return 'Leased Out Canceled'
                }
            } else if (this.txRecord['type'] === CONTRACT_CREATE_TX) {
                return 'Register Contract'
            } else if (this.txRecord['type'] === CONTRACT_EXEC_TX) {
                return 'Execute Contract Function'
            } else {
                return 'Received'
            }
        },
        txIcon() {
            return this.txType.toString().toLowerCase()
        },
        txClass() {
            let txName = this.txIcon.replace(/\s+/g, '')
            if (txName === 'executecontractfunction' && this.txRecord.status !== 'Success') {
                return txName + 'failed'
            } else {
                return txName
            }
        },
        txAddress() {
            return this.txRecord.proofs === undefined ? this.address : crypto.buildRawAddress(base58.decode(this.txRecord.proofs[0].publicKey))
        },
        txRecipient() {
            if (this.txType === 'Leased Out Canceled' || this.txType === 'Leased In Canceled') {
                return this.txRecord.lease.recipient
            } else return this.txRecord.recipient === undefined ? '' : this.txRecord.recipient
        },
        txAddressShow() {
            if (this.txAddress) {
                const addrChars = this.txAddress.split('')
                addrChars.splice(6, 23, '******')
                return addrChars.join('')
            }
        },
        txRecipientShow() {
            if (this.txRecipient) {
                const addrChars = this.txRecipient.split('')
                addrChars.splice(6, 23, '******')
                return addrChars.join('')
            }
        },
        txIdShow() {
            if (this.txId) {
                const idChars = this.txId.split('')
                idChars.splice(6, 32, '******')
                return idChars.join('')
            }
        },
        txTitle() {
            if (this.txType === 'Leased Out') {
                return 'Start Leasing'
            } else if (this.txType === 'Leased In') {
                return 'Incoming Leasing'
            } else if (this.txType === 'Leased Out Canceled') {
                return 'Canceled Out Leasing'
            } else if (this.txType === 'Leased In Canceled') {
                return 'Canceled Incoming Leasing'
            } else if (this.txType === 'Sent') {
                return 'Sent'
            } else if (this.txType === 'Received') {
                return 'Received'
            } else if (this.txType === 'Execute Contract Function') {
                return 'Execute Contract Function'
            } else if (this.txType === 'Register Contract') {
                return 'Register Contract'
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
            if (this.txRecord.lease) {
                return BigNumber(this.txRecord.lease.amount).dividedBy(VSYS_PRECISION)
            }
            return BigNumber(this.txRecord.amount).dividedBy(VSYS_PRECISION)
        },
        txFee() {
            var sender = this.txRecord.proofs === undefined ? this.address : crypto.buildRawAddress(base58.decode(this.txRecord.proofs[0].publicKey))
            if (this.txTitle === 'Execute Contract Function') {
                if (this.address !== sender) {
                    return BigNumber(0)
                }
            }
            return BigNumber(this.txRecord.fee).dividedBy(VSYS_PRECISION)
        },
        txBlock() {
            return this.txRecord.height
        },
        txStatus() {
            return this.txRecord.status
        },
        txId() {
            return this.txRecord.id
        },
        txAttachment() {
            let value = this.txRecord.attachment === void 0 ? '' : this.txRecord.attachment
            let bytes = base58.decode(value)
            try {
                value = converters.byteArrayToString(bytes)
            } catch (e) {
                value = ''
            }
            return this.txRecord.description === void 0 ? value : this.txRecord.description
        }
    },
    methods: {
        getLastHeight() {
            let oldHeight = 0
            try {
                oldHeight = JSON.parse(window.localStorage.getItem('globalHeight'))
            } catch (e) {
            }
            return oldHeight
        },
        getContractType() {
            const contractUrl = NODE_IP + '/contract/info/' + this.txRecord.contractId
            this.$http.get(contractUrl).then(response => {
                this.contractType = response.body.type
                this.tokenId = transaction.contractIDToTokenID(response.body.contractId)
            }, respError => {
                this.contractType = 'Failed to get contract type'
                this.tokenId = 'Failed to get token id'
            })
        },
        getHeightStatus: function() {
            let oldHeightStatus = false
            try {
                oldHeightStatus = JSON.parse(window.localStorage.getItem('heightStatus'))
            } catch (e) {
            }
            return oldHeightStatus
        },
        copyTxId() {
            this.$refs.tId.select()
            window.document.execCommand('copy')
        },
        hoverIco() {
            this.hovered = true
        },
        unhoverIco() {
            this.hovered = false
        },
        showModal() {
            if (this.txType === 'Register Contract') {
                this.getContractType()
            }
            this.differenceHeight = this.getLastHeight() - this.txRecord.height
            this.heightStatus = this.getHeightStatus()
            this.$root.$emit('bv::show::modal', 'txInfoModal_' + this.transType + this.txRecord.id + this.selfSend)
        },
        cancelLeasing() {
            this.$root.$emit('bv::show::modal', 'cancelLeaseModal_' + this.txRecord.id)
        },
        showDetails(cancelTime) {
            this.cancelTime = cancelTime
            this.showCancelDetails = true
            this.$root.$emit('bv::show::modal', 'txInfoModal_cancelLease' + this.txId)
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
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
    border-left: 2px solid white;
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
    .amount-sent {
        font-size: 17px;
        color: #F5354B;
        letter-spacing: 0;
        text-align: right;
        padding-right: 0px;
    }
    .amount-received {
        font-size: 17px;
        color: #23A28C;
        letter-spacing: 0;
        text-align: right;
        padding-right: 0px;
    }
    .amount-leasedout {
      font-size: 17px;
      color: #73CC5A;
      letter-spacing: 0;
      text-align: right;
      padding-right: 0px;
    }
    .amount-leasedin {
      font-size: 17px;
      color: #86BEF7;
      letter-spacing: 0;
      text-align: right;
      padding-right: 0px;
    }
    .amount-leasedoutcanceled {
      font-size: 17px;
      color: #FF7A8A;
      letter-spacing: 0;
      text-align: right;
      padding-right: 0px;
    }
    .amount-leasedincanceled {
      font-size: 17px;
      color: #FFD192;
      letter-spacing: 0;
      text-align: right;
      padding-right: 0px;
    }
    .amount-createcontract {
      font-size: 17px;
      color: #F5354B;
      letter-spacing: 0;
      text-align: right;
      padding-right: 0px;
}
    .amount-executecontractfunction {
      font-size: 17px;
      color: #73CC5A;
      letter-spacing: 0;
      text-align: right;
      padding-right: 0px;
}
    .amount-executecontractfunctionfailed {
        font-size: 17px;
        color: #F5354B;
        letter-spacing: 0;
        text-align: right;
        padding-right: 0px;
}
    .amount-registercontract {
      font-size: 17px;
      color: #ff8737;
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
.record-unit:hover, .record-unit:active {
    background-color: #f8f9fa;
    border-left: 2px solid #1f5af6;
}
.tx-fee {
    font-size: 14px;
}

</style>
