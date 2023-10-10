const localStrategy = require("passport-local").Strategy;

const bcrypt = require("bcrypt");
var User = require("../models/userModel");

// search user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

// authenticate user
async function authenticateUser(req, email, password, done) {
  const findUser = await getUserByEmail(email);
  req.flash("inputBack", { email });
  if (!findUser) {
    req.flash("validationErrors", "The email entered is not registred");
    return done(null, false);
  }

  // Compare the provided password with the stored user password
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    req.flash("validationErrors", "Wrong password");
    return done(null, false);
  }
  return done(null, findUser);
}

// initialize passport strategy
function initializePassport(passport) {
  // local login strategy
  passport.use(
    "local-login",
    new localStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      authenticateUser
    )
  );

  // Configure serialization and deserialization of user data
  passport.serializeUser((user, done) => {
    try {
      return done(null, user._id);
    } catch (err) {
      console.error("Error serializing User", err);
      return done(err);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return done(null, false); // User not found
      }
      done(null, user);
    } catch (error) {
      done("deserialize", error);
    }
  });
}

module.exports = initializePassport;
