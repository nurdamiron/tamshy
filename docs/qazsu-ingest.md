# Ingest реальных данных в Tamshy

Дата: 2026-05-07
Связанный документ: [docs/qazsu-integration.md](./qazsu-integration.md)

Этот документ описывает, как наполнить таблицы `News`, `WaterObject` и `Project` (Qazsu-поля) **реальными данными** из официальных источников.

---

## 1. Источники данных

| Источник | URL | Статус | Метод |
|---|---|---|---|
| Каталог водных объектов | qazsu.gov.kz / Қазгидромет | вручную в seed | `prisma/seed-water-objects.ts` (~70 объектов) |
| Новости министерства | gov.kz/memleket/entities/water | SPA, без публичного API | `scripts/ingest-govkz-news.ts` (Playwright) |
| Instagram министерства | instagram.com/su_resurstari_ministrligi | закрытая платформа | см. раздел 3 |
| Открытые данные РК | data.egov.kz | JSON API | runbook раздел 4 |

---

## 2. gov.kz news ingest

### 2.1 Почему не работает простой fetch

`https://www.gov.kz/memleket/entities/water/press/news/details/{id}?lang=ru` отдаёт пустую SPA-обёртку:

```html
<!doctype html><html>...
<div id="root"></div>
<script src="/static/js/main.*.js"></script>
```

Контент рендерится клиентским React после XHR к приватному API (мы обнаружили `/api/v2/public-data` POST, но без публичного контракта). `og:image`, `og:title`, `og:description` тоже подставляются клиентом.

Вывод: для реального ингеста **нужен headless-браузер**.

### 2.2 Запуск ingest-скрипта

```bash
# 1. Установи Playwright (один раз)
npm i -D playwright
npx playwright install chromium

# 2. Подготовь список URL'ов в scripts/govkz-urls.txt
#    (откройте https://www.gov.kz/memleket/entities/water/press/news/1?lang=ru
#     и скопируйте ссылки на статьи)

# 3. Dry-run, чтобы посмотреть что распарсилось
npx tsx scripts/ingest-govkz-news.ts --mode=playwright \
  --file=scripts/govkz-urls.txt --dry-run

# 4. Реальный импорт
npx tsx scripts/ingest-govkz-news.ts --mode=playwright \
  --file=scripts/govkz-urls.txt
```

Скрипт идемпотентен: повторный запуск обновит существующие записи (по `fileUrl`).

### 2.3 Структура записи в News

| Поле | Значение |
|---|---|
| `title` | `<title>` страницы (обрезается до 290 символов) |
| `content` | первые 500 символов основного блока, либо title если пусто |
| `category` | `VIDEO` если URL содержит "video"/"youtube", `PHOTO` если "photo"/"gallery", иначе `NEWS` |
| `imageUrl` | `og:image` после рендера |
| `fileUrl` | оригинальный URL gov.kz (используется как natural key для идемпотентности) |
| `createdAt` | дата из текста статьи, парсится по шаблону DD.MM.YYYY |

### 2.4 Cron автоматизация

После ручной проверки можно повесить ежедневный pull:

```bash
# crontab -e
0 6 * * * cd /opt/tamshy && \
  npx tsx scripts/ingest-govkz-news.ts --mode=playwright \
  --file=/opt/tamshy/scripts/govkz-urls.txt >> /var/log/tamshy-ingest.log 2>&1
```

URL'ы можно автоматически собирать через тот же Playwright со страницы `/press/news/1` — это следующий шаг.

---

## 3. Instagram (su_resurstari_ministrligi)

### 3.1 Реальность

Instagram **не даёт легально скрапить публичные посты** без партнёрской интеграции:

