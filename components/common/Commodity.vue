<template>
	<view class="commodity" :style="'flex-wrap:'+wrap+';'">
		
		<view 
		class="commodity-item" 
		v-for="item in dataList" 
		:key="item.id" 
		:style="'width:'+itemW+';'"
		@tap="goDetail(item.id)">
			<image
				class="commodity-img"
				:src="item.imgUrl"
				mode=""
				:style="'height:'+bigH+';'"
			></image>
			<view class="commodity-content">
				<text class="commodity-name" :style="'font-size:'+nameSize+';'">
					{{item.name}}
				</text>
				<view>
					<text class="pprice">￥{{item.pprice}}</text>
					<text class="oprice">￥{{item.oprice}}</text>
				</view>
				<text class="discount">{{item.discount}}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	name: 'Commodity',
	props:{
		//商品数据
		dataList:Array,
		//每个商品所占宽度
		itemW:{
			type:String,
			default:'50%'
		},
		//商品图片高度
		bigH:{
			type:String,
			default:'450rpx'
		},
		//商品过多换不换行
		wrap:{
			type:String,
			default:'wrap'
		},
		//商品名字字体大小
		nameSize:{
			type:String,
			default:'30rpx'
		}
	},
	data() {
		return {}
	},
	methods: {
		goDetail(id){
			uni.navigateTo({
				url:'../../pages/detail/detail?id='+id
			})
		}
	}
}
</script>

<style scoped lang="scss">
.commodity {
	display: flex;
	// flex-wrap: wrap;
	.commodity-item {
		// width: 50%;
		padding-bottom: 20rpx;
		.commodity-img {
			width: 100%;
			// height: 450rpx;
		}
		.commodity-content {
			text-align: center;
			.commodity-name {
				display: block;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				color: #333333;
				padding: 6rpx 20rpx;
				height: 50rpx;
			}
			.oprice {
				text-decoration: line-through;
				font-size: 24rpx;
				color: #999999;
			}
			.discount {
				border-radius: 4rpx;
				border: 1px solid #ff3333;
				padding: 2rpx 10rpx;
				font-size: 20rpx;
				color: #ff3333;
			}
		}
	}
}
</style>
