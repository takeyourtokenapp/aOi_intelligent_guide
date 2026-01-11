# Настройка OpenAI API Key для генерации Embeddings

> **Статус**: ⚠️ ТРЕБУЕТСЯ ДЕЙСТВИЕ
> **Приоритет**: КРИТИЧЕСКИЙ - блокирует активацию aOi
> **Время**: 5 минут

---

## Проблема

При попытке генерации embeddings получена ошибка:
```json
{"success":false,"error":"[object Object]"}
```

Причина: **OPENAI_API_KEY не настроен** в Supabase Edge Functions secrets.

---

## Текущее состояние embeddings

```
CNS Knowledge Base:    0/24  embeddings (0%)
Web3 Knowledge Base:   0/15  embeddings (0%)
Lessons (English):     0/16  embeddings (0%)
──────────────────────────────────────────
Total:                 0/55  embeddings (0%)
```

**Без embeddings aOi не может выполнять семантический поиск.**

---

## Решение: Настройка OpenAI API Key

### Шаг 1: Получить OpenAI API Key

1. Зайдите на https://platform.openai.com/api-keys
2. Войдите в аккаунт (или создайте новый)
3. Нажмите "Create new secret key"
4. Скопируйте ключ (он выглядит как `sk-proj-...`)
5. **ВАЖНО**: Сохраните ключ в безопасном месте (его нельзя будет увидеть повторно)

### Шаг 2: Добавить ключ в Supabase

#### Вариант A: Через Supabase Dashboard (Рекомендуется)

1. Откройте https://supabase.com/dashboard
2. Выберите проект: **xshwjuwyuwrrxbrzccka**
3. Перейдите в **Settings** → **Edge Functions**
4. Найдите секцию **Secrets**
5. Нажмите **Add new secret**
6. Введите:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-...` (ваш ключ из Шага 1)
7. Нажмите **Save**

#### Вариант B: Через Supabase CLI

```bash
# Установите Supabase CLI (если ещё не установлен)
npm install -g supabase

# Войдите в аккаунт
supabase login

# Привяжите проект
supabase link --project-ref xshwjuwyuwrrxbrzccka

# Добавьте секрет
supabase secrets set OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
```

### Шаг 3: Проверить настройку

После добавления ключа, выполните команду:

```bash
curl -X POST https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/batch-generate-embeddings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaHdqdXd5dXdycnhicnpjY2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NjU4NjMsImV4cCI6MjA4MjM0MTg2M30.4Qy_B1cckFprGVvoHxJcWeMiuYGsth6gyBMHMl3lDwc" \
  -H "Content-Type: application/json"
```

**Ожидаемый результат** (через 3-5 минут):
```json
{
  "success": true,
  "timestamp": "2026-01-11T...",
  "results": {
    "cns": { "total": 24, "processed": 24, "failed": 0, "successRate": "100.0%" },
    "web3": { "total": 15, "processed": 15, "failed": 0, "successRate": "100.0%" },
    "lessons": { "total": 16, "processed": 16, "failed": 0, "successRate": "100.0%" }
  },
  "totalProcessed": 55,
  "totalFailed": 0
}
```

---

## Стоимость генерации embeddings

### OpenAI Pricing (text-embedding-3-small)
- **Модель**: text-embedding-3-small (1536 dimensions)
- **Цена**: $0.00002 за 1K tokens
- **Средняя статья**: ~500 tokens
- **55 записей**: ~27,500 tokens

**Итоговая стоимость**: ~$0.55 (максимум $1)

### Ежемесячные затраты
После первичной генерации:
- Новый контент: ~$0.10/месяц (5-10 новых статей)
- Query embeddings: ~$5-10/месяц (1000 запросов пользователей)
- **Итого**: ~$5-11/месяц

---

## Альтернативное решение (временное)

Если у вас нет OpenAI аккаунта прямо сейчас, можно использовать другие embedding модели:

### Hugging Face (бесплатно)
```typescript
// В batch-generate-embeddings/index.ts
// Замените OpenAI на Hugging Face Inference API
const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('HUGGINGFACE_API_KEY')}`
  },
  body: JSON.stringify({ inputs: text })
});
```

