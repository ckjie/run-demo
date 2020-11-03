<template>
	<view class="tabbar">
		<view class="list">
			<view class="item" v-for="(item, idx) in list" :key="idx" @tap="toPage(item)">
				<image class="icon" :src="item.icon" mode="aspectFit"></image>
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
						icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
						title: '菜单',
						path: '/pages/tabbar/list'
					},
					{
						icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
						title: '我的',
						path: '/pages/tabbar/rider'
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
				this.$pageTo({
					url: item.path,
					type: 'redirectTo'
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
				}
				.active-title {
					color: $uni-color-primary;
				}
			}
		}
	}
</style>
