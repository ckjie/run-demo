<template>
	<view class="page">
		<view class="section">
			<view class="flex item" @tap="chooseLocation">
				<view class="title">小区/大厦/学校</view>
				<uni-icons type="location-filled" color="#0CD6A6" size="14"></uni-icons>
				<view class="location">{{ detail.location }}</view>
				<uni-icons style="margin-left: auto;" type="arrowright" size="16"></uni-icons>
			</view>
			<view class="flex item">
				<view class="title">楼号-门牌号</view>
				<input type="text" maxlength="50" v-model.trim="detail.address" placeholder="例:8号楼808室" />
			</view>
			<view class="flex item">
				<view class="title">联系人</view>
				<input class="input" type="text" maxlength="20" v-model.trim="detail.realname" placeholder="您的姓名" />
				<view class="radio-box">
					<radio-group class="flex">
						<label class="flex label-box" v-for="item in sexList" :key="item.value">
							<view>
								<radio :value="item.value" :checked="item.value === detail.sex" color="#0CD6A6" />
							</view>
							<view class="radio-label">{{ item.label }}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="flex item">
				<view class="title">手机号</view>
				<input type="number" maxlength="11" v-model.trim="detail.phone" placeholder="请填写收货手机号码" />
			</view>
		</view>
		
		<view class="btn-box">
			<view class="btn save-btn" @tap="save">保存</view>
			<view v-if="detail.address_id" class="btn del-btn" @tap="delAddress(item.address_id)">删除</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					phone: '',
					realname: '',
					address: '',
					longitude: '',
					latitude: '',
					sex: '0'
				},
				sexList: [
					{ label: '先生', value: '1' },
					{ label: '女士', value: '2' }
				]
			}
		},
		
		onLoad(params) {
			if (params.item) {
				params.item = JSON.parse(decodeURIComponent(params.item))
				const address = params.item.address.split(' ')
				this.detail = Object.assign({}, this.detail, {
					...params.item,
					location: address[0],
					address: address[1]
				})
			}
		},
		
		methods: {
			chooseLocation () {
				uni.chooseLocation({
					success: res => {
						this.detail = Object.assign({}, this.detail, {
							location: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						})
					}
				})
			},
			
			checkData () {
				const keys = Object.keys(this.detail)
				if (keys.some(item => !this.detail[item])) {
					uni.showToast({
						title: '各项均不能为空，请确认',
						icon: 'none'
					});
					return
				}
				const reg = /^1[3-9]\d{9}$/;
				if (!reg.test(this.detail.phone)) {
					uni.showToast({
						title: '手机号格式有误，请确认',
						icon: 'none'
					});
					return
				}
				return true
			},
			
			save () {
				if (!this.checkData()) return
				uni.showLoading({
					title: '保存中...',
					mask: true
				})
				const address = `${this.detail.location} ${this.detail.address}`
				let api = '/api/address/create'
				const params = {
					api,
					params: {
						phone: this.detail.phone,
						realname: this.detail.realname,
						longitude: this.detail.longitude,
						latitude: this.detail.latitude,
						address
					}
				}
				if (this.detail.address_id) {
					params.api = '/api/address/update'
					params.params.address_id = this.detail.address_id
				}
				this.$myRequest(params).then(res => {
					uni.hideLoading()
					if (res.data.err_code !== 0) return
					const title = this.detail.address_id ? '编辑成功' : '添加成功'
					uni.showToast({
						title
					})
					uni.navigateBack({
						delta: 1
					})
				})
			},
			
			delAddress (address_id) {
				uni.showModal({
					content: '确认删除该收货地址？',
					cancelText: '取消',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中...',
								mask: true
							})
							this.$myRequest({
								api: '/api/address/delete',
								params: {
									address_id
								}
							}).then(res => {
								uni.hideLoading()
								if (res.data.err_code !== 0) return
								uni.showToast({
									title: '删除成功'
								})
								uni.navigateBack({
									delta: 1
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	background-color: #F0F0F0;
	padding: 20rpx;
}

.section {
	background-color: #FFFFFF;
	padding-left: 20rpx;
	.item {
		padding: 20rpx 20rpx 20rpx 0;
		border-bottom: 1px solid #EEEEEE;
		&:last-of-type {
			border-bottom: none 0;
		}
		.title {
			width: 190rpx;
			flex-shrink: 0;
		}
		.location {
			margin-left: 10rpx;
			flex: 1;
		}
		.input {
			flex: 1;
		}
		.label-box {
			margin-left: 20rpx;
			.radio-label {
				flex-shrink: 0;
			}
		}
	}
}

.btn-box {
	.btn {
		width: 100%;
		border-radius: 10rpx;
		margin: 30rpx 0;
		text-align: center;
		padding: 20rpx 0;
	}
	.save-btn {
		background-color: $uni-color-main;
		color: #FFFFFF;
	}
	.del-btn {
		background-color: #FFFFFF;
		color: red;
	}
}
</style>
