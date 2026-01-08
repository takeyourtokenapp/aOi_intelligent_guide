# TYT Foundation - Email System Complete Setup Guide

**Status**: ✅ READY TO USE (Need only RESEND_API_KEY)
**Updated**: January 8, 2026

---

## 🎯 Quick Summary

Email система ПОЛНОСТЬЮ настроена и готова к работе. Для активации нужно:

1. Получить `RESEND_API_KEY` от Resend.com
2. Добавить его в Supabase Secrets
3. Добавить email администраторов в БД
4. Готово!

---

## ✅ Что Уже Настроено

### Edge Functions (Deployed ✅)

1. **send-email**
   - ✅ Deployed с `verifyJWT: false` (исправлено)
   - ✅ CORS настроен правильно
   - ✅ Graceful fallback если нет API ключа
   - ✅ Логирование в `email_notifications`

2. **contact-notification**
   - ✅ Deployed с `verifyJWT: false`
   - ✅ Без хардкода URLs (использует env переменные)
   - ✅ HTML шаблоны EN + RU
   - ✅ Telegram notifications (опционально)

3. **ContactForm.tsx**
   - ✅ Вызывает edge function напрямую
   - ✅ Получает insertedData через `.select().single()`
   - ✅ Graceful error handling

### Database (Ready ✅)

- ✅ `contact_submissions` — 25 записей
- ✅ `email_notifications` — готова к логированию
- ✅ `admin_users` — структура готова
- ✅ `foundation_contact_info` — заполнена

---

## 🚀 Шаг 1: Получите RESEND_API_KEY

### Вариант A: Resend (Рекомендуется)

1. Зарегистрируйтесь: https://resend.com/signup
2. Перейдите в API Keys: https://resend.com/api-keys
3. Create API Key → `TYT Foundation Production`
4. Скопируйте ключ (показывается один раз!)

**Лимиты бесплатного плана:**
- ✅ 100 emails/день
- ✅ 3,000 emails/месяц
- ✅ Достаточно для старта

### Вариант B: Другие провайдеры

SendGrid, Mailgun, Amazon SES — требуют изменения кода в `send-email/index.ts`

---

## 🔐 Шаг 2: Добавьте API Key в Supabase

1. Откройте Supabase Dashboard
2. **Settings** → **Edge Functions** → **Secrets**
3. Add secret:
   - Name: `RESEND_API_KEY`
   - Value: ваш ключ от Resend
4. Save

---

## 👤 Шаг 3: Добавьте Администраторов

### Важно: Сначала создайте пользователей через Auth

Администраторы должны быть зарегистрированы в Supabase Auth.

**Option 1: Через Supabase Dashboard**
1. Authentication → Users → Add User
2. Email: `admin@tyt.foundation`
3. Password: (генерируется автоматически или установите свой)
4. Скопируйте User ID

**Option 2: Через вашу форму регистрации**
1. Зарегистрируйтесь на сайте как обычный пользователь
2. Найдите User ID в Supabase → Authentication → Users

### Затем добавьте в admin_users

```sql
-- Замените YOUR_USER_ID на реальный ID из auth.users
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  is_active
) VALUES (
  'YOUR_USER_ID',  -- UUID пользователя из auth.users
  'ceo',  -- или 'support_agent', 'moderator'
  'Admin Name',
  'admin@tyt.foundation',  -- Email куда приходят уведомления
  true
);
```

### Добавить несколько админов сразу:

```sql
INSERT INTO admin_users (user_id, admin_role, display_name, contact_email, is_active)
VALUES
  ('USER_ID_1', 'ceo', 'CEO Name', 'ceo@tyt.foundation', true),
  ('USER_ID_2', 'support_agent', 'Support Agent', 'support@tyt.foundation', true),
  ('USER_ID_3', 'moderator', 'Moderator', 'moderator@tyt.foundation', true);
```

### Проверьте:

```sql
SELECT
  au.display_name,
  au.contact_email,
  au.admin_role,
  au.is_active,
  u.email as auth_email
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
WHERE au.is_active = true;
```

---

## 📧 Шаг 4: Настройте Domain (Опционально)

Без домена emails отправляются от `onboarding@resend.dev`

С доменом — от `contact@tyt.foundation` (выглядит профессиональнее)

### В Resend Dashboard:

1. Domains → Add Domain
2. Введите `tyt.foundation`
3. Добавьте DNS записи:

```
Type: MX
Host: tyt.foundation
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10

Type: TXT
Host: tyt.foundation
Value: "v=spf1 include:amazonses.com ~all"

Type: TXT
Host: _dmarc.tyt.foundation
Value: "v=DMARC1; p=none; rua=mailto:contact@tyt.foundation"

Type: CNAME (показывается в Resend после добавления домена)
Host: resend._domainkey.tyt.foundation
Value: (копируется из Resend)
```

4. Wait 5-30 минут для верификации

---

## ✅ Как Система Работает

### Автоматический Flow:

