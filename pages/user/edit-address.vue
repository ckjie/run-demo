<template>
	<view class="page">
		<view class="section">
			<view class="flex item" @tap="chooseLocation">
				<view class="title">小区/大厦/学校</view>
				<uni-icons type="location-filled" color="#999" size="14"></uni-icons>
				<view class="location">{{ detail.address }}</view>
				<uni-icons style="margin-left: auto;" type="arrowright" size="16"></uni-icons>
			</view>
			<view class="flex item">
				<view class="title">楼号-门牌号</view>
				<input type="text" value="" placeholder="例:8号楼808室" />
			</view>
			<view class="flex item">
				<view class="title">联系人</view>
				<input class="input" type="text" value="" placeholder="您的姓名" />
				<view class="radio-box">
					<radio-group class="flex">
						<label class="flex label-box" v-for="item in genderList" :key="item.value">
							<view>
								<radio :value="item.value" :checked="item.value === detail.gender" color="#0CD6A6" />
							</view>
							<view class="radio-label">{{ item.label }}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="flex item">
				<view class="title">手机号</view>
				<input type="text" value="" placeholder="请填写收货手机号码" />
			</view>
		</view>
		
		<view class="btn-box">
			<view class="btn save-btn">保存</view>
			<view class="btn del-btn">删除</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					gender: 'man'
				},
				genderList: [
					{ label: '先生', value: 'man' },
					{ label: '女士', value: 'woman' }
				]
			}
		},
		
		methods: {
			chooseLocation () {
				uni.chooseLocation({
					success: res => {
						this.detail = Object.assign({}, this.detail, {
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude,
							name: res.name
						})
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
	}
}
</style>
