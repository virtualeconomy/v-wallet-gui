<template>
  <div>
    <b-modal id="contractManagementModal"
             ref="contractManagementModal"
             title="ContractManagement"
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
        <div class="label-title">My Contracts</div>
        <div>
          <b-button block
                    class="btn-new btn-add "
                    variant="warning"
                    size="lg"
                    v-b-modal.createContractModal>New Contract
        </b-button></div>
        <div class="scroll"
             :style="{'max-height': '280px', 'min-height': '280px', 'margin-top': '10px'}">
          <b-form-group>
            <b-input-group class="mb-2"
                           v-for="(alias, addr, index) in contractList"
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
                       title="WARN! To delete the contract"
                       @click="deleteContract(addr)"
                       size="sm">×</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
        <b-form-group label="Add existing Contract ID"
                      label-for="address-input">
          <b-form-input id="address-input"
                        class="amount-input"
                        v-model="curContractID"
                        aria-describedby="inputLiveFeedback"
                        :state="isValidContract && isSupportContract"
                        onfocus="this.select()">
          </b-form-input>
          <b-form-invalid-feedback id="inputLiveFeedback"
                                   v-if="!isValidContract">
            Please input valid contract id !
          </b-form-invalid-feedback>
          <b-form-invalid-feedback id="inputLiveFeedback"
                                   v-else-if="!isSupportContract">
            Only support NFT/Lock/Payment !
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
              :disabled="!isValidContract && !isSupportContract"
              @click="addContract">Add
            </b-button>
          </b-col>
        </b-row>
      </div>
      <CreateContract :cold-addresses="coldAddresses"
                      :addresses="addresses"
                      :selected-address="address"
                      :balances="balances"
                      :wallet-type="walletType"
                      @resetData="resetData"></CreateContract>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import CreateContract from './CreateContract'
export default {
    name: 'ContractManagement',
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
        },
        walletType: {
            type: String,
            default: 'hotWallet',
            require: true
        },
        balances: {
            type: Object,
            default: function() {
            },
            require: true
        }
    },
    data() {
        return {
            curContractID: '',
            curContractType: '',
            contractList: {},
            curContractIsValid: false
        }
    },
    created() {
        this.getLocalContracts()
    },
    computed: {
        ...mapState({
            chain: 'chain'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        isValidContract() {
            if (!this.curContractID) {
                return void 0
            }
            let isValid = false
            try {
                this.getContractInfo()
                isValid = this.curContractIsValid
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isSupportContract() {
            return this.curContractType === 'NFT' || this.curContractType === 'Lock' || this.curContractType === 'Payment'
        }
    },
    methods: {
        getLocalContracts() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            if (userInfo && userInfo.contracts) {
                try {
                    this.contractList = JSON.parse(userInfo.contracts)
                } catch (err) {
                    this.setUsrLocalStorage('contracts', JSON.stringify({}))
                }
            }
        },
        resetData() {
            this.contractList = JSON.parse(JSON.parse(window.localStorage.getItem(this.defaultAddress)).contracts)
            this.curContractID = ''
            this.curContractType = ''
            this.curContractIsValid = false
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
        },
        addContract() {
            let tmpUserInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            let contracts = {}
            if (tmpUserInfo && tmpUserInfo.contracts) {
                contracts = JSON.parse(tmpUserInfo.contracts)
            }
            if (this.curContractID in contracts) {
                return
            }
            Vue.set(contracts, this.curContractID, this.curContractType)
            this.setUsrLocalStorage('contracts', JSON.stringify(contracts))
            this.resetData()
        },
        deleteContract(contractID) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            let contracts = JSON.parse(userInfo.contracts)
            Vue.delete(contracts, contractID)
            this.setUsrLocalStorage('contracts', JSON.stringify(contracts))
            this.contractList = contracts
        },
        closeModal() {
            this.resetData()
            this.$refs.contractManagementModal.hide()
        },
        copyText(buttonId, addrToCopy, index) {
            this.$refs[addrToCopy][index].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
            }, 400)
        },
        getContractInfo() {
            this.chain.getContractInfo(this.curContractID).then(response => {
                if (response.error) {
                    this.curContractIsValid = false
                } else {
                    this.curContractIsValid = true
                    if (response.type === 'NonFungibleContract') {
                        this.curContractType = 'NFT'
                    } else if (response.type === 'LockContract') {
                        this.curContractType = 'Lock'
                    } else if (response.type === 'PaymentChannelContract') {
                        this.curContractType = 'Payment'
                    }
                }
            }, respError => {
                this.curContractIsValid = false
            })
        }
    },
    components: {
        CreateContract
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
.btn-new{
    width: 30%;
    height: 33px;
    line-height: 16.5px;
    font-size: 14px
}
.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
    margin-bottom: 40px;
}
</style>
