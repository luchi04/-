// Данные магазина — готовый файл. Меняйте под свою тему: название, контакты, товары, картинки.
// Цены сервер берёт ОТСЮДА ЖЕ (api/order.js) — подменить цену в браузере не получится.

export const SHOP = {
  name: "Zerno",
  city: "Бишкек",
  address: "ул. Киевская, 77",
  hours: "каждый день 8:00–22:00",
  phone: "+996 700 000 000",
  telegram: "zerno_coffee", // ваш ник в Telegram без @ — запасной способ заказа
  currency: "сом",
};

export const CATEGORIES = [
  { id: "all", title: "Всё" },
  { id: "coffee", title: "Кофе" },
  { id: "notcoffee", title: "Не кофе" },
  { id: "desserts", title: "Десерты" },
  { id: "beans", title: "Зерно домой" },
];

export const PRODUCTS = [
  { id: 1, title: "Эспрессо", category: "coffee", price: 120, size: "30 мл", description: "Плотный, с карамельной кремой. Основа всех напитков.", image: "assets/img/espresso.svg" },
  { id: 2, title: "Капучино", category: "coffee", price: 190, size: "300 мл", description: "Эспрессо и бархатная молочная пена. Классика утра.", image: "assets/img/cappuccino.svg", badge: "Хит" },
  { id: 3, title: "Флэт уайт", category: "coffee", price: 210, size: "200 мл", description: "Двойной эспрессо и немного молока — ярче вкус кофе.", image: "assets/img/flat-white.svg" },
  { id: 4, title: "Латте", category: "coffee", price: 200, size: "350 мл", description: "Много молока, мягкий вкус, нежная пена сверху.", image: "assets/img/latte.svg" },
  { id: 5, title: "Раф карамельный", category: "coffee", price: 240, size: "350 мл", description: "Сливки, эспрессо и соленая карамель. Десерт в стакане.", image: "assets/img/raf.svg", badge: "Хит" },
  { id: 6, title: "Айс-латте", category: "coffee", price: 220, size: "400 мл", description: "Холодное молоко, лёд и эспрессо. Спасение в жару.", image: "assets/img/iced-latte.svg" },
  { id: 7, title: "Матча-латте", category: "notcoffee", price: 260, size: "350 мл", description: "Японский зелёный чай и молоко со льдом.", image: "assets/img/matcha.svg", badge: "Новинка" },
  { id: 8, title: "Какао с маршмеллоу", category: "notcoffee", price: 200, size: "300 мл", description: "Горячий шоколадный, с тающими зефирками.", image: "assets/img/cocoa.svg" },
  { id: 9, title: "Облепиховый чай", category: "notcoffee", price: 180, size: "400 мл", description: "Облепиха, мёд и апельсин. Согревает лучше пледа.", image: "assets/img/sea-buckthorn.svg", badge: "Сезон" },
  { id: 10, title: "Круассан", category: "desserts", price: 150, size: "80 г", description: "Французское тесто, 27 слоёв, хрустит с утра.", image: "assets/img/croissant.svg" },
  { id: 11, title: "Чизкейк «Вишня»", category: "desserts", price: 260, size: "140 г", description: "Нежный сливочный крем и кислая вишня сверху.", image: "assets/img/cheesecake.svg" },
  { id: 12, title: "Печенье с шоколадом", category: "desserts", price: 120, size: "2 шт", description: "Мягкое внутри, с кусочками тёмного шоколада.", image: "assets/img/cookies.svg" },
  { id: 13, title: "Зерно «Эфиопия»", category: "beans", price: 890, size: "250 г", description: "Ягоды и цветы. Для фильтра и эспрессо.", image: "assets/img/beans-ethiopia.svg" },
  { id: 14, title: "Зерно «Колумбия»", category: "beans", price: 850, size: "250 г", description: "Шоколад и орех. Для турки и кофемашины.", image: "assets/img/beans-colombia.svg" },
];
