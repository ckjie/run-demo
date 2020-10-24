<template>
	<view class="img-box">
		<image v-show="isLoading" class="img" :src="defaultSrc" mode="aspectFill"></image>
		<image v-show="!isLoading" class="img" :src="src" :mode="imgMode" lazy-load @load="isLoad" @tap="previewImg"></image>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String
			},
			mode: {
				type: String
			},
			previewList: {
				type: Array,
				default: () => {
					return []
				}
			},
			previewIdx: {
				type: [String, Number],
				default: 0
			}
		},
		
		data() {
			return {
				isLoading: true,
				defaultSrc: require('@/static/img/pic-loading.png'),
				defaultMode: 'aspectFill'
			};
		},
		
		computed: {
			imgSrc () {
				return this.src || this.defaultSrc
			},
			imgMode () {
				return this.mode || this.defaultMode
			},
			previewPicList () {
				return (this.previewList && this.previewList.length) ? this.previewList : [this.src]
			}
		},
		
		methods: {
			isLoad (e) {
				this.isLoading = false
			},
			
			previewImg () {
				uni.previewImage({
					current: this.previewIdx,
					urls: this.previewPicList
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.img-box, .img {
	width: 100%;
	height: 100%;
	border-radius: 6rpx;
}
</style>
