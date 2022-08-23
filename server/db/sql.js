var mysql = require('mysql')
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password:'',
	database: 'shopapp'
})
module.exports=connection