<template>
	<view class="page">
		<view class="list">
			<view class="menu-item" v-for="(item, idx) in menuList" :key="idx">
				<view class="avatar">
					<image :src="item.avatar" lazy-load="true" mode="aspectFill" @tap="previewImg(0, [item.avatar])"></image>
				</view>
				<view class="content">
					<view class="title">{{ item.title }}</view>
					<view class="introduction">{{ item.introduction }}</view>
					<view v-if="item.picList.length === 1" class="single-pic">
						<image class="pic-item" :src="item.picList[0]" lazy-load="true" mode="aspectFill" @tap="previewImg(0, item.picList)"></image>
					</view>
					<view v-else-if="item.picList.length === 2" class="double-pic">
						<image class="pic-item" v-for="(picItem, picIdx) in item.picList" :key="picIdx" :src="picItem" lazy-load="true" mode="aspectFill" @tap="previewImg(picIdx, item.picList)"></image>
					</view>
					<view v-else class="pic-list">
						<image class="pic-item" v-for="(picItem, picIdx) in item.picList" :key="picIdx" :src="picItem" lazy-load="true" mode="aspectFill" @tap="previewImg(picIdx, item.picList)"></image>
						<view v-if="item.picList.length % 3 === 2" class="pic-item fill-item"></view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status" iconSize="20"></uni-load-more>
		</view>
		
		<userTabbar></userTabbar>
		<!-- <view class="intro">本项目已包含uni ui组件，无需import和注册，可直接使用。在代码区键入字母u，即可通过代码助手列出所有可用组件。光标置于组件名称处按F1，即可查看组件文档。</view>
		<text class="intro">详见：</text>
		<button type="default" @click="choice">点击选择位置</button>
		<uni-link :href="href" :text="href"></uni-link> -->
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
				status: 'more',
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				menuList: [
					{
						avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
						title: '标题',
						introduction: '简介内容',
						picList: [
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg'
						]
					},
					{
						avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
						title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
						introduction: '简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
						picList: [
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg'
						]
					},
					{
						avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg',
						title: '标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
						introduction: '简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
						picList: [
							'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1601991478011&di=1a95f56a96d3c30da6a8fdb3befbbb9e&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181207%2Fab2c053183994bb8bdddd716da413ad8.jpeg'
						]
					}
				]
			}
		},
		
		onReachBottom () {
			if (this.menuList.length >= 10) {
				this.status = 'noMore'
				return
			}
			if (this.status === 'loading') return
			this.status = 'loading'
			setTimeout(() => {
				const list = JSON.parse(JSON.stringify(this.menuList.slice((0, 2))))
				this.menuList = this.menuList.concat(list)
				this.status = 'more'
			}, 1500)
		},
		
		methods: {
			previewImg (idx, list) {
				uni.previewImage({
					current: idx || 0,
					urls: list
				})
			},
			
			choice () {
				uni.chooseLocation({
					success: (res) => {
						console.log(res, 'res')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.list {
	padding: 20rpx 20rpx 120rpx;
	.menu-item {
		margin-bottom: 30rpx;
		display: flex;
		align-items: flex-start;
		.avatar {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
			image {
				width: 100%;
				height: 100%;
				border-radius: 6rpx;
			}
		}
		.content {
			min-width: 0;
			flex: 1;
			.title {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				font-weight: 600;
				font-size: larger;
				letter-spacing: 2rpx;
			}
			.introduction {
				padding: 10rpx 0;
			}
			.single-pic {
				.pic-item {
					width: 300rpx;
					height: 300rpx;
					border-radius: 6rpx;
				}
			}
			.double-pic {
				.pic-item {
					width: 240rpx;
					height: 240rpx;
					margin-right: 10rpx;
					border-radius: 6rpx;
				}
			}
			.pic-list {
				width: 100%;
				padding-right: 30rpx;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				.pic-item {
					width: 190rpx;
					height: 190rpx;
					margin-bottom: 10rpx;
					border-radius: 6rpx;
				}
			}
		}
	}
}
</style>
