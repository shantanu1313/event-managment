var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('user/home.ejs');
});

router.get("/about", function (req, res) {
    res.render('user/about.ejs');
});

module.exports = router;