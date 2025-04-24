const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/trends', async (req, res) => {
  const keyword = req.query.keyword || 'Inteligência Artificial';

  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote'
      ],
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto('https://trends.google.com/trends/explore?q=' + encodeURIComponent(keyword), {
      waitUntil: 'networkidle2',
    });

    // Capturar algum dado relevante da página
    const data = await page.evaluate(() => {
      const heading = document.querySelector('h1')?.innerText || 'Sem título encontrado';
      return { heading };
    });

    await browser.close();
    res.json({ keyword, ...data, status: 'OK' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do Google Trends com Puppeteer', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API do Google Trends rodando com Puppeteer!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});