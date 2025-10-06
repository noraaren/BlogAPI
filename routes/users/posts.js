const express = require("express");
const router = express.Router();
const userPostsController = require("../../controllers/user/posts");

router.get("/:userID", userPostsController.getPostsByUserID);

router.put("/:postID/comments", userPostsController.updatePost);

module.exports = router;