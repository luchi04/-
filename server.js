// Локальный сервер — ГОТОВЫЙ ФАЙЛ. Запуск: npm start → http://localhost:3000
// Отдаёт файлы сайта и запускает ту же функцию api/order.js, что и Vercel.
// Токен бота — в файле .env (пример — .env.example), в git его не кладём.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import handler from "./api/order.js";

try { process.loadEnvFile(".env"); } catch { /* нет .env — заказ уйдёт запасным способом */ }

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon" };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/order") {
    let body = "";
    for await (const chunk of req) body += chunk;
    // маленькая «прослойка», чтобы функция работала как на Vercel: req.body, res.status().json()
    req.body = body;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(data)); };
    try { await handler(req, res); } catch { res.status(400).json({ error: "Неверный запрос" }); }
    return;
  }
  let file = path.join(ROOT, decodeURIComponent(url.pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); // папка → её index.html
  // скрытые файлы (.env с токеном!) и чужие папки не отдаём
  const hidden = url.pathname.split("/").some((part) => part.startsWith("."));
  if (hidden || !file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end("Не найдено");
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Магазин: http://localhost:${port}`));
