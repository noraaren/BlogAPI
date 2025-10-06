const postsController = require("../../controllers/Blog/posts")
const commentsController = require("../../controllers/Blog/comments")
const express = require("express");
const router = express.Router();

router.get("/", postsController.getPosts);

router.get("/:id", postsController.getPostsByID);

router.post("/", postsController.createPost);

module.exports = router;