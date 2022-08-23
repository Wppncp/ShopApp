<template>
	<view>
		<Lines></Lines>
		<view class='login-tel'>
			<view class='tel-main'>
				<view class='login-from'>
					<view class='login-user'>
						<text class='user-text'>验证码</text>
						<input type="text" placeholder="请输入验证码" v-model="userCode"/>
						<button plain='true' size='mini' :disabled="disabled" @tap='sendCode'> {{codeMsg}} </button>
					</view>
				</view>
				<view class='tel' @tap='goNextIndex'>下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				//倒计时到时间
				codeNum:60,
				//显示到文本
				codeMsg:"",
				//按钮是否禁用
				disabled:false,
				//用户输入的内容
				userCode:'',
				//发送验证码手机号
				phone:'',
				// getCode:''
				getCode:'1111'
			}
		},
		components:{
			Lines
		},
		onReady() {
			this.codeMsg = '重新发送（'+this.codeNum+'）';
			uni.showModal({
				content:'来自login-code.vue测试码：1111'
			})
			// this.sendCode();
		},
		methods: {
			//点击验证码发送
			sendCode(){
				http.request({ url:'/code',method:"POST",data:{userName:this.phone} }).then(res=>{
					this.getCode =res.code
					alter(this.getCode)
				}).catch(()=>{
					uni.showToast({ title:'请求失败' })
				})
				
				
				
				this.disabled = true;
				let timer = setInterval(()=>{
					--this.codeNum;
					this.codeMsg = '重新发送（'+this.codeNum+'）';
				},6000);
				setTimeout(()=>{
					clearInterval(timer);
					this.codeNum=10;
					this.disabled = false;
					this.codeMsg = '重新发送';
				},6000)
			},
			//点击下一步
			goNextIndex(){
				if(this.getCode == this.userCode){
					http.request({ url:'/addUser',method:"POST",data:{userName:this.phone,code:this.userCode} }).then(res=>{
						if(res.success){
							uni.showToast({
								title:'注册成功，请登录'
							})
							uni.redirectTo({
								url:"../../pages/login/login"
							})
						}
					}).catch(()=>{
						uni.showToast({ title:'请求失败' })
					})
				}else{
					uni.showToast({
						title:'验证码错误'
					})
				}
				
			}
		},
		onLoad(options) {
			this.phone = options.phone
		}
	}
</script>

<style scoped>
.login-tel{
	width: 100vw;
	height: 100vh;
}
.tel-main{
	padding:0 20rpx;
}
.login-from{
	padding:30rpx 0;
}
.login-user{
	font-size:32rpx;
	padding:10rpx 0;
	display: flex;
	align-items: center;
	border-bottom:2rpx solid #f7f7f7;
}
.user-text{
	padding-right:10rpx;
}
.tel{
	width:100%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color:#FFFFFF;
	background-color: #49BDFB;
	border-radius: 40rpx;
}
</style>
