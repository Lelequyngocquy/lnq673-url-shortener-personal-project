require("dotenv").config();
const express = require("express");
const cors = require("cors");
const urlRoutes = require("./src/routes/urlRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Middleware cơ bản
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Giúp app đọc được JSON từ request body
app.use(express.urlencoded({ extended: true }));

// Định tuyến
app.use("/", urlRoutes);

// Trang chủ mặc định
app.get("/", (req, res) => {
  res.send("~~~Chào mừng đến với hệ thống URL Shortener API!");
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`***Server đang chạy tại: http://localhost:${PORT}`);
  console.log(
    `***Gửi POST request tới http://localhost:${PORT}/api/shorten để test.`,
  );
});
