# TYT Foundation - Production Deployment Guide

**Status**: Ready for Production
**Last Updated**: January 2, 2026

---

## Критически важно

Эта инструкция описывает **правильный и безопасный** процесс деплоя email и Telegram-уведомлений.

**Главный принцип**: Секреты НИКОГДА не хранятся в коде. Только в Supabase Secrets.

---

## Архитектура

```
User заполняет форму
         ↓
Insert в contact_submissions (Supabase)
         ↓
Database Webhook триггерится
         ↓
Edge Function: contact-notification
         ↓
┌─────────────────────────────────────────┐
│ 1. Вызов send-email → пользователю      │
│ 2. Вызов send-email → всем админам      │
│ 3. Отправка в Telegram (если настроено) │
└─────────────────────────────────────────┘
         ↓
Все логируется в email_notifications
```

**Всё работает автоматически. Нулевое вмешательство после настройки.**

---

## Шаг 1: Получение API-ключей и токенов

### 1.1 Resend API Key (для email)

**Зачем**: Отправка email с красивыми HTML-шаблонами

**Как получить**:

1. Зарегистрируйтесь на https://resend.com (бесплатно)
2. Перейдите: https://resend.com/api-keys
3. Нажмите **Create API Key**
4. Параметры:
   - Name: `TYT Foundation Production`
   - Permission: `Sending access`
5. **Скопируйте ключ немедленно** (показывается один раз!)

Формат ключа: `re_123abc456def789...`

**Лимиты Free Tier**:
- 100 emails/день
- 3,000 emails/месяц
- Достаточно для старта

### 1.2 Telegram Bot Token (для уведомлений админам)

**Зачем**: Мгновенные уведомления в Telegram при новых обращениях

**Как получить**:

