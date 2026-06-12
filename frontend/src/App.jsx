import { useState, useEffect } from 'react';

function App() {
  const [baseUrl, setBaseUrl] = useState('');
  const [testId, setTestId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [copied, setCopied] = useState(false);

  // Initialize baseUrl and generate first random ID
  useEffect(() => {
    setBaseUrl(window.location.origin);
    generateRandomId();
  }, []);

  const generateRandomId = () => {
    const rand = Math.random().toString(36).substring(2, 8);
    setTestId('t-' + rand);
  };

  const getGeneratedUrl = () => {
    if (!baseUrl) return '';
    try {
      const url = new URL(baseUrl + '/test/' + encodeURIComponent(testId || 'test-id'));
      if (title) url.searchParams.set('title', title);
      if (description) url.searchParams.set('description', description);
      if (image) url.searchParams.set('image', image);
      if (width && width !== 1200) url.searchParams.set('width', width.toString());
      if (height && height !== 630) url.searchParams.set('height', height.toString());
      return url.toString();
    } catch (e) {
      return '';
    }
  };

  const handleCopy = () => {
    const url = getGeneratedUrl();
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generatedUrl = getGeneratedUrl();
  const domainName = baseUrl ? new URL(baseUrl).hostname : 'your-domain.com';

  return (
    <div className="container">
      <header>
        <h1>Meta Tag Link Preview Generator</h1>
        <p>獨立 React + Vite 介面：產生動態 Cache-Busting 測試連結，即時模擬 Messenger 預覽</p>
      </header>

      <div className="dashboard">
        {/* Left column: input form */}
        <div class="card">
          <div class="grid">
            <div className="form-group full-width">
              <label htmlFor="baseUrl">Base URL (測試主機網址)</label>
              <input
                type="text"
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="例如: https://fb-preview-playground.vercel.app"
              />
            </div>

            <div className="form-group">
              <label htmlFor="testId">唯一測試 ID (Cache-Busting)</label>
              <div className="id-input-wrapper">
                <input
                  type="text"
                  id="testId"
                  value={testId}
                  onChange={(e) => setTestId(e.target.value)}
                  placeholder="例如: test-001"
                />
                <button type="button" className="btn-rand" onClick={generateRandomId} title="產生隨機唯一 ID">
                  隨機
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="metaTitle">分享標題 (og:title)</label>
              <input
                type="text"
                id="metaTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`預設: Test Title - ${testId}`}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="metaDescription">分享描述 (og:description)</label>
              <textarea
                id="metaDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`預設: Test Description for ID ${testId}`}
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label htmlFor="imageUrl">預覽圖片網址 (og:image)</label>
              <input
                type="text"
                id="imageUrl"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="HTTPS 圖片網址，例如: https://picsum.photos/1200/630"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageWidth">圖片寬度 (og:image:width)</label>
              <input
                type="number"
                id="imageWidth"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                placeholder="1200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageHeight">圖片長度 (og:image:height)</label>
              <input
                type="number"
                id="imageHeight"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                placeholder="630"
              />
            </div>
          </div>
        </div>

        {/* Right column: live messenger simulation card */}
        <div className="preview-panel">
          <div className="messenger-preview">
            <h3 className="preview-title">Messenger 預覽模擬</h3>
            <div className="messenger-chat">
              <div className="chat-bubble">
                <div className="bubble-image-wrapper">
                  <img
                    src={image || '/placeholder.png'}
                    className="bubble-image"
                    alt="Preview Image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="bubble-info">
                  <div className="bubble-domain">{domainName}</div>
                  <div className="bubble-title">{title || `Test Title - ${testId}`}</div>
                  <div className="bubble-desc">{description || `Test Description for ID ${testId}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing link output card */}
      <div className="output-card">
        <div className="output-header">
          <span className="output-label">產生的動態測試連結 (自帶 Meta 參數)</span>
          {copied && <span className="toast">複製成功！</span>}
        </div>
        <div className="output-url">{generatedUrl}</div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={handleCopy}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            複製連結 (Copy)
          </button>
          <a
            className="btn btn-secondary"
            href={`https://developers.facebook.com/tools/debug/sharing/?q=${encodeURIComponent(generatedUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            FB 分享除錯工具 (Debug)
          </a>
          <a className="btn btn-outline" href={generatedUrl} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            直連開啟 (Open)
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
