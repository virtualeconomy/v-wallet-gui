<template>
  <b-modal id="aliasAddressModal"
           ref="aliasAddressModal"
           title="AliasAddress"
           hide-footer
           hide-header
           @hidden="resetData"
           size="md"
           ok-only
           centered>
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <div class="alias-container">
      <div class="label-title">Alias Address</div>
      <div class="scroll"
           :style="{'max-height': '280px',
                    'min-height': '280px'}">
        <b-form-group>
          <b-input-group class="mb-2"
                         v-if="aliasNum > 0"
                         v-for="(alias, addr, index) in aliasAddresses"
                         :key="addr">
            <b-form-input :value="alias"
                          class="alias-input"
                          readonly
                          variant="light"
                          size="sm"
                          slot="prepend">
            </b-form-input>
            <b-form-input readonly
                          size="sm"
                          class="input-t"
                          :value="addr">
            </b-form-input>
            <b-input-group-append>
              <textarea id="addrToCopy"
                        :value="addr"
                        ref="addrToCopy"
                        class="hidden"
                        readonly>
              </textarea>
              <b-btn :id="addr"
                     class="btn-copy-append"
                     variant="link"
                     v-b-popover.click.topright="'Copied!'"
                     @click="copyText(addr, 'addrToCopy', index)">
                <img src="@/assets/imgs/icons/operate/ic_copy.svg">
              </b-btn>
            </b-input-group-append>
            <b-input-group-append>
              <b-btn variant="danger"
                     v-b-tooltip.hover.topleft
                     title="WARN! To delete the alias address"
                     @click="deleteAlias(addr)"
                     size="sm">×</b-btn>
            </b-input-group-append>
          </b-input-group>
          <b-form-input v-if="aliasNum === 0"
                        readonly
                        no-resize
                        size="sm"
                        class="input-t"
                        value="No cold wallet imported">
          </b-form-input>
        </b-form-group>
      </div>
      <b-form-group label="Address"
                    label-for="address-input">
        <b-form-input id="address-input"
                      class="amount-input"
                      v-model="curAddress"
                      :readonly="from3rdParty"
                      aria-describedby="inputLiveFeedback"
                      :state="isValidAddress"
                      onfocus="this.select()">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-if="!isExistedAddress">
          Please input your valid address!
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Alias Name"
                    label-for="alias-input">
        <b-form-input id="alias-input"
                      class="amount-input"
                      v-model="curAlias"
                      :readonly="from3rdParty"
                      aria-describedby="inputLiveFeedback"
                      :state="isValidAlias"
                      onfocus="this.select()">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-if="!isAliasLessEight">
          Please enter an alias no more than 8 characters.
        </b-form-invalid-feedback>
        <b-form-invalid-feedback id="inputLiveFeedback"
                                 v-if="isExistedAlias">
          You have set this alias to another address, please change it to another！
        </b-form-invalid-feedback>
      </b-form-group>
      <b-row>
        <b-col class="col-lef">
          <b-button
            class="btn-cancel"
            block
            variant="light"
            size="lg"
            @click="closeModal">Close
          </b-button>
        </b-col>
        <b-col class="col-rit">
          <b-button
            block
            class="btn-add"
            variant="warning"
            size="lg"
            @click="addAlias">Add
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { MAX_ALIAS_LENGTH } from '@/constants'
export default {
    name: 'AliasAddress',
    props: {
        addresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        coldAddresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        address: {
            type: String,
            require: true,
            default: ''
        }
    },
    data() {
        return {
            curAlias: '',
            curAddress: '',
            aliasNum: 3,
            aliasAddresses: {}
        }
    },
    created() {
        if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
            this.aliasAddresses = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
        }
    },
    computed: {
        defaultAddress() {
            return Vue.ls.get('address')
        },
        isValidAddress() {
            if (!this.curAddress) {
                return void 0
            }
            return this.isExistedAddress
        },
        isExistedAddress() {
            return this.curAddress in this.addresses || this.curAddress in this.coldAddresses
        },
        isExistedAlias() {
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                let alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
                if (alias) {
                    for (let key in alias) {
                        if (this.curAlias.toLowerCase() === alias[key].toLowerCase()) {
                            return true
                        }
                    }
                }
            }
            return false
        },
        isAliasLessEight() {
            return this.curAlias.length <= MAX_ALIAS_LENGTH
        },
        isValidAlias() {
            if (!this.curAlias) {
                return void 0
            }
            return this.isAliasLessEight && !this.isExistedAlias
        },
        from3rdParty() {
            return false
        }
    },
    methods: {
        resetData() {
            this.aliasAddresses = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
            this.curAddress = ''
            this.curAlias = ''
        },
        deleteAlias(addr) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            delete userInfo.alias[addr]
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
            this.aliasAddresses = userInfo.alias
        },
        closeModal() {
            this.resetData()
            this.$refs.aliasAddressModal.hide()
        },
        copyText(buttonId, addrToCopy, index) {
            this.$refs[addrToCopy][index].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
            }, 400)
        },
        addAlias() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo.alias, this.curAddress, this.curAlias)
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
            this.resetData()
        }
    }
}
</script>

<style scoped>
.alias-container {
    text-align: left;
    padding-top: 24px;
    margin-bottom: 40px;
    margin-left: 15px;
    margin-right: 15px;
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.input-t {
    background: #E8E9ED;
    height: 48px !important;
    font-size: 15px;
    letter-spacing: 0;
}
.alias-input {
    text-align: center;
    height: 48px !important;
    font-size: 15px;
    letter-spacing: 0;
    width: 80px;
}
.label-title {
    font-size: 28px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 20px;
}
.btn-copy-append {
    border: 1px solid #ced4da;
    border-left: none;
    background-color: #fafafa;
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
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #FAFAFA inset;
    -webkit-text-fill-color: #696B8A !important;
}
.amount-input {
    height: 48px;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.btn-cancel {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.btn-add {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
    margin-bottom: 40px;
}
</style>
