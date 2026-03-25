const crypto = require("crypto");

const generateShortCode = (length = 7) => {
  // Sinh chuỗi base64 ngẫu nhiên và cắt lấy số ký tự mong muốn
  return crypto
    .randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "0") // Loại bỏ các ký tự không an toàn cho URL
    .replace(/\//g, "1");
};

module.exports = { generateShortCode };
