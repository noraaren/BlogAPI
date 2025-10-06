const express = require("express");
const router = express.Router();

router.use("/blog", require("./blog/posts"));
router.use("/blog", require("./blog/comments"));
router.use("/users", require("./users/posts"));


module.exports = router;