const mongoose = require("mongoose");

// Define the main blog post schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  final_tags: {
    type: [String],
    required: true,
    validate: {
      validator: function (tags) {
        return tags.length >= 1;
      },
      message: "Tag field must contain at least 1 tag",
    },
  },
  blog_body: {
    type: String,
    required: true,
    trim: true,
  },
  cover_img: {
    type: String, // Assuming you store the file path in the database
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
