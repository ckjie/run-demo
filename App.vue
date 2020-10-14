<script>
export default {
	globalData: {
		baseUrl: 'https://mpsubjects.by-health.com'
	},
	
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
page {
	width: 100%;
	height: 100%;
}
view {
	font-size: 28rpx;
	box-sizing: border-box;
}
.page-bgc {
	width: 100%;
	height: 100%;
	background-color: #F8F8F8;
}
.flex {
	display: flex;
	align-items: center;
}
.hover-btn {
	background-color: #F0F0F0;
}
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
