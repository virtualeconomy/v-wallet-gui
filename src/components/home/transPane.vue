<template>
  <div>
    <b-button variant="primary">SEND</b-button>
    <b-button variant="primary">RECEIVE</b-button>
  </div>
</template>

<script>
import bButton from 'bootstrap-vue/es/components/button/button'
export default {
    name: 'TransPane',
    components: {
        bButton
    }
}
</script>

<style scoped lang="less">
@import '../../assets/style/common';
@import '../../assets/style/variables';
div {
    border: 1px solid @bdBgColor;
    height: 132px;
    width: 100%;
    button {
        width: @btnWBig;
        height: @btnHBig;
        margin: 36px 20px;
    }
}

</style>
