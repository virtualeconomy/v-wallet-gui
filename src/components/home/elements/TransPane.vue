<template>
  <div class="row justify-content-between height-full">
    <div class="col-4 align-self-center text-left tran-head">
      <span class="title">
        {{ balance }}VEE
      </span>
      <p class="text-muted text-des mb-0">
        Balance
      </p>
    </div>
    <div class="col-8 align-self-center text-right">
      <b-button variant="primary"
                class="btn-send"
                v-b-modal.sendModal>
        <img
          class="icon-btn"
          src="../../../assets/imgs/icons/wallet/ic_send.svg"><b>Send</b></b-button>
      <b-button variant="primary"
                class="btn-receive"
                v-b-modal.receiveModal>
        <img
          class="icon-btn"
          src="../../../assets/imgs/icons/wallet/ic_receive.svg"><b>Receive</b></b-button>
    </div>
    <Send show="false"></Send>
    <Receive show="false"></Receive>
  </div>
</template>

<script>
import Receive from '../modals/Receive'
import Send from '../modals/Send'
export default {
    name: 'TransPane',
    props: {
        balance: {
            type: Number,
            default: 0,
            require: true
        }
    },
    components: {
        Receive,
        Send
    }
}
</script>

<style scoped lang="less">
@import '../../../assets/style/common';
@import '../../../assets/style/variables';
.height-full {
    height: 100%;
}
.title {
    font-size: 200%;
    line-height: 120%;
}
.btn-send {
    background-color: @sendColor;
    color: white;
    border: 1px solid @sendColor;
    width: 124px;
    height: 42px;
}
.btn-receive {
    margin-left: 15px;
    background-color: @receiveColor;
    color: white;
    border: 1px solid @receiveColor;
    width: 124px;
    height: 42px;
}
.tran-head {
    padding-left: 38px;
}
.icon-btn {
    margin-right: 10px;
}
</style>
