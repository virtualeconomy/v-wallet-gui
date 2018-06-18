<template>
  <div>
    <b-button variant="primary"
              v-b-modal.sendModal>SEND</b-button>
    <b-button variant="primary"
              v-b-modal.receiveModal>RECEIVE</b-button>
    <b-modal id="sendModal"
             centered
             title="Send"></b-modal>
    <b-modal id="receiveModal"
             centered
             title="Receive"></b-modal>
  </div>
</template>

<script>
export default {
    name: 'TransPane',
    components: {

    },
    methods: {

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
