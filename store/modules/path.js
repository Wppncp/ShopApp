// import { commit } from "../../server/db/sql"


const path = {
	namespaced: true,
	state: {
		list: [
			// {
			// 	name: "张三",
			// 	tel: '11111111111',
			// 	city: '湖南长沙高新区',
			// 	detail: '创业大厦',
			// 	isDefault: true
			// },
			// {
			// 	name: "李四",
			// 	tel: '22222222222',
			// 	city: '湖南长沙高新区',
			// 	detail: '创业大厦',
			// 	isDefault: false

			// }
		],
	},	
	getters: {
		defaultPath(state){
			return state.list.filter(v=>{
				return v.isDefault == 1
			})
		}
	},
	mutations: {
		//初始化地址管理
		__initAddressList(state,list){
			state.list = list
		},
		createPath(state,obj){
			state.list.unshift(obj)
		},
		updataPath(state,{index,item}){
			for( let key in item){
				state.list[index][key]=item[key]
			}
		},
		removePath(state){
			state.list.forEach(v=>{
				if(v.isDefault){
					v.isDefault= 0
				}
			})
		}
	},
	actions: {
		createPathFn({commit},obj){
			if(obj.isDefault){
				commit('removePath')
			}
			commit('createPath',obj)
		},
		updataPathFn({commit},obj){
			if(obj.item.isDefault){
			}
			commit('updataPath',obj)
		}
	}
}
export default path
