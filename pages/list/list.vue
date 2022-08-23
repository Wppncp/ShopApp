<template>
	<view>
		<WeixinSearch :Options="Options"></WeixinSearch>
		<lines></lines>

		<view class="list">
			<!-- 左侧 -->
			<scroll-view scroll-y="true" class="list-left" :style="'height:' + clentHeight + 'px;'">
				<view v-for="(item, index) in leftData" :key="index" @tap="changeLeftTab(index, item.id)">
					<view class="left-name " :class="activeIndex == index ? 'left-name-active' : 'left-item'">{{ item.name }}</view>
				</view>
			</scroll-view>

			<!-- 右侧 -->
			<scroll-view scroll-y="true" class="list-right" :style="'height:' + clentHeight + 'px;'">
				<view class="right-list" v-for="(item, index) in rightData" :key="index">
					<blockquote v-for="(k, i) in item" :key="i">
						<view class="list-title">{{ k.name }}</view>
						<view class="right-content">
							<view class="right-item" v-for="(j,idx) in k.list" :key="idx">
								<image :src="j.imgUrl" class="right-img"></image>
								<view class="right-name">{{j.name}}</view>
							</view>
						</view>
					</blockquote>
				</view>
			</scroll-view>
		</view>
		<Tabbar cureentPage='list'></Tabbar>
	</view>
</template>

<script>
import WeixinSearch from '@/components/common/WeixinSearch.vue';
import Lines from '@/components/common/Lines.vue';
import http from '@/common/api/request.js';
import Tabbar from '@/components/common/Tabbar.vue'
export default {
	data() {
		return {
			Options: {
				autoFocus: false,
				disabled: true,
				url: '../search/search',
				keyword: 'null',
				buttonText: '搜索'
			},
			clentHeight: 0,
			activeIndex: 0,
			leftData: [],
			rightData: []
		};
	},
	methods: {
		//获取可视区兼容不同系统
		getClentHeight() {
			const res = uni.getSystemInfoSync();
			const system = res.platform;
			if (system === 'ios') {
				return 44 + res.statusBarHeight;
			} else if (system === 'android') {
				return 48 + res.statusBarHeight;
			} else {
				return 35;
			}
		},
		//左侧点击
		changeLeftTab(index, id) {
			this.getData(id);
			this.activeIndex = index;			
		},
		//请求数据
		getData(id) {
			if (id === this.activeIndex + 1) {
				return;
			}
			http.request({
				url: '/goods/list'
			})
				.catch(() => {
					uni.showToast({
						title: '请求数据失败'
					});
				})
				.then(res => {
					let leftData = [];
					let rightData = [];
					res.forEach(v => {
						leftData.push({
							id: v.id,
							name: v.name
						});
						this.leftData = leftData;
						//右侧数据
						if (v.id == this.activeIndex + 1) {
							rightData.push(v.data);
						}
						this.rightData = rightData;
					});
				});
		}
	},
	//input点击事件进入搜索
	onNavigationBarSearchInputClicked() {
		uni.navigateTo({ url: '../search/search' });
	},
	onReady() {
		uni.getSystemInfo({
			success: res => {
				this.clentHeight = res.windowHeight - this.getClentHeight();
			}
		});
	},
	onLoad() {
		this.getData();
	},
	components: { Lines, WeixinSearch,Tabbar }
};
</script>

<style scoped lang="scss">
.list {
	display: flex;
	.list-left {
		flex: 1.2;
		.left-item {
			border-bottom: 2rpx solid #ffffff;
			background-color: #f7f7f7;
			font-weight: bold;
		}
		.left-name {
			padding: 25rpx 6rpx;
			text-align: center;
			border-left: 8rpx solid #ffffff;
		}
		.left-name-active {
			border-left: 8rpx solid #49bdfb;
			background-color: #ffffff;
		}
	}
	.list-right {
		flex: 4;
		.list-title {
			font-weight: bold;
			padding: 30rpx 0;
		}
		.right-content {
			display: flex;
			flex-wrap: wrap;
			.right-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 20rpx;
				.right-img {
					width: 150rpx;
					height: 150rpx;
					// flex: 1;
				}
				.right-name {
					padding: 16rpx 0;
				}
			}
		}
	}
}
</style>
