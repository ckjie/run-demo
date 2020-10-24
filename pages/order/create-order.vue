<template>
	<view>
		<view class="top-pic">
			<image v-if="wordsKey === 'buy'" src="../../static/img/text-logo.png" mode="widthFix"></image>
			<image v-else-if="wordsKey === 'send'" src="../../static/img/top-send.png" mode="widthFix"></image>
			<image v-else-if="wordsKey === 'handle'" src="../../static/img/top-handle.png" mode="widthFix"></image>
		</view>
		<view class="page page-bgc">
			<view class="section input-module">
				<textarea class="input" v-model="formData.text" maxlength="-1" :placeholder="placeholderSource[wordsKey]"></textarea>
				<view class="flex common-words">
					<view class="words-item" v-for="(item, idx) in commonWords[wordsKey]" :key="idx" @tap="clickWord(item)">{{ item }}</view>
				</view>
				<uni-list v-if="wordsKey === 'buy'" class="advance">
					<uni-list-item title="骑手垫付商品费,收货后与配送员结清" thumb="/static/img/advance.png" thumb-size="sm" rightText="预估商品费" @tap="openPopup('advancePopup')"></uni-list-item>
				</uni-list>
			</view>
			
			<view class="section detail-module">
				<view v-if="wordsKey === 'buy'" class="flex buy-type">
					<view class="title">购买</view>
					<view class="flex list">
						<view class="item" :class="{'active': formData.buyType === item.value}" v-for="item in buyTypeList" :key="item.value" @tap="changeBuyType(item.value)">{{ item.label }}</view>
					</view>
				</view>
				<uni-list class="address">
					<uni-list-item v-show="formData.buyType === 'address'" title="购买地址" :rightText="(formData.buyAddress.address ? formData.buyAddress.address : '在哪里买')" @tap="chooseBuyAddress"></uni-list-item>
					<block v-if="wordsKey === 'send'">
						<uni-list-item title="取货" :rightText="(formData.sendAddress.address ? formData.sendAddress.address : '在哪里取')" @tap="toPage('/pages/user/address-list?type=send')"></uni-list-item>
						<uni-list-item v-if="formData.sendAddress.realname" title="联系人" :rightText="`${formData.sendAddress.realname} ${formData.sendAddress.phone}`"></uni-list-item>
					</block>
					<block v-if="wordsKey === 'handle'">
						<uni-list-item title="代办点" :rightText="(formData.handleAddress1.address ? formData.handleAddress1.address : '选择代办地点')" @tap="toPage('/pages/user/address-list?type=handle1')"></uni-list-item>
						<uni-list-item v-if="formData.handleAddress1.realname" title="联系人" :rightText="`${formData.handleAddress1.realname} ${formData.handleAddress1.phone}`"></uni-list-item>
						<uni-list-item title="代办点2" :rightText="(formData.handleAddress2.address ? formData.handleAddress2.address : '选择代办地点2（可两个地址一样）')" @tap="toPage('/pages/user/address-list?type=handle2')"></uni-list-item>
						<uni-list-item v-if="formData.handleAddress2.realname" title="联系人" :rightText="`${formData.handleAddress2.realname} ${formData.handleAddress2.phone}`"></uni-list-item>
					</block>
					<block v-if="wordsKey === 'take'">
						<uni-list-item title="取件地址" :rightText="(formData.takeAddress.address ? formData.takeAddress.address : '选择快递公司地址')" @tap="toPage('/pages/user/address-list?type=take')"></uni-list-item>
						<uni-list-item v-if="formData.takeAddress.realname" title="联系人" :rightText="`${formData.takeAddress.realname} ${formData.takeAddress.phone}`"></uni-list-item>
					</block>
					<block v-if="['buy', 'send', 'take'].includes(wordsKey)">
						<uni-list-item title="收货" :rightText="formData.receiptAddress.address || '送到哪里去'" @tap="toPage('/pages/user/address-list?type=receipt')"></uni-list-item>
						<uni-list-item v-if="formData.receiptAddress.realname" title="联系人" :rightText="`${formData.receiptAddress.realname} ${formData.receiptAddress.phone}`"></uni-list-item>
					</block>
					<view class="flex inline-list-item">
						<uni-list-item :title="`${formData.date} ${formData.time}`" @tap="openPopup('timePopup')"></uni-list-item>
						<uni-list-item v-if="wordsKey !== 'handle'" :title="'物品重量: ' + (formData.weight === 10 ? '10公斤内' : formData.weight + '公斤')" @tap="openPopup('weightPopup')"></uni-list-item>
					</view>
				</uni-list>
			</view>
			
			<view class="section supplement">
				<view class="flex item sound">
					<view class="title">录音</view>
					<view class="flex recording-btn" hover-class="hover-btn" @touchstart="isStart" @touchend="isEnd">
						<uni-icons type="mic" size="14"></uni-icons>
						<view class="text">{{ isRecording ? '录音中...' : '按住录音'}}</view>
					</view>
					<view v-if="formData.sound" class="flex sound-box" hover-class="hover-btn" @tap="playSound">
						<view class="duration">{{ formData.duration }}'</view>
						<uni-icons type="sound" size="14"></uni-icons>
						<uni-icons class="del-sound-icon" type="clear" color="#f00" size="16" @tap="delSound"></uni-icons>
					</view>
				</view>
				<view class="flex item pic">
					<view class="title">图片</view>
					<view class="flex pic-module">
						<view class="pic-item" v-for="(item, idx) in picList" :key="item">
							<image :src="item" mode="aspectFill" @tap="previewPicItem(idx, picList)"></image>
							<uni-icons class="del-icon" type="minus-filled" color="#f00" size="16" @tap="delPicItem(idx)"></uni-icons>
						</view>
						<view class="upload-icon">
							<uploadModule @uploadSucess="uploadSucess"></uploadModule>
						</view>
					</view>
				</view>
			</view>
			
			<block v-if="['buy', 'send'].includes(wordsKey)">
				<view class="section attach">
					<view class="flex item">
						<view class="title">附加费</view>
						<view class="flex list">
							<view class="option-item" :class="{'active': formData.attachFee === item.key}" v-for="item in attachFeeList" :key="item.key" @tap="clickAttach(item, 'attachFee')">{{ item.title }} +￥{{ item.price}}</view>
						</view>
					</view>
				</view>
				<view class="section attach">
					<view class="flex item">
						<view class="title">选填</view>
						<view class="flex list">
							<view class="option-item" :class="{'active': formData.pickupAddress === item.key}" v-for="item in pickupAddressList" :key="item.key" @tap="clickAttach(item, 'pickupAddress')">{{ item.title }} +￥{{ item.price}}</view>
						</view>
					</view>
				</view>
				<view v-if="wordsKey === 'buy'" class="section attach">
					<view class="flex item">
						<view class="title">顺带加价</view>
						<view class="flex list">
							<view class="option-item" :class="{'active': formData.incidentally.includes(item.key)}" v-for="item in incidentallyList" :key="item.key" @tap="clickAttach(item, 'incidentally')">{{ item.title }} +￥{{ item.price}}</view>
						</view>
					</view>
				</view>
				<view class="section other-fee">
					<uni-list class="tip">
						<uni-list-item title="小费" rightText="加小费抢单更快哦" @tap="openPopup('tipPopup')"></uni-list-item>
					</uni-list>
				</view>
			</block>
			
			<block v-if="wordsKey === 'handle'">
				<view class="section attach">
					<view class="flex item">
						<view class="title">骑手选择</view>
						<view class="flex list">
							<view class="option-item" :class="{'active': formData.rider === item.key}" v-for="item in riderList" :key="item.key" @tap="clickAttach(item, 'rider')">{{ item.title }}</view>
						</view>
					</view>
				</view>
				<view class="section attach">
					<view class="flex item">
						<view class="title">其他要求</view>
						<view class="flex list">
							<input class="fill-input" type="text" value="" placeholder="选填" />
						</view>
					</view>
				</view>
				<view class="section other-fee">
					<uni-list class="tip">
						<uni-list-item title="悬赏费" rightText="悬赏费越高抢单越快哦" @tap="openPopup('tipPopup')"></uni-list-item>
					</uni-list>
				</view>
			</block>
			
			<block v-if="wordsKey === 'take'">
				<view class="section attach">
					<view class="flex item">
						<view class="title">订单号</view>
						<view class="flex list">
							<input class="fill-input" type="text" value="" placeholder="图片有订单号可不填" />
						</view>
					</view>
					<view class="flex item">
						<view class="title">取货码</view>
						<view class="flex list">
							<input class="fill-input" type="text" value="" placeholder="选填" />
						</view>
					</view>
					<view class="flex item">
						<view class="title">包裹信息</view>
						<view class="flex list">
							<input class="fill-input" type="text" value="" placeholder="写快递上的收货人姓名 + 电话" />
						</view>
					</view>
					<view class="flex item">
						<view class="title">发货地址</view>
						<view class="flex list">
							<input class="fill-input" type="text" value="" placeholder="不是车站取货的不填" />
						</view>
					</view>
				</view>
				<view class="section other-fee">
					<uni-list class="tip">
						<uni-list-item title="小费" rightText="加小费抢单更快哦" @tap="openPopup('tipPopup')"></uni-list-item>
					</uni-list>
				</view>
			</block>
			
			<view class="flex protocol">
				<view class="title">点击查看</view>
				<view @tap="toPage('/pages/other/rich?key=protocol')">《跑腿服务协议》</view>
			</view>
			
			<view class="section bottom">
				<view class="flex total" @tap="openPopup('detailPopup')">
					<view>跑腿费</view>
					<view class="amount">666元</view>
					<uni-icons type="arrowup" size="12"></uni-icons>
				</view>
				<view class="btn-box">
					<button class="submit-btn" type="primary" size="mini">提交订单</button>
				</view>
			</view>
		</view>
		
		<!-- 预估商品价格底部弹框 -->
		<uni-popup ref="advancePopup" type="bottom">
			<view class="popup-item advance-popup">
				<view class="flex top">
					<view @tap="closePopup('advancePopup')">取消</view>
					<view class="title">预估商品费</view>
					<view>确定</view>
				</view>
				<view class="body">
					<view>供骑手代购时参考（可选填）</view>
					<view class="flex input-box">
						<view>预估 ￥</view>
						<input class="input" type="number" value="" focus />
					</view>
					<view class="flex prompt">
						<uni-icons type="info" color="#c0c0c0" size="12"></uni-icons>
						<view style="padding-left: 10rpx;">最高500元</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 取件时间底部弹框 -->
		<uni-popup ref="timePopup" type="bottom">
			<view class="popup-item time-popup">
				<view class="flex top">
					<view class="cancel" @tap="closePopup('timePopup')">取消</view>
					<view class="title">取件时间</view>
				</view>
				<view class="body">
					<scroll-view class="list date-list" scroll-y="true">
						<view class="item" :class="{'active': item === formData.date}" v-for="item in dateList" :key="item" @tap="clickDate(item)">{{ item }}</view>
					</scroll-view>
					<scroll-view class="list time-list" scroll-y="true">
						<block v-if="formData.date === dateList[0]">
							<view class="item" v-for="item in todayTimeList" :key="item" @tap="clickTime(item)">
								<view :class="{'active': item === formData.time}">{{ item }}</view>
								<uni-icons class="icon" v-show="item === formData.time" type="checkmarkempty" color="#0CD6A6" size="14"></uni-icons>
							</view>
						</block>
						<block v-else>
							<view class="item" v-for="item in otherDayTimeList" :key="item" @tap="clickTime(item)">
								<view :class="{'active': item === formData.time}">{{ item }}</view>
								<uni-icons class="icon" v-show="item === formData.time" type="checkmarkempty" color="#0CD6A6" size="14"></uni-icons>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		
		<!-- 重量底部弹框 -->
		<uni-popup ref="weightPopup" type="bottom">
			<view class="popup-item weight-popup">
				<view class="flex top">
					<view class="cancel" @tap="closePopup('weightPopup')">取消</view>
					<view class="title">物品重量</view>
				</view>
				<view class="body">
					<view>重量</view>
					<view class="weight-value">{{ formData.weight === 10 ? '小于10公斤' : formData.weight + '公斤' }}</view>
					<view class="slider">
						<slider :value="formData.weight" @change="changeWeight" block-size="16" activeColor="#FF0000" min="10" max="20" step="1" />
						<view class="flex text-list">
							<view class="left">小于10公斤</view>
							<view>20公斤</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="tipPopup" type="bottom">
			<view class="popup-item tip-popup">
				<view class="flex top">
					<view @tap="closePopup('tipPopup')">取消</view>
					<view class="title">小费</view>
					<view @tap="confirmTip">确定</view>
				</view>
				<view class="body">
					<view class="flex amount-list">
						<view class="item" :class="{'active': item.value === formData.tip}" v-for="item in amountList" :key="item.value" @tap="clickTip(item.value)">{{ item.title }}</view>
						<view class="flex item custom-item" :class="{'active': tipAmount === formData.tip}" @tap="clickTip(tipAmount)">
							<view>其他金额</view>
							<block v-if="tipAmount === formData.tip">
								<view class="icon">￥</view>
								<input class="input" type="number" v-model.trim="tipAmount" @input="inputTip" focus />
							</block>
						</view>
					</view>
					<view class="flex prompt">
						<uni-icons type="info" color="#c0c0c0" size="12"></uni-icons>
						<view style="padding-left: 10rpx;">最低0元，最高50元</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="detailPopup" type="bottom">
			<view class="popup-item detail-popup">
				<view class="flex top">
					<view class="title">费用明细</view>
				</view>
				<view class="body">
					<view class="list">
						<view class="flex item">
							<view>基础配送费</view>
							<view>￥666</view>
						</view>
						<view class="flex item">
							<view>基础配送费</view>
							<view>￥666</view>
						</view>
						<view class="flex item">
							<view>基础配送费</view>
							<view>￥666</view>
						</view>
					</view>
					<view class="bottom-box">
						<view class="flex total" @tap="closePopup('detailPopup')">
							<view>跑腿费</view>
							<view class="amount">666元</view>
							<uni-icons type="arrowup" size="12"></uni-icons>
						</view>
						<view class="btn-box">
							<button class="submit-btn" type="primary" size="mini">提交订单</button>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uploadModule from '@/components/upload-module/upload-module.vue'
	
	const recorderManager = uni.getRecorderManager()
	const innerAudioContext = uni.createInnerAudioContext()
	
	export default {
		components: {
			uploadModule
		},
		
		data() {
			return {
				wordsKey: '',
				dateList: [],
				todayTimeList: [],
				otherDayTimeList: [],
				isRecording: false,
				picList: [],
				tipAmount: '',
				formData: {
					text: '',
					buyType: 'nearby',
					date: '',
					time: '',
					weight: 10,
					sound: '',
					duration: '',
					attachFee: '',
					pickupAddress: '',
					rider: '',
					incidentally: [],
					tip: 0,
					buyAddress: {},
					sendAddress: {},
					handleAddress1: {},
					handleAddress2: {},
					takeAddress: {},
					receiptAddress: {},
					realname: '',
					phone: ''
				},
				addressType: '',
				commonWords: {
					buy: ['小吃', '快餐', '美食', '饮品', '生鲜', '医药', '其他'],
					send: ['快递包裹', '钥匙文件', '餐饮食品', '其他'],
					handle: ['收发快递', '打字复印', '送花示爱', '发请帖', '代我送', '排队', '证件代办', '缴费', '直接联系我'],
					take: ['菜鸟驿站', '快递配送站', '便利店', '到付件']
				},
				titleSource: {
					buy: '跑王代买',
					send: '跑王代取/送',
					handle: '跑王悬赏任务',
					take: '取包裹专用通道'
				},
				placeholderSource: {
					buy: '点击输入你需要购买的商品，如：啤酒一瓶，软经一包（城外用户不可选择就近购买，请选择指定地址购买）',
					send: '点击输入你需要取/送的东西，如：取一份文件（发快递请选择代办模块）',
					handle: '点击输入你的需求，如：帮我遛狗，帮我修摩托',
					take: '点击输入详细信息'
				},
				buyTypeList: [
					{ label: '购买地址', value: 'address' },
					{ label: '就近购买', value: 'nearby' }
				],
				attachFeeList: [{ key: 0, title: '专人专送', price: 10 }],
				pickupAddressList: [
					{ key: 0, title: '两个取货地址', price: 5 },
					{ key: 1, title: '三个取货地址', price: 10 },
					{ key: 2, title: '四个取货地址', price: 15 },
					{ key: 3, title: '五个取货地址', price: 20 }
				],
				incidentallyList: [
					{ key: 0, title: '隔壁顺带', price: 2 },
					{ key: 1, title: '小卖部顺带', price: 2 }
				],
				riderList: [
					{ key: 0, title: '男骑手' },
					{ key: 1, title: '女骑手' }
				],
				amountList: [
					{ title: '不加了', value: 0 },
					{ title: '￥10', value: 10 },
					{ title: '￥20', value: 20 },
					{ title: '￥30', value: 30 },
					{ title: '￥40', value: 40 },
					{ title: '￥50', value: 50 }
				]
			}
		},
		onLoad(params) {
			this.wordsKey = params.key || 'buy'
			uni.setNavigationBarTitle({
				title: this.titleSource[params.key] || '跑腿王'
			})
			recorderManager.onStop(res => {
				this.formData.sound = res.tempFilePath
				this.formData.duration = Math.ceil(res.duration / 1000)
				innerAudioContext.src = this.formData.sound
			});
			
			this.init()
		},
		onShow () {
			const pages = getCurrentPages()
			const currPage = pages[pages.length - 1]
			console.log(currPage.data.addressType, 'tttt')
			if (currPage.data.addressType) {
				const address = currPage.data.address
				switch (currPage.data.addressType) {
					case 'send':
						this.$set(this.formData, 'sendAddress', address)
						break
					case 'handle1':
						this.$set(this.formData, 'handleAddress1', address)
						break
					case 'handle2':
						this.$set(this.formData, 'handleAddress2', address)
						break
					case 'take':
						this.$set(this.formData, 'takeAddress', address)
						break
					case 'receipt':
						this.$set(this.formData, 'receiptAddress', address)
						break
					default:
						break
				}
			}
		},
		
		methods: {
			init () {
				this.getDateList()
				this.getTodayTime()
				this.getOtherDayTime()
			},
			
			getDateList () {
				const now = new Date()
				let date = now.getDate()
				const dateList = []
				for (let i = 0; i < 8; i++) {
					i > 0 && (date += 1)
					now.setDate(date)
					const m = ('0' + (now.getMonth() + 1)).slice(-2)
					const d = ('0' + now.getDate()).slice(-2)
					const item = `${m}-${d}`
					dateList.push(item)
				}
				this.dateList = dateList
				this.formData.date = dateList[0]
			},
			getTodayTime () {
				const now = new Date()
				let tomorrow = new Date()
				const date = tomorrow.getDate() + 1
				tomorrow.setDate(date)
				tomorrow.setHours(0)
				tomorrow.setMinutes(0)
				tomorrow.setSeconds(0)
				const tomorrowTime = tomorrow.getTime()
				const timeList = []
				while(now.getTime() < tomorrowTime) {
					let m = now.getMinutes()
					m = +m + 20
					now.setMinutes(m)
					const time = now.toTimeString().slice(0, 5)
					now.getTime() <= tomorrowTime && timeList.push(time)
				}
				if (timeList.length) {
					timeList[0] = `立即送出(约${timeList[0]})`
				} else {
					const m = ('0' + (now.getMonth() + 1)).slice(-2)
					const d = ('0' + now.getDate()).slice(-2)
					const time = now.toTimeString().slice(0, 5)
					timeList[0] = `立即送出(约${m}-${d} ${time})`
				}
				this.todayTimeList = timeList
				this.formData.time = timeList[0]
			},
			getOtherDayTime () {
				const timeList = []
				for (let i = 0; i < 24; i++) {
					for (let j = 0; j < 60; j+= 20) {
						const h = ('0' + i).slice(-2)
						const m = ('0' + j).slice(-2)
						timeList.push(`${h}:${m}`)
					}
				}
				this.otherDayTimeList = timeList
			},
			
			clickWord (item) {
				this.formData.text += `${item} `
			},
			
			chooseBuyAddress () {
				uni.chooseLocation({
					success: res => {
						this.formData.buyAddress = Object.assign({}, this.formData.buyAddress, {
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude,
							name: res.name
						})
					}
				})
			},
			
			isStart () {
				uni.vibrateShort()
				this.isRecording = true
				recorderManager.start({
					duration: 120000
				})
			},
			isEnd () {
				this.isRecording = false
				recorderManager.stop()
			},
			playSound () {
				if (innerAudioContext.paused) {
					innerAudioContext.play()
				} else {
					innerAudioContext.stop()
				}
			},
			delSound () {
				this.formData.sound = ''
				this.formData.duration = ''
				innerAudioContext.stop()
			},
			
			uploadSucess (list) {
				this.picList = this.picList.concat(list)
			},
			previewPicItem (idx, list) {
				uni.previewImage({
					current: idx || 0,
					urls: list
				})
			},
			delPicItem (idx) {
				this.picList.splice(idx, 1)
			},
			
			openPopup (val) {
				this.$refs[val].open()
			},
			closePopup (val) {
				this.$refs[val].close()
			},
			
			changeBuyType (val) {
				this.formData.buyType = val
			},
			
			clickAttach (item, key) {
				if (Array.isArray(this.formData[key])) {
					// 多选
					const idx = this.formData[key].findIndex(child => child === item.key)
					if (~idx) {
						this.formData[key].splice(idx, 1)
					} else {
						this.formData[key].push(item.key)
					}
				} else {
					if (this.formData[key] === item.key) {
						this.formData[key] = ''
					} else {
						this.formData[key] = item.key
					}
				}
			},
			
			clickDate (val) {
				this.formData.date = val
			},
			clickTime (val) {
				this.formData.time = val
				this.closePopup('timePopup')
			},
			
			clickTip (val) {
				this.formData.tip = val
			},
			inputTip (e) {
				this.formData.tip = e.detail.value
			},
			confirmTip () {
				if (this.formData.tip < 0 || this.formData.tip > 50) {
					uni.showToast({
						title: '小费需大于等于0，且小于等于50',
						icon: 'none'
					})
					return
				}
				this.closePopup('tipPopup')
			},
			
			changeWeight (e) {
				this.formData.weight = e.detail.value
			},
			
			toPage (url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	padding: 20rpx 20rpx 160rpx;
}

.section {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
}

.top-pic {
	image {
		width: 100%;
	}
}

.input-module {
	.input {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		max-height: 220rpx;
	}
	.common-words {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 20rpx 30rpx 0;
		.words-item {
			padding: 4rpx 16rpx;
			background-color: #E1F3D8;
			border-radius: 8rpx;
			margin: 0 16rpx 16rpx 0;
		}
	}
	.advance {
		/deep/ .uni-list-item {
			padding-left: 30rpx;
			.uni-list-item__icon {
				margin-right: 10rpx;
			}
			.uni-list-item__container {
				padding: 20rpx 20rpx 20rpx 0;
				.uni-list-item__content-title, .uni-list-item__extra-text {
					font-size: 24rpx;
				}
			}
		}
	}
}

.detail-module {
	padding: 0 30rpx;
	.buy-type {
		padding: 20rpx 0;
		.title {
			margin-right: 30rpx;
		}
		.item {
			border: 1px solid #666666;
			border-radius: 10rpx;
			padding: 8rpx 16rpx;
			margin-right: 20rpx;
			font-size: 24rpx;
		}
		.active {
			border-color: red;
		}
	}
	.address {
		/deep/ .uni-list-item {
			padding-left: 0;
			.uni-list-item__content {
				flex: 1 160rpx;
			}
			.uni-list-item__container {
				padding-right: 0;
			}
		}
		.inline-list-item {
			width: 100%;
			uni-list-item {
				flex: 1;
				&:nth-of-type(2) {
					margin-left: 20rpx;
				}
			}
			/deep/ .uni-list-item__container {
				&::after {
					display: none;
				}
			}
		}
	}
}

.protocol {
	padding: 10rpx 0 30rpx;
	.title {
		margin-right: 10rpx;
		padding-left: 10rpx;
	}
	view {
		font-size: 24rpx;
	}
}

.bottom, .bottom-box {
	padding: 0 20rpx;
	.total {
		justify-content: flex-end;
		align-items: baseline;
		padding: 10rpx 0;
		.amount {
			font-size: 36rpx;
			color: red;
			margin: 0 10rpx;
		}
	}
	.btn-box {
		.submit-btn {
			width: 100%;
			padding: 10rpx 0;
			background-color: $uni-color-main;
		}
	}
}
.bottom {
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 0;
	margin-bottom: 0;
	z-index: 1;
}

.supplement, .attach {
	padding: 10rpx 30rpx;
	.item {
		padding: 10rpx 0;
		.title {
			margin-right: 40rpx;
			flex-shrink: 0;
		}
	}
}
.supplement {
	.sound {
		.sound-box, .recording-btn {
			padding: 6rpx 20rpx;
			border: 1px solid #CCCCCC;
			border-radius: 10rpx;
		}
		.recording-btn {
			margin-right: 30rpx;
			.text {
				margin-left: 10rpx;
			}
		}
		.sound-box {
			position: relative;
			.duration {
				font-size: 24rpx;
				margin-right: 16rpx;
			}
			.del-sound-icon {
				position: absolute;
				z-index: 1;
				top: -16rpx;
				right: -16rpx;
			}
		}
	}
	.pic {
		.pic-module {
			flex-wrap: wrap;
			.pic-item, .upload-icon {
				width: 120rpx; height: 120rpx;
				margin: 16rpx 0;
			}
			.pic-item {
				position: relative;
				border-radius: 10rpx;
				margin-right: 20rpx;
				image {
					width: 100%;
					height: 100%;
				}
				.del-icon {
					position: absolute;
					top: -16rpx;
					right: -16rpx;
					z-index: 1;
				}
			}
		}
	}
}

.attach {
	.item {
		padding: 10rpx 0;
		.title {
			width: 140rpx;
			margin-right: 0;
			flex-shrink: 0;
		}
		.list {
			flex: 1;
			.fill-input {
				flex: 1;
			} 
		}
	}
	.list {
		white-space: nowrap;
		overflow-x: scroll;
		.option-item {
			font-size: 24rpx;
			padding: 6rpx 20rpx;
			border: 1px solid #CCCCCC;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}
		.active {
			background-color: $uni-color-main;
			color: #FFFFFF;
			border-color: transparent;
		}
	}
}

.popup-item {
	background-color: #FFFFFF;
	.top {
		padding: 20rpx;
		border-bottom: 1px solid #EEEEEE;
		.title {
			font-size: 32rpx;
		}
	}
}

.advance-popup {
	.top {
		justify-content: space-between;
	}
	.body {
		padding: 20rpx;
		text-align: center;
		color: #666666;
		.input-box, .prompt {
			justify-content: center;
		}
		.input-box {
			margin: 20rpx 0;
			padding: 4rpx 20rpx;
			border: 1px solid red;
			border-radius: 10rpx;
			color: red;
			.input {
				width: 140rpx;
				text-align: left;
				margin-left: 20rpx;
			}
		}
		.prompt {
			color: #c0c0c0;
			font-size: 24rpx;
		}
	}
}

.time-popup, .weight-popup {
	.top {
		position: relative;
		justify-content: center;
		.cancel {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 20rpx;
		}
	}
}
.time-popup {
	.body {
		display: flex;
		align-items: flex-start;
		.list {
			height: 460rpx;
			// overflow-y: scroll;
			text-align: center;
			// display: flex;
			// flex-direction: column;
			// align-items: center;
			.item {
				text-align: center;
				padding: 20rpx 0;
				width: 100%;
			}
		}
		.date-list {
			width: 200rpx;
			background-color: #f0f0f0;
			.active {
				background-color: #FFFFFF;
			}
		}
		.time-list {
			flex: 1;
			.item {
				position: relative;
				.icon {
					position: absolute;
					top: 50%;
					right: 20rpx;
					transform: translateY(-50%);
				}
			}
			.active {
				color: $uni-color-main;
			}
		}
	}
}

.weight-popup {
	.body {
		padding: 20rpx 20rpx 40rpx;
		text-align: center;
		.weight-value {
			font-size: 48rpx;
			color: red;
			margin-top: 20rpx;
		}
		.slider {
			width: 80%;
			margin: 0 auto;
			.text-list {
				margin-top: -16rpx;
				justify-content: space-between;
				.left {
					transform: translateX(-30%);
				}
			}
		}
	}
}

.tip-popup {
	.top {
		justify-content: space-between;
	}
	.body {
		padding: 20rpx 20rpx 40rpx;
		text-align: center;
		.amount-list {
			flex-wrap: wrap;
			justify-content: space-between;
			.item {
				width: 32%;
				height: 60rpx;
				line-height: 60rpx;
				box-sizing: content-box;
				border: 1px solid #EEEEEE;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
			}
			.custom-item {
				width: 100%;
				justify-content: center;
				.icon {
					margin-left: 10rpx;
				}
				.input {
					width: 140rpx;
					text-align: left;
					margin-left: 20rpx;
				}
			}
			.active {
				border-color: red;
				color: red;
			}
		}
		.prompt {
			justify-content: center;
			color: #c0c0c0;
			font-size: 24rpx;
		}
	}
}

.detail-popup {
	.top {
		justify-content: center;
	}
	.body {
		.list {
			padding: 10rpx 30rpx;
			border-bottom: 1px solid #EEEEEE;
			.item {
				justify-content: space-between;
				padding: 10rpx 0;
				color: #999999;
			}
		}
	}
}
</style>
