var express = require("express");
var exe = require("./../connection");
var sendMail = require("./send_mail")
var fs = require("fs");
var path = require("path");
var router = express.Router();

router.get("/", async function (req, res) {
  var data = req.session.user;

  var sql = "SELECT * FROM home_slider";
  var home_slider = await exe(sql);

  var sql2 = "SELECT * FROM home_our_story";
  var home_our_story = await exe(sql2);

  var sql3 = "SELECT * FROM choose_us";
  var choose_us = await exe(sql3);

  var sql4 = "SELECT * FROM service";
  var service = await exe(sql4);

  res.render('user/home.ejs', { data, home_slider, home_our_story, choose_us, service });
});

router.get("/about", async function (req, res) {

  const about_header = await exe("SELECT * FROM about_header LIMIT 1");
  const story_data   = await exe("SELECT * FROM our_story LIMIT 1");

  const vm = await exe(
    "SELECT * FROM vision_mission WHERE status = 1"
  );

  let mission = null;
  let vision  = null;

  vm.forEach(item => {
    if (item.type === 'mission') mission = item;
    if (item.type === 'vision')  vision  = item;
  });

  const core_values = await exe(
    "SELECT title, description, icon FROM core_values WHERE status = 1 ORDER BY id ASC LIMIT 3"
  );

  const journey = await exe(
    "SELECT * FROM journey_timeline WHERE status = 1 ORDER BY year ASC"
  );

  // ✅ Leadership Team (NEW)
  const leadership = await exe(
    "SELECT * FROM leadership_team WHERE status = 1 ORDER BY id ASC"
  );

  res.render("user/about.ejs", {
    about_header: about_header[0] || {},
    story: story_data[0] || {},
    mission,
    vision,
    core_values,
    journey,
    leadership   // 👈 pass to ejs
  });
});


router.get("/services", async function (req, res) {
  var sql = "SELECT * FROM service_slider";
  var service_slider = await exe(sql);

  var sql2 = "SELECT * FROM other_service";
  var other_service = await exe(sql2);

  var sql3 = "SELECT * FROM service";
  var service = await exe(sql3);

  var sql4 = "SELECT * FROM how_work";
  var how_work = await exe(sql4);

  var packet = { service_slider, service, other_service, how_work };
  res.render('user/services.ejs', packet);
});