**Минусы**:
- Размерность 384 (вместо 1536) - менее точный поиск
- Медленнее
- Требует изменений в SQL схеме

**Рекомендация**: Используйте OpenAI для продакшена.

---

## Устранение проблем

### Ошибка: "Rate limit exceeded"
**Решение**: OpenAI имеет лимиты запросов. Если вы на Free Tier:
- Tier 1: 3,500 requests/minute
- Для 55 записей это не проблема

Если всё равно ошибка:
```bash
# Добавьте задержку между запросами
# В batch-generate-embeddings/index.ts добавьте:
await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
```

### Ошибка: "Invalid API key"
**Решение**: Проверьте, что ключ:
1. Начинается с `sk-proj-` (новые ключи) или `sk-` (старые)
2. Скопирован полностью без пробелов
3. Правильно добавлен в Supabase secrets

### Ошибка: "Model not found"
**Решение**: Проверьте, что используется правильное название модели:
- ✅ `text-embedding-3-small`
- ❌ `text-embedding-ada-002` (старая модель, дороже)

---

## После успешной генерации

### Проверка результатов

```sql
-- Проверьте покрытие embeddings
SELECT
  'CNS' as kb,
  COUNT(*) as total,
  COUNT(embedding) as with_embeddings,
  ROUND(100.0 * COUNT(embedding) / COUNT(*), 1) as coverage_pct
FROM knowledge_base_cns
UNION ALL
SELECT 'Web3', COUNT(*), COUNT(embedding), ROUND(100.0 * COUNT(embedding) / COUNT(*), 1)
FROM knowledge_base_web3
UNION ALL
SELECT 'Lessons', COUNT(*), COUNT(embedding_en), ROUND(100.0 * COUNT(embedding_en) / COUNT(*), 1)
FROM lessons;
```

**Ожидаемый результат**: 100% покрытие для всех трёх баз знаний.

### Тестирование aOi RAG

```bash
# Тест медицинского запроса
curl -X POST https://xshwjuwyuwrrxbrzccka.supabase.co/functions/v1/aoi-rag-query \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is medulloblastoma?",
    "domain": "foundation",
    "language": "en"
  }'
```

**Ожидаемый результат**: Ответ с релевантными источниками из CNS knowledge base.

---

## Важные замечания

1. **Безопасность**: Никогда не коммитьте API ключи в Git
2. **Ротация ключей**: Меняйте ключи каждые 3-6 месяцев
3. **Мониторинг**: Следите за использованием в OpenAI Dashboard
4. **Лимиты**: Установите spending limits в OpenAI ($10-20/месяц)
5. **Бэкапы**: Сохраните embeddings в отдельное хранилище (опционально)

---

## Статус выполнения

- [ ] **Получить OpenAI API Key**
- [ ] **Добавить ключ в Supabase Secrets**
- [ ] **Запустить batch-generate-embeddings**
- [ ] **Проверить покрытие embeddings (100%)**
- [ ] **Протестировать aOi RAG запросы**
- [ ] **Обновить документацию с результатами**

**Как только эти шаги выполнены, aOi будет полностью активирована!**

---

## Контакты и поддержка

**Вопросы по OpenAI**:
- Документация: https://platform.openai.com/docs/guides/embeddings
- Support: https://help.openai.com

**Вопросы по Supabase**:
- Документация Edge Functions: https://supabase.com/docs/guides/functions
- Secrets Management: https://supabase.com/docs/guides/functions/secrets

**Проект TYT**:
- См. PROJECT_STATUS_REPORT.md для общего статуса
- См. NEXT_STEPS.md для дальнейших действий

---

**Создано**: 11 января 2026
**Статус**: ⚠️ Требуется действие пользователя
**Приоритет**: КРИТИЧЕСКИЙ
