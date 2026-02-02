var express = require("express");
var exe = require("../connection");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('admin/dashboard.ejs');
});
router.get("/about", function (req, res) {
    res.render('admin/about.ejs');
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

        const sql = `
            INSERT INTO service 
            (logo, title, short_quote, feature1, feature2, feature3, feature4, feature5, feature6, price, book_button) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `;

        await exe(sql, [
            d.logo,
            d.title,
            d.short_quote,
            d.feature1,
            d.feature2,
            d.feature3,
            d.feature4,
            d.feature5,
            d.feature6,
            d.price,
            d.book_button
        ]);

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

        // check image upload
        if (req.files && req.files.image) {
            filename = Date.now() + "_" + req.files.image.name;

            // ✅ FIXED PATH
            await req.files.image.mv("public/upload/service/" + filename);
        }

        const sql = "INSERT INTO service_slider (image, title, description) VALUES (?,?,?)";
        await exe(sql, [filename, d.title, d.description]);

        // ✅ FIXED REDIRECT
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
        const sql = `
            INSERT INTO other_service (icon, title, short_quote)
            VALUES (?,?,?)
        `;

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

    // Get old record if exists
    const oldRecord = await exe("SELECT * FROM gallery_header LIMIT 1");
    const fs = require("fs");

    if (req.files && req.files.image) {
        const image = req.files.image;
        FileName = Date.now() + "_" + image.name.replace(/\s/g, "_");
        await image.mv("public/upload/gallery/" + FileName);

        // Delete old image file if exists
        if (oldRecord.length > 0) {
            const oldImage = oldRecord[0].image;
            if (oldImage && fs.existsSync("public/upload/gallery/" + oldImage)) {
                fs.unlinkSync("public/upload/gallery/" + oldImage);
            }
        }
    } else if (oldRecord.length > 0) {
        FileName = oldRecord[0].image; // keep old image if new not uploaded
    }

    if (oldRecord.length > 0) {
        // Update existing record
        await exe(
            "UPDATE gallery_header SET title = ?, subtitle = ?, image = ? WHERE id = ?",
            [d.title, d.subtitle, FileName, oldRecord[0].id]
        );
    } else {
        // Insert new record
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

    // Image upload
    if (req.files && req.files.gallery_img) {
        FileName = Date.now() + req.files.gallery_img.name;
        await req.files.gallery_img.mv("public/upload/gallery/" + FileName);
    }

    var sql = `
        INSERT INTO gallery
        (category, title, gallary_img, event_date)
        VALUES
        (?,?,?,?)
    `;

    await exe(sql, [
        d.category,
        d.title,
        FileName,
        d.event_date
    ]);

    res.redirect("/admin/gallery_list");
});

router.get("/gallery_list", async function (req, res) {
    var sql = "SELECT * FROM gallery ORDER BY id DESC";
    var gallery = await exe(sql);
    res.render("admin/gallery_list.ejs", { gallery });
});
const path = require("path");

router.get("/gallery_delete/:id", async function (req, res) {

    const id = req.params.id;

    // 1️⃣ get image name from DB
    const data = await exe(`SELECT gallary_img FROM gallery WHERE id = '${id}'`);

    if (data.length > 0 && data[0].gallary_img) {
        const imagePath = path.join(
            __dirname,
            "../public/upload/gallery/",
            data[0].gallary_img
        );

        // 2️⃣ delete image file if exists
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    // 3️⃣ delete record from DB
    await exe(`DELETE FROM gallery WHERE id = '${id}'`);

    res.redirect("/admin/gallery_list");
});


router.get("/gallery_edit/:id", async function (req, res) {
    id = req.params.id;
    data = await exe(`SELECT * FROM gallery WHERE id = '${id}'`);
    res.render("admin/gallery_edit.ejs", { gallery: data[0] });
})



router.post("/gallery_update/:id", async function (req, res) {
    const id = req.params.id;
    const d = req.body;
    let newFileName = "";

    // 1️⃣ Get current record from DB
    const data = await exe(`SELECT * FROM gallery WHERE id = ?`, [id]);
    const oldImage = data[0].gallary_img;

    // 2️⃣ Handle new image upload
    if (req.files && req.files.gallery_img) {
        newFileName = Date.now() + "_" + req.files.gallery_img.name.replace(/\s/g, "_");
        const uploadPath = path.join(__dirname, "../public/upload/gallery/", newFileName);
        await req.files.gallery_img.mv(uploadPath);

        // Delete old image if exists
        if (oldImage) {
            const oldPath = path.join(__dirname, "../public/upload/gallery/", oldImage);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
    } else {
        // No new image uploaded → keep old image
        newFileName = oldImage;
    }

    // 3️⃣ Update record in DB
    const sql = `
        UPDATE gallery
        SET category = ?, title = ?, gallary_img = ?, event_date = ?
        WHERE id = ?
    `;
    await exe(sql, [
        d.category,
        d.title,
        newFileName,
        d.event_date,
        id
    ]);

    // 4️⃣ Redirect to gallery list
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

        // Image upload
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }

        var sql = "INSERT INTO blog (blog_image,blog_date,blog_title,blog_para,blog_message) VALUES (?,?,?,?,?)";
        var result = await exe(sql, [filename, d.blog_date, d.blog_title, d.blog_para, d.blog_message]);
        // res.send(d);
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

        // keep old image by default
        let filename = d.old_blog_image;

        // if new image uploaded
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }

        const sql = `
            UPDATE blog
            SET blog_image = ?,
                blog_date = ?,
                blog_title = ?,
                blog_para = ?,
                blog_message = ?
            WHERE blog_id = ?
        `;

        await exe(sql, [
            filename,
            d.blog_date,
            d.blog_title,
            d.blog_para,
            d.blog_message,
            id
        ]);

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

        // Image upload
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }

        var sql = `
            INSERT INTO blog_slider (blog_image, blog_title, blog_description)
            VALUES (?,?,?)
        `;

        await exe(sql, [
            filename,
            d.blog_title,
            d.blog_description   // <-- FIXED
        ]);

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
        // Image upload
        if (req.files && req.files.blog_image) {
            filename = Date.now() + "_" + req.files.blog_image.name;
            await req.files.blog_image.mv("public/upload/blog/" + filename);
        }
        var sql = `
            UPDATE blog_slider
            SET blog_image = ?, blog_title = ?, blog_description = ?    
            WHERE id = ?
        `;
        await exe(sql, [
            filename,
            d.blog_title,
            d.blog_description,
            id
        ]);
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