<template>
  <div class="home">
    <div class="nav">
      <nav-bar></nav-bar>
    </div>
    <!--<div class="transaction-pane">-->
    <!--<b-button></b-button>-->
    <!--</div>-->
  </div>
</template>

<script>
// @ is an alias to /src
import bButton from 'bootstrap-vue/es/components/button/button'
import bModal from 'bootstrap-vue/es/components/modal/modal'
import NavBar from './home/NavBar'

export default {
    name: 'Home',
    components: {
        NavBar,
        bModal,
        bButton
    }
}
</script>
<style scoped lang="less">
@import '../assets/style/variables';
@import '../assets/style/common';
.home {
    width: 100%;
    height: 100%;
}
.nav {
    width: 100%;
    height: @topNavH;
    background-color: @navBgColor;
}

</style>
