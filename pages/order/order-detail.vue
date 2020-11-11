<template>
	<view class="page page-bgc">
		<view v-if="detail.status === '2'" class="map-module">
			<map style="width: 100%; height: 600rpx;"
				:include-points="includePoints"
				:markers="markers"
				:controls="controls"
				@controltap="tapControl"></map>
		</view>
		<view v-if="detail.status === '5'" class="status-box">已取消</view>
		<view v-if="detail.status === '6'" class="status-box">已退款</view>
		<view class="section">
			<view class="title">订单状态</view>
			<view class="detail">
				<uni-list>
					<uni-list-item title="订单类型" :rightText="detail.typeName" :showArrow="false"></uni-list-item>
					<uni-list-item :title="'订单' + detail.statusName" :rightText="detail.showTime" :showArrow="false"></uni-list-item>
				</uni-list>
			</view>
		</view>
		<view class="section">
			<view class="title">订单明细</view>
			<view class="detail">
				<uni-list>
					<uni-list-item title="配送费" :rightText="'￥' + (Number(detail.pay_price) + Number(detail.addition_price))" :showArrow="false"></uni-list-item>
					<uni-list-item title="小费" :rightText="'￥' + detail.tip" :showArrow="false"></uni-list-item>
					<uni-list-item :rightText="'合计：￥' + (Number(detail.pay_price) + Number(detail.addition_price) + Number(detail.tip))" :showArrow="false"></uni-list-item>
				</uni-list>
			</view>
		</view>
		
		<view class="section">
			<view class="title">{{ detail.type === '1' ? '商品信息' : '物品信息' }}</view>
			<view class="detail">
				<uni-list>
					<uni-list-item :title="detail.type === '1' ? '购买商品' : '物品信息'" :rightText="detail.remark" :showArrow="false"></uni-list-item>
					<block v-if="detail.type === '1'">
						<block v-if="detail.params.buyType === 'nearby'">
							<uni-list-item title="购买地址" :rightText="'就近购买'" :showArrow="false"></uni-list-item>
						</block>
						<block v-else>
							<uni-list-item title="购买地址" :rightText="detail.params.buyAddress.address" :showArrow="false"></uni-list-item>
						</block>
					</block>
					<block v-else>
						<uni-list-item title="物品重量" :rightText="detail.item_weight + '公斤'" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.type === '2'">
						<uni-list-item title="取货地址" :rightText="detail.params.deliverAddress.address" :showArrow="false"></uni-list-item>
						<uni-list-item title="联系人" :rightText="detail.params.deliverAddress.realname + ' ' + detail.params.deliverAddress.phone" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.type === '3' && detail.params.transactAddress1">
						<uni-list-item title="代办点1" :rightText="detail.params.transactAddress1.address" :showArrow="false"></uni-list-item>
						<uni-list-item title="联系人" :rightText="detail.params.transactAddress1.realname + ' ' + detail.params.transactAddress1.phone" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.type === '4'">
						<uni-list-item title="取货地址" :rightText="detail.params.pickupAddress.address" :showArrow="false"></uni-list-item>
						<uni-list-item title="联系人" :rightText="detail.params.pickupAddress.realname + ' ' + detail.params.pickupAddress.phone" :showArrow="false"></uni-list-item>
					</block>
				</uni-list>
			</view>
		</view>
		
		<view class="section">
			<view class="title">收货地址</view>
			<view class="detail">
				<uni-list>
					<block v-if="['1', '2', '4'].includes(detail.type)">
						<uni-list-item title="收货地址" :rightText="detail.params.receiptAddress.address" :showArrow="false"></uni-list-item>
						<uni-list-item title="联系人" :rightText="detail.params.receiptAddress.realname + ' ' + detail.params.receiptAddress.phone" :showArrow="false"></uni-list-item>
					</block>
					<block v-else-if="detail.type === '3' && detail.params.transactAddress2">
						<uni-list-item title="代办点2" :rightText="detail.params.transactAddress2.address" :showArrow="false"></uni-list-item>
						<uni-list-item title="联系人" :rightText="detail.params.transactAddress2.realname + ' ' + detail.params.transactAddress2.phone" :showArrow="false"></uni-list-item>
					</block>
				</uni-list>
			</view>
		</view>
		
		<view class="section">
			<view class="title">其他信息</view>
			<view class="detail">
				<uni-list>
					<block v-if="detail.params && detail.params.isNow">
						<uni-list-item title="配送时间" :rightText="detail.expect_deliver_at.slice(0, 10) + ' ' + '立即送达'" :showArrow="false"></uni-list-item>
					</block>
					<block v-else>
						<uni-list-item title="配送时间" :rightText="detail.expect_deliver_at" :showArrow="false"></uni-list-item>
					</block>
					<uni-list-item title="订单号" :rightText="detail.order_hash" :showArrow="false"></uni-list-item>
					<uni-list-item title="收货码" :rightText="detail.code" :showArrow="false"></uni-list-item>
					<uni-list-item title="支付方式" :rightText="detail.pay_at === '0' ? '待支付' : '微信支付'" :showArrow="false"></uni-list-item>
					<block v-if="detail.params.otherRequest">
						<uni-list-item title="其他要求" :rightText="detail.params.otherRequest" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.params.orderCode">
						<uni-list-item title="订单号" :rightText="detail.params.orderCode" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.params.pickupCode">
						<uni-list-item title="取货码" :rightText="detail.params.pickupCode" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.params.contactDetail">
						<uni-list-item title="包裹信息" :rightText="detail.params.contactDetail" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.params.deliveryAddress">
						<uni-list-item title="发货地址" :rightText="detail.params.deliveryAddress" :showArrow="false"></uni-list-item>
					</block>
					<block v-if="detail.params">
						<block v-for="(item, idx) in detail.params.attach" :key="idx">
							<uni-list-item :title="item.title" :rightText="item.value.title + ' -￥' + item.value.price" :showArrow="false"></uni-list-item>
						</block>
					</block>
					<block v-if="detail.params.sound">
						<view class="flex file-box sound-module">
							<view>录音</view>
							<view class="flex sound-box" hover-class="hover-btn" @tap="playSound">
								<view class="duration">{{ detail.params.duration }}'</view>
								<uni-icons type="sound" size="14"></uni-icons>
							</view>
						</view>
					</block>
					<block v-if="detail.params.picList">
						<view class="flex file-box pic-module">
							<view class="title">图片</view>
							<view class="flex pic-box">
								<view class="pic-item" v-for="(item, idx) in detail.params.picList" :key="item">
									<image :src="item" mode="aspectFill" @tap="previewPicItem(idx, detail.params.picList)"></image>
								</view>
							</view>
						</view>
					</block>
				</uni-list>
			</view>
		</view>
		
		<view v-if="['0', '1'].includes(detail.status)" class="flex btn-list">
			<view v-if="detail.status === '0'" class="btn-item" hover-class="hover-btn" @tap="carryOnPay">立即支付</view>
			<view class="btn-item" hover-class="hover-btn" @tap="cancelOrder">取消订单</view>
		</view>
	</view>
