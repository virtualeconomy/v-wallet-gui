<template>
  <b-modal id="importModal"
           centered
           lazy
           @cancel="importCancel"
           @hide="importClose"
           @ok="importOk"
           @show="showingUp"
           :cancel-disabled="qrInit"
           title="Import Cold Wallet"
           hide-header
           hide-footer
           ref="importModal">
    <button
      :disabled="qrInit"
      class="close btn-close"
      @click="closeModal">
      <img src="@/assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-container
      class="text-left"
      v-if="pageId===1">
      <b-container fluid
                   class="c-import">
        <p class="monitor">Select Monitor Method</p>
        <p class="information">You can select three method to monitor cold wallet.</p>
        <button id="appWallet"
                @click="select('appWallet')"
                :class="classChoose('appWallet') ? 'selected' : 'unselected'">    Mobile Cold Wallet App</button>
        <button id="ledgerWallet"
                @click="select('ledgerWallet')"
                :class="classChoose('ledgerWallet') ? 'selected' : 'unselected'">    Ledger Hardware Device</button>
        <button id="manualInput"
                @click="select('manualInput')"
                :class="classChoose('manualInput') ? 'selected' : 'unselected'">    Manual Input Address</button>
      </b-container>
      <b-row class="btn-bottom">
        <b-col class="col-lef">
          <b-button
            class="btn-back"
            block
            variant="light"
            size="lg"
            @click="closeModal">Cancel
          </b-button>
        </b-col>
        <b-col class="col-rit">
          <b-button
            block
            class="btn-confirm"
            :style="{background:'#FFBE96'}"
            variant="warning"
            size="lg"
            @click="importOk">Confirm
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container
      class="ledger"
      v-if="pageId===2 && method === 'ledgerWallet'">
      <LedgerWallet @import-cold="importCold"
                    @close-btn="closeModal"></LedgerWallet>
      <b-row class="row">
        <b-col class="col-back">
          <b-button
            class="btn-back"
            block
            variant="light"
            size="lg"
            @click="prevPage('ledgerWallet')">Back
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="ledger"
                 v-if="pageId===2 && method === 'appWallet'">
      <AppWallet @import-cold="importCold"
                 @close-btn="closeModal"></AppWallet>
      <b-row class="row">
        <b-col class="col-back">
          <b-button class="btn-back"
                    block
                    variant="light"
                    size="lg"
                    @click="prevPage('appWallet')">Back
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="ledger"
                 v-if="pageId===2 && method === 'manualInput'">
      <ManualInput @import-cold="importCold"
                   @close-btn="closeModal"></ManualInput>
      <b-row class="row">
        <b-col class="col-back">
          <b-button class="btn-back"
                    block
                    variant="light"
                    size="lg"
                    @click="prevPage('manualInput')">Back
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>
<script>
import LedgerWallet from '../elements/LedgerWallet'
import AppWallet from '../elements/AppWallet'
import ManualInput from '../elements/ManualInput'
import { API_VERSION, PROTOCOL, OPC_ACCOUNT } from '@/constants.js'

