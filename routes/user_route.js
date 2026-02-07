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
  var sql5 = `SELECT * FROM testimonials ORDER BY rating DESC, id DESC LIMIT 3;`;
  var testimonials = await exe(sql5);
  var sql6 = "SELECT * FROM social_links";
  var social_links = await exe(sql6);
  var sql7 = "SELECT * FROM contact_info";
  var contact_info = await exe(sql7);

  res.render('user/home.ejs', { data, home_slider, home_our_story, choose_us, service, testimonials, social_links, contact_info });
});

router.get("/about", async function (req, res) {

  const about_header = await exe("SELECT * FROM about_header LIMIT 1");
  const story_data = await exe("SELECT * FROM our_story LIMIT 1");
  const social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");


  const vm = await exe(
    "SELECT * FROM vision_mission WHERE status = 1"
  );

  let mission = null;
  let vision = null;

  vm.forEach(item => {
    if (item.type === 'mission') mission = item;
    if (item.type === 'vision') vision = item;
  });

  const core_values = await exe(
    "SELECT title, description, icon FROM core_values WHERE status = 1 ORDER BY id ASC LIMIT 3"
  );

  const journey = await exe(
    "SELECT * FROM journey_timeline WHERE status = 1 ORDER BY year ASC"
  );


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
    leadership,
    social_links,
    contact_info// 👈 pass to ejs

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
  var sql5 = "SELECT * FROM social_links";
  var social_links = await exe(sql5);
  var sql6 = "SELECT * FROM contact_info";
  var contact_info = await exe(sql6);
  var packet = { service_slider, service, other_service, how_work, social_links, contact_info };
  res.render('user/services.ejs', packet);
});


router.get("/packages", async function (req, res) {

  const package_header = await exe(
    "SELECT * FROM header_packages ORDER BY created_at DESC LIMIT 1"
  );

  let packages = await exe("SELECT * FROM packages");
  const features = await exe("SELECT * FROM features");
  const social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");

  // ✅ FIX: parse JSON fields
  packages = packages.map(p => {
    try {
      p.feature_included = p.feature_included
        ? JSON.parse(p.feature_included)
        : [];
    } catch {
      p.feature_included = [];
    }

    try {
      p.support = p.support
        ? JSON.parse(p.support)
        : [];
    } catch {
      p.support = [];
    }

    return p;
  });

  res.render("user/packages.ejs", {
    package_header: package_header[0] || null,
    packages,
    features,
    social_links,
    contact_info
  });
});



router.get("/gallery", async function (req, res) {

  const data = await exe("SELECT * FROM gallery_header LIMIT 1");
  const galleryData = await exe("SELECT * FROM gallery ORDER BY id DESC");
  const social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");
  const categories = [...new Set(
    galleryData.map(item => item.category.toLowerCase())
  )];

  const obj = {
    gallery_header: data,
    gallery: galleryData,
    categories: categories,
    social_links,
    contact_info
  };

  res.render("user/gallery.ejs", obj);
});


router.get("/testimonials", async function (req, res) {
  try {
    const headerData = await exe(
      "SELECT * FROM testimonials_header LIMIT 1"
    );

    const testimonials = await exe(`
      SELECT *
      FROM testimonials
      ORDER BY rating DESC, id DESC
      LIMIT 3
    `);

    const social_links = await exe("SELECT * FROM social_links");
    const contact_info = await exe("SELECT * FROM contact_info");

    res.render("user/testimonials.ejs", {
      header: headerData[0] || null,
      data: testimonials || [],
      social_links,
      contact_info
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});




router.post("/add", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (!req.session.user.profile_photo) {
    return res.redirect("/profile?error=photo_required");
  }

  try {
    const { name, event_type, rating, message } = req.body;
    const image = req.session.user.profile_photo;

    await exe(
      "INSERT INTO testimonials (name, event_type, rating, message, image) VALUES (?,?,?,?,?)",
      [name, event_type, rating, message, image]
    );

    res.redirect("/testimonials");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error submitting review");
  }
});




// router.get("/testimonials", async (req, res) => {
//   const sql = `
//     SELECT * FROM testimonials
//     WHERE rating >= 4
//     ORDER BY rating DESC, id DESC
//   `;

//   const data = await exe(sql);
//   const social_links = await exe("SELECT * FROM social_links");
//   const contact_info = await exe("SELECT * FROM contact_info");

//   res.render("user/testimonials.ejs", {
//     data,
//     social_links,
//     contact_info
//   });
// });



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
  var sql3 = "SELECT * FROM social_links";
  var social_links = await exe(sql3);
  var contact_info = await exe("SELECT * FROM contact_info");
  var packet = { blog_slider, blog, social_links, contact_info };
  res.render('user/blog.ejs', packet);
});

