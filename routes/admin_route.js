var express = require("express");
var exe = require("../connection");
var fs = require("fs");
var path = require("path");
var router = express.Router();
var adminAuth = require("../adminAuth");

router.get('/admin_login', function (req, res) {
    if (req.session.admin) {
        return res.redirect('/admin?status=already_logged_in');
    }
    res.render('admin/admin_login.ejs', {
        error: req.session.error || null
    });
    req.session.error = null;
});

router.post("/admin_login", async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.redirect("/admin/admin_login?error=required");
    }
    const sql = "SELECT * FROM admin WHERE admin_email = ? LIMIT 1";
    const result = await exe(sql, [email]);
    if (result.length === 0) {
      return res.redirect("/admin/admin_login?error=notfound");
    }
    const admin = result[0];
    if (password !== admin.admin_password) {
      return res.redirect("/admin/admin_login?error=passnotmatch");
    }
    req.session.admin = {
      id: admin.admin_id,
      name: admin.admin_name,
      email: admin.admin_email
    };
    return res.redirect("/admin?status=logged_in");
  } catch (err) {
    console.error(err);
    return res.redirect("/admin/admin_login?error=server");
  }
});

router.get('/admin_logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/admin/dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/admin/admin_login?status=logged_out');
    });
});

router.use(adminAuth);

