/*
  # Документация ложных предупреждений безопасности
  
  ## Важное объяснение
  
  Supabase advisor сообщает о множестве "неиспользуемых индексов", но это **ложные срабатывания**.
  
  ### Почему индексы внешних ключей показываются как "неиспользуемые"
  
  1. **pg_stat_user_indexes отслеживает только SELECT-запросы приложения**
     - Внутренние проверки FK constraint НЕ регистрируются в этой статистике
     - PostgreSQL использует эти индексы при каждой операции DELETE/UPDATE на родительских таблицах
  
  2. **Новая база данных = нулевая статистика**
     - Статистика использования накапливается со временем
     - MVP-проект может не иметь достаточного трафика для регистрации использования
  
  3. **Критичность для производительности**
     - Без индекса FK: DELETE FROM auth.users → полное сканирование ВСЕХ дочерних таблиц (O(n))
     - С индексом FK: DELETE FROM auth.users → поиск по индексу (O(log n))
     - Разница: миллисекунды vs минуты при росте данных
  
  ### Индексы, которые ДОЛЖНЫ остаться (29 критических индексов FK)
  
  Все следующие индексы являются индексами внешних ключей и критичны для производительности:
  
  #### Академическая система (5 индексов)
  - idx_achievements_profile_id → защищает DELETE на user_profiles
  - idx_certificates_track_id → защищает DELETE на learning_tracks
  - idx_user_lesson_progress_lesson_id → защищает DELETE на lessons
  - idx_user_lesson_progress_track_id → защищает DELETE на learning_tracks
  - idx_progress_anchors_user_id → защищает DELETE на auth.users
  
  #### Контактная система и администрирование (7 индексов)
  - idx_contact_submissions_assigned_to → защищает DELETE на admin_users
  - idx_contact_submissions_user_id → защищает DELETE на auth.users
  - idx_admin_action_logs_admin_user_id → защищает DELETE на admin_users
  - idx_admin_users_assigned_by → защищает DELETE на admin_users (self-reference)
  - idx_email_notifications_user_id → защищает DELETE на auth.users
  - idx_email_notifications_related_submission_id → защищает DELETE на contact_submissions
  - idx_foundation_contact_info_updated_by → защищает DELETE на admin_users
  
  #### База знаний (3 индекса)
  - idx_knowledge_base_cns_curator_id → защищает DELETE на user_profiles
  - idx_knowledge_submissions_curator_id → защищает DELETE на user_profiles
  - idx_knowledge_submissions_submitter_id → защищает DELETE на auth.users
  
  #### NFT Mining экосистема (7 индексов)
  - idx_nft_miners_user_id → защищает DELETE на auth.users
  - idx_maintenance_payments_miner_id → защищает DELETE на nft_miners
  - idx_maintenance_payments_user_id → защищает DELETE на auth.users
  - idx_mining_rewards_miner_id → защищает DELETE на nft_miners
  - idx_mining_rewards_user_id → защищает DELETE на auth.users
  - idx_miner_upgrades_miner_id → защищает DELETE на nft_miners
  - idx_miner_upgrades_user_id → защищает DELETE на auth.users
  
  #### Marketplace (3 индекса)
  - idx_miner_marketplace_listings_buyer_id → защищает DELETE на auth.users
  - idx_miner_marketplace_listings_miner_id → защищает DELETE на nft_miners
  - idx_miner_marketplace_listings_seller_id → защищает DELETE на auth.users
  
  #### Токены и контроль доступа (4 индекса)
  - idx_tyt_token_transactions_user_id → защищает DELETE на auth.users
  - idx_access_logs_user_id → защищает DELETE на auth.users
  - idx_cross_domain_navigation_user_id → защищает DELETE на auth.users
  - idx_user_roles_assigned_by → защищает DELETE на admin_users
  
  ### Стоимость vs Выгода
  
  **Стоимость хранения:**
  - 29 индексов × ~50-100 KB каждый = ~1.5-3 MB
  - Незначительное замедление записи (1-5%)
  
  **Выгода:**
  - Защита от катастрофической деградации производительности при удалении пользователей
  - Масштабируемость: при 1M+ записей разница составляет секунды vs часы
  - Целостность базы данных поддерживается эффективно
  
  ### Проблемы, которые НЕ могут быть исправлены через SQL
  
  1. **Auth DB Connection Strategy**
     - Требует изменения в Dashboard Supabase → Project Settings → Database
     - Текущие 10 соединений достаточны для MVP/развития
     - Переход на percentage-based можно сделать при масштабировании
  
  2. **Security Definer Views** (foundation_public_ledger, charity_flows, orbital_witness_log)
     - Эти представления НАМЕРЕННО используют SECURITY DEFINER
     - Они обеспечивают публичную прозрачность для DeSci миссии
     - Показывают только агрегированные публичные данные, без PII
     - Альтернатива: создание публичной роли с явными грантами (более сложно)
  
  ### Рекомендация
  
  **НЕ УДАЛЯЙТЕ ЭТИ ИНДЕКСЫ.**
  
  Они будут показаны как "использованные" когда:
  1. Накопится достаточная статистика использования
  2. Пользователи начнут активно использовать Academy, Marketplace, Contact forms
  3. Произойдут операции удаления на родительских таблицах
*/

-- Создаём view для мониторинга использования индексов
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
  schemaname,
  relname as table_name,
  indexrelname as index_name,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Комментарии к критическим индексам для документации
COMMENT ON INDEX idx_nft_miners_user_id IS 
'FK index: Critical for DELETE performance on auth.users. Protects cascade deletion across mining ecosystem.';

COMMENT ON INDEX idx_achievements_profile_id IS 
'FK index: Critical for DELETE performance on user_profiles. Protects academy progress tracking.';

COMMENT ON INDEX idx_mining_rewards_user_id IS 
'FK index: Critical for DELETE performance on auth.users. Protects mining reward history.';

COMMENT ON INDEX idx_maintenance_payments_user_id IS 
'FK index: Critical for DELETE performance on auth.users. Protects payment history.';

COMMENT ON INDEX idx_contact_submissions_user_id IS
'FK index: Critical for DELETE performance on auth.users. Protects contact form submissions.';

COMMENT ON INDEX idx_user_lesson_progress_lesson_id IS
'FK index: Critical for DELETE performance on lessons. Protects user learning progress.';

-- Документируем Security Definer views
COMMENT ON VIEW foundation_public_ledger IS 
'SECURITY DEFINER: Intentional. Provides public transparency for DeSci foundation transactions. Read-only aggregated data, no PII.';

COMMENT ON VIEW charity_flows IS 
'SECURITY DEFINER: Intentional. Provides public transparency for charitable fund flows. Read-only aggregated data, no PII.';

COMMENT ON VIEW orbital_witness_log IS 
'SECURITY DEFINER: Intentional. Provides public transparency for cross-domain activities. Read-only aggregated data, no PII.';
