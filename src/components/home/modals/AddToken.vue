<template>
  <b-modal id="addTokenModal"
           ref="addTokenModal"
           centered
           hide-footer
           hide-header
           lazy
           :busy="true"
           title="Add Token"
           @hidden="closeModal">
    <div class="add_title">Add Token</div>
    <button class="close btn-close"
            @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs @input="tokenTabChange">
      <b-tab active>
        <template slot="title">
          <div><span>Verified Token</span></div>
        </template>
        <div>
          <div>
            <div class="scroll">
              <div v-for="(certifiedToken, tokenId) in certifiedTokenList"
                   :key="tokenId">
                <b-btn class="token-unit"
                       @click="addVerifiedToken(tokenId, certifiedToken.name)">
                  <div class="token-svg"><img width="56px"
                                              height="56px"
                                              :src="certifiedToken.iconUrl">
                  <span class="cer-name">{{ certifiedToken.name }}</span></div>
                  <div class="notice"
                       v-if="isExistedToken(tokenId)">Already added!</div>
                </b-btn>
              </div>
            </div>
          </div>
          <b-row class="button-row"
                 style="margin-top:30px">
            <b-col class="col-lef">
              <b-button
                class="btn-cancel"
                block
                variant="light"
                size="lg"
                @click="closeModal">Cancel
              </b-button>
            </b-col>
            <b-col class="col-rig">
              <b-button
                block
                class="btn-confirm"
                variant="warning"
                size="lg"
                :disabled="isSubmitDisabled"
                @click="addToken">Add
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-tab>
      <b-tab>
        <template slot="title">
          <div><span>Custom Token</span></div>
        </template>
        <div class="content">
          <div class="form-group cus-group">
            <label>Token ID</label>
            <b-form-input class="form-control"
                          v-model="tokenId"
                          :state="isValidToken(tokenId)"
                          aria-describedby="inputTokenLiveFeedback"
                          placeholder="Please input Token ID"
                          onfocus="this.select()"></b-form-input>
            <b-form-invalid-feedback id="inputTokenLiveFeedback"
                                     style="margin-top: -20px"
                                     v-if="isVerifiedToken(tokenId)">
              It's verified Token!
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputTokenLiveFeedback"
                                     style="margin-top: -20px"
                                     v-else>
              Error: Failed to get Token Info! (Please make sure Token ID is correct and network is available to connect node)
            </b-form-invalid-feedback>
            <label>Token Symbol</label>
            <b-form-input class="form-control input-bottom"
                          v-model="tokenSymbol"
                          :state="checkSymbol(tokenSymbol)"
                          aria-describedby="inputSymbolLiveFeedback"
                          placeholder="Please input Token Symbol"
                          onfocus="this.select()"></b-form-input>
            <b-form-invalid-feedback id="inputSymbolLiveFeedback"
                                     v-if="!isValidSymbol(tokenSymbol)">
              Symbol must be digits or English letters within 10.
            </b-form-invalid-feedback>
            <b-form-invalid-feedback id="inputSymbolLiveFeedback"
                                     v-if="!isUsedSymbol(tokenSymbol)">
              Symbol already exists.
            </b-form-invalid-feedback>
          </div>
          <b-row class="button-row">
            <b-col class="col-lef">
              <b-button
                class="btn-cancel"
                block
                variant="light"
                size="lg"
                @click="closeModal">Cancel
              </b-button>
            </b-col>
            <b-col class="col-rig">
              <b-button
                block
                class="btn-confirm"
                variant="warning"
                size="lg"
                :disabled="isSubmitDisabled"
                @click="addToken">Add
              </b-button>
            </b-col>
          </b-row>
        </div>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import common from '@/js-v-sdk/src/utils/common'
