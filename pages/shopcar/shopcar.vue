<template>
	<view class="shop-cart">
		<template v-if="list.length > 0">
			<!-- 头部导航栏 -->
			<uni-nav-bar title="购物车" :rightText="isNavBar ? '完成' : '编辑'" fixed="true" statusBar="true" @clickRight="isNavBar = !isNavBar"></uni-nav-bar>

			<!-- 购物车内容 -->
			<view class="shop-list">
				<view class="shop-item" v-for="(item, index) in list" :key="index">
					<label for="" class="radio" @tap="selectedItem(index)">
						<radio value="" color="#FF3333" :checked="item.checked" />
						<text></text>
					</label>
					<image :src="item.imgUrl" class="shop-img" mode=""></image>
					<view class="shop-dis">
						<view class="shop-name">{{ item.name }}</view>
						<view class="shop-color f-color">{{ item.color }}</view>
						<view class="shop-price">
							<text>￥{{ item.pprice }}</text>

							<template v-if="!isNavBar">
								<view class="">x{{ item.num }}</view>
							</template>

							<template v-else>
								<uni-number-box :value="item.num" :min="1" @change="changeNumber($event, index, item)"></uni-number-box>
							</template>
						</view>
					</view>
				</view>
			</view>

			<!-- 底部 -->
			<view class="shop-foot">
				<label class="radio">
					<radio value="" color="#FF3333" @tap="checkedAllFn" :checked="checkedAll" />
					<text>全选</text>
				</label>

				<template v-if="!isNavBar">
					<view class="foot-title">
						<text>合计：</text>
						<text class="foot-n">￥{{ totalCount.pprice }}</text>
						<view class="title-noies">不含运费</view>
					</view>
					<view class="foot-sum" @tap="goConfirm">结算({{ totalCount.num }})</view>
				</template>
				<template v-else>
					<view class="foot-sum " style="background-color: black;margin-left: 25%;">移入收藏夹</view>
					<view class="foot-sum" @tap="delGoodsFn">删除</view>
				</template>
			</view>
		</template>
		<template v-else>
			<!-- 头部导航栏 -->
			<uni-nav-bar title="购物车"></uni-nav-bar>
			<view class="shop-list"><image src="https://gitee.com/l7788/shopApp/raw/master/static/img/carnone.png" mode="" style="margin: 50% 10%;"></image></view>
		</template>

		<Tabbar cureentPage="shopcar"></Tabbar>
	</view>
</template>

<script>
import http from '@/common/api/request.js';
import UniNavBar from '@/components/uni/uni-nav-bar/uni-nav-bar.vue';
import uniNumberBox from '@/components/uni/uni-number-box/uni-number-box.vue';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import Tabbar from '@/components/common/Tabbar.vue';
export default {
	data() {
		return {
			isNavBar: false
		};
	},
	methods: {
		...mapActions('car', ['checkedAllFn', 'delGoodsFn']),
		...mapMutations('car', ['selectedItem', 'initGetData']),
		...mapMutations('order',['initOrder']),
		changeNumber(value, index, item) {
			if (item.num == value) return;
			http.request({
				url: '/updateNumCart',
				method: 'POST',
				header: {
					token: true
				},
				data: {
					goodsId: item.goods_id,
					num: value
				}
			})
				.then(res => {
					this.list[index].num = value;
				})
				.catch(() => {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
				});
		},
		goConfirm() {
			if (this.selectedlist.length === 0) {
				return uni.showToast({
					title: '请至少选择一件商品',
					icon: 'none'
				});
			}
			
			let newList = [];
			this.list.forEach(item=>{
			    this.selectedlist.filter(v=>{
			        if( item.id == v ){
			            newList.push( item );
			        }
			    })
			})

			http.request({
			    url:"/addOrder",
			    method:"POST",
			    header:{
			        token:true
			    },
			    data:{
			        arr:newList
			    }
			 }).then((res)=>{
			    if( res.success ){
			        //存储订单号
			        this.initOrder( res.data[0].order_id );
			         //跳转页面
			        uni.navigateTo({
			            url:`../confirm-order/confirm-order?detail=${JSON.stringify(this.selectedlist)}`
			        })
			    }

			}).catch((rej)=>{
				console.log(rej)
			    uni.showToast({
			        title:'请求失败',
			        icon:'none'
			    })
			})
		},
		getData() {
			http.request({
				url: '/selectCart',
				method: 'POST',
				header: {
					token: true
				}
			})
				.then(res => {
					this.initGetData(res);
				})
				.catch(() => {
					uni.showToast({
						title: '请求失败',
						icon: 'none'
					});
				});
		}
	},
	computed: {
		...mapState('car', ['list', 'selectedlist']),
		...mapGetters('car', ['checkedAll', 'totalCount'])
	},
	onShow() {
		this.getData();
	},
	components: { UniNavBar, uniNumberBox, Tabbar }
};
</script>

<style scoped lang="scss">
.shop-list {
	padding-bottom: 100rpx;
	.shop-item {
		display: flex;
		padding: 20rpx;
		align-items: center;
		background-color: #f7f7f7;
		margin-bottom: 10rpx;
		.shop-img {
			width: 200rpx;
			height: 200rpx;
		}
		.shop-dis {
			flex: 1;
			padding-left: 20rpx;
			// display: block;
			.shop-name {
				width: 450rpx;
				height: 32rpx;
				font-size: 30rpx;
				line-height: 30rpx;
				letter-spacing: 2rpx;
				padding: 10rpx 0;
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.shop-color {
				font-size: 26rpx;
				padding: 5rpx 0;
			}
			.shop-price {
				display: flex;
				justify-content: space-between;
				padding: 5rpx 0;
			}
		}
	}
}
.shop-foot {
	position: fixed;
	// bottom: var(--window-bottom);
	bottom: 120rpx;
	left: 0;
	width: 100%;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #f7f7f7;
	border-top: 2rpx solid #f7f7f7;
	.radio {
		padding-left: 20rpx;
	}
	.foot-title {
		margin-left: 15%;
		.foot-n {
			color: #3dd9e7;
			font-size: 35rpx;
		}
		.title-noies {
			font-size: 20rpx;
			color: #828282;
			text-align: center;
		}
	}
	.foot-sum {
		width: 200rpx;
		height: 100%;
		background-color: #49bdfb;
		text-align: center;
		vertical-align: middle;
		border-radius: 5rpx;
		color: #ffffff;
		font-size: 35rpx;
		line-height: 100rpx;
	}
}
</style>
