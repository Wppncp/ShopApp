<template>
	<view>
		
		<!-- #ifdef MP-WEIXIN -->
		<weixin-search :Options="Options"></weixin-search>
<!-- 		<view class="wx-nav">
			<input
				class="searchInput"
				type="search"
				:placeholder="keyword == '' ? '得您喜欢' : keyword"
				disabled="disabled"
			/>
			<button class="searchButton">筛选</button>
		</view> -->
		<!-- #endif -->

		<ShopList :keyword="keyword"></ShopList>
	</view>
</template>

<script>
import ShopList from '@/components/common/ShopList.vue'
import WeixinSearch from '@/components/common/WeixinSearch.vue'
export default {
	data() {
		return {
			keyword: '',
			Options: {
				autoFocus: false,
				disabled: true,
				keyword: '',
				buttonText: '筛选'
			}
		}
	},
	onLoad(e) {
		this.keyword = e.keyword
		// #ifdef APP-PLUS
		var webView = this.$mp.page.$getAppWebview()
		webView.setTitleNViewSearchInputText(e.keyword)
		// #endif
		// #ifdef H5
		var searchInputDom = document.querySelector(
			'.uni-input-input[type=search]'
		)
		var evt = new UIEvent('input', {
			bubbles: false,
			cancelable: false
		})
		searchInputDom.value = e.keyword
		searchInputDom.dispatchEvent(evt)
		// #endif
	},
	methods: {},
	computed: {
	  computedKeyword() {
	    return this.Options.keyword = this.keyword
	  }
	},
	components: { ShopList, WeixinSearch }
}
</script>

<style scoped lang="scss">
// .wx-nav {
// 	display: flex;
// 	justify-content: space-between;
// 	margin: 10rpx;
// 	font-size: 28rpx;
// 	.searchInput {
// 		line-height: 35rpx;
// 		background-color: #f7f7f7;
// 		color: #b3b3b3;
// 		border-radius: 15rpx;
// 		margin-left: 10%;
// 		flex: 3;
// 		padding-left: 20rpx;
// 		height: 55rpx;
// 	}
// 	.searchButton {
// 		padding: 10rpx;
// 		border: none;
// 		line-height: 35rpx;
// 		font-size: 28rpx;
// 		vertical-align: middle;
// 		flex: 1;
// 		background-color: #ffffff;
// 	}
// }
</style>
