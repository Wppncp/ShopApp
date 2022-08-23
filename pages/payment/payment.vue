<template>
	<view>
		<!--自定义导航栏-->
		<uniNavBar title="确认支付" left-text="关闭" fixed="true" status-bar="true" @clickLeft="goBack"></uniNavBar>

		<view class="pay-main">
			<radio-group>
				<label for="">
					<view class="pay-item">
						<image class="pay-img" src="https://gitee.com/l7788/shopApp/raw/master/static/img/zfb.png" mode=""></image>
						<view>
							<view>支付宝支付</view>
							<view class="pay-txt">推荐支付宝用户使用</view>
						</view>
						<label class="radio">
							<radio value="" color="#FF3333" checked />
							<text></text>
						</label>
					</view>
				</label>
				<label for="">
					<view class="pay-item">
						<image class="pay-img" src="https://gitee.com/l7788/shopApp/raw/master/static/img/wxf.png" mode=""></image>
						<view>
							<view>微信支付</view>
							<view class="pay-txt">由于权限微信暂不支持,深感抱歉</view>
						</view>
						<label class="radio">
							<radio value="" color="#FF3333" />
							<text></text>
						</label>
					</view>
				</label>
			</radio-group>
		</view>
		<!--去支付-->
		<view class="pay-foot">
			<view class="total">
				<text class="f-color">合计:</text>
				<text class="total-price">¥{{ details.price }}</text>
			</view>
			<view class="go-pay" @tap="goPayment">去支付</view>
		</view>
	</view>
</template>

<script>
import http from '@/common/api/request.js'
import {mapState} from 'vuex'
import uniNavBar from '@/components/uni/uni-nav-bar/uni-nav-bar.vue';
export default {
	data() {
		return {
			details:{
				price:0,
			    list:[]
			}
		};
	},
	components: {
		uniNavBar
	},
	computed:{		...mapState('order', ['orderNumber']),},
	methods: {
		//点击关闭返回上一页
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		goPayment() {
			http.request({
				url: '/payment',
				method: 'POST',
				header: {
					token: true
				},
				data: {
					orderId:this.orderNumber,
					price:this.details.price,
					list:this.details.list
				}
			}).then(res => {
				
				uni.showModal({
					content:"!!!买家账号:iebjeb3893@sandbox.com;登陆密码:111111;支付密码：111111",
					success:function(){
						//#ifdef H5 
						window.location.href=res.paymentUrl; 
						//#endif
						// #ifdef APP
						plus.runtime.openURL(res.paymentUrl);
						//#endif
					}
				})
				//卖家账号hixegq6576@sandbox.com;uid:2088621955877677;登陆密码:111111
				//买家账号iebjeb3893@sandbox.com;登陆密码:111111;支付密码：111111
			});

			// uni.requestPayment({
			// 	provider:'alipay',
			// 	orderInfo:'',//订单数据
			// 	success:function(res){				}
			// })

			// uni.navigateTo({
			// 	url: '../payment-success/payment-success'
			// });
		}
	},
	onLoad(e) {
		this.details = JSON.parse(e.details);
	}
};
</script>

<style scoped>
.pay-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 2rpx solid #cccccc;
}
.pay-img {
	width: 100rpx;
	height: 100rpx;
}
.pay-txt {
	color: #cccccc;
}
.pay-foot {
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 0;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.total {
	padding-left: 100rpx;
	flex: 1;
	background-color: #000000;
	line-height: 100rpx;
}
.go-pay {
	color: #ffffff;
	background-color: #49bdfb;
	line-height: 100rpx;
	text-align: center;
	width: 220rpx;
}
.total-price {
	color: #ffffff;
}
</style>
