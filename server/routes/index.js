var express = require('express')
var router = express.Router()
var connection = require('../db/sql')
var user = require('../db/UserSql.js')
var jwt_decode = require('jwt-decode');
//腾讯云验证码
let code = '';
//接入短信的sdk
var QcloudSms = require("qcloudsms_js");
//引入支付宝沙箱配置
const alipaySdk = require('../db/alipay.js');
const AlipayFormData = require('alipay-sdk/lib/form').default;


//设置CORS
router.all('*', function(req, res,next) { 
		//'http://localhost:8080','http://192.168.0.109:3000','http://192.168.43.24:3000'
	res.header('Access-Control-Allow-Origin', '*') //当允许携带cookies此处的白名单不能写’*’
	res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With') //允许的请求头
	res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT') //允许的请求方法
	res.header('Content-Type','application/json;charset=utf-8')
	res.header('Access-Control-Allow-Credentials', true) //允许携带cookies
	
	next()
})

//数据库接口(商品搜索数据)
//商品搜索列表
router.get('/api/goods/search', function(req, res, next) {
	//desc降序 asc升序 
	//参考url http://192.168.0.105:3000/api/goods/search?name=MLB&pprice=desc
	//结构获取传参键名
	let [name, PPrice] = Object.keys(req.query)
	//获取name值即商品名
	let goodsName = req.query.name
	//获取价格升序还是降序，值即价格的值	
	let order = req.query[PPrice]
	if (PPrice == 'names') {
		PPrice = 'name'
	}
	console.log(req.query, name, PPrice, order, goodsName)
	connection.query('SELECT * FROM `goods_search` where name like "%' + goodsName + '%" order by ' + PPrice +
		' ' + order + '',
		function(error, results, fields) {
			if (error) throw error
			res.send({
				code: 0,
				data: results
			})
		}
	)
})
//详情页
router.get('/api/goods/id', function(req, res, next) {
	let id = req.query.id
	connection.query('SELECT * FROM `goods_search` where id='+id+'', function(error, results, fields) {
		if (error) throw error
		res.send({
			code: 0,
			data: results
		})
	})
})
//商品推荐
router.get('/api/introduce', function(req, res, next) {
	connection.query(`SELECT * FROM goods_search WHERE id >= ((SELECT MAX(id) FROM goods_search)-(SELECT MIN(id) FROM goods_search)) * RAND() + (SELECT MIN(id) FROM goods_search) LIMIT 4`, function (error, results, fields) {
		res.send({
			data:results
		})
	})
})
//登录
router.post('/api/login', function(req, res, next) {
	let params = {
		userName:req.body.userName,
		userPwd: req.body.userPwd
	}
	connection.query(user.queryUserName(params), function(error, results, fields) {
		if(results.length>0){
			connection.query(user.queryUserPwd(params), function(err, result) {
				if(result.length>0){
					res.send({
						data:{
							success:true,
							msg:'登录成功',
							data:result[0]
						}
					})
				}else{
					res.send({
						data:{
							success:false,
							msg:'密码不对'
						}
					})
				}
			})
		}
	})
})
//注册验证手机号是否存在
router.post('/api/registered', function(req, res, next) {
	
	//前端给后端的数据
	let params = {
		userName : req.body.phone
	};
	//查询手机号是否存在
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0 ){
			res.send({
				data:{
					success:false,
					msg:"手机号已经存在"
				}
			})
		}else{
			res.send({
				data:{
					success:true
				}
			})
		}
	})
	
})
//发送验证码
router.post('/api/code', function(req, res, next) {
	//前端给后端的数据
	let params = {
		userName : req.body.userName
	};
	// 短信应用 SDK AppID
	var appid = 1400187558;  // SDK AppID 以1400开头
	// 短信应用 SDK AppKey
	var appkey = "dc9dc3391896235ddc2325685047edc7";
	// 需要发送短信的手机号码
	var phoneNumbers = [params.userName];
	// 短信模板 ID，需要在短信控制台中申请
	var templateId = 298000;  // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
	// 签名
	var smsSign = "";  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
	// 实例化 QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
	function callback(err, ress, resData) {
	  if (err) {
	      console.log("err: ", err);
	  } else {
		  code = ress.req.body.params[0];
	      res.send({
			  data:{
				  success:true,
				  code:code
			  }
		  })
	  }
	}
	var ssender = qcloudsms.SmsSingleSender();
	var paramss = [  Math.floor( Math.random()*(9999-1000))+1000 ];//发送的验证码
	ssender.sendWithParam("86", phoneNumbers[0], templateId,
	paramss, smsSign, "", "", callback); 
	
})
//注册===>增加一条数据
router.post('/api/addUser', function(req, res, next) {
	//前端给后端的数据
	let params = {
		userName : req.body.userName,
		userCode : req.body.code
	};
	// if(  params.userCode == code   ){
		if(  params.userCode == '1111' || params.userCode == code  ){
		connection.query( user.insertData( params ) , function (error, results, fields) {
		    res.send({
				data:{
					success:true,
					msg:"注册成功"
				}
			})
		})
	}
	
})
//第三发登录
router.post('/api/loginother', function(req, res, next) {
	//前端给后端的数据
	let params = {
		provider:req.body.provider,//登录方式
		openid:req.body.openid,//用户身份id
		nickName:req.body.nickName,//用户昵称
		avatarUrl:req.body.avatarUrl//用户头像
	};
	//查询数据库中有没有此用户
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0){
			//数据库中存在      : 读取
			connection.query( user.queryUserName( params ) , function (e, r) {
				res.send({
					data:r[0]
				})
			})
		}else{
			//数据库中[不]存在  : 存储 ==>读取
			connection.query( user.insertData( params ) , function (er, result) {
				connection.query( user.queryUserName( params ) , function (e, r) {
					res.send({
						data:r[0]
					})
				})
			})
		}
	})
	
})
//当前用户查询收货地址
router.post('/api/selectAddress', function(req, res, next) {
	
	let token = req.headers.token;
	console.log(jwt_decode(token));
	let phone = jwt_decode(token);
	
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		let id = results[0].id;
		connection.query(`select * from address where userId = ${id}`, function (err, result, field) {
			res.send({
				data:result
			})
		})
	})
})
//当前用户修改收货地址
router.post('/api/updateAddress', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	let name = req.body.name;
	let tel = req.body.tel;
	let province = req.body.province;
	let city = req.body.city;
	let district = req.body.district;
	let address = req.body.address;
	let isDefault = req.body.isDefault;
	let id = req.body.id;
	
	//获取userId
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		let userId = results[0].id;
		connection.query(`select * from address where userId = ${userId} and isDefault = ${isDefault}`, function (err, result) {
			let childId = result[0].id;
			connection.query(`update address set isDefault = replace(isDefault,"1","0") where id = ${childId}`, function (e, r) {
				let updateSql = `update address set name = ?,tel = ?,province = ?,city = ?,district = ?,address = ?,isDefault = ?,userId = ? where id = ${id}`
				connection.query(updateSql,[name,tel,province,city,district,address,isDefault,userId],function (err, result) {
					res.send({
						data:{
							success:'成功'
						}
					})
				})
			})
		})
	})
})

