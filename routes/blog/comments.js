const express = require("express");
const router = express.Router();
const commentsController = require("../../controllers/Blog/comments");

router.post("/:postID/comments", commentsController.postComments);


router.delete("/comments/:id", commentsController.deleteComment)

module.exports = router;