<template>
  <div class="asset">
    <div class="title">
      <h3>{{ title }}</h3>
    </div>
    <div class="content">
      <div class="address">
        <span>Wallet Address: </span>
        <span>{{ address }}</span>
      </div>
      <div class="balance">
        <span>Balance:</span>
        <span>{{ balance }} VEE</span>
      </div>
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

</style>
