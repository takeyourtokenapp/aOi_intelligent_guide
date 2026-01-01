# TYT Foundation - Система Коммуникации и Управления

**Дата**: 1 января 2026
**Статус**: ✅ База данных готова | 🚧 UI в разработке

---

## ЧТО УЖЕ РЕАЛИЗОВАНО

### 1. База Данных для Контактов

#### **Таблица: `contact_submissions`**
Все обращения пользователей сохраняются автоматически:

- **Типы обращений**:
  - Общие вопросы (general_inquiry)
  - Запросы поддержки (support_request)
  - Предложения о партнёрстве (partnership_proposal)
  - Вопросы о пожертвованиях (donation_inquiry)
  - Научное сотрудничество (research_collaboration)
  - Медиа-запросы (media_inquiry)
  - Волонтёрство (volunteer)
  - Технические проблемы (technical_issue)
  - Обратная связь (feedback)

- **Информация сохраняется**:
  - Имя, email, организация, телефон
  - Тема и сообщение
  - Язык (EN/RU/HE)
  - IP-адрес, user agent (для безопасности)
  - Автоматический приоритет (urgent/high/normal/low)
  - Статус обработки (new/in_progress/resolved)

#### **Таблица: `admin_users`**
Ваша команда администраторов:

- **Роли**:
  - CEO (вы) - полный доступ ко всему
  - Moderator - модерация контента
  - Support Agent - ответы на обращения
  - Content Curator - управление знаниями
  - Financial Manager - управление пожертвованиями
  - Research Coordinator - координация исследований

#### **Таблица: `email_notifications`**
Очередь email-уведомлений:
- Автоматические подтверждения
- Уведомления для администраторов
- Ответы пользователям
- Новостные рассылки

#### **Таблица: `foundation_contact_info`**
Публичная контактная информация:
- Email-адреса (общий, поддержка, партнёрства, пресса)
- Телефоны
- Социальные сети (Twitter, LinkedIn, Telegram)
- Часы работы
- Юридическая информация

#### **Таблица: `admin_action_logs`**
Полный аудит всех действий администраторов:
- Кто что сделал
- Когда
- Какие изменения внёс

### 2. Contact Form (Форма Обратной Связи)

**Компонент**: `src/components/ContactForm.tsx`

Полнофункциональная форма с:
- Выбором типа обращения
- Мультиязычностью (EN/RU)
- Валидацией данных
- Автоматическим сохранением в БД
- Уведомлением об успешной отправке

**Страница**: `src/pages/ContactPage.tsx`

Красивая страница контактов с:
- Формой обратной связи
- Отображением контактной информации из БД
- Email-адресами по категориям
- Часами работы поддержки

### 3. Безопасность

**Row Level Security (RLS)** настроен:
- ✅ Любой может отправить обращение
- ✅ Пользователи видят только свои обращения
- ✅ Только администраторы видят все обращения
- ✅ Только CEO может управлять командой админов
- ✅ Все действия логируются

---

## КАК ВЫ (CEO) МОЖЕТЕ РАБОТАТЬ С СИСТЕМОЙ

### Вариант 1: Через Supabase Dashboard (СЕЙЧАС)

**URL**: https://xshwjuwyuwrrxbrzccka.supabase.co

#### Шаг 1: Добавьте себя как CEO

```sql
-- Сначала найдите ваш user_id
SELECT id, email FROM auth.users WHERE email = 'ваш-email@example.com';

-- Затем добавьте себя как CEO
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  permissions
) VALUES (
  'ВАШ_USER_ID',
  'ceo',
  'Ваше Имя',
  'ceo@tyt.foundation',
  '{
    "view_all_submissions": true,
    "respond_to_inquiries": true,
    "manage_users": true,
    "manage_donations": true,
    "manage_research": true,
    "publish_content": true
  }'::jsonb
);
```

#### Шаг 2: Смотрите все обращения

```sql
-- Все новые обращения
SELECT
  id,
  submission_type,
  sender_name,
  sender_email,
  subject,
  message,
  priority,
  created_at
FROM contact_submissions
WHERE status = 'new'
ORDER BY priority DESC, created_at DESC;
```

#### Шаг 3: Отвечайте на обращения

```sql
-- Отметить обращение как обработанное
UPDATE contact_submissions
SET
  status = 'resolved',
  admin_response = 'Ваш ответ пользователю',
  responded_at = now(),
  resolved_at = now(),
  assigned_to = 'ВАШ_USER_ID'
WHERE id = 'ID_ОБРАЩЕНИЯ';
```

