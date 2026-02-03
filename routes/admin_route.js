var express = require("express");
var exe = require("../connection");
var fs = require("fs");
var path = require("path");
var router = express.Router();

router.get("/", function (req, res) {
    res.render('admin/dashboard.ejs');
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
    const sql = "SELECT * FROM testimonials ORDER BY rating DESC";
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
    res.render('admin/contact.ejs');
});

router.get("/faq", function (req, res) {
    res.render('admin/faq.ejs');
});

router.get("/policy", function (req, res) {
    res.render('admin/policy.ejs');
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

router.get("/logout", function (req, res) {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
});




module.exports = router;