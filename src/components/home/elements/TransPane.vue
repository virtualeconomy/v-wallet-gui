<template>
  <div class="row justify-content-between height-full">
    <div class="col-4 align-self-center text-left container">
      <span class="title">
        2000VEE
      </span>
      <p class="text-muted">
        Balance
      </p>
    </div>
    <div class="col-4 align-self-center">
    </div>
    <div class="col-4 align-self-center text-right">
      <b-button variant="primary"
                v-b-modal.sendModal><span class="glyphicon glyphicon-arrow-up"></span>Send</b-button>
      <b-button variant="primary"
                v-b-modal.receiveModal><span class="glyphicon glyphicon-arrow-down"></span>Receive</b-button>
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
    components: {
        Receive,
        Send
    },
    methods: {

    }
}
</script>

<style scoped lang="less">
.height-full {
    height: 100%;
}
.title {
    font-size: 200%;
    line-height: 120%;
}
</style>
