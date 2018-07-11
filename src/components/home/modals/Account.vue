<template>
  <b-modal id="accountModal"
           ref="accountModal"
           title="Account"
           hide-footer
           hide-header
           @hidden="resetData"
           size="md"
           ok-only
           centered>
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <div class="account-container">
      <div class="label-title">Account</div>
      <b-form-group label="Wallet Address"
                    label-for="walletAddress">
        <b-form-input id="walletAddress"
                      readonly
                      size="sm"
                      v-model="address"
                      class="input-t"
                      ref="walletAddress">
        </b-form-input>
        <textarea
          id="addrToCopy"
          v-model="address"
          ref="addrToCopy"
          class="hidden"
          readonly>
        </textarea>
        <b-btn
          id="addr-cpy"
          class="btn-copy"
          v-b-popover.click.topright="'Copied!'"
          @click="copyText('addr-cpy', 'addrToCopy')"
          variant="link">
          <img src="../../../assets/imgs/icons/operate/ic_copy.svg">
        </b-btn>
      </b-form-group>
      <b-form-group label="Cold Wallet Address">
        <b-input-group
          class="mb-2"
          v-if="coldWalletNum > 0"
          v-for="(pubkey, addr) in coldAddresses"
          :key="addr">
          <b-dropdown
            :text="tagOfColdWallet[addr] ? 'public key' : 'address'"
            class="pd-select2 input-t"
            variant="light"
            size="sm"
            slot="prepend">
            <b-dropdown-item
              class="drop-item"
              @click="showAddr(addr)">address</b-dropdown-item>
            <b-dropdown-item
              class="drop-item"
              @click="showKey(addr)">public key</b-dropdown-item>
          </b-dropdown>
          <b-form-input
            readonly
            size="sm"
            :value="tagOfColdWallet[addr] ? pubkey : addr">
          </b-form-input>
          <b-input-group-append>
            <textarea id="coldToCopy"
                      :value="tagOfColdWallet[addr] ? pubkey : addr"
                      ref="coldToCopy"
                      class="hidden"
                      readonly>
            </textarea>
            <b-btn
              :id="addr"
              class="btn-copy-append"
              variant="link"
              v-b-popover.click.topright="'Copied!'"
              @click="copyColdText(addr, tagOfColdWallet[addr])"
              size="sm">
              <img src="../../../assets/imgs/icons/operate/ic_copy.svg">
            </b-btn>
          </b-input-group-append>
          <b-input-group-append>
            <b-btn
              variant="danger"
              v-b-tooltip.hover.topleft
              title="WARN! To delete the coldwallet"
              @click="deleteCold(addr)"
              size="sm">×</b-btn>
          </b-input-group-append>
        </b-input-group>
        <b-form-input
          v-if="coldWalletNum == 0"
          readonly
          no-resize
          size="sm"
          class="input-t"
          value="No cold wallet imported">
        </b-form-input>
      </b-form-group>
      <b-form-group label="Public Key"
                    label-for="pubKey">
        <b-form-input id="pubKey"
                      readonly
                      size="sm"
                      class="input-t"
                      v-model="pubKey">
        </b-form-input>
        <textarea
          id="pubToCopy"
          v-model="pubKey"
          ref="pubToCopy"
          class="hidden"
          readonly>
        </textarea>
        <b-btn
          id="pub-cpy"
          class="btn-copy"
          v-b-popover.click.topright="'Copied!'"
          @click="copyText('pub-cpy', 'pubToCopy')"
          variant="link">
          <img src="../../../assets/imgs/icons/operate/ic_copy.svg">
        </b-btn>
      </b-form-group>
      <b-form-group label="Private Key"
                    label-for="priKey">
        <b-input-group class="input-t"
                       v-if="privateKeyHidden">
          <b-form-input size="sm"
                        placeholder="Please input your password to show the private key."
                        v-model="prvKeyPwd"
                        @input="hideErr('prvKeyPwdErr')"
                        type="password"
                        id="prvKeyPwd">
          </b-form-input>
          <b-input-group-append>
            <b-btn
              class="btn-append"
              variant="warning"
              @click="showPriKey"
              size="sm"
              :disabled="!prvKeyPwd">show</b-btn>
          </b-input-group-append>
        </b-input-group>
        <b-input-group class="input-t"
                       v-else>
          <b-form-input
            id="priKey"
            readonly
            size="sm"
            v-model="privateKey"
            class="input-t"
            type="text">
          </b-form-input>
          <b-input-group-append>
            <textarea
              id="prvToCopy"
              v-model="privateKey"
              ref="prvToCopy"
              class="hidden"
              readonly>
            </textarea>
            <b-btn
              id="prv-copy"
              class="btn-copy-append"
              variant="link"
              @click="copyText('prv-copy', 'prvToCopy')"
              size="sm"
              v-b-popover.click.topright="'Copied!'">
              <img src="../../../assets/imgs/icons/operate/ic_copy.svg">
            </b-btn>
          </b-input-group-append>
          <b-input-group-append>
            <b-btn
              class="btn-append"
              variant="warning"
              @click="hidePriKey"
              size="sm">hide</b-btn>
          </b-input-group-append>
        </b-input-group>
        <div
          class="msg-err text-danger"
          v-show="prvKeyPwdErr">
          <small>
            Password is wrong.
          </small>
        </div>
      </b-form-group>
      <b-form-group label="Seed"
                    label-for="seed">
        <b-input-group class="input-t"
                       v-if="seedHidden">
          <b-form-input size="sm"
                        placeholder="Please input your password to show the seed."
                        v-model="seedPwd"
                        @input="hideErr('seedPwdError')"
                        type="password"
                        id="seedPwd">
          </b-form-input>
          <b-input-group-append>
            <b-btn
              class="btn-append"
              variant="warning"
              @click="showSeed"
              size="sm"
              :disabled="!seedPwd">show</b-btn>
          </b-input-group-append>
        </b-input-group>
        <b-input-group v-else>
          <b-form-textarea
            id="seed"
            readonly
            size="sm"
            no-resize
            rows="3"
            v-model="seed">
          </b-form-textarea>
          <b-input-group-append>
            <textarea
              id="seedToCopy"
              v-model="seed"
              ref="seedToCopy"
              class="hidden"
              readonly>
            </textarea>
            <b-btn
              id="seed-cpy"
              class="btn-copy-append"
              variant="link"
              size="sm"
              @click="copyText('seed-cpy', 'seedToCopy')"
              v-b-popover.click.topright="'Copied!'">
              <img src="../../../assets/imgs/icons/operate/ic_copy.svg">
            </b-btn>
          </b-input-group-append>
          <b-input-group-append>
            <b-btn
              class="btn-append"
              variant="warning"
              @click="hideSeed"
              size="sm">hide</b-btn>
          </b-input-group-append>
        </b-input-group>
        <div
          class="msg-err text-danger"
          v-show="seedPwdErr">
          <small>
            Password is wrong.
          </small>
        </div>
      </b-form-group>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'Account',
    props: {
        address: {
            type: String,
            require: true,
            default: ''
        },
        coldAddresses: {
            type: Object,
            require: true,
            default: function() {}
        },
        pubKey: {
            type: String,
            require: true,
            default: ''
        },
        getPriKey: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        },
        getSeedPhrase: {
            type: Function,
            require: true,
            default: function() {
                return ''
            }
        }
    },
    data() {
        return {
            seed: '',
            privateKey: '',
            seedHidden: true,
            privateKeyHidden: true,
            tagOfColdWallet: {},
            isCpyDisable: false,
            prvKeyPwd: '',
            prvKeyPwdErr: false,
            seedPwd: '',
            seedPwdErr: false,
            refForCold: {}
        }
    },
    created() {
        this.coldWalletNum = Object.keys(this.coldAddresses).length
        var coldAddressArray = Object.keys(this.coldAddresses)
        this.refForCold = Object.keys(coldAddressArray).reduce(function(obj, key) {
            obj[coldAddressArray[key]] = key
            return obj
        }, {})
    },
    watch: {
        coldAddresses() {
            this.coldWalletNum = Object.keys(this.coldAddresses).length
        }
    },
    computed: {
        isCopyEnable: function() {
            return this.isCpyDisable
        }
    },
    methods: {
        showSeed() {
            setTimeout(() => {
                this.seed = this.getSeedPhrase()
                this.seedHidden = false
            }, 800)
        },
        hideSeed() {
            this.seed = ''
            this.seedHidden = true
        },
        showPriKey() {
            if (this.prvKeyPwd === Vue.ls.get('pwd')) {
                setTimeout(() => {
                    this.prvKeyPwdErr = false
                    this.privateKey = this.getPriKey()
                    this.privateKeyHidden = false
                    this.prvKeyPwd = ''
                }, 400)
            } else {
                this.prvKeyPwdErr = true
            }
        },
        hidePriKey() {
            this.privateKey = ''
            this.privateKeyHidden = true
        },
        resetData() {
            this.seed = ''
            this.privateKey = ''
            this.seedHidden = true
            this.privateKeyHidden = true
            this.tagOfColdWallet = {}
            this.coldWalletNum = Object.keys(this.coldAddresses).length
        },
        showAddr(addr) {
            Vue.set(this.tagOfColdWallet, addr, false)
        },
        showKey(addr) {
            Vue.set(this.tagOfColdWallet, addr, true)
        },
        deleteCold(addr) {
            this.$emit('delete-cold', addr)
        },
        closeModal() {
            this.$refs.accountModal.hide()
        },
        copyText(buttonId, refName) {
            this.$refs[refName].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            this.isCpyDisable = true
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
                this.isCpyDisable = false
            }, 400)
        },
        copyColdText(addr) {
            var index = this.refForCold[addr]
            this.$refs.coldToCopy[index].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', addr)
            this.isCpyDisable = true
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', addr)
                this.isCpyDisable = false
            }, 400)
        },
        hideErr(errorType) {
            this[errorType] = false
        }
    }
}
</script>

<style scoped>
.account-container {
    text-align: left;
    padding-top: 24px;
    margin-bottom: 40px;
    margin-left: 15px;
    margin-right: 15px;
}
.tag-coldwallet {
    width: 100px;
}
.drop-item {
    padding: 0px 10px;
    width: 100px;
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.input-t {
    height: 48px;
    font-size: 15px;
    letter-spacing: 0;
}
.label-title {
    font-size: 28px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
}
.btn-copy {
    cursor: pointer;
    float: right;
    margin-top: -43px;
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
.btn-append {
    width: 52px;
}
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #FAFAFA inset;
    -webkit-text-fill-color: #696B8A !important;
}
</style>