//当前用户新增收货地址
router.post('/api/addAddress', function(req, res, next) {
	
	let token = req.headers.token;
	let phone = jwt_decode(token);
	let name = req.body.name;
	let tel = req.body.tel;
	let province = req.body.province;
	let city = req.body.city;
	let district = req.body.district;
	let address = req.body.address;
	let isDefault = req.body.isDefault;
	
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		let id = results[0].id;
		let sqlInert = 'insert into address (name,tel,province,city,district,address,isDefault,userId) values ("'+name+'","'+tel+'","'+province+'","'+city+'","'+district+'","'+address+'","'+isDefault+'","'+id+'")';
		connection.query(sqlInert, function (err, result, field) {
			res.send({
				data:{
					success:"成功"
				}
			})
		})
	})
})
//获取当前用户购物车列表
router.post('/api/selectCart', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		//当前用户id
		let userId = results[0].id;
		connection.query(`select * from goods_cart where uId = ${userId}`, function (err, result) {
			res.json({
				data:result
			})
		})
	})
})
//修改当前用户购物车商品数量
router.post('/api/updateNumCart', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	//商品id
	let goodsId = req.body.goodsId;
	//用户输入的商品数量
	let num = req.body.num;
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		//当前用户id
		let userId = results[0].id;
		connection.query(`select * from goods_cart where uId = ${userId} and goods_id = ${goodsId}`, function (err, result) {
			//数据中当前的数量
			let goods_num = result[0].num;
			//当前的id号
			let id = result[0].id;
			//修改[替换]
			connection.query(`update goods_cart set num = replace(num,${goods_num},${num}) where id = ${id}`, function (e, r) {
				res.json({
					data:{
						success:true
					}
				})
			})
		})
		
	})
})
//加入购物车
router.post('/api/addCart', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	//商品id
	let goods_id = req.body.goods_id;
	//用户输入的商品数量
	let num = req.body.num;
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		//当前用户id
		let userId = results[0].id;
		connection.query(`select * from goods_search where id = ${goods_id}`, function (err, result) {
			let name = result[0].name;
			let imgUrl = result[0].imgUrl;
			let pprice = result[0].pprice;
			//查询当前用户之前是否添加过这个商品
			connection.query(`select * from goods_cart where uId = ${userId} and goods_id = ${goods_id}`, function (err, data) {
				if( data.length > 0){
					//如果当前用户已经添加过本商品,就让数量增加
					connection.query(`update goods_cart set num = replace(num,${data[0].num},${ parseInt(num) + parseInt(data[0].num) }) where id = ${data[0].id}`, function (e, r) {
						res.json({
							data:{
								success:"加入成功"
							}
						})
					})
				}else{
					//如果当前用户之前没有加入过本商品,需要添加进入
					connection.query('insert into goods_cart (uId,goods_id,name,imgUrl,pprice,num) values ("'+userId+'","'+goods_id+'","'+name+'","'+imgUrl+'","'+pprice+'","'+num+'")', function (err, data) {
						res.json({
							data:{
								success:"加入成功"
							}
						})
					})
				}
			})
		})
	})
})
//删除购物车商品数据
router.post('/api/deleteCart', function(req, res, next) {
	let goodsId = req.body.goodsId;
	console.log( goodsId );
	for(var i=0;i<goodsId.length;i++){
		connection.query(`delete from goods_cart where id=${goodsId[i]}`,function(e,r){
			res.json({
				data:{
					success:true
				}
			})
		})
	}
})
//生成订单
router.post('/api/addOrder', function(req, res, next) {
    let token = req.headers.token;
    let phone = jwt_decode(token);
    //前端给后端传递的数据
    let goodsArr = req.body.arr;
    //生成订单号
    function setTimeDateFmt( s ){
        return s < 10 ? '0' + s : s;
    }
    function orderNumber(){
        const now = new Date();
        let fullYear = now.getFullYear();
        let month = setTimeDateFmt( now.getMonth() + 1 );
        let day = setTimeDateFmt( now.getDate() );
        let hour = setTimeDateFmt( now.getHours() );
        let minutes = setTimeDateFmt( now.getMinutes() );
        let seconds = setTimeDateFmt( now.getSeconds() );
        let orderCode = fullYear + month + day + hour + minutes + seconds + ( Math.round( Math.random() * 1000000 ));
        return orderCode;
    }
    //商品名称
    let goodsName = [];
    //订单总价
    let goodsPrice = 0;
    //订单商品总数量
    let goodsNum = 0;
    //订单号
    let orderId = orderNumber();
    
    goodsArr.forEach(v=>{
        goodsName.push(  v.name );
        goodsNum += parseInt(v.num);
        goodsPrice +=  v.num * v.pprice;
    })
    
    connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
    	//当前用户id
    	let userId = results[0].id;
        connection.query(`insert into store_order (uId,order_id,goods_name,goods_price,goods_num,order_status) values ('${userId}','${orderId}','${goodsName}','${goodsPrice}','${goodsNum}','1')`,function(){
            connection.query(`select * from store_order where uId = ${userId} and order_id = ${orderId}`,function(err,result){
                res.send({
                    data:{
                        code:200,
                        success:true,
                        data:result
                    }
                })
            })
        })
    })
})

