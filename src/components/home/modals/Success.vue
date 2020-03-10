<template>
  <div class="success">
    <img src="@/assets/imgs/icons/operate/ic_success_circle.svg">
    <div class="infos">
      <b-form-group label-cols
                    class="form-line"
                    label="Amount"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="amount + ' VSYS'"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="From"
                    label-for="walletAddress_success">
        <b-form-input id="walletAddress_success"
                      v-model="address"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="To"
                    label-for="recipientAddress_success">
        <b-form-input id="recipientAddress_success"
                      v-model="recipient"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="Description"
                    label-for="attachment_success">
        <b-form-input id="attachment_success"
                      v-model="description"
                      class="des"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="Fee"
                    label-for="fee_success">
        <b-form-input id="fee_success"
                      :value="fee + ' VSYS'"
                      class="fee"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import { VSYS_PRECISION } from '@/js-v-sdk/src/constants'
import { MAX_ALIAS_LENGTH } from '@/constants'
import { mapState } from 'vuex'
import Vue from 'vue'
export default {
    name: 'Confirm',
    props: {
        dataObject: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    computed: {
        ...mapState({
            account: 'account'
        }),
        fee() {
            return browser.bigNumberFormatter(BigNumber(this.dataObject.stored_tx.fee).dividedBy(VSYS_PRECISION))
        },
        amount() {
            return browser.bigNumberFormatter(BigNumber(this.dataObject.stored_tx.amount).dividedBy(VSYS_PRECISION))
        },
        defaultAddress() {
            return Vue.ls.get('address')
        },
        description() {
            return this.dataObject.stored_tx.attachment
        },
        address() {
            try {
                let address = this.account.convertPublicKeyToAddress(this.dataObject.stored_tx.senderPublicKey, this.dataObject.network_byte)
                if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                    let alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
                    for (let key in alias) {
                        if (address === key) {
                            return alias[key] + ' (' + key + ')'
                        }
                    }
                }
                return address
            } catch (e) {
            }
        },
        recipient() {
            let recipient = this.dataObject.stored_tx.recipient
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                let alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
                if (recipient.length <= MAX_ALIAS_LENGTH && alias) {
                    for (let key in alias) {
                        if (recipient.toLowerCase() === alias[key].toLowerCase()) {
                            return alias[key] + ' (' + key + ')'
                        }
                    }
                } else {
                    for (let key in alias) {
                        if (recipient === key) {
                            return alias[key] + ' (' + key + ')'
                        }
                    }
                    return recipient
                }
            }
        }
    }
}
</script>

<style scoped>
.success {
    text-align: center;
}
.form-line {
    margin-bottom: 0px;
    border-top: 1px solid #E8E9ED;
    height: 48px;
    text-align: right;
    padding-top: 5px;
}
.infos {
    margin-top: 30px;
    border-bottom: 1px solid #E8E9ED;
    margin-bottom: 40px;
}
.amount {
    font-size: 17px;
    color: #FF8737;
    letter-spacing: 0;
    text-align: right;
}
.addr {
    margin-left: -50px;
    width: 350px;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: right;
}
.des {
    margin-left: -50px;
    width: 350px;
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: right;
}
.fee {
    font-size: 15px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: right;
}
</style>
