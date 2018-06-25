<template>
  <div
    class="card asset shadow-sm">
    <div class="card-body text-left">
      <div class="card-text mb-3">
        <p class="mb-0">{{ addrShow }}</p>
        <p class="text-muted mb-0 asset-title">Wallet Address</p>
      </div>
      <div class="card-text">
        <p class="mb-0">{{ balance }} VEE</p>
        <p class="text-muted mb-0 asset-title">Balance</p>
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
    },
    computed: {
        addrShow() {
            const addrChars = this.address.split('')
            addrChars.splice(6, 23, '******')
            return addrChars.join('')
        }
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/style/common';
@import '../../../assets/style/variables';

.asset {
    margin-bottom: 10px;
}
.no-left-padding {
    padding-left: 0px;
}
.asset-title {
    font-size: 80%;
}
</style>
