import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import car from './modules/car'
import path from './modules/path'
import user from './modules/user'
import order from './modules/order'
const store = new Vuex.Store({
	modules:{
		car:car,
		path,
		user,
		order
	}
})

export default store