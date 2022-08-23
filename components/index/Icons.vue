<template>
	<view class="icons">
		
		<view class="icons-item" v-for="(item,index) in dataList" :key="index">
			<image class="icons-img" :src="item.imgUrl" mode=""></image>
			<text class="icons-name f-color" >{{item.name}}</text>
		</view>		
<!-- 		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons2.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view>		
		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons3.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view>		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons4.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view>		
		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons5.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view>		
		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons6.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view>		
		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons7.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view>		
		<view class="icons-item">
			<image class="icons-img" src="../../static/img/icons8.png" mode=""></image>
			<text class="icons-name f-color" >跑步鞋</text>
		</view> -->
		
	</view>
</template>

<script>

	export default {
		name:'Icons',
		data() {
			return {}
		},
		methods: {},
		components:{},
		props:{ dataList:Array }
	}
</script>

<style scoped lang="scss">
.icons{
	display: flex;
	flex-wrap: wrap;
	.icons-item{
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 20rpx;
		.icons-img{
			width: 110rpx;
			height: 110rpx;
		}
	}
}
</style>
