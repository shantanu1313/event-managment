var express = require("express");
var router = express.Router();

router.get("/",function(req,res){
    res.render('user/home.ejs');
});
module.exports = router;