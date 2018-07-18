<template>
  <div class="div-cancel">
    <img src="../../../assets/imgs/icons/operate/ic_success_circle.svg">
    <div>
      <p class="p-tips">Your transaction is on the way!</p>
      <p class="p-info">You have canceled a leasing transaction</p>
    </div>
    <b-button variant="warning"
              class="btn-detail"
              @click="showDetails">View Details</b-button>
  </div>
</template>

<script>
import TxInfoModal from '../elements/TxInfoModal'
export default {
    name: 'CancelSuccess',
    components: { TxInfoModal },
    methods: {
        showDetails() {
            this.$emit('show-details')
        }
    }
}
</script>

<style scoped>
.div-cancel {
    padding-top: 40px;
}
.p-tips {
    font-size: 28px;
    color: #181B3A;
    letter-spacing: 0;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 5px;
}
.p-info {
    font-size: 15px;
    color: #9091A3;
    letter-spacing: 0;
    text-align: center;
}
.btn-detail {
    font-size: 17px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    height: 44px;
    width: 220px;
    margin-top: 7px;
}
</style>