- **Graph API** (официальный): требует Instagram Business Account, Facebook Developer App, OAuth с разрешениями `instagram_basic`. Для **чужого** аккаунта нужно App Review + одобрение Meta. Срок: 4–8 недель. Доступ только к собственным/связанным бизнес-аккаунтам.
- **oEmbed API**: даёт только embed-код для конкретного публичного поста по URL. Не позволяет листать ленту.
- **Неофициальные скраперы** (instaloader, instagram-private-api): нарушают ToS, ломаются при каждом изменении Instagram, риск бана IP/аккаунта, юридически серая зона.
- **Платные сервисы** (Apify, Phantombuster, RapidAPI): $30–100/мес, тоже периодически ломаются.

### 3.2 Рекомендация

**Не интегрироваться напрямую.** Вместо этого — три практичных варианта:

**Вариант A — Embed по URL (бесплатно, легально, простой)**
- Админ вставляет URL поста Instagram в админ-форму "Добавить новость".
- Сервер делает запрос к Instagram oEmbed (`https://api.instagram.com/oembed?url=...`) и сохраняет HTML embed-код в `News.content`.
- На фронте embed-блок рендерится через `<blockquote class="instagram-media">` + `embed.js`.
- **Минус:** нужен access_token от Facebook App (бесплатный). Embed работает только для публичных постов.

**Вариант B — RSS через посредника (платный)**
- Сервис типа [rss.app](https://rss.app) или [zapier.com](https://zapier.com) умеет следить за Instagram-аккаунтом и отдавать RSS.
- В Tamshy ставится cron, который читает RSS и кладёт записи в `News`.
- **Минус:** $5–15/мес, посредник может упасть.

**Вариант C — Договориться с министерством напрямую**
- Министерство ведёт собственный канал в Instagram → пусть подключат [Meta Business Suite cross-posting](https://business.facebook.com), тогда тот же контент автоматически попадёт в Facebook Page министерства.
- У Facebook Pages есть **публичный** Graph API без App Review для постов с ключом доступа страницы → проще.
- **Минус:** нужно действие со стороны министерства.

### 3.3 Решение для MVP

Делаем **Вариант A** + **ручная вставка ссылок** как fallback:

1. В `/admin/news` добавляется поле "Instagram URL" — админ вставляет URL поста.
2. Сервер вызывает oEmbed → получает embed HTML, превью-картинку, текст.
3. Сохраняет в `News` с `category=PHOTO` или `VIDEO`, `imageUrl=превью`, `fileUrl=оригинал`.
4. На фронте `dangerouslySetInnerHTML` для блока с класса `instagram-media` + одноразовый skript-инжект `embed.js`.

**Когда делать:** этот функционал не входит в текущий спринт. Сейчас в `qazsu-ingest.md` описана стратегия — реализация по приоритету министерства.

---

## 4. Открытые данные data.egov.kz

Портал [data.egov.kz](https://data.egov.kz) содержит официальные датасеты в JSON. Поиск по `water` или `су` даёт:

- Списки гидротехнических сооружений по областям
- Реестры водопользователей
- Реестры водных объектов

API:
```
GET https://data.egov.kz/api/v4/{dataset_code}?apiKey=YOUR_KEY&page=1
```

Ключ выдаётся бесплатно после регистрации. Это **самый чистый источник** для будущего расширения `WaterObject`.

Скрипт под это **не написан** — нужно сначала выбрать конкретные dataset_code и получить API-ключ. Это next step, не блокер.

---

## 5. Чек-лист выкатки реальных данных

- [x] `prisma/seed-water-objects.ts` — 70+ объектов (рукописный seed на основе открытых описаний)
- [x] `scripts/backfill-qazsu.ts` — region→basin для существующих проектов
- [x] `scripts/ingest-govkz-news.ts` — заготовка под Playwright-ingest
- [x] `scripts/govkz-urls.txt` — стартовый список из 4 проверенных URL'ов
- [ ] Установить Playwright и прогнать первый ingest
- [ ] Получить API-ключ data.egov.kz и подключить датасет ГТС
- [ ] Договориться с министерством о Facebook Page bridge (Вариант C для Instagram)
