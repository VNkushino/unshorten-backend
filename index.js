const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// API chính để giải mã link rút gọn
app.post('/api/unshorten', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Thiếu URL cần giải mã' });
  }

  try {
    const response = await axios.head(url, {
      maxRedirects: 10,
      validateStatus: null, // không throw nếu 3xx/4xx
    });

    const finalUrl = response.request?.res?.responseUrl || url;
    res.json({ originalUrl: finalUrl });

  } catch (err) {
    res.status(500).json({ error: 'Không thể giải mã URL', detail: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Unshorten backend đang chạy!');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
