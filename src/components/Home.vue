<template>
  <div class="home">
    <div class="nav">
      <nav-bar></nav-bar>
    </div>
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
<style scoped>
.home {
    width: 100%;
    height: 100%;
}
.nav {
    width: 100%;
    height: 72px;
}

</style>
