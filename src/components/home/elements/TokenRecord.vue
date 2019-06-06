<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="auto">
        <img src="@/assets/imgs/icons/wallet/ic_token2.svg"
             width="32px"
             height="32px">
      </b-col>
      <b-col class="record-detail"
             cols="auto">
        <b-row>
          <b-col class="title">{{ tokenRecord }}</b-col>
        </b-row>
      </b-col>
      <b-col class="record-blank"></b-col>
      <b-col class="token-balance"
             cols="auto">
        <div>
          <span>{{ formatter(tokenBalance) }} </span>
        </div>
      </b-col>
      <button class="btn-sendToken"
              @click="sendToken">
        <b>Send</b>
      </button>
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
          <b-dropdown-item @click="showModal">Get Token Info</b-dropdown-item>
          <b-dropdown-item v-if="enableStatus"
                           @click="supersede">Supersede</b-dropdown-item>
          <b-dropdown-item @click="issueToken">Issue Token</b-dropdown-item>
          <b-dropdown-item @click="burnToken">Destroy Token</b-dropdown-item>
          <b-dropdown-item v-if="enableStatus"
                           @click="splitToken">Split Token</b-dropdown-item>
          <b-dropdown-item @click="removeToken">Remove Token</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <TokenInfoModal :token-id="tokenId"
                    :issuer="issuer"
                    :unity="unity"
                    :maker="maker"
                    :contract-id="contractId"
                    :max-supply="maxSupply"
                    :current-supply="formatter(currentSupply)"
                    :token-description="tokenDescription">
    </TokenInfoModal>
    <IssueToken :token-id="tokenId"
                :issuer="issuer"
                :address="address"
                :wallet-type="walletType"
                :addresses="addresses"
                :cold-addresses="coldAddresses"
                :token-balance="tokenBalance"
                :balance="balances[address]"
                :max-supply="maxSupply"
                :current-supply="currentSupply"
                :token-unity="unity"
                @updateBalance="updateBalance">
    </IssueToken>
    <Supersede :token-id="tokenId"
               :maker="maker"
               :address="address"
               :wallet-type="walletType"
               :addresses="addresses"
               :cold-addresses="coldAddresses"
               :token-balance="tokenBalance"
               :balance="balances[address]"
               @updateBalance="updateBalance">
    </Supersede>
    <SplitToken :token-id="tokenId"
                :maker="maker"
                :address="address"
                :wallet-type="walletType"
                :addresses="addresses"
                :cold-addresses="coldAddresses"
                :token-balance="tokenBalance"
                :balance="balances[address]"
                :token-unity="unity"
                :max-supply="maxSupply"
                @updateBalance="updateBalance">
    </SplitToken>
    <SendToken :token-id="tokenId"
               :token-balances="tokenBalances"
               :balances="balances"
               :cold-addresses="coldAddresses"
               :addresses="addresses"
               :selected-address="address"
               :wallet-type="walletType"
               :function-index="functionIndex"
               :token-unity="unity"
               @endSendSignal="endSendSignal">
    </SendToken>
    <BurnToken :token-id="tokenId"
               :issuer="issuer"
               :address="address"
               :wallet-type="walletType"
               :addresses="addresses"
               :cold-addresses="coldAddresses"
               :token-balance="tokenBalance"
               :balance="balances[address]"
               :token-unity="unity"
               @updateBalance="updateBalance"></BurnToken>
  </b-container>
</template>

