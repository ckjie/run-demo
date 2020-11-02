<template>
	<view class="page">
		<view class="section">
			<view class="title">可选地址</view>
			<view class="address-list">
				<view class="flex item" v-for="(item, idx) in addressList" :key="idx">
					<view class="left" @tap="chooseAddress(item)">
						<view class="flex contact">
							<view class="name">{{ item.realname }} {{ item.sexName }}</view>
							<view class="phone">{{ item.phone }}</view>
						</view>
						<view class="address">{{ item.address }}</view>
					</view>
					<view class="right" @tap="editAddress(item)">
						<uni-icons type="compose" size="18"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		
		<view class="add-btn" @tap="editAddress()">
			<view class="flex btn-box">
				<uni-icons type="plus-filled" color="#0CD6A6" size="16"></uni-icons>
				<view class="text">新增收货地址</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				canTap: false,
				addressType: '',
				addressList: []
			}
		},
		
		onLoad (params) {
			if (params.type) {
				this.canTap = true
				this.addressType = params.type
			}
		},
		
		onShow () {
			this.getList()
		},
		
		methods: {
			getList () {
				uni.showLoading({
					title: '加载中...'
				})
				this.addressList.splice(0)
				const params = {
					api: '/api/address/list',
					params: {
						page: 1,
						size: 999
					}
				}
				this.$myRequest(params).then(res => {
					uni.hideLoading()
					if (res.data.err_code !== 0) return
					res.data.data.forEach(item => {
						item.sexName = item.sex === '0' ? '先生' : '女士'
						this.addressList.push(item)
					})
				})
			},
			
			chooseAddress (item) {
				if (!this.canTap) return
				const pages = getCurrentPages()
				const prevPage = pages[pages.length - 2]
				prevPage.setData({
					address: item,
					addressType: this.addressType
				})
				uni.navigateBack({
					delta: 1
				})
			},
			editAddress (item) {
				let url = '/pages/user/edit-address'
				if (item) {
					url = url + '?item=' + encodeURIComponent(JSON.stringify(item))
				}
				this.$pageTo({ url })
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	background-color: #F0F0F0;
	padding-bottom: 100rpx;
}

.section {
	padding: 20rpx;
	.title {
		color: #666666;
		padding-bottom: 20rpx;
	}
	.address-list {
		.item {
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			padding: 20rpx 30rpx;
			.left {
				flex: 1;
				.contact {
					padding-bottom: 10rpx;
					.name {
						margin-right: 20rpx;
					}
				}
				.address {
					color: #999999;
				}
			}
			.right {
				margin-left: auto;
				flex-shrink: 0;
				padding: 20rpx 0 20rpx 20rpx;
			}
		}
	}
}

.add-btn {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background-color: #FFFFFF;
	.btn-box {
		justify-content: center;
		padding: 20rpx 0;
		.text {
			margin-left: 20rpx;
		}
	}
}
</style>
