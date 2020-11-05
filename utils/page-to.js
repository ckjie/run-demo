export default {
	install (Vue, options) {
		Vue.prototype.$pageTo = ({url, type ='navigateTo'}) => {
			// 可访问页面列表
			const accessiblePage = [
				'pages/tabbar/index',// 首页
				'pages/tabbar/run-errands',// 跑腿tabbar页
				'pages/order/create-order',// 创建订单页，在点击提交订单前可访问
				'pages/other/rich',// 富文本页
				'pages/tabbar/mine',// 用户端-我的
				'pages/user/auth'//授权页
			]
			const userInfo = uni.getStorageSync('userInfo')
			if (userInfo) {
				uni[type] ({
					url
				})
				return
			}
			if (accessiblePage.some(item => ~url.indexOf(item))) {
				uni[type] ({
					url
				})
				return
			}
			// 目标路径为需授权路径，判断是否需跳转至授权页
			uni.getSetting({
				success: res => {
					if (!res.authSetting['scope.userInfo']) {
						uni.navigateTo({
							url: '/pages/user/auth'
						})
					} else {
						uni.getUserInfo({
							lang: 'zh_CN',
							success: res => {
								uni.setStorageSync('userInfo', res.userInfo)
							}
						})
					}
				}
			})
		}
	}
}