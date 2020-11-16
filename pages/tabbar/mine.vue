<template>
	<view class="page-bgc">
		<view class="top">
			<view class="info-box">
				<view class="avatar">
					<my-img :src="userInfo.avatarUrl"></my-img>
				</view>
				<view class="nickname">{{ userInfo.nickName }}</view>
			</view>
		</view>
		<view class="menus">
			<uni-list>
				<uni-list-item title="收货地址" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'location-filled' }" @tap="toPage('/pages/user/address-list')"></uni-list-item>
				<uni-list-item title="骑手端" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'contact-filled' }" @tap="checkIdentity('/pages/tabbar/list')"></uni-list-item>
				<button class="btn-item" open-type="contact">
					<uni-list-item title="帮助" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'help-filled' }"></uni-list-item>
				</button>
				<button class="btn-item" open-type="openSetting">
					<uni-list-item title="设置" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'gear-filled' }"></uni-list-item>
				</button>
			</uni-list>
		</view>
		<userTabbar></userTabbar>
	</view>
</template>

<script>
	import userTabbar from '@/components/user-tabbar/user-tabbar.vue'
	export default {
		components: {
			userTabbar
		},
		data() {
			return {
				userInfo: {},
				idemtity: null
			}
		},
		
		onLoad () {
			const info = uni.getStorageSync('userInfo')
			if (info) {
				this.userInfo = JSON.parse(info)
			} else {
				uni.getUserInfo({
					lang: 'zh_CN',
					success: res => {
						uni.setStorageSync('userInfo', JSON.stringify(res.userInfo))
						this.userInfo = res.userInfo
					}
				})
			}
			this.getIdentity()
		},
		
		methods: {
			getIdentity () {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.$myRequest({
					api: '/api/courier/check'
				}).then(res => {
					uni.hideLoading()
					if (res.data.data) {
						this.idemtity = res.data.data.status
					}
				})
			},
			
			toPage (url) {
				this.$pageTo({ url })
			},
			
			checkIdentity (url) {
				if (this.idemtity === null) {
					this.$pageTo({
						url: '/pages/user/application'
					})
					return
				}
				let message
				switch (this.idemtity) {
					case 0:
						message = '骑手申请审核中，请耐心等候'
						break
					case 2:
						message = '骑手申请已被管理员拒绝，无权访问'
						break
					case 3:
						message = '骑手状态已被管理员禁用，无权访问'
						break
					default:
						break
				}
				if (message) {
					uni.showToast({
						title: message,
						icon: 'none'
					})
					return
				}
				this.$pageTo({ url })
			},
			
			relaunchPage (url) {
				this.$pageTo({
					url,
					type: 'reLaunch'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.top {
	position: relative;
	background: linear-gradient(to bottom, #007aff, #0CD6A6);
	height: 300rpx;
	.info-box {
		padding-top: 60rpx;
		text-align: center;
		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background-color: $uni-color-main;
			margin: 0 auto 20rpx;
			/deep/ .img {
				border-radius: 50%;
			}
		}
	}
}
.menus {
	margin-top: 20rpx;
	.btn-item {
		width: 100%;
		background-color: unset;
		padding: 0;
		line-height: unset;
		text-align: unset;
		&::after {
			display: none;
		}
	}
}
</style>
