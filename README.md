# Link Preview & Meta Tag Playground (前後端分離單一儲存庫)

這是一個獨立的測試專案，分為 **React + Vite 前端** 與 **Node.js/Express 後端**。你可以將它部署至任何主機或 Vercel 平台。

## 📂 目錄結構
* `backend/`：Node.js/Express 後端，負責處理 `/test/:id` 動態爬蟲路由與 `/robots.txt` 放行設定。
* `frontend/`：React + Vite 前端，包含視覺化產生器面板與 Messenger 預覽卡片即時模擬。
* `vercel.json`：根目錄 Vercel 設定檔，自動處理前端靜態建置與後端 Serverless Function 對接。

---

## 🚀 本地開發與啟動

### 1. 安裝所有依賴
在專案根目錄下直接執行：
```bash
yarn install
```

### 2. 啟動後端 API 伺服器 (Port 3000)
```bash
yarn start:backend
```
後端啟動後會運行於 `http://localhost:3000`。可用於接受 Facebook 爬蟲連線。

### 3. 啟動前端 React 開發面板 (Port 5173)
開啟另一個終端機視窗，執行：
```bash
yarn dev:frontend
```
這會開啟 Vite HMR 熱更新開發伺服器，運行於 `http://localhost:5173`。

---

## 📦 生產環境與單一 Port 執行 (Single-Port Hosting)

本專案支援將前後端合併於單一 Port 部署。

### 1. 編譯前端網頁
在根目錄下執行：
```bash
yarn build:frontend
```
這會在 `frontend/dist/` 下產生打包後的 React 檔案。

### 2. 啟動後端整合服務
此時啟動後端：
```bash
yarn start:backend
```
後端 `server.js` 會自動偵測到 `frontend/dist/` 的存在，並直接在 `http://localhost:3000/` 下託管並提供 React 前端網頁。這意謂著在正式部署（非 Vercel 環境）時，你只需要啟動後端即可同時提供前後端服務。

---

## ☁️ CI/CD 與自動化部署 (Vercel)

本專案在根目錄已內建 `vercel.json` 多專案建置規則。

### Vercel 自動部署步驟：
1. **建立 Git 儲存庫**：將專案根目錄內的所有檔案上傳到你的 GitHub/GitLab 倉庫。
2. **導入 Vercel**：登入 [Vercel](https://vercel.com/)，點選 **Import** 該倉庫。
3. **零設定部署**：Vercel 會讀取根目錄的 `vercel.json`，自動執行 `frontend` 靜態編譯並綑綁 `backend`，完成後為你產生帶有 SSL 證書的公網 HTTPS 連結。
