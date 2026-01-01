# TYT Foundation - Email System Setup Guide

**Status**: 🚧 Ready to Configure
**Date**: January 1, 2026

---

## Overview

Полная система email-коммуникации создана и готова к использованию. Вам нужно только настроить API-ключ от email-провайдера.

---

## Что Реализовано

### ✅ Edge Functions

**1. `send-email`** - Отправка email через Resend API
- Отправка email с HTML-шаблонами
- Автоматическое логирование в БД
- Обработка ошибок и повторные попытки
- Fallback в режим очереди если API-ключ не настроен

**2. `contact-notification`** - Автоматические уведомления
- Подтверждение пользователю при отправке формы
- Уведомление всем админам о новом обращении
- Красивые HTML-шаблоны на EN и RU
- Приоритетная маркировка (urgent/high/normal)

### ✅ Email Templates

**Confirmation Email (Пользователю)**:
- Благодарность за обращение
- Детали сообщения
- Ожидаемое время ответа (24-48 часов)
- Контактная информация
- Брендированный дизайн

**Admin Alert Email (Администраторам)**:
- Полная информация об обращении
- Приоритет и тип
- Прямая ссылка в Supabase Dashboard
- SQL-запрос для быстрого доступа
- Цветовая кодировка по приоритету

---

## Настройка: Пошаговая Инструкция

### Вариант 1: Resend (Рекомендуется)

**Почему Resend?**
- Официально рекомендован Supabase
- Простая интеграция
- 100 emails/день бесплатно
- 3000 emails/месяц на бесплатном плане
- Отличная доставляемость

#### Шаг 1: Создайте аккаунт Resend

1. Перейдите на https://resend.com
2. Зарегистрируйтесь (можно через GitHub)
3. Подтвердите email

#### Шаг 2: Получите API Key

1. В dashboard Resend: https://resend.com/api-keys
2. Нажмите "Create API Key"
3. Название: `TYT Foundation Production`
4. Permissions: `Sending access`
5. Скопируйте ключ (он показывается один раз!)

Пример: `re_123456789abcdefghijklmnop`

#### Шаг 3: Настройте домен (Опционально, но рекомендуется)

**Без домена**: Emails будут отправляться от `onboarding@resend.dev`

**С доменом** (для профессионального вида):

1. В Resend dashboard: https://resend.com/domains
2. Нажмите "Add Domain"
3. Введите `tyt.foundation`
4. Добавьте DNS-записи в настройки вашего домена:

```
Type: TXT
Name: @ или tyt.foundation
Value: v=spf1 include:amazonses.com ~all

Type: TXT
Name: _dmarc.tyt.foundation
Value: v=DMARC1; p=none; rua=mailto:contact@tyt.foundation

Type: CNAME
Name: resend._domainkey.tyt.foundation
Value: resend._domainkey.u123456789.wl123.sendgrid.net
```

5. Дождитесь верификации (обычно 5-30 минут)

После верификации emails будут отправляться от `contact@tyt.foundation`!

#### Шаг 4: Добавьте API Key в Supabase

1. Откройте Supabase Dashboard: https://xshwjuwyuwrrxbrzccka.supabase.co
2. Перейдите в **Settings** → **Edge Functions** → **Secrets**
3. Добавьте новый секрет:
   - **Name**: `RESEND_API_KEY`
   - **Value**: ваш API-ключ от Resend
4. Нажмите **Save**

#### Шаг 5: Deploy Edge Functions

Выполните в терминале:

```bash
# Deploy send-email function
supabase functions deploy send-email

# Deploy contact-notification function
supabase functions deploy contact-notification
```

Или через Supabase Dashboard:
1. **Edge Functions** → **Deploy new function**
2. Выберите файл `supabase/functions/send-email/index.ts`
3. Повторите для `contact-notification`

#### Шаг 6: Настройка Database Webhook (Автоматическая отправка)

Чтобы email отправлялись автоматически при новых обращениях:

