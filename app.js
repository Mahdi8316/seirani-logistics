// فایل ورودی برای Phusion Passenger (cPanel → Application Manager).
// Passenger به‌طور پیش‌فرض دنبال «app.js» می‌گردد و مقدار PORT (مسیر سوکت) را
// خودش تعیین می‌کند؛ ما همان را به listen می‌دهیم و Passenger آن را می‌گیرد.
// پیش از اجرا حتماً یک‌بار `npm run build` گرفته شده باشد.

const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`> سرور آماده است روی ${port}`);
  });
});
