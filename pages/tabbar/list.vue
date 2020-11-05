<template>
	<view class="page page-bgc">
		<v-tabs v-model="current" :fixed="true" :scroll="false" :tabs="tabs" :field="'label'" :activeColor="'#0CD6A6'" :lineColor="'#0CD6A6'"></v-tabs>
		<swiper class="swiper" style="height: 100%;" @change='scollSwiper' :current='current'>
			<swiper-item v-for="(item,index) in tabs" :key='index'>
					<!-- 使用 scroll-view 来滚动内容区域 -->
				<scroll-view
					scroll-y="true"
					style="height: 100%;"
					@scrolltolower="isBottom">
					<view v-for="child in item.list" :key="child.order_hash" class="order-item" @tap="toDetailPage(child)">
						<view class="flex title">
							<view>{{ child.type | formatType }}</view>
							<view class="status">{{ child.status | formatStatus }}</view>
						</view>
						<view class="flex content">
							<view class="remark">购买商品：{{child.remark}}</view>
							<view class="price">￥{{child.pay_price}}</view>
						</view>
						<view class="flex content">
							<view class="remark">下单时间</view>
							<view class="price">{{child.created_at | formatDate}}</view>
						</view>
						<view class="flex content">
							<view class="remark">送达时间</view>
							<view class="price">{{child.params.isNow ? '立即送达' : (child.params.expect_deliver_at | formatDate)}}</view>
						</view>
						<block v-if="child.type === '1'">
							<view class="flex content">
								<view class="label">购买地址</view>
								<view class="detail">{{ child.params.buyType === 'address' ? child.params.buyAddress.address : '就近购买' }} <text v-if="current === 0 && child.params.buyType === 'address' && child.params.buyAddress" class="distance">（距离：{{ locationDistance(child.params.buyAddress) }})</text></view>
							</view>
						</block>
						<block v-if="child.type === '2' && child.params.deliverAddress">
							<view class="flex content">
								<view class="label">取货地址</view>
								<view class="detail">{{child.params.deliverAddress.address}} <text v-if="current === 0" class="distance">（距离：{{ locationDistance(child.params.deliverAddress) }})</text></view>
							</view>
						</block>
						<block v-if="child.type === '3'">
							<view class="flex content">
								<view class="label">代办点</view>
								<view class="detail">{{child.params.transactAddress1.address}} <text v-if="current === 0" class="distance">（距离：{{ locationDistance(child.params.transactAddress1) }})</text></view>
							</view>
						</block>
						<block v-if="child.type === '4'">
							<view class="flex content">
								<view class="label">取件地址</view>
								<view class="detail">{{child.params.pickupAddress.address}} <text v-if="current === 0" class="distance">（距离：{{ locationDistance(child.params.pickupAddress) }})</text></view>
							</view>
						</block>
						<view class="flex content">
							<view class="label">收货地址</view>
							<view v-if="['1', '2', '4'].includes(child.type)" class="detail">{{child.params.receiptAddress.address}} <text v-if="current === 0" class="distance">（距离：{{ locationDistance(child.params.receiptAddress) }})</text></view>
							<view v-else class="detail">{{child.params.transactAddress2.address}} <text v-if="current === 0" class="distance">（距离：{{ locationDistance(child.params.transactAddress2) }})</text></view>
						</view>
						<view v-if="Number(current) === 0" class="flex btn-list">
							<view class="btn-item" @tap.stop="grabOrder(child)">抢单</view>
						</view>
						<view v-if="Number(current) === 1 && child.status === '2'" class="flex btn-list">
							<view class="btn-item" @tap.stop="isService(child)">送达</view>
						</view>
					</view>
					<uni-load-more :status="status" iconSize="20"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<riderTabbar></riderTabbar>
	</view>
</template>