//修改订单状态
router.post('/api/submitOrder', function(req, res, next) {
    let token = req.headers.token;
    let phone = jwt_decode(token);
    //订单号
    let orderId = req.body.orderId;
    //购物车中选中的商品
    let shopArr = req.body.shopArr;
    connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
    	//当前用户id
    	let userId = results[0].id;
        connection.query(`select * from store_order where uId = ${userId} and order_id = ${orderId}`,function(err,result){
            //订单的id
            let id = result[0].id;
                connection.query(`update store_order set order_status = replace(order_status,'1','2') where id = ${id}`,function(){
                    shopArr.forEach(v=>{
                        connection.query(`delete from goods_cart where id = ${v}`,function(){
                            
                        })
                    })
                    res.send({
                        data:{
                            code:200,
                            success:true
                        }
                    })
             })
        })
    })
})
//支付接口
router.post('/api/payment', function(req, res, next) {
    //接收前端给后端的订单号
    let orderId = req.body.orderId;
	//总价
	let price = req.body.price;
	//商品名称
	let list = req.body.list.join('');
    
    const formData = new AlipayFormData();
    //调用get方法
    formData.setMethod('get'),
    //支付时 的信息
    formData.addField('bizContent', {
      outTradeNo:orderId ,//订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',//写死的
      totalAmount: price,//金额
      subject: list//商品名称
    });
    //支付成功或者失败打开的页面
    formData.addField('returnUrl', 'https://uniapp.dcloud.net.cn/');//http://xxxxxxx/#/pages/payment-success/payment-success
    const result = alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
    result.then(resp=>{
        res.send({
            data:{
                code:200,
                success:true,
                paymentUrl:resp
            }
        })
    })
})


