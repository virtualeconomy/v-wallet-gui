<template>
  <b-container class="record-unit"
               fluid>
    <b-row align-v="center">
      <b-col class="record-icon"
             cols="auto">
        <img src="../../../assets/imgs/icons/wallet/ic_token2.svg"
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
          <span>{{ formatter(totalSupply) }} </span>
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
          <b-dropdown-item @click="issueToken">Issue Token</b-dropdown-item>
          <b-dropdown-item @click="burnToken">Burn Token</b-dropdown-item>
        </b-dropdown>
      </b-col>
    </b-row>
    <TokenInfoModal :token-id="tokenId"
                    :issuer="issuer"
                    :total-supply="formatter(totalSupply)"
                    :issued-tokens="formatter(issuedTokens)"
                    :description="description"
                    :register-time="registerTime">
    </TokenInfoModal>
    <IssueToken :token-id="tokenId"
                :address="address"
                :wallet-type="walletType"
                :addresses="addresses"
                :cold-addresses="coldAddresses">
    </IssueToken>
    <BurnToken :token-id="tokenId"
               :address="address"
               :wallet-type="walletType"
               :addresses="addresses"
               :cold-addresses="coldAddresses">
    </BurnToken>
  </b-container>
</template>

<script>
import base58 from '@/libs/base58'
import converters from '@/libs/converters'
import TokenInfoModal from './TokenInfoModal'
import IssueToken from './IssueToken'
import BigNumber from 'bignumber.js'
import BurnToken from './BurnToken'
import { NODE_IP } from '../../../constants.js'
import Vue from 'vue'
export default {
    name: 'TokenRecord',
    components: { TokenInfoModal, IssueToken, BurnToken },
    data: function() {
        return {
            tokens: {},
            hovered: false,
            issuer: '',
            registerTime: '2019'
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
        balances: {
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
            type: Array,
            default: function() {},
            require: true
        },
        tokenId: {
            type: String,
            default: '',
            require: true
        }
    },
    computed: {
        seedaddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.seedaddress))
        },
        txAddressShow() {
            if (this.txAddress) {
                const addrChars = this.txAddress.split('')
                addrChars.splice(6, 23, '******')
                return addrChars.join('')
            }
        },
        totalSupply() {
            return this.tokenRecord[0]['data']
        },
        issuedTokens() {
            return this.tokenRecord[3]['data']
        },
        description() {
            let bytes = base58.decode(this.tokenRecord[2]['data'])
            try {
                return converters.byteArrayToString(bytes)
            } catch (e) {
                return ''
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
            num = BigNumber(num)
            return num.toFixed(Math.log10(this.tokenRecord[1]['data']))
        },
        showModal() {
            if (this.userInfo && this.userInfo.tokens) {
                this.tokens = JSON.parse(this.userInfo.tokens)
            }
            const tokenUrl = NODE_IP + '/contract/tokenInfo/' + this.tokenId
            this.$http.get(tokenUrl).then(response => {
                console.log('test', response, this.tokens)
                Vue.set(this.tokens, this.tokenId, JSON.parse(JSON.stringify(response.body['info'])))
                this.setUsrLocalStorage('tokens', JSON.stringify(this.tokens))
            }, respError => {
            })
            const url = NODE_IP + '/contract/info/' + 'CFAGtf7AEsKzQxBQvJnKFbLST44Wzupmiw2'
            this.$http.get(url).then(response => {
                this.issuer = response.body.info[0]['data']
                this.$root.$emit('bv::show::modal', 'tokenInfoModal_' + this.tokenId)
            }, respError => {
                this.issuer = 'Failed to get issuer'
                this.registerTime = 'Failed to get time'
                this.$root.$emit('bv::show::modal', 'tokenInfoModal_' + this.tokenId)
            })
        },
        issueToken() {
            this.$root.$emit('bv::show::modal', 'issueTokenModal_' + this.tokenId)
        },
        burnToken() {
            this.$root.$emit('bv::show::modal', 'burnTokenModal_' + this.tokenId)
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
