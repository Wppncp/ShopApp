<template>
	<view class="search">
		<!-- #ifdef MP-WEIXIN -->
		<view class="wx-nav">
			<input class="searchInput" type="search" autofocus="true" placeholder="得您喜欢" v-model="keyword"/>
			<button class="searchButton" @click="searchListEnter">搜索</button>
		</view>
		<!-- #endif -->
		<Lines></Lines>
		
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">最近搜索</view>
				<view class="iconfont icon-lajitong" @tap="clearHistory"></view>
			</view>
			<view >
				<view 
				class="search-name f-color" 
				v-for="(item,index) in searchData" 
				:key="index"
				@tap="toSearchList(item)">
				{{item}}</view>
			</view>
		</view>
		
		<view class="search-item">
			<view class="search-title">
				<view class="f-color">热门搜索</view>
				<view class="iconfont icon-lajitong"></view>
			</view>
			<view >
				<view class="search-name f-color">三毛全集</view>
			</view>
		</view>
		
	</view>
</template>

<script>

	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return { 
				//输入关键词
				keyword:'',
				//最近搜索关键词
				searchData:[],
				Options: {
					autoFocus: true,
					keyword: '',
					url:'../SearchList/SearchList',
					buttonText: '搜索'
				}
			 }
		},
		//监听搜索框输入
		onNavigationBarSearchInputChanged(e){
			this.keyword = e.text
		},
		//监听搜索点击
		onNavigationBarButtonTap(e){
			this.search()
		},
		//监听用户软键盘搜索点击
		onNavigationBarSearchInputConfirmed(){
			this.search()
		},
		//页面加载，读取最近搜索关键词
		onLoad() {
			uni.getStorage({
				key:'searchData',
				success: res => {
					this.searchData = JSON.parse(res.data)
				}
			})
		},
		methods: {
			//监听微信搜索
			searchListEnter(){
				this.search()
			},
			//搜索
			search(){
				if(this.keyword === ''){
					return uni.showToast({ title:'关键词不能为空' })
				}else{
					this.toSearchList(this.keyword)
					// uni.navigateTo({ url:'../SearchList/SearchList?keyword='+this.keyword })
				}
				uni.hideKeyboard()
				this.addSearch()
			},
			//记录最近搜索词
			addSearch(){
				let idx = this.searchData.indexOf(this.keyword)
				if(idx <0){
					this.searchData.unshift(this.keyword)
				}else{
					this.searchData.unshift(this.searchData.splice(idx,1)[0])
				}
				uni.setStorage({
					key:'searchData',
					data:JSON.stringify(this.searchData),
				})
			},
			//清除最近搜索记录
			clearHistory(){
				uni.showModal({
					title:'提示',
					content:'是否清除最近搜索记录',
					cancelText:'取消',
					confirmText:'确定',
					success: res => {
						if(res.confirm){
							uni.removeStorage({ key:'searchData' })
							this.searchData = []
						}
					}
				})
			},
			//点击最近搜索记录搜索
			toSearchList(item){
				uni.navigateTo({ url:'../SearchList/SearchList?keyword='+item })
			}
		},
		computed: {
		  computedKeyword() {
		    return this.Options.keyword = this.keyword
		  }
		},
		components:{ Lines },
	}
</script>

<style scoped lang="scss">
.search{
	.search-item{
		padding: 20rpx;
		.search-title{
			display: flex;
			justify-content: space-between;
		}
		.search-name{
			padding: 8rpx 24rpx;
			background-color: #E1E1E1;
			display: inline-block;
			border-radius: 26rpx;
			margin: 15rpx;
			font-size: 25rpx;
		}
	}
}
.wx-nav{
	display: flex;
	justify-content: space-between;
	margin: 10rpx;
	font-size: 28rpx;
	.searchInput{
		line-height: 35rpx;
		background-color: #F7F7F7;
		color: #b3b3b3;
		border-radius: 15rpx;
		margin-left:10% ;
		flex: 3;
		padding-left: 20rpx;
		height: 55rpx;
	}
	.searchButton{
		padding: 10rpx;
		border: none;
		line-height: 35rpx;
		font-size: 28rpx;
		vertical-align: middle;
		flex: 1;
		background-color: #ffffff;
	}
}
</style>
