// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueQrcodeReader from 'vue-qrcode-reader'
import VueResource from 'vue-resource'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Storage from 'vue-ls'
import jdenticon from '../static/libs/jdenticon-2.1.0'

const options = {
    namespace: 'vuejs__',
    name: 'ls',
    storage: 'memory'
}

Vue.use(Storage, options)
Vue.use(BootstrapVue)
Vue.use(VueQrcodeReader)
Vue.use(VueResource)
Vue.config.productionTip = false
Vue.use(jdenticon)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