router.get("/", async (req, res) => {
    try {
        const mobile = await exe("SELECT mobile_no FROM book_event_mobile WHERE id = 1");
        res.render("admin/dashboard", { mobile: mobile });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.get("/admin_profile", async function (req, res) {
    try {
        const sql = "SELECT * FROM admin WHERE admin_id = ?";
        const data = await exe(sql, [req.session.admin.id]);
        if (data.length === 0) {
            return res.status(404).send("Admin not found");
        }
        res.render("admin/profile.ejs", {
            admin: data[0]
        });

    } catch (err) {
        console.error("Admin Profile Error:", err);
        res.status(500).send("Server Error");
    }
});


router.post("/update_admin_profile", async function (req, res) {
  try {

    // 🔐 SESSION CHECK
    if (!req.session.admin) {
      return res.redirect("/admin/admin_login");
    }

    var adminId = req.session.admin.id;
    var admin_name = req.body.admin_name;
    var admin_mobile = req.body.admin_mobile;
    var admin_email = req.body.admin_email;
    var admin_password = req.body.admin_password;

    // ❌ SAFETY: EMAIL MUST NOT BE EMPTY
    if (!admin_email || admin_email.trim() === "") {
      return res.redirect("/admin/admin_profile?status=email_required");
    }

    // 📌 FETCH OLD IMAGE
    var oldData = await exe(
      "SELECT profile_image FROM admin WHERE admin_id=?",
      [adminId]
    );
    var old_image = oldData.length > 0 ? oldData[0].profile_image : null;
    var profile_image = old_image;

    // 🔐 IMAGE VALIDATION
    var allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    var maxSize = 2 * 1024 * 1024; // 2MB

    // ✅ NEW IMAGE UPLOADED
    if (req.files && req.files.profile_image) {
      var imageFile = req.files.profile_image;

      if (!allowedTypes.includes(imageFile.mimetype)) {
        return res.redirect("/admin/admin_profile?status=invalid_type");
      }

      if (imageFile.size > maxSize) {
        return res.redirect("/admin/admin_profile?status=big_file");
      }

      // 🆕 IMAGE NAME → ONLY DATE & TIME
      var ext = path.extname(imageFile.name); // .jpg / .png
      profile_image = Date.now() + ext;

      var uploadDir = path.join(__dirname, "../public/upload/profile/");
      var uploadPath = path.join(uploadDir, profile_image);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // MOVE NEW IMAGE
      await imageFile.mv(uploadPath);

      // 🗑️ DELETE OLD IMAGE (ONLY IF NEW UPLOADED)
      if (old_image) {
        var oldPath = path.join(uploadDir, old_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // UPDATE SESSION IMAGE
      req.session.admin.profile_image = profile_image;
    }

    // 🔐 UPDATE DB (PASSWORD OPTIONAL)
    if (admin_password && admin_password.trim() !== "") {
      await exe(
        `UPDATE admin 
         SET admin_name=?, admin_mobile=?, admin_email=?, admin_password=?, profile_image=? 
         WHERE admin_id=?`,
        [
          admin_name,
          admin_mobile,
          admin_email,
          admin_password,
          profile_image,
          adminId
        ]
      );
    } else {
      await exe(
        `UPDATE admin 
         SET admin_name=?, admin_mobile=?, admin_email=?, profile_image=? 
         WHERE admin_id=?`,
        [
          admin_name,
          admin_mobile,
          admin_email,
          profile_image,
          adminId
        ]
      );
    }

    // ✅ UPDATE SESSION DATA
    req.session.admin.admin_name = admin_name;
    req.session.admin.admin_mobile = admin_mobile;
    req.session.admin.admin_email = admin_email;

    return res.redirect("/admin/admin_profile?status=updated");

  } catch (err) {
    console.error("Update Admin Profile Error:", err);
    return res.redirect("/admin/admin_profile?status=error");
  }
});

router.post("/delete_profile_image", async function (req, res) {
  try {
    if (!req.session.admin) {
      return res.redirect("/admin/admin_login");
    }
    var adminId = req.session.admin.id;
    var data = await exe(
      "SELECT profile_image FROM admin WHERE admin_id=?",
      [adminId]
    );
    if (data.length === 0 || !data[0].profile_image) {
      return res.redirect("/admin/admin_profile");
    }
    var imageName = data[0].profile_image;
    var imagePath = path.join(
      __dirname,
      "../public/upload/profile/",
      imageName
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await exe(
      "UPDATE admin SET profile_image=NULL WHERE admin_id=?",
      [adminId]
    );
    req.session.admin.profile_image = null;
    return res.redirect("/admin/admin_profile?status=image_deleted");
  } catch (err) {
    console.error("Delete Admin Profile Image Error:", err);
    return res.redirect("/admin/admin_profile?status=error");
  }
});

router.get("/home/home_slider", async function (req, res) {
    var sql = "SELECT * FROM home_slider";
    var data = await exe(sql);
    var packet = { data };
    res.render("admin/home/home_slider.ejs", packet);
});

router.post("/home/save_home_slider", async function (req, res) {
    try {
        var d = req.body;
        var filename = "";
        if (req.files && req.files.image) {
            filename = Date.now() + "_" + req.files.image.name;
            await req.files.image.mv("public/upload/home/" + filename);
        }
        var sql = "INSERT INTO home_slider (image,title,description) VALUES (?,?,?)";
        await exe(sql, [filename, d.title, d.description]);
        res.redirect("/admin/home/home_slider");
    }
    catch (err) {
        console.error("Error saving home slider:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/home/edit_home_slider/:id", async function (req, res) {
    try {
        var id = req.params.id;
        var sql = "SELECT * FROM home_slider WHERE home_slider_id=?";
        var data = await exe(sql, [id]);
        var packet = { data };
        res.render("admin/home/edit_home_slider.ejs", packet);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/home/update_home_slider/:id", async function (req, res) {
    try {
        var d = req.body;
        var filename = d.old_image;
        if (req.files && req.files.image) {
            filename = Date.now() + "_" + req.files.image.name;
            await req.files.image.mv("public/upload/home/" + filename);
        }
        var sql = "UPDATE home_slider SET title=?,description=?, image=? WHERE home_slider_id=?";
        await exe(sql, [d.title, d.description, filename, req.params.id]);
        res.redirect("/admin/home/home_slider");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    };
});

router.get("/home/delete_home_slider/:id", async function (req, res) {
    try {
        var id = req.params.id;
        var sql = "DELETE FROM home_slider WHERE home_slider_id=?";
        var result = await exe(sql, [id]);
        res.redirect("/admin/home/home_slider");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    };
});

router.get("/home/home_our_story", async function (req, res) {
    try {
        const sql = "SELECT * FROM home_our_story LIMIT 1";
        const data = await exe(sql);
        res.render("admin/home/home_our_story.ejs", {
            data: data.length ? data[0] : null
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.post("/home/save_home_our_story", async function (req, res) {
    try {
        const d = req.body;
        let filename = d.old_image || "";
        if (req.files && req.files.image) {
            filename = Date.now() + "_" + req.files.image.name;
            await req.files.image.mv("public/upload/home/" + filename);
        }
        const checkSql = "SELECT home_our_story_id FROM home_our_story LIMIT 1";
        const check = await exe(checkSql);
        if (check.length > 0) {
            const sql = `UPDATE home_our_story SET title=?, description=?, point1=?, point2=?, point3=?, point4=?, image=? WHERE home_our_story_id=? `;
            await exe(sql, [d.title, d.description, d.point1, d.point2, d.point3, d.point4, filename, check[0].home_our_story_id]);
        } else {
            const sql = `INSERT INTO home_our_story (title,description,point1,point2,point3,point4,image) VALUES (?,?,?,?,?,?,?)`;
            await exe(sql, [d.title, d.description, d.point1, d.point2, d.point3, d.point4, filename]);
        }
        res.redirect("/admin/home/home_our_story");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/home/choose_us", async function (req, res) {
    var sql = "SELECT * FROM choose_us";
    var data = await exe(sql);
    var packet = { data };
    res.render("admin/home/choose_us.ejs", packet);
});

router.post("/home/save_choose_us", async function (req, res) {
    try {
        var d = req.body;
        var sql = "INSERT INTO choose_us (icon,title,description) VALUES (?,?,?)";
        var result = await exe(sql, [d.icon, d.title, d.description]);
        res.redirect("/admin/home/choose_us");
    } catch {
        console.log(err);
        res.status(500).send("Server Error");
    };
});

router.get("/home/edit_choose_us/:id", async function (req, res) {
    try {
        var id = req.params.id;
        var sql = "SELECT * FROM choose_us WHERE choose_us_id=?";
        var data = await exe(sql, [id]);
        var packet = { data };
        res.render("admin/home/edit_choose_us.ejs", packet);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    };
});

router.post("/home/update_choose_us/:id", async function (req, res) {
    try {
        var d = req.body;
        var sql = "UPDATE choose_us SET icon=?,title=?,description=? WHERE choose_us_id=?";
        var result = await exe(sql, [d.icon, d.title, d.description, req.params.id]);
        res.redirect("/admin/home/choose_us");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    };
});

router.get("/home/delete_choose_us/:id", async function (req, res) {
    try {
        var id = req.params.id;
        var sql = "DELETE FROM choose_us WHERE choose_us_id=?";
        var result = await exe(sql, [id]);
        res.redirect("/admin/home/choose_us");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    };
});

router.get("/about/slider", async function (req, res) {
    const data = await exe("SELECT * FROM about_header LIMIT 1");
    res.render("admin/about/about_slider.ejs", { about_header: data[0] || null });
})

router.post("/about-header/save", async function (req, res) {

    const d = req.body;
    let FileName = "";

    // Get old record if exists
    const oldRecord = await exe("SELECT * FROM about_header LIMIT 1");
    const fs = require("fs");

    if (req.files && req.files.image) {
        const image = req.files.image;
        FileName = Date.now() + "_" + image.name.replace(/\s/g, "_");
        await image.mv("public/upload/about/" + FileName);

        // Delete old image file if exists
        if (oldRecord.length > 0) {
            const oldImage = oldRecord[0].image;
            if (oldImage && fs.existsSync("public/upload/about/" + oldImage)) {
                fs.unlinkSync("public/upload/about/" + oldImage);
            }
        }
    } else if (oldRecord.length > 0) {
        FileName = oldRecord[0].image; // keep old image if new not uploaded
    }

    if (oldRecord.length > 0) {
        // Update existing record
        await exe(
            "UPDATE about_header SET title = ?, subtitle = ?, image = ? WHERE id = ?",
            [d.title, d.subtitle, FileName, oldRecord[0].id]
        );
    } else {
        // Insert new record
        await exe(
            "INSERT INTO about_header(title, subtitle, image) VALUES (?, ?, ?)",
            [d.title, d.subtitle, FileName]
        );
    }

    res.redirect("/admin/about/slider");



});

router.get("/about/our_story", async function (req, res) {
    const data1 = await exe("SELECT * FROM our_story LIMIT 1");
    res.render("admin/about/our_story.ejs", { story: data1[0] || null });
})

router.post("/our-story/save", async function (req, res) {

    const d = req.body;
    let FileName = "";
    const fs = require("fs");

    // get old record
    const oldRecord = await exe("SELECT * FROM our_story LIMIT 1");

    // ===== Image Upload =====
    if (req.files && req.files.image_url) {

        const image = req.files.image_url;
        FileName = Date.now() + "_" + image.name.replace(/\s/g, "_");
        await image.mv("public/upload/about/" + FileName);

        // delete old image
        if (oldRecord.length > 0) {
            const oldImage = oldRecord[0].image_url;
            if (oldImage && fs.existsSync("public/upload/about/" + oldImage)) {
                fs.unlinkSync("public/upload/about/" + oldImage);
            }
        }

    } else if (oldRecord.length > 0) {
        // keep old image
        FileName = oldRecord[0].image_url;
    }

    if (oldRecord.length > 0) {

        // ===== UPDATE =====
        await exe(
            `UPDATE our_story SET
                section_title = ?,
                image_url = ?,
                team_name = ?,
                team_members = ?,
                experience_years = ?,
                intro_text = ?,
                intro_desc = ?,
                total_events = ?,
                vendor_partners = ?,
                satisfaction_percentage = ?
             WHERE id = ?`,
            [
                d.section_title,
                FileName,
                d.team_name,
                d.team_members,
                d.experience_years,
                d.intro_text,
                d.intro_desc,
                d.total_events,
                d.vendor_partners,
                d.satisfaction_percentage,
                oldRecord[0].id
            ]
        );

    } else {

        // ===== INSERT =====
        await exe(
            `INSERT INTO our_story
            (
                section_title,
                image_url,
                team_name,
                team_members,
                experience_years,
                intro_text,
                intro_desc,
                total_events,
                vendor_partners,
                satisfaction_percentage
            )
            VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
                d.section_title,
                FileName,
                d.team_name,
                d.team_members,
                d.experience_years,
                d.intro_text,
                d.intro_desc,
                d.total_events,
                d.vendor_partners,
                d.satisfaction_percentage
            ]
        );
    }

    res.redirect("/admin/about/our_story");
});

router.get("/about/vision_mission", async function (req, res) {
    const vm = await exe(
        "SELECT * FROM vision_mission WHERE status = 1 ORDER BY FIELD(type,'mission','vision')"
    );

    res.render("admin/about/missio_vision.ejs", { vision_mission: vm });
});

router.get("/about/core-values", async function (req, res) {

    let value = await exe(
        "SELECT * FROM core_values ORDER BY id ASC LIMIT 3"
    );

    // if less than 3 records, push empty objects
    while (value.length < 3) {
        value.push({
            id: "",
            title: "",
            description: "",
            icon: "fa-heart"
        });
    }

    const icons = [
        'fa-heart',
        'fa-lightbulb',
        'fa-handshake',
        'fa-star',
        'fa-users',
        'fa-bullseye',
        'fa-award'
    ];

    res.render("admin/about/core_values.ejs", {
        value,
        icons
    });
});

router.post("/core-values/save", async function (req, res) {

    const d = req.body;

    // UPDATE (when id exists)
    if (d.id && d.id !== "") {

        await exe(
            `UPDATE core_values 
             SET title = ?, description = ?, icon = ?, status = ?
             WHERE id = ?`,
            [
                d.title,
                d.description,
                d.icon,
                d.status || 1,
                d.id
            ]
        );

    } else {

        // COUNT CHECK – only 3 values allowed
        const count = await exe(
            "SELECT COUNT(*) AS total FROM core_values"
        );

        if (count[0].total >= 3) {
            // silently block extra insert
            return res.redirect("/admin/about/core-values");
        }

        // INSERT
        await exe(
            `INSERT INTO core_values 
             (title, description, icon, status)
             VALUES (?,?,?,?)`,
            [
                d.title,
                d.description,
                d.icon,
                d.status || 1
            ]
        );
    }

    res.redirect("/admin/about/core-values");
});


router.get("/about/our_evolution", function (req, res) {
    res.render("admin/about/our_evolution.ejs")
})

router.post("/about/save_evolution", async (req, res) => {

    const { year, title, description, status } = req.body;

    // Insert into journey_timeline table
    const sql = `
            INSERT INTO journey_timeline (year, title, description, status)
            VALUES (?, ?, ?, ?)
        `;
    await exe(sql, [year, title, description, status]);

    // Redirect to list page after insert
    res.redirect("/admin/about/our_evolution-list");

});


router.get("/about/our_evolution-list", async function (req, res) {

    const timeline = await exe(
        "SELECT * FROM journey_timeline ORDER BY year ASC"
    );

    res.render("admin/about/our_evolution-list.ejs", {
        timeline
    });
});

router.get("/about/our_evolution/edit/:id", async (req, res) => {

    const id = req.params.id;
    const sql = "SELECT * FROM journey_timeline WHERE id = ?";
    const timeline = await exe(sql, [id]);

    if (!timeline || timeline.length === 0) {
        return res.status(404).send("Timeline not found");
    }

    res.render("admin/about/our_evolution-edit.ejs", {
        timeline: timeline[0]
    });
});

router.post("/update/our_evolution/update/:id", async (req, res) => {

    const id = req.params.id;
    const { year, title, description, status } = req.body;

    const sql = `
            UPDATE journey_timeline
            SET year = ?, title = ?, description = ?, status = ?
            WHERE id = ?
        `;
    await exe(sql, [year, title, description, status, id]);

    res.redirect("/admin/about/our_evolution-list");

});


// HARD DELETE journey timeline
router.get("/about/our_evolution/delete/:id", async (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM journey_timeline WHERE id = ?";
    await exe(sql, [id]);

    res.redirect("/admin/about/our_evolution-list");

});

router.get("/about/add_team", function (req, res) {
    res.render("admin/about/add_team.ejs")
})

router.post("/about/leadership-team/add", async function (req, res) {

    var d = req.body;
    var FileName = "";


    if (req.files && req.files.image) {
        FileName = Date.now() + "_" + req.files.image.name;
        await req.files.image.mv("public/upload/about/" + FileName);
    }

    var sql = `
        INSERT INTO leadership_team
        (name, designation, description, image, linkedin, twitter, status)
        VALUES
        (?,?,?,?,?,?,?)
    `;

    await exe(sql, [
        d.name,
        d.designation,
        d.description,
        FileName,
        d.linkedin,
        d.twitter,
        d.status
    ]);

    res.redirect("/admin/about/team_list");
});

router.get("/about/team_list", async (req, res) => {

    const leadership = await exe(
        "SELECT * FROM leadership_team ORDER BY id DESC"
    );

    res.render("admin/about/team_list.ejs", {
        leadership
    });
});


router.get("/about/team/edit/:id", async function (req, res) {

    const id = req.params.id;

    const data = await exe(
        "SELECT * FROM leadership_team WHERE id = ?",
        [id]
    );

    res.render("admin/about/team_edit.ejs", {
        team: data[0]
    });
});


router.post("/about/team/update/:id", async function (req, res) {

    const id = req.params.id;
    const d = req.body;
    let newFileName = "";

    // 1️⃣ Get old record
    const data = await exe(
        "SELECT image FROM leadership_team WHERE id = ?",
        [id]
    );
    const oldImage = data[0].image;

    // 2️⃣ New image upload
    if (req.files && req.files.image) {
        newFileName = Date.now() + "_" + req.files.image.name.replace(/\s/g, "_");

        const uploadPath = path.join(
            __dirname,
            "../public/upload/about/",
            newFileName
        );

        await req.files.image.mv(uploadPath);

        // delete old image
        if (oldImage) {
            const oldPath = path.join(
                __dirname,
                "../public/upload/about/",
                oldImage
            );
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

    } else {
        // ❗ image change नाही → old image ठेव
        newFileName = oldImage;
    }

    // 3️⃣ Update DB
    await exe(`
        UPDATE leadership_team SET
        name = ?,
        designation = ?,
        description = ?,
        image = ?,
        linkedin = ?,
        twitter = ?,
        status = ?
        WHERE id = ?
    `, [
        d.name,
        d.designation,
        d.description,
        newFileName,
        d.linkedin,
        d.twitter,
        d.status,
        id
    ]);

    res.redirect("/admin/about/team_list");
});

router.get("/about/team/delete/:id", async function (req, res) {

    const id = req.params.id;


    const data = await exe(
        "SELECT image FROM leadership_team WHERE id = ?",
        [id]
    );


    if (data.length > 0 && data[0].image) {
        const imagePath = path.join(
            __dirname,
            "../public/upload/about/",
            data[0].image
        );

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }


    await exe(
        "DELETE FROM leadership_team WHERE id = ?",
        [id]
    );


    res.redirect("/admin/about/team_list");
});


router.get("/service", async function (req, res) {
    var sql = "SELECT * FROM service";
    var data = await exe(sql);
    var packet = { data };
    res.render('admin/services/service.ejs', packet);
});

router.post("/service/add", async function (req, res) {
    try {
        const d = req.body;
        const sql = `INSERT INTO service (logo, title, short_quote, feature1, feature2, feature3, feature4, feature5, feature6, price, book_button) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        await exe(sql, [d.logo, d.title, d.short_quote, d.feature1, d.feature2, d.feature3, d.feature4, d.feature5, d.feature6, d.price, d.book_button]);
        res.redirect("/admin/service");
    } catch (err) {
        console.error("Error adding service:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/service/edit_service/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM service WHERE service_id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/services/edit_service.ejs', packet);
});

router.post("/service/update_service/:id", async function (req, res) {
    var d = req.body;
    var id = req.params.id;
    var sql = "UPDATE service SET logo = ?, title = ?, short_quote = ?, feature1 = ?, feature2 = ?, feature3 = ?, feature4 = ?, feature5 = ?, feature6 = ?, price = ?, book_button = ? WHERE service_id = ?";
    var result = await exe(sql, [d.logo, d.title, d.short_quote, d.feature1, d.feature2, d.feature3, d.feature4, d.feature5, d.feature6, d.price, d.book_button, id]);
    res.redirect("/admin/service");
});

router.get("/service/delete_service/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM service WHERE service_id = ?";
    var result = await exe(sql, [id]);
    res.redirect("/admin/service");
});

router.get("/service_slider", async function (req, res) {
    var sql = "SELECT * FROM service_slider";
    var data = await exe(sql);
    var packet = { data };
    res.render("admin/services/service_slider.ejs", packet);
});

router.get("/service/edit_service_slider/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM service_slider WHERE slider_id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/services/edit_service_slider.ejs', packet);
});

router.post("/services/update_service_slider/:id", async function (req, res) {
    try {
        const d = req.body;
        const id = req.params.id;
        let filename = d.old_image;
        if (req.files && req.files.image) {
            filename = Date.now() + "_" + req.files.image.name;
            await req.files.image.mv("public/upload/service/" + filename);
        }
        const sql = "UPDATE service_slider SET image = ?, title = ?, description = ? WHERE slider_id = ?";
        await exe(sql, [filename, d.title, d.description, id]);
        res.redirect("/admin/service_slider");
    } catch (err) {
        console.error("Error updating service slider:", err);
        res.status(500).send("Server Error");
    }
});

router.post("/service/save_service_slider", async function (req, res) {
    try {
        const d = req.body;
        let filename = "";
        if (req.files && req.files.image) {
            filename = Date.now() + "_" + req.files.image.name;
            await req.files.image.mv("public/upload/service/" + filename);
        }
        const sql = "INSERT INTO service_slider (image, title, description) VALUES (?,?,?)";
        await exe(sql, [filename, d.title, d.description]);
        res.redirect("/admin/service_slider");
    } catch (err) {
        console.error("Error saving service slider:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/service/delete_service_slider/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM service_slider WHERE slider_id = ?";
    var result = await exe(sql, [id]);
    res.redirect("/admin/service_slider");
});

router.get("/services/add_other_service", async function (req, res) {
    var sql = "SELECT * FROM other_service"
    var data = await exe(sql)
    var packet = { data };
    res.render('admin/services/add_other_service.ejs', packet);
});

router.post("/services/add_other_service", async function (req, res) {
    try {
        const d = req.body;
        const sql = ` INSERT INTO other_service (icon, title, short_quote) VALUES (?,?,?)`;
        await exe(sql, [d.icon, d.title, d.short_quote]);
        res.redirect("/admin/services/add_other_service");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post("/services/update_other_service/:id", async function (req, res) {
    try {
        const d = req.body;
        const id = req.params.id;
        const sql = "UPDATE other_service SET icon = ?, title = ?, short_quote = ? WHERE other_service_id = ?";
        await exe(sql, [d.icon, d.title, d.short_quote, id]);
        res.redirect("/admin/services/add_other_service");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get("/services/delete_other_service/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM other_service WHERE other_service_id = ?";
    var result = await exe(sql, [id]);
    res.redirect("/admin/services/add_other_service");
});

router.get("/services/edit_other_service/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "SELECT * FROM other_service WHERE other_service_id = ?";
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/services/edit_other_service.ejs', packet);
});

router.get("/services/how_work", async function (req, res) {
    var sql = "SELECT * FROM how_work";
    var data = await exe(sql);
    var packet = { data };
    res.render("admin/services/how_work.ejs", packet);
});

router.get("/services/edit_how_work/:id", async function (req, res) {
    var id = req.params.id;
    var d = req.body;
    var sql = "SELECT * FROM how_work WHERE how_work_id=?";
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render("admin/services/edit_how_work.ejs", packet);
});

router.post("/services/update_how_work/:id", async function (req, res) {
    var id = req.params.id;
    var d = req.body;
    var sql = "UPDATE how_work SET title=?, quote=? WHERE how_work_id=?";
    var result = await exe(sql, [d.title, d.quote, id]);
    res.redirect("/admin/services/how_work");
});

router.get("/services/delete_how_work/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM how_work WHERE how_work_id=?";
    var result = await exe(sql, [id]);
    res.redirect("/admin/services/how_work");
});

router.post("/services/how_work_save", async function (req, res) {
    var d = req.body;
    var sql = "INSERT INTO how_work (title, quote) VALUES (?,?)";
    var result = await exe(sql, [d.title, d.quote]);
    res.redirect("/admin/services/how_work");
});

router.get("/package", function (req, res) {
    res.render('admin/package.ejs');
});

router.get("/gallery", async function (req, res) {
    const data = await exe("SELECT * FROM gallery_header LIMIT 1");
    res.render("admin/gallery.ejs", { gallery_header: data[0] || null });
});

router.post("/gallery-header/save", async function (req, res) {
    const d = req.body;
    let FileName = "";
    const oldRecord = await exe("SELECT * FROM gallery_header LIMIT 1");
    const fs = require("fs");
    if (req.files && req.files.image) {
        const image = req.files.image;
        FileName = Date.now() + "_" + image.name.replace(/\s/g, "_");
        await image.mv("public/upload/gallery/" + FileName);
        if (oldRecord.length > 0) {
            const oldImage = oldRecord[0].image;
            if (oldImage && fs.existsSync("public/upload/gallery/" + oldImage)) {
                fs.unlinkSync("public/upload/gallery/" + oldImage);
            }
        }
    } else if (oldRecord.length > 0) {
        FileName = oldRecord[0].image;
    }
    if (oldRecord.length > 0) {
        await exe(
            "UPDATE gallery_header SET title = ?, subtitle = ?, image = ? WHERE id = ?",
            [d.title, d.subtitle, FileName, oldRecord[0].id]
        );
    } else {
        await exe(
            "INSERT INTO gallery_header(title, subtitle, image) VALUES (?, ?, ?)",
            [d.title, d.subtitle, FileName]
        );
    }
    res.redirect("/admin/gallery");

});

router.post("/gallery/save", async function (req, res) {
    var d = req.body;
    var FileName = "";
    if (req.files && req.files.gallery_img) {
        FileName = Date.now() + req.files.gallery_img.name;
        await req.files.gallery_img.mv("public/upload/gallery/" + FileName);
    }
    var sql = `INSERT INTO gallery (category, title, gallary_img, event_date) VALUES (?,?,?,?)`;
    await exe(sql, [d.category, d.title, FileName, d.event_date]);
    res.redirect("/admin/gallery_list");
});

router.get("/gallery_list", async function (req, res) {
    var sql = "SELECT * FROM gallery ORDER BY id DESC";
    var gallery = await exe(sql);
    res.render("admin/gallery_list.ejs", { gallery });
});

router.get("/gallery_delete/:id", async function (req, res) {
    const id = req.params.id;
    const data = await exe(`SELECT gallary_img FROM gallery WHERE id = '${id}'`);
    if (data.length > 0 && data[0].gallary_img) {
        const imagePath = path.join(
            __dirname,
            "../public/upload/gallery/",
            data[0].gallary_img
        );
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    await exe(`DELETE FROM gallery WHERE id = '${id}'`);
    res.redirect("/admin/gallery_list");
});


router.get("/gallery_edit/:id", async function (req, res) {
    id = req.params.id;
    data = await exe(`SELECT * FROM gallery WHERE id = '${id}'`);
    res.render("admin/gallery_edit.ejs", { gallery: data[0] });
});

router.post("/gallery_update/:id", async function (req, res) {
    const id = req.params.id;
    const d = req.body;
    let newFileName = "";
    const data = await exe(`SELECT * FROM gallery WHERE id = ?`, [id]);
    const oldImage = data[0].gallary_img;
    if (req.files && req.files.gallery_img) {
        newFileName = Date.now() + "_" + req.files.gallery_img.name.replace(/\s/g, "_");
        const uploadPath = path.join(__dirname, "../public/upload/gallery/", newFileName);
        await req.files.gallery_img.mv(uploadPath);
        if (oldImage) {
            const oldPath = path.join(__dirname, "../public/upload/gallery/", oldImage);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
    } else {
        newFileName = oldImage;
    }
    const sql = `UPDATE gallery SET category = ?, title = ?, gallary_img = ?, event_date = ? WHERE id = ?`;
    await exe(sql, [d.category, d.title, newFileName, d.event_date, id]);
    res.redirect("/admin/gallery_list");
});

router.get("/blog", async function (req, res) {
    var sql = "SELECT * FROM blog"
    var data = await exe(sql)
    var packet = { data };
    res.render('admin/blog/blog.ejs', packet);
});

router.post("/save_blog", async function (req, res) {
    try {
        var d = req.body;
        var filename = "";
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }
        var sql = "INSERT INTO blog (blog_image,blog_date,blog_title,blog_para,blog_message) VALUES (?,?,?,?,?)";
        var result = await exe(sql, [filename, d.blog_date, d.blog_title, d.blog_para, d.blog_message]);
        res.redirect("/admin/blog")
    } catch (err) {
        console.error("Error saving blog:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/blog/edit_blog/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM blog WHERE blog_id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/blog/edit_blog.ejs', packet);
});

router.post("/update_blog/:id", async function (req, res) {
    try {
        const d = req.body;
        const id = req.params.id;
        let filename = d.old_blog_image;
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }
        const sql = `UPDATE blog SET blog_image = ?, blog_date = ?, blog_title = ?, blog_para = ?, blog_message = ? WHERE blog_id = ? `;
        await exe(sql, [filename, d.blog_date, d.blog_title, d.blog_para, d.blog_message, id]);
        res.redirect("/admin/blog");
    } catch (err) {
        console.error("Error updating blog:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/blog/delete_blog/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM blog WHERE blog_id = ?";
    var result = await exe(sql, [id]);
    res.redirect("/admin/blog");
});


router.get("/blog_slider", async function (req, res) {
    var sql = "SELECT * FROM blog_slider";
    var data = await exe(sql);
    var packet = { data };
    res.render('admin/blog/blog_slider.ejs', packet);
});

router.post("/blog_slider_save", async function (req, res) {
    try {
        var d = req.body;
        var filename = "";
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }
        var sql = `INSERT INTO blog_slider (blog_image, blog_title, blog_description) VALUES (?,?,?)`;
        await exe(sql, [filename, d.blog_title, d.blog_description]);
        res.redirect("/admin/blog_slider");
    } catch (err) {
        console.error("Error saving blog slider:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/blog/blog_slider_edit/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM blog_slider WHERE id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/blog/blog_slider_edit.ejs', packet);
});

router.post("/update_blog_slider/:id", async function (req, res) {
    try {
        var d = req.body;
        var id = req.params.id;
        var filename = d.old_blog_image;
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }
        var sql = ` UPDATE blog_slider SET blog_image = ?, blog_title = ?, blog_description = ? WHERE id = ? `;
        await exe(sql, [filename, d.blog_title, d.blog_description, id]);
        res.redirect("/admin/blog_slider");
    } catch (err) {
        console.error("Error updating blog slider:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/blog_slider_status/:id", async function (req, res) {
    var id = req.params.id;
    var sql = "DELETE FROM blog_slider  WHERE id=?";
    var result = await exe(sql, [id]);
    res.redirect("/admin/blog_slider");
})

router.get("/booking", function (req, res) {
    res.render('admin/booking.ejs');
});

router.get("/testimonials-header", async function (req, res) {
    const data = await exe("SELECT * FROM testimonials_header LIMIT 1");
    res.render("admin/testimonials_header.ejs", {
        header: data[0] || null
    });
});

router.post("/testimonials-header/save", async function (req, res) {
    const d = req.body;
    let FileName = "";
    const old = await exe("SELECT * FROM testimonials_header LIMIT 1");
    const fs = require("fs");
    if (req.files && req.files.image) {
        const image = req.files.image;
        FileName = Date.now() + "_" + image.name.replace(/\s/g, "_");
        await image.mv("public/upload/testimonials/" + FileName);
        if (old.length && old[0].image) {
            const oldPath = "public/upload/testimonials/" + old[0].image;
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
    } else if (old.length) {
        FileName = old[0].image;
    }
    if (old.length) {
        await exe("UPDATE testimonials_header SET title=?, subtitle=?, image=? WHERE id=?", [d.title, d.subtitle, FileName, old[0].id]);
    } else {
        await exe("INSERT INTO testimonials_header (title, subtitle, image) VALUES (?,?,?)", [d.title, d.subtitle, FileName]
        );
    }
    res.redirect("/admin/testimonials-header");
});

router.post("/add", async (req, res) => {
    try {
        const { name, event_type, rating, message } = req.body;
        let imageName = "";
        const fs = require("fs");
        if (req.files && req.files.img) {
            const file = req.files.img;
            imageName = Date.now() + "_" + file.name.replace(/\s/g, "_");
            await file.mv("public/upload/testimonials/" + imageName);
        }
        const sql = `INSERT INTO testimonials (name, event_type, rating, message, image) VALUES (?, ?, ?, ?, ?)`;
        await exe(sql, [name, event_type, rating, message, imageName]);
        res.redirect("/admin/testimonials");
    } catch (err) {
        console.log(err);
        res.send("Error while submitting testimonial");
    }
});

router.get("/testimonials", async (req, res) => {
    const sql = `
  SELECT * FROM testimonials
  ORDER BY rating DESC, id DESC
`;
    ;
    const data = await exe(sql);
    res.render("admin/testimonials.ejs", { data });
});

router.post("/testimonial-update/:id", async (req, res) => {
    const { name, event_type, rating, message } = req.body;
    const id = req.params.id;
    const old = await exe("SELECT image FROM testimonials WHERE id=?", [id]);
    let imageName = old[0].image;
    const fs = require("fs");
    if (req.files && req.files.img) {
        const file = req.files.img;
        imageName = Date.now() + "_" + file.name.replace(/\s/g, "_");
        await file.mv("public/upload/testimonials/" + imageName);
        if (old[0].image) {
            const oldPath = "public/upload/testimonials/" + old[0].image;
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
    }
    const sql = ` UPDATE testimonials SET name=?, event_type=?, rating=?, message=?, image=? WHERE id=?`;
    await exe(sql, [name, event_type, rating, message, imageName, id]);
    res.redirect("/admin/testimonials");
});

router.get("/testimonial-edit/:id", async (req, res) => {
    const id = req.params.id;
    const result = await exe("SELECT * FROM testimonials WHERE id = ?", [id]);
    res.render("admin/testimonial_edit.ejs", {
        data: result[0]
    });
});

router.get("/testimonial-delete/:id", async (req, res) => {
    await exe("DELETE FROM testimonials WHERE id=?", [req.params.id]);
    res.redirect("/admin/testimonials");
});

router.get("/contact", function (req, res) {
    var sql = `select * from contact_info`;
    var sql1 = `select * from contact_header`;
    exe(sql).then(contacts => {
        exe(sql1).then(header => {
            res.render('admin/contact.ejs', { contacts, header });
        });
    });
});

router.get("/delete_contact/:id", async (req, res) => {
    await exe("DELETE FROM contact_header WHERE id=?", [req.params.id]);
    res.redirect("/admin/contact");
});

router.get("/faq", function (req, res) {
    res.render('admin/faq.ejs');
});


router.get("/policy", async function (req, res) {
    var sql = `SELECT * FROM privacy_policy`;
    var policies = await exe(sql);
    res.render('admin/policy.ejs', { policies });
});
router.get("/faq", function (req, res) {
    res.render('admin/faq.ejs');
});

router.get("/condition", async function (req, res) {
    var sql = `SELECT * FROM terms_conditions`;
    var terms = await exe(sql);
    var packet = { terms };
    res.render('admin/condition.ejs', packet);
});

router.post("/terms/add", async function (req, res) {
    try {
        var d = req.body;
        var sql = ` INSERT INTO terms_conditions (term_title, term_content) VALUES (?,?) `;
        var result = await exe(sql, [d.term_title, d.term_content]);
        res.redirect("/admin/condition");
    } catch (err) {
        console.error("Error adding terms:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/terms/edit/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM terms_conditions WHERE id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/edit_terms.ejs', packet);
});

router.post("/terms/update/:id", async function (req, res) {
    try {
        var d = req.body;
        var id = req.params.id;
        var sql = `UPDATE terms_conditions SET term_title=?, term_content=? WHERE id=?`;
        var result = await exe(sql, [d.term_title, d.term_content, id]);
        res.redirect("/admin/condition");
    } catch (err) {
        console.error("Error updating terms:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/terms/delete/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `DELETE FROM terms_conditions WHERE id = ?`;
    var result = await exe(sql, [id]);
    res.redirect("/admin/condition");
});


router.get("/policy", async function (req, res) {
    var sql = "SELECT * FROM privacy_policy";
    var result = await exe(sql);
    var packet = { policies: result };
    res.render("admin/policy.ejs", packet);
});
router.post("/save_policy", async function (req, res) {

    var d = req.body;
    var privacy_image = "";

    if (req.files && req.files.privacy_image) {
        var file = req.files.privacy_image;
        privacy_image = Date.now() + "_" + file.name;
        await file.mv("public/upload/policy/" + privacy_image);
    }

    var today = new Date().toISOString().split("T")[0];

    await exe(
        `INSERT INTO privacy_policy
        (privacy_title, privacy_image, privacy_icon, privacy_content, privacy_last_updated)
        VALUES (?,?,?,?,?)`,
        [
            d.privacy_title,
            privacy_image,
            d.privacy_icon,
            d.privacy_content,
            today
        ]
    );

    res.redirect("/admin/policy");
});

router.get("/edit_policy/:id", async function (req, res) {
    const id = req.params.id;
    const policy = await exe(
        "SELECT * FROM privacy_policy WHERE privacy_id = ?",
        [id]
    );
    res.render("admin/edit_policy", { policy: policy[0] });
});

router.post("/update_policy/:id", async function (req, res) {
    const id = req.params.id;
    const d = req.body;
    let privacy_image = d.old_image;
    if (req.files && req.files.privacy_image) {
        const file = req.files.privacy_image;
        privacy_image = Date.now() + "_" + file.name;
        await file.mv("public/upload/policy/" + privacy_image);
    }
    const today = new Date().toISOString().split("T")[0];
    await exe(
        `UPDATE privacy_policy SET
            privacy_title = ?,
            privacy_image = ?,
            privacy_icon = ?,   
            privacy_content = ?,
            privacy_last_updated = ?
         WHERE privacy_id = ?`,
        [
            d.privacy_title,
            privacy_image,
            d.privacy_icon,
            d.privacy_content,
            today,
            id
        ]
    );
    res.redirect("/admin/policy");
});






router.get("/reports", async function (req, res) {
    var sql = "SELECT * FROM privacy_policy_report";
    var result = await exe(sql);
    var packet = { reports: result };
    res.render('admin/reports.ejs', packet);
});



router.post("/save_report", async (req, res) => {
    const { section_no, section_title, section_content } = req.body;

    await exe(
        "INSERT INTO privacy_policy_report (section_no, section_title, section_content) VALUES (?, ?, ?)",
        [section_no, section_title, section_content]
    );

    res.redirect("/admin/reports");
});



router.get("/edit_report/:policy_id", async (req, res) => {
    const report = await exe(
        "SELECT * FROM privacy_policy_report WHERE policy_id = ?",
        [req.params.policy_id]
    );

    res.render("admin/edit_report.ejs", { report: report[0] });
});

router.post("/update_report/:policy_id", async (req, res) => {
    const { section_no, section_title, section_content } = req.body;

    await exe(
        "UPDATE privacy_policy_report SET section_no=?, section_title=?, section_content=? WHERE policy_id=?",
        [section_no, section_title, section_content, req.params.policy_id]
    );

    res.redirect("/admin/reports");
});


router.get("/delete_report/:policy_id", async (req, res) => {
    await exe(
        "DELETE FROM privacy_policy_report WHERE policy_id = ?",
        [req.params.policy_id]
    );

    res.redirect("/admin/reports");
});


router.get("/privacy-logs", async function (req, res) {
    var sql = "SELECT * FROM contact_us";
    var result = await exe(sql);
    var packet = { logs: result };
    res.render('admin/privacy-logs.ejs', packet);
});

router.post("/save_logs", async function (req, res) {
    var d = req.body;
    await exe(
        "INSERT INTO contact_us(contact_phone, contact_email, contact_address, contact_availability, contact_response_time) VALUES(?,?,?,?,?)",
        [d.contact_phone, d.contact_email, d.contact_address, d.contact_availability, d.contact_response_time]
    );
    res.redirect("/admin/privacy-logs");
});

router.get("/edit-contact/:id", async function (req, res) {
    const id = req.params.id;
    const sql = "SELECT * FROM contact_us WHERE contact_id=?";
    const result = await exe(sql, [id]);

    res.render("admin/edit-contact_us.ejs", { contact: result[0] });
});

router.post("/update-contact/:id", async function (req, res) {
    const id = req.params.id;
    const d = req.body;

    await exe(
        `UPDATE contact_us SET 
        contact_phone=?,
        contact_email=?,
        contact_address=?,
        contact_availability=?,
        contact_response_time=?
        WHERE contact_id=?`,
        [
            d.contact_phone,
            d.contact_email,
            d.contact_address,
            d.contact_availability,
            d.contact_response_time,
            id
        ]
    );

    res.redirect("/admin/privacy-logs");
});

router.get("/delete-contact/:id", async function (req, res) {
    const id = req.params.id;
    await exe("DELETE FROM contact_us WHERE contact_id=?", [id]);
    res.redirect("/admin/privacy-logs");
});


router.get("/contact", async function (req, res) {
    var result = await exe("SELECT * FROM contact_header");
    res.render('admin/contact.ejs', { contacts: result });
});

router.post("/save_contact", async function (req, res) {
    var d = req.body;
    var contact_filename = "";

    if (req.files && req.files.contact_filename) {
        var file = req.files.contact_filename;
        contact_filename = Date.now() + "_" + file.name;
        await file.mv("public/upload/contact/" + contact_filename);
    }

    await exe(
        "INSERT INTO contact_header(title, subtitle, image) VALUES(?,?,?)",
        [d.title, d.subtitle, contact_filename]
    );

    res.redirect("/admin/contact");
});


router.get("/edit_contact/:id", async function (req, res) {
    const id = req.params.id;

    const contact = await exe(
        "SELECT * FROM contact_header WHERE id = ?",
        [id]
    );

    res.render("admin/edit_contact", {
        contact: contact[0]
    });
});


// ===== UPDATE CONTACT HEADER =====
router.post("/update_contact/:id", async function (req, res) {
    const id = req.params.id;
    const d = req.body;

    let image = d.old_image;

    if (req.files && req.files.contact_filename) {
        const file = req.files.contact_filename;
        image = Date.now() + "_" + file.name;
        await file.mv("public/upload/contact/" + image);
    }

    await exe(
        "UPDATE contact_header SET title=?, subtitle=?, image=? WHERE id=?",
        [d.title, d.subtitle, image, id]
    );
    res.redirect("/admin/contact");
});
router.get("/contact-info", async (req, res) => {
    const contacts = await exe("SELECT * FROM contact_info");
    res.render("admin/contact-info", { contacts });
});

router.post("/save_contact_info", async (req, res) => {
    console.log("save_contact_info route hit");

    const { address, phone, email, whatsapp, map_url } = req.body;

    await exe(
        "INSERT INTO contact_info (address, phone, email, whatsapp, map_url) VALUES (?, ?, ?, ?, ?)",
        [address, phone, email, whatsapp, map_url]
    );

    res.redirect("/admin/contact-info");
});

router.get("/edit-contact-info/:id", async (req, res) => {
    try {
        var id = req.params.id;

        var sql = "SELECT * FROM contact_info WHERE id = ?";
        var result = await exe(sql, [id]);

        if (result.length === 0) {
            return res.redirect("/admin/contact-info");
        }

        res.render("admin/edit-contact-info", {
            contact: result[0]
        });

    } catch (err) {
        console.log(err);
    }
});

router.post("/update_contact_info/:id", async (req, res) => {
    try {
        var id = req.params.id;
        var { address, phone, email, whatsapp, map_url } = req.body;
        var sql = "UPDATE contact_info SET address=?, phone=?, email=?, whatsapp=?, map_url=? WHERE id=?";
        await exe(sql, [address, phone, email, whatsapp, map_url, id]);
        res.redirect("/admin/contact-info");
    } catch (err) {
        console.log(err);
    }
});

// SHOW CONTACT FORM ENQUIRIES
router.get("/contact-form", async (req, res) => {
    try {
        const forms = await exe(
            "SELECT * FROM contact_form ORDER BY created_at DESC"
        );

        res.render("admin/contact_form", { forms });
    } catch (err) {
        console.log(err);
        res.send("Error loading contact enquiries");
    }
});

router.get("/edit_contact_form/:id", async (req, res) => {
    const id = req.params.id;

    const enquiry = await exe(
        "SELECT * FROM contact_form WHERE id = ?",
        [id]
    );

    if (enquiry.length === 0) {
        return res.send("Enquiry not found");
    }

    res.render("admin/edit_contact_form", {
        enquiry: enquiry[0]
    });
});


router.post("/edit_contact_form/:id", async (req, res) => {
    const id = req.params.id;

    const {
        full_name,
        email,
        phone,
        event_type,
        subject,
        message
    } = req.body;

    await exe(
        "UPDATE contact_form SET full_name=?, email=?, phone=?, event_type=?, subject=?, message=? WHERE id=?",
        [full_name, email, phone, event_type, subject, message, id]
    );

    res.redirect("/admin/contact-form");
});


router.get("/delete_contact_form/:id", async (req, res) => {
    const id = req.params.id;
    await exe("DELETE FROM contact_form WHERE id = ?", [id]);
    res.redirect("/admin/contact-form");
});



router.get("/header_packages", async function (req, res) {
    try {
        var sql = `SELECT * FROM header_packages ORDER BY created_at DESC`;
        const header = await exe(sql);

        res.render('admin/packages/header.ejs', {
            header: header || [],
            title: 'Header Packages',
            success: req.query.success || "",
            error: req.query.error || ""
        });
    } catch (error) {
        console.error("Error fetching header packages:", error);
        res.render('admin/packages/header.ejs', {
            header: [],
            title: 'Header Packages - Error',
            success: "",
            error: 'Failed to load header packages: ' + error.message
        });
    }
});

router.post("/save_header_package", async function (req, res) {
    try {
        var d = req.body;
        var filename = "";

        if (req.files && req.files.bg_image) {
            filename = Date.now() + "_" + req.files.bg_image.name;
            await req.files.bg_image.mv("public/upload/packages/" + filename);
        }

        var sql = `
            INSERT INTO  header_packages (bg_image, title,description)
            VALUES (?,?,?)
        `;

        await exe(sql, [
            filename,
            d.title,
            d.description
        ]);


        res.redirect("/admin/header_packages")
    } catch (err) {
        console.error("Error saving blog slider:", err);
        res.status(500).send("Server Error");
    }
});


router.get("/delete_header_package/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `DELETE FROM header_packages WHERE id = ?`;
        result = await exe(sql, [id]);

        if (result > 0) {
            res.redirect("/admin/header_packages")
        } else {
            res.status(404).json({
                success: false,
                message: "Header package not found"
            });
        }
    } catch (error) {
        console.error("Error deleting header package:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting header package"
        });
    }
});

router.get("/edit_header/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `SELECT * FROM header_packages WHERE id = ?`;
        const result = await exe(sql, [id]);

        if (result && result.length > 0) {
            res.render('admin/packages/edit_header.ejs', {
                headerPackage: result[0],
                title: 'Edit Header Package'
            });
        } else {
            res.redirect('/admin/header_packages?error=Header package not found');
        }
    } catch (error) {
        console.error("Error fetching header package for edit:", error);
        res.redirect('/admin/header_packages?error=Failed to load header package');
    }
});



router.post("/update_header_package/:id", async function (req, res) {
    try {
        const d = req.body;
        const id = req.params.id;
        let filename = d.old_bg_image;

        // if new image uploaded
        if (req.files && req.files.bg_image) {
            filename = Date.now() + "_" + req.files.bg_image;
            await req.files.bg_image.mv("public/upload/packages/" + filename);
        }

        const sql = `
            UPDATE header_packages
            SET 
                bg_image = ?,
                title = ?,
                description = ?
            WHERE id = ?
        `;

        await exe(sql, [
            filename,
            d.title,
            d.description,
            id
        ]);

        res.redirect("/admin/header_packages");

    } catch (err) {
        console.error("Error updating header:", err);
        res.status(500).send("Server Error");
    }
});

router.get("/add_packages", async function (req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || "";
        const type = req.query.type || "";
        const minPrice = req.query.minPrice || "";
        const maxPrice = req.query.maxPrice || "";

        let where = "WHERE 1=1";
        let params = [];

        if (search) {
            where += " AND package_name LIKE ?";
            params.push(`%${search}%`);
        }

        if (type) {
            where += " AND type = ?";
            params.push(type);
        }

        if (minPrice) {
            where += " AND start_price >= ?";
            params.push(minPrice);
        }

        if (maxPrice) {
            where += " AND start_price <= ?";
            params.push(maxPrice);
        }

        // count
        const countSql = `SELECT COUNT(*) as total FROM packages ${where}`;
        const countResult = await exe(countSql, params);
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // data
        const sql = `
            SELECT 
                id,
                type,
                package_name,
                bg_image,
                start_price,
                max_guests,
                description,
                feature_included,
                support,
                service,
                created_at
            FROM packages
            ${where}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        let packages = await exe(sql, params);

        packages = packages.map(p => {
            return {
                ...p,
                feature_included: p.feature_included ? JSON.parse(p.feature_included) : [],
                support: p.support ? JSON.parse(p.support) : [],
                formatted_price: "₹" + Number(p.start_price).toFixed(2),
                formatted_date: new Date(p.created_at).toLocaleDateString()
            };
        });

        res.render("admin/packages/add_packages.ejs", {
            packages,
            packageTypes: ["Basic", "Standard", "Premium", "VIP", "Custom"],
            query: req.query,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page - 1,
                nextPage: page + 1
            },
            success: req.query.success || null,
            error: req.query.error || null
        });

    } catch (err) {
        console.error(err);
        res.redirect("/admin/add_packages?error=Failed to load packages");
    }
});



router.post("/save_packages", async function (req, res) {
    try {
        var d = req.body;
        var filename = "";

        // Handle file upload
        if (req.files && req.files.bg_image) {
            var file = req.files.bg_image;
            var fileExt = file.name.split('.').pop();
            filename = Date.now() + "_" + Math.random().toString(36).substring(7) + "." + fileExt;

            // Create directory if it doesn't exist
            var uploadDir = "public/upload/packages/";
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await file.mv(uploadDir + filename);
        }

        // Process support checkboxes
        var supportArray = d.support || [];
        if (!Array.isArray(supportArray)) {
            supportArray = [supportArray];
        }

        // Process features
        var featuresArray = [];
        if (d.feature_included) {
            try {
                featuresArray = typeof d.feature_included === 'string'
                    ? JSON.parse(d.feature_included)
                    : d.feature_included;
            } catch (error) {
                featuresArray = [];
            }
        }

        var sql = `
            INSERT INTO packages (
                type, 
                package_name, 
                bg_image, 
                start_price, 
                max_guests, 
                description, 
                feature_included, 
                support, 
                service,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await exe(sql, [
            d.type,
            d.package_name,
            filename || null,
            parseFloat(d.start_price) || 0,
            parseInt(d.max_guests) || 1,
            d.description,
            JSON.stringify(featuresArray),
            JSON.stringify(supportArray),
            d.service
        ]);

        res.redirect("/admin/add_packages");
    } catch (err) {
        console.error("Error saving package:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});


router.get("/edit_package/:id", async function (req, res) {
    try {
        const packageId = req.params.id;

        // Fetch package data
        const sql = "SELECT * FROM packages WHERE id = ?";
        const result = await exe(sql, [packageId]);

        if (result.length === 0) {
            return res.status(404).send("Package not found");
        }

        let package = result[0];

        // DEBUG: Log what we get from database
        console.log("Database result:", package);

        // Parse feature_included
        if (package.feature_included) {
            try {
                // If it's a string, parse it as JSON
                if (typeof package.feature_included === 'string') {
                    package.feature_included = JSON.parse(package.feature_included);
                }
                // If it's already an array, keep it
                else if (Array.isArray(package.feature_included)) {
                    // Already an array, do nothing
                }
                // If it's null or undefined, set to empty array
                else {
                    package.feature_included = [];
                }
            } catch (error) {
                console.error("Error parsing feature_included:", error);
                package.feature_included = [];
            }
        } else {
            package.feature_included = [];
        }

        // Parse support
        if (package.support) {
            try {
                if (typeof package.support === 'string') {
                    package.support = JSON.parse(package.support);
                }
            } catch (error) {
                console.error("Error parsing support:", error);
                package.support = [];
            }
        } else {
            package.support = [];
        }

        // DEBUG: Log parsed data
        console.log("Parsed feature_included:", package.feature_included);
        console.log("Type of feature_included:", typeof package.feature_included);

        // Render the edit page
        res.render("admin/packages/edit_package.ejs", {
            package: package,
            title: "Edit Package"
        });

    } catch (err) {
        console.error("Error in edit_packages route:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});

router.post("/update_packages/:id", async function (req, res) {
    try {
        var packageId = req.params.id;
        var d = req.body;

        // Validate package ID
        if (!packageId || isNaN(packageId)) {
            return res.status(400).send("Invalid package ID");
        }

        // Fetch existing package data
        var getSql = "SELECT * FROM packages WHERE id = ?";
        var existingPackage = await exe(getSql, [packageId]);

        if (existingPackage.length === 0) {
            return res.status(404).send("Package not found");
        }

        var currentData = existingPackage[0];
        var filename = currentData.bg_image;

        // Handle file upload
        if (req.files && req.files.bg_image) {
            var file = req.files.bg_image;

            // Validate file type (optional)
            var allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            var fileExt = file.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(fileExt)) {
                return res.status(400).send("Invalid file type. Allowed: " + allowedExtensions.join(', '));
            }

            // Generate unique filename
            filename = Date.now() + "_" + Math.random().toString(36).substring(7) + "." + fileExt;

            // Create directory if it doesn't exist
            var uploadDir = "public/upload/packages/";
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Delete old image if it exists and is not default
            if (currentData.bg_image && currentData.bg_image !== 'default.jpg') {
                var oldImagePath = uploadDir + currentData.bg_image;
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            await file.mv(uploadDir + filename);
        }

        // Process support checkboxes
        var supportArray = [];
        if (d.support) {
            supportArray = Array.isArray(d.support) ? d.support : [d.support];
        }

        // Process features
        var featuresArray = [];
        if (d.feature_included) {
            try {
                featuresArray = typeof d.feature_included === 'string'
                    ? JSON.parse(d.feature_included)
                    : d.feature_included;
            } catch (error) {
                console.error("Error parsing features:", error);
                featuresArray = [];
            }
        }

        // Update query with all fields
        var sql = `
            UPDATE packages SET 
                type = ?, 
                package_name = ?, 
                bg_image = ?, 
                start_price = ?, 
                max_guests = ?, 
                description = ?, 
                feature_included = ?, 
                support = ?, 
                service = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        var result = await exe(sql, [
            d.type || currentData.type,
            d.package_name || currentData.package_name,
            filename,
            parseFloat(d.start_price) || currentData.start_price || 0,
            parseInt(d.max_guests) || currentData.max_guests || 1,
            d.description || currentData.description,
            JSON.stringify(featuresArray),
            JSON.stringify(supportArray),
            d.service || currentData.service,
            packageId
        ]);

        // Check if update was successful
        if (result.affectedRows === 0) {
            return res.status(404).send("Package not found or no changes made");
        }

        // Redirect based on your application flow
        res.redirect("/admin/add_packages"); // Or show success message
    } catch (err) {
        console.error("Error updating package:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});


router.get("/delete_package/:id", async function (req, res) {
    try {
        var id = req.params.id;
        var checkSql = "SELECT bg_image FROM packages WHERE id = ?";
        var existing = await exe(checkSql, [id]);

        if (existing.length > 0 && existing[0].bg_image) {
            // Delete image file
            var imagePath = "public/upload/packages/" + existing[0].bg_image;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete from database
        var deleteSql = "DELETE FROM packages WHERE id = ?";
        await exe(deleteSql, [id]);

        res.redirect("/admin/add_packages");
    } catch (err) {
        console.error("Error deleting package:", err);
        res.status(500).send("Server Error");
    }
});


router.get("/add_features", async function (req, res) {
    try {
        const sql = `SELECT * FROM features ORDER BY id DESC`;
        const features = await exe(sql);

        res.render("admin/packages/features.ejs", {
            features: features || [],
            title: "Features",
            success: req.query.success || "",
            error: req.query.error || ""
        });

    } catch (error) {
        console.error("Error fetching features:", error);

        res.render("admin/packages/features.ejs", {
            features: [],
            title: "Features - Error",
            success: "",
            error: "Failed to load features: " + error.message
        });
    }
});

router.post("/save_feature", async (req, res) => {
    let { feature, basic, premium, luxury } = req.body;

    basic = basic || 0;
    premium = premium || 0;
    luxury = luxury || 0;

    await exe(
        `INSERT INTO features (feature, basic, premium, luxury) VALUES (?, ?, ?, ?)`,
        [feature, basic, premium, luxury]
    );

    res.redirect("/admin/add_features");
});

router.get("/delete_feature/:id", async function (req, res) {
    try {
        const { id } = req.params;

        await exe(
            "DELETE FROM features WHERE id = ?",
            [id]
        );

        res.redirect("/admin/add_features");
    } catch (err) {
        console.log(err);
        res.send("error");
    }
});

router.get("/edit_feature/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `SELECT * FROM features WHERE id = ?`;
        const result = await exe(sql, [id]);

        if (result && result.length > 0) {
            res.render('admin/packages/edit_features.ejs', {
                feature: result[0],
                title: 'Edit Header Package'
            });
        } else {
            res.redirect('/admin/features_packages?error=Header package not found');
        }
    } catch (error) {
        console.error("Error fetching header package for edit:", error);
        res.redirect('/admin/header_packages?error=Failed to load header package');
    }
});

router.post("/update_features_package/:id", async function (req, res) {
    const { id } = req.params;
    const { feature, basic, premium, luxury } = req.body;

    console.log("ID:", id);
    console.log("BODY:", req.body);

    try {
        await exe(
            `UPDATE features 
             SET feature = ?, basic = ?, premium = ?, luxury = ?
             WHERE id = ?`,
            [feature, basic, premium, luxury, id]
        );

        res.redirect("/admin/add_features");
    } catch (err) {
        console.log("UPDATE ERROR 👉", err);
        res.redirect(`/admin/edit_features/${id}?error=Update failed`);
    }
});


router.get("/header_faq", async function (req, res) {
    try {
        var sql = `SELECT * FROM header_faq ORDER BY created_at DESC`;
        const faq = await exe(sql);

        res.render('admin/faq/add_header_faq.ejs', {
            headers: faq || [],
            title: 'Header Packages',
            success: req.query.success || "",
            error: req.query.error || ""
        });
    } catch (error) {
        console.error("Error fetching header faq:", error);
        res.render('admin/packages/add_header.ejs', {
            faq: [],
            title: 'Header faq - Error',
            success: "",
            error: 'Failed to load header faq : ' + error.message
        });
    }
});

router.post("/save_faq_header", async function (req, res) {
    try {
        var d = req.body;
        var filename = "";

        if (req.files && req.files.bg_image) {
            filename = Date.now() + "_" + req.files.bg_image.name;
            await req.files.bg_image.mv("public/upload/faq/" + filename);
        }

        var sql = `
            INSERT INTO  header_faq (bg_image, title,description)
            VALUES (?,?,?)
        `;

        await exe(sql, [
            filename,
            d.title,
            d.description
        ]);
        res.redirect("/admin/header_faq")
    } catch (err) {
        console.error("Error saving faq header:", err);
        res.status(500).send("Server Error");
    }
});


router.get("/delete_header_faq/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `DELETE FROM  header_faq WHERE id = ?`;
        result = await exe(sql, [id]);
        if (result.affectedRows > 0) {
            res.redirect("/admin/header_faq")
        } else {
            res.status(404).json({
                success: false,
                message: "Header faq not found"
            });
        }
    } catch (error) {
        console.error("Error deleting header faq:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting header faq"
        });
    }
});


router.get("/edit_faq_header/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `SELECT * FROM header_faq WHERE id = ?`;
        const result = await exe(sql, [id]);

        if (result && result.length > 0) {
            res.render('admin/faq/edit_header_faq.ejs', {
                headerPackage: result[0],
                title: 'Edit Header faq'
            });
        } else {
            res.redirect('/admin/header_faq?error=Header package not found');
        }
    } catch (error) {
        console.error("Error fetching header package for edit:", error);
        res.redirect('/admin/header_packages?error=Failed to load header package');
    }
});

router.post("/update_header_faq/:id", async function (req, res) {
    try {
        const d = req.body;
        const id = req.params.id;
        let filename = d.old_bg_image;

        // if new image uploaded
        if (req.files && req.files.bg_image) {
            filename = Date.now() + "_" + req.files.bg_image;
            await req.files.bg_image.mv("public/upload/faq/" + filename);
        }

        const sql = `
            UPDATE header_faq
            SET 
                bg_image = ?,
                title = ?,
                description = ?
            WHERE id = ?
        `;

        await exe(sql, [
            filename,
            d.title,
            d.description,
            id
        ]);

        res.redirect("/admin/header_faq");

    } catch (err) {
        console.error("Error updating header:", err);
        res.status(500).send("Server Error");
    }
});


router.get("/add_faq", async function (req, res) {
    try {
        var sql = `SELECT * FROM faqs ORDER BY created_at DESC`;
        const faqs = await exe(sql);

        res.render('admin/faq/add_faq.ejs', {
            faqs: faqs || [],
            title: 'Header Packages',
            success: req.query.success || "",
            error: req.query.error || ""
        });
    } catch (error) {
        console.error("Error fetching  faq:", error);
        res.render('admin/faq/add_faq.ejs', {
            faqs: [],
            title: 'Header faq - Error',
            success: "",
            error: 'Failed to load  faq : ' + error.message
        });
    }
});


router.post("/save_faq", async function (req, res) {
    try {
        var d = req.body;
        var sql = `
            INSERT INTO faqs (question,answer)
            VALUES (?,?)
        `;

        await exe(sql, [
            d.answer,
            d.question
        ]);
        res.redirect("/admin/add_faq")
    } catch (err) {
        console.error("Error saving faq header:", err);
        res.status(500).send("Server Error");
    }
});


router.get("/delete_faq/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `DELETE FROM faqs WHERE id = ?`;
        const result = await exe(sql, [id]);

        if (result.affectedRows > 0) {
            res.redirect("/admin/add_faq");
        } else {
            res.status(404).json({
                success: false,
                message: "FAQ not found"
            });
        }
    } catch (error) {
        console.error("Error deleting faq:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting faq"
        });
    }
});


router.get("/edit_faq/:id", async function (req, res) {
    try {
        const { id } = req.params;
        var sql = `SELECT * FROM faqs WHERE id = ?`;
        const result = await exe(sql, [id]);

        if (result && result.length > 0) {
            res.render('admin/faq/edit_faq.ejs', {
                faq: result[0],
                title: 'Edit  faq'
            });
        } else {
            res.redirect('/admin/add_faq?error=Header package not found');
        }
    } catch (error) {
        console.error("Error fetching header package for edit:", error);
        res.redirect('/admin/header_packages?error=Failed to load header package');
    }
});


router.post("/update_faq/:id", async function (req, res) {
    try {
        console.log(req.body, req.params.id);

        const { question, answer } = req.body;
        const id = req.params.id;

        const sql = `
            UPDATE faqs
            SET question = ?, answer = ?
            WHERE id = ?
        `;

        const result = await exe(sql, [question, answer, id]);

        res.redirect("/admin/add_faq");
    } catch (err) {
        console.error("FULL ERROR 👉", err);
        res.status(500).send(err.message);
    }
});

router.get("/logout", function (req, res) {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
});

router.get("/social_links", async (req, res) => {
    const sql = `SELECT * FROM social_links LIMIT 1`;
    const result = await exe(sql);

    res.render("admin/social_links.ejs", {
        data: result.length > 0 ? result[0] : null
    });
});

router.post("/save_social_links", async (req, res) => {
    try {
        const d = req.body;

        const check = await exe(`SELECT social_links_id FROM social_links LIMIT 1`);

        if (check.length > 0) {
            // UPDATE
            const sql = `
                UPDATE social_links SET
                    title=?,
                    description=?,
                    copywrite=?,
                    facebook=?,
                    twitter=?,
                    instagram=?,
                    linkedin=?,
                    youtube=?
                WHERE social_links_id=?
            `;

            await exe(sql, [
                d.title,
                d.description,
                d.copywrite,
                d.facebook,
                d.twitter,
                d.instagram,
                d.linkedin,
                d.youtube,
                check[0].social_links_id
            ]);

        } else {
            // INSERT (only once)
            const sql = `
                INSERT INTO social_links
                (title,description,copywrite,facebook,twitter,instagram,linkedin,youtube)
                VALUES (?,?,?,?,?,?,?,?)
            `;

            await exe(sql, [
                d.title,
                d.description,
                d.copywrite,
                d.facebook,
                d.twitter,
                d.instagram,
                d.linkedin,
                d.youtube
            ]);
        }

        res.redirect("/admin/social_links");

    } catch (err) {
        console.log(err);
        res.send("Server Error");
    }
});


router.post("/edit_mobile_no", async (req, res) => {
    try {
        const { mobile_no } = req.body;

        if (!mobile_no || mobile_no.length !== 10) {
            return res.status(400).send("Invalid mobile number");
        }

        const sql = `
            UPDATE book_event_mobile
            SET mobile_no = ?
            WHERE id = 1
        `;

        await exe(sql, [mobile_no]);

        res.redirect("/admin");

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});




module.exports = router;