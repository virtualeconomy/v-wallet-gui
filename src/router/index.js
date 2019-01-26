import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Signup from '../components/Signup.vue'
import Restore from '../components/Restore.vue'
import Login from '../components/Login'
import Terms from '../components/Terms'
import Warning from '../components/Warning'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/signup',
        name: 'signup',
        component: Signup
    }, {
        path: '/restore',
        name: 'restore',
        component: Restore
    }, {
        path: '/terms',
        name: 'terms',
        component: Terms
    }, {
        path: '/warning',
        name: 'warning',
        component: Warning
    }
    ]
})
