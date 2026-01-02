# Telegram Bot Setup - Quick Guide

Быстрая инструкция по настройке Telegram-бота для TYT Foundation.

---

## Вариант 1: Личные уведомления (один админ)

### Шаг 1: Создайте бота

1. Откройте Telegram
2. Найдите: [@BotFather](https://t.me/BotFather)
3. Отправьте: `/newbot`
4. Bot name: `TYT Foundation Notifications`
5. Username: `tyt_foundation_bot` (или любое доступное)
6. **Скопируйте токен**: `1234567890:ABCdefGHIjklMNO...`

### Шаг 2: Получите ваш Chat ID

1. Найдите: [@userinfobot](https://t.me/userinfobot)
2. Отправьте: `/start`
3. **Скопируйте Id**: например `123456789`

### Шаг 3: Запустите вашего бота

1. Найдите вашего бота: `@tyt_foundation_bot`
2. Нажмите **Start**

### Шаг 4: Добавьте в Supabase Secrets

```
TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNO...
TELEGRAM_ADMIN_CHAT_ID = 123456789
```

**Готово!** Уведомления будут приходить вам лично.

---

## Вариант 2: Групповой чат (для команды)

### Шаг 1: Создайте бота (как в Варианте 1)

### Шаг 2: Создайте группу

1. Создайте новую группу в Telegram
2. Имя: `TYT Foundation Admin Chat`
3. Добавьте своего бота: `@tyt_foundation_bot`
4. Сделайте бота **администратором** группы (важно!)

### Шаг 3: Получите Chat ID группы

**Способ A: Через @RawDataBot**

1. Добавьте в группу: [@RawDataBot](https://t.me/RawDataBot)
2. Он отправит JSON
3. Найдите: `"id": -1001234567890` (число с минусом!)
4. **Скопируйте это число**: `-1001234567890`

**Способ B: Через API (если первый не работает)**

1. Отправьте любое сообщение в группу
2. Откройте в браузере:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
   Замените `<YOUR_BOT_TOKEN>` на токен вашего бота
3. Найдите: `"chat":{"id":-1001234567890,...}`
4. **Скопируйте chat id** (с минусом!)

### Шаг 4: Добавьте в Supabase Secrets

```
TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNO...
TELEGRAM_ADMIN_CHAT_ID = -1001234567890
```

**Важно**: Для групп chat_id **начинается с минуса**!

**Готово!** Уведомления будут приходить в групповой чат.

---

## Тестирование

### Тест через curl

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<YOUR_CHAT_ID>",
    "text": "🧪 Test from TYT Foundation notification system"
  }'
```

Если всё правильно — вы получите сообщение в Telegram.

### Тест через реальное обращение

1. Заполните Contact Form на сайте
2. Через 5-10 секунд должно прийти уведомление

---

## Формат уведомлений

Пример сообщения:

```
🚨 New Contact Submission

💬 TYPE: PARTNERSHIP PROPOSAL
👤 From: John Doe
📧 Email: john@example.com
🏢 Organization: Example Corp

📋 Subject: Partnership opportunity

💬 Message:
We would like to discuss a potential partnership...

🔗 ID: 3a7e4a4c
⏰ Jan 2, 2026, 2:34 PM

📊 View in Dashboard
```

Эмодзи меняются в зависимости от приоритета и типа обращения:

**Приоритет**:
- 🚨 Urgent
- ⚠️ High
- 📬 Normal
- 📝 Low

**Тип**:
- 💬 General Inquiry
- 🆘 Support Request
- 🤝 Partnership
- 💰 Donation
- 🔬 Research
- 📰 Media
- 🙋 Volunteer
- ⚙️ Technical
- 💭 Feedback

---

## Troubleshooting

### Уведомления не приходят

**Проверьте**:

1. Бот добавлен в чат (для групп)
2. Бот — администратор группы (для групп)
3. Chat ID правильный:
   - Личный чат: `123456789` (без минуса)
   - Группа: `-1001234567890` (с минусом!)
4. Секреты добавлены в Supabase
5. Edge Function `contact-notification` задеплоена

### Ошибка "Bot was blocked by the user"

Запустите вашего бота: найдите `@your_bot` в Telegram и нажмите `/start`

### Ошибка "Chat not found"

- Для личного чата: убедитесь, что вы запустили бота
- Для группы: убедитесь, что бот добавлен в группу как админ

### Ошибка "Unauthorized"

Неправильный `TELEGRAM_BOT_TOKEN`. Проверьте токен в Supabase Secrets.

---

## Дополнительные возможности (будущее)

В будущем можно добавить:

- Кнопки для быстрых действий ("Assign to me", "Mark as resolved")
- Ответ на обращение прямо из Telegram
- Статистика в Telegram по команде `/stats`
- Уведомления о донатах, новых статьях, грантах

---

**Готово! Telegram-уведомления настроены.**
