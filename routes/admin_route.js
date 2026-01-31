var express = require("express");
var exe = require("../connection");
var router = express.Router();
const fs = require('fs');

router.get("/", function (req, res) {
    res.render('admin/dashboard.ejs');
});
router.get("/about", function (req, res) {
    res.render('admin/about.ejs');
});
router.get("/service", function (req, res) {
    res.render('admin/service.ejs');
});


router.get("/header_packages", async function(req, res) {
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

router.get("/gallery", async function (req, res) {
   
        const data = await exe("SELECT * FROM gallery_header LIMIT 1");
        res.render("admin/gallery.ejs", { gallery_header: data[0] || null });

})
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


router.get("/delete_header_package/:id", async function(req, res) {
    try {
        const { id } = req.params;
        var sql = `DELETE FROM header_packages WHERE id = ?`;
         result = await exe(sql, [id]);
        
        if (result> 0) {
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

router.get("/edit_header/:id", async function(req, res) {
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

        // default old image (hidden input मधून यायला हवा)
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



router.get("/add_packages", async function(req, res) {
  try {
        var sql = `
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
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM packages 
            ORDER BY created_at DESC
        `;
        
        var packages = await exe(sql);
        
        // Parse JSON strings for display
        packages = packages.map(pkg => {
            if (pkg.feature_included) {
                try {
                    pkg.feature_included = JSON.parse(pkg.feature_included);
                } catch (e) {
                    pkg.feature_included = [];
                }
            }
            if (pkg.support) {
                try {
                    pkg.support = JSON.parse(pkg.support);
                } catch (e) {
                    pkg.support = [];
                }
            }
            return pkg;
        });
        
        res.render("admin/packages/add_packages.ejs", { packages: packages });
    } catch (err) {
        console.error("Error fetching packages:", err);
        res.status(500).send("Server Error");
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




router.get("/admin/delete_package/:id", async function (req, res) {
    try {
        var id = req.params.id;
        
        // Get package details to delete image file
        var checkSql = "SELECT bg_image FROM service_packages WHERE id = ?";
        var existing = await exe(checkSql, [id]);
        
        if (existing.length > 0 && existing[0].bg_image) {
            // Delete image file
            var imagePath = "public/upload/packages/" + existing[0].bg_image;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        // Delete from database
        var deleteSql = "DELETE FROM service_packages WHERE id = ?";
        await exe(deleteSql, [id]);
        
        res.redirect("/admin/packages");
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



router.get("/edit_feature/:id", async function(req, res) {
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





router.get("/gallery", function (req, res) {
    res.render('admin/gallery.ejs');

});
router.post("/gallery-header/save", async function(req, res) {
   
        const d = req.body;
        let FileName = "";

        // Get old record if exists
        const oldRecord = await exe("SELECT * FROM gallery_header LIMIT 1");
        const fs = require("fs");

        if(req.files && req.files.image){
            const image = req.files.image;
            FileName = Date.now() + "_" + image.name.replace(/\s/g, "_");
            await image.mv("public/upload/gallery/" + FileName);

            // Delete old image file if exists
            if(oldRecord.length > 0){
                const oldImage = oldRecord[0].image;
                if(oldImage && fs.existsSync("public/upload/gallery/" + oldImage)){
                    fs.unlinkSync("public/upload/gallery/" + oldImage);
                }
            }
        } else if(oldRecord.length > 0){
            FileName = oldRecord[0].image; // keep old image if new not uploaded
        }

        if(oldRecord.length > 0){
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
 router.post("/gallery/save", async function(req, res){

    var d = req.body;
    var FileName = "";

    // Image upload
    if(req.files && req.files.gallery_img){
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

  router.get("/gallery_list", async function(req, res){
    var sql = "SELECT * FROM gallery ORDER BY id DESC";
    var gallery = await exe(sql);
    res.render("admin/gallery_list.ejs", { gallery });
});

const fs = require("fs");
const path = require("path");

router.get("/gallery_delete/:id", async function(req, res){

    const id = req.params.id;

    // 1️⃣ get image name from DB
    const data = await exe(`SELECT gallary_img FROM gallery WHERE id = '${id}'`);

    if(data.length > 0 && data[0].gallary_img){
        const imagePath = path.join(
            __dirname,
            "../public/upload/gallery/",
            data[0].gallary_img
        );

        // 2️⃣ delete image file if exists
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
        }
    }

    // 3️⃣ delete record from DB
    await exe(`DELETE FROM gallery WHERE id = '${id}'`);

    res.redirect("/admin/gallery_list");
});


router.get("/gallery_edit/:id",async function(req,res){
      id = req.params.id;
      data = await exe(`SELECT * FROM gallery WHERE id = '${id}'`);
       res.render("admin/gallery_edit.ejs", { gallery: data[0] });
      })
      
     

router.post("/gallery_update/:id", async function(req, res){
    const id = req.params.id;
    const d = req.body;
    let newFileName = "";

    // 1️⃣ Get current record from DB
    const data = await exe(`SELECT * FROM gallery WHERE id = ?`, [id]);
    const oldImage = data[0].gallary_img;

    // 2️⃣ Handle new image upload
    if(req.files && req.files.gallery_img){
        newFileName = Date.now() + "_" + req.files.gallery_img.name.replace(/\s/g,"_");
        const uploadPath = path.join(__dirname, "../public/upload/gallery/", newFileName);
        await req.files.gallery_img.mv(uploadPath);

        // Delete old image if exists
        if(oldImage){
            const oldPath = path.join(__dirname, "../public/upload/gallery/", oldImage);
            if(fs.existsSync(oldPath)){
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

router.get("/edit_blog/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM blog WHERE blog_id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/edit_blog.ejs', packet);
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

router.get("/delete_blog/:id", async function (req, res) {
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

router.get("/blog_slider_edit/:id", async function (req, res) {
    var id = req.params.id;
    var sql = `SELECT * FROM blog_slider WHERE id = ?`;
    var data = await exe(sql, [id]);
    var packet = { data };
    res.render('admin/blog_slider_edit.ejs', packet);
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
            d.id
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