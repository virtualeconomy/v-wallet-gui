<template>
  <div id="app"
       :class="(isMobile ? 'mobile' : '')">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'App',
    methods: {
        isMobile() {
            return this.browser().android || this.browser().ios || this.browser().mobile || this.browser().iPhone
        },
        browser() {
            var u = navigator.userAgent
            return {
                trident: u.indexOf('Trident') > -1, // IE内核
                presto: u.indexOf('Presto') > -1, // opera内核
                webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), // 是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, // 是否iPad
                webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
            }
        }
    }
}
</script>

<style lang="less">
@import 'assets/style/common';
.mobile {
    zoom: 0.6 !important;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
}
</style>
