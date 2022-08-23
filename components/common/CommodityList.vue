<template>
	<view class="Commodity-List">
		<Commodity :dataList='dataList'></Commodity>
	</view>
</template>

<script>
	import Commodity from '@/components/common/Commodity.vue'
	export default {
		name:'Commodity-List',
		data() {
			return {
				// commodityList:[
				// 	{
				// 		id:1,
				// 		imgUrl:'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp',
				// 		name:'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
				// 		pprice: '399.00',
				// 		oprice: '399.00',
				// 		discount:'No discounts'
				// 	},
				// 	{
				// 		id:2,
				// 		imgUrl:'https://img10.360buyimg.com/babel/s320x320_jfs/t1/209376/2/25426/55485/62f1f836Ea517b9b3/7a722cb5078245d0.jpg!cc_320x320.webp',
				// 		name:'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
				// 		pprice: '399.00',
				// 		oprice: '399.00',
				// 		discount:'No discounts'
				// 	},
				// 	{
				// 		id:3,
				// 		imgUrl:'https://img14.360buyimg.com/babel/s320x320_jfs/t1/159033/36/267/239844/5fea98f4Ed310d356/6c7ce3060724bc99.jpg!cc_320x320.webp',
				// 		name:'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
				// 		pprice: '399.00',
				// 		oprice: '399.00',
				// 		discount:'No discounts'
				// 	},
				// 	{
				// 		id:4,
				// 		imgUrl:'https://img12.360buyimg.com/babel/s320x320_jfs/t1/75143/15/21224/147883/62f13668E845c4c3b/37e3d362722d8ba4.jpg!cc_320x320.webp',
				// 		name:'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
				// 		pprice: '399.00',
				// 		oprice: '399.00',
				// 		discount:'No discounts'
				// 	}
				// ]
			}
		},
		methods: {},
		components: { Commodity },
		props:{ dataList:Array }
	}
</script>

<style>

</style>
