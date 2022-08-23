<template>
	<view class="banner">
		<image class="banner-img" :src="dataList" mode=""></image>
	</view>
</template>

<script>
	export default {
		name:'Banner',
		data() {
			return {}
		},
		methods: {},
		props:{ dataList:String }
	}
</script>

<style scoped lang="scss">
.banner{
	width: 100%;
	height: 400rpx;
	.banner-img{
		width: 100%;
		height: 400rpx;
	}
}
</style>
