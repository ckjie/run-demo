import { login } from './auth.js'

export default {
	install (Vue, options) {
		Vue.prototype.$myRequest = ({api, params, methods = 'POST'}) => {
			return new Promise((resolve, reject) => {
				const token = uni.getStorageSync('token')
				if (!token) {
					login().then(res => {
						uni.request({
							url: getApp().globalData.baseUrl + api,
							header: {
								'x-applet-id': getApp().globalData.appid,
								'authorization': 'Bearer ' + res.data.data.token
							},
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
				} else {
					uni.request({
						url: getApp().globalData.baseUrl + api,
						header: {
							'x-applet-id': getApp().globalData.appid,
							'authorization': 'Bearer ' + token
						},
						data: params,
						method: methods,
						success: res => {
							resolve(res)
						},
						fail: err => {
							reject(err)
						}
					})
				}
			})
		}
	}
}