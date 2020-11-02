<template>
	<view class="page">
		<view class="logo-box">
			<image src="../../static/img/logo.png" mode="widthFix"></image>
		</view>
		<view class="form-module">
			<view class="flex item">
				<view class="label">姓名：</view>
				<input class="input" type="text" v-model.trim="formData.realname" maxlength="10" />
			</view>
			<view class="flex item">
				<view class="label">手机：</view>
				<input class="input" type="number" v-model.trim="formData.phone" maxlength="11" />
			</view>
			<view class="flex item">
				<view class="label">性别：</view>
				<radio-group class="flex">
					<label class="flex label-box" v-for="item in sexList" :key="item.value">
						<view>
							<radio :value="item.value" :checked="item.value === formData.sex" color="#0CD6A6" />
						</view>
						<view class="radio-label">{{ item.label }}</view>
					</label>
				</radio-group>
			</view>
			<view class="flex item">
				<view class="label">头像：</view>
				<view class="avatar-box">
					<image class="avatar" :src="formData.avatar" mode="aspectFill"></image>
					<view class="upload-icon" :class="{ 'is-hide': formData.avatar }">
						<uploadModule @uploadSucess="uploadSucess" :count="1"></uploadModule>
					</view>
				</view>
			</view>
			<view class="btn-box">
				<button class="submit-btn" type="primary" size="mini" @click="submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uploadModule from '@/components/upload-module/upload-module.vue'
	export default {
		components: {
			uploadModule
		},
		
		data() {
			return {
				formData: {
					realname: '',
					phone: '',
					avatar: '',
					sex: '0'
				},
				sexList: [
					{ label: '男', value: '0' },
					{ label: '女', value: '1' }
				]
			}
		},
		methods: {
			uploadSucess (list) {
				console.log(list, 'lll')
				this.formData.avatar = list[0]
			},
			
			checkData () {
				if (!this.formData.realname) {
					uni.showToast({
						title: '姓名不能为空',
						icon: 'none'
					})
					return
				}
				const reg = /^1[3-9]\d{9}$/
				if (!reg.test(this.formData.phone)) {
					uni.showToast({
						title: '手机号格式有误',
						icon: 'none'
					})
					return
				}
				return true
			},
			
			submit () {
				if (!this.checkData()) return
				uni.showLoading({
					title: '提交中...'
				})
				const params = {
					api: '/api/courier/apply',
					params: this.formData
				}
				this.$myRequest(params).then(res => {
					uni.hideLoading()
					if (res.data.err_code !== 0) return
					uni.showModal({
						title: '提示',
						content: '提交成功，请耐心等待管理员审核！',
						showCancel: false,
						success: res => {
							if (res.confirm) {
								this.$pageTo({
									url: '/pages/tabbar/index',
									type: 'reLaunch'
								})
							}
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.logo-box {
	margin: 0 auto;
	padding: 80rpx 0 40rpx;
	text-align: center;
	image {
		width: 300rpx;
	}
}
.form-module {
	width: 80%;
	margin: 0 auto;
	.item {
		margin: 20rpx 0;
		padding: 20rpx 100rpx 20rpx 40rpx;
		background-color: #F0F0F0;
		border-radius: 10rpx;
		.label {
			margin-right: 20rpx;
			flex-shrink: 0;
		}
		.input {
			flex: 1;
		}
		.label-box {
			margin-right: 40rpx;
			.radio-label {
				flex-shrink: 0;
			}
		}
		.avatar-box {
			position: relative;
			// width: 120rpx;
			// height: 120rpx;
			.avatar, .upload-icon {
				width: 120rpx;
				height: 120rpx;
			}
			.upload-icon {
				position: absolute;
				top: 0;
				right: 0;
				z-index: 1;
				opacity: 1;
			}
			.is-hide {
				opacity: 0;
			}
		}
	}
	.btn-box {
		padding-top: 40rpx;
		.submit-btn {
			width: 100%;
			padding: 10rpx 0;
			background-color: $uni-color-main;
		}
	}
}
</style>
