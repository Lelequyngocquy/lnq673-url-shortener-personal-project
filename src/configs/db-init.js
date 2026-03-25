const db = require("./db");

const initDB = async () => {
  try {
    console.log("~~~Đang khởi tạo Database Schema...");

    // 1. Tạo bảng urls
    await db.query(`
            CREATE TABLE IF NOT EXISTS urls (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                original_url TEXT NOT NULL,
                short_code VARCHAR(15) NOT NULL UNIQUE,
                custom_alias VARCHAR(50) UNIQUE NULL,
                password_hash VARCHAR(255) NULL,
                expires_at DATETIME NULL,
                click_count BIGINT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_short_code (short_code),
                INDEX idx_custom_alias (custom_alias)
            );
        `);
    console.log('~~~Đã kiểm tra/tạo bảng "urls".');

    // 2. Tạo bảng url_analytics
    await db.query(`
            CREATE TABLE IF NOT EXISTS url_analytics (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                url_id BIGINT NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                referrer VARCHAR(255),
                country VARCHAR(50),
                clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (url_id) REFERENCES urls(id) ON DELETE CASCADE,
                INDEX idx_url_id (url_id)
            );
        `);
    console.log('~~~Đã kiểm tra/tạo bảng "url_analytics".');

    console.log("~~~Hoàn tất quá trình thiết lập Database!");
    process.exit(0); // Thoát script thành công
  } catch (error) {
    console.error("___Khởi tạo Database thất bại:", error);
    process.exit(1); // Thoát script với mã lỗi
  }
};

// Chạy hàm init
initDB();
