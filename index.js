const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Kích hoạt CORS cho tất cả các domain (như GitHub Pages)
app.use(cors());
app.use(express.json());

// API POST để giải mã link rút gọn
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
    res.json({ result: finalUrl });

  } catch (err) {
    res.status(500).json({ error: 'Không thể giải mã URL', detail: err.message });
  }
});

// Route test để kiểm tra backend còn sống
app.get('/', (req, res) => {
  res.send('✅ Unshorten backend đang chạy!');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
