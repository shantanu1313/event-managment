var mysql = require("mysql");
var util = require("util");

var pool = mysql.createPool({
    connectionLimit: 10,          // max connections
    host: "bohcx1sasr4br0vv072c-mysql.services.clever-cloud.com",
    user: "uzkznabow4ktfdpv",
    password: "YTMRJf7X5ndJ8Zb6wQwR",
    database: "bohcx1sasr4br0vv072c",
    waitForConnections: true,
    queueLimit: 0
});

// Promisify pool.query
var exe = util.promisify(pool.query).bind(pool);

module.exports = exe;