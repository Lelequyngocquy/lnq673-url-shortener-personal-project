const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const { createUrlLimiter } = require("../middlewares/rateLimiter");

// API tạo link rút gọn (Gắn middleware chống spam vào đây)
router.post("/api/shorten", createUrlLimiter, urlController.shortenUrl);

// API chuyển hướng khi click vào link rút gọn
router.get("/:code", urlController.redirectUrl);

module.exports = router;
