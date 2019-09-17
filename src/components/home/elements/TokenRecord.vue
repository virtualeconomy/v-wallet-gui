<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="auto">
        <img v-if="isCertified"
             :src="officialTokenSvg"
             width="32px"
             height="32px">
        <img v-else
             src="@/assets/imgs/icons/wallet/ic_token2.svg"
             width="32px"
             height="32px">
      </b-col>
      <b-col class="record-detail"
             cols="auto">
        <b-row>
          <b-col class="title">{{ isCertified ? officialName : tokenId }}</b-col>
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
          <b-dropdown-item v-if="!isCertified"
                           @click="verify">Verification</b-dropdown-item>
          <b-dropdown-item v-if="tokenManagementStatus || address === tokenMaker"
                           @click="supersede">Supersede</b-dropdown-item>
          <b-dropdown-item v-if="tokenManagementStatus || address === tokenMaker"
                           @click="issueToken">Issue Token</b-dropdown-item>
          <b-dropdown-item v-if="tokenManagementStatus || address === tokenMaker"
                           @click="burnToken">Destroy Token</b-dropdown-item>
          <b-dropdown-item v-if="tokenSplitStatus"
                           @click="splitToken">Split Token</b-dropdown-item>
          <b-dropdown-item v-if="tokenManagementStatus && showUnsupportedFunction"
                           @click="depositToken">Deposit to Contract </b-dropdown-item>
          <b-dropdown-item v-if="tokenManagementStatus && showUnsupportedFunction"
                           @click="withdrawToken">Withdraw from Contract</b-dropdown-item>
          <b-dropdown-item @click="removeToken">Hide Token</b-dropdown-item>
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
    <IssueOrDestroyToken :token-id="tokenId"
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
                         :function-name="functionName"
                         @updateTokenBalance="updateTokenBalance">
    </IssueOrDestroyToken>
    <WithdrawToken :token-id="tokenId"
                   :address="address"
                   :wallet-type="walletType"
                   :addresses="addresses"
                   :cold-addresses="coldAddresses"
                   :token-balance="tokenBalance"
                   :balance="balances[address]"
                   :token-unity="unity"
                   :is-split="isSplit"
                   @updateTokenBalance="updateTokenBalance">
    </WithdrawToken>
    <DepositToken :token-id="tokenId"
                  :address="address"
                  :wallet-type="walletType"
                  :addresses="addresses"
                  :cold-addresses="coldAddresses"
                  :token-balance="tokenBalance"
                  :balance="balances[address]"
                  :token-unity="unity"
                  :is-split="isSplit"
                  @updateTokenBalance="updateTokenBalance">
    </DepositToken>
    <Supersede :issuer="issuer"
               :token-id="tokenId"
               :maker="maker"
               :address="address"
               :wallet-type="walletType"
               :addresses="addresses"
               :cold-addresses="coldAddresses"
               :balance="balances[address]"
               @updateTokenBalance="updateTokenBalance">
    </Supersede>
    <SplitToken :token-id="tokenId"
                :issuer="issuer"
                :address="address"
                :wallet-type="walletType"
                :addresses="addresses"
                :cold-addresses="coldAddresses"
                :token-balance="tokenBalance"
                :balance="balances[address]"
                :token-unity="unity"
                :max-supply="maxSupply"
                :is-split="isSplit"
                @updateUnity="updateUnity">
    </SplitToken>
    <SendToken :token-id="tokenId"
               :token-balances="tokenBalances"
               :balances="balances"
               :cold-addresses="coldAddresses"
               :addresses="addresses"
               :selected-address="address"
               :wallet-type="walletType"
               :is-split="isSplit"
               :token-unity="unity"
               @updateTokenBalance="updateTokenBalance">
    </SendToken>
  </b-container>
</template>

