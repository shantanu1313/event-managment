var express = require("express");
var exe = require("./../connection");
var sendMail = require("./send_mail")
var router = express.Router();

router.get("/", function (req, res) {
    var data = req.session.user;
    res.render('user/home.ejs', { data });
});

router.get("/about", function (req, res) {
    res.render('user/about.ejs');
});

router.get("/services", function (req, res) {
    res.render('user/services.ejs');
});

router.get("/packages", function (req, res) {
    res.render('user/packages.ejs');
});

router.get("/gallery", function (req, res) {
    res.render('user/gallery.ejs');
});

router.get("/testmonials", function (req, res) {
    res.render('user/testmonials.ejs');
});

router.get("/blog", async function (req, res) {

    var sql = "SELECT * FROM blog_slider";
    var blog_slider = await exe(sql);

    var sql2 = "SELECT * FROM blog";
    var blog = await exe(sql2);

    var packet = { blog_slider, blog };

    res.render('user/blog.ejs', packet);
});

router.get("/contact", function (req, res) {
    res.render('user/contact.ejs');
});

router.get("/privacy", function (req, res) {
    res.render('user/privacy.ejs');
});

router.get("/terms", function (req, res) {
    res.render('user/terms.ejs');
});

router.get("/FAQ", function (req, res) {
    res.render('user/FAQ.ejs');
});

router.get("/login", function (req, res) {
    res.render('user/login.ejs');
});

router.get("/user_registeration", function (req, res){
    res.render("user/register.ejs");
});

router.get("/book_event", function (req, res) {
    res.render("user/book_event.ejs");
});

router.post("/save_user", async function (req, res) {
  try {
    var d = req.body;
    var checkSql = `SELECT id FROM users WHERE email = ?`;
    var existingUser = await exe(checkSql, [d.email]);
    if (existingUser.length > 0) {
      return res.redirect("/user_registeration?error=email_exists");
    }
    var sql = ` INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)`;
    await exe(sql, [ d.name, d.email, d.mobile, d.password ]);
    res.redirect("/login?register=success");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.redirect("/user_registeration?error=email_exists");
    }
    res.redirect("/user_registeration?error=server_error");
  }
});

