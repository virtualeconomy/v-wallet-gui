import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Signup from '../components/Signup.vue'
import Restore from '../components/Restore.vue'
import Login from '../components/Login'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'Home',
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
	}]
})
