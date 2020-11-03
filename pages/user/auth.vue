<template>
	<view class="page">
		<view class="logo-box">
			<image src="../../static/img/logo.png" mode="widthFix"></image>
		</view>
		<view class="main">
			<view class="text">打洛闪电跑腿希望获取您的账号信息，用于提供更好的服务</view>
			<button class="btn-item submit-btn" type="primary" size="mini" open-type="getUserInfo" @getuserinfo="getUserInfo">微信授权</button>
			<button class="btn-item" type="default" size="mini" @tap="goHome">返回首页</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		
		methods: {
			getUserInfo (res) {
				const userInfo = res.detail.userInfo
				uni.setStorageSync('userInfo', JSON.stringify(userInfo))
				if (userInfo) {
					const user_id = uni.getStorageSync('user_id')
					this.$myRequest({
						api: '/api/user/set-property',
						params: {
							nickname: userInfo.nickName,
							avatar: userInfo.avatarUrl,
							sex: userInfo.gender + ''
						}
					}).then(res => {
						uni.navigateBack({
							delta: 1
						})
					}).catch(err => {
						uni.navigateBack({
							delta: 1
						})
					})
				}
			},
			
			goHome () {
				this.$pageTo({
					url: '/pages/tabbar/index',
					type: 'reLaunch'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.logo-box {
	margin: 0 auto;
	padding: 80rpx 0 40rpx;
	text-align: center;
	image {
		width: 300rpx;
	}
}

.main {
	padding: 100rpx 10% 0;
	text-align: center;
	.text {
		padding: 30rpx 120rpx 100rpx;
	}
	.btn-item {
		width: 100%;
		padding: 10rpx 0;
		margin-bottom: 20rpx;
	}
	.submit-btn {
		background-color: $uni-color-main;
	}
}
</style>