### Вариант 2: Admin Dashboard UI (СКОРО)

Мы можем построить полноценный админ-интерфейс:

```
https://takeyourtoken.app/admin/
├── /dashboard        - обзор метрик
├── /submissions      - все обращения (таблица + фильтры)
├── /respond          - быстрые ответы
├── /users            - управление пользователями
├── /donations        - управление пожертвованиями
├── /content          - публикация контента
└── /settings         - настройки фонда
```

**Возможности**:
- Фильтры по типу, статусу, приоритету
- Быстрые ответы (шаблоны)
- Назначение задач команде
- Статистика ответов
- Экспорт отчётов

---

## КАК ПОЛЬЗОВАТЕЛИ МОГУТ СВЯЗАТЬСЯ С ВАМИ

### 1. Через Contact Form на сайте

**URL** (добавьте в навигацию): `/contact`

Пользователь заполняет форму → данные сохраняются в БД → вы получаете уведомление (если настроен email)

### 2. Прямые Email-адреса

Обновите эти адреса в БД:

```sql
UPDATE foundation_contact_info
SET
  primary_email = 'contact@tyt.foundation',
  support_email = 'support@tyt.foundation',
  partnerships_email = 'partnerships@tyt.foundation',
  press_email = 'press@tyt.foundation',
  primary_phone = '+XXX-XXX-XXXX'
WHERE id = (SELECT id FROM foundation_contact_info LIMIT 1);
```

Эти email-адреса автоматически отображаются на странице `/contact`.

### 3. Социальные сети

Добавьте ссылки:

```sql
UPDATE foundation_contact_info
SET
  twitter_url = 'https://twitter.com/tytfoundation',
  linkedin_url = 'https://linkedin.com/company/tytfoundation',
  telegram_username = '@tytfoundation',
  discord_invite = 'https://discord.gg/your-invite'
WHERE id = (SELECT id FROM foundation_contact_info LIMIT 1);
```

---

## ЧТО ДАЛЬШЕ: ROADMAP

### ✅ Готово
- [x] База данных для обращений
- [x] Contact Form компонент
- [x] Contact Page
- [x] RLS Security
- [x] Admin roles система
- [x] Audit logging

### 🚧 В разработке
- [ ] Admin Dashboard UI
- [ ] Email автоответы (Edge Functions)
- [ ] Response templates
- [ ] Team assignment workflow
- [ ] Статистика и отчёты

### 📋 Следующие шаги
- [ ] Newsletter система
- [ ] User notifications
- [ ] Mobile app admin panel
- [ ] Telegram bot для уведомлений
- [ ] AI-assisted response suggestions (aOi)

---

## ИНСТРУМЕНТЫ УПРАВЛЕНИЯ УЖЕ РЕАЛИЗОВАНЫ

### 1. Foundation Statistics

**Обновление метрик фонда**:

```sql
UPDATE foundation_statistics
SET
  total_donated = 150000,
  families_supported = 25,
  research_grants = 8,
  clinical_trials = 3,
  partner_hospitals = 12,
  updated_at = now();
```

Эти данные автоматически отображаются на:
- FoundationPage (`/foundation`)
- HomePage (статистика)
- FoundationStats компонент

### 2. Research Posts

**Публикация исследований**:

```sql
INSERT INTO research_posts (
  slug,
  title_en,
  title_ru,
  content_en,
  content_ru,
  post_type,
  tags,
  author,
  featured
) VALUES (
  'new-research-2026',
  'Title in English',
  'Заголовок на русском',
  'Full content in English...',
  'Полный текст на русском...',
  'research',
  ARRAY['medulloblastoma', 'pediatric', 'AI'],
  'aOi',
  true
);
```

### 3. Donations Tracking

**Просмотр пожертвований**:

```sql
SELECT
  amount,
  currency,
  usd_equivalent,
  donor_name,
  transaction_hash,
  status,
  created_at
FROM foundation_donations
ORDER BY created_at DESC;
```

### 4. User Progress

**Мониторинг прогресса пользователей**:

```sql
SELECT
  level,
  COUNT(*) as users,
  AVG(level_progress) as avg_progress,
  SUM(foundation_contribution) as total_contributions
FROM user_progress
GROUP BY level;
```

### 5. Access Control

**Проверка активности**:

```sql
SELECT
  DATE(timestamp) as date,
  COUNT(*) as total_actions,
  COUNT(DISTINCT user_id) as unique_users
FROM access_logs
GROUP BY DATE(timestamp)
ORDER BY date DESC
LIMIT 30;
```

