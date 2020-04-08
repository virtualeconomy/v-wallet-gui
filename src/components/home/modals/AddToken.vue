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
    <button class="close btn-close"
            @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs>
      <b-tab title="Add Token">
        <b-container
          class="text-left">
          <b-form-group label="Token ID or Name"
                        class="forms"
                        label-for="amountInput">
            <div class="select-certified-token">
              <b-dropdown class="m-2"
                          no-caret
                          id="dropdown-grouped"
                          text="Select Token"
                          size="sm"
                          right
                          variant="warning">
                <div style="height:150px;overflow:scroll">
                  <b-dropdown-group id="dropdown-group-1"
                                    v-for="(token, idx) in certifiedTokenList"
                                    :key="idx">
                    <b-dropdown-item-button @click="selectToken(idx, token.name)">
                      <img :src="token.iconUrl"
                           style="width: 20px; height: 20px">
                      <span style="color: mediumblue; margin-left: 20px">{{ token.name }}</span>
                    </b-dropdown-item-button>
                    <b-dropdown-divider></b-dropdown-divider>
                  </b-dropdown-group>
                </div>
              </b-dropdown>
            </div>
            <b-form-input id="amountInput"
                          class="input-t"
                          v-model="tokenId"
                          aria-describedby="inputLiveFeedback"
                          placeholder="Please input Token ID or Name"
                          :state="isValidToken">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback"
                                     style="font-size: 15px;margin-top: 10px">
              Error: Failed to get Token Info! (Please make sure Token ID is correct and network is available to connect node)
            </b-form-invalid-feedback>
            <b-button variant="warning"
                      class="btn-o"
                      block
                      size="lg"
                      :disabled="isAddable"
                      @click="addModal">Add
            </b-button>
          </b-form-group>
        </b-container>
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import common from '@/js-v-sdk/src/utils/common'
import { mapActions, mapState } from 'vuex'
import certify from '@/utils/certify'
export default {
    name: 'AddToken',
    data() {
        return {
            tokens: {},
            tokenId: '',
            init: false,
            responseErr: false
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
        contractId() {
            try {
                return common.tokenIDToContractID(this.tokenId)
            } catch (e) {
                return null
            }
        },
        seedAddress() {
            if (Vue.ls.get('address')) {
                return Vue.ls.get('address')
            }
        },
        defaultAddress() {
            return Vue.ls.get('address')
        },
        isAddable() {
            return this.tokenId.length <= 0
        },
        isValidToken() {
            if (!this.init || this.tokenId.length === 0 || this.responseErr === false) {
                return void 0
            }
            return !this.responseErr
        }
    },
    methods: {
        ...mapActions(['changeAddTokenStatus']),
        closeModal() {
            this.init = false
            this.responseErr = false
            this.tokenId = ''
            this.tokens = {}
            this.$refs.addTokenModal.hide()
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.seedAddress, JSON.stringify(userInfo))
        },
        addModal() {
            this.init = true
            let tokens = {}
            let tmpUserInfo = JSON.parse(window.localStorage.getItem(this.seedAddress))
            if (tmpUserInfo && tmpUserInfo.tokens) {
                tokens = JSON.parse(tmpUserInfo.tokens)
            }
            this.tokenId = this.tokenId.replace(/\s*/g, '')
            let tokenId = certify.getTokenId(this.tokenId)
            this.tokenId = tokenId === null ? this.tokenId : tokenId
            if (this.tokenId in tokens) {
                this.$refs.addTokenModal.hide()
                return
            }
            if (this.tokenId) {
                this.chain.getContractInfo(this.contractId).then(response => {
                    this.responseErr = false
                    if (response.hasOwnProperty('error')) {
                        this.responseErr = true
                        return
                    }
                    Vue.set(tokens, this.tokenId, response.info[1].data)
                    this.setUsrLocalStorage('tokens', JSON.stringify(tokens))
                    this.changeAddTokenStatus()
                    this.$refs.addTokenModal.hide()
                }, respError => {
                    this.responseErr = true
                })
            }
        },
        selectToken(id) {
            this.tokenId = id
        }
    }
}
</script>

<style scoped lang="less">
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
