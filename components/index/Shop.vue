<template>
	<view class='shop'>
		
		<view class='shop-item' v-for="(item,index) in dataList" :key="index">
			<view class='shop-big'>
				<image class='shop-big' :src="item.bigUrl" mode=""></image>
			</view>
			<scroll-view scroll-x="true" class='scroll-content'>
				<view class='scroll-item'>
					<Commodity 
						:dataList='item.data'
						wrap='no-wrap'
						itemW='200rpx'
						bigH='200rpx'
						nameSize='23rpx'
					></Commodity>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
import Commodity from '../common/Commodity.vue'
export default {
	props:{ dataList:Array },
	data () {
		return {
			// shopList:[
			// 	{
			// 		id:1,
			// 		imgUrl:'../../static/img/shop1.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:2,
			// 		imgUrl:'../../static/img/shop2.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:3,
			// 		imgUrl:'../../static/img/shop3.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:4,
			// 		imgUrl:'../../static/img/shop4.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:5,
			// 		imgUrl:'../../static/img/shop1.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:6,
			// 		imgUrl:'../../static/img/shop2.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:7,
			// 		imgUrl:'../../static/img/shop3.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:8,
			// 		imgUrl:'../../static/img/shop4.jpg',
			// 		name:'大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	}
			// ]
		}
	},
	components:{ Commodity }
}
</script>

<style scoped>
.shop-big{
	width:100%;
	height: 350rpx;
}
.scroll-content{
	width: 100%;
	white-space: nowrap;
}
.scroll-item{
	display: inline-block;
}
</style>