router.get("/contact", async (req, res) => {
  try {
    const headers = await exe("SELECT * FROM contact_header ORDER BY id DESC LIMIT 1");
    const header = headers.length > 0 ? headers[0] : null;
    const social_links = await exe("SELECT * FROM social_links");
    const contacts = await exe("SELECT * FROM contact_info ORDER BY id ASC");
    const contact_info = await exe("SELECT * FROM contact_info");


    const success = req.query.success ? true : false;

    res.render("user/contact.ejs", { header, contacts, success, social_links, contact_info });
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
  var social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");

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
    contact: contact.length > 0 ? contact[0] : null,
    social_links,
    contact_info
  });
});

router.get("/terms", async function (req, res) {
  var sql = `SELECT * FROM terms_conditions`;
  var terms = await exe(sql);
  var social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");
  res.render('user/terms.ejs', { terms, social_links, contact_info });
});


router.get("/FAQ", async function (req, res) {
  var sql1 = "SELECT * FROM header_faq";
  var header_faq = await exe(sql1);
  var sql2 = "SELECT * FROM faqs";
  var faqs = await exe(sql2);
  var sql3 = "SELECT * FROM social_links";
  var social_links = await exe(sql3);
  const contact_info = await exe("SELECT * FROM contact_info");
  var packet = { header_faq, faqs, social_links, contact_info };
  res.render('user/faq.ejs', packet);
});


router.get("/login", async function (req, res) {
  var social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");
  res.render('user/login.ejs', { social_links, contact_info });
});

router.get("/user_registeration", async function (req, res) {
  var social_links = await exe("SELECT * FROM social_links");
  const contact_info = await exe("SELECT * FROM contact_info");
  res.render("user/register.ejs", { social_links, contact_info });
});


router.get("/book_event", async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  try {
    const mobile = await exe(
      "SELECT mobile_no FROM book_event_mobile WHERE id = 1"
    );
    const social_links = await exe("SELECT * FROM social_links");
    const contact_info = await exe("SELECT * FROM contact_info");
    const { package: pkg, price, features } = req.query;

    res.render("user/book_event.ejs", {
  mobile,
  user: req.session.user,
  event: req.query.event || "",
  price: req.query.price || "",
  package_name: req.query.package || "",
  features: req.query.features || "",
  social_links,
  contact_info
});

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});



router.post("/save_user", async function (req, res) {
  try {
    var d = req.body;
    var checkSql = `SELECT id FROM users WHERE email = ?`;
    var existingUser = await exe(checkSql, [d.email]);
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    if (existingUser.length > 0) {
      return res.redirect("/user_registeration?error=email_exists" + social_links + contact_info);
    }
    var sql = ` INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)`;
    await exe(sql, [d.name, d.email, d.mobile, d.password]);
    res.redirect("/login?register=success" + social_links + contact_info);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.redirect("/user_registeration?error=email_exists" + social_links + contact_info);
    }
    res.redirect("/user_registeration?error=server_error" + social_links + contact_info);
  }
});

router.post("/save_login", async function (req, res) {
  try {
    var d = req.body;
    var sql = `SELECT * FROM users WHERE email = ?`;
    var result = await exe(sql, [d.email]);
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    if (result.length === 0) {
      return res.redirect("/login?error=invalid" + social_links + contact_info);
    }
    if (d.password !== result[0].password) {
      return res.redirect("/login?error=invalid" + social_links + contact_info);
    }
    req.session.user = {
      id: result[0].id,        
      name: result[0].name,
      email: result[0].email
    };
    return res.redirect("/?login=success" + social_links + contact_info);
  } catch (err) {
    console.log(err);
    res.send("Server Error");
  }
});

router.get("/forgot-start", async function (req, res) {
  req.session.forgotStep = true;
  var sql2 = "SELECT * FROM social_links";
  var social_links = await exe(sql2);
  const contact_info = await exe("SELECT * FROM contact_info");
  res.redirect("/forgot_password" + social_links + contact_info);
});

router.get("/forgot_password", async function (req, res) {
  if (!req.session.forgotStep) {
    return res.redirect("/login");
  }
  var sql2 = "SELECT * FROM social_links";
  var social_links = await exe(sql2);
  const contact_info = await exe("SELECT * FROM contact_info");
  res.set("Cache-Control", "no-store");
  res.render("user/forgot_password.ejs", { query: req.query, social_links, contact_info });
});

