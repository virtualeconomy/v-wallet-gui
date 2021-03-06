<template>
  <div class="records">
    <div class="title-records">
      <span>Token watch list</span>
      <b-button class="add-token-button text-decoration-none"
                variant="link"
                v-b-modal.addTokenModal>&oplus;</b-button>
    </div>
    <div class="inherit-height">
      <div v-if="Object.keys(tokenRecords).length > 0 && Object.keys(tokenRecords) !== undefined"
           class="scroll"
           :style="{height: myHeight}">
        <TokenRecord v-for="(tokenInfo,tokenId) in tokenRecords"
                     :key="tokenId"
                     :token-id="tokenId"
                     :token-info="tokenInfo"
                     :address="address"
                     :addresses="addresses"
                     :cold-addresses="coldAddresses"
                     :wallet-type="walletType"
                     :balances="balances"
                     :token-records="tokenRecords"
                     :active-tab="activeTab"
                     @refreshTokens="refreshTokens"
                     @removeFlag="removeToken"></TokenRecord>
      </div>
      <div v-else
           class="empty">
        There is no token in watch list.
      </div>
      <div class="add-token">
        <span class="add-token-input-first">Don't see your tokens?</span>
        <br>
        <span class="add-token-input-second">Click on <b-button class="add-button"
                                                                v-b-modal.addTokenModal>Add Token</b-button> to add them to your account</span>
        <AddToken :token-records="tokenRecords"
                  show="false"></AddToken>
      </div>
    </div>

  </div>
</template>

<script>

import Vue from 'vue'
import browser from '@/utils/browser'
import TokenRecord from './TokenRecord'
import AddToken from '../modals/AddToken'
import common from '@/js-v-sdk/src/utils/common'
import { mapState } from 'vuex'
export default {
    name: 'TokenRecords',
    components: {
        TokenRecord, AddToken
    },
    created() {
        this.myHeight = (this.isMobile() ? window.innerHeight + 100 : window.innerHeight - 400) + 'px'
        if (this.address && Vue.ls.get('pwd')) {
            this.getTokenRecords()
        }
    },
    data() {
        return {
            tokenRecords: {},
            changeShowDisable: false,
            myHeight: '0',
            records: {}
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
            default: function() {
            },
            require: true
        },
        walletType: {
            type: String,
            default: '',
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
            if (this.address && Vue.ls.get('pwd')) {
                this.getTokenRecords()
            }
        },
        addTokenStatus(cur, old) {
            this.getTokenRecords()
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            tokenManagementStatus: 'tokenManagementStatus',
            tokenSplitStatus: 'tokenSplitStatus'
        }),
        addTokenStatus() {
            return this.$store.state.addTokenStatus
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        userInfo() {
            return JSON.parse(window.localStorage.getItem(this.seedAddress))
        }
    },
    methods: {
        isMobile() {
            return browser.isMobile()
        },
        refreshTokens() {
            this.getTokenRecords()
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.seedAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        upgradeLocalTokens() {
            let keys = Object.keys(this.tokenRecords)
            if (keys.length > 0 && !this.tokenRecords[keys[0]].hasOwnProperty('name')) {
                let tmp = this.tokenRecords
                for (let id in keys) {
                    let tokenId = keys[id]
                    let isAddable = true
                    this.chain.getTokenInfo(tokenId).then(response => {
                        if (response.hasOwnProperty('error')) {
                            isAddable = false
                        }
                        let contractID = common.tokenIDToContractID(tokenId)
                        this.chain.getContractInfo(contractID).then(res => {
                            if (res.hasOwnProperty('error')) {
                                isAddable = false
                            }
                            if (res.type !== 'NonFungibleContract' && res.type !== 'TokenContract' && res.type !== 'TokenContractWithSplit') {
                                isAddable = false
                            }
                            let contractType = res.type
                            let maker = res.info[1].data
                            if (isAddable) {
                                let tokenInfo = { 'name': tokenId, 'contractType': contractType, 'iconUrl': '', 'maker': maker, 'unity': response.unity }
                                Vue.set(tmp, tokenId, tokenInfo)
                                this.setUsrLocalStorage('tokens', JSON.stringify(tmp))
                            } else {
                                Vue.delete(tmp, tokenId)
                                this.setUsrLocalStorage('tokens', JSON.stringify(tmp))
                            }
                        }, resErr => {
                        })
                    }, respError => {
                    })
                }
            }
        },
        getTokenRecords() {
            if (this.address) {
                let records = JSON.parse(window.localStorage.getItem(this.seedAddress))
                if (records.tokens) {
                    this.tokenRecords = JSON.parse(records.tokens)
                    // Upgrade local tokens
                    this.upgradeLocalTokens()
                }
            }
        },
        removeToken(remove) {
            if (remove === true) {
                this.getTokenRecords()
            }
        }
    }
}
</script>

<style scoped lang="less">
.empty {
    padding: 24px 0;
    background-color: #1111;
}
.records {
    background: #FFFFFF;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    margin: 0px 0px;
    z-index: 100;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
}
.inherit-height {
    position: relative;
    padding-top: 52px;
    top: -52px;
    height: 900px;
    margin-bottom: 100px;
    z-index: 100;
}
.title-records {
    background: #FAFAFA;
    padding: 8px 20px;
    border-bottom: 1px solid #EDEDF0;
    height: 52px;
    text-align: left;
    font-size: 17px;
    color: #010102;
    letter-spacing: 0;
    display: flex;
    align-items: Center;
}
.add {
    background: #FAFAFA;
    padding: 8px 20px;
    border-bottom: 1px solid #EDEDF0;
    text-align: left;
    font-size: 17px;
    color: #010102;
    letter-spacing: 0;
    align-items: Center;
    margin-bottom: 0px;
    z-index: 100
}
.blink {
    padding-top: 3px;
    padding-left: 0px;
    padding-right: 0px;
}
.show-fee {
    position: absolute;
    right:380px;
    width: 116px;
    height: 36px;
    border-color: #E8E9ED;
    font-size: 15px;
    color: #696B8A;
    letter-spacing: 0;
    align-items: Center;
    display: flex;
    justify-content:center;
}
.add-token {
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    left: 25px;
    top: 10px;
    margin-bottom: 20px;
    text-align: left;
}
.add-button {
    background-color: transparent;
    opacity: 1;
    border: none;
    outline: none;
    font-family: Roboto-Bold;
    font-size: 13px;
    color: #FF8837;
    letter-spacing: 0;
    text-align: right;
    line-height: 15px;
    padding-left: 2px;
    padding-right: 2px;
}
.add-token-input-first
{
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #010102;
    letter-spacing: 0;
    text-align: left;
}
.add-token-button {
    z-index: 200;
    font-size: 23px;
    margin-left: -5px;
}
.add-token-input-second
{
    font-family: Roboto-Regular;
    font-size: 13px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: right;
}
</style>
