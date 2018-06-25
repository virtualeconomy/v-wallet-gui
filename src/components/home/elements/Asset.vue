<template>
  <div
    class="card"
    style="width: 18rem;">
    <div class="card-body text-left">
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-subtitle mb-2">
        <span>Wallet Address: </span>
        <span class="txt-addr">{{ address }}</span>
      </p>
      <p class="card-text"><span>Balance:</span>&nbsp;<span>{{ balance }} VEE</span></p>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Asset',
    props: {
        title: {
            type: String,
            default: 'Asset'
        },
        address: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            default: 0,
            required: true
        }
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/style/common';
@import '../../../assets/style/variables';

.asset {
    width: 100%;
    height: 200px;
    background-color: @navBgColor;
    border: 1px solid @bdBgColor;
}

.txt-addr {
    font-size: 70%
}
</style>
