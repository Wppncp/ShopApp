<template>
	<view class="details">
		<!-- 商品展示图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<view class="swiper-item"><image :src="goodsContent.imgUrl" mode="" class="swiper-img"></image></view>
			</swiper-item>
		</swiper>
		<!-- 价格表述 -->
		<view class="details-goods">
			<view class="goods-pprice">￥{{ goodsContent.pprice }}</view>
			<view class="goods-oprice">￥{{ goodsContent.oprice }}</view>
			<view class="goods-name">{{ goodsContent.name }}</view>
		</view>
		<!-- 商品描述图 -->
		<view>
			<view><image src="../../static/img/detail1.jpg" class="details-img"></image></view>
			<view><image src="../../static/img/detail2.jpg" class="details-img"></image></view>
			<view><image src="../../static/img/detail3.jpg" class="details-img"></image></view>
			<view><image src="../../static/img/detail4.jpg" class="details-img"></image></view>
			<view><image src="../../static/img/detail5.jpg" class="details-img"></image></view>
		</view>
		<!-- 推荐 -->
		<Card cardTitle="看了又看"></Card>
		<commodity-list :dataList="dataList"></commodity-list>
		<!-- 底部 -->
		<view class="detail-foot">
			<view class="iconfont icon-xiaoxi"></view>
			<view class="iconfont icon-gouwuche" @tap="goShopCar"></view>
			<view class="add-shopcart" @tap="showPop">加入购物车</view>
			<view class="purchase" @tap="showPop('key')">立即购买</view>
		</view>
		<!-- 底部弹出层 -->
		<view class="pop" v-show="isShow" @touchmove.stop.prevent="">
			<view class="pop-mask" @tap="hidePop"></view>
			<view class="pop-box" :animation="animationData">
				<view class="pop-dis">
					<image :src="goodsContent.imgUrl" mode="" class="pop-img"></image>
					<view class="pop-price">￥{{ goodsContent.pprice }}</view>
				</view>
				<view class="pop-shape">
					<text class="shape-text">选择尺寸</text>
					<view class="shape"><text>黑色 L</text></view>
				</view>
				<view class="pop-num">
					<view>购买数量</view>
					<uni-number-box :min="1" :value="num" @change="changeNumber"></uni-number-box>
				</view>
				<view class="pop-sub" @tap="addCar">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/common/api/request.js';
