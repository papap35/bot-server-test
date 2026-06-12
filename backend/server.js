const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

// Allow all crawlers for preview debugging
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send("User-agent: *\nAllow: /");
});

// Serve static React files if built
const distDir = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      status: "active",
      message: "Link Preview Backend API is running.",
      frontend_dev: "To run the React frontend dashboard locally, run: cd frontend && yarn dev",
      api_test: "Use /test/:id to verify crawlers"
    });
  }
});

app.get('/test/:id', (req, res) => {
  const { id } = req.params;
  const title = req.query.title || `Test Title - ${id}`;
  const description = req.query.description || `Test Description for ID ${id}`;
  const image = req.query.image || 'https://via.placeholder.com/1200x630.png';
  const width = req.query.width || '1200';
  const height = req.query.height || '630';

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <meta name="description" content="${description}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:image:secure_url" content="${image}" />
      <meta property="og:image:width" content="${width}" />
      <meta property="og:image:height" content="${height}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
    </head>
    <body>
      <h1>Dynamic Meta Test Playground</h1>
      <p>ID: ${id}</p>
      <p>Title: ${title}</p>
      <p>Description: ${description}</p>
      <p>Image: <a href="${image}">${image}</a></p>
      <p>Dimensions: ${width}x${height}</p>
    </body>
    </html>
  `);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
}

module.exports = app;
