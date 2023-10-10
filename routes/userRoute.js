const express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const overrideMethod = require("method-override");

// middlewares
const { checkGuess, isAuthenticated } = require("../middleware/authMiddleware");

// controllers
const userController = require("../controllers/userController");

// Routes

// LOGIN
router.get("/login", isAuthenticated, userController.getLoginPage);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Email must be a valid email ").trim(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 6 characters long")
      .escape(),
  ],
  userController.postLogin
);

//REGISTER
router.get("/register", isAuthenticated, userController.getRegisterPage);

router.post(
  "/register",
  [
    check("username").notEmpty().withMessage("Username is required").trim(),
    check("email").isEmail().withMessage("Email must be a valid email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 6 characters long")
      .escape(),
    check("confirm_password")
      .notEmpty()
      .withMessage("Password confirmation is required")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("The passwordS must  match"),
  ],
  userController.postRegister
);

//LOGOUT
router.get("/logout", userController.getLogoutPage);

module.exports = router;
