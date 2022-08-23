<template>
	<view class="card">
		<view class="card-name">
			-&nbsp;&nbsp;&nbsp;{{cardTitle}}&nbsp;&nbsp;&nbsp;-
		</view>
	</view>
</template>

<script>
	export default {
		name:'Card',
		props:['cardTitle'],
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style scoped lang="scss">
.card{
	padding: 20rpx 0;
	font-weight: bold;
	display: flex;
	justify-content: center;
	.card-name{
		font-size: 32rpx;
	}
}
</style>