router.post("/save_login", async function (req, res) {
  try {
    var d = req.body;
    var sql = `SELECT * FROM users WHERE email = ?`;
    var result = await exe(sql, [d.email]);
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

router.get("/forgot-start", (req, res) => {
<<<<<<< Updated upstream
  req.session.forgotStep = true;
  res.redirect("/forgot_password");
});


router.get("/forgot_password", (req, res) => {
  if (!req.session.forgotStep) {
    return res.redirect("/login");
  }
  res.set("Cache-Control", "no-store");
  res.render("user/forgot_password.ejs", { query: req.query });
});

router.post("/send_otp_mail", async function (req, res) {
  try {
    var d = req.body;
    var sql = `SELECT * FROM users WHERE email = ?`;
    var result = await exe(sql, [d.email]);
    if (result.length === 0) {
      return res.status(404).send("Email not found");
    }
    var otp = Math.floor(100000 + Math.random() * 900000);
    req.session.otp = otp;
    req.session.email = d.email;
    req.session.resetStep = false;   // reset not allowed yet
    req.session.resetTime = Date.now();
    var email = d.email;
    var subject = "OTP verification For Reset Password";
    var message = `<div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
                      <h2 style="color:#6a11cb;">Siddhivinayak Event Management</h2>
                      <p>Dear User,</p>
                      <p>
                          We received a request to reset the password for your 
                          <strong>Siddhivinayak Event Management</strong> account.
                      </p>
                      <p>Please use the following One-Time Password (OTP) to reset your password:</p>
                      <h1 style="color:#2575fc; letter-spacing:3px;">${otp}</h1>
                      <p>
                          This OTP is valid for <strong>10 minutes</strong> and can be used only once.
                          Please do not share this OTP with anyone.
                      </p>
                      <p>
                          If you did not request a password reset, please ignore this email.
                          Your account will remain secure.
                      </p>
                      <br>
                      <p>
                          Regards,<br>
                          <strong>Siddhivinayak Event Management Team</strong>
                      </p>
                  </div>`;
    await sendMail(email, subject, message);
    res.send("OTP sent successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}); 
=======
  req.session.allowForgot = true;
  res.redirect("/forgot_password");
});

function allowForgotPage(req, res, next) {
  if (req.session.allowForgot) {
    req.session.allowForgot = null;
    return next();
  }
  res.redirect("/login");
}

router.get("/forgot_password", allowForgotPage, (req, res) =>{
  res.set("Cache-Control", "no-store");
  res.render("user/forgot_password.ejs", {query: req.query});
});

router.post("/send_otp_mail", async function (req, res) {
  try {
    var d = req.body;
    var sql = `SELECT * FROM users WHERE email = ?`;
    var result = await exe(sql, [d.email]);
    if (result.length === 0) {
      return res.status(404).send("Email not found");
    }
    var otp = Math.floor(100000 + Math.random() * 900000);
    req.session.otp = otp;
    req.session.email = d.email;
    req.session.resetAllowed = true;
    req.session.resetTime = Date.now();
    var email = d.email;
    var subject = "OTP verification For Reset Password";
    var message = `<div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
                      <h2 style="color:#6a11cb;">Siddhivinayak Event Management</h2>
                      <p>Dear User,</p>
                      <p>
                          We received a request to reset the password for your 
                          <strong>Siddhivinayak Event Management</strong> account.
                      </p>
                      <p>Please use the following One-Time Password (OTP) to reset your password:</p>
                      <h1 style="color:#2575fc; letter-spacing:3px;">${otp}</h1>
                      <p>
                          This OTP is valid for <strong>10 minutes</strong> and can be used only once.
                          Please do not share this OTP with anyone.
                      </p>
                      <p>
                          If you did not request a password reset, please ignore this email.
                          Your account will remain secure.
                      </p>
                      <br>
                      <p>
                          Regards,<br>
                          <strong>Siddhivinayak Event Management Team</strong>
                      </p>
                  </div>`;
    await sendMail(email, subject, message);
    res.send("OTP sent successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
}); 


router.post("/forgot_password", async function (req, res) {
  try {
    var d = req.body;
    if (!req.session.otp) {
      return res.redirect("/forgot_password?error=otp_not_sent");
    }
    if (d.otp != req.session.otp) {
      return res.redirect("/forgot_password?error=invalid_otp");
    }
    return res.redirect("/reset_password?verification=success");
  } catch (err) {
    console.log(err);
    return res.redirect("/forgot_password?error=server");
  }
});
>>>>>>> Stashed changes

function allowResetPassword(req, res, next) {
  if (!req.session.resetAllowed) {
    return res.redirect("/login");
  }
  if (Date.now() - req.session.resetTime > 5 * 60 * 1000) {
    req.session.resetAllowed = null;
    req.session.resetTime = null;
    return res.redirect("/login?error=expired");
  }
  next();
}

<<<<<<< Updated upstream
router.post("/forgot_password", async function (req, res) {
  try {
    var d = req.body;
    if (!req.session.otp) {
      return res.redirect("/forgot_password?error=otp_not_sent");
    }
    if (d.otp != req.session.otp) {
      return res.redirect("/forgot_password?error=invalid_otp");
    }
    req.session.resetStep = true;
    req.session.forgotStep = null;
    return res.redirect("/reset_password?verification=success");
  } catch (err) {
    console.log(err);
    return res.redirect("/forgot_password?error=server");
  }
=======
router.get("/reset_password", allowResetPassword, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("user/reset_password.ejs");
>>>>>>> Stashed changes
});

router.post("/reset_password", allowResetPassword, async (req, res) =>{
    try {
        var d = req.body;
        var sql = `UPDATE users SET password = ? WHERE email = ?`;
        result = await exe(sql, [d.new_password, req.session.email]);
        req.session.otp = null;
        req.session.email = null;
        res.redirect("/login?reset=success");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

function allowResetPassword(req, res, next) {
  if (!req.session.resetStep) {
    return res.redirect("/login");
  }

  if (Date.now() - req.session.resetTime > 5 * 60 * 1000) {
    req.session.resetStep = null;
    req.session.resetTime = null;
    return res.redirect("/login?error=expired");
  }

  next();
}

router.get("/reset_password", allowResetPassword, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.render("user/reset_password.ejs");
});

router.post("/reset_password", allowResetPassword, async (req, res) =>{
    try {
        var d = req.body;
        var sql = `UPDATE users SET password = ? WHERE email = ?`;
        result = await exe(sql, [d.new_password, req.session.email]);
        req.session.otp = null;
        req.session.email = null;
        req.session.resetStep = null;
        req.session.resetTime = null;
        res.redirect("/login?reset=success");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router