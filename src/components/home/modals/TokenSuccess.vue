<template>
  <div>
    <div class="token-succ-icon">
      <img v-if="txType==='Destroy Token'"
           src="@/assets/imgs/icons/operate/ic_burn.svg">
      <img v-else
           src="@/assets/imgs/icons/operate/ic_success_circle.svg">
    </div>
    <div class="infos">
      <b-form-group v-if="txType.startsWith('Deposit') || txType.startsWith('Withdraw')"
                    label-cols
                    class="form-line"
                    label="Contract ID"
                    label-for="contract_success">
        <b-form-input id="contract_success"
                      :value="contractId"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-if="txType==='Destroy Token'"
                    label-cols
                    class="form-line"
                    label="Destroy Amount"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType==='Register New Token' || txType==='Issue NFT'"
                    label-cols
                    class="form-line"
                    label="Max Supply"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType==='Send Token'"
                    label-cols
                    class="form-line"
                    label="Send Amount"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType==='Split Token'"
                    label-cols
                    class="form-line"
                    label="New Unity"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(newUnity)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType==='Supersede'"
                    label-cols
                    class="form-line"
                    label="New Issuer"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="newIssuer"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType==='Issue Token'"
                    label-cols
                    class="form-line"
                    label="Issue Amount"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(amount)"
                      class="amount"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-else-if="txType.startsWith('Deposit') || txType.startsWith('Withdraw')"
                    label-cols
                    class="form-line"
                    label="Amount"
                    label-for="amount_success">
        <b-form-input id="amount_success"
                      :value="formatter(amount)"
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
      <b-form-group v-if="txType==='Send Token'"
                    label-cols
                    class="form-line"
                    label="To"
                    label-for="toAddress_success">
        <b-form-input id="toAddress_success"
                      v-model="recipient"
                      class="addr"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
      <b-form-group v-if="txType==='Send Token' && description"
                    label-cols
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
                      :value="Number(fee) + ' VSYS'"
                      class="fee"
                      readonly
                      :plaintext="true">
        </b-form-input>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import { CONTRACT_EXEC_FEE } from '@/js-v-sdk/src/constants'
export default {
    name: 'TokenSuccess',
    props: {
        newIssuer: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            required: true,
            default: ''
        },
        amount: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            }
        },
        newUnity: {
            type: BigNumber,
            default: function() {
                return BigNumber(0)
            }
        },
        fee: {
            type: BigNumber,
            required: true,
            default: function() {
                return BigNumber(CONTRACT_EXEC_FEE)
            }
        },
        txType: {
            type: String,
            required: true,
            default: ''
        },
        recipient: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        contractId: {
            type: String,
            default: ''
        }
    },
    methods: {
        formatter(num) {
            return num.toString()
        }
    }
}
</script>

<style scoped>
.token-succ-icon {
    text-align: center
}
.form-line {
    margin-bottom: 0px;
    border-top: 1px solid #E8E9ED;
    height: 48px;
    text-align: right;
    padding-top: 5px;
}
.infos {
    width: 409px;
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
