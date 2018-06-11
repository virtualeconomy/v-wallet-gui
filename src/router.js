import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './views/Signup.vue'
import Restore from './views/Restore.vue'
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: 'login',
      name: 'login',
      component: Login
    }, {
      path: 'signup',
      name: 'signup',
      component: Signup
    }, {
      path: 'restore',
      name: 'restore',
      component: Restore
    }
  ]
})
