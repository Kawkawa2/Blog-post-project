const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const passport = require("passport");
var User = require("../models/userModel");

// securing our app fron xss and csrf attacks
const csruf = require("csurf");
const xss = require("xss");

// this is user controller

const userController = {
  // GET: LOGIN function
  getLoginPage: (req, res) => {
    res.render("login.ejs");
  },

  //   GET: REGISTER function
  getRegisterPage: (req, res) => {
    res.render("register.ejs");
  },

  // POST: LOGIN function
  postLogin: (req, res, next) => {
    let { email, remember_me } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("inputBack", { email });
      req.flash("sanitizationErrors", errors.array());
      return res.redirect("/login");
    }
    passport.authenticate("local-login", {
      successRedirect: "/blog",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next); // Passport.authenticate returns a middleware function, call it with (req, res, next)
  },

  //   POST: REGISTER function
  postRegister: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const errors = validationResult(req);
      req.flash("inputBack", { username, email });
      if (!errors.isEmpty()) {
        req.flash("sanitizationErrors", errors.array());
        return res.redirect("/register");
      }
      const findUser = await User.findOne({ email: email });
      if (findUser) {
        req.flash("validationErrors", "The email entered already registred");
        return res.redirect("/register");
      }
      const sanitizedData = {
        username: xss(username),
        email: xss(email),
        password: xss(password),
      };
      const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);
      User.create({
        name: sanitizedData.username,
        email: sanitizedData.email,
        password: hashedPassword,
      });
      req.flash("success_redirect", "Registered successfully, Please log in");
      res.redirect("/login");
    } catch (err) {
      res.redirect("/register", { err });
    }
  },

  //   GET: LOUGOUT function
  getLogoutPage: (req, res) => {
    req.logout((err) => {
      if (err) {
        // Handle the error, if any
        console.error(err);
        return next(err);
      }
      // Redirect to the login page after logout
      console.log("logout", req.session);
      res.redirect("/login");
    });
  },
};

module.exports = userController;
