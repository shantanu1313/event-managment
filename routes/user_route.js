var express = require("express");
var exe = require("./../connection");
var router = express.Router();

router.get("/", function (req, res) {
    var data = req.session.user;
    res.render('user/home.ejs', { data });
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

router.get("/book_event", function (req, res){
    res.render("user/book_event.ejs");
});

router.post("/save_user", async function (req, res) {
  try {
    var d = req.body;
    var sql = `INSERT INTO users (name, email, mobile, username, password) VALUES (?, ?, ?, ?, ?)`;
    await exe(sql, [ d.name, d.email, d.mobile, d.username, d.password]);
    res.redirect("/login?register=success");
  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
});


router.post("/save_login", async function (req, res) {
  try {
    var d = req.body;
    var sql = `SELECT * FROM users WHERE username = ?`;
    var result = await exe(sql, [d.username]);
    if (result.length === 0) {
      return res.redirect("/login?error=invalid");
    }
    if (d.password !== result[0].password) {
      return res.redirect("/login?error=invalid");
    }
    req.session.user = result[0];
    return res.redirect("/?login=success");
  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
});






module.exports = router