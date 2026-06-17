# 韻見庫存公開入口頁

這個資料夾是一個獨立的公開入口網站。它不需要 GPT 登入，也不需要跟庫存主機同 Wi-Fi；使用者先看到入口頁，再點選：

- 同 Wi-Fi 編輯庫存
- GPT 登入編輯
- 免登入庫存查看

## 建議上傳方式

最簡單做法是使用 Cloudflare Pages 的 Direct Upload / Drag and drop：

1. 登入 Cloudflare。
2. 到 Workers & Pages。
3. 選 Create application。
4. 選 Pages。
5. 選 Drag and drop。
6. 上傳這個資料夾，或上傳 `yunjian-public-entry.zip`。
7. Cloudflare 會給一個公開網址，例如 `yunjian-entry.pages.dev`。

## 要讓 Netlify 網址自動同步

拖拉上傳的 Netlify Drop 不會自動同步。要讓同一個網址自動更新，需要把這個資料夾接到 GitHub，再讓 Netlify 連到那個 GitHub repository。

Netlify 同步設定：

- Build command：留空
- Publish directory：`.`
- Production branch：`main`

設定完成後，以後只要這個資料夾更新並推送到 GitHub，Netlify 會自動更新同一個網址。

## 之後如果要用自己的網域

可以再把自己的網域綁到這個 Pages 專案，例如：

- `inventory.yunjian.tw`
- `stock.yunjian.tw`
- `go.yunjian.tw`

這個公開入口只負責分流，不儲存庫存資料。
