var express = require("express");
var bodyparser = require("body-parser");
var session = require("express-session");
var upload = require("express-fileupload");
var cookies = require('cookie-parser');
var admin_route = require("./routes/admin_route");
var user_route = require("./routes/user_route");

var app = express();

const path = require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public/"));
app.use(upload());
app.use(cookies());
app.use(session({
  secret: "abcd",
  resave: true,
  saveUninitialized: true
}));
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/admin", admin_route);
app.use("/", user_route);

app.listen(3000);
