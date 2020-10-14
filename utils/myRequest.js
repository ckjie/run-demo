export default {
	install (Vue, options) {
		Vue.prototype.$myRequest = ({api, params, methods = 'POST'}) => {
			return new Promise((resolve, reject) => {
				uni.request({
					url: getApp().globalData.baseUrl + api,
					data: params,
					method: methods,
					success: res => {
						resolve(res)
					},
					fail: err => {
						reject(err)
					}
				})
			})
		}
	}
}