<script>
	import riderTabbar from '@/components/rider-tabbar/rider-tabbar.vue'
	import { getDistance } from '@/utils/getDistance.js'
	export default {
		components: {
			riderTabbar
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
					{ key: '0', label: '可接单', list: [] },
					{ key: '1', label: '已接单', list: [] }
				],
				page: 1,
				size: 20,
				currentLocation: {}
			}
		},
		
		onLoad() {
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					this.currentLocation = Object.assign({}, this.currentLocation, {
						latitude: res.latitude,
						longitude: res.longitude
					})
					this.getList()
				},
				fail: err => {
					uni.showToast({
						title: '地理位置授权失败，请在个人中心设置中打开授权',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1500)
				}
			})
		},
		
		methods: {
			getList () {
				if (this.status === 'loading') return
				this.status = 'loading'
				const params = {
					page: this.page,
					size: this.size
				}
				this.$myRequest({
					api: '/api/order/list-with-order',
					params
				}).then(res => {
					uni.hideLoading()
					uni.getLocation({type: 'gcj02'}).then(result => {
						this.currentLocation = Object.assign({}, this.currentLocation, {
							latitude: result[1].latitude,
							longitude: result[1].longitude
						})
						if (res.data.data.length < this.size) {
							this.status = 'noMore'
						} else {
							this.status = 'more'
						}
						res.data.data.forEach(item => {
							item.addition.params = JSON.parse(item.addition.params)
							item = {
								...item.addition,
								...item
							}
							delete item.addition
							this.tabs[this.current].list.push(item)
						})
					})
				})
			},
			
			getList2 () {
				if (this.status === 'loading') return
				this.status = 'loading'
				const params = {
					page: this.page,
					size: this.size
				}
				this.$myRequest({
					api: '/api/order/list-with-courier',
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
						item = {
							...item.addition,
							...item
						}
						delete item.addition
						this.tabs[this.current].list.push(item)
						if (item.status === '2' && !getApp().globalData.timers.get(item.order_hash)) {
							getApp().globalData.timers.set(item.order_hash, setInterval(() => {
								uni.getLocation({
									type: 'gcj02',
									success: res => {
										const obj = {
											order_hash: item.order_hash,
											longitude: res.longitude,
											latitude: res.latitude,
										}
										this.setLocation(obj)
									}
								})
							}, 12000))
						}
					})
				})
			},
			
			locationDistance (row) {
				let distance = getDistance(this.currentLocation.latitude, this.currentLocation.longitude, row.latitude, row.longitude)
				distance = distance > 1 ? distance.toFixed(2) + '公里' : Math.round(distance * 1000) + '米'
				return distance
			},
			
			grabOrder (item) {
				uni.showLoading({
					title: '操作中...'
				})
				this.$myRequest({
					api: '/api/order/order',
					methods: 'GET',
					params: {
						order_hash: item.order_hash
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.err_code === 0) {
						uni.showToast({
							title: '抢单成功'
						})
						this.tabs[this.current].list.splice(0)
						this.page = 1
						this.status = 'more'
						this.getList()
						getApp().globalData.timers.set(item.order_hash, setInterval(() => {
							uni.getLocation({
								type: 'gcj02',
								success: res => {
									const obj = {
										order_hash: item.order_hash,
										longitude: res.longitude,
										latitude: res.latitude,
									}
									this.setLocation(obj)
								}
							})
						}, 12000))
					} else {
						uni.showToast({
							title: '抢单失败，请重试',
							icon: 'none'
						})
					}
				})
			},
			
			setLocation (agus) {
				const params = {
					order_hash: agus.order_hash,
					params: {
						longitude: agus.longitude,
						latitude: agus.latitude,
					}
				}
				this.$myRequest({
					api: '/api/order/add-track-log',
					params
				}).then(res => {})
			},
			
			isService (item) {
				uni.showModal({
					content: '是否确认送达？',
					confirmColor: '#0CD6A6',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '操作中...'
							})
							this.$myRequest({
								api: '/api/order/deliver',
								methods: 'GET',
								params: {
									order_hash: item.order_hash
								}
							}).then(res => {
								uni.hideLoading()
								if (res.data.err_code === 0) {
									uni.showToast({
										title: '送达成功'
									})
									this.tabs[this.current].list.splice(0)
									this.page = 1
									this.status = 'more'
									clearInterval(getApp().globalData.timers.get(item.order_hash))
									getApp().globalData.timers.set(item.order_hash, '')
									this.getList2()
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
			
			toDetailPage (item) {
				const url = '/pages/order/orders-detail?order_hash=' + item.order_hash
				this.$pageTo({
					url,
				})
			},

			scollSwiper (e) {
				this.current = e.target.current
				this.page = 1
				this.status = 'more'
				this.tabs[this.current].list.splice(0)
				if (+this.current === 0) {
					this.getList()
				} else {
					this.getList2()
				}
			},
			
			isBottom () {
				if (this.status === 'noMore') return
				this.page += 1
				if (+this.current === 0) {
					this.getList()
				} else {
					this.getList2()
				}
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
			view {
				font-size: 32rpx;
			}
			padding-bottom: 20rpx;
			border-bottom: 1px solid #F0F0F0;
			margin-bottom: 20rpx;
			.status {
				margin-left: auto;
				color: $uni-color-main;
			}
		}
		.content {
			padding-bottom: 10rpx;
			font-size: 28rpx;
			align-items: baseline;
			justify-content: space-between;
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
			.label {
				flex-shrink: 0;
				margin-right: 30rpx;
			}
			.distance {
				color: $uni-color-error;
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
				color: $uni-color-main;
			}
		}
	}
}
</style>
