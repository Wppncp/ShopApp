import App from './App'
import config from './config/index.js'

// #ifndef VUE3
import Vue from 'vue'
import store from './store/index.js'
Vue.config.productionTip = false

Vue.prototype.$store = store

Vue.prototype.$baseURL = config.baseURL
var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
// console.log('这是不带端口网址'+config.baseURL.match(reg))
Vue.prototype.$URL = config.baseURL.match(reg)

Vue.prototype.navigateTo = (options)=>{
	if(!store.state.user.loginStatus){
		uni.showToast({
			title:"请先登录"
		})
		return uni.navigateTo({
			url:'/pages/login/login'
		})
	}
	uni.navigateTo(options)
}

App.mpType = 'app'
const app = new Vue({ ...App,store })
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
// #endif