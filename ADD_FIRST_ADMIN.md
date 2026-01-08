# Добавление Администраторов

## ХОРОШИЕ НОВОСТИ

Система упрощена! Теперь можно добавлять администраторов напрямую по email, без создания пользователей в auth.users.

## Текущий Статус

**Уже настроен первый администратор:**
- Email: olekfribel@hotmail.com
- Роль: CEO
- Статус: Активен

Все уведомления о новых обращениях будут приходить на этот email!

## Добавить Нового Администратора

### Простой Способ (БЕЗ создания auth пользователя)

Выполните SQL в Supabase Dashboard:

```sql
INSERT INTO admin_users (
  user_id,          -- NULL = не требуется auth пользователь!
  admin_role,       -- 'ceo', 'support_agent', 'moderator'
  display_name,
  contact_email,    -- Email для уведомлений
  is_active
) VALUES (
  NULL,
  'support_agent',
  'Имя Администратора',
  'admin@example.com',
  true
);
```

### Продвинутый Способ (С auth пользователем)

Если хотите, чтобы администратор мог логиниться:

1. Создайте пользователя в Supabase Dashboard → Authentication → Users
2. Скопируйте User ID
3. Выполните:

```sql
INSERT INTO admin_users (
  user_id,          -- UUID из auth.users
  admin_role,
  display_name,
  contact_email,
  is_active
) VALUES (
  'USER_ID_ИЗ_AUTH',
  'support_agent',
  'Имя Администратора',
  'admin@example.com',
  true
);
```

## Проверить Администраторов

```sql
SELECT
  display_name,
  contact_email,
  admin_role,
  is_active,
  created_at
FROM admin_users
WHERE is_active = true
ORDER BY created_at DESC;
```

---

## После Добавления Админа

Email уведомления будут автоматически приходить на `olekfribel@hotmail.com` при каждом новом обращении через Contact Form!

**Важно:** Убедитесь что RESEND_API_KEY настроен (см. EMAIL_SYSTEM_SETUP_COMPLETE.md)
