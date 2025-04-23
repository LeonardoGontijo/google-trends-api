const express = require('express');
const googleTrends = require('google-trends-api');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/trends', async (req, res) => {
  const keyword = req.query.keyword || 'Inteligência Artificial';

  try {
    const results = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    });

    res.json(JSON.parse(results));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do Google Trends', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API do Google Trends funcionando! Use /trends?keyword=...');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
