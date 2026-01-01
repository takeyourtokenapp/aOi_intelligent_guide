# TYT Foundation - Admin Dashboard & Management Guide

**For**: CEO / Owner / Administrators
**Updated**: January 1, 2026

---

## Overview

As the CEO/Owner of TYT Foundation and takeyourtoken.app, you now have a comprehensive admin system to manage user communications, oversee operations, and maintain the ecosystem.

---

## Database Access

### Your Supabase Dashboard

**URL**: `https://xshwjuwyuwrrxbrzccka.supabase.co`

**Login**: Use your Supabase account credentials

### Key Tables for Administration

#### 1. **contact_submissions**
All user inquiries, support requests, partnership proposals

**View All Submissions**:
```sql
SELECT
  id,
  submission_type,
  sender_name,
  sender_email,
  subject,
  status,
  priority,
  created_at
FROM contact_submissions
ORDER BY created_at DESC;
```

**Filter by Status**:
```sql
SELECT * FROM contact_submissions
WHERE status = 'new'
ORDER BY priority DESC, created_at DESC;
```

**Filter by Type**:
```sql
SELECT * FROM contact_submissions
WHERE submission_type = 'partnership_proposal'
AND status IN ('new', 'in_review');
```

#### 2. **admin_users**
Your admin team (you, moderators, support agents)

**View Admin Team**:
```sql
SELECT
  display_name,
  admin_role,
  contact_email,
  is_active,
  last_active_at
FROM admin_users
WHERE is_active = true;
```

**Add New Admin** (you need to do this first for yourself):
```sql
-- First, get your user_id from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert into admin_users
INSERT INTO admin_users (
  user_id,
  admin_role,
  display_name,
  contact_email,
  permissions
) VALUES (
  'YOUR_USER_ID_HERE',
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
  }'::jsonb
);
```

#### 3. **foundation_statistics**
Real-time foundation metrics

```sql
SELECT
  total_donated,
  families_supported,
  research_grants,
  clinical_trials,
  partner_hospitals,
  updated_at
FROM foundation_statistics;
```

**Update Statistics**:
```sql
UPDATE foundation_statistics
SET
  total_donated = 150000,
  families_supported = 25,
  research_grants = 8,
  clinical_trials = 3,
  partner_hospitals = 12,
  updated_at = now()
WHERE id = (SELECT id FROM foundation_statistics LIMIT 1);
```

#### 4. **foundation_donations**
Track all donations

```sql
SELECT
  amount,
  currency,
  donor_name,
  transaction_hash,
  status,
  created_at
FROM foundation_donations
ORDER BY created_at DESC
LIMIT 50;
```

#### 5. **admin_action_logs**
Audit trail of all admin actions

```sql
SELECT
  al.action_type,
  al.description,
  au.display_name as admin_name,
  al.timestamp
FROM admin_action_logs al
JOIN admin_users au ON al.admin_user_id = au.user_id
ORDER BY al.timestamp DESC
LIMIT 100;
```

---

## How to Respond to User Inquiries

### Method 1: Direct Database Update (Quick)

```sql
-- Update submission status and add response
UPDATE contact_submissions
SET
  status = 'resolved',
  admin_response = 'Thank you for reaching out. We have reviewed your inquiry...',
  responded_at = now(),
  resolved_at = now(),
  assigned_to = 'YOUR_USER_ID'
WHERE id = 'SUBMISSION_ID_HERE';
```

### Method 2: Create Email Notification (Automated)

```sql
-- Queue an email response
INSERT INTO email_notifications (
  recipient_email,
  recipient_name,
  subject,
  body_text,
  notification_type,
  related_submission_id,
  status
) VALUES (
  'user@example.com',
  'User Name',
  'Re: Your inquiry about partnerships',
  'Thank you for your interest in partnering with TYT Foundation...',
  'response_notification',
  'SUBMISSION_ID_HERE',
  'pending'
);
```

### Method 3: Admin Dashboard UI (Coming Soon)

We will build a full admin UI where you can:
- View all submissions in a table
- Filter by status, type, priority
- Respond directly from the interface
- Assign to team members
- Track response time

---

## Common Admin Tasks

### 1. View New Submissions Today

```sql
SELECT
  id,
  submission_type,
  sender_name,
  sender_email,
  subject,
  priority,
  created_at
FROM contact_submissions
WHERE created_at::date = CURRENT_DATE
AND status = 'new'
ORDER BY priority DESC;
```

### 2. Urgent/High Priority Items

```sql
SELECT * FROM contact_submissions
WHERE priority IN ('urgent', 'high')
AND status NOT IN ('resolved', 'archived')
ORDER BY
  CASE priority
    WHEN 'urgent' THEN 1
    WHEN 'high' THEN 2
  END,
  created_at;
```

### 3. Partnership Proposals Pending Review

```sql
SELECT
  sender_name,
  sender_organization,
  sender_email,
  subject,
  message,
  created_at
FROM contact_submissions
WHERE submission_type = 'partnership_proposal'
AND status IN ('new', 'in_review')
ORDER BY created_at;
```

### 4. Monthly Contact Statistics

```sql
SELECT
  submission_type,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (responded_at - created_at))/3600) as avg_response_hours
FROM contact_submissions
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY submission_type
ORDER BY count DESC;
```

