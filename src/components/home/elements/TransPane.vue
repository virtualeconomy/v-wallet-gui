<template>
  <div class="row justify-content-center height-full">
    <div class="col-3 align-self-center">
      <b-button variant="primary"
                size="lg"
                v-b-modal.sendModal>SEND</b-button>
    </div>
    <div class="col-3 align-self-center">
      <b-button variant="primary"
                size="lg"
                v-b-modal.receiveModal>RECEIVE</b-button>
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
</style>
