<template>
	<view class="page">
		<view class="list">
			<view class="menu-item" v-for="(item, idx) in menuList" :key="idx">
				<view class="avatar">
					<my-img :src="item.avatar"></my-img>
				</view>
				<view class="content">
					<view class="title">{{ item.title }}</view>
					<view class="introduction">{{ item.detail }}</view>
					<view v-if="item.picList.length === 1" class="single-pic">
						<view class="pic-item" v-for="(picItem, picIdx) in item.picList" :key="picIdx">
							<my-img :src="picItem"></my-img>
						</view>
					</view>
					<view v-else-if="item.picList.length === 2" class="flex double-pic">
						<view class="pic-item" v-for="(picItem, picIdx) in item.picList" :key="picIdx">
							<my-img :src="picItem" :previewList="item.picList" :previewIdx="picIdx"></my-img>
						</view>
					</view>
					<view v-else-if="item.picList.length >= 3" class="pic-list">
						<view class="pic-item" v-for="(picItem, picIdx) in item.picList" :key="picIdx">
							<my-img :src="picItem" :previewList="item.picList" :previewIdx="picIdx"></my-img>
						</view>
						<view v-if="item.picList.length % 3 === 2" class="pic-item fill-item"></view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status" iconSize="20"></uni-load-more>
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
				pageNum: 1,
				pageSize: 20,
				status: 'more',
				menuList: []
			}
		},
		
		onLoad() {
			this.getData()
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
			getData () {
				if (this.status === 'loading') return
				this.status = 'loading'
				this.$myRequest({
					api: '/api/menu/list',
					params: {
						page: this.pageNum,
						size: this.pageSize
					}
				}).then(res => {
					if (res.data.err_code !== 0) return
					if (res.data.data.length < this.pageSize) {
						this.status = 'noMore'
					} else {
						this.status = 'more'
					}
					res.data.data.forEach(item => {
						item.content && (item.content = JSON.parse(item.content))
						item.detail = item.content ? item.content.detail : ''
						item.picList = item.content ? item.content.picList : [],
						this.menuList.push(item)
					})
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
				word-break: break-all;
			}
			.single-pic {
				.pic-item {
					width: 300rpx;
					height: 300rpx;
				}
			}
			.double-pic {
				.pic-item {
					width: 240rpx;
					height: 240rpx;
					margin-right: 10rpx;
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
					// border-radius: 6rpx;
				}
			}
		}
	}
}
</style>
