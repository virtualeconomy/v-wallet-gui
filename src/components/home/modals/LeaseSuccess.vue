<template>
  <div>
    <img src="../../../assets/imgs/icons/operate/ic_success_circle.svg">
    <div v-if="txType==='lease'">
      <p class="p-tips">Your transaction is on the way!</p>
      <p class="p-info">You have leased {{ amount }} VEE</p>
    </div>
    <div v-else-if="txType==='cancelLease'">
      <p class="p-tips">Your transaction has been cancelled!</p>
    </div>
    <b-button variant="warning"
              class="btn-detail">View Details</b-button>
  </div>
</template>
<script>
export default {
    name: 'LeaseSuccess',
    props: {
        amount: {
            type: Number,
            default: 0
        },
        txType: {
            type: String,
            require: true,
            default: ''
        }
    }
}
</script>

<style scoped>
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
