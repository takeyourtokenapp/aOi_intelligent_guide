# Добавление Первого Администратора

## Проблема
В базе нет пользователей в `auth.users`, поэтому нельзя добавить админа.

## Решение

### Шаг 1: Создать пользователя

**Вариант A: Через Supabase Dashboard (РЕКОМЕНДУЕТСЯ)**

1. Откройте: https://xshwjuwyuwrrxbrzccka.supabase.co
2. **Authentication** → **Users** → **Add User**
3. Заполните:
   ```
   Email: olekfribel@hotmail.com
   Password: (автоматически или свой)
   Auto Confirm User: ✅ ДА
   ```
4. **Create User**
5. Скопируйте **User ID** (UUID вида: `a1b2c3d4-e5f6-...`)

**Вариант B: Зарегистрироваться через сайт**

1. Откройте ваш сайт
2. Зарегистрируйтесь как обычный пользователь
3. Найдите User ID в Supabase → Authentication → Users

### Шаг 2: Добавить в admin_users

Выполните SQL (замените USER_ID):

```sql
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  is_active
) VALUES (
  'ВАШ_USER_ID_ИЗ_ШАГА_1',
  'ceo',
  'OlekF',
  'olekfribel@hotmail.com',
  true
);
```

### Шаг 3: Проверить

```sql
SELECT
  au.display_name,
  au.contact_email,
  au.admin_role,
  u.email as auth_email
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.is_active = true;
```

Должна показаться запись:
```
display_name | contact_email           | admin_role | auth_email
OlekF        | olekfribel@hotmail.com  | ceo        | olekfribel@hotmail.com
```

---

## После Добавления Админа

Email уведомления будут автоматически приходить на `olekfribel@hotmail.com` при каждом новом обращении через Contact Form!

**Важно:** Убедитесь что RESEND_API_KEY настроен (см. EMAIL_SYSTEM_SETUP_COMPLETE.md)
