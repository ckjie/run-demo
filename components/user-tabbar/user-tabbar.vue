<template>
	<view class="tabbar">
		<view class="list">
			<view class="item" v-for="(item, idx) in list" :key="idx" @tap="toPage(item)">
				<image class="icon" :src="item.path === currentRoute ? item.icon_1 : item.icon_0" mode="aspectFit"></image>
				<view class="title" :class="{'active-title': item.path === currentRoute}">{{ item.title }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				currentRoute: '',
				list: [
					{
						icon_0: require('@/static/img/home_0.png'),
						icon_1: require('@/static/img/home_1.png'),
						title: '菜单',
						path: '/pages/tabbar/index'
					},
					{
						icon_0: require('@/static/img/run_0.png'),
						icon_1: require('@/static/img/run_1.png'),
						title: '跑腿',
						path: '/pages/tabbar/run-errands'
					},
					{
						icon_0: require('@/static/img/list_0.png'),
						icon_1: require('@/static/img/list_1.png'),
						title: '订单',
						path: '/pages/tabbar/order'
					},
					{
						icon_0: require('@/static/img/user_0.png'),
						icon_1: require('@/static/img/user_1.png'),
						title: '我的',
						path: '/pages/tabbar/mine'
					}
				]
			}
		},
		
		created () {
			const currentRoute = '/' + getCurrentPages()[getCurrentPages().length - 1].route
			this.currentRoute = currentRoute
		},
		
		methods: {
			toPage (item) {
				if (item.path === this.currentRoute) return
				this.$pageTo({
					url: item.path,
					type: 'reLaunch'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabbar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #FFFFFF;
		&::before {
			content: '';
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			border-top: 1px solid #999999;
			transform: scaleY(.5);
		}
		.list {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				line-height: 1.2;
				flex: 1;
				.icon {
					width: 50rpx;
					height: 50rpx;
					margin-bottom: 10rpx;
				}
				.title {
					font-size: 24rpx;
					color: $uni-text-color-grey;
				}
				.active-title {
					color: $uni-color-main;
				}
			}
		}
	}
</style>