</template>

<script>
	import { getDistance } from '@/utils/getDistance.js'
	
	const innerAudioContext = uni.createInnerAudioContext()
	
	export default {
		data() {
			return {
				detail: {},
				receiptAddress: {},
				markers: [],
				includePoints: [],
				marker: { width: 30, height: 30 },
				callout: { fontSize: 14, padding: 10, borderRadius: 6 },
				controls: [
					{ id: 1, position: { left: 16, top: 290, width: 24, height: 24 }, iconPath: '/static/img/refresh.png', clickable: true }
				]
			}
		},
		
		onLoad (params) {
			this.order_hash = params.order_hash
			this.getDetail()
		},
		
		methods: {
			getDetail () {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$myRequest({
					api: '/api/order/one',
					methods: 'GET',
					params: {
						order_hash: this.order_hash
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.err_code === 0) {
						let typeName, statusName, showTime
						res.data.data.addition.params = JSON.parse(res.data.data.addition.params)
						const obj = {
							...res.data.data.addition,
							...res.data.data
						}
						delete obj.addition
						let keys = Object.keys(obj)
						keys = keys.filter(item => ~item.indexOf('_at'))
						keys.forEach(key => {
							obj[key] = this.formatTime(obj[key])
						})
						this.receiptAddress = obj.params.receiptAddress
						switch (obj.type) {
							case '1':
								typeName = '帮我买'
								if (obj.params.buyType === 'address') {
									this.includePoints.push({
										latitude: obj.params.buyAddress.latitude,
										longitude: obj.params.buyAddress.longitude
									})
									this.markers.push({
										id: 1,
										...this.marker,
										latitude: obj.params.buyAddress.latitude,
										longitude: obj.params.buyAddress.longitude,
										iconPath: '/static/img/address.png',
										callout: {
											...this.callout,
											content: `购买地址：${obj.params.buyAddress.address}`
										}
									})
								}
								break
							case '2':
								typeName = '代取送'
								this.includePoints.push({
									latitude: obj.params.deliverAddress.latitude,
									longitude: obj.params.deliverAddress.longitude
								})
								this.markers.push({
									id: 1,
									...this.marker,
									latitude: obj.params.deliverAddress.latitude,
									longitude: obj.params.deliverAddress.longitude,
									iconPath: '/static/img/address.png',
									callout: {
										...this.callout,
										content: `取货地址：${obj.params.deliverAddress.address}`
									}
								})
								break
							case '3':
								typeName = '帮帮我'
								if (obj.params.transactAddress1) {
									this.includePoints.push({
										latitude: obj.params.transactAddress1.latitude,
										longitude: obj.params.transactAddress1.longitude
									})
									this.markers.push({
										id: 1,
										...this.marker,
										latitude: obj.params.transactAddress1.latitude,
										longitude: obj.params.transactAddress1.longitude,
										iconPath: '/static/img/receive.png',
										callout: {
											...this.callout,
											content: `代办点1：${obj.params.transactAddress1.address}`
										}
									})
								}
								if (obj.params.transactAddress2) {
									this.includePoints.push({
										latitude: obj.params.transactAddress2.latitude,
										longitude: obj.params.transactAddress2.longitude
									})
									this.markers.push({
										id: 2,
										...this.marker,
										latitude: obj.params.transactAddress2.latitude,
										longitude: obj.params.transactAddress2.longitude,
										iconPath: '/static/img/receive.png',
										callout: {
											...this.callout,
											content: `代办点2：${obj.params.transactAddress2.address}`
										}
									})
								}
								break
							case '4':
								typeName = '包裹单'
								this.includePoints.push({
									latitude: obj.params.pickupAddress.latitude,
									longitude: obj.params.pickupAddress.longitude
								})
								this.markers.push({
									id: 1,
									...this.marker,
									latitude: obj.params.pickupAddress.latitude,
									longitude: obj.params.pickupAddress.longitude,
									iconPath: '/static/img/address.png',
									callout: {
										...this.callout,
										content: `取件地址：${obj.params.pickupAddress.address}`
									}
								})
								break
							default:
								break
						}
						switch (obj.status) {
							case '0':
								statusName = '待支付'
								showTime = obj.created_at
								break
							case '1':
								statusName = '待接单'
								showTime = obj.pay_at
								break
							case '2':
								statusName = '已接单'
								showTime = obj.order_at
								break
							case '3':
								statusName = '已送达'
								showTime = obj.deliver_at
								break
							case '4':
								statusName = '已完成'
								showTime = obj.finish_at
								break
							case '5':
								statusName = '已取消'
								showTime = obj.deleted_at
								break
							case '6':
								statusName = '已退款'
								showTime = obj.deleted_at
								break
							default:
								break
						}
						if (['1', '2', '4'].includes(obj.type)) {
							this.includePoints.push({
								latitude: obj.params.receiptAddress.latitude,
								longitude: obj.params.receiptAddress.longitude
							})
							this.markers.push({
								id: 2,
								...this.marker,
								latitude: obj.params.receiptAddress.latitude,
								longitude: obj.params.receiptAddress.longitude,
								iconPath: '/static/img/receive.png',
								callout: {
									...this.callout,
									content: `收货地址：${obj.params.receiptAddress.address}`
								}
							})
						}
						obj.typeName = typeName
						obj.statusName = statusName
						obj.showTime = showTime
						obj.params.picList && (obj.params.picList = JSON.parse(obj.params.picList))
						obj.params.sound && (innerAudioContext.src = obj.params.sound)
						this.detail = obj
						console.log(this.detail.params, 'pp')
						obj.status === '2' && this.tapControl()
					}
				})
			},
			
			tapControl (e) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				this.$myRequest({
					api: '/api/order/get-track-log',
					methods: 'GET',
					params: {
						order_hash: this.detail.order_hash
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.data) {
						const data = JSON.parse(res.data.data.params)
						const idx = this.markers.findIndex(item => item.id === 99)
						// 距离
						let distance = getDistance(data.latitude, data.longitude, this.receiptAddress.latitude, this.receiptAddress.longitude)
						distance = distance > 1 ? distance.toFixed(2) + '公里' : Math.round(distance * 1000) + '米'
						const title = this.detail.type === '3' ? '代办点2' : '收货地'
						if (~idx) {
							this.markers[idx].latitude = data.latitude
							this.markers[idx].longitude = data.longitude
							this.markers[idx].callout.content = '骑手\n' + `距${title}约${distance}`
						} else {
							this.markers.push({
								id: 99,
								width: 30,
								height: 30,
								latitude: data.latitude,
								longitude: data.longitude,
								iconPath: '/static/img/rider.png',
								callout: {
									...this.callout,
									content: '骑手\n' + `距${title}约${distance}`
								}
							})
						}
					}
				})
			},
			
			carryOnPay () {
				uni.showLoading({
					title: '操作中...',
					mask: true
				})
				this.$myRequest({
					api: '/api/order/pay-order',
					methods: 'GET',
					params: {
						order_hash: this.detail.order_hash
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
								this.changeOrderStatus(data.order_hash).then(result => {
									uni.hideLoading()
									uni.showToast({
										title: '支付成功'
									})
									setTimeout(() => {
										this.getDetail()
									}, 1000)
								})
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
			
			cancelOrder () {
				uni.showModal({
					content: '确认取消该订单？',
					confirmColor: '#0CD6A6',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '操作中...',
								mask: true
							})
							this.$myRequest({
								api: '/api/order/cancel',
								methods: 'GET',
								params: {
									order_hash: this.detail.order_hash
								}
							}).then(res => {
								uni.hideLoading()
								if (res.data.err_code === 0) {
									uni.showToast({
										title: '取消成功'
									})
									setTimeout(() => {
										this.getDetail()
									})
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
			
			changeOrderStatus (order_hash) {
				return new Promise((resolve, reject) => {
					const api = `/wechat/payment-notify/${order_hash}`
					this.$myRequest({api}).then(res => {
						if (res.data.err_code === 0) {
							resolve(res)
						} else {
							reject(res)
						}
					}).catch(err => {
						reject(err)
					})
				})
			},
			
			playSound () {
				if (innerAudioContext.paused) {
					innerAudioContext.play()
				} else {
					innerAudioContext.stop()
				}
			},
			
			previewPicItem (idx, list) {
				uni.previewImage({
					current: idx || 0,
					urls: list
				})
			},
			
			formatTime (time) {
				if (time <= 0) return time
				const date = new Date(time * 1000)
				const y = date.getFullYear()
				const m = ('0' + (date.getMonth() + 1)).slice(-2)
				const d = ('0' + date.getDate()).slice(-2)
				const time2 = date.toTimeString().slice(0, 5)
				return `${y}-${m}-${d} ${time2}`
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	padding: 20rpx;
	.map-module {
		padding-bottom: 20rpx;
	}
	
	.section {
		margin-bottom: 20rpx;
		.title {
			padding: 10rpx 0 10rpx 20rpx;
		}
		.detail {
			/deep/ .uni-list {
				border-radius: 10rpx;
				.uni-list-item__content {
					flex: 1 200rpx;
					flex-shrink: 0;
				}
			}
		}
	}
	
	.file-box {
		background-color: #FFFFFF;
		padding: 10rpx 30rpx;
		padding-left: 15px;
	}
	.sound-module {
		justify-content: space-between;
		.sound-box {
			padding: 6rpx 20rpx;
			border: 1px solid #CCCCCC;
			border-radius: 10rpx;
			.duration {
				font-size: 24rpx;
				margin-right: 16rpx;
			}
		}
	}
	.pic-module {
		.title {
			margin-right: 40rpx;
			flex-shrink: 0;
			padding: 0;
		}
		.pic-box {
			flex-wrap: wrap;
			margin-left: auto;
			.pic-item {
				width: 120rpx; height: 120rpx;
				margin: 16rpx 0;
				border-radius: 10rpx;
				margin-right: 20rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	.btn-list {
		padding-bottom: 20rpx;
		.btn-item {
			flex: 1;
			text-align: center;
			padding: 20rpx 0;
			border-radius: 10rpx;
			margin: 0 20rpx;
			border: 1px solid #F0F0F0;
			overflow: hidden;
			color: $uni-color-main;
			background-color: #FFFFFF;
		}
	}
	.status-box {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		z-index: 3;
		padding: 10rpx 20rpx;
		font-size: 36rpx;
		border: 4rpx solid;
		border-radius: 20rpx;
		color: red;
		transform: rotate(20deg);
		opacity: .4;
		font-weight: 600;
	}
}
</style>
