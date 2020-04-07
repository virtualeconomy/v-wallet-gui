<template>
  <b-modal :id="'txInfoModal_' + transType + modalId + selfSend"
           ref="infoModal"
           lazy
           centered
           hide-header
           hide-footer>
    <router-view v-if="isRouterAlive"></router-view>
    <div class="tx-modal">
      <button
        class="close btn-close"
        @click="closeModal">
        <img src="@/assets/imgs/icons/operate/ic_close.svg">
      </button>
      <div class="tx-title">
        <div class="tx-icon">
          <img v-if="txIcon==='sent'"
               src="@/assets/imgs/icons/wallet/ic_sent.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='received'"
               src="@/assets/imgs/icons/wallet/ic_received.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased in'"
               src="@/assets/imgs/icons/wallet/ic_leasing_reverse.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased out'"
               src="@/assets/imgs/icons/wallet/ic_leasing.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased out canceled'"
               src="@/assets/imgs/icons/wallet/ic_leasing_cancel.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='leased in canceled'"
               src="@/assets/imgs/icons/wallet/ic_leasing_cancel_in.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='register contract' && txStatus === 'Success'"
               src="@/assets/imgs/icons/wallet/ic_contract_signup.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='register contract' && txStatus !== 'Success'"
               src="@/assets/imgs/icons/wallet/ic_exec_fail.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='execute contract function' && txStatus === 'Success'"
               src="@/assets/imgs/icons/wallet/ic_exec_success.svg"
               width="60px"
               height="60px">
          <img v-else-if="txIcon==='execute contract function' && txStatus !== 'Success'"
               src="@/assets/imgs/icons/wallet/ic_exec_fail.svg"
               width="60px"
               height="60px">
        </div>
        <div v-if="txIcon!=='register contract'&& txIcon!=='execute contract function'"
             :class="txClass + '-amount'">{{ txIcon === 'sent' ? '-' : txIcon === 'received' ? '+' : '' }}{{ formatter(txAmount) }} {{ officialName }}</div>
      </div>
      <div class="tx-address"
           v-if="displayAddress!==''">
        <label>From</label>
        <span class="addrPos">{{ displayAddress }}</span>
        <div>
          <b-btn
            id="address-cpy"
            class="btn-copy"
            v-b-popover.click.topright="'Copied!'"
            @click="copyText('address-cpy', 'txAddressId')"
            variant="link">
            <img src="@/assets/imgs/icons/operate/ic_copy.svg">
          </b-btn>
        </div>
      </div>
      <div class="tx-address"
           v-if="displayRecipient!==''">
        <label>To</label>
        <span class="addrPos">{{ displayRecipient }}</span>
        <div>
          <b-btn
            id="recipient-cpy"
            class="btn-copy"
            v-b-popover.click.topright="'Copied!'"
            @click="copyText('recipient-cpy', 'txRecipientId')"
            variant="link">
            <img src="@/assets/imgs/icons/operate/ic_copy.svg">
          </b-btn>
        </div>
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
           v-if="txIcon === 'sent' || txIcon === 'received' || txIcon === 'register contract' || txIcon === 'execute contract function'">
        <label>Description</label>
        <span>{{ txAttachment }}</span>
        <span class="tx-attachment-whole">{{ txAttachment }}</span>
      </div>
      <div class="tx-id">
        <label>ID</label>
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
        <span v-if="heightGap > 30">{{ heightGap }}(Confirmed)</span>
        <span v-else-if="heightGap <= 30 && heightGap >= 0">{{ heightGap }}(Unconfirmed)</span>
      </div>
      <div v-if="txStatus === 'Success'"
           class="tx-success">
        <label>Status</label>
        <span>{{ txStatus }}</span>
      </div>
      <div v-else
           class="tx-failed">
        <label>Status</label>
        <span>{{ txStatus }}</span>
      </div>
      <div v-if="txType==='Register Contract' && txStatus === 'Success' && (contractType === 'TokenContractWithSplit' || contractType === 'TokenContract')"
           class="tx-status">
        <label>Exists in watching list</label>
        <span v-if="isTokenExisted()">Yes</span>
        <span v-else>No (<b-button class="add-button"
                                   @click="addModal">Add to list</b-button>)</span>
      </div>
    </div>
    <b-row>
      <b-col class="col-lef">
        <b-button
          class="btn-back"
          block
          variant="light"
          size="lg"
          @click="copyTxId">Copy TX ID
        </b-button>
      </b-col>
      <b-col class="col-lef">
        <b-button
          block
          class="btn-back"
          variant="light"
          size="lg"
          @click="txInfo">View on Explorer
        </b-button>
      </b-col>
    </b-row>
    <textarea class="copy-txid"
              v-model="modalId"
              ref="tId"
              readonly></textarea>
    <textarea class="copy-txid"
              v-model="txAddress"
              ref="txAddressId"
              readonly></textarea>
    <textarea class="copy-txid"
              v-model="txRecipient"
              ref="txRecipientId"
              readonly></textarea>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import { TX_FEE } from '@/js-v-sdk/src/constants'
import { TX_URL } from '@/constants'
import { NETWORK_BYTE, EXPLORER } from '@/network'
import { mapActions, mapState } from 'vuex'
export default {
    name: 'TxInfoModal',
    provide() {
        return {
            reload: this.reload()
        }
    },
    props: {
        officialName: {
            type: String,
            default: 'VSYS'
        },
        heightGap: {
            type: Number,
            default: 0
        },
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
        txRecipient: {
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
        },
        contractType: {
            type: String,
            default: ''
        },
        tokenId: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            isRouterAlive: true,
            networkType: String.fromCharCode(NETWORK_BYTE)
        }
    },
    computed: {
        ...mapState({
            heightStatus: 'heightStatus'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
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
            let alias = null
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
            }
            if (this.isMobile() && this.txAddress.length > 24) {
                return alias && alias[this.txAddress] != null ? alias[this.txAddress] + ' (' + this.txAddress.substring(0, 23) + '...' + ')' : this.txAddress.substring(0, 23) + '...'
            } else {
                return alias && alias[this.txAddress] != null ? alias[this.txAddress] + ' (' + this.txAddress + ')' : this.txAddress
            }
        },
        displayRecipient() {
            let alias = null
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
            }
            if (this.isMobile() && this.txRecipient.length > 24) {
                return alias && alias[this.txRecipient] != null ? alias[this.txRecipient] + ' (' + this.txRecipient.substring(0, 23) + '...' + ')' : this.txRecipient.substring(0, 23) + '...'
            } else {
                return alias && alias[this.txRecipient] != null ? alias[this.txRecipient] + ' (' + this.txRecipient + ')' : this.txRecipient
            }
        }
    },
    methods: {
        ...mapActions(['changeAddTokenStatus']),
        reload() {
            this.isRouterAlive = false
            this.$nextTick(() => (this.isRouterAlive = true))
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        isMobile() {
            return browser.isMobile()
        },
        addModal() {
            let tokens = {}
            let tmpUserInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            if (tmpUserInfo && tmpUserInfo.tokens) {
                tokens = JSON.parse(tmpUserInfo.tokens)
            }
            if (this.tokenId) {
                Vue.set(tokens, this.tokenId, this.txAddress)
                this.setUsrLocalStorage('tokens', JSON.stringify(tokens))
            }
            this.changeAddTokenStatus()
            this.reload()
        },
        isTokenExisted() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            let tokens = {}
            if (userInfo && userInfo.tokens) {
                tokens = JSON.parse(userInfo.tokens)
            }
            return this.tokenId in tokens
        },
        txInfo() {
            window.open(EXPLORER + TX_URL + this.modalId)
        },
        closeModal() {
            this.$refs.infoModal.hide()
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        copyTxId() {
            this.$refs.tId.select()
            window.document.execCommand('copy')
        },
        copyText(buttonId, refName) {
            this.$refs[refName].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
            }, 400)
        }
    }
}
</script>

<style scoped lang="less">
 .tx-modal {
    padding: 40px 24px;
    padding-top: 0;
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
            color: #9091a3;
            letter-spacing: 0;
        }
    }
   .tx-success {
       text-align: left;
       border-bottom: 1px solid #E8E9ED;
       height: 48px;
       padding-top: 15px;
       span {
            float:right;
            font-size: 13px;
            letter-spacing: 0px;
            text-align: right;
            background: #DBF6D4;
            color:#56A142;
            padding: 5px 12px;
            height: 26px;
      }
      label {
            font-size: 15px;
            color: #9091a3;
            letter-spacing: 0;
      }
    }
 .tx-failed {
     text-align: left;
     border-bottom: 1px solid #E8E9ED;
     height: 48px;
     padding-top: 15px;
 span {
     float:right;
     font-size: 13px;
     background: #FFE6E8;
     color:#F5354B;
     letter-spacing: 0;
     text-align: right;
     padding: 5px 12px;
     height: 26px;
 }
 label {
     font-size: 15px;
     color: #9091a3;
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
            white-space:nowrap;
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
        white-space: pre-wrap;
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
}
 .btn-back {
     background: #FAFAFA;
     border: 1px solid #E8E9ED;
     border-radius: 4px;
     font-size: 14px;
     color: #EB7D34;
     letter-spacing: 0;
     text-align: center;
     margin-top: -20px;
 }
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.Success {
    color: #73CC5A;
}
.copy-txid {
    position: absolute;
    opacity: 0;
}
.add-button {
    background-color: transparent;
    opacity: 1;
    border: none;
    outline: none;
    font-size: 13px;
    color: #FF8837;
    letter-spacing: 0;
    text-align: right;
    line-height: 15px;
    padding-left:2px;
    padding-right: 2px;
    padding-bottom: 8px;
 }
.btn-copy {
    cursor: pointer;
    float: right;
    margin-top: -40px;
    margin-right: -10px;
}
.addrPos {
    position: relative;
    margin-right: 30px;
}
</style>