```
1. Пользователь → Заполняет Contact Form
   ↓
2. ContactForm.tsx → Сохраняет в contact_submissions
   ↓
3. ContactForm.tsx → Вызывает contact-notification (напрямую)
   ↓
4. contact-notification → Вызывает send-email (2 раза):
   ├── Confirmation → Пользователю
   └── Admin Alert → Всем админам
   ↓
5. send-email → Отправляет через Resend API
   ↓
6. Логирует результат → email_notifications
```

### Что происходит если нет RESEND_API_KEY?

- ✅ Форма всё равно работает
- ✅ Данные сохраняются в БД
- ✅ Email логируются как "pending" в `email_notifications`
- ⚠️ Реальные email НЕ отправляются
- 💡 Вы можете отправить их вручную позже

---

## 🧪 Тестирование

### Тест 1: Contact Form

1. Откройте `/contact` на вашем сайте
2. Заполните форму своим email
3. Send Message
4. Проверьте:
   - ✅ Success сообщение в форме
   - ✅ Email подтверждение вам
   - ✅ Email уведомление админам
   - ✅ Запись в БД

### Тест 2: Проверка логов

```sql
-- Последние 10 отправок
SELECT
  recipient_email,
  subject,
  status,
  sent_at,
  error_message,
  created_at
FROM email_notifications
ORDER BY created_at DESC
LIMIT 10;

-- Ошибки отправки
SELECT * FROM email_notifications
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Тест 3: Edge Function Logs

Supabase Dashboard → Edge Functions → contact-notification → Logs

Должны видеть:
```
Confirmation email result: { success: true }
Admin emails sent: 1
```

---

## 🛡️ Безопасность

### Что Исправлено:

✅ **send-email**: `verifyJWT: false` — теперь можно вызывать с ANON_KEY
✅ **Нет хардкода URLs** — все через env переменные
✅ **CORS правильно настроен**
✅ **NULL safety** — все поля проверяются
✅ **Graceful degradation** — система работает даже без API ключа

### RLS Policies:

```sql
-- contact_submissions доступны только автору и админам
-- email_notifications только для авторизованных
-- admin_users защищены SERVICE_ROLE
```

---

## 📊 Мониторинг

### Email статистика:

```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'sent') as sent,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM email_notifications
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Среднее время ответа:

```sql
SELECT
  AVG(EXTRACT(EPOCH FROM (responded_at - created_at))/3600) as avg_hours
FROM contact_submissions
WHERE responded_at IS NOT NULL;
```

---

## 🐛 Troubleshooting

### Email не отправляются

**1. Проверьте RESEND_API_KEY**
```sql
-- В Supabase Dashboard:
-- Settings → Edge Functions → Secrets
-- Должен быть: RESEND_API_KEY
```

**2. Проверьте админов**
```sql
SELECT * FROM admin_users WHERE is_active = true;
-- Должен быть хотя бы один с contact_email
```

**3. Проверьте логи**
```bash
# В Supabase Dashboard:
# Edge Functions → send-email → Logs
```

**4. Проверьте Resend**
- https://resend.com/logs
- https://resend.com/status

### Email в спаме

**Решения:**
1. ✅ Настройте собственный домен (см. Шаг 4)
2. ✅ Добавьте SPF, DKIM, DMARC
3. ✅ Прогрейте домен (10-20 email в первый день)
4. ✅ Попросите пользователей добавить в whitelist

---

## 📝 SQL Helper Scripts

### Отправить email вручную:

```sql
-- Через HTTP запрос из БД (требует pg_net extension)
SELECT net.http_post(
  url := 'https://YOUR_PROJECT.supabase.co/functions/v1/send-email',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer YOUR_ANON_KEY'
  ),
  body := jsonb_build_object(
    'to', 'user@example.com',
    'subject', 'Test Email',
    'html', '<h1>Hello!</h1>'
  )
);
```

### Пометить pending email для отправки:

```sql
UPDATE email_notifications
SET status = 'pending', retry_count = 0
WHERE status = 'failed'
AND created_at >= NOW() - INTERVAL '24 hours';
```

### Очистить старые логи:

```sql
-- Удалить email логи старше 90 дней
DELETE FROM email_notifications
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 🎯 Чеклист Запуска

- [ ] RESEND_API_KEY добавлен в Supabase Secrets
- [ ] Хотя бы один админ добавлен с contact_email
- [ ] Contact form протестирована
- [ ] Email подтверждение получено
- [ ] Admin alert получен
- [ ] (Опционально) Домен настроен и верифицирован
- [ ] (Опционально) Telegram bot настроен

---

## 📞 Контакты и Поддержка

**Документация:**
- Resend: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

**Если нужна помощь:**
1. Проверьте логи в Supabase Dashboard
2. Проверьте email_notifications таблицу
3. Проверьте Resend logs

---

## 🚀 Следующие Шаги

После настройки базовых email:

1. **Newsletter система** — массовые рассылки
2. **Email templates** — готовые ответы админов
3. **Email analytics** — открытия, клики
4. **Scheduled emails** — отложенная отправка
5. **Auto-responses** — автоматические ответы по типам

---

**Система готова! Нужно только добавить RESEND_API_KEY и админов.**