---

## Update Foundation Contact Info

```sql
UPDATE foundation_contact_info
SET
  primary_email = 'contact@tyt.foundation',
  support_email = 'support@tyt.foundation',
  partnerships_email = 'partnerships@tyt.foundation',
  press_email = 'press@tyt.foundation',
  primary_phone = '+1-XXX-XXX-XXXX',
  telegram_username = '@tytfoundation',
  twitter_url = 'https://twitter.com/tytfoundation',
  linkedin_url = 'https://linkedin.com/company/tytfoundation',
  updated_at = now()
WHERE id = (SELECT id FROM foundation_contact_info LIMIT 1);
```

---

## Monitor User Activity

### Active Users Today

```sql
SELECT COUNT(DISTINCT user_id) as active_users_today
FROM access_logs
WHERE timestamp::date = CURRENT_DATE;
```

### Most Popular Pages

```sql
SELECT
  resource,
  COUNT(*) as visits
FROM access_logs
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY resource
ORDER BY visits DESC
LIMIT 10;
```

### User Progress Overview

```sql
SELECT
  level,
  COUNT(*) as user_count,
  AVG(level_progress) as avg_progress,
  SUM(foundation_contribution) as total_contributions
FROM user_progress
GROUP BY level
ORDER BY
  CASE level
    WHEN 'Guardian' THEN 1
    WHEN 'Builder' THEN 2
    WHEN 'Explorer' THEN 3
    WHEN 'Beginner' THEN 4
  END;
```

---

## Security & Best Practices

### 1. **Never Share Database Credentials**
Your Supabase URL and keys are sensitive. Keep them secure.

### 2. **Respond Within 24-48 Hours**
Users expect timely responses. Prioritize urgent inquiries.

### 3. **Log All Actions**
When making manual changes, create a log entry:

```sql
INSERT INTO admin_action_logs (
  admin_user_id,
  action_type,
  description,
  metadata
) VALUES (
  'YOUR_USER_ID',
  'settings_changed',
  'Updated foundation contact information',
  '{"field": "primary_email", "new_value": "contact@tyt.foundation"}'::jsonb
);
```

### 4. **Review Donations Regularly**

```sql
-- Daily donation summary
SELECT
  DATE(created_at) as date,
  COUNT(*) as donation_count,
  SUM(usd_equivalent) as total_usd
FROM foundation_donations
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

---

## Next Steps: Build Admin UI

### Recommended Admin Dashboard Features

1. **Submissions Management**
   - Table view with filters
   - Quick response templates
   - Status workflow (New → In Progress → Resolved)
   - Assignment to team members

2. **Foundation Statistics Dashboard**
   - Real-time metrics
   - Charts and graphs
   - Export reports

3. **User Management**
   - View all users
   - Progress tracking
   - Guardian approval workflow

4. **Content Management**
   - Publish research posts
   - Manage knowledge base
   - Approve user submissions

5. **Email System**
   - Send newsletters
   - Response templates
   - Scheduled emails

---

## Contact Form on Website

The contact form is now available at:

**Component**: `src/components/ContactForm.tsx`
**Page**: `src/pages/ContactPage.tsx`

To add to your navigation:

```typescript
// src/config/navigation.ts
{
  label: { en: 'Contact', ru: 'Контакты' },
  path: '/contact',
  icon: 'MessageCircle'
}
```

---

## Quick Access Queries for CEO

### Morning Dashboard

```sql
-- New submissions overnight
SELECT COUNT(*) as new_submissions
FROM contact_submissions
WHERE created_at >= CURRENT_DATE
AND status = 'new';

-- Urgent items
SELECT COUNT(*) as urgent_items
FROM contact_submissions
WHERE priority = 'urgent'
AND status NOT IN ('resolved', 'archived');

-- Donations last 24h
SELECT
  COUNT(*) as donation_count,
  SUM(usd_equivalent) as total_usd
FROM foundation_donations
WHERE created_at >= NOW() - INTERVAL '24 hours'
AND status = 'completed';

-- Active users today
SELECT COUNT(DISTINCT user_id) as active_users
FROM access_logs
WHERE timestamp >= CURRENT_DATE;
```

---

## Need Help?

This system is designed for you to manage the ecosystem efficiently. If you need:

- **Custom queries**: Ask for SQL examples
- **Admin UI development**: We can build a full dashboard
- **Email automation**: Set up Edge Functions for auto-responses
- **Reports**: Create automated weekly/monthly reports

**Your role as CEO**: Strategic oversight, key decisions, partnership approvals, and ensuring the foundation's mission stays on track.

---

## Current Email Addresses (Update These!)

Default placeholders have been set. Update them to your real addresses:

- `contact@tyt.foundation` - General inquiries
- `support@tyt.foundation` - Technical support
- `partnerships@tyt.foundation` - Partnership proposals
- `press@tyt.foundation` - Media inquiries

**Update in database**:
```sql
UPDATE foundation_contact_info SET primary_email = 'your-real-email@tyt.foundation';
```

---

**Remember**: You are building something unique - a Web3 ecosystem that directly funds children's brain cancer research. Every inquiry could be a partnership, a donor, or a family in need. Respond thoughtfully and maintain the trust you're building.
