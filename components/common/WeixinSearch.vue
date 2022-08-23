<template>
	<view class="search">
		<!-- #ifdef MP-WEIXIN -->
		<view class="wx-nav">
			<input
				:autofocus="Options.autoFocus"
				class="searchInput"
				type="search"
				:placeholder="Options.keyword == ''?Options.placeholder:Options.keyword" 
				:v-model='Options.keyword'
				:disabled="Options.disabled" 
			/>
			<button 
			class="searchButton"  
			@click="Options.url == ''? '':searchEnter()"
			>{{Options.buttonText}}</button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		name:'WeixinSearch',
		props:{
			 Options:
				{ 
					'autoFocus':{ //开启获取焦点
						type: Boolean,
						default:true
					},
					'placeholder':{ //input默认提示'得您喜欢'
						type:String,
						default:'得您喜欢'
					},
					'disabled':{ //非禁止输入
						type:Boolean,
						default:false
					},
					'url':{ //点击搜索进入的页面地址
						type:'String',
						default:''
					},
					'keyword':{ //搜索的关键词
						type:'String',
						default:''
					},
					'buttonText':{ //搜索按钮显示文字
						type:String,
						default:'搜索'
					}
				} 
		},
		methods:{
			searchEnter(){
				if(this.Options.keyword === ''){
					return uni.showToast({ title:'关键词不能为空' })
				}else{					
					uni.navigateTo({ url:`${this.Options.url}?keyword=${this.Options.keyword}` })
				}
				
				uni.hideKeyboard()
			}
		}
	}
</script>

<style scoped lang="scss">
.wx-nav {
	display: flex;
	justify-content: space-between;
	margin: 10rpx;
	font-size: 28rpx;
	.searchInput {
		line-height: 35rpx;
		background-color: #f7f7f7;
		color: #b3b3b3;
		border-radius: 15rpx;
		margin-left: 10%;
		flex: 3;
		padding-left: 20rpx;
		height: 55rpx;
	}
	.searchButton {
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