import { mapState } from 'vuex'
export default {
    name: 'AddToken',
    data: function() {
        return {
            activeTab: 'verified',
            tokenId: '',
            tokenSymbol: '',
            selectedVerifiedToken: '',
            selectedVerifiedSymbol: '',
            responseErr: false
        }
    },
    props: {
        tokenRecords: {
            type: Object,
            require: true,
            default: function() {}
        }
    },
    watch: {
        tokenId() {
            this.responseErr = false
        }
    },
    computed: {
        ...mapState({
            chain: 'chain',
            certifiedTokenList: 'certifiedTokenList'
        }),
        isSubmitDisabled() {
            let tokenId = this.activeTab === 'custom' ? this.tokenId : this.selectedVerifiedToken
            if (this.activeTab === 'verified') {
                return this.isExistedToken(tokenId)
            } else {
                return tokenId.length <= 0 || !this.checkSymbol(this.tokenSymbol) || this.isVerifiedToken(tokenId) || this.tokenSymbol.length <= 0
            }
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        }
    },
    methods: {
        closeModal() {
            this.responseErr = false
            this.tokenId = ''
            this.tokenSymbol = ''
            this.activeTab = 'verified'
            this.$refs.addTokenModal.hide()
        },
        tokenTabChange(tabIndex) {
            if (tabIndex === 0) {
                this.activeTab = 'verified'
            } else if (tabIndex === 1) {
                this.activeTab = 'custom'
            }
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.seedAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        addToken() {
            let tmp = this.tokenRecords
            let tokenId = this.activeTab === 'custom' ? this.tokenId : this.selectedVerifiedToken
            let tokenSymbol = this.activeTab === 'custom' ? this.tokenSymbol : this.selectedVerifiedSymbol
            tokenId = tokenId.replace(/\s*/g, '')
            let iconUrl = ''
            if (tokenId in this.certifiedTokenList) {
                iconUrl = this.certifiedTokenList[tokenId].iconUrl
            }
            if (tokenId in tmp) {
                this.$refs.addTokenModal.hide()
                return
            }
            if (tokenId) {
                this.chain.getTokenInfo(tokenId).then(response => {
                    this.responseErr = false
                    if (response.hasOwnProperty('error')) {
                        this.responseErr = true
                        return
                    }
                    let contractID = common.tokenIDToContractID(tokenId)
                    this.chain.getContractInfo(contractID).then(res => {
                        if (res.hasOwnProperty('error')) {
                            this.responseErr = true
                            return
                        }
                        if (res.type !== 'NonFungibleContract' && res.type !== 'TokenContract' && res.type !== 'TokenContractWithSplit') {
                            this.responseErr = true
                            return
                        }
                        let contractType = res.type
                        let maker = res.info[1].data
                        let tokenInfo = { 'name': tokenSymbol, 'contractType': contractType, 'iconUrl': iconUrl, 'maker': maker, 'unity': response.unity }
                        Vue.set(tmp, tokenId, tokenInfo)
                        this.setUsrLocalStorage('tokens', JSON.stringify(tmp))
                        this.$refs.addTokenModal.hide()
                    }, err => {
                        console.log(err)
                        this.responseErr = true
                    })
                }, respError => {
                    this.responseErr = true
                })
            }
        },
        addVerifiedToken(tokenId, verifiedSymbol) {
            this.selectedVerifiedToken = tokenId
            this.selectedVerifiedSymbol = verifiedSymbol
        },
        isExistedToken(tokenId) {
            return tokenId in this.tokenRecords
        },
        checkSymbol(symbol) {
            return this.isUsedSymbol(symbol) && this.isValidSymbol(symbol)
        },
        isUsedSymbol(symbol) {
            if (symbol === 'VSYS') {
                return false
            }
            let tmp = this.tokenRecords
            for (let tokenId in tmp) {
                if (tmp[tokenId].name === symbol) {
                    return false
                }
            }
            return true
        },
        isValidSymbol(symbol) {
            let Regx = /^[A-Za-z0-9]*$/
            return symbol.length <= 10 && Regx.test(symbol)
        },
        isValidToken(tokenId) {
            if (tokenId.length === 0) {
                return void 0
            }
            return !this.responseErr && !this.isVerifiedToken(tokenId)
        },
        isVerifiedToken(tokenId) {
            return tokenId in this.certifiedTokenList
        }
    }
}
</script>

<style scoped lang="less">
.add_title{
    font-size: 20px;
    font-weight: 500;
    margin-left: 10px;
}
.scroll {
    height: 210px;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
    background: rgba(247,247,252,1);
}
.token-unit {
    width: 100%;
    height: 88px;
    background: rgba(247,247,252,1);
    border-radius: 4px;
    padding-left: 24px;
    padding-bottom: 16px;
    padding-top: 16px;
    border: rgba(247,247,252,1);
    display: flex;
    align-items: center;
    justify-content: space-between
}
.token-unit:active, .token-unit:focus, .token-unit:hover, .token-unit:active:focus {
    height: 88px;
    background: rgba(247, 247, 252, 1);
    border-radius: 4px;
    border: 1px solid rgba(255, 136, 55, 1);
    padding-left: 24px;
    padding-bottom: 16px;
    padding-top: 16px;
}
.cer-name {
    margin-left: 20px;
    height:21px;
    font-size:18px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:21px;
}
.notice {
    font-size:12px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(246,0,46,1);
    line-height:14px;
}

.cus-group {
    // padding-top: 32px;
    // margin-bottom: 118px;
    // padding-right: 24px;
    // padding-left: 24px;
}
.cus-group label {
    margin-left: 4px;
    font-size:14px;
    font-family:SFProText-Regular,SFProText;
    font-weight:400;
    color:rgba(50,50,51,1);
    line-height:16px;
    margin-bottom: 12px;
}
.cus-group input {
    height:48px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(230,230,237,1);
    margin-bottom: 24px;
}
#address-qrcode {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 40px;
}
.forms {
    text-align: left;
}
.input-t {
    height: 48px;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
}
.modal-c {
    padding-top: 24px
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 20px;
}
.btn-o {
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    height: 48px;
    margin-top: 10px;
}
.btn-copy {
    position: absolute;
    right:0;
    margin-right: 30px;
    margin-top: -43px;
}
.hidden {
    font-size: 12pt;
    border: 0px;
    padding: 0px;
    margin: 0px;
    position: absolute;
    left: -9999px;
    top: 0px;
}
.select-certified-token {
    position: relative;
    display: inline-block;
    float: right;
    margin-top: -40px;
    margin-right: -8px;
}
</style>
