<template>
	<view class="page-bgc page">
		<view class="body">
			<!-- <view v-if="textKey === 'protocol'" class="title">{{ titleSource[textKey] }}</view> -->
			<jyf-parser :html="richText" ref="article"></jyf-parser>
		</view>
	</view>
</template>

<script>
	// import { protocol, priceAbout } from '@/utils/rich-texts.js'
	
	export default {
		data() {
			return {
				titleSource: {
					KEY_CHARGE_NOTE: '跑腿服务协议',
					KEY_SERVICE_AGREEMENT: '价格说明'
				},
				textKey: '',
				richText: ''
			}
		},
		
		onLoad (params) {
			this.textKey = params.key
			uni.setNavigationBarTitle({
				title: this.titleSource[params.key] || '跑腿王'
			})
			this.getText()
		},
		
		methods: {
			getText () {
				uni.showLoading({
					title: '加载中...'
				})
				this.$myRequest({
					api: '/api/config/get-config',
					methods: 'GET',
					params: {
						name: this.textKey
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.err_code === 0) {
						this.richText = res.data.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	padding: 20rpx;
}
.body {
	padding: 20rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	.title {
		font-size: 32rpx;
		font-weight: 600;
		padding-bottom: 30rpx;
		text-align: center;
	}
}
</style>
