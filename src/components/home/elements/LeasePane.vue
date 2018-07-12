<template>
  <div class="row justify-content-between height-full">
    <div class="col-auto align-self-center text-left tran-head">
      <span class="title">
        {{ balance }} VEE
      </span>
      <p class="text-muted text-des mb-0">
        Balance
      </p>
    </div>
    <div class="col align-self-center text-right">
      <b-button variant="dark"
                class="btn-send"
                v-b-modal.startLeasingModal>
        <b>Start Leasing</b>
      </b-button>
      <b-button>
        <img src="../../../assets/imgs/icons/wallet/ic_help.svg">
      </b-button>
    </div>
    <Leasing show="false"
             :balances="balances"
             :cold-addresses="coldAddresses"></Leasing>
  </div>
</template>

<script>
import Leasing from '../modals/Leasing'
export default {
    name: 'LeasePane',
    components: {
        Leasing
    }
}
</script>

<style scoped>

</style>
