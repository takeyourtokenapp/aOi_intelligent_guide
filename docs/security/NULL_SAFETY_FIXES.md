# NULL Safety Fixes - Contact Notification Function

**Applied**: January 4, 2026

## Problem

The `contact-notification` Edge Function could crash with `TypeError` when database fields contain NULL values, specifically:
- `support_email`
- `partnerships_email`
- `press_email`
- Optional contact submission fields

## Solution

### 1. Added TypeScript Interface for Contact Info

```typescript
interface ContactInfo {
  primary_email: string;
  support_email: string | null;
  partnerships_email: string | null;
  press_email: string | null;
  primary_phone: string | null;
  whatsapp_number: string | null;
  telegram_username: string | null;
}
```

### 2. Dynamic Database Fetching

Changed from hardcoded email addresses to **dynamic fetching** from `foundation_contact_info` table:

**Before**:
```html
<li>📧 <a href="mailto:contact@tyt.foundation">contact@tyt.foundation</a></li>
<li>💼 <a href="mailto:partnerships@tyt.foundation">partnerships@tyt.foundation</a></li>
```

**After**:
```html
<li>📧 <a href="mailto:${contactInfo.primary_email}">${contactInfo.primary_email}</a></li>
${contactInfo.support_email ? `<li>🆘 <a href="mailto:${contactInfo.support_email}">${contactInfo.support_email}</a></li>` : ''}
${contactInfo.partnerships_email ? `<li>💼 <a href="mailto:${contactInfo.partnerships_email}">${contactInfo.partnerships_email}</a></li>` : ''}
```

### 3. NULL Safety Layer

Added `safeContactInfo` object with NULL coalescing:

```typescript
const safeContactInfo: ContactInfo = {
  primary_email: contactInfo.primary_email || 'contact@tyt.foundation',
  support_email: contactInfo.support_email || null,
  partnerships_email: contactInfo.partnerships_email || null,
  press_email: contactInfo.press_email || null,
  primary_phone: contactInfo.primary_phone || null,
  whatsapp_number: contactInfo.whatsapp_number || null,
  telegram_username: contactInfo.telegram_username || null,
};
```

### 4. Admin Email Filtering

Fixed admin email extraction with proper TypeScript type guard:

**Before**:
```typescript
const adminEmails = admins
  .map((admin: { contact_email: string }) => admin.contact_email)
  .filter((email: string) => email);
```

**After**:
```typescript
const adminEmails = admins
  .map((admin: { contact_email: string | null }) => admin.contact_email)
  .filter((email: string | null): email is string => !!email && email.trim() !== '');
```

### 5. Telegram Message NULL Safety

All fields in Telegram message now have fallbacks:

```typescript
const telegramMessage = `${priorityEmoji} *New Contact Submission*\n\n` +
  `${typeEmoji} *Type:* ${(record.submission_type || 'unknown').replace(/_/g, ' ').toUpperCase()}\n` +
  `👤 *From:* ${record.sender_name || 'Anonymous'}\n` +
  `📧 *Email:* ${record.sender_email || 'N/A'}\n` +
  (record.sender_organization ? `🏢 *Organization:* ${record.sender_organization}\n` : '') +
  `\n📋 *Subject:* ${record.subject || 'No subject'}\n\n` +
  `💬 *Message:*\n${(record.message || 'No message').substring(0, 500)}${(record.message || '').length > 500 ? '...' : ''}\n\n` +
  `🔗 *ID:* \`${(record.id || 'unknown').substring(0, 8)}\`\n` +
  `⏰ ${new Date(record.created_at || Date.now()).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}\n\n` +
  `📊 [View in Dashboard](https://xshwjuwyuwrrxbrzccka.supabase.co)`;
```

### 6. Template Function Signatures

Updated both English and Russian templates to accept `contactInfo`:

```typescript
html: (data: ContactSubmission, contactInfo: ContactInfo) => `...`
```

## Benefits

1. **No more TypeErrors** - All NULL values handled gracefully
2. **Dynamic configuration** - Email addresses pulled from database, not hardcoded
3. **Better maintainability** - Update emails in database, not in code
4. **Type safety** - TypeScript ensures correct types throughout
5. **Graceful degradation** - Missing optional fields don't break the function

## Testing

Build: ✅ Success

**Test SQL** (verify NULL safety):

```sql
-- Test with minimal data (NULLs in optional fields)
INSERT INTO contact_submissions (
  submission_type,
  sender_name,
  sender_email,
  subject,
  message
) VALUES (
  'general_inquiry',
  'Test User',
  'test@example.com',
  'Test Subject',
  'Test message'
);
```

Function should handle:
- ✅ NULL `sender_organization`
- ✅ NULL contact info fields
- ✅ Empty admin list
- ✅ Missing Telegram configuration

## Deployment

When redeploying `contact-notification`, the function will:

1. Fetch contact info from database on each run
2. Use fallback values if database query fails
3. Handle NULL values in all optional fields
4. Filter out NULL/empty admin emails
5. Send Telegram only if configured

**No breaking changes** - Backwards compatible with existing data.

## Related Files

- `/supabase/functions/contact-notification/index.ts` - Main function (updated)
- `/supabase/migrations/20260101194716_create_contact_and_admin_system.sql` - Database schema
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

---

**Status**: Ready for production deployment
