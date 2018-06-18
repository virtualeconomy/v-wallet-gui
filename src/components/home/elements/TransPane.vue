<template>
  <div>
    <b-button variant="primary"
              v-b-modal.sendModal>SEND</b-button>
    <b-button variant="primary"
              v-b-modal.receiveModal>RECEIVE</b-button>
    <Send></Send>
    <Receive></Receive>
  </div>
</template>

<script>
import Receive from '../modals/Receive'
import Send from '../modals/Send'
export default {
    name: 'TransPane',
    components: {
        Receive,
        Send
    },
    methods: {

    }
}
</script>

<style scoped lang="less">
@import '../../../assets/style/common';
@import '../../../assets/style/variables';
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
