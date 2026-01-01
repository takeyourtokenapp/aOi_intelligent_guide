/*
  # Contact & Administration System

  ## Purpose
  Create comprehensive communication and administration infrastructure for TYT Foundation

  ## 1. New Tables

  ### `contact_submissions`
  - User inquiries, support requests, partnership proposals
  - Fields: type, subject, message, user info, status, admin response
  - RLS: Public can create, only admins can read/update

  ### `admin_users`
  - CEO, moderators, support team
  - Fields: user_id, role, permissions, specialization
  - RLS: Only admins can access

  ### `email_notifications`
  - Outgoing email queue and log
  - Fields: recipient, subject, body, status, sent_at
  - RLS: Only admins can access

  ### `foundation_contact_info`
  - Public contact information
  - Fields: email, social links, office info
  - RLS: Public read, admin write

  ## 2. Security
  - Enable RLS on all tables
  - Admin role checking via user_roles table
  - Audit logging for admin actions

  ## 3. Key Features
  - Multi-language support (EN, RU, HE)
  - Priority levels for inquiries
  - Auto-response system
  - Email notification queue
*/

-- ============================================================================
-- 1. CONTACT SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Type
  submission_type text NOT NULL CHECK (submission_type IN (
    'general_inquiry',
    'support_request',
    'partnership_proposal',
    'donation_inquiry',
    'research_collaboration',
    'media_inquiry',
    'volunteer',
    'technical_issue',
    'feedback'
  )),
  
  -- Sender Information
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_organization text,
  sender_phone text,
  user_id uuid REFERENCES auth.users(id),
  
  -- Message Content
  subject text NOT NULL,
  message text NOT NULL,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ru', 'he')),
  
  -- Priority & Status
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status text DEFAULT 'new' CHECK (status IN (
    'new',
    'in_review',
    'in_progress',
    'awaiting_response',
    'resolved',
    'archived'
  )),
  
  -- Admin Response
  assigned_to uuid REFERENCES auth.users(id),
  admin_response text,
  admin_notes text,
  responded_at timestamptz,
  resolved_at timestamptz,
  
  -- Metadata
  ip_address text,
  user_agent text,
  referrer_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 2. ADMIN USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  
  -- Admin Role
  admin_role text NOT NULL CHECK (admin_role IN (
    'ceo',
    'moderator',
    'support_agent',
    'content_curator',
    'financial_manager',
    'research_coordinator'
  )),
  
  -- Permissions
  permissions jsonb DEFAULT '{
    "view_all_submissions": true,
    "respond_to_inquiries": true,
    "manage_users": false,
    "manage_donations": false,
    "manage_research": false,
    "publish_content": false
  }'::jsonb,
  
  -- Admin Info
  display_name text NOT NULL,
  specialization text,
  contact_email text,
  
  -- Status
  is_active boolean DEFAULT true,
  last_active_at timestamptz,
  
  -- Audit
  assigned_by uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 3. EMAIL NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  recipient_email text NOT NULL,
  recipient_name text,
  user_id uuid REFERENCES auth.users(id),
  
  -- Email Content
  subject text NOT NULL,
  body_text text NOT NULL,
  body_html text,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ru', 'he')),
  
  -- Type & Priority
  notification_type text NOT NULL CHECK (notification_type IN (
    'contact_confirmation',
    'admin_alert',
    'response_notification',
    'donation_receipt',
    'newsletter',
    'system_notification'
  )),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  
  -- Sending Status
  status text DEFAULT 'pending' CHECK (status IN (
    'pending',
    'queued',
    'sending',
    'sent',
    'failed',
    'bounced'
  )),
  
  -- Related Records
  related_submission_id uuid REFERENCES contact_submissions(id),
  
  -- Delivery Tracking
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  
  -- Error Handling
  error_message text,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. FOUNDATION CONTACT INFO TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS foundation_contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact Methods
  primary_email text NOT NULL,
  support_email text,
  partnerships_email text,
  press_email text,
  
  -- Phone Numbers
  primary_phone text,
  whatsapp_number text,
  telegram_username text,
  
  -- Social Media
  twitter_url text,
  linkedin_url text,
  github_url text,
  discord_invite text,
  
  -- Physical Address (if applicable)
  office_address text,
  office_city text,
  office_country text,
  office_postal_code text,
  
  -- Operational Hours
  support_hours_en text DEFAULT 'Monday-Friday, 9:00-18:00 UTC',
  support_hours_ru text DEFAULT 'Понедельник-Пятница, 9:00-18:00 UTC',
  support_hours_he text DEFAULT 'ראשון-חמישי, 9:00-18:00 UTC',
  
  -- Legal
  legal_entity_name text,
  tax_id text,
  registration_number text,
  registration_country text,
  
  -- Emergency Contact
  emergency_contact_info text,
  
  -- Metadata
  is_active boolean DEFAULT true,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Insert default contact info
