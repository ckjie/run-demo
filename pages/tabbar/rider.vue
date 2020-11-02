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
				<uni-list-item title="成为骑手" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'contact-filled' }" @tap="relaunchPage('/pages/user/application')"></uni-list-item>
				<button class="btn-item" open-type="contact">
					<uni-list-item title="帮助" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'help-filled' }"></uni-list-item>
				</button>
				<button class="btn-item" open-type="openSetting">
					<uni-list-item title="设置" showExtraIcon="true" :extraIcon="{ color: '#999', size: '16', type: 'gear-filled' }"></uni-list-item>
				</button>
			</uni-list>
		</view>
		<riderTabbar></riderTabbar>
	</view>
</template>

<script>
	import riderTabbar from '@/components/rider-tabbar/rider-tabbar.vue'
	export default {
		components: {
			riderTabbar
		},
		data() {
			return {
				userInfo: {}
			}
		},
		
		onLoad() {
			const info = uni.getStorageSync('userInfo')
			if (info) {
				this.userInfo = JSON.parse(info)
			}
		},
		
		methods: {
			toPage (url) {
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
	// background-color: red;
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
			/deep/ .img {
				border-radius: 50%;
			}
		}
	}
	.setting {
		position: absolute;
		top: 20rpx;
		right: 10rpx;
		.icon-item {
			padding: 0 10rpx;
			background-color: unset;
			line-height: unset;
			&::after {
				display: none;
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