1. В Supabase Dashboard: **Database** → **Webhooks**
2. Нажмите **Create a new hook**
3. Настройки:
   - **Name**: `contact_submission_notification`
   - **Table**: `contact_submissions`
   - **Events**: ☑️ Insert
   - **Type**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/contact-notification`
   - **Headers**:
     ```
     Authorization: Bearer YOUR_SUPABASE_ANON_KEY
     Content-Type: application/json
     ```
4. Нажмите **Create webhook**

Теперь при каждом новом обращении автоматически:
- Пользователь получает подтверждение
- Все админы получают уведомление

---

## Тестирование

### Тест 1: Отправка Email вручную

Выполните через Supabase SQL Editor:

```sql
-- Вызов send-email функции напрямую
SELECT extensions.http_post(
  url := 'https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/send-email',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer YOUR_ANON_KEY'
  ),
  body := jsonb_build_object(
    'to', 'your-test-email@example.com',
    'subject', 'Test Email from TYT Foundation',
    'html', '<h1>Hello!</h1><p>This is a test email.</p>'
  )
);
```

### Тест 2: Отправка через Contact Form

1. Откройте http://localhost:5173/contact (или ваш домен)
2. Заполните форму
3. Нажмите "Send Message"
4. Проверьте:
   - Email-подтверждение пришло пользователю
   - Email-уведомление пришло админам
   - Запись появилась в `email_notifications`

### Тест 3: Проверка логов

```sql
-- Все отправленные email
SELECT
  recipient_email,
  subject,
  status,
  sent_at,
  error_message
FROM email_notifications
ORDER BY created_at DESC
LIMIT 20;
```

---

## Управление Email

### Просмотр очереди email

```sql
-- Pending emails (в очереди)
SELECT * FROM email_notifications
WHERE status = 'pending'
ORDER BY created_at;

-- Failed emails (ошибки)
SELECT * FROM email_notifications
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Повторная отправка failed email

```sql
-- Найти failed email
SELECT id, recipient_email, subject, error_message
FROM email_notifications
WHERE status = 'failed'
LIMIT 5;

-- Пометить для повторной отправки
UPDATE email_notifications
SET status = 'pending', retry_count = retry_count + 1
WHERE id = 'EMAIL_ID_HERE';
```

### Ручная отправка ответа пользователю

```sql
-- Вызов send-email для ответа
SELECT extensions.http_post(
  url := 'https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/send-email',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer YOUR_ANON_KEY'
  ),
  body := jsonb_build_object(
    'to', 'user@example.com',
    'subject', 'Re: Your inquiry about partnerships',
    'html', '<p>Dear User,</p><p>Thank you for your interest...</p>',
    'replyTo', 'partnerships@tyt.foundation',
    'submissionId', 'SUBMISSION_ID_HERE'
  )
);

-- Обновить статус обращения
UPDATE contact_submissions
SET
  status = 'resolved',
  admin_response = 'Responded via email',
  responded_at = now(),
  resolved_at = now()
WHERE id = 'SUBMISSION_ID_HERE';
```

---

## Вариант 2: Другие Email-провайдеры

Если не хотите использовать Resend, можно использовать:

### SendGrid
- 100 emails/день бесплатно
- API: https://sendgrid.com/docs/api-reference/
- Нужно адаптировать код в `send-email/index.ts`

### Mailgun
- 100 emails/день бесплатно первые 3 месяца
- API: https://documentation.mailgun.com/en/latest/api_reference.html

### Amazon SES
- 62,000 emails/месяц бесплатно (если отправка через EC2)
- Требует верификации домена

---

## Email-адреса администраторов

Чтобы админы получали уведомления, добавьте их email:

```sql
-- Обновить email для существующего админа
UPDATE admin_users
SET contact_email = 'admin@tyt.foundation'
WHERE user_id = 'YOUR_USER_ID';

-- Или при создании нового админа
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  is_active
) VALUES (
  'USER_ID',
  'support_agent',
  'Support Agent Name',
  'support@tyt.foundation',
  true
);
```

---

## Шаблоны Email (Customization)

Шаблоны находятся в `supabase/functions/contact-notification/index.ts`.

