<template>
  <div class="confirm">
    <img v-if="txType==='payment'"
         src="@/assets/imgs/icons/operate/ic_sent_big.svg">
    <img v-else-if="txType==='lease'"
         src="@/assets/imgs/icons/operate/ic_leasing_big.svg">
    <div class="infos">
      <b-form-group label-cols
                    class="form-line"
                    label="Amount"
                    label-for="amount_confirm">
        <b-form-input id="amount_confirm"
                      :value="amount + ' VSYS'"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    label="Type"
                    class="form-line"
                    label-for="tranType">
        <b-form-input id="tranType"
                      :value="txType"
                      class="des"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="From"
                    label-for="walletAddress_confirm">
        <b-form-input id="walletAddress_confirm"
                      v-model="address"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="To"
                    label-for="recipientAddress_confirm">
        <b-form-input id="recipientAddress_confirm"
                      v-model="recipient"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="Description"
                    label-for="attachment_confirm"
                    v-if="txType==='payment'">
        <b-form-input id="attachment_confirm"
                      v-model="description"
                      class="des"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group label-cols
                    class="form-line"
                    label="Fee"
                    label-for="fee_confirm">
        <b-form-input id="fee_confirm"
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
import { MAX_ALIAS_LENGTH } from '@/constants'
import browser from '@/utils/browser'
import BigNumber from 'bignumber.js'
import Vue from 'vue'
import { NETWORK_BYTE } from '@/network'
import Account from '@/js-v-sdk/src/account'
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
        fee() {
            return browser.bigNumberFormatter(BigNumber(this.dataObject.stored_tx.fee).dividedBy(1e8))
        },
        amount() {
            return browser.bigNumberFormatter(BigNumber(this.dataObject.stored_tx.amount).dividedBy(1e8))
        },
        defaultAddress() {
            return Vue.ls.get('address')
        },
        description() {
            return this.dataObject.stored_tx.attachment
        },
        address() {
            let acc = new Account(NETWORK_BYTE)
            let address = acc.convertPublicKeyToAddress(this.dataObject.stored_tx.senderPublicKey, NETWORK_BYTE)
            if (JSON.parse(window.localStorage.getItem(this.defaultAddress)) != null) {
                let alias = JSON.parse(window.localStorage.getItem(this.defaultAddress)).alias
                for (let key in alias) {
                    if (address === key) {
                        return alias[key] + ' (' + key + ')'
                    }
                }
            }
            return address
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
        },
        txType() {
            if (this.dataObject.stored_tx.transactionType === 2) {
                return 'payment'
            }
        }
    }
}
</script>

<style scoped>
.form-line {
    margin-bottom: 0px;
    border-top: 1px solid #E8E9ED;
    height: 48px;
    text-align: center;
    padding-top: 5px;
}
.confirm {
    text-align: center;
}
.box {

    overflow-x: visible;
}
.infos {
    width: 439px;
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
