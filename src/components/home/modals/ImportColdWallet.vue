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
                class="selected">    Mobile Cold Wallet App</button>
        <button id="ledgerWallet"
                @click="select('ledgerWallet')"
                class="unselected">    Ledger Hardware Device</button>
        <button id="manualInput"
                @click="select('manualInput')"
                class="unselected">    Manual Input Address</button>
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
      <LedgerWallet @import-cold="importCold"></LedgerWallet>
      <b-row class="row">
        <b-col class="col-back">
          <b-button
            class="btn-back"
            block
            variant="light"
            size="lg"
            @click="prevPage">Back
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="ledger"
                 v-if="pageId===2 && method === 'appWallet'">
      <AppWallet @import-cold="importCold"></AppWallet>
      <b-row class="row">
        <b-col class="col-back">
          <b-button class="btn-back"
                    block
                    variant="light"
                    size="lg"
                    @click="prevPage">Back
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="ledger"
                 v-if="pageId===2 && method === 'manualInput'">
      <ManualInput @import-cold="importCold"></ManualInput>
      <b-row class="row">
        <b-col class="col-back">
          <b-button class="btn-back"
                    block
                    variant="light"
                    size="lg"
                    @click="prevPage">Back
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
// import crypto from '@/utils/crypto'
// import { PUBLIC_KEY_LENGTH } from '@/constants.js'
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
    methods: {
        select: function(type) {
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
        importClose: function(evt) {
            if (this.qrInit) {
                evt.preventDefault()
            }
        },
        importOk: function(evt) {
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
                console.log(this.pageId)
                if (this.pageId > 2) {
                    this.closeModal()
                }
            }
        },
        importCold(coldAddr, coldPubKey, jsonObj) {
            this.$emit('import-cold', coldAddr, coldPubKey, jsonObj)
        },
        importCancel: function(evt) {
            if (this.qrInit) {
                evt.preventDefault()
            }
        },
        closeModal: function() {
            this.pageId = 1
            this.$refs.importModal.hide()
        },
        prevPage: function() {
            this.pageId--
        }
        /*
        importCold(coldAddress, pubKey, jsonObj) {
            Vue.set(this.coldAddresses, coldAddress, !pubKey ? '' : jsonObj)
            let unsortedColdAddresses = this.coldAddresses
            let sortedColdAddresses = {}
            Object.keys(unsortedColdAddresses).sort().forEach(function(key) {
                sortedColdAddresses[key] = unsortedColdAddresses[key]
            })
            this.sortedAddresses = sortedColdAddresses
            this.getBalance(coldAddress)
            this.setUsrLocalStorage('coldAddresses', JSON.stringify(this.coldAddresses))
        } */
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