### Добавление Hebrew (עברית) шаблонов

```typescript
he: {
  confirmation: {
    subject: "קיבלנו את הודעתך - TYT Foundation",
    html: (data: ContactSubmission) => `
      // Hebrew HTML template
    `,
  },
}
```

### Изменение дизайна

Отредактируйте HTML в шаблонах. Используйте inline CSS для совместимости.

---

## Monitoring & Analytics

### Dashboard метрики

```sql
-- Email stats за последние 30 дней
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_sent,
  COUNT(*) FILTER (WHERE status = 'sent') as successful,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM email_notifications
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Самые активные получатели
SELECT
  recipient_email,
  COUNT(*) as email_count,
  MAX(sent_at) as last_email
FROM email_notifications
WHERE status = 'sent'
GROUP BY recipient_email
ORDER BY email_count DESC
LIMIT 10;

-- Response time (среднее время ответа)
SELECT
  AVG(EXTRACT(EPOCH FROM (cs.responded_at - cs.created_at))/3600) as avg_response_hours
FROM contact_submissions cs
WHERE cs.responded_at IS NOT NULL;
```

---

## Troubleshooting

### Email не отправляются

**1. Проверьте API-ключ**:
```sql
-- В Supabase Dashboard: Settings → Edge Functions → Secrets
-- Убедитесь что RESEND_API_KEY установлен
```

**2. Проверьте логи функции**:
```bash
# В Supabase Dashboard: Edge Functions → send-email → Logs
# Или через CLI:
supabase functions logs send-email
```

**3. Проверьте статус Resend**:
- https://resend.com/status
- https://resend.com/logs (в вашем аккаунте)

### Email попадают в спам

**Решения**:
1. Настройте собственный домен (см. Шаг 3)
2. Добавьте SPF, DKIM, DMARC записи
3. "Прогрейте" домен (отправьте 10-20 email в первый день)
4. Просите пользователей добавить в белый список

### Webhook не срабатывает

**Проверьте**:
1. Webhook активен: `Database → Webhooks → contact_submission_notification`
2. URL правильный: `https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/contact-notification`
3. Headers установлены правильно
4. Проверьте логи: `Database → Webhooks → Logs`

---

## Лимиты и Цены

### Resend Free Tier
- ✅ 100 emails/день
- ✅ 3,000 emails/месяц
- ✅ 1 домен
- ✅ Email API
- ❌ Нет поддержки

### Resend Pro ($20/месяц)
- ✅ 50,000 emails/месяц
- ✅ Unlimited домены
- ✅ Priority support
- ✅ Advanced analytics

Для большинства стартапов Free Tier достаточно на первые месяцы.

---

## Следующие шаги

### ✅ Сейчас доступно:
- Автоматические подтверждения пользователям
- Уведомления админам о новых обращениях
- Логирование всех email в БД
- Красивые HTML-шаблоны

### 🚧 Можно добавить:
- Newsletter система
- Email-кампании
- Response templates (готовые ответы)
- Email analytics dashboard
- A/B testing email-шаблонов
- Scheduled emails (запланированные)
- Email верификация пользователей
- 2FA через email

---

## Quick Start Checklist

- [ ] Создать аккаунт Resend
- [ ] Получить API-ключ
- [ ] Добавить RESEND_API_KEY в Supabase Secrets
- [ ] Deploy Edge Functions
- [ ] Настроить Database Webhook
- [ ] Добавить email админам в `admin_users`
- [ ] Обновить email в `foundation_contact_info`
- [ ] Протестировать через Contact Form
- [ ] (Опционально) Настроить собственный домен

---

**После настройки**: Каждое обращение через Contact Form будет автоматически:
1. Отправлять подтверждение пользователю
2. Уведомлять всех админов
3. Логироваться в БД для аудита

**Вся система работает автоматически, без вашего участия!**

---

## Поддержка

Если нужна помощь:
- Документация Resend: https://resend.com/docs
- Документация Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Supabase Discord: https://discord.supabase.com

---

**Система готова к использованию. Нужна только настройка API-ключа!**
