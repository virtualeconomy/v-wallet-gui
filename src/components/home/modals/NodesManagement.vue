<template>
  <div>
    <b-modal id="nodesManagementModal"
             ref="nodesManagementModal"
             title="NodesManagement"
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
        <div class="label-title">Node List</div>
        <div class="scroll"
             :style="{'max-height': '280px', 'min-height': '280px', 'margin-top': '10px'}">
          <b-form-group>
            <b-input-group class="mb-2"
                           v-for="(value, node, index) in nodeList"
                           :key="node">
              <b-form-input :value="value"
                            class="alias-input"
                            readonly
                            variant="light"
                            size="sm"
                            slot="prepend">
              </b-form-input>
              <b-form-input readonly
                            size="sm"
                            class="input-t"
                            :value="node">
              </b-form-input>
              <b-input-group-append>
                <textarea id="addrToCopy"
                          :value="node"
                          ref="addrToCopy"
                          class="hidden"
                          readonly>
                </textarea>
                <b-btn :id="node"
                       class="btn-copy-append"
                       variant="link"
                       v-b-popover.click.topright="'Copied!'"
                       @click="copyText(node, 'addrToCopy', index)">
                  <img src="@/assets/imgs/icons/operate/ic_copy.svg">
                </b-btn>
              </b-input-group-append>
              <b-input-group-append>
                <b-btn variant="danger"
                       v-b-tooltip.hover.topleft
                       title="WARN! To delete the node"
                       @click="deleteNode(node)"
                       size="sm">×</b-btn>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
        <b-form-group label="Add Node URL"
                      label-for="address-input">
          <b-form-input id="address-input"
                        class="amount-input"
                        v-model="nodeURL"
                        aria-describedby="inputLiveFeedback"
                        :state="isValidNode"
                        onfocus="this.select()">
          </b-form-input>
          <b-form-invalid-feedback id="inputLiveFeedback">
            Please input valid node url !
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
              :disabled="isAddable"
              @click="addNode">Add
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { NETWORK_BYTE } from '@/network'
import { PAYMENT_TX } from '@/js-v-sdk/src/constants'
export default {
    name: 'NodesManagement',
    data() {
        return {
            nodeURL: '',
            nodeList: {},
            responseErr: false,
            init: false,
            testNodes: {},
            nodes: {}
        }
    },
    created() {
        this.getLocalNodes()
    },
    watch: {
        nodeURL() {
            this.responseErr = false
        }
    },
    computed: {
        ...mapState({
            chain: 'chain'
        }),
        defaultAddress() {
            return Vue.ls.get('address')
        },
        isAddable() {
            return this.nodeURL.length <= 0
        },
        isValidNode() {
            if (!this.init || this.nodeURL.length === 0 || this.responseErr === false) {
                return void 0
            }
            return !this.responseErr
        }
    },
    methods: {
        getLocalNodes() {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            if (userInfo && userInfo.nodes) {
                try {
                    this.nodes = JSON.parse(userInfo.nodes)
                } catch (err) {
                    this.setUsrLocalStorage('nodes', JSON.stringify({}))
                }
            }
            if (userInfo && userInfo.testNodes) {
                try {
                    this.testNodes = JSON.parse(userInfo.testNodes)
                } catch (err) {
                    this.setUsrLocalStorage('testNodes', JSON.stringify({}))
                }
            }
            this.nodeList = String.fromCharCode(NETWORK_BYTE) === 'T' ? this.testNodes : this.nodes
        },
        resetData() {
            this.getLocalNodes()
            this.nodeURL = ''
            this.init = false
            this.responseErr = false
        },
        setUsrLocalStorage(fieldName, value) {
            let userInfo = JSON.parse(window.localStorage.getItem(this.defaultAddress))
            Vue.set(userInfo, fieldName, value)
            window.localStorage.setItem(this.defaultAddress, JSON.stringify(userInfo))
        },
        async addNode() {
            let nodeList = this.nodeList
            this.nodeURL = this.nodeURL.replace(/\s*/g, '')
            if (this.nodeURL in nodeList) {
                return
            }
            this.init = true
            let suffix = '/addresses/balance/' + this.defaultAddress
            let transactionsSuffix = '/transactions/list?address=' + this.defaultAddress + '&limit=10' + '&txType=' + PAYMENT_TX
            let nodeType = 'Wallet'
            try {
                let nodeTypeRes = await this.$http.get(this.nodeURL + transactionsSuffix)
                if (nodeTypeRes.ok) {
                    nodeType = 'Full'
                }
            } catch (err) {
                console.log(err)
            }
            try {
                let networkRes = await this.$http.get(this.nodeURL + suffix)
                if (networkRes.ok && networkRes.body.address === this.defaultAddress) {
                    Vue.set(nodeList, this.nodeURL, nodeType)
                    let fieldName = String.fromCharCode(NETWORK_BYTE) === 'T' ? 'testNodes' : 'nodes'
                    this.setUsrLocalStorage(fieldName, JSON.stringify(nodeList))
                    this.resetData()
                } else {
                    this.responseErr = true
                }
            } catch (err) {
                console.log(err)
                this.responseErr = true
            }
        },
        deleteNode(node) {
            let nodeList = this.nodeList
            Vue.delete(nodeList, node)
            let fieldName = String.fromCharCode(NETWORK_BYTE) === 'T' ? 'testNodes' : 'nodes'
            this.setUsrLocalStorage(fieldName, JSON.stringify(nodeList))
            this.resetData()
        },
        closeModal() {
            this.resetData()
            this.$refs.nodesManagementModal.hide()
        },
        copyText(buttonId, addrToCopy, index) {
            this.$refs[addrToCopy][index].select()
            window.document.execCommand('copy')
            this.$root.$emit('bv::show::popover', buttonId)
            setTimeout(() => {
                this.$root.$emit('bv::hide::popover', buttonId)
            }, 400)
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
