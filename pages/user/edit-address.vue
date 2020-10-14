<template>
	<view class="page">
		<view class="section">
			<view class="flex item">
				<view class="title">小区/大厦/学校</view>
				<uni-icons type="location-filled" size="16"></uni-icons>
				<view class="location">{{ detail.location }}</view>
				<uni-icons style="margin-left: auto;" type="arrowright" size="16"></uni-icons>
			</view>
			<view class="flex item">
				<view class="title">楼号-门牌号</view>
				<input type="text" value="" placeholder="例:8号楼808室" />
			</view>
			<view class="flex item">
				<view class="title">联系人</view>
				<input type="text" value="" placeholder="您的姓名" />
				<view class="radio-box">
					<radio-group>
						<label v-for="item in genderList" :key="item.value">
							<view>
								<radio :value="item.value" />
							</view>
							<view>{{ item.label }}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="flex item">
				<view class="title">手机号</view>
				<input type="text" value="" placeholder="请填写收货手机号码" />
			</view>
		</view>
		
		<view class="submit-btn">
			<view class="btn">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					location: ''
				},
				genderList: [
					{ label: '先生', value: 'man' },
					{ label: '女士', value: 'woman' }
				]
			}
		},
		methods: {
			
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
		padding: 20rpx 0;
		border-bottom: 1px solid #EEEEEE;
		.title {
			width: 140rpx;
			flex-shrink: 0;
		}
		.location {
			margin-left: 20rpx;
			flex: 1;
		}
	}
}
</style>
