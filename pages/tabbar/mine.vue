<template>
	<view class="page-bgc">
		<view class="top">
			<view class="info-box">
				<view class="avatar"></view>
				<view class="nickname">法外狂徒--张三</view>
			</view>
			<view class="setting">
				<uni-icons class="setting-icon" type="gear-filled" color="#fff" size="20" @tap="openSetting"></uni-icons>
			</view>
		</view>
		<view class="menus">
			<uni-list>
				<uni-list-item title="收货地址" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'location-filled' }"></uni-list-item>
				<uni-list-item title="骑手端" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'contact-filled' }" @tap="relaunchPage('/pages/tabbar/list')"></uni-list-item>
				<uni-list-item title="帮助" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'help-filled' }"></uni-list-item>
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
				
			}
		},
		methods: {
			openSetting () {
				uni.openSetting()
			},
			
			relaunchPage (url) {
				uni.reLaunch({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.top {
	position: relative;
	background-color: red;
	height: 300rpx;
	.info-box {
		padding-top: 80rpx;
		text-align: center;
		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background-color: $uni-color-main;
			margin: 0 auto 20rpx;
		}
	}
	.setting {
		position: absolute;
		top: 20rpx;
		right: 10rpx;
		.setting-icon {
			padding: 20rpx;
		}
	}
}
.menus {
	margin-top: 20rpx;
}
</style>
