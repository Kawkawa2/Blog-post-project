const mongoose = require("mongoose");

//creating schema using mongoose

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name fiels is required!"],
    minlength: [4, "name must be minimum of 4 charachters"],
  },
  email: {
    type: String,
    required: [true, "The email fiels is required!"],
    unique: [true, "The email fiels must be unique!"],
  },
  password: {
    type: String,
    required: [true, "The password fiels is required!"],
    minlength: [6, "password should be minimum of 6 charachters"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// creating models

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
