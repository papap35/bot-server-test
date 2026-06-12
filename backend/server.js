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

const escapeHtml = (str) => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

app.get('/test/:id', (req, res) => {
  const { id } = req.params;
  const title = req.query.title || `Test Title - ${id}`;
  const description = req.query.description || `Test Description for ID ${id}`;
  
  const host = req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || (req.protocol === 'http' && host.includes('localhost') ? 'http' : 'https');
  const defaultImage = `${protocol}://${host}/placeholder.png`;
  
  const image = req.query.image || defaultImage;
  const width = req.query.width || '1200';
  const height = req.query.height || '630';

  const escTitle = escapeHtml(title);
  const escDesc = escapeHtml(description);
  const escImage = escapeHtml(image);
  const escWidth = escapeHtml(width);
  const escHeight = escapeHtml(height);

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escTitle}</title>
      <meta charset="utf-8">
      <meta name="description" content="${escDesc}" />
      <meta property="og:title" content="${escTitle}" />
      <meta property="og:description" content="${escDesc}" />
      <meta property="og:image" content="${escImage}" />
      <meta property="og:image:secure_url" content="${escImage}" />
      <meta property="og:image:width" content="${escWidth}" />
      <meta property="og:image:height" content="${escHeight}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escTitle}" />
      <meta name="twitter:description" content="${escDesc}" />
      <meta name="twitter:image" content="${escImage}" />
    </head>
    <body>
      <h1>Dynamic Meta Test Playground</h1>
      <p>ID: ${escapeHtml(id)}</p>
      <p>Title: ${escTitle}</p>
      <p>Description: ${escDesc}</p>
      <p>Image: <a href="${escImage}">${escImage}</a></p>
      <p>Dimensions: ${escWidth}x${escHeight}</p>
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