export default {
    name: 'ImportColdWallet',
    components: { LedgerWallet, AppWallet, ManualInput },
    props: {
        address: {
            type: String,
            default: '',
            require: true
        }
    },
    data: function() {
        return {
            method: 'appWallet',
            pageId: 1,
            qrInit: false
        }
    },
    computed: {
        isValidAddress() {
            if (this.coldAddress === this.address) {
                return false
            }
            if (!this.coldAddress) {
                return void 0
            }
            let isValid = false
            try {
                isValid = crypto.isValidAddress(this.coldAddress)
            } catch (e) {
                console.log(e)
            }
            return isValid
        },
        isValidPublicKey() {
            if (!this.coldPublicKey) {
                return void 0
            }
        },
        addressExisted() {
            return this.coldAddress === this.address
        }
    },
    methods: {
        classChoose(method) {
            return this.method === method
        },
        select(type) {
            if (type === 'appWallet') {
                this.method = 'appWallet'
                document.getElementById(type).className = 'selected'
                document.getElementById('ledgerWallet').className = 'unselected'
                document.getElementById('manualInput').className = 'unselected'
            } else if (type === 'ledgerWallet') {
                this.method = 'ledgerWallet'
                document.getElementById('appWallet').className = 'unselected'
                document.getElementById('manualInput').className = 'unselected'
                document.getElementById(type).className = 'selected'
            } else if (type === 'manualInput') {
                this.method = 'manualInput'
                document.getElementById(type).className = 'selected'
                document.getElementById('ledgerWallet').className = 'unselected'
                document.getElementById('appWallet').className = 'unselected'
            }
        },
        showingUp() {
            this.method = 'appWallet'
        },
        importClose(evt) {
            if (this.qrInit) {
                evt.preventDefault()
            }
        },
        importOk(evt) {
            if (this.method === 'manualInput') {
                this.pageId++
                if (this.pageId > 2) {
                    this.closeModal()
                }
            } else if (this.method === 'ledgerWallet') {
                this.pageId++
                if (this.pageId > 2) {
                    this.closeModal()
                }
            } else if (this.method === 'appWallet') {
                this.pageId++
                if (this.pageId > 2) {
                    this.closeModal()
                }
            }
        },
        importCold(coldAddr, coldPublicKey, jsonObj) {
            this.$emit('import-cold', coldAddr, coldPublicKey, jsonObj)
        },
        importCancel: function(evt) {
            if (this.qrInit) {
                evt.preventDefault()
            }
        },
        async onInit(promise) {
            try {
                this.qrInit = true
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    throw Error('user denied camera access permission')
                } else if (error.name === 'NotFoundError') {
                    throw Error('no suitable camera device installed')
                } else if (error.name === 'NotSupportedError') {
                    throw Error('page is not served over HTTPS (or localhost)')
                } else if (error.name === 'NotReadableError') {
                    throw Error('maybe camera is already in use')
                } else if (error.name === 'OverconstarinedError') {
                    throw Error('pass constraints do not match any camera')
                } else {
                    throw Error('browser is probably lacking features(WebRTC, Canvas)')
                }
            } finally {
                this.qrInit = false
            }
        },
        onDecode(decodeString) {
            this.paused = true
            try {
                this.jsonObj = JSON.parse(decodeString)
                this.coldAddress = this.jsonObj.address
                this.coldPublicKey = this.jsonObj.publicKey
                this.opc = this.jsonObj.opc
                this.api = this.jsonObj.api
                this.protocol = this.jsonObj.protocol
            } catch (e) {
                this.paused = false
            }
            if (!this.isValidAddress) {
                this.coldAddress = 'please scan QR code of cold wallet address'
                this.paused = false
            } else if (this.api > API_VERSION || this.protocol !== PROTOCOL || this.opc !== OPC_ACCOUNT) {
                this.coldAddress = 'invalid QR code'
                this.paused = false
            } else if (!this.isValidPublicKey) {
                this.coldPublicKey = 'invalid public key'
                this.paused = false
            }
        },
        scanAgain() {
            this.paused = false
            this.coldAddress = ''
        },
        closeModal() {
            this.$refs.importModal.hide()
        },
        prevPage: function(method) {
            this.pageId--
            this.method = method
        }
    }
}
</script>

<style scoped>
.scan-pane {
    width: 320px;
    margin: auto;
}
.qrcode-waiting {
    margin-left: 100px;
}
.qrInfo {
    margin-bottom: 20px;
    color: #9091a3;
}
.monitor {
    font-family: Roboto-Regular;
    font-size: 26px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
}
.information {
    font-family: Roboto-Regular;
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 40px;
}
.scan-again-btn {
    margin-top: 10px;
    background: rgba(255,135,55,0.00);
    border: 1px solid #FF8737;
    border-radius: 4px;
    font-size: 13px;
    color: #FF8737;
    letter-spacing: 0;
    width: 100px;
    margin-left: 110px;
}
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 4px;
}
.c-import {
    padding-top: 24px;
    margin-bottom: 40px;
    padding-left: 15px;
    padding-right: 15px;
}
.btn-bottom {
    margin-left: 0px;
    margin-right: 0px;
}
.btn-confirm {
    height: 44px;
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
}
.btn-back {
    background: #FAFAFA;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    font-size: 17px;
    color: #4F515E;
    letter-spacing: 0;
    text-align: center;
}
.selected {
    padding-left: 30px;
    width: 360px;
    height: 60px;
    display: block;
    margin:0 auto ;
    background: #FFFFFF;
    border: 1px solid #FF8737;
    border-radius: 4px;
    margin-bottom: 20px;
    font-family: Roboto-Regular;
    font-size: 15px;
    text-align: left;
    color: #FF8737;
    letter-spacing: 0;
}
.unselected {
    padding-left: 30px;
    width: 360px;
    height: 60px;
    display: block;
    margin:0 auto ;
    background: #FFFFFF;
    border: 1px solid #E8E9ED;
    border-radius: 4px;
    margin-bottom: 20px;
    font-family: Roboto-Regular;
    font-size: 15px;
    text-align: left;
    color: #181B3A;
    letter-spacing: 0;
}
.col-lef {
    padding-right: 10px;
}
.col-rit {
    padding-left: 10px;
}
.col-back {
    padding-left: 10px;
    margin-top: -70px;
    margin-right: 230px;
    margin-left: 5px;
}
.row {
    margin-top: 25px;
    margin-bottom: 15px;
}
</style>
