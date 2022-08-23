<template>
	<view class='hot'>
		<Commodity :dataList='dataList' itemW='33.33%' bigH='375rpx'></Commodity>
		
	</view>
</template>

<script>
import Commodity from '../common/Commodity.vue'
export default{
	data () {
		return {
			// hotList:[
			// 	{
			// 		id:1,
			// 		imgUrl:'../../static/img/hot1.jpg',
			// 		name:'跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:2,
			// 		imgUrl:'../../static/img/hot2.jpg',
			// 		name:'跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:3,
			// 		imgUrl:'../../static/img/hot3.jpg',
			// 		name:'跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:4,
			// 		imgUrl:'../../static/img/hot1.jpg',
			// 		name:'跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:5,
			// 		imgUrl:'../../static/img/hot2.jpg',
			// 		name:'跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	},
			// 	{
			// 		id:6,
			// 		imgUrl:'../../static/img/hot3.jpg',
			// 		name:'跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
			// 		pprice:'299',
			// 		oprice:'659',
			// 		discount:'5.2'
			// 	}
			// ]
		}
	},
	props:{ dataList:Array },
	components:{ Commodity }
}
</script>

<style>
</style>
