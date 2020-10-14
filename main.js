import Vue from 'vue'
import App from './App'
import $myRequest from './utils/myRequest'

Vue.config.productionTip = false

Vue.use($myRequest)

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
