const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/trends', async (req, res) => {
  const keyword = req.query.keyword || 'Inteligência Artificial';

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://trends.google.com/trends/explore?q=' + encodeURIComponent(keyword), {
      waitUntil: 'networkidle2',
    });

    // Exemplo simples: extrair o título da página
    const title = await page.title();

    await browser.close();

    res.json({
      keyword,
      titulo: title,
      status: 'OK',
    });

  } catch (err) {
    res.status(500).json({
      error: 'Erro ao buscar dados do Google Trends com Puppeteer',
      details: err.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send('API Google Trends via Puppeteer está ativa. Use /trends?keyword=...');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