//测试模拟数据接口
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	})
})

router.get('/api/index_list/data', function(req, res, next) {
	res.send({
		'code': 0,
		'data': {
			'topBar': [{
					id: 1,
					name: '推荐'
				},
				{
					id: 2,
					name: '运动户外'
				},
				{
					id: 3,
					name: '服饰内衣'
				},
				{
					id: 4,
					name: '鞋靴箱包'
				},
				{
					id: 5,
					name: '美妆个护'
				},
				{
					id: 6,
					name: '家具数码'
				},
				{
					id: 7,
					name: '食品母婴'
				}
			],
			'data': [{
					type: 'swiperList',
					data: [{
							src: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.GZ0stXInaazv1DQofomWKQHaCU?w=316&h=109&c=7&r=0&o=5&dpr=1.56&pid=1.7'
							// 'https://alifei02.cfp.cn/creative/vcg/nowarter800/new/VCG41N1145395752.jpg?x-oss-process=image/format,webp'
						},
						{
							src: 'https://img14.360buyimg.com/babel/s1980x750_jfs/t1/44362/36/17369/147612/62c68d1bEe0be0142/67f81e8f1f4cd5be.jpg!cc_1980x750.webp'
						},
						{
							src: 'https://img10.360buyimg.com/babel/s1980x750_jfs/t1/11978/4/18003/35148/62be51eeE9555d894/b7b733d167fa6d08.png!cc_1980x750.webp'
						}
					]
				},
				{
					type: 'recommendList',
					data: [{
							bigUrl: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.kyZMHUR3nOmX06ry_HAiYgHaDF?w=194&h=80&c=7&r=0&o=5&dpr=1.56&pid=1.7',
							data: [{
									imgUrl: 'https://img30.360buyimg.com/babel/jfs/t1/20362/2/17695/51823/62f201e4E9279314c/d3598dcd35cdde9b.jpg.webp'
								},
								{
									imgUrl: 'https://img11.360buyimg.com/babel/jfs/t1/203690/7/22679/30938/62be9bbdEa782fad0/6d1a602c090739c8.jpg.webp'
								},
								{
									imgUrl: 'https://img12.360buyimg.com/babel/jfs/t1/136634/40/27921/50571/62be96beEb2d9083d/af3dc543eeca52c4.jpg.webp'
								}
							]
						},
						{
							bigUrl: 'https://m.360buyimg.com/babel/jfs/t1/150656/7/24942/122441/62f22557E5c263352/c78ae14180cf2b58.jpg',
							data: [{
									imgUrl: 'https://img13.360buyimg.com/cms/jfs/t1/196380/24/27936/259743/62d52317E32218c83/c208182880cc283a.jpg!q90'
								},
								{
									imgUrl: 'https://img14.360buyimg.com/cms/jfs/t1/220648/19/20232/315997/62aec9a4E27f4776f/45eaf10364686e97.jpg!q90'
								},
								{
									imgUrl: 'https://img10.360buyimg.com/cms/jfs/t1/209072/27/25270/190263/62eb8f2eE3c9fcf69/bf30a8eb4e50a2f4.jpg!q90'
								}
							]
						}
					]
				},
				{
					type: 'commodityList',
					data: [{
							id: 1,
							imgUrl: 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp',
							name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
							pprice: '399.00',
							oprice: '399.00',
							discount: 'No discounts'
						},
						{
							id: 2,
							imgUrl: 'https://img10.360buyimg.com/babel/s320x320_jfs/t1/209376/2/25426/55485/62f1f836Ea517b9b3/7a722cb5078245d0.jpg!cc_320x320.webp',
							name: '哥弟真的好女装2022秋季新款宽松bf慵懒风休闲运动连帽卫衣裤女套装A300925 A100133 暖杏 XL(5码)',
							pprice: '399.00',
							oprice: '399.00',
							discount: 'No discounts'
						},
						{
							id: 3,
							imgUrl: 'https://img14.360buyimg.com/babel/s320x320_jfs/t1/159033/36/267/239844/5fea98f4Ed310d356/6c7ce3060724bc99.jpg!cc_320x320.webp',
							name: '曼德诗（MARVALAS） 曼德诗绿色印花衬衫女高品质季新款百搭图案长袖时尚缎面雪纺上衣 绿花 M',
							pprice: '399.00',
							oprice: '399.00',
							discount: 'No discounts'
						},
						{
							id: 4,
							imgUrl: 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/75143/15/21224/147883/62f13668E845c4c3b/37e3d362722d8ba4.jpg!cc_320x320.webp',
							name: '诗篇可颜女装秋季新款简约圆领珍珠扣波浪边长袖衬衫 白色 36',
							pprice: '399.00',
							oprice: '399.00',
							discount: 'No discounts'
						}
					]
				}
			]
		}
	})
})

