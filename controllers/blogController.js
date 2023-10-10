// this is the blog controller
var User = require("../models/userModel");
const { validationResult } = require("express-validator");
const Post = require("../models/blogModel"); // Import your Post model

// securing our app fron xss and csrf attacks
const csruf = require("csurf");
const xss = require("xss");

const blogController = {
  index: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" });
      const popularTags = await Post.aggregate([
        { $unwind: "$final_tags" }, // Split tags array into separate documents
        { $group: { _id: "$final_tags", count: { $sum: 1 } } }, // Count occurrences of each tag
        { $sort: { count: -1 } }, // Sort tags by popularity (descending order)
      ]);
      console.log(popularTags);
      res.render("app.ejs", {
        user: req.user,
        posts: posts,
        popularTags: popularTags,
      });
    } catch (error) {
      console.error(error);
      res.render("app.ejs", { err });
    }
  },
  blog: (req, res) => {
    res.render("blog.ejs", { user: req.user });
  },
  createBlog: (req, res) => {
    res.render("addBlog.ejs", { user: req.user });
  },

  postBlog: async (req, res) => {
    const { final_tags, title, blog_body } = req.body;
    // const finalTags = req.body.final_tags.split(",");
    console.log(req.body, req.file);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // req.flash("sanitizationErrors", errors.array());
      console.log(errors);
      return res.redirect("/blog/create");
    }
    // upload.single("cover_img"), res.redirect("/blog");
    // res.json({ message: "Blog post received successfully", tags: tags });
  },
};

module.exports = blogController;
