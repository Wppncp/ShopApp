<template>
	<view class="recommend bg-color">
		
		<view class="recommend-item " v-for="(item, index) in dataList" :key="index">
			<image class="item-big" :src="item.bigUrl" mode=""></image>
			<view class="item-samll">
				<block v-for='(k,i) in item.data' :key="i">
					<image class="item-img" :src="k.imgUrl" mode=""></image>
				</block>
				
			</view>
		</view>
		

				
	</view>
</template>

<script>
	export default {
		name: 'recommend',
		data() {
			return {}
		},
		methods: {},
		props:{ dataList:Array }
	}
</script>

<style scoped lang="scss">
.recommend{
	padding: 20rpx;
	.recommend-item{
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		border: 2rpx solid #cccccc;
		overflow: hidden;
		margin: 20rpx 0;
		.item-big{
			width: 100%;
			height: 350rpx;
		}
		.item-samll{
			width: 100%;
			height: 350rpx;
			display: flex;
			.item-img{
				flex: 1;
				height: 350rpx;
			}
		}
	}
}

</style>
