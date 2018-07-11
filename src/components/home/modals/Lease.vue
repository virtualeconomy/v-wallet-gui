<template>
  <b-modal id="leaseModal"
           ref="leaseModal"
           centered
           hide-header
           hide-footer>
    <button
      class="close btn-close"
      @click="closeModal">
      <img src="../../../assets/imgs/icons/operate/ic_close.svg">
    </button>
    <b-tabs>
      <b-tab title="Hot Wallet"
             active>
        <LeaseInput :balances="balances"
                    @get-data="getData"></LeaseInput>
      </b-tab>
      <b-tab title="Cold Wallet">
      </b-tab>
    </b-tabs>
  </b-modal>
</template>

<script>
// import { TX_FEE } from '@/constants'
import LeaseInput from './LeaseInput'
export default {
    name: 'Lease',
    components: { LeaseInput },
    data: function() {
        return {
            amount: 0,
            recipient: '',
            pageId: 0
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
        getData(data) {
            this.amount = data.amount
            this.recipient = data.recipient
            this.pageId++
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
