require("dotenv").config();
const mysql = require("mysql2/promise");

// Tạo Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // TiDB Cloud yêu cầu SSL. Nếu dùng localhost thì env chọn false hoặc không cần để
  ssl: process.env.DB_USING_SSL === "true" ? { minVersion: "TLSv1.2" } : null,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test thử kết nối khi khởi động app
pool
  .getConnection()
  .then((connection) => {
    console.log("~~~Đã kết nối thành công tới TiDB Cloud!");
    connection.release();
  })
  .catch((err) => {
    console.error("___Lỗi kết nối Database:", err.message);
  });

module.exports = pool;
