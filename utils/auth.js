const login = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			success: res => {
				uni.request({
					url: getApp().globalData.baseUrl + '/api/login/login-with-code',
					header: {
						'x-applet-id': getApp().globalData.appid
					},
					method: 'GET',
					data: {
						code: res.code
					},
					success: res => {
						if (res.data.err_code === 0) {
							uni.setStorageSync('token', res.data.data.token)
							uni.setStorageSync('user_id', res.data.data.user_id)
							resolve(res)
						} else {
							reject(res)
						}
					},
					fail: err => {
						reject(res)
					}
				})
			}
		})
	})
}

module.exports = {
	login
}