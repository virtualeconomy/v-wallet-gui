<template>
  <b-modal id="leaseModal"
           ref="leaseModal"
           centered
           hide-header
           hide-footer
           @hide="resetPage">
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs>
      <b-tab title="Hot Wallet"
             active>
        <LeaseInput :balances="balances"
                    @get-data="getData"
                    v-if="pageId===1"></LeaseInput>
        <Confirm v-else-if="pageId===2"
                 :tx-type="'lease'"></Confirm>
      </b-tab>
      <b-tab title="Cold Wallet">
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
// import { TX_FEE } from '@/constants'
import LeaseInput from './LeaseInput'
import Confirm from './Confirm'
export default {
    name: 'Lease',
    components: { Confirm, LeaseInput },
    data: function() {
        return {
            amount: 0,
            recipient: '',
            pageId: 1
        }
    },
    props: {
        balances: {
            type: Object,
            default: function() {},
            require: true
        }
    },
    methods: {
        closeModal() {
            this.$refs.leaseModal.hide()
        },
        getData(recipient, amount) {
            this.recipient = recipient
            this.amount = amount
            this.pageId++
        },
        resetPage() {
            this.pageId = 1
        }
    }
}
</script>

<style scoped>
.btn-close {
    position: absolute;
    right: 0;
    margin-right: 20px;
    margin-top: 20px;
}

</style>