router.post("/send_otp_mail", async function (req, res) {
  try {
    var d = req.body;
    var sql = `SELECT * FROM users WHERE email = ?`;
    var result = await exe(sql, [d.email]);
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    if (result.length === 0) {
      return res.status(404).send("Email not found" + social_links + contact_info);
    }
    var otp = Math.floor(100000 + Math.random() * 900000);
    req.session.otp = otp;
    req.session.email = d.email;
    req.session.resetStep = false;
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

router.post("/reset_password", allowResetPassword, async function (req, res) {
  try {
    var d = req.body;
    var sql = `UPDATE users SET password = ? WHERE email = ?`;
    result = await exe(sql, [d.new_password, req.session.email]);
    req.session.otp = null;
    req.session.email = null;
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    res.redirect("/login?reset=success" + social_links + contact_info);
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

router.get("/reset_password", allowResetPassword, async function (req, res) {
  var sql2 = "SELECT * FROM social_links";
  var social_links = await exe(sql2);
  const contact_info = await exe("SELECT * FROM contact_info");
  res.set("Cache-Control", "no-store");
  res.render("user/reset_password.ejs", { social_links, contact_info });
});

router.post("/reset_password", allowResetPassword, async function (req, res) {
  try {
    var d = req.body;
    var sql = `UPDATE users SET password = ? WHERE email = ?`;
    result = await exe(sql, [d.new_password, req.session.email]);
    req.session.otp = null;
    req.session.email = null;
    req.session.resetStep = null;
    req.session.resetTime = null;
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    res.redirect("/login?reset=success" + social_links + contact_info);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/profile", async function (req, res) {
  try {
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    if (!req.session.user) {
      return res.redirect("/login" + social_links + contact_info);
    }
    var userSession = req.session.user;
    var sql = "SELECT * FROM users WHERE id = ?";
    var result = await exe(sql, [userSession.id]);
    res.render("user/profile.ejs", { data: result[0] || {}, social_links, contact_info });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.post("/profile/update", async function (req, res) {
  try {
    var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
    if (!req.session.user) {
      return res.redirect("/login" + social_links + contact_info);
    }

    var userId = req.session.user.id;
    var name = req.body.name;
    var mobile = req.body.mobile;
    var password = req.body.password;
    var oldData = await exe("SELECT profile_photo FROM users WHERE id=?", [userId]);
    var oldPhoto = oldData.length > 0 ? oldData[0].profile_photo : null;
    var newPhotoName = null;
    if (req.files && req.files.profile_photo) {
      var photo = req.files.profile_photo;
      if (photo.size > 2 * 1024 * 1024) {
        return res.send("Image size must be less than 2MB");
      }
      if (photo.mimetype !== "image/jpeg" && photo.mimetype !== "image/jpg") {
        return res.send("Only JPG / JPEG images allowed");
      }
      if (oldPhoto) {
        var oldPath = path.join(__dirname, "../public/upload/profile", oldPhoto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      var ext = path.extname(photo.name);
      newPhotoName = Date.now() + "_" + Math.floor(Math.random() * 100000) + ext;
      var uploadPath = path.join(__dirname, "../public/upload/profile", newPhotoName);
      await photo.mv(uploadPath);
      req.session.user.profile_photo = newPhotoName;
    }
    if (newPhotoName && password) {
      await exe("UPDATE users SET name=?, mobile=?, password=?, profile_photo=? WHERE id=?", [name, mobile, password, newPhotoName, userId]);
    }
    else if (newPhotoName) {
      await exe("UPDATE users SET name=?, mobile=?, profile_photo=? WHERE id=?", [name, mobile, newPhotoName, userId]);
    }
    else if (password) {
      await exe("UPDATE users SET name=?, mobile=?, password=? WHERE id=?", [name, mobile, password, userId]);
    }
    else {
      await exe(
        "UPDATE users SET name=?, mobile=? WHERE id=?", [name, mobile, userId]);
    }

    req.session.user.name = name;
    req.session.user.mobile = mobile;
    res.redirect("/profile?status=updated");
    z
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/profile?status=error");
  }
});

router.post("/book_event", async (req, res) => {
  try {
    const {
      name,
      mobile,
      start_date,
      end_date,
      event_type,
      budget,
      message
    } = req.body;
  
    const sql = `
            INSERT INTO book_event
            (name, mobile, start_date, end_date, event_type, budget, message,user_id )
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `;

    await exe(sql, [
      name,
      mobile,
      start_date,
      end_date,
      event_type,
      budget || null,
      message,
      req.session.user.id
    ]);

    // ✅ after successful save
    res.redirect("/");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/my_bookings", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }
        const userId = req.session.user.id;
     const bookings = await exe(
            `SELECT * FROM book_event WHERE user_id = ? ORDER BY id DESC`,
            [userId]
        );
        var sql2 = "SELECT * FROM social_links";
    var social_links = await exe(sql2);
    const contact_info = await exe("SELECT * FROM contact_info");
  

        res.render("user/my_bookings.ejs", {
            bookings,
            contact_info,
            social_links
        });

    } catch (err) {
        console.log(err);
        res.send("Server Error");
    }
});

router.post("/services_book_event", (req, res) => {
  const { event, price } = req.body;

  // ✅ session मध्ये store कर
  req.session.selectedEvent = {
    event,
    price
  };

  res.redirect("/book_event.ejs");
});


router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      return res.redirect('/'); // fallback
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});


module.exports = router;