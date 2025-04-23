const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/trends', async (req, res) => {
  const keyword = req.query.keyword || 'inteligência artificial';

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const url = `https://trends.google.com/trends/explore?geo=BR&q=${encodeURIComponent(keyword)}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Captura o conteúdo da página (só como teste por enquanto)
    const html = await page.content();

    await browser.close();

    res.json({
      keyword,
      length: html.length,
      preview: html.substring(0, 300) + '...'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar dados do Google Trends com Puppeteer',
      details: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.send('API do Google Trends com Puppeteer funcionando! Use /trends?keyword=...');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
