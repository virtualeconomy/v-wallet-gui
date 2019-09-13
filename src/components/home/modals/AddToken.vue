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
          <b-form-group label="Token ID"
                        class="forms"
                        label-for="amountInput">
            <b-form-input id="amountInput"
                          class="input-t"
                          v-model="tokenId"
                          aria-describedby="inputLiveFeedback"
                          :state="isValidToken()">
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
import { NODE_IP } from '@/constants.js'
import transaction from '@/utils/transaction'
import { mapActions } from 'vuex'
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
        contractId() {
            return transaction.tokenIDToContractID(this.tokenId)
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
            if (this.tokenId in tokens) {
                this.$refs.addTokenModal.hide()
                return
            }
            if (this.tokenId) {
                const url = NODE_IP + '/contract/info/' + this.contractId
                this.$http.get(url).then(response => {
                    this.responseErr = false
                    Vue.set(tokens, this.tokenId, response.body.info[1].data)
                    this.setUsrLocalStorage('tokens', JSON.stringify(tokens))
                    this.changeAddTokenStatus()
                    this.$refs.addTokenModal.hide()
                }, respError => {
                    this.responseErr = true
                })
            }
        },
        isValidToken() {
            if (!this.init || this.tokenId.length === 0 || this.responseErr === false) {
                return void 0
            }
            return !this.responseErr
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
</style>
