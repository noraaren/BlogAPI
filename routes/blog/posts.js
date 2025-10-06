const postsController = require("../../controllers/Blog/posts")
const commentsController = require("../../controllers/Blog/comments")
const express = require("express");
const router = express.Router();

router.get("/", postsController.getPosts);

router.get("/:id", postsController.getPostsByID);

router.post("/:postID/comments", commentsController.postComments);


router.delete("/comments/:id", commentsController.deleteComment)


module.exports = router;