<script>
import transaction from '@/utils/transaction'
import base58 from '@/libs/base58'
import converters from '@/libs/converters'
import TokenInfoModal from './TokenInfoModal'
import SendToken from './SendToken'
import IssueToken from './IssueToken'
import BigNumber from 'bignumber.js'
import BurnToken from './BurnToken'
import Supersede from './Supersede'
import SplitToken from './SplitToken'
import { NODE_IP, SEND_FUNCIDX, SEND_FUNCIDX_SPLIT } from '@/constants.js'
import { CONTRACT_DESCRIPTOR, CONTRACT_WITH_SPLIT_DESCRIPTOR } from '@/contract'
import Vue from 'vue'
import browser from '@/utils/browser'
export default {
    name: 'TokenRecord',
    components: { TokenInfoModal, SendToken, IssueToken, BurnToken, Supersede, SplitToken },
    data: function() {
        return {
            tokenBalance: BigNumber(0),
            unity: BigNumber(1),
            tokenBalances: {},
            tokens: {},
            hovered: false,
            cancelTime: 0,
            showCancelDetails: false,
            removeFlag: false,
            issuer: '',
            maker: '',
            functionIndex: SEND_FUNCIDX,
            contractId: ''
        }
    },
    props: {
        address: {
            type: String,
            default: ''
        },
        coldAddresses: {
            type: Object,
            default: function() {},
            require: true
        },
        addresses: {
            type: Object,
            default: function() {},
            require: true
        },
        walletType: {
            type: String,
            default: '',
            require: true
        },
        selectedAddress: {
            type: String,
            default: this ? this.defaultAddress : undefined,
            require: true
        },
        tokenRecord: {
            type: String,
            default: function() {},
            require: true
        },
        tokenId: {
            type: String,
            default: '',
            require: true
        },
        balances: {
            type: Object,
            default: function() {
            },
            require: true
        },
        activedTab: {
            type: String,
            default: 'token'
        }
    },
    watch: {
        address(newAddr, oldAddr) {
            if (newAddr === '' || this.activedTab !== 'token') {
                return
            }
            this.updateBalance()
        },
        activedTab(newTab, oldTab) {
            if (newTab === 'token') {
                this.updateBalance()
            }
        }
    },
    created() {
        this.getTokenInfo()
        this.updateBalance()
    },

    computed: {
        enableStatus() {
            return this.$store.state.enableStatus
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.seedaddress))
        },
        seedaddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        maxSupply() {
            if (this.tokens) {
                return BigNumber(this.tokens.max).dividedBy(this.unity)
            } else return ''
        },
        currentSupply() {
            if (this.tokens) {
                return BigNumber(this.tokens.total).dividedBy(this.unity)
            } else return ''
        },
        tokenDescription() {
            if (this.tokens.description && this.tokens.description !== undefined) {
                let bytes = base58.decode(this.tokens.description)
                try {
                    return converters.byteArrayToString(bytes)
                } catch (e) {
                    return ''
                }
            }
        }
    },
    methods: {
        setUsrLocalStorage(fieldname, value) {
            Vue.set(this.userInfo, fieldname, value)
            window.localStorage.setItem(this.seedaddress, JSON.stringify(this.userInfo))
        },
        closeModal() {
            this.$refs.infoModal.hide()
        },
        hoverIco() {
            this.hovered = true
        },
        unhoverIco() {
            this.hovered = false
        },
        formatter(num) {
            return browser.bigNumberFormatter(num)
        },
        updateBalance() {
            const url = NODE_IP + '/contract/balance/' + this.address + '/' + this.tokenId
            this.$http.get(url).then(response => {
                this.tokenBalance = BigNumber(response.body.balance).dividedBy(this.unity)
            }, respError => {
            })
        },
        getTokenBalances() {
            for (const addr in this.addresses) {
                Vue.set(this.tokenBalances, addr, BigNumber(0))
                let turl = NODE_IP + '/contract/balance/' + addr + '/' + this.tokenId
                this.$http.get(turl).then(response => {
                    let value = BigNumber(response.body.balance).dividedBy(this.unity)
                    Vue.set(this.tokenBalances, addr, value)
                }, respError => {
                })
            }
            for (const addr in this.coldAddresses) {
                Vue.set(this.tokenBalances, addr, BigNumber(0))
                let turl = NODE_IP + '/contract/balance/' + addr + '/' + this.tokenId
                this.$http.get(turl).then(response => {
                    let value = BigNumber(response.body.balance).dividedBy(this.unity)
                    Vue.set(this.tokenBalances, addr, value)
                }, respError => {
                })
            }
        },
        getTokenInfo() {
            var contractId = transaction.tokenIDToContractID(this.tokenId)
            const tokenUrl = NODE_IP + '/contract/tokenInfo/' + this.tokenId
            this.$http.get(tokenUrl).then(response => {
                this.tokens = response.body
                this.unity = BigNumber(this.tokens.unity)
            }, respError => {
            })

            const url = NODE_IP + '/contract/info/' + contractId
            this.$http.get(url).then(response => {
                this.issuer = response.body.info[0].data
                this.maker = response.body.info[1].data
                this.contractId = response.body.contractId
            }, respError => {
                this.issuer = 'Failed to get issuer'
            })

            const url2 = NODE_IP + '/contract/content/' + contractId
            this.$http.get(url2).then(response => {
                var tokentype = response.body.textual.descriptors
                this.functionIndex = -9
                if (tokentype === CONTRACT_DESCRIPTOR) {
                    this.functionIndex = SEND_FUNCIDX
                } else if (tokentype === CONTRACT_WITH_SPLIT_DESCRIPTOR) {
                    this.functionIndex = SEND_FUNCIDX_SPLIT
                } else {
                    this.functionIndex = -999
                }
            }, respError => {
                console.log('failed to load tokentype ')
            })
            this.updateBalance()
        },
        showModal() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'tokenInfoModal_' + this.tokenId)
        },
        sendToken() {
            this.getTokenBalances()
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'sendTokenModal_' + this.tokenId)
        },
        supersede() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'supersedeModal_' + this.tokenId)
        },
        splitToken() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'splitTokenModal_' + this.tokenId)
        },
        issueToken() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'issueTokenModal_' + this.tokenId)
        },
        burnToken() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'burnTokenModal_' + this.tokenId)
        },
        removeToken() {
            var isRemove = confirm('Are you sure to remove this token?')
            if (isRemove) {
                var user = JSON.parse(window.localStorage.getItem(this.seedaddress))
                var arr = JSON.parse(user.tokens)
                Vue.delete(arr, this.tokenId)
                this.setUsrLocalStorage('tokens', JSON.stringify(arr))
                this.removeFlag = true
                this.$emit('removeFlag', this.removeFlag)
                this.removeFlag = false
            }
        },
        endSendSignal() {
            this.$emit('endSendSignal')
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
    .token-balance {
        padding-right: 40px;
    }
    .btn-sendToken {
        border-color: #FF8837;
        color: #FF8837;
        font-size: 17px;
        font-weight:lighter;
        background:#fafafa;
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
        padding-left: 20px;
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
