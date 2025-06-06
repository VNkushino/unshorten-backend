const express = require('express');
const axios = require('axios');
const cors = require('cors'); // <-- Thêm dòng này

const app = express();
const PORT = process.env.PORT || 3000;

// Kích hoạt CORS để cho phép frontend truy cập
app.use(cors()); // <-- Quan trọng nếu bạn dùng frontend từ GitHub Pages, Vercel, v.v.

app.use(express.json());

// API chính để giải mã link rút gọn
app.post('/unshorten', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Thiếu URL cần giải mã' });
  }

  try {
    const response = await axios.head(url, {
      maxRedirects: 10,
      validateStatus: null,
    });

    const finalUrl = response.request?.res?.responseUrl || url;
    res.json({ result: finalUrl }); // Trả về key 'result' cho khớp với script.js của bạn

  } catch (err) {
    res.status(500).json({ error: 'Không thể giải mã URL', detail: err.message });
  }
});

// Route test GET
app.get('/', (req, res) => {
  res.send('Unshorten backend đang chạy!');
});

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
