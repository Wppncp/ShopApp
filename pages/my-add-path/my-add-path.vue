<template>
	<view class='my-add-path'>
		
		<view class='path-item'>
			<view>收 件 人</view>
			<input type="nickname" value="" placeholder="收件人姓名" v-model="pathObj.name"/>
		</view>
		
		<view class='path-item'>
			<view>手 机 号</view>
			<input type="number" value="" placeholder="11位手机号" v-model="pathObj.tel"/>
		</view>
		
		<view class='path-item'>
			<view>所在地址</view>
			<view @tap='showCityPicker' >{{ pathCity }} > </view>
			<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm">
			</mpvue-city-picker>
		</view>
		
		<view class='path-item'>
			<view>详细地址</view>
			<input type="text" value="" placeholder="5到60个字符" v-model="pathObj.address"/>
		</view>
		
		<view class='path-item'>
			<view class="text">设为默认地址</view>
			<radio-group name="" @change="radioChange" class="radio-group">
				<label class="radio" >
					<radio value="" color="#FF3333" :checked="pathObj.isDefault==1?true:false"/><text></text>
				</label>
			</radio-group>
			
		</view>
		
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import {mapActions} from 'vuex'
	import mpvueCityPicker from '../../components/uni/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		data() {
			return {
							pickerValueDefault: [0, 0, 1],
							pathObj:{
								name:"",//收货人
								tel:"",//收货人电话
								province:"",//省
								city:"",//市
								district:"",//区
								address:"",//收货人详细地址
								isDefault:false//默认地址
							},
							i:-1,
							//是否修改的状态
							isStatus:false
						}
		},
		computed:{
					pathCity(){
						if( this.pathObj.province ){
							return `${this.pathObj.province}-${this.pathObj.city}-${this.pathObj.district}`
						}else{
							if(this.pathObj.city){
								return this.pathObj.city
							}
							return '请选择';
						}
					}
				},
		components:{
			mpvueCityPicker
		},
		methods: {
			showCityPicker() {
			  this.$refs.mpvueCityPicker.show();
			  console.log(this.pathObj.city)
			},
			onConfirm(e) {
			  this.pathObj.city = e.label;
			},
			...mapActions('path',['createPathFn','updataPathFn']),
			radioChange(){
				this.pathObj.isDefault = this.pathObj.isDefault ==1?true:false
				this.pathObj.isDefault =! this.pathObj.isDefault
			}
		},
		onNavigationBarButtonTap(){
			if(this.isStatus){
				http.request({
					url:"/updateAddress",
					method:'POST',
					header:{token:true},
					data:{...this.pathObj}
				}).then(res=>{
					//修改地址
					this.pathObj.isDefault = this.pathObj.isDefault==true?1:0
					this.updataPathFn({
						index:this.i,
						item:this.pathObj
					})
					uni.showToast({
						title:'修改成功'
					})
					uni.navigateBack({
						delta:1
					})
				}).catch(()=>{
					uni.showToast({
						title:'请求失败'
					})
				})
			}else{
				//新增地址
				http.request({
					url:"/addAddress",
					method:'POST',
					header:{token:true},
					data:{...this.pathObj}
				}).then(res=>{
					this.createPathFn(this.pathObj)
					uni.navigateBack({delta:1})
				}).catch(()=>{
					uni.showToast({
						title:'请求失败'
					})
				})
				this.createPathFn(this.pathObj)
				uni.navigateBack({
					delta:1
				})
			}
			
		},
		onLoad(e) {
			if(e.data){
				uni.setNavigationBarTitle({
					title:'修改地址'
				})
				let res =JSON.parse(e.data)
				this.pathObj = res.item
				this.i = res.index
				this.isStatus =true
			}
		}
	}
</script>

<style scoped>
.my-add-path{
	padding-left:20rpx;
}
.path-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:16rpx 0;
	width: 100%;
	border-bottom: 2rpx solid #CCCCCC;
}
.path-item input{
	flex:1;
	text-align: left;
	padding-left:10rpx;
}
.path-item .radio{
	float: right;
}
.radio-group{
	width: 30%;
}
</style>
