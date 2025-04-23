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
