<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="auto">
        <img src="../../../assets/imgs/icons/wallet/ic_leasing_cancel_in.svg"
             width="32px"
             height="32px">
      </b-col>
      <b-col class="record-detail"
             cols="auto">
        <b-row>
          <b-col class="title">{{ tokenId }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank"></b-col>
      <b-col cols="auto">
        <div>
          <span>{{ formatter(txAmount) }} </span>
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
          <b-dropdown-item @click="showModal">Get Token Info</b-dropdown-item>
          <b-dropdown-item @click="showIssueModal">Issue Token</b-dropdown-item>
          <b-dropdown-item @click="showModal">Burn Token</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <TokenInfoModal :token-id="tokenId"
                    :address="address"
                    :addresses="addresses">
    </TokenInfoModal>
    <IssueToken :address="address"
                :wallet-type="walletType"
                :addresses="addresses">
    </IssueToken>
  </b-container>
</template>

<script>
// import TxInfoModal from './TxInfoModal'
// import base58 from '@/libs/base58'
// import converters from '@/libs/converters'
// import { VSYS_PRECISION } from '@/constants'
// import crypto from '@/utils/crypto'
// import CancelLease from '../modals/CancelLease'
// import { PAYMENT_TX, LEASE_TX, CANCEL_LEASE_TX } from '../../../constants'
import browser from '../../../utils/browser'
import TokenInfoModal from './TokenInfoModal'
import IssueToken from './IssueToken'
export default {
    name: 'TokenRecord',
    components: { TokenInfoModal, IssueToken },
    data: function() {
        return {
            differenceHeight: 0,
            heightStatus: false,
            hovered: false,
            cancelTime: 0,
            showCancelDetails: false
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
                    txAmount: 0,
                    txAttachment: ''
                }
            }
        },
        address: {
            type: String,
            default: ''
        },
        isCanceled: {
            type: Boolean,
            default: false
        },
        walletType: {
            type: String,
            default: 'hot wallet'
        },
        addresses: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    computed: {
        txAddressShow() {
            if (this.txAddress) {
                const addrChars = this.txAddress.split('')
                addrChars.splice(6, 23, '******')
                return addrChars.join('')
            }
        },
        txAmount() {
            return 100
        },
        tokenId() {
            return this.address
        }
    },
    methods: {
        closeModal() {
            this.$refs.infoModal.hide()
        },
        hoverIco() {
            console.log('info' + this.address)
            console.log('tokenId' + this.tokenId)
            console.log('type' + this.walletType)
            this.hovered = true
        },
        unhoverIco() {
            this.hovered = false
        },
        formatter(num) {
            return browser.numberFormatter(num)
        },
        showModal() {
            this.$root.$emit('bv::show::modal', 'tokenInfoModal')
        },
        showIssueModal() {
            this.$root.$emit('bv::show::modal', 'issueTokenModal')
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
