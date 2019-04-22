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
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
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
              Token does not exist!
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
import { NODE_IP } from '../../../constants.js'
import bus from '../../../assets/bus'
export default {
    name: 'AddToken',
    data() {
        return {
            tokens: {},
            tokenId: '',
            init: false,
            responseErr: false,
            sendFlag: false
        }
    },
    created() {
        if (this.userInfo && this.userInfo.tokens) {
            this.tokens = JSON.parse(this.userInfo.tokens)
        }
    },
    watch: {
        tokenId() {
            this.responseErr = false
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
        isAddable() {
            return !this.tokenId.length > 0
        }
    },

    methods: {
        closeModal() {
            this.init = false
            this.responseErr = false
            this.tokenId = ''
            this.$refs.addTokenModal.hide()
        },
        setUsrLocalStorage(fieldname, value) {
            Vue.set(this.userInfo, fieldname, value)
            window.localStorage.setItem(this.seedaddress, JSON.stringify(this.userInfo))
        },
        addModal() {
            this.init = true
            if (this.userInfo && this.userInfo.tokens) {
                this.tokens = JSON.parse(this.userInfo.tokens)
            }
            const url = NODE_IP + '/contract/tokenInfo/' + this.tokenId
            this.$http.get(url).then(response => {
                this.responseErr = false
                Vue.set(this.tokens, this.tokenId, JSON.parse(JSON.stringify(response.body['info'])))
                Vue.delete(this.tokens, '')
                this.setUsrLocalStorage('tokens', JSON.stringify(this.tokens))
                this.sendFlag = true
                bus.$emit('sendFlag', this.sendFlag)
                this.sendFlag = false
                this.$refs.addTokenModal.hide()
            }, respError => {
                this.responseErr = true
            })
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
input[type=number] {
    -moz-appearance:textfield !important;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
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
</style>