INSERT INTO foundation_contact_info (
  primary_email,
  support_email,
  partnerships_email,
  press_email,
  legal_entity_name
) VALUES (
  'contact@tyt.foundation',
  'support@tyt.foundation',
  'partnerships@tyt.foundation',
  'press@tyt.foundation',
  'TYT Foundation'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. ADMIN ACTION LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id),
  
  -- Action Details
  action_type text NOT NULL CHECK (action_type IN (
    'submission_viewed',
    'submission_assigned',
    'response_sent',
    'status_changed',
    'user_role_modified',
    'content_published',
    'donation_processed',
    'grant_approved',
    'settings_changed'
  )),
  
  -- Target
  target_type text,
  target_id uuid,
  
  -- Details
  description text NOT NULL,
  old_value text,
  new_value text,
  
  -- Metadata
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  timestamp timestamptz DEFAULT now()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundation_contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: contact_submissions
-- ============================================================================

-- Anyone can create a submission
CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- ============================================================================
-- RLS POLICIES: admin_users
-- ============================================================================

-- Only admins can view admin users
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.is_active = true
    )
  );

-- Only CEO can manage admin users
CREATE POLICY "CEO can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.admin_role = 'ceo'
      AND admin_users.is_active = true
    )
  );

-- ============================================================================
-- RLS POLICIES: email_notifications
-- ============================================================================

-- Only admins can view notifications
CREATE POLICY "Admins can view email notifications"
  ON email_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Only admins can create notifications
CREATE POLICY "Admins can create email notifications"
  ON email_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- ============================================================================
-- RLS POLICIES: foundation_contact_info
-- ============================================================================

-- Public can read contact info
CREATE POLICY "Anyone can read contact info"
  ON foundation_contact_info
  FOR SELECT
  TO public
  USING (is_active = true);

-- Only admins can update contact info
CREATE POLICY "Admins can update contact info"
  ON foundation_contact_info
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
      AND (admin_users.admin_role = 'ceo' OR 
           (admin_users.permissions->>'manage_settings')::boolean = true)
    )
  );

-- ============================================================================
-- RLS POLICIES: admin_action_logs
-- ============================================================================

-- Only admins can view logs
CREATE POLICY "Admins can view action logs"
  ON admin_action_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.is_active = true
    )
  );

-- Admins can create logs
CREATE POLICY "Admins can create action logs"
  ON admin_action_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (admin_user_id = auth.uid());

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_type ON contact_submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_user ON contact_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned ON contact_submissions(assigned_to);

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(admin_role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created ON email_notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user ON admin_action_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_action_logs(timestamp DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to auto-assign priority based on keywords
CREATE OR REPLACE FUNCTION auto_assign_priority()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subject ~* 'urgent|emergency|critical|asap' OR 
     NEW.message ~* 'urgent|emergency|critical|asap' THEN
    NEW.priority := 'urgent';
  ELSIF NEW.subject ~* 'important|high priority' OR 
        NEW.message ~* 'important|high priority' THEN
    NEW.priority := 'high';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_priority_trigger
  BEFORE INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_priority();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
