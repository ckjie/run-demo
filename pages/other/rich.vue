<template>
	<view class="page-bgc page">
		<view class="body">
			<view v-if="textKey === 'protocol'" class="title">{{ titleSource[textKey] }}</view>
			<jyf-parser :html="richText" ref="article"></jyf-parser>
		</view>
	</view>
</template>

<script>
	import { protocol, priceAbout } from '@/utils/rich-texts.js'
	
	export default {
		data() {
			return {
				titleSource: {
					protocol: '帮送服务协议',
					priceAbout: '常见问题'
				},
				textKey: ''
			}
		},
		
		onLoad (params) {
			this.textKey = params.key
			uni.setNavigationBarTitle({
				title: this.titleSource[params.key] || '跑腿王'
			})
		},
		
		computed: {
			richText () {
				if (this.textKey === 'protocol') {
					return protocol
				} else if (this.textKey === 'priceAbout') {
					return priceAbout
				}
			}
		},
		
		methods: {
			
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