<script>
import transaction from '@/utils/transaction'
import base58 from '@/libs/base58'
import converters from '@/libs/converters'
import TokenInfoModal from './TokenInfoModal'
import SendToken from './SendToken'
import WithdrawToken from './WithdrawToken'
import BigNumber from 'bignumber.js'
import IssueOrDestroyToken from './IssueOrDestroyToken'
import Supersede from './Supersede'
import SplitToken from './SplitToken'
import DepositToken from './DepositToken'
import { NODE_IP, SHOW_UNSUPPORTED_FUNCTION } from '@/constants.js'
import { CONTRACT_WITH_SPLIT_DESCRIPTOR } from '@/contract'
import Vue from 'vue'
import browser from '@/utils/browser'
import certify from '@/utils/certify'
import { mapState } from 'vuex'
import JSONBigNumber from 'json-bignumber'
export default {
    name: 'TokenRecord',
    components: { TokenInfoModal, SendToken, Supersede, SplitToken, WithdrawToken, DepositToken, IssueOrDestroyToken },
    data: function() {
        return {
            isSplit: false,
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
            functionName: '',
            contractId: '',
            showUnsupportedFunction: SHOW_UNSUPPORTED_FUNCTION
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
        tokenMaker: {
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
        activeTab: {
            type: String,
            default: 'token'
        }
    },
    watch: {
        address(newAddr, oldAddr) {
            if (newAddr === '' || this.activeTab !== 'token') {
                return
            }
            this.updateTokenBalance()
        },
        activeTab(newTab, oldTab) {
            if (newTab === 'token') {
                this.updateTokenBalance()
            }
        }
    },
    created() {
        this.getTokenInfo()
        this.updateTokenBalance()
    },

    computed: {
        ...mapState({
            tokenManagementStatus: 'tokenManagementStatus',
            tokenSplitStatus: 'tokenSplitStatus'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        seedAddress() {
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
        isCertified() {
            return certify.isCertified(this.tokenId)
        },
        officialName() {
            return certify.officialName(this.tokenId)
        },
        officialTokenSvg() {
            try {
                return require('@/assets/imgs/icons/token/' + this.officialName + '.svg')
            } catch (err) {
                return require('@/assets/imgs/icons/wallet/ic_token1.svg')
            }
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
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
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
        updateTokenBalance() {
            const url = NODE_IP + '/contract/balance/' + this.address + '/' + this.tokenId
            this.$http.get(url).then(response => {
                let tempResponse = JSONBigNumber.parse(response.bodyText)
                this.tokenBalance = BigNumber(tempResponse.balance).dividedBy(tempResponse.unity)
            }, respError => {
            })
        },
        updateUnity() {
            const tokenUrl = NODE_IP + '/contract/tokenInfo/' + this.tokenId
            this.$http.get(tokenUrl).then(response => {
                let tempResponse = JSONBigNumber.parse(response.bodyText)
                this.tokens = tempResponse
                this.unity = BigNumber(this.tokens.unity)
                this.updateTokenBalance()
            }, respError => {
            })
        },
        getTokenBalances() {
            for (const addr in this.addresses) {
                Vue.set(this.tokenBalances, addr, BigNumber(0))
                let turl = NODE_IP + '/contract/balance/' + addr + '/' + this.tokenId
                this.$http.get(turl).then(response => {
                    let tempResponse = JSONBigNumber.parse(response.bodyText)
                    let value = BigNumber(tempResponse.balance).dividedBy(tempResponse.unity)
                    Vue.set(this.tokenBalances, addr, value)
                }, respError => {
                })
            }
            for (const addr in this.coldAddresses) {
                Vue.set(this.tokenBalances, addr, BigNumber(0))
                let turl = NODE_IP + '/contract/balance/' + addr + '/' + this.tokenId
                this.$http.get(turl).then(response => {
                    let tempResponse = JSONBigNumber.parse(response.bodyText)
                    let value = BigNumber(tempResponse.balance).dividedBy(tempResponse.unity)
                    Vue.set(this.tokenBalances, addr, value)
                }, respError => {
                })
            }
        },
        getTokenInfo() {
            let contractId = transaction.tokenIDToContractID(this.tokenId)
            const tokenUrl = NODE_IP + '/contract/tokenInfo/' + this.tokenId
            this.$http.get(tokenUrl).then(response => {
                let tempResponse = JSONBigNumber.parse(response.bodyText)
                this.tokens = tempResponse
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
                this.isSplit = (tokentype === CONTRACT_WITH_SPLIT_DESCRIPTOR)
            }, respError => {
                console.log('failed to load tokentype ')
            })
            this.updateTokenBalance()
        },
        showModal() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'tokenInfoModal_' + this.tokenId)
        },
        verify() {
            window.open('https://docs.google.com/forms/d/e/1FAIpQLSer2SHC0qLi5l_4q-8zXcQG_nAraUBkMB9LPDI0MLuSB_03vg/viewform')
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
            this.functionName = 'Issue Token'
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'issueOrDestroyTokenModal_' + this.tokenId)
        },
        withdrawToken() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'withdrawTokenModal_' + this.tokenId)
        },
        burnToken() {
            this.functionName = 'Destroy Token'
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'issueOrDestroyTokenModal_' + this.tokenId)
        },
        depositToken() {
            this.getTokenInfo()
            this.$root.$emit('bv::show::modal', 'depositTokenModal_' + this.tokenId)
        },
        removeToken() {
            let isRemove = confirm('Are you sure to remove this token?')
            if (isRemove) {
                let user = JSON.parse(window.localStorage.getItem(this.seedAddress))
                let arr = JSON.parse(user.tokens)
                Vue.delete(arr, this.tokenId)
                this.setUsrLocalStorage('tokens', JSON.stringify(arr))
                this.removeFlag = true
                this.$emit('removeFlag', this.removeFlag)
                this.removeFlag = false
                if (this.$store.state.eventPool) {
                    let eventPool = this.$store.state.eventPool
                    if (eventPool[this.tokenId] && eventPool[this.tokenId].newToken) {
                        var stopArr = eventPool[this.tokenId].newToken
                        for (var i in stopArr) {
                            clearTimeout(stopArr[i])
                        }
                        Vue.delete(eventPool, this.tokenId)
                    }
                    this.$store.commit('changeEventPool', eventPool)
                }
            }
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
