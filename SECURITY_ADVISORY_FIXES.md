# Security Advisory Fixes

This document explains the fixes applied to address Supabase security advisor warnings.

## ✅ Fixed via Migration

### 1. Unused Indexes Removed (45 indexes)

All unused indexes have been dropped to clean up the database. These included:

- **Foundation tables**: fund_transparency (2 indexes)
- **Contact system**: contact_submissions (3 indexes)
- **Guardian system**: guardian_consents (2 indexes)
- **Progress tracking**: progress_anchors (2 indexes)
- **Admin system**: admin_action_logs (2 indexes), admin_users (1 index)
- **Knowledge base**: knowledge_base_web3 (4 indexes), knowledge_base_cns (5 indexes)
- **Knowledge submissions**: (3 indexes)
- **Access logs**: (1 index)
- **Achievements**: (1 index)
- **Navigation**: cross_domain_navigation (1 index)
- **User roles**: (2 indexes)
- **Research**: research_posts (1 index), research_collaborations (1 index)
- **Donations**: foundation_donations (2 indexes)
- **Grants**: foundation_grants (1 index)
- **Reports**: foundation_impact_reports (2 indexes)
- **Certificates**: (2 indexes)
- **Notifications**: email_notifications (3 indexes)
- **Foundation info**: foundation_contact_info (1 index)
- **Academy**: user_lesson_progress (3 indexes), lessons (1 index)
- **User XP**: (1 index)

**⚠️ Important**: These indexes were created for future scale and RLS policy performance. Monitor query performance as traffic increases. You may need to recreate specific indexes if slow queries appear.

**When to recreate indexes**:
- Slow admin dashboard queries
- Slow leaderboard/public views
- RLS policy evaluation taking >100ms
- Database CPU usage >70%

### 2. Multiple Permissive Policies Consolidated (8 tables)

Combined multiple SELECT policies into single policies with OR conditions. This maintains the exact same access control but with cleaner policy structure:

#### admin_users
- **Before**: 2 policies ("Admins can view admin users" + "CEO can manage admin users")
- **After**: 1 policy ("Admins and CEO can view admin users")
- **Access**: Admin OR CEO role can view

#### certificates
- **Before**: 2 policies ("Admins can view all certificates" + "Users can view own certificates")
- **After**: 1 policy ("Users can view own certificates or admins can view all")
- **Access**: Own user_id OR admin role

#### contact_submissions
- **Before**: 2 policies ("Admins can view all submissions" + "Users can view own submissions")
- **After**: 1 policy ("Users can view own submissions or admins can view all")
- **Access**: Own user_id OR admin role

#### guardian_consents
- **Before**: 2 policies ("Admins can view all consents" + "Users can view own consents")
- **After**: 1 policy ("Users can view own consents or admins can view all")
- **Access**: Own child_user_id OR admin role

#### knowledge_submissions
- **Before**: 2 policies ("Curators can view all submissions" + "Users can view own submissions")
- **After**: 1 policy ("Users can view own submissions or curators can view all")
- **Access**: Own submitter_id OR curator/admin role

#### user_lesson_progress
- **Before**: 2 policies ("Admins can view all progress" + "Users can view own progress")
- **After**: 1 policy ("Users can view own progress or admins can view all")
- **Access**: Own user_id OR admin role

#### user_roles
- **Before**: 2 policies ("Public curator list" + "Users can view own roles")
- **After**: 1 policy ("Users can view own roles or anyone can view curator list")
- **Access**: Own user_id OR role='curator' (public)

#### user_xp
- **Before**: 3 policies ("Admins can view all XP" + "Anyone can view XP leaderboard" + "Users can view own XP")
- **After**: 1 policy ("Users can view own XP or anyone can view leaderboard or admins can view all")
- **Access**: Own user_id OR admin role OR public (leaderboard)

## ✅ Kept As-Is (By Design)

### 3. RLS Policy Always True (3 policies)

These policies allow unrestricted INSERT access **by design**:

#### access_logs
- **Policy**: "System can write access logs"
- **Reason**: System audit trail needs unrestricted logging
- **Security**: Read access is properly restricted

#### contact_submissions
- **Policy**: "Anyone can create contact submissions"
- **Reason**: Public contact form must accept anonymous submissions
- **Security**: Personal data is protected via read restrictions

#### cross_domain_navigation
- **Policy**: "System can log navigation"
- **Reason**: Analytics tracking needs unrestricted logging
- **Security**: No sensitive data stored, read access restricted

**These are NOT vulnerabilities** - they are necessary for public features and system logging.

## ⚠️ Manual Fix Required

### 4. Auth DB Connection Strategy

**Issue**: Auth server uses fixed 10 connections instead of percentage-based allocation.

**Impact**:
- Low priority for current traffic
- Only matters at scale (1000+ concurrent auth requests)
- Does not affect application functionality

**How to fix**:
1. Open Supabase Dashboard
2. Navigate to: **Settings** → **Database** → **Connection Pooling**
3. Find **Auth** service configuration
4. Change from "Fixed: 10 connections" to "Percentage: 10%"
5. Save changes

**When to fix**: Before production launch or when expecting high concurrent user load.

## Performance Monitoring

After index removal, monitor these metrics:

### Query Performance
```sql
-- Find slow queries
SELECT
  mean_exec_time,
  calls,
  query
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Database CPU
- Target: <50% average
- Alert threshold: >70%
- If exceeded: Review slow queries and recreate necessary indexes

### RLS Policy Evaluation
- Target: <50ms per query
- If slower: Consider recreating indexes on frequently filtered columns

## Rollback Plan

If performance issues occur, recreate critical indexes:

```sql
-- Foreign key indexes (most important)
CREATE INDEX idx_user_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_achievements_profile_id ON achievements(profile_id);

-- RLS policy support indexes
CREATE INDEX idx_contact_submissions_user ON contact_submissions(user_id);
CREATE INDEX idx_guardian_consents_child_user_id ON guardian_consents(child_user_id);

-- Admin query performance
CREATE INDEX idx_contact_submissions_status_created ON contact_submissions(status, created_at);
CREATE INDEX idx_email_notifications_status_created ON email_notifications(status, created_at);
```

## Testing Recommendations

1. **Verify access control still works**:
   - Test user can only see their own data
   - Test admin can see all data
   - Test curator can see submissions

2. **Monitor query performance**:
   - Dashboard load times
   - Leaderboard queries
   - Admin panel queries

3. **Load test before production**:
   - Simulate 100+ concurrent users
   - Monitor database metrics
   - Check for slow queries

## Summary

- ✅ 45 unused indexes removed
- ✅ 8 tables with consolidated RLS policies
- ✅ 3 intentional "always true" policies kept
- ⚠️ 1 manual fix needed (Auth connection strategy)
- 📊 Performance monitoring recommended

**Result**: Database is cleaner and follows Supabase best practices while maintaining security and functionality.
