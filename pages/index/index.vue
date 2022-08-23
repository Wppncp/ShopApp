<template>
	<view class="index">
		<!-- #ifdef MP-WEIXIN -->
		<view class="wx-nav">
			<view class="iconfont icon-fangdajing" @click="searchEnter"></view>
			<!-- <text>好物多</text> -->
			<view class="iconfont icon-xiaoxi"></view>
		</view>
		<!-- #endif -->
		
		<scroll-view scroll-x="true" class="scroll-content">
			<view v-for="(item,index) in topBar" :key="index" class="scroll-item" @click="changeTab(index)">
				<text :class="topBarIndex===index?'f-active-color':'f-color'">{{item.name}}</text>
			</view>
		</scroll-view>
		
		<swiper 
		:style="'height:'+clentHeight+'px;'"  
		@change="onChangeTab" 
		:current="topBarIndex" 
		:scroll-into-view="ScrollInto"
		>
			<swiper-item v-for="(item,index) in newTopBar" :key="index"  :id="'top'+index"> <!-- :id="'top'+index" -->
			
				<scroll-view scroll-y="true" :style="'height:'+clentHeight+'px;'" @scrolltolower="loadMore(index)">
					<block v-if="item.data.length>0">
						<block v-for='(k,i) in item.data' :key="i">
						
							<swiper-vue v-if='k.type === "swiperList"' :dataList='k.data'></swiper-vue>
							
							<template v-if='k.type === "recommendList"'>
								<recommend  :dataList='k.data'></recommend>
								<Card cardTitle="猜你喜欢"></Card>						
							</template>
							
							<Banner v-if='k.type === "bannerList"' :dataList='k.imgUrl'></Banner>
							
							<template v-if='k.type === "iconsList"'>
								<Icons :dataList='k.data'></Icons>
								<Card cardTitle="热销爆品"></Card>
							</template>
							
							<template v-if='k.type === "hotList"'>
								<Hot :dataList='k.data'></Hot>
								<Card cardTitle="推荐店铺"></Card>
							</template>
							
							<template v-if='k.type === "shopList"'>
								<Shop :dataList='k.data'></Shop>	
								<Card cardTitle="为您推荐"></Card>						
							</template>
							
							<Commodity-List v-if='k.type === "commodityList"' :dataList='k.data'></Commodity-List>
							
						</block>
					</block>
					<view v-else>暂无数据...</view>
					<view class="load-text .f-color">
						{{item.loadText}}
					</view>
				</scroll-view>
					
			</swiper-item>
		</swiper>
		<Tabbar cureentPage='index'></Tabbar>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import SwiperVue from '@/components/index/Swiper-Vue.vue'
	import Recommend from '@/components/index/Recommend.vue'
	import Card from '@/components/common/Card.vue'
	import CommodityList from '@/components/common/CommodityList.vue'
	import Banner from '@/components/index/Banner.vue'
	import Icons from '@/components/index/Icons.vue'
	import Hot from '@/components/index/Hot.vue'
	import Shop from '@/components/index/Shop.vue'
	import Tabbar from '@/components/common/Tabbar.vue'
export default {
	data() {
		return {  
			//选中索引
			topBarIndex: 0,
			//跟随索引id
			ScrollInto :'top0',
			//顶栏数据
			topBar:[],
			//承载不同顶栏数据
			newTopBar:[],
			//内容块高度
			clentHeight:0,
			
		}
	},
	onLoad() {
		this._initIndex()
	},
	onReady() {
		uni.getSystemInfo({
			success: res => {
				this.clentHeight = res.windowHeight - uni.upx2px(80)-this.getClentHeight()
			}
		})
	},
	onNavigationBarButtonTap(e) {
		if(e.float =='left'){
			uni.navigateTo({ url:'../search/search' })
		}
	},
	methods: {
		//点击顶栏
		changeTab(index){
			if(this.topBarIndex === index){
				return 
			}
			this.topBarIndex = index
			this.ScrollInto = 'top'+index
			//每次滑动赋值first以请求
			if(this.newTopBar[this.topBarIndex].load === 'first'){
				this.addData()
			}
		},
		//对应滑块
		onChangeTab(e){
			this.changeTab(e.detail.current)
		},
		_initIndex(){
			
			http.request({ url:'/index_list/data', }).then(res=>{
				this.topBar = res.topBar
				this.newTopBar = this.initData(res)
			}).catch(()=>{
				uni.showToast({ title:'请求失败' })
			})
			
		},
		//加载不同顶栏数据
		initData(res){
			let arr =[]
			for(let i=0;i<this.topBar.length;i++){
				let obj = { data:[],load:'first',loadText:'上拉加载更多...' }
				//获取首次数据
				if(i == 0){
					obj.data = res.data
				}
				arr.push(obj)
			}
			return arr
		},
		//获取可视区兼容不同系统
		getClentHeight(){
			const res = uni.getSystemInfoSync()
			const system = res.platform
			if(system === 'ios'){
				return 44+res.statusBarHeight
			}else if(system === 'android'){
				return 48+res.statusBarHeight	
			}else{
				return 35
			}
		},
		//对应顶栏显示不同数据
		addData(callback){
			const baseURL = this.$baseURL//http://192.168.0.105:3000
			//索引
			let index = this.topBarIndex
			//模板id
			let id = this.topBar[index].id
			//请求模板数据
			let page = Math.ceil(this.newTopBar[index].data.length/5)+1
			http.request({ url:`/index_list/${id}/data/${page}` }).then(res=>{
				this.newTopBar[index].data = [...this.newTopBar[index].data,...res]
			}).catch(()=>{
				uni.showToast({ title:'请求失败' })
			})
			//请求结束后滑块赋值last
			this.newTopBar[index].load='last'
			if( typeof callback === 'function'){
				callback()
			}
		},
		//上拉加载更多
		loadMore(index){
			this.newTopBar[index].loadText = '加载中...'
			this.addData( ()=>{
				this.newTopBar[index].loadText = '上拉加载更多...'
			})
		},
		//进入搜索页面
		searchEnter(){
			uni.navigateTo({ url:'../search/search' })
		}
	},
	components:{ SwiperVue,Recommend,Card,CommodityList,Banner,Icons,Hot,Shop,Tabbar }
}
</script>

<style scoped lang="scss">
.wx-nav {
	text-align: center;
	height: 35rpx;
	width: 100%;
	// line-height: 35rpx;
	display: flex;
	justify-content: space-between;
	text{
		margin:0 50rpx 0 50rpx;
		
	}
}
.scroll-content{
	width: 100%;
	height: 80rpx;
	white-space: nowrap;
	.scroll-item{
		display: inline-block;
		padding: 10rpx 30rpx;
		font-size: 36rpx;
		.f-active-color{
			padding: 10rpx 0;
			border-bottom: 6rpx solid #49BDFB;
		}
	}
}
.load-text{
	border-top: 2rpx solid #636263;
	line-height: 60rpx;
	text-align: center;
}
</style>
