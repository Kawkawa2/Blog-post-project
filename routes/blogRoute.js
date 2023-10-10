const express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const Post = require("../models/blogModel"); // Import your Post model

// middlewares
const { checkGuess, guess } = require("../middleware/authMiddleware");

// controllers
const blogController = require("../controllers/blogController");

router.get("/", blogController.index);
router.get("/1", blogController.blog);
router.get("/create", guess, blogController.createBlog);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename for uploaded files
  },
});

const validateBlogPost = [
  // check("cover_img").notEmpty().withMessage("cover image title is required"),
  check("title").notEmpty().withMessage("Blog title is required").trim(),
  check("final_tags")
    .notEmpty()
    .withMessage("Tag field must contain at least 1 tag"),
  check("blog_body").notEmpty().withMessage("Blog body is required"),
];

const fileFilter = (req, file, cb) => {
  // Accept only JPEG and PNG files

  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    req.flash("sanitizationErrors", [
      { msg: "Invalid file type. Only JPEG and PNG files are allowed." },
    ]);
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5 MB (adjust as needed)
  },
});

router.post(
  "/postBlog",
  upload.single("cover_img"),
  validateBlogPost,
  async (req, res) => {
    try {
      const { final_tags, title, blog_body } = req.body;
      console.log(req.file);
      const validationErrors = validationResult(req);
      req.flash("inputBack", { title, blog_body, final_tags });

      if (!validationErrors.isEmpty()) {
        req.flash("sanitizationErrors", validationErrors.array());
        return res.redirect("/blog/create");
      }
      const finalTags = req.body.final_tags.split(",");
      console.log(finalTags);

      const newPost = new Post({
        title,
        final_tags: finalTags,
        blog_body,
        cover_img: `/uploads/${req.file.filename}`, // Store the relative URL
      });

      await newPost.save();
      req.flash("success_redirect", "Post created successfully");
      res.redirect("/blog");
    } catch (err) {
      res.redirect("/blog/create", { err });
    }
  }
);

module.exports = router;

// const { final_tags, title, blog_body } = req.body;
// console.log("hh", file);
// if (!file) {
//   cb(new Error("Cover image is required."), false);
// }
// if (!title || !final_tags || !blog_body) {
//   // throw new Error("Required fields are missing.");
//   return cb(null, false);
// }
