const order = {
	namespaced: true,
    state:{
        orderNumber:''
    },
    getters:{},
    mutations:{
        initOrder( state , order ){
            state.orderNumber = order;
        }
    }	
}
export default order