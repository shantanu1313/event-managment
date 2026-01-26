var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('user/home.ejs');
});

router.get("/about", function (req, res){
    res.render('user/about.ejs');
});

router.get("/services", function (req, res){
    res.render('user/services.ejs');
});

router.get("/packages", function (req, res){
    res.render('user/packages.ejs');
});

router.get("/gallery", function (req, res){
    res.render('user/gallery.ejs');
});

router.get("/testmonials", function (req, res){
    res.render('user/testmonials.ejs');
});

router.get("/blog", function (req, res){
    res.render('user/blog.ejs');
});

router.get("/contact", function (req, res){
    res.render('user/contact.ejs');
});

router.get("/privacy", function (req, res){
    res.render('user/privacy.ejs');
});

router.get("/terms", function (req, res){
    res.render('user/terms.ejs');
});

router.get("/FAQ", function (req, res){
    res.render('user/FAQ.ejs');
});

router.get("/login", function (req, res){
    res.render('user/login.ejs');
});

router.get("/user_register", function (req, res){
    res.render("user/register.ejs");
});

router.get("/book_event",function (req, res){
    res.render("user/book_event.ejs");
});





module.exports = router