const rateLimit = require("express-rate-limit");

// Giới hạn tạo tối đa 20 link rút gọn mỗi 15 phút trên mỗi IP
const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: "Bạn đã tạo quá nhiều link. Vui lòng thử lại sau 15 phút!",
  },
  standardHeaders: true, // Trả về thông tin giới hạn trong header
  legacyHeaders: false,
});

module.exports = { createUrlLimiter };
