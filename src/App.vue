<template>
  <div id="app"
       :class="(isMobile ? 'mobile' : '')">
    <router-view></router-view>
  </div>
</template>

<script>
import browser from '../src/utils/browser'
export default {
    name: 'App',
    data() {
        return {
            isMobile: false
        }
    },
    created() {
        this.isMobile = browser.isMobile()
    }
}
</script>

<style lang="less">
@import 'assets/style/common';
.mobile {
    zoom: 0.7 !important;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
</style>
