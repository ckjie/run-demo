<template>
	<view class="page page-bgc">
		<v-tabs v-model="current" :fixed="true" :tabs="tabs" :field="'label'" :activeColor="'#0CD6A6'" :lineColor="'#0CD6A6'"></v-tabs>
		<swiper class="swiper" style="height: 100%;" @change='scollSwiper' :current='current'>
			<swiper-item v-for="(item,index) in tabs" :key='index'>
					<!-- 使用 scroll-view 来滚动内容区域 -->
				<scroll-view
					scroll-y="true"
					style="height: 100%;"
					@scrolltolower="isBottom">
					<view v-for="child in item.list" :key="child.order_hash" class="order-item" @tap="toDetailPage(child)">
						<view class="title">{{ child.type | formatType }}</view>
						<view class="flex content">
							<view class="remark">购买商品：{{child.addition.remark}}</view>
							<view class="price">￥{{child.pay_price}}</view>
						</view>
						<view class="flex about">
							<view class="time">{{child.created_at | formatDate}}</view>
							<view class="status">{{child.status | formatStatus}}</view>
						</view>
						<view v-if="['0', '1'].includes(child.status)" class="flex btn-list">
							<view v-if="child.status === '0'" class="btn-item" @tap.stop="carryOnPay(child)">立即支付</view>
							<view class="btn-item" @tap.stop="cancelOrder(child)">取消订单</view>
						</view>
					</view>
					<uni-load-more :status="status" iconSize="20"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<userTabbar></userTabbar>
	</view>
</template>

<script>
	import userTabbar from '@/components/user-tabbar/user-tabbar.vue'
	export default {
		components: {
			userTabbar
		},
		
		filters: {
			formatDate: (time) => {
				if (time <= 0) return time
				const date = new Date(time * 1000)
				const y = date.getFullYear()
				const m = ('0' + (date.getMonth() + 1)).slice(-2)
				const d = ('0' + date.getDate()).slice(-2)
				const time2 = date.toTimeString().slice(0, 5)
				return `${y}-${m}-${d} ${time2}`
			},
			
			formatType: (val) => {
				let typeName
				switch (val) {
					case '1':
						typeName = '帮我买'
						break
					case '2':
						typeName = '代取送'
						break
					case '3':
						typeName = '帮帮我'
						break
					case '4':
						typeName = '包裹单'
						break
					default:
						break
				}
				return typeName
			},
			
			formatStatus: (val) => {
				let statusName
				switch (val) {
					case '0':
						statusName = '待支付'
						break
					case '1':
						statusName = '待接单'
						break
					case '2':
						statusName = '已接单'
						break
					case '3':
						statusName = '已送达'
						break
					case '4':
						statusName = '已完成'
						break
					case '5':
						statusName = '已取消'
						break
					case '6':
						statusName = '已退款'
						break
					default:
						break
				}
				return statusName
			}
		},
		
		data() {
			return {
				current: 0,
				status: 'more',
				tabs: [
					{ key: 'all', label: '全部', list: [] },
					{ key: '0', label: '待支付', list: [] },
					{ key: '1', label: '待接单', list: [] },
					{ key: '2', label: '已接单', list: [] },
					{ key: '3', label: '已送达', list: [] },
					{ key: '4', label: '已完成', list: [] },
					{ key: '5', label: '已取消', list: [] },
					{ key: '6', label: '已退款', list: [] }
				],
				page: 1,
				size: 20
			}
		},
		
		onLoad() {
			this.getList()
		},
		
		methods: {
			getList () {
				if (this.status === 'loading') return
				this.status = 'loading'
				const status = +(this.tabs[this.current].key) >= 0 ? this.tabs[this.current].key : ''
				const params = {
					page: this.page,
					size: this.size,
					status
				}
				this.$myRequest({
					api: '/api/order/list-with-user',
					params
				}).then(res => {
					uni.hideLoading()
					if (res.data.data.length < this.size) {
						this.status = 'noMore'
					} else {
						this.status = 'more'
					}
					res.data.data.forEach(item => {
						item.addition.params = JSON.parse(item.addition.params)						
						this.tabs[this.current].list.push(item)
					})
				})
			},
			
			toDetailPage (item) {
				const url = '/pages/order/order-detail?order_hash=' + item.order_hash
				this.$pageTo({
					url,
				})
			},
			
			carryOnPay (item) {
				uni.showLoading({
					title: '操作中...'
				})
				this.$myRequest({
					api: '/api/order/pay-order',
					methods: 'GET',
					params: {
						order_hash: item.order_hash
					}
				}).then(res => {
					if (res.data.err_code === 0) {
						const data = res.data.data
						uni.requestPayment({
							provider: 'wxpay',
							nonceStr: data.nonceStr,
							package: data.package,
							timeStamp: data.timeStamp,
							signType: data.signType,
							paySign: data.paySign,
							success: res2 => {
								uni.hideLoading()
								uni.showToast({
									title: '支付成功',
									icon: 'success'
								})
								this.tabs[this.current].list.splice(0)
								this.page = 1
								this.status = 'more'
								this.getList()
							},
							fail: err => {
								uni.hideLoading()
								uni.showToast({
									title: '支付失败',
									icon: 'none'
								})
							}
						})
					} else {
						uni.hideLoading()
						uni.showToast({
							title: '操作失败，请重试',
							icon: 'none'
						})
					}
				})
			},
			
			cancelOrder (item) {
				uni.showModal({
					content: '确认取消该订单？',
					confirmColor: '#0CD6A6',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '操作中...'
							})
							this.$myRequest({
								api: '/api/order/cancel',
								methods: 'GET',
								params: {
									order_hash: item.order_hash
								}
							}).then(res => {
								uni.hideLoading()
								if (res.data.err_code === 0) {
									uni.showToast({
										title: '取消成功'
									})
									this.tabs[this.current].list.splice(0)
									this.page = 1
									this.status = 'more'
									this.getList()
								} else {
									uni.showToast({
										title: '操作失败，请重试',
										icon: 'none'
									})
								}
							})
						}
					}
				})
			},
			
			scollSwiper (e) {
				this.current = e.target.current
				this.page = 1
				this.status = 'more'
				this.tabs[this.current].list.splice(0)
				this.getList()
			},
			
			isBottom () {
				if (this.status === 'noMore') return
				this.page += 1
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}

.page {
	padding-bottom: 160rpx;
	box-sizing: border-box;
	height: 100%;
	.swiper {
		padding: 20rpx;
		box-sizing: border-box;
	}
	.order-item {
		background-color: #FFFFFF;
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		.title {
			font-size: 32rpx;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #F0F0F0;
		}
		.content, .about {
			justify-content: space-between;
		}
		.content {
			padding: 20rpx 0 10rpx;
			font-size: 28rpx;
			.remark {
				width: 0;
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 40rpx;
			}
			.price {
				flex-shrink: 0;
			}
		}
		.about {
			view {
				font-size: 24rpx;
			}
			.time {
				color: #999999;
			}
			.status {
				color: $uni-color-main;
			}
		}
		.btn-list {
			border-top: 1px solid #F0F0F0;
			overflow-x: hidden;
			margin: 20rpx -20rpx -20rpx;
			.btn-item {
				padding: 20rpx 0;
				flex: 1;
				text-align: center;
				border-right: 1px solid #F0F0F0;
				margin-right: -1px;
			}
		}
	}
}
</style>
