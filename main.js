import Vue from 'vue'
import App from './App'
import $myRequest from './utils/myRequest'
import $pageTo from './utils/page-to'

Vue.config.productionTip = false

Vue.use($myRequest)
Vue.use($pageTo)

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
