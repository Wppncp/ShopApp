<template>
	<view class="shop-list">
		
		<view class="shop-title f-color">
			<view class="shop-item" 
				v-for="(item,index) in shopList.data" 
				:key="index"
				@tap="changeTab(index)"
			>
				<text :class=" shopList.currentIndex==index?'f-active-color':''">{{item.name}}</text>
				<view class="shop-icon">
					<view class="iconfont icon-shangjiantou"
					:class="item.status === 1?'f-active-color':''"></view>
					<view class="iconfont icon-xiajiantou"
					:class="item.status === 2?'f-active-color':''"></view>
				</view>
			</view>
		</view>				

		
		<Lines/>
		<Commodity-List  :dataList='dataList'></Commodity-List>
	</view>
</template>

<script>
	import Lines from '@/components/common/Lines.vue'
	import CommodityList from '@/components/common/CommodityList.vue'
	import http from '@/common/api/request.js'
	export default {
		props:['keyword'],
		watch:{
			// 'shopList.currentIndex':{
			// 	handler(newVal,oldVal){					
			// 		this.shopList.currentIndex = newVal 
			// 		let idx = this.shopList.currentIndex
			// 		let obj = this.shopList.data[idx]
			// 		let arr = []
			// 		for(let prop in obj){
			// 			arr.push(obj[prop])
			// 		}
			// 		this.val = arr[1] === 1 ? 'desc':'asc'
			// 		this.objKey = arr[2]
			// 		console.log(arr)
			// 	},
			// 	deep:true
			// },
			// 'shopList.data':{
			// 	handler(newVal,oldVal){		
			// 		let idx = this.shopList.currentIndex
			// 		let obj = this.shopList.data[idx]
			// 		let arr =[]
			// 		for(let prop in obj){
			// 			arr.push(obj[prop])
			// 		}					
			// 		this.val = arr[1] === 1 ? 'desc': 'asc'
			// 		this.objKey=arr[2]
			// 	},
			// 	deep:true
			// },
			'shopList':{
				handler(newVal,oldVal){		
					let idx = this.shopList.currentIndex
					let obj = this.shopList.data[idx]
					let arr =[]
					for(let prop in obj){
						arr.push(obj[prop])
					}					
					this.val = arr[1] === 1 ? 'desc': 'asc'
					this.objKey=arr[2]
				},
				deep:true
			}
		},
		data() {
			return {
				//顶栏信息
				shopList:{
					currentIndex:0,
					data:[
						{ name:'综合',status:1,key:'names' },
						{ name:'价格',status:0,Key:'pprice' },
						{ name:'品牌',status:0,key:'names' },
					]
				},
				//所有商品信息
				dataList:[],
				//给数据库传递的值对应shopList.data的key值和(desc降序操作、asc升序操作)
				objKey:'names',
				val:'desc',
			}
		},
		methods: {
			changeTab(index){
				//点击后升降序后再次请求
				 this.getData()
								
				//引索
				let idx = this.shopList.currentIndex
				//具体综合价格品牌哪一个
				let item =this.shopList.data[idx]
				//升序降序
				if(idx == index){
					return item.status =item.status === 1?2:1
				}

				let newItem =this.shopList.data[index]
				item.status = 0
				this.shopList.currentIndex =index
				newItem.status=1				
			},
			getData(){				
				setTimeout(()=>{
					console.log(this.val)
					http.request({
						url:'/goods/search',
						data:{
							name:this.keyword,
							// ...this.orderBy
							[this.objKey] : this.val
						}
					}).then(res=>{
						console.log(JSON.stringify(res))
						this.dataList=res
					}).catch(()=>{
						uni.showToast({ title:'请求失败' })
					})					
				 },800)
			}
		},
		mounted() {
			this.getData()
		},
		components:{ Lines,CommodityList }
	}
</script>

<style scoped lang="scss">
.shop-list{
	.shop-title{
		display: flex;
		.shop-item{
			flex: 1;
			display: flex;
			justify-content: center;
			height: 60rpx;
			.shop-icon{
				position: relative;
				margin-left: 10rpx;
				.iconfont{
					width: 16rpx;
					height: 15rpx;
				}
			}
		}
	}
}
</style>
