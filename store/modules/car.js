// import { commit } from "../../server/db/sql"
import http from '@/common/api/request.js'
 const car = {
	namespaced:true,
	state:{
		list:[
			// {
			// 	id:999,
			// 	name:"商品描述嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻三个省份的好伙伴积分v哦i沙回复v哦i社会女iOS比例",
			// 	color:"颜色：黑",
			// 	imgUrl:"../../static/img/detail2.jpg",
			// 	pprice:"399.00",
			// 	num:1,
			// 	checked:false
			// }		
		],
		selectedlist:[]
	},
	mutations:{
		//请求到数据赋值操作
				initGetData(state,list){
					state.list = list;
				},
		//全选中
		checkedAll(state){
			state.selectedlist = state.list.map(v=>{
				v.checked = true
				return v.id	
			})			
		},
		//全不选
		uncheckedAll(state){
			state.list.forEach(v=>{
				v.checked = false
			})
			state.selectedlist =[]
		},
		//控制单选
		selectedItem(state,index){
			let id  =state.list[index].id
			let i =state.selectedlist.indexOf(id)
			//如果存在id代表已经选中，移除它
			if(i>-1){
				state.list[index].checked = false
				return state.selectedlist.splice(i,1)
			}
			state.list[index].checked = true
			state.selectedlist.push(id)
		},
		delGoods(state){
			state.list = state.list.filter(v=>{
				return state.selectedlist.indexOf(v.id) === -1
			})
		},
		addShopCar(state,goods){
			state.list.push(goods)
		}
	},
	getters:{
		//判断是否全选
		checkedAll(state){
			return state.list.length === state.selectedlist.length
		},
		//合计+结算数量
		totalCount(state){
			let total = {
				pprice:0,
				num:0
			}
			state.list.forEach(v=>{
				//是否选中，选中算入合计结算
				if(state.selectedlist.indexOf(v.id)>-1){
					total.pprice += v.pprice*v.num
					total.num = state.selectedlist.length
				}
			})
			return total
		}
	},
	actions:{
		checkedAllFn({commit,getters}){
			getters.checkedAll ? commit("uncheckedAll") : commit("checkedAll")
		},
		delGoodsFn({commit,state}){
			uni.showModal({
				content:'确定删除',
				success: () => {
					http.request({
						url: '/deleteCart',
						method: 'POST',
						header: {
							token: true
						},
						data:{
							goodsId:state.selectedlist
						}
					})
						.then(res => {
							commit('delGoods')
							commit('uncheckedAll')
							uni.showToast({
								title:'删除成功'
							})
						})
						.catch(() => {
							uni.showToast({
								title: '请求失败',
								icon: 'none'
							});
						});
				}
			})
			
			
		},
	}
}
export default car