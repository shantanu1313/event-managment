function adminAuth(req, res, next) {
    if (!req.session || !req.session.admin) {
        return res.redirect("/admin/admin_login?error=unauthorized");
    }
    next();
}

module.exports = adminAuth;
