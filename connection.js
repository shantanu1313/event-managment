var mysql = require("mysql");
var util = require("util");

var conn = mysql.createConnection({
    host:"bohcx1sasr4br0vv072c-mysql.services.clever-cloud.com",
    user:"uzkznabow4ktfdpv",
    password:"YTMRJf7X5ndJ8Zb6wQwR",
    database:"bohcx1sasr4br0vv072c"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;