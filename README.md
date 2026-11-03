# ORBITA — Apple texnikasi do‘koni

Reference asosida tayyorlangan, to‘liq o‘zbek tilidagi responsiv frontend. React 19, Vite 6, Tailwind CSS 4 va Lucide React. Mahsulot tasvirlari lokal SVG formatida: tashqi servislar, API kalitlari yoki backend kerak emas.

## Ishga tushirish

Node.js 22+ (24.22.1 bilan tekshirilgan) va npm kerak.

```bash
git clone https://github.com/sardoregamberdiyev/Apple-shop.git
cd Apple-shop
npm ci
npm run dev -- --port 5173 --strictPort
```

Buyruqlarni o‘z kompyuteringizda bajarganingizdan keyin: http://localhost:5173.
Bulut muhitining `localhost` manzili boshqa kompyuterdan bevosita ochilmaydi.

## Serversiz demo

Repozitoriydagi **demo.html** faylini yuklab olib, brauzerda ikki marta bosib oching. Node.js, server yoki internet kerak emas. Rasmlar, JavaScript va uslublar bitta faylga joylangan. Brauzerning lokal fayllar siyosatiga qarab savatchani qayta ochishda saqlash farq qilishi mumkin.

Demoni qayta yaratish:

```bash
npm run demo
```

```bash
npm run build
npm run preview -- --port 4173
```

## Imkoniyatlar

- Mahsulot nomi bo‘yicha qidiruv, bo‘sh natija holati.
- Kategoriyalar bo‘yicha filtrlash.
- Savatchaga qo‘shish, miqdorni o‘zgartirish, tozalash, jami narx.
- Savatchani brauzerning localStorage xotirasida saqlash.
- Mahsulot tanlash bo‘yicha interaktiv tavsiyalar.
- Klaviatura bilan boshqariladigan qidiruv va savatcha oynalari.
- Mobil menyu, responsiv kartalar va kamaytirilgan animatsiya rejimi.

Bu demo: haqiqiy buyurtma, to‘lov va yetkazib berish integratsiyasi yo‘q. Narxlar topshiriqdagi namunaga muvofiq rublda berilgan.

## Tuzilishi

`src/App.jsx` — sahifa, mahsulotlar va savatcha holati. `src/components/ShopPanels.jsx` — qidiruv, savatcha va maslahat oynalari. `src/styles.css` — Tailwind va moslashtirilgan dizayn. `public/images/` — mahalliy mahsulot tasvirlari.
