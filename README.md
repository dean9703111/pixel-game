# Pixel Art Quiz Game (像素風闖關問答)

這是一個基於 React Vite 開發的像素風格問答遊戲，後端使用 Google Sheets 與 Google Apps Script (GAS) 作為資料庫與 API。

## 🎮 功能特色
- **Pixel Art 風格**：復古街機視覺設計。
- **RWD 響應式設計**：支援手機與電腦遊玩。
- **Google Sheets 整合**：題目管理與成績紀錄皆在 Google Sheets 完成。
- **動態關主**：使用 DiceBear API 生成像素風關主。

## 🚀 安裝與執行 (Installation)

1.  **複製專案**
    ```bash
    git clone <your-repo-url>
    cd pixel-game
    ```

2.  **安裝依賴**
    ```bash
    npm install
    ```

3.  **設定環境變數**
    複製 `.env` 範例檔案：
    ```bash
    cp .env.example .env
    ```
    (稍後需填入 `VITE_GOOGLE_APP_SCRIPT_URL`)

4.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```

---

## 📊 Google Sheets 設定 (Database Setup)

1.  前往 [Google Sheets](https://sheets.new) 建立一個新的試算表。
2.  建立兩個工作表 (Tabs)，名稱分別為：
    - `題目`
    - `回答`

### 1. 「題目」工作表欄位
請依照以下順序設定第一列 (Header)：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 題號 | 題目 | A | B | C | D | 解答 |

### 2. 「回答」工作表欄位
請依照以下順序設定第一列 (Header)：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

---

## ⚙️ Google Apps Script 設定 (Backend Setup)

1.  在你的 Google Sheet 中，點選上方選單的 **擴充功能 (Extensions)** > **Apps Script**。
2.  將專案中的 `code.gs` 檔案內容完整複製，貼上覆蓋掉 Apps Script 編輯器中的預設程式碼。
3.  點選上方磁碟片圖示 **儲存**。
4.  **部署為 Web App**：
    - 點選右上角 **部署 (Deploy)** > **新增部署 (New deployment)**。
    - 點選左側齒輪圖示 > **網頁應用程式 (Web app)**。
    - **說明**：輸入任意名稱 (例如：Pixel Game API)。
    - **執行身分 (Execute as)**：選擇 **我 (Me)**。
    - **誰可以存取 (Who has access)**：選擇 **所有人 (Anyone)** (這點非常重要，否則前端無法存取)。
    - 點選 **部署 (Deploy)**。
5.  **授權**：
    - 系統會要求授權存取你的 Google Sheet，請點選 **核對權限**。
    - 選擇你的 Google 帳號。
    - 若出現「Google 尚未驗證這個應用程式」，請點選 **進階 (Advanced)** > **前往... (不安全)** > **允許**。
6.  **取得 URL**：
    - 部署成功後，複製 **網頁應用程式網址 (Web App URL)**。
7.  **更新前端設定**：
    - 回到專案中的 `.env` 檔案。
    - 將網址填入 `VITE_GOOGLE_APP_SCRIPT_URL`：
      ```env
      VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的長字串ID/exec
      ```

---

## 📝 測試題目範例 (Sample Questions)

主題：**生成式 AI 基礎知識**
請將下表內容直接複製貼上到你的 Google Sheet **「題目」** 工作表中 (從 A2 儲存格開始貼上)。

| 題號 | 題目 | A | B | C | D | 解答 |
|---|---|---|---|---|---|---|
| 1 | LLM 在 AI 領域代表什麼？ | Large Language Model | Long Learning Machine | Local Logic Module | Linear Language Mode | Large Language Model |
| 2 | 下列哪個模型主要用於「文字生成圖片」？ | GPT-4 | Midjourney | BERT | Claude | Midjourney |
| 3 | 在與 AI 對話時，「Prompt」指的是什麼？ | AI 的回答 | 使用者輸入的提示詞 | 程式碼錯誤 | 網路延遲 | 使用者輸入的提示詞 |
| 4 | 當 AI 生成看似真實但完全錯誤的資訊，稱為什麼？ | 夢遊 (Sleepwalking) | 幻覺 (Hallucination) | 欺騙 (Deception) | 錯誤 (Error) | 幻覺 (Hallucination) |
| 5 | ChatGPT 是由哪家公司開發的？ | Google | Meta | OpenAI | Microsoft | OpenAI |
| 6 | Transformer 架構的核心機制是什麼？ | 卷積 (Convolution) | 注意力 (Attention) | 遞迴 (Recurrence) | 池化 (Pooling) | 注意力 (Attention) |
| 7 | 為了讓通用模型適應特定任務，通常會進行什麼步驟？ | 預訓練 (Pre-training) | 微調 (Fine-tuning) | 重啟 (Rebooting) | 格式化 (Formatting) | 微調 (Fine-tuning) |
| 8 | RAG 技術的全名是什麼？ | Retrieval-Augmented Generation | Real AI Generation | Rapid Answer Generator | Robot Auto Guide | Retrieval-Augmented Generation |
| 9 | 下列何者「不是」生成式 AI 的典型應用？ | 撰寫電子郵件 | 生成程式碼 | 傳統資料庫查詢 | 創作詩詞 | 傳統資料庫查詢 |
| 10 | 調整 AI 回答創造力的參數通常稱為什麼？ | 濕度 (Humidity) | 溫度 (Temperature) | 亮度 (Brightness) | 速度 (Speed) | 溫度 (Temperature) |

---

## 🛠️ 開發指令

- `npm run dev`: 啟動開發伺服器
- `npm run build`: 建置生產版本
- `npm run preview`: 預覽生產版本

---

## 🚀 自動部署到 GitHub Pages (Auto Deploy)

本專案已設定 GitHub Actions，只要將程式碼推送到 GitHub，即可自動部署到 GitHub Pages。

### 1. 設定 GitHub Secrets
為了讓 GitHub Actions 能讀取到你的環境變數，請依照以下步驟設定：

1.  進入你的 GitHub Repository 頁面。
2.  點選上方選單的 **Settings**。
3.  在左側選單找到 **Secrets and variables** > **Actions**。
4.  點選 **New repository secret**。
5.  依照 `.env.example` 的內容，分別新增以下 Secret (變數名稱與值需與你的 `.env` 一致)：
    - `VITE_GOOGLE_APP_SCRIPT_URL`
    - `VITE_PASS_THRESHOLD`
    - `VITE_QUESTION_COUNT`

### 2. 設定 GitHub Pages
1.  在 **Settings** 頁面，左側選單點選 **Pages**。
2.  在 **Build and deployment** > **Source** 選擇 **Deploy from a branch**。
3.  在 **Branch** 選擇 `gh-pages` (此分支會在第一次 Action 執行成功後自動建立) 並選擇 `/ (root)`。
4.  點選 **Save**。

### 3. 推送程式碼
將程式碼推送到 `main` 分支，GitHub Actions 就會自動開始建置並部署。
部署完成後，你可以在 **Settings > Pages** 頁面看到你的網站連結。

> **注意**：若你的網站部署後出現白屏或資源載入錯誤，請確認 `vite.config.js` 中的 `base` 設定是否正確 (通常需設定為 `/你的Repo名稱/`)。