router.get('/api/index_list/1/data/2', function(req, res, next) {
	res.json({
		'code': 0,
		'data': [{
			type: 'commodityList',
			data: [{
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
			]
		}]
	})
})

router.get('/api/index_list/1/data/3', function(req, res, next) {
	res.json({
		'code': 0,
		'data': [{
			type: 'commodityList',
			data: [{
					id: 9,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/218735/6/13461/60474/621dbc70E96198993/39b539772b5cd811.jpg.webp',
					name: '优寸羊毛西服套装男 春季意大利进口纯羊毛商务正装西装轻正装 塞纳金深灰 手机在线量体',
					pprice: '3890.00',
					oprice: '3890.00',
					discount: '满200减30'
				},
				{
					id: 16,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/82814/39/20566/340046/62b54ef7E661e5bf1/1d01a52f9084d35b.jpg.webp',
					name: '曼奴诺思 冰丝运动裤女2022夏季薄款高腰垂感凉凉裤小个子直筒拖地裤女 黑色常规款 L',
					pprice: '113.40',
					oprice: '113.40',
					discount: '多买多惠'
				},
				{
					id: 10,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/205816/1/4557/266163/6131ee1eE4735df53/18138e51ff22874a.jpg!q70.dpg',
					name: '七匹狼双肩包男士背包大容量防泼水初中高中大学生书包15.6英寸电脑包商务休闲轻便旅行包男黑色CD006060-1',
					pprice: '139.00',
					oprice: '139.00',
					discount: 'PLUS限购'
				},
				{
					id: 17,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/120867/34/28439/200639/62f53de4E281e2b2e/74687c1deeb0f6ac.jpg.webp',
					name: '森马外套男2022秋季新款宽松休闲西装都市通勤简约基础时尚个性潮 烟灰银2335 175/92A/L',
					pprice: '225.00',
					oprice: '299.00',
					discount: '7.5'
				}
			]
		}]
	})
})

router.get('/api/index_list/2/data/1', function(req, res, next) {
	res.json({
		'code': 0,
		data: [{
				type: 'bannerList',
				imgUrl: 'https://img.zcool.cn/community/01004c58f8524aa8012049ef5d4b03.jpg@1280w_1l_2o_100sh.jpg'
			},
			{
				type: 'iconsList',
				data: [{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons1.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons2.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons3.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons4.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons5.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons6.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons7.png',
						name: '跑步鞋'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons8.png',
						name: '跑步鞋'
					}
				]
			},
			{
				type: 'hotList',
				data: [{
						id: 1,
						imgUrl: 'https://img11.360buyimg.com/babel/s1480x876_jfs/t1/23372/25/9449/141545/5c7e4873Ee0c57d5a/137bfdc479e20bc8.jpg!cc_1480x876',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 2,
						imgUrl: 'https://img12.360buyimg.com/babel/s1480x876_jfs/t20425/167/2505657810/141871/b2985fb5/5b5a927eNf495a1a8.jpg!cc_1480x876',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 3,
						imgUrl: 'https://img10.360buyimg.com/babel/s1480x876_jfs/t1/78151/27/8625/82657/5d67b1faE717e0ea8/a44b2397b030606d.jpg!cc_1480x876',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 4,
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/hot1.jpg.jpg',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 5,
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/hot2.jpg.jpg',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 6,
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/hot3.jpg.jpg',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					}
				]
			},
			{
				type: 'shopList',
				data: [{
					bigUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop.jpg',
					data: [{
							id: 1,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop1.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 2,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop2.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 3,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop3.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 4,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop4.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 5,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/77228/3/20899/216406/62c7ec2eE3b62dd67/67c06eb7656adcfb.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 6,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/51476/2/19295/156313/62ad64e4E6ecbdbda/4daad4757f970eb0.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 7,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/99535/6/23608/163626/62ad64e5E54030991/f7da24c5261b7d4c.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 8,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/75957/5/19993/179156/62ad64e8E0feade29/65031dcbaac3e8fe.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						}
					]
				}]
			},
			{
				type: 'commodityList',
				data: [{
						id: 1,
						imgUrl: 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					},
					{
						id: 2,
						imgUrl: 'https://img10.360buyimg.com/babel/s320x320_jfs/t1/209376/2/25426/55485/62f1f836Ea517b9b3/7a722cb5078245d0.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					},
					{
						id: 3,
						imgUrl: 'https://img14.360buyimg.com/babel/s320x320_jfs/t1/159033/36/267/239844/5fea98f4Ed310d356/6c7ce3060724bc99.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					},
					{
						id: 4,
						imgUrl: 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/75143/15/21224/147883/62f13668E845c4c3b/37e3d362722d8ba4.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					}
				]
			}
		]
	})
})

router.get('/api/index_list/2/data/2', function(req, res, next) {
	res.json({
		'code': 0,
		'data': [{
			type: 'commodityList',
			data: [{
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
			]
		}]
	})
})

router.get('/api/index_list/3/data/1', function(req, res, next) {
	res.json({
		'code': 0,
		data: [{
				type: 'bannerList',
				imgUrl: 'https://img.zcool.cn/community/01004c58f8524aa8012049ef5d4b03.jpg@1280w_1l_2o_100sh.jpg'
			},
			{
				type: 'iconsList',
				data: [{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons1.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons2.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons3.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons4.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons5.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons6.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons7.png',
						name: '服饰内衣'
					},
					{
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/icons8.png',
						name: '服饰内衣'
					}
				]
			},
			{
				type: 'hotList',
				data: [{
						id: 1,
						imgUrl: 'https://img11.360buyimg.com/babel/s1480x876_jfs/t1/23372/25/9449/141545/5c7e4873Ee0c57d5a/137bfdc479e20bc8.jpg!cc_1480x876',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 2,
						imgUrl: 'https://img12.360buyimg.com/babel/s1480x876_jfs/t20425/167/2505657810/141871/b2985fb5/5b5a927eNf495a1a8.jpg!cc_1480x876',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 3,
						imgUrl: 'https://img10.360buyimg.com/babel/s1480x876_jfs/t1/78151/27/8625/82657/5d67b1faE717e0ea8/a44b2397b030606d.jpg!cc_1480x876',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 4,
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/hot1.jpg',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 5,
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/hot2.jpg',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					},
					{
						id: 6,
						imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/hot3.jpg',
						name: '跑鞋嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，嘎嘎好，',
						pprice: '299',
						oprice: '659',
						discount: '5.2'
					}
				]
			},
			{
				type: 'shopList',
				data: [{
					bigUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop.jpg',
					data: [{
							id: 1,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop1.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 2,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop2.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 3,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop3.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 4,
							imgUrl: 'https://gitee.com/l7788/shopApp/raw/master/static/img/shop4.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 5,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/77228/3/20899/216406/62c7ec2eE3b62dd67/67c06eb7656adcfb.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 6,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/51476/2/19295/156313/62ad64e4E6ecbdbda/4daad4757f970eb0.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 7,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/99535/6/23608/163626/62ad64e5E54030991/f7da24c5261b7d4c.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						},
						{
							id: 8,
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/75957/5/19993/179156/62ad64e8E0feade29/65031dcbaac3e8fe.jpg',
							name: '大款2020年必须买,不买你就不行了,爆款疯狂GG008大款2020年必须买,不买你就不行了,爆款疯狂GG008',
							pprice: '299',
							oprice: '659',
							discount: '5.2'
						}
					]
				}]
			},
			{
				type: 'commodityList',
				data: [{
						id: 1,
						imgUrl: 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/167865/31/3079/143686/60040515Ef5f63556/f527e4e4b3118e56.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					},
					{
						id: 2,
						imgUrl: 'https://img10.360buyimg.com/babel/s320x320_jfs/t1/209376/2/25426/55485/62f1f836Ea517b9b3/7a722cb5078245d0.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					},
					{
						id: 3,
						imgUrl: 'https://img14.360buyimg.com/babel/s320x320_jfs/t1/159033/36/267/239844/5fea98f4Ed310d356/6c7ce3060724bc99.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					},
					{
						id: 4,
						imgUrl: 'https://img12.360buyimg.com/babel/s320x320_jfs/t1/75143/15/21224/147883/62f13668E845c4c3b/37e3d362722d8ba4.jpg!cc_320x320.webp',
						name: 'MLB官方 男女帽子NY渔夫帽LOGO刺绣运动休闲时尚21年春季新款32CPHB-07B 洛杉矶道奇队/米色 57',
						pprice: '399.00',
						oprice: '399.00',
						discount: 'No discounts'
					}
				]
			}
		]
	})
})

router.get('/api/index_list/3/data/2', function(req, res, next) {
	res.json({
		'code': 0,
		'data': [{
			type: 'commodityList',
			data: [{
					id: 9,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/218735/6/13461/60474/621dbc70E96198993/39b539772b5cd811.jpg.webp',
					name: '优寸羊毛西服套装男 春季意大利进口纯羊毛商务正装西装轻正装 塞纳金深灰 手机在线量体',
					pprice: '3890.00',
					oprice: '3890.00',
					discount: '满200减30'
				},
				{
					id: 16,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/82814/39/20566/340046/62b54ef7E661e5bf1/1d01a52f9084d35b.jpg.webp',
					name: '曼奴诺思 冰丝运动裤女2022夏季薄款高腰垂感凉凉裤小个子直筒拖地裤女 黑色常规款 L',
					pprice: '113.40 ',
					oprice: '113.40 ',
					discount: '多买多惠'
				},
				{
					id: 10,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/205816/1/4557/266163/6131ee1eE4735df53/18138e51ff22874a.jpg!q70.dpg',
					name: '七匹狼双肩包男士背包大容量防泼水初中高中大学生书包15.6英寸电脑包商务休闲轻便旅行包男黑色CD006060-1',
					pprice: '139.00',
					oprice: '139.00',
					discount: 'PLUS限购'
				},
				{
					id: 17,
					imgUrl: 'https://m.360buyimg.com/babel/jfs/t1/120867/34/28439/200639/62f53de4E281e2b2e/74687c1deeb0f6ac.jpg.webp',
					name: '森马外套男2022秋季新款宽松休闲西装都市通勤简约基础时尚个性潮 烟灰银2335 175/92A/L',
					pprice: '225.00',
					oprice: '299.00',
					discount: '7.5'
				}
			]
		}]
	})
})

router.get('/api/goods/list', function(req, res, next) {
	res.json({
		code: 0,
		data: [{
				id: 1,
				name: "男装",
				data: [{
						name: "男裙装",
						list: [{
								id: 1,
								name: "连衣裙",
								imgUrl: 'https://img11.360buyimg.com/n1/jfs/t1/193696/11/25204/603680/6296de0cEc2dbd57d/5ef82c0049a5aef0.jpg'
							},
							{
								id: 2,
								name: "半身裙",
								imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/172213/14/12823/198040/60b844f1Ecf9f062c/5db60ff68d282830.jpg'
							}
						]
					},
					{
						name: "上衣",
						list: [{
								id: 1,
								name: "T恤",
								imgUrl: 'https://img12.360buyimg.com/n1/jfs/t1/192873/1/2690/140986/609c188dEec80e8f6/cb65df7728b03532.jpg'
							},
							{
								id: 2,
								name: "衬衫",
								imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/194952/1/7751/141903/60c448e3E1a0c573f/9279775daf825402.jpg'
							}
						]
					},
					{
						name: '社会装',
						list: [{
							id: 1,
							name: "我是云南的",
							imgUrl: 'https://img13.360buyimg.com/n1/s350x467_jfs/t1/88302/21/24830/388749/623eff05E3c2e7767/e323705e117fd10e.jpg!cc_350x467'
						}]
					},
					{
						name: '麻袋装',
						list: [{
							id: 1,
							name: "格局要打开",
							imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/158114/22/18076/171103/607146edE9aa15224/3ecff4d86272171d.jpg'
						}]
					}
				]
			},
			{
				id: 2,
				name: "家居家纺",
				data: [{
						name: "家纺",
						list: [{
								id: 1,
								name: "毛巾",
								imgUrl: 'https://img11.360buyimg.com/n1/jfs/t21838/72/1130228215/192998/ad2640d2/5b208678N4100c0fe.jpg'
							},
							{
								id: 2,
								name: "枕头",
								imgUrl: 'https://img12.360buyimg.com/n1/jfs/t1/210927/30/1072/359891/6145a7e8E117cac6f/ff34485aae61cfa1.jpg'
							}
						]
					},
					{
						name: "生活用品",
						list: [{
								id: 1,
								name: "日化",
								imgUrl: 'https://img13.360buyimg.com/n1/jfs/t1/111583/9/21256/429794/62201a12Ea878f80d/8ba6d3c2d97568d3.jpg'
							},
							{
								id: 2,
								name: "器皿",
								imgUrl: 'https://img12.360buyimg.com/n1/jfs/t1/56248/28/11589/167604/5d8820beE57f80dac/8d32bf330da25316.jpg'
							}
						]
					},
					{
						name: "家纺",
						list: [{
								id: 1,
								name: "毛巾",
								imgUrl: 'https://img11.360buyimg.com/n1/jfs/t21838/72/1130228215/192998/ad2640d2/5b208678N4100c0fe.jpg'
							},
							{
								id: 2,
								name: "枕头",
								imgUrl: 'https://img12.360buyimg.com/n1/jfs/t1/210927/30/1072/359891/6145a7e8E117cac6f/ff34485aae61cfa1.jpg'
							}
						]
					},
					{
						name: "生活用品",
						list: [{
								id: 1,
								name: "日化",
								imgUrl: 'https://img13.360buyimg.com/n1/jfs/t1/111583/9/21256/429794/62201a12Ea878f80d/8ba6d3c2d97568d3.jpg'
							},
							{
								id: 2,
								name: "器皿",
								imgUrl: 'https://img12.360buyimg.com/n1/jfs/t1/56248/28/11589/167604/5d8820beE57f80dac/8d32bf330da25316.jpg'
							}
						]
					},
				]
			},
			{
				id: 3,
				name: "女装",
				data: [{
						name: "裙装",
						list: [{
								id: 1,
								name: "连衣裙",
								imgUrl: 'https://img11.360buyimg.com/n1/jfs/t1/193696/11/25204/603680/6296de0cEc2dbd57d/5ef82c0049a5aef0.jpg'
							},
							{
								id: 2,
								name: "半身裙",
								imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/172213/14/12823/198040/60b844f1Ecf9f062c/5db60ff68d282830.jpg'
							}
						]
					},
					{
						name: "上衣",
						list: [{
								id: 1,
								name: "T恤",
								imgUrl: 'https://img12.360buyimg.com/n1/jfs/t1/192873/1/2690/140986/609c188dEec80e8f6/cb65df7728b03532.jpg'
							},
							{
								id: 2,
								name: "衬衫",
								imgUrl: 'https://img10.360buyimg.com/n1/jfs/t1/194952/1/7751/141903/60c448e3E1a0c573f/9279775daf825402.jpg'
							}
						]
					}
				]
			}
		]
	})
})

module.exports = router
