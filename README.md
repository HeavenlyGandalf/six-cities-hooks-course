# Шесть городов

Учебное React-приложение для поиска жилья в аренду.

## Требования

- Node.js 24.15 или новее (версия указана в `.nvmrc`: `nvm use`).

## Запуск

```bash
npm install
cp .env.example .env.local   # сюда же ключ VITE_YANDEX_MAPS_KEY
npm start
```

## Скрипты

| Команда | Что делает |
|---------|------------|
| `npm start`, `npm run dev` | dev-сервер Vite |
| `npm run build` | проверка типов, затем production-сборка в `dist/` |
| `npm run preview` | раздаёт собранный `dist/` |
| `npm run lint` | ESLint по `src` (пресет htmlacademy и react-hooks) |
| `npm run typecheck` | проверка типов TypeScript 7 (`npx tsc` запускает версию 6, им типы не проверять) |
| `npm test` | тесты Vitest один раз |

## Переменные окружения

`.env.local` не коммитится. Пример — в `.env.example`:

- `VITE_YANDEX_MAPS_KEY` — ключ JS API 3.0 Яндекс Карт;
- `VITE_API_JITTER` — режим задержек и ошибок учебного сервера (`false` по умолчанию).