1. Откройте Telegram
2. Найдите бота: [@BotFather](https://t.me/BotFather)
3. Отправьте: `/newbot`
4. Следуйте инструкциям:
   - Bot name: `TYT Foundation Notifications`
   - Username: `tyt_foundation_bot` (или любое доступное)
5. **Скопируйте токен**

Формат токена: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### 1.3 Telegram Chat ID (куда слать уведомления)

**Вариант A: Личный чат (для одного админа)**

1. Найдите бота: [@userinfobot](https://t.me/userinfobot)
2. Запустите его: `/start`
3. Он покажет ваш `Id` (например: `123456789`)

**Вариант B: Групповой чат (для команды)**

1. Создайте группу в Telegram
2. Добавьте в неё своего бота (созданного через @BotFather)
3. Добавьте бота: [@RawDataBot](https://t.me/RawDataBot)
4. @RawDataBot покажет JSON с `"id"` группы (например: `-1001234567890`)
5. Используйте это число как CHAT_ID

**Важно**: Для групп chat_id **начинается с минуса** (например: `-1001234567890`)

---

## Шаг 2: Настройка Supabase Secrets

**Где**: Supabase Dashboard → Project `xshwjuwyuwrrxbrzccka` → **Settings** → **Edge Functions** → **Secrets**

### Добавьте 3 секрета:

| Secret Name | Example Value | Required |
|-------------|---------------|----------|
| `RESEND_API_KEY` | `re_abc123...` | ✅ Yes |
| `TELEGRAM_BOT_TOKEN` | `1234567890:ABC...` | ⚠️ Optional |
| `TELEGRAM_ADMIN_CHAT_ID` | `123456789` or `-1001234567890` | ⚠️ Optional |

**Как добавить**:

1. Нажмите **Add new secret**
2. **Name**: `RESEND_API_KEY`
3. **Value**: (вставьте ваш ключ от Resend)
4. Нажмите **Save**
5. Повторите для Telegram-секретов

**Проверка**:
- Секреты **НЕ ВИДНЫ** после сохранения (это нормально!)
- Они доступны только внутри Edge Functions через `Deno.env.get()`

**Важно**: Если Telegram не настроен, уведомления просто не будут отправляться (без ошибок).

---

## Шаг 3: Deploy Edge Functions

### 3.1 Проверка файлов

Убедитесь, что файлы существуют:

```bash
ls -la supabase/functions/send-email/index.ts
ls -la supabase/functions/contact-notification/index.ts
```

Оба файла должны быть на месте.

### 3.2 Deploy через Supabase Dashboard

**Для функции `send-email`**:

1. Откройте Supabase Dashboard: https://xshwjuwyuwrrxbrzccka.supabase.co
2. Перейдите: **Edge Functions** (в боковом меню)
3. Нажмите **Deploy new function**
4. Параметры:
   - **Function name**: `send-email`
   - **Import method**: `From file`
   - **Select file**: `supabase/functions/send-email/index.ts`
5. Нажмите **Deploy**
6. Дождитесь завершения (30-60 секунд)
7. Проверьте статус: должен быть **Active** (зелёный)

**Для функции `contact-notification`**:

1. Снова нажмите **Deploy new function**
2. Параметры:
   - **Function name**: `contact-notification`
   - **Import method**: `From file`
   - **Select file**: `supabase/functions/contact-notification/index.ts`
3. Нажмите **Deploy**
4. Дождитесь завершения
5. Проверьте статус: должен быть **Active**

### 3.3 Проверка деплоя

В списке **Edge Functions** должны быть:

```
✅ send-email               Active    Last deployed: just now
✅ contact-notification     Active    Last deployed: just now
```

**Если статус `Error`**:

1. Кликните на функцию
2. Откройте вкладку **Logs**
3. Посмотрите сообщения об ошибках
4. Частые проблемы:
   - Синтаксическая ошибка в коде
   - Неправильный импорт
   - Отсутствует секрет (функция всё равно задеплоится, но логи покажут ошибку при вызове)

### 3.4 Получите URL функций

После деплоя URL будут:

```
https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/send-email
https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/contact-notification
```

Запишите их — понадобятся для webhook.

---

## Шаг 4: Настройка Database Webhook

**Зачем**: Автоматически вызывать `contact-notification` при новом обращении

### 4.1 Получите Anon Key

1. В Supabase Dashboard: **Settings** → **API**
2. Найдите секцию **Project API keys**
3. Скопируйте **anon / public** ключ

Формат: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (длинная строка)

### 4.2 Создайте Webhook

1. В Supabase Dashboard: **Database** → **Webhooks**
2. Нажмите **Create a new hook**
3. Параметры:

**Basic Settings**:
- **Name**: `contact_submission_notification`
- **Table**: `contact_submissions`
- **Events**: ☑️ `Insert` (только INSERT, остальные галки снять)

**HTTP Request**:
- **Type**: `HTTP Request`
- **Method**: `POST`
- **URL**: `https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/contact-notification`

**HTTP Headers** (нажмите **Add header**):
```
Authorization: Bearer YOUR_ANON_KEY_HERE
Content-Type: application/json
```

Замените `YOUR_ANON_KEY_HERE` на ваш anon key из шага 4.1.

**Advanced** (можно оставить дефолтные):
- Timeout: 1000ms (1 секунда)
- HTTP Parameters: (пусто)

4. Нажмите **Create webhook**

### 4.3 Проверка webhook

После создания webhook появится в списке:

```
✅ contact_submission_notification    contact_submissions    INSERT    Active
```

**Тест webhook**:

1. Кликните на webhook
2. Откройте вкладку **Logs** (пока пусто)
3. Оставьте эту вкладку открытой для следующего шага

---

## Шаг 5: Обновление контактных email-адресов

**SQL-запрос**:

```sql
-- Обновить email-адреса фонда
UPDATE foundation_contact_info
SET
  primary_email = 'contact@tyt.foundation',
  support_email = 'support@tyt.foundation',
  partnerships_email = 'partnerships@tyt.foundation',
  press_email = 'press@tyt.foundation',
  updated_at = now()
WHERE id = (SELECT id FROM foundation_contact_info LIMIT 1);
```

**Как выполнить**:

1. В Supabase Dashboard: **SQL Editor**
2. Нажмите **New query**
3. Вставьте SQL выше
4. Нажмите **Run** (или Ctrl+Enter)
5. Результат: `UPDATE 1` (успешно)

**Проверка**:

```sql
SELECT primary_email, support_email, partnerships_email
FROM foundation_contact_info;
```

Должно показать:
```
primary_email           | support_email              | partnerships_email
------------------------+----------------------------+---------------------------
contact@tyt.foundation  | support@tyt.foundation     | partnerships@tyt.foundation
```

---

## Шаг 6: Добавление администраторов

Чтобы админы получали email-уведомления, добавьте их в таблицу `admin_users`:

```sql
-- Пример: добавить CEO
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  permissions,
  is_active
) VALUES (
  'YOUR_USER_ID_HERE',  -- UUID из auth.users
  'ceo',
  'Your Name',
  'your-email@tyt.foundation',
  '{
    "view_all_submissions": true,
    "respond_to_inquiries": true,
    "manage_users": true,
    "manage_donations": true,
    "manage_research": true,
    "publish_content": true
  }'::jsonb,
  true
);
```

**Как получить user_id**:

```sql
-- Показать всех пользователей
SELECT id, email FROM auth.users;
```

Скопируйте нужный `id` и вставьте в запрос выше.

**Добавление нескольких админов**:

```sql
-- Support Agent
INSERT INTO admin_users (user_id, admin_role, display_name, contact_email, is_active)
VALUES ('USER_ID_2', 'support_agent', 'Support Agent Name', 'support@tyt.foundation', true);

-- Content Curator
INSERT INTO admin_users (user_id, admin_role, display_name, contact_email, is_active)
VALUES ('USER_ID_3', 'content_curator', 'Curator Name', 'curator@tyt.foundation', true);
```

**Проверка**:

```sql
SELECT display_name, admin_role, contact_email, is_active
FROM admin_users
WHERE is_active = true;
```

---

## Шаг 7: Тестирование системы

### 7.1 Тест через SQL (вставка тестовой записи)

```sql
-- Вставить тестовое обращение
INSERT INTO contact_submissions (
  submission_type,
  sender_name,
  sender_email,
  subject,
  message,
  language,
  priority
) VALUES (
  'general_inquiry',
  'Test User',
  'your-test-email@example.com',  -- ЗАМЕНИТЕ на ваш email!
  'Test Subject - Please Ignore',
  'This is a test message to verify the notification system works correctly.',
  'en',
  'normal'
);
```

**Что должно произойти** (в течение 5-10 секунд):

1. ✅ Email придёт на `your-test-email@example.com` (подтверждение)
2. ✅ Email придёт всем админам (уведомление)
3. ✅ Telegram-сообщение придёт в чат (если настроено)
4. ✅ Запись появится в `email_notifications`

### 7.2 Проверка Webhook Logs

1. **Database** → **Webhooks** → `contact_submission_notification`
2. Откройте вкладку **Logs**
3. Должна быть запись:

```
✅ 200 OK    2026-01-02 12:34:56    POST /functions/v1/contact-notification
```

Если `500 Error` — кликните на запись и посмотрите ошибку.

### 7.3 Проверка Edge Function Logs

1. **Edge Functions** → `contact-notification`
2. Откройте вкладку **Logs**
3. Должны быть записи:

```
Confirmation email result: { success: true, message: "Email sent successfully" }
Telegram notification sent successfully
```

Если есть ошибки — читайте их внимательно.

### 7.4 Проверка email_notifications

```sql
-- Последние 10 отправленных email
SELECT
  recipient_email,
  subject,
  status,
  sent_at,
  error_message
FROM email_notifications
ORDER BY created_at DESC
LIMIT 10;
```

Должно быть:
- 1 запись со статусом `sent` для пользователя
- 1+ записей со статусом `sent` для админов

Если статус `failed` — смотрите `error_message`.

### 7.5 Тест через реальную форму

1. Откройте http://localhost:5173/contact (или ваш продакшн-домен)
2. Заполните форму своими данными
3. Нажмите **Send Message**
4. Проверьте:
   - ✅ Форма показала "Message sent successfully"
   - ✅ Email пришёл вам (подтверждение)
   - ✅ Email пришёл админам
   - ✅ Telegram-уведомление (если настроено)

---

## Шаг 8: Настройка собственного домена в Resend (Опционально)

**Зачем**: Вместо `onboarding@resend.dev` использовать `contact@tyt.foundation`

### 8.1 Добавьте домен в Resend

1. Откройте Resend Dashboard: https://resend.com/domains
2. Нажмите **Add Domain**
3. Введите: `tyt.foundation`
4. Resend покажет DNS-записи

### 8.2 DNS-записи (примеры)

Добавьте эти записи в DNS-настройки вашего домена (например, в Cloudflare, Namecheap, GoDaddy):

**SPF (для защиты от спама)**:
```
Type: TXT
Name: @ или tyt.foundation
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

**DKIM (подпись отправителя)**:
```
Type: CNAME
Name: resend._domainkey.tyt.foundation
Value: resend._domainkey.u123456789.wl123.sendgrid.net
TTL: 3600
```

**DMARC (политика безопасности)**:
```
Type: TXT
Name: _dmarc.tyt.foundation
Value: v=DMARC1; p=none; rua=mailto:contact@tyt.foundation
TTL: 3600
```

**MX Record (если хотите получать email)**:
```
Type: MX
Name: @ или tyt.foundation
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 3600
```

### 8.3 Верификация

1. Подождите 5-30 минут (пока DNS обновится)
2. В Resend Dashboard обновите страницу
3. Статус домена должен стать: **Verified** ✅

### 8.4 Обновите `from` в функции (опционально)

После верификации домена отредактируйте `send-email/index.ts`:

```typescript
from: from || "TYT Foundation <contact@tyt.foundation>",
```

Пересоберите функцию (повторите Шаг 3).

---

## Шаг 9: Мониторинг и обслуживание

### 9.1 Dashboard метрики

```sql
-- Статистика за последние 7 дней
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_submissions,
  COUNT(*) FILTER (WHERE status = 'new') as new,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent
FROM contact_submissions
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 9.2 Email delivery stats

```sql
-- Email-статистика
SELECT
  status,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM email_notifications
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY status
ORDER BY count DESC;
```

### 9.3 Проверка failed email

```sql
-- Последние неудачные отправки
SELECT
  recipient_email,
  subject,
  error_message,
  retry_count,
  created_at
FROM email_notifications
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

### 9.4 Среднее время ответа

```sql
-- Среднее время от обращения до ответа
SELECT
  AVG(EXTRACT(EPOCH FROM (responded_at - created_at)) / 3600)::numeric(10,2) as avg_response_hours
FROM contact_submissions
WHERE responded_at IS NOT NULL
AND created_at >= NOW() - INTERVAL '30 days';
```

---

## Troubleshooting

### Проблема: Email не отправляются

**Проверьте**:

1. `RESEND_API_KEY` установлен в Supabase Secrets
2. Логи функции `send-email`:
   ```
   Edge Functions → send-email → Logs
   ```
3. Статус в `email_notifications`:
   ```sql
   SELECT status, error_message FROM email_notifications ORDER BY created_at DESC LIMIT 5;
   ```

**Частые ошибки**:

- `401 Unauthorized` → неправильный API-ключ
- `400 Bad Request` → невалидный email-адрес в `to`
- `Resend API key not set` → ключ не добавлен в Secrets

### Проблема: Webhook не срабатывает

**Проверьте**:

1. Webhook активен:
   ```
   Database → Webhooks → contact_submission_notification → Status: Active
   ```
2. Webhook Logs показывают вызовы:
   ```
   Database → Webhooks → contact_submission_notification → Logs
   ```
3. URL webhook правильный:
   ```
   https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/contact-notification
   ```
4. Header `Authorization` установлен с правильным anon key

**Если webhook показывает ошибку**:

- `404 Not Found` → функция не задеплоена или неправильный URL
- `401 Unauthorized` → неправильный anon key в заголовке
- `500 Internal Error` → ошибка в функции, смотрите логи Edge Function

### Проблема: Telegram-уведомления не приходят

**Проверьте**:

1. Секреты установлены:
   ```
   Settings → Edge Functions → Secrets
   TELEGRAM_BOT_TOKEN: да/нет
   TELEGRAM_ADMIN_CHAT_ID: да/нет
   ```
2. Бот добавлен в чат (для групповых чатов)
3. Chat ID правильный:
   - Для личного чата: положительное число (например: `123456789`)
   - Для группового чата: отрицательное число (например: `-1001234567890`)
4. Логи функции:
   ```
   Edge Functions → contact-notification → Logs
   ```
   Ищите: `Telegram notification sent successfully` или ошибки

**Тест Telegram-бота вручную**:

```bash
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "YOUR_CHAT_ID", "text": "Test from TYT Foundation"}'
```

### Проблема: Email попадают в спам

**Решения**:

1. ✅ Настройте собственный домен (Шаг 8)
2. ✅ Добавьте SPF, DKIM, DMARC записи
3. ✅ Не используйте спам-слова в subject/body
4. ✅ Попросите получателей добавить в белый список
5. ✅ "Прогрейте" домен (отправьте 10-20 email вручную в первые дни)

---

## Security Best Practices

**✅ Что сделано правильно**:

- Секреты хранятся в Supabase Secrets (не в коде)
- RLS включен на всех таблицах
- Webhook использует anon key (не service role key)
- Edge Functions проверяют разрешения
- Логирование всех действий

**⚠️ Что нужно делать регулярно**:

- Ротация API-ключей каждые 6-12 месяцев
- Проверка логов на подозрительную активность
- Обновление зависимостей функций
- Резервное копирование БД

---

## Finalization Checklist

Перед запуском в продакшн убедитесь:

### Secrets
- [ ] `RESEND_API_KEY` добавлен в Supabase Secrets
- [ ] `TELEGRAM_BOT_TOKEN` добавлен (опционально)
- [ ] `TELEGRAM_ADMIN_CHAT_ID` добавлен (опционально)

### Edge Functions
- [ ] `send-email` задеплоена и статус **Active**
- [ ] `contact-notification` задеплоена и статус **Active**
- [ ] Логи функций не показывают критических ошибок

### Database
- [ ] Webhook `contact_submission_notification` создан и **Active**
- [ ] Webhook Logs показывают успешные вызовы (200 OK)
- [ ] Email-адреса в `foundation_contact_info` обновлены
- [ ] Хотя бы один админ добавлен в `admin_users`

### Testing
- [ ] Тест через SQL прошёл успешно
- [ ] Email-подтверждение пришло пользователю
- [ ] Email-уведомление пришло админам
- [ ] Telegram-уведомление пришло (если настроено)
- [ ] Тест через реальную форму прошёл

### Production
- [ ] Домен настроен в Resend (опционально)
- [ ] DNS-записи добавлены и верифицированы
- [ ] Мониторинг dashboard проверен
- [ ] Инструкция по ручным ответам готова

---

## Поддержка

**Документация**:
- Resend: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Telegram Bot API: https://core.telegram.org/bots/api

**Если что-то не работает**:

1. Проверьте логи (Edge Functions + Webhook)
2. Проверьте статус в `email_notifications`
3. Проверьте секреты
4. Используйте SQL-тесты выше
5. Посмотрите Troubleshooting секцию

---

**Система готова к продакшн-использованию после выполнения всех шагов!**

**Время настройки**: 20-30 минут для базовой конфигурации.
