const express = require("express");
const router = express.Router();

router.use("/blog", require("./blog/posts"));


module.exports = router;