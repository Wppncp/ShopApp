<template>
	<view class="confirm-order bg-active-color">
		<Lines></Lines>

		<!--地址-->
		<view class="order-map" @tap="goPathList">
			<template v-if="path">
				<view class="map-title">
					<view class="map-name">收件人：{{ path.name }}</view>
					<view>{{ path.tel }}</view>
				</view>
				<view class="map-city">收货地址：{{ path.province }}{{ path.city }}{{ path.district }}{{ path.address }}</view>
			</template>
			<template v-else>
				<view class="map-title"><view class="map-name">请选择地址</view></view>
			</template>
		</view>
		<!--商品-->
		<view class="goods-list">
			<view class="goods-content bg-active-color" v-for="(item, index) in goodsList" :key="index">
				<image class="goods-img" :src="item.imgUrl" mode=""></image>
				<view class="goods-text">
					<view class="goods-name">{{ item.name }}</view>
					<view class="goods-size f-color">颜色分类：悦动粉</view>
					<view class="f-active-color" style="font-size:24rpx">7天无理由</view>
				</view>
				<view>
					<view>¥{{ item.pprice }}</view>
					<view class="f-color">x{{ item.num }}</view>
				</view>
			</view>
		</view>
		<!--底部 : 提交订单-->
		<view class="order-foot">
			<view class="total-price">
				合计：
				<text class="f-active-color">¥{{ totalCount.pprice }}</text>
			</view>
			<view class="confirm" @tap="goPayment">提交订单</view>
		</view>
	</view>
</template>

<script>
import http from '@/common/api/request.js';
import Lines from '@/components/common/Lines.vue';
import { mapGetters, mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			path: false,
			item: []
		};
	},
	computed: {
		...mapState('car', ['list', 'selectedlist']),
		...mapGetters('path', ['defaultPath']),
		...mapGetters('car', ['totalCount']),
		...mapState('order', ['orderNumber']),
		//根据商品列表找到对应e.detail 数据的 id  最终返回商品数据
		goodsList() {
			return this.item.map(id => {
				return this.list.find(v => v.id == id);
			});
		}
	},
	onLoad(options) {
		console.log(options);
		//要结算的商品id集合
		this.item = JSON.parse(options.detail);
		//如果有默认地址的一个赋值

		http.request({
			url: '/selectAddress',
			method: 'POST',
			header: {
				token: true
			}
		})
			.then(res => {
				this.__initAddressList(res);
				if (this.defaultPath.length) {
					this.path = this.defaultPath[0];
				}
			})
			.catch(() => {
				uni.showToast({
					title: '请求失败',
					icon: 'none'
				});
			});

		//如果出发自定义事件，on去接受值
		uni.$on('selectPathItem', res => {
			console.log(res);
			this.path = res;
		});
	},
	onUnload() {
		uni.$off('selectPathItem', () => {
			console.log('移除了selectPathItem');
		});
	},
	components: {
		Lines
	},
	methods: {
		...mapMutations('path', ['__initAddressList']),
		//跳转到地址管理页面
		goPathList() {
			uni.navigateTo({
				url: '../my-path-list/my-path-list?type=selectedPath'
			});
		},
		//提交订单
		goPayment() {
			
			if (!this.path) {
				return uni.showToast({
					title: '请选择收货地址'
				});
			}

			http.request({
			 	url: '/submitOrder',
				method: 'POST',
				header: {
					token: true
				},
				data: {
					orderId: this.orderNumber,
					shopArr: this.selectedlist
				}
			}).then(res => {
				if (res.success) {
					//跳转到选择支付页面
					let newName = []
					this.goodsList.forEach(v=>{
						newName.push(v.name)
					})
					uni.navigateTo({
						url:'../payment/payment?details='+JSON.stringify({price: this.totalCount.pprice,list:newName})
					});
				}
			}).catch((rej) => {
				console.log(rej)
				uni.showToast({
					title: '请求失败',
					icon: 'none'
				});
			});

			// uni.navigateTo({
			// 	url:
			// 		'../../pages/payment/payment?details=' +
			// 		JSON.stringify({
			// 			price: this.totalCount.pprice
			// 		})
			// });
		}
	}
};
</script>

<style scoped>
.confirm-order {
	position: absolute;
	left: 0;
	top: 0;
	rigth: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}
.order-map {
	padding: 20rpx;
	background-color: #ffffff;
	line-height: 40rpx;
}
.map-title {
	display: flex;
	justify-content: space-between;
}
.map-name {
	font-weight: bold;
}

.goods-list {
	margin-top: 20rpx;
	background-color: #ffffff;
	padding: 20rpx 0;
}
.goods-content {
	margin-top: 20rpx;
	padding: 10rpx 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.goods-text {
	width: 360rpx;
	padding: 0 10rpx;
	font-size: 26rpx;
}
.goods-img {
	width: 160rpx;
	height: 160rpx;
}
.goods-name {
	font-size: 26rpx;
}
.goods-size {
	font-size: 24rpx;
}
.order-foot {
	height: 80rpx;
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #ffffff;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}
.total-price {
	padding: 0 20rpx;
}
.confirm {
	color: #ffffff;
	background-color: #49bdfb;
	padding: 10rpx 30rpx;
}
</style>