import Card from '@/components/common/Card.vue';
import CommodityList from '@/components/common/CommodityList.vue';
import UniNumberBox from '@/components/uni/uni-number-box/uni-number-box.vue';
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			swiperList: [{ imgUrl: '../../static/img/details1.jpeg' }, { imgUrl: '../../static/img/details2.jpeg' }, { imgUrl: '../../static/img/details3.jpeg' }],
			dataList: [
				{
					id: 5,
					imgUrl: 'https://img14.360buyimg.com/n1/jfs/t1/162051/30/29828/234714/62f6752bEc6bbe9a9/86c56312f486abb6.jpg',
					name: '李宁篮球鞋男2022新品中帮专业比赛鞋官方旗舰网ABAS027 月白蓝/标准白-4 42',
					pprice: '799.00 ',
					oprice: '3890.00',
					discount: '满469减80'
				},
				{
					id: 6,
					imgUrl: 'https://img11.360buyimg.com/n7/jfs/t1/22526/3/19193/50973/62f6267cEe76048de/b2b76bd6da7ff3f3.jpg',
					name: '阿迪达斯（Adidas）短裤男 新款透气舒适百搭休闲五分裤运动短裤 五分裤-小LOGO L',
					pprice: '129.00',
					oprice: '129.00',
					discount: '每满200减30'
				},
				{
					id: 7,
					imgUrl: 'https://img11.360buyimg.com/n1/jfs/t1/188134/20/7134/40810/60befc8aEf3532b70/1425dee17628e748.jpg',
					name: '李宁篮球鞋男鞋新品驭帅15男子减震回弹中帮篮球专业比赛鞋运动鞋鞋子官方旗舰网ABAR043 黑色/蝴蝶蓝-8 43',
					pprice: '699.00',
					oprice: '699.00',
					discount: '满469减50'
				},
				{
					id: 8,
					imgUrl: 'https://img13.360buyimg.com/n7/jfs/t1/38352/13/17539/589320/62ebf6bdEed8488c9/626787a9cf1ebb58.png',
					name: 'Rianne.He 2022夏季新款户外骑行纯色连帽拉链透气防紫外线薄款冰丝女防晒衣 悦动粉 M',
					pprice: '126.00',
					oprice: '126.00',
					discount: '满100减20'
				}
			],
			isShow: false,
			animationData: {},
			goodsContent: {},
			num: 1,
			//由立即购买拉起蒙层
			iskeyc:false,
		};
	},
	methods: {
		...mapMutations('car', ['addShopCar']),
		showPop(key) {
			var animation = uni.createAnimation({
				duration: 200
			});
			animation.translateY(600).step();
			this.animationData = animation.export();
			this.isShow = true;
			setTimeout(() => {
				animation.translateY(0).step();
				this.animationData = animation.export();
			}, 200);
			console.log(this.iskeyc)
			if(key=='key'){
				this.iskeyc = true
				console.log('show:'+this.iskeyc)
			}
		},
		hidePop() {
			var animation = uni.createAnimation({
				duration: 200
			});
			animation.translateY(600).step();
			this.animationData = animation.export();
			this.isShow = true;
			setTimeout(() => {
				animation.translateY(0).step();
				this.isShow = false;
			}, 200);
		},
		getData(id) {
			http.request({ url: '/goods/id', data: { id: id } })
				.then(res => {
					this.goodsContent = res[0];
				})
				.catch(() => {
					uni.showToast({ title: '请求失败' });
				});
		},
		//改变商品购买数量
		changeNumber(val) {
			this.num = val;
		},
		goShopCar() {
			uni.navigateTo({
				url: '../shopcar/shopcar'
			});
		},
		//加入购物车
		addCar() {
			http.request({
				url: '/addCart',
				method: 'POST',
				data: {
					goods_id: this.goodsContent.id,
					num: this.num
				},
				header: {
					token: true
				}
			}).then((res) => {
					//隐藏弹出框
					this.hidePop();
					//提示信息
					uni.showToast({
						title: '成功加入购物车',
						icon: 'none'
					});
					if(this.iskeyc == true){
						this.iskeyc = false
						this.goShopCar()
					}
				}).catch((rej) => {
					console.log(rej)
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					});
				});

			// let goods = this.goodsContent
			// this.goodsContent['checked']=false
			// this.goodsContent['num']=this.num
			// this.addShopCar(goods)
			// this.hidePop()
			// uni.showToast({
			// 	title:'成功加入购物车'
			// })
		},
		goPayment() {
			uni.navigateTo({
				url: '../../pages/payment/payment'
			});
		}
	},
	onBackPress() {
		if (this.isShow) {
			this.hidePop();
			return true;
		}
	},
	onLoad(e) {
		this.getData(e.id);
		// #ifdef MP-WEIXIN
		//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	},
	onNavigationBarButtonTap(e) {
		if (e.type == 'share') {
			uni.share({
				provider: 'weixin',
				type: 0,
				scene: 'WXSceneSession',
				title: this.goodsContent.name,
				href: `${this.$URL}:8080/#/pages/detail/detail?id=${this.goodsContent.id}`,
				imageUrl: this.goodsContent.imgUrl,
				success: function(res) {
					uni.showToast({
						title: '分享成功'
					});
				},
				fail: err => {
					uni.showToast({
						title: JSON.stringify(err)
					});
				}
			});
		}
	},
	// #ifdef MP-WEIXIN
	//发送给朋友
	onShareAppMessage(res) {
		return {
			title: this.goods.name,
			path: `/pages/detail/detail?id=${this.goodsContent.id}`,
			mpId: 'wx89df7571873b5625',
			imageUrl: this.goodsContent.imageUrl,
			url: `${this.$URL}:8080/#/pages/detail/detail?id=${this.goodsContent.id}`,
			success: function(res) {
				uni.showToast({
					title: '分享成功'
				});
			},
			fail: err => {
				uni.showToast({
					title: JSON.stringify(err)
				});
			}
		};
	},
	//分享到朋友圈
	onShareTimeline(res) {
		return {
			title: this.goods.name,
			type: 0,
			query: 0,
			summary: this.goodsContent.name,
			imageUrl: this.goodsContent.imageUrl
		};
	},
	// #endif
	components: { Card, CommodityList, UniNumberBox }
};
</script>

<style scoped lang="scss">
swiper {
	width: 100%;
	height: 700rpx;
	.swiper-item {
		.swiper-img {
			width: 100%;
			height: 700rpx;
		}
	}
}
.details-goods {
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	padding: 10rpx 0;
}
.details-img {
	width: 100%;
}
.detail-foot {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #ffffff;
	.iconfont {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
		background-color: #ffa617;
		color: #ffffff;
		text-align: center;
		margin: 0 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.add-shopcart {
		margin: 0 40rpx;
		padding: 6rpx 30rpx;
		background-color: #ff7417;
		color: #ffffff;
		border-radius: 40rpx;
	}
	.purchase {
		margin: 0 40rpx;
		padding: 6rpx 30rpx;
		background-color: #49bdfb;
		color: #ffffff;
		border-radius: 40rpx;
	}
}
.pop {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 9999;
	// overscroll-behavior:contain
	.pop-mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.2);
	}
	.pop-box {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 600rpx;
		background-color: #ffffff;
		.pop-dis {
			display: flex;
			.pop-img {
				width: 260rpx;
				height: 260rpx;
				transform: translate(40rpx, -50rpx);
				box-shadow: 2rpx #dfded7;
			}
			.pop-price {
				margin: 20rpx 80rpx;
				color: #49bdfb;
				font-size: 40rpx;
			}
		}
		.pop-shape {
			.shape-text {
				margin-left: 40rpx;
				font-weight: bold;
			}
			.shape {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 10rpx 30rpx;
				text {
					border-radius: 40% 40%;
					width: 20%;
					height: 45rpx;
					background-color: #d1d0c9;
					text-align: center;
					vertical-align: middle;
					font-size: 30rpx;
				}
			}
		}
		.pop-sub {
			line-height: 80rpx;
			background-color: #49bdfb;
			color: #ffffff;
			text-align: center;
		}
		.pop-num {
			padding: 20rpx 20rpx;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
