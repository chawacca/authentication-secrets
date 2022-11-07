//19) require dotenv.->20)
require("dotenv").config();
//3) Boilerplate.->4)
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//12) require "mongoose-encryption".->13)
const encrypt = require("mongoose-encryption");
const app = express();
//22) Just for testing.->23)
//console.log(process.env.TEST_TEXT);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/userDB");
//for Heroku hosting server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};
app.listen(port, function() {
  console.log("Server started on port " + port);
});
//replaced by step 13)
//6) Define Schema and model for the database.->7)
// const userSchema = {
//   email: String,
//   password: String
// };
//13) Modify Schema to adapt to the encryption module.->14)
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//Removed by step 25)
//14) Create the "Secret String".->15)
// const secret = "Thisisourlittlesecret.";
//16) Use the plugin for the Schema.->17)
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});// Modified by 26)->27)
const User = new mongoose.model("User", userSchema);
//4) app.get methods for "home", "register" and "login" views (pages).->5)
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
//7) Create app.post for /register.->8)
app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    };
  });
});

//9) Create app.post for /login.->10)
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        };
      };
    };
  });
});
