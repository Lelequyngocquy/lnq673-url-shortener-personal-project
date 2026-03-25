const db = require("../configs/db");
const { generateShortCode } = require("../utils/generateCode");
const bcrypt = require("bcryptjs");

// Dịch vụ 1: Tạo Short URL
const createShortUrl = async ({
  originalUrl,
  customAlias,
  password,
  expiresAt,
}) => {
  // 1. Kiểm tra nếu user muốn dùng alias tự chọn
  if (customAlias) {
    const [existing] = await db.query(
      "SELECT id FROM urls WHERE custom_alias = ? OR short_code = ?",
      [customAlias, customAlias],
    );
    if (existing.length > 0) throw new Error("Alias này đã có người sử dụng!");
  }

  // 2. Sinh mã short_code ngẫu nhiên (nếu không có alias)
  let shortCode = customAlias;
  if (!shortCode) {
    let isUnique = false;
    while (!isUnique) {
      shortCode = generateShortCode();
      const [existing] = await db.query(
        "SELECT id FROM urls WHERE short_code = ?",
        [shortCode],
      );
      if (existing.length === 0) isUnique = true;
    }
  }

  // 3. Xử lý mật khẩu (nếu có)
  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  // 4. Lưu vào cơ sở dữ liệu
  const query = `
        INSERT INTO urls (original_url, short_code, custom_alias, password_hash, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `;
  const [result] = await db.query(query, [
    originalUrl,
    shortCode,
    customAlias || null,
    passwordHash,
    expiresAt || null,
  ]);

  return { shortCode, id: result.insertId };
};

// Dịch vụ 2: Lấy Original URL để Redirect
const getOriginalUrl = async (code) => {
  const [rows] = await db.query(
    `
        SELECT id, original_url, password_hash, expires_at 
        FROM urls 
        WHERE short_code = ? OR custom_alias = ?
    `,
    [code, code],
  );

  return rows.length > 0 ? rows[0] : null;
};

// Dịch vụ 3: Lưu log ẩn danh (Chạy ngầm không ảnh hưởng tốc độ)
const logAnalytics = (urlId, req) => {
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "Unknown";
  const referrer = req.headers["referer"] || "Direct";

  // Ghi log vào bảng analytics, đồng thời tăng biến đếm click_count
  db.query(
    "INSERT INTO url_analytics (url_id, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)",
    [urlId, ip, userAgent, referrer],
  ).catch((err) => console.error("Lỗi lưu log:", err));

  db.query("UPDATE urls SET click_count = click_count + 1 WHERE id = ?", [
    urlId,
  ]).catch((err) => console.error("Lỗi update count:", err));
};

module.exports = { createShortUrl, getOriginalUrl, logAnalytics };