---

## ЧТОБЫ tyt.foundation СООТВЕТСТВОВАЛ ЗАЯВЛЕННЫМ ДАННЫМ

### Что нужно ОБЯЗАТЕЛЬНО заполнить:

#### 1. Контактная информация (КРИТИЧНО!)

```sql
-- Обновите реальными данными
UPDATE foundation_contact_info SET
  primary_email = 'ваш-реальный-email@tyt.foundation',
  legal_entity_name = 'Полное юридическое название фонда',
  tax_id = 'ИНН или Tax ID',
  registration_number = 'Номер регистрации',
  registration_country = 'Страна регистрации',
  office_address = 'Реальный адрес офиса (если есть)'
WHERE id = (SELECT id FROM foundation_contact_info LIMIT 1);
```

#### 2. Статистика фонда

```sql
-- Укажите РЕАЛЬНЫЕ цифры
UPDATE foundation_statistics SET
  total_donated = 0,              -- Начните с 0 или реальной суммы
  families_supported = 0,          -- Реальное количество
  research_grants = 0,             -- Выделенные гранты
  clinical_trials = 0,             -- Поддерживаемые исследования
  partner_hospitals = 0,           -- Партнёрские клиники
  updated_at = now();
```

#### 3. Партнёры и коллаборации

```sql
-- Добавьте реальных партнёров (например, I-QCC)
INSERT INTO research_collaborations (
  name,
  type,
  status,
  description_en,
  description_ru,
  website
) VALUES (
  'I-QCC Quantum Computing Center',
  'research',
  'active',
  'Partnership for quantum computing research in pediatric oncology',
  'Партнёрство для квантовых вычислений в педиатрической онкологии',
  'https://i-qcc.example.com'
);
```

#### 4. Первый грант (если есть)

```sql
INSERT INTO foundation_grants (
  title,
  description_en,
  description_ru,
  amount_usd,
  institution,
  status
) VALUES (
  'Medulloblastoma Research Grant 2026',
  'Research into Group 3 medulloblastoma treatment',
  'Исследование лечения медуллобластомы Group 3',
  50000,
  'Hospital Name or Research Institute',
  'proposed'
);
```

#### 5. Публикация Manifesto

У вас уже есть I-QCC Manifesto в БД. Убедитесь, что он:
- Правильно отображается на `/foundation` (вкладка Manifesto)
- Переведён на нужные языки
- Содержит актуальную информацию

---

## ВАЖНО: Юридическая Чистота

### Что указывать на сайте:

1. **Статус фонда**:
   - Если фонд ещё не зарегистрирован → укажите "In Formation" / "В процессе регистрации"
   - Если зарегистрирован → укажите полные юридические данные

2. **Пожертвования**:
   - Если фонд не зарегистрирован → НЕ принимайте пожертвования напрямую
   - Используйте "Coming Soon" или "Launching 2026"
   - Можете показывать ПЛАНИРУЕМОЕ использование средств

3. **Медицинские заявления**:
   - ❌ НЕ говорите "мы лечим"
   - ✅ Говорите "мы финансируем исследования"
   - ✅ "Мы поддерживаем семьи"
   - ✅ "Мы строим инфраструктуру для науки"

4. **Прозрачность**:
   - Публикуйте отчёты (даже если пока нулевые)
   - Показывайте, куда пойдут средства
   - Объясняйте процесс отбора грантов

---

## СЛЕДУЮЩИЙ ШАГ: Что Сделать Прямо Сейчас

### 1. Добавьте себя как CEO в admin_users
### 2. Обновите реальные email-адреса
### 3. Установите начальные (честные) метрики фонда
### 4. Добавьте страницу Contact в навигацию
### 5. Решите: нужен ли Admin Dashboard UI?

---

## Нужна Помощь?

### Я могу создать:

1. **Admin Dashboard UI** - полноценный интерфейс управления
2. **Email Automation** - автоответы и уведомления через Edge Functions
3. **Response Templates** - шаблоны ответов на частые вопросы
4. **Analytics Dashboard** - графики и отчёты
5. **Mobile Admin App** - управление с телефона
6. **aOi Integration** - ИИ-помощник для ответов на обращения

### Что вы хотите реализовать дальше?

---

**Текущий статус**: Вся инфраструктура для коммуникации готова. Теперь нужно заполнить реальными данными и начать использовать.
