<template>
  <b-modal id="addTokenModal"
           ref="addTokenModal"
           centered
           hide-footer
           lazy
           title="Add Token">
    <b-container
      fluid
      class="modal-c">
      <b-form-group label="Token ID"
                    class="forms"
                    label-for="amountInput">
        <b-form-input id="amountInput"
                      class="input-t"
                      v-model="tokenId"
                      aria-describedby="inputLiveFeedback"
                      :state="isValidToken(tokenId)"
                      min="0">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
          Token does not exist!
        </b-form-invalid-feedback>
        <br>
        <br>
        <b-button variant="warning"
                  class="btn-o"
                  block
                  size="lg"
                  @click="okModal">OK
        </b-button>
      </b-form-group>
    </b-container>
  </b-modal>
</template>

<script>
// import { API_VERSION, PROTOCOL, OPC_ACCOUNT, VSYS_PRECISION } from '@/constants.js'
// import { NODE_IP, VSYS_PRECISION } from '@/constants.js'
// import BigNumber from 'bignumber.js'
import Vue from 'vue'
export default {
    name: 'AddToken',
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tokenId: '',
            balance: 0,
            errFlag: false
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
        }
    },

    methods: {
        closeModal() {
            this.balance = 0
            this.tokenId = ''
            this.$refs.addTokenModal.hide()
        },
        setUsrLocalStorage(feildname, value) {
            Vue.set(this.userInfo, feildname, value)
            window.localStorage.setItem(this.address, JSON.stringify(this.userInfo))
        },
        okModal() {
            // this.$refs.addTokenModal.hide()
            if (this.isValidToken(this.tokenId)) {
                // let balance = this.balance
                this.setUsrLocalStorage(this.tokenId, JSON.stringify(this.tokenId))
                console.log('lalala' + this.tokenId)
                // console.log('cash' + JSON.parse(this.balance))
                // console.log('balabala' + JSON.parse(window.localStorage.getItem(this.tokenId)))
            }
            this.balance = 0
            this.tokenId = ''
            this.$refs.addTokenModal.hide()
        },

        // isAmountValid(amount) {
        //    if (Number(amount) === 0) {
        //        return void 0
        //    }
        //    return !isNaN(amount) && !this.isWrongFormat(amount) && !(/[eE]/.test(amount.toString()))
        // },
        isValidToken: function(tokenId) {
            if (!tokenId) {
                return void 0
            }
            let isValid = true
            this.balance = 100
            if (tokenId === '1') {
                isValid = false
            }
            /*
            else {
                const url = NODE_IP + '/addresses/balance/details/' + tokenId
                let value = 0
                this.$http.get(url).then(response => {
                    value = response.body['available'] / VSYS_PRECISION
                }, response => {
                    value = -1
                    this.errFlag = true
                })
                if (this.errFlag) {
                } else {
                    this.balance = value

                }
            }
            */
            return isValid
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
    margin-top: 4px;
}
.btn-o {
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    height: 44px;
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