router.get("/packages", async function (req, res) {
  try {
    const package_header = await exe("SELECT * FROM header_packages LIMIT 1");
    const packages = await exe("SELECT * FROM packages");
    const features = await exe("SELECT * FROM features");

    res.render("user/packages.ejs", {
      package_header: package_header[0] || null,
      packages,
      features
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.get("/gallery", async function (req, res) {

    const data = await exe("SELECT * FROM gallery_header LIMIT 1");
    const galleryData = await exe("SELECT * FROM gallery ORDER BY id DESC");

    const categories = [...new Set(
        galleryData.map(item => item.category.toLowerCase())
    )];

    const obj = {
        gallery_header: data,
        gallery: galleryData,
        categories: categories
    };

    res.render("user/gallery.ejs", obj);
});
router.get("/testimonials", async function (req, res) {

    const headerData = await exe("SELECT * FROM testimonials_header LIMIT 1");
    const testimonials = await exe("SELECT * FROM testimonials");

    res.render("user/testimonials.ejs", {
        header: headerData[0] || null,
        data: testimonials || []
    });
});

router.post("/add", async (req, res) => {
    try {
        const { name, event_type, rating, message } = req.body;

        let imageName = "";  // This matches admin column 'image'
        const fs = require("fs");

        // Check if file uploaded
        if (req.files && req.files.img) {
            const file = req.files.img;
            // Create unique file name
            imageName = Date.now() + "_" + file.name.replace(/\s/g, "_");
            // Move file to upload folder
            await file.mv("public/upload/testimonials/" + imageName);
        }

        // Insert into database (column 'image')
        const sql = `
            INSERT INTO testimonials (name, event_type, rating, message, image)
            VALUES (?, ?, ?, ?, ?)
        `;
        await exe(sql, [name, event_type, rating, message, imageName]);

        // Redirect to testimonials page
        res.redirect("/testimonials");

    } catch (err) {
        console.error("Error adding testimonial:", err);
        res.send("Error while submitting testimonial");
    }
});





/* ================= USER TESTIMONIALS ================= */
router.get("/testimonials", async (req, res) => {
    // Fetch testimonials with rating >= 4, newest first
    const sql = `
        SELECT * FROM testimonials
        WHERE rating >= 4
        ORDER BY id DESC
    `;
    const data = await exe(sql);
    res.render("user/testimonials.ejs", { data });
});

/* ================= RATING STATS ================= */
router.get("/rating-stats", async (req, res) => {
    // Total number of testimonials
    const total = await exe("SELECT COUNT(*) total FROM testimonials");

    // Average rating
    const avg = await exe("SELECT AVG(rating) avgRating FROM testimonials");

    // Number of 5-star ratings
    const five = await exe("SELECT COUNT(*) five FROM testimonials WHERE rating=5");

    res.json({
        totalReviews: total[0].total,
        avgRating: avg[0].avgRating ? avg[0].avgRating.toFixed(1) : 0,
        fiveStarPercent: total[0].total
            ? Math.round((five[0].five / total[0].total) * 100)
            : 0,
        repeatClientsPercent: 68 // hardcoded value, can be dynamic later
    });
});
router.get("/blog", async function (req, res) {

  var sql = "SELECT * FROM blog_slider";
  var blog_slider = await exe(sql);

  var sql2 = "SELECT * FROM blog";
  var blog = await exe(sql2);

  var packet = { blog_slider, blog };

  res.render('user/blog.ejs', packet);
});

router.get("/contact", async (req, res) => {
    try {
        const headers = await exe("SELECT * FROM contact_header ORDER BY id DESC LIMIT 1");
        const header = headers.length > 0 ? headers[0] : null;

        const contacts = await exe("SELECT * FROM contact_info ORDER BY id ASC");


        const success = req.query.success ? true : false;

        res.render("user/contact.ejs", { header, contacts, success });
    } catch (err) {
        console.error("Error loading contact page:", err);
        res.status(500).send("Error loading contact page");
    }
});

router.post("/save_contact_form", async (req, res) => {
    try {
        console.log("FORM DATA => ", req.body); 

        const { full_name, email, phone, event_type, subject, message } = req.body;

        const sql = `
            INSERT INTO contact_form
            (full_name, email, phone, event_type, subject, message)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await exe(sql, [full_name, email, phone, event_type, subject, message]);

        res.redirect("/contact?success=1");
    } catch (err) {
        console.log("DB ERROR => ", err);
        res.status(500).send("Error saving contact form");
    }
});


router.get("/privacy", async function (req, res) {

    var policies = await exe(
        "SELECT * FROM privacy_policy ORDER BY privacy_id ASC"
    );

    var reports = await exe(
        "SELECT * FROM privacy_policy_report ORDER BY section_no ASC"
    );

    var last = await exe(
        "SELECT privacy_last_updated FROM privacy_policy ORDER BY privacy_id DESC LIMIT 1"
    );

    var contact = await exe(
        "SELECT * FROM contact_us ORDER BY contact_id DESC LIMIT 1"
    );

    res.render("user/privacy.ejs", {
        policies: policies,
        reports: reports,
        lastUpdated: last.length > 0 ? last[0].privacy_last_updated : "",
        contact: contact.length > 0 ? contact[0] : null
    });
});

router.get("/terms", async function (req, res) {
    var sql = `SELECT * FROM terms_conditions`;
    var terms = await exe(sql);
    res.render('user/terms.ejs', { terms });
});


router.get("/FAQ",async function (req, res) {
  var sql1 = "SELECT * FROM header_faq";
  var header_faq= await exe(sql1);
   var sql2 = "SELECT * FROM faqs";
  var faqs= await exe(sql2);
  var packet = {header_faq,faqs };
  res.render('user/faq.ejs', packet);
});


router.get("/login", function (req, res) {
  res.render('user/login.ejs');
});

router.get("/user_registeration", function (req, res) {
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
    await exe(sql, [d.name, d.email, d.mobile, d.password]);
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
});

router.post("/reset_password", allowResetPassword, async (req, res) => {
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

router.post("/reset_password", allowResetPassword, async (req, res) => {
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

router.get("/profile", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    var userSession = req.session.user;
    var sql = "SELECT * FROM users WHERE id = ?";
    var result = await exe(sql, [userSession.id]);
    res.render("user/profile.ejs", {data: result[0] || {}});
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post("/profile/update", async function (req, res) {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    var userId   = req.session.user.id;
    var name     = req.body.name;
    var mobile   = req.body.mobile;
    var password = req.body.password;

    var oldData = await exe(
      "SELECT profile_photo FROM users WHERE id=?",
      [userId]
    );

    var oldPhoto = oldData.length > 0 ? oldData[0].profile_photo : null;
    var newPhotoName = null;

    if (req.files && req.files.profile_photo) {
      var photo = req.files.profile_photo;

      if (photo.size > 2 * 1024 * 1024) {
        return res.send("Image size must be less than 2MB");
      }

      if (
        photo.mimetype !== "image/jpeg" &&
        photo.mimetype !== "image/jpg"
      ) {
        return res.send("Only JPG / JPEG images allowed");
      }

      if (oldPhoto) {
        var oldPath = path.join(
          __dirname,
          "../public/upload/profile",
          oldPhoto
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      var ext = path.extname(photo.name);
      newPhotoName = Date.now() + "_" + Math.floor(Math.random() * 100000) + ext;

      var uploadPath = path.join(
        __dirname,
        "../public/upload/profile",
        newPhotoName
      );

      await photo.mv(uploadPath);
      req.session.user.profile_photo = newPhotoName;
    }

    if (newPhotoName && password) {
      await exe(
        "UPDATE users SET name=?, mobile=?, password=?, profile_photo=? WHERE id=?",
        [name, mobile, password, newPhotoName, userId]
      );
    }
    else if (newPhotoName) {
      await exe(
        "UPDATE users SET name=?, mobile=?, profile_photo=? WHERE id=?",
        [name, mobile, newPhotoName, userId]
      );
    }
    else if (password) {
      await exe(
        "UPDATE users SET name=?, mobile=?, password=? WHERE id=?",
        [name, mobile, password, userId]
      );
    }
    else {
      await exe(
        "UPDATE users SET name=?, mobile=? WHERE id=?",
        [name, mobile, userId]
      );
    }

    req.session.user.name   = name;
    req.session.user.mobile = mobile;

    res.redirect("/profile?status=updated");

  } catch (err) {
    console.log(err);
    res.status(500).redirect("/profile?status=error");
  }
});


module.exports = router