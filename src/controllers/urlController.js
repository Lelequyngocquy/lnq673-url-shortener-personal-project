const urlService = require("../services/urlService");

const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, password, expiresAt } = req.body;

    if (!originalUrl) {
      return res
        .status(400)
        .json({ success: false, error: "originalUrl là bắt buộc" });
    }

    // Gọi service xử lý
    const data = await urlService.createShortUrl({
      originalUrl,
      customAlias,
      password,
      expiresAt,
    });

    // Trả về link hoàn chỉnh
    const shortUrl = `${req.protocol}://${req.get("host")}/${data.shortCode}`;

    return res.status(201).json({
      success: true,
      message: "Tạo URL rút gọn thành công",
      data: { shortUrl, shortCode: data.shortCode },
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const urlData = await urlService.getOriginalUrl(code);

    if (!urlData) {
      return res
        .status(404)
        .send("<h1>404 - Không tìm thấy đường dẫn này!</h1>");
    }

    // Kiểm tra xem link đã hết hạn chưa
    if (urlData.expires_at && new Date() > new Date(urlData.expires_at)) {
      return res.status(410).send("<h1>410 - Đường dẫn này đã hết hạn!</h1>");
    }

    // Nếu có mật khẩu, tạm thời trả về lỗi (tính năng Private Link sẽ cần 1 trang UI để nhập pass)
    if (urlData.password_hash) {
      return res
        .status(403)
        .send("<h1>403 - Đường dẫn này được bảo vệ bằng mật khẩu!</h1>");
    }

    // Chạy ngầm việc lưu thống kê
    urlService.logAnalytics(urlData.id, req);

    // Chuyển hướng người dùng (Mã 302 Found)
    return res.redirect(302, urlData.original_url);
  } catch (error) {
    console.error(error);
    return res.status(500).send("<h1>500 - Lỗi máy chủ!</h1>");
  }
};

module.exports = { shortenUrl, redirectUrl };
