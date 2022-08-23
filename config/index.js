const env = process.env.NODE_ENV
// 热点http://192.168.43.24:3000 
var r = 'http://192.168.43.24:3000'
var w = 'http://192.168.0.108:3000'


const config = {
	//开发环境
	development: {
		baseURL: w
	},
	//生产环境
	production: {
		baseURL: ''
	},
	//测试环境
	test: {
		baseURL: w
	}
}



module.exports = {
	baseURL: config[env].baseURL
}
