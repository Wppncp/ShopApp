<template>
	<view class='my'>
		<!--头部-->
		<view class='my-header'>
			<view class='header-main'>
				<view class='header-config' @tap="goConfig">
					<image class='config-img' src="https://gitee.com/l7788/shopApp/raw/master/static/img/config.png" mode=""></image>
				</view>
				<view class='header-logo' @tap="goLogin">
					<image class='logo-img' :src="loginStatus?userInfo.imgUrl:''" mode=""></image>
					<view class='logo-name'>{{loginStatus?userInfo.nickName:'用户昵称'}}</view>
				</view>
			</view>
		</view>
		<!--我的订单-->
		<view class='order'>
			<view class='order-title' @tap="goOrder">
				<view >我的订单</view>
				<view>全部订单 > </view>
			</view>
			<view class='order-list'>
				<view class='order-item'>
					<image  class='order-img' src="https://gitee.com/l7788/shopApp/raw/master/static/img/order1.png" mode=""></image>
					<view>待付款</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="https://gitee.com/l7788/shopApp/raw/master/static/img/order2.png" mode=""></image>
					<view>待付款</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="https://gitee.com/l7788/shopApp/raw/master/static/img/order3.png" mode=""></image>
					<view>待付款</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="https://gitee.com/l7788/shopApp/raw/master/static/img/order4.png" mode=""></image>
					<view>待付款</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="https://gitee.com/l7788/shopApp/raw/master/static/img/order5.png" mode=""></image>
					<view>待付款</view>
				</view>
			</view>
		</view>
		<!--内容列表-->
		<view class='my-content'>
			
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view>
			<view>敬请期待...</view>
<!-- 			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view>
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view>
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view>
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view>
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view>
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>></view>
			</view> -->
			
		</view>
		<Tabbar cureentPage='my'></Tabbar>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import Tabbar from '@/components/common/Tabbar.vue'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goConfig(){
				uni.navigateTo({
					url:'../../pages/my-config/my-config'
				})
			},
			goOrder(){
				uni.navigateTo({
					url:'../../pages/my-oreder/my-oreder'
				})
			},
			goLogin(){
				uni.navigateTo({
				})
			}
		},
		computed:{
			...mapState('user',['loginStatus','userInfo'])
		},
		components:{Tabbar}
	}
</script>

<style scoped>
.my-header{
	background: url('https://pic3.zhimg.com/v2-d04f7a3901c525e3219e49f6bc764336_r.jpg') no-repeat;
	background-size: 100%;
	width: 100%;
	height: 450rpx;
}
.header-main{
	position: relative;
	top:120rpx;
}
.header-config{
	position: absolute;
	left:20rpx;
}
.header-logo{
	position: absolute;
	left:50%;
	margin-left:-60rpx;
	width:120rpx;
}
.config-img{
	width: 40rpx;
	height: 40rpx;
}
.logo-img{
	width: 120rpx;
	height: 120rpx;
	border:2rpx solid #CCCCCC;
	border-radius: 50%;
	background-color: #FFFFFF;
}
.logo-name{
	font-size: 28rpx;
	font-weight: bold;
	color:#FFFFFF;
	text-align: center;
}
.order-title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
}
.order-list{
	padding: 20rpx;
	display: flex;
}
.order-item{
	flex:1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.order-img{
	width:66rpx;
	height: 66rpx;
}
.my-content{
	margin:20rpx 0;
	padding:0 20rpx;
}
.my-content-item{
	display: flex;
	justify-content: space-between;
	align-items:center;
	padding:20rpx 0; 
	border-bottom: 2px solid #CCCCCC;
}
</style>
