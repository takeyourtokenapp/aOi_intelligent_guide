/*
  Restore Indexes for Features That ARE Actually Used

  Correction:
  After code review, discovered that access_logs and cross_domain_navigation
  ARE actively being used by accessControlService and crossDomainApi.

  These indexes must be restored for performance.
*/

-- Restore access logging indexes (ACTIVELY USED)
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON public.access_logs(user_id);

-- Restore cross-domain navigation indexes (ACTIVELY USED)
CREATE INDEX IF NOT EXISTS idx_cross_domain_navigation_user_id ON public.cross_domain_navigation(user_id);