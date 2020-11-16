<template>
	<view class="page">
		<view class="top-pic">
			<image src="../../static/img/run-top-bg.png" mode=""></image>
		</view>
		<view class="grid-box">
			<uni-grid :column="2">
				<uni-grid-item v-for="item in gridList" :key="item.key">
					<view class="grid-item" @tap="toPage('/pages/order/create-order?key=' + item.key)">
						<image :src="item.icon" mode="aspectFit"></image>
						<view>{{ item.title }}</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="description">
			<view class="title">跑腿特色</view>
			<view class="flex list">
				<view class="item" @tap="toPage('/pages/other/rich?key=KEY_SERVICE_AGREEMENT')">
					<view class="flex icon-box">
						<uni-icons type="sound" size="24"></uni-icons>
					</view>
					<view>价格问题</view>
				</view>
			</view>
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
				gridList: [
					{
						title: '帮我买',
						key: 'buy',
						icon: '/static/img/buy.png'
					},
					{
						title: '代取送',
						key: 'deliver',
						icon: '/static/img/send.png'
					},
					{
						title: '帮帮我',
						key: 'transact',
						icon: '/static/img/handle.png'
					},
					{
						title: '包裹单',
						key: 'pickup',
						icon: '/static/img/take.png'
					}
				]
			}
		},
		methods: {
			toPage (url) {
				this.$pageTo({ url })
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	padding: 270rpx 0 120rpx;
}
.top-pic {
	width: 100%;
	height: 420rpx;
	background-color: yellowgreen;
	position: absolute;
	top: 0;
	left: 0;
	image {
		width: 100%;
		height: 100%;
	}
}
.grid-box {
	width: 80%;
	margin: 0 auto;
	position: relative;
	z-index: 1;
	background-color: #FFFFFF;
	box-shadow: 0 40rpx 40rpx -40rpx #ccc;
	.grid-item {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #707070;
		image {
			width: 120rpx;
			height: 120rpx;
			margin-bottom: 20rpx;
		}
	}
}

.description {
	margin-top: 80rpx;
	text-align: center;
	.title {
		font-size: 30rpx;
		font-weight: 600;
	}
	.list {
		justify-content: center;
		margin-top: 30rpx;
		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 0 30rpx;
			.icon-box {
				width: 80rpx;
				height: 80rpx;
				justify-content: center;
				border: 1px solid #000;
				border-radius: 50%;
				margin-bottom: 10rpx;
				text-align: center;
			}
		}
	}
}
</style>
