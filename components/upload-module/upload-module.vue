<template>
	<view class="upload-module" @tap="uploadPic">
		<view class="add-icon"></view>
	</view>
</template>

<script>
	import uploadImage from '@/common/ossutil/uploadFile.js'
	export default {
		props: {
			count: {
				type: [String, Number],
				default: 1
			}
		},
		
		data () {
			return {
				
			}
		},
		
		methods: {
			uploadPic () {
				uni.chooseImage({
					count: this.count,
					success: res => {
						const list = []
						uni.showLoading({
							title: '上传中...'
						})
						res.tempFilePaths.forEach((item, idx) => {
							uploadImage(item, 'images/', result => {
								list.push(result)
								if (idx === res.tempFilePaths.length - 1) {
									uni.hideLoading()
									this.$emit('uploadSucess', list)
								}
							}, err => {
								uni.hideLoading()
							})
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.upload-module, .add-icon {
	width: 100%; height: 100%;
}
.add-icon {
	border: 2rpx dashed;
	color: #ccc;
	border-radius: 10rpx;
	position: relative;
	&::before, &::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
	}
	&::before {
		width: 30rpx;
		border-top: 4rpx solid;
		margin: -2rpx 0 0 -15rpx;
	}
	&::after {
		height: 30rpx;
		border-left: 4rpx solid;
		margin: -15rpx 0 0 -2rpx;
	}
}
</style>
