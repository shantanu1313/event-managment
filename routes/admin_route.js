var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('admin/dashboard.ejs');
});
router.get("/about", function (req, res) {
    res.render('admin/about.ejs');
});
router.get("/service", function (req, res) {
    res.render('admin/service.ejs');
});
router.get("/package", function (req, res) {
    res.render('admin/package.ejs');
});
router.get("/gallery", function (req, res) {
    res.render('admin/gallery.ejs');
});
router.get("/blog", function (req, res) {
    res.render('admin/blog.ejs');
});
router.get("/booking", function (req, res) {
    res.render('admin/booking.ejs');
});
router.get("/testimonials", function (req, res) {
    res.render('admin/testimonials.ejs');
});
router.get("/contact", function (req, res) {
    res.render('admin/contact.ejs');
});
router.get("/faq", function (req, res) {
    res.render('admin/faq.ejs');
});
router.get("/policy", function (req, res) {
    res.render('admin/policy.ejs');
});
router.get("/condition", function (req, res) {
    res.render('admin/condition.ejs');
});
router.get("/logout", function (req, res) {
    res.render('admin/logout.ejs');
});



module.exports = router;