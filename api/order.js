// ═══ Функция заказа — ГОТОВЫЙ ФАЙЛ, на марафоне не трогаем ═══
// Vercel запускает её на сервере по адресу POST /api/order.
// Токен бота хранится в настройках Vercel (Environment Variables), а НЕ в коде страницы:
// в браузере его увидит любой через F12 — и сможет писать от имени вашего бота.
//   TELEGRAM_BOT_TOKEN — токен от @BotFather
//   TELEGRAM_CHAT_ID   — куда присылать заказы (ваш id или id группы бариста)
import { PRODUCTS, SHOP } from "../js/products.js";

const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const money = (value) => value.toLocaleString("ru-RU") + " " + SHOP.currency;
const TIMES = { asap: "как можно скорее", 30: "через 30 минут", 60: "через час" };

// проверяем всё, что пришло из браузера: доверять ему нельзя
function check(body) {
  const customer = body?.customer ?? {};
  const name = String(customer.name ?? "").trim().slice(0, 60);
  const phone = String(customer.phone ?? "").trim().slice(0, 30);
  const delivery = customer.delivery === "delivery" ? "delivery" : "pickup";
  const address = String(customer.address ?? "").trim().slice(0, 120);
  const comment = String(customer.comment ?? "").trim().slice(0, 300);
  const time = TIMES[customer.time] ? customer.time : "asap";
  if (name.length < 2) return { error: "Укажите имя" };
  if (phone.replace(/\D/g, "").length < 9) return { error: "Укажите телефон" };
  if (delivery === "delivery" && address.length < 5) return { error: "Укажите адрес доставки" };

  if (!Array.isArray(body?.items) || body.items.length === 0 || body.items.length > 30) return { error: "Корзина пуста" };
  const lines = [];
  for (const item of body.items) {
    const product = PRODUCTS.find((p) => p.id === Number(item?.id));
    const qty = Math.floor(Number(item?.qty));
    if (!product) return { error: "Неверный товар в корзине" };
    if (!(qty >= 1 && qty <= 20)) return { error: "Не больше 20 штук одного товара" };
    lines.push({ product, qty, sum: product.price * qty }); // цена — с сервера, не из браузера
  }
  return { order: { name, phone, delivery, address, comment, time, lines, total: lines.reduce((s, l) => s + l.sum, 0) } };
}

function message(order, number) {
  return [
    `☕ <b>Новый заказ №${number}</b>`,
    `👤 ${escape(order.name)} · ${escape(order.phone)}`,
    order.delivery === "delivery" ? `🛵 Доставка: ${escape(order.address)}` : "🚶 Заберёт сам",
    `⏰ ${TIMES[order.time]}`,
    "",
    ...order.lines.map((l) => `${l.qty} × ${escape(l.product.title)} — ${money(l.sum)}`),
    "",
    `<b>Итого: ${money(order.total)}</b>`,
    order.comment ? `💬 ${escape(order.comment)}` : "",
  ].filter((line, i, all) => line !== "" || all[i - 1] !== "").join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Только POST" });
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env;
  if (!token || !chatId) return res.status(503).json({ error: "Бот не настроен: задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  const { order, error } = check(body);
  if (error) return res.status(400).json({ error });

  const number = String(Date.now()).slice(-4); // короткий номер для бариста
  const api = process.env.TELEGRAM_API ?? "https://api.telegram.org"; // подмена только для автотестов
  const tg = await fetch(`${api}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message(order, number), parse_mode: "HTML" }),
  }).catch(() => null);
  if (!tg?.ok) {
    // объяснение Telegram (без токена): «chat not found» — не написали боту или неверный chat id, «Unauthorized» — неверный токен
    const reason = tg ? (await tg.json().catch(() => ({}))).description : "нет связи с Telegram";
    return res.status(502).json({ error: "Telegram не принял заказ: " + (reason ?? tg.status) });
  }
  return res.status(200).json({ ok: true, number, total: order.total });
}
