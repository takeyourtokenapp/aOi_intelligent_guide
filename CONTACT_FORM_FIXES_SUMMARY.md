# Contact Form Security & Email Routing Updates

## Overview

Implemented comprehensive privacy and intelligent email routing system for the contact form on tyt.foundation. All user inquiries now flow through a secure, tracked system that enables aOi learning and user progress tracking.

## Key Changes

### 1. Email Privacy Protection

**Problem:** Email addresses were publicly visible to all visitors, creating privacy and spam risks.

**Solution:** Implemented authentication-based email visibility:
- **Public visitors** see: "Use the contact form to reach us"
- **Registered users** see: Actual email addresses with clickable mailto: links
- Phone numbers: Only visible to registered users

**Files Modified:**
- `src/pages/ContactPage.tsx`
  - Added `isAuthenticated` state check
  - Conditional rendering for email/phone display
  - Graceful fallback messages for anonymous users

### 2. Intelligent Email Routing

**Problem:** All contact form submissions went to all admins regardless of inquiry type.

**Solution:** Automatic routing based on submission type:

```
Submission Type              →  Recipient Email
────────────────────────────────────────────────
general_inquiry             →  contact@tyt.foundation
support_request             →  support@tyt.foundation
technical_issue             →  support@tyt.foundation
partnership_proposal        →  partnerships@tyt.foundation
research_collaboration      →  partnerships@tyt.foundation
media_inquiry               →  partnerships@tyt.foundation
donation_inquiry            →  contact@tyt.foundation
volunteer                   →  contact@tyt.foundation
feedback                    →  contact@tyt.foundation
```

**Implementation:**
- Created `getRecipientEmail()` function in Edge Function
- Routes to specialized department emails
- Falls back to primary email if specialized email not configured
- Still sends copies to active admins (excluding duplicates)

**Files Modified:**
- `supabase/functions/contact-notification/index.ts`
  - Added email routing logic
  - Updated notification flow
  - Enhanced response with routing details

### 3. Benefits for aOi & User Tracking

This system creates a foundation for:

**aOi Learning:**
- All inquiries captured in database
- Can analyze common questions by type
- Build knowledge base from real interactions
- Train aOi on actual user needs

**User Progress Tracking:**
- Track all contact points with users
- Monitor engagement patterns
- Build user interaction timeline
- Enable personalized assistance

**Data for Curation:**
- Centralized inquiry management
- Type-based categorization
- Priority-based routing
- Response time tracking

## Technical Implementation

### Contact Page Changes

```typescript
// Check authentication status
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  checkAuth();
}, []);

const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  setIsAuthenticated(!!session);
};

// Conditional email display
{isAuthenticated ? (
  <a href={`mailto:${contactInfo.primary_email}`}>
    {contactInfo.primary_email}
  </a>
) : (
  <p>Use the contact form to reach us</p>
)}
```

### Edge Function Email Routing

```typescript
function getRecipientEmail(submissionType: string, contactInfo: ContactInfo): string {
  const type = submissionType || 'general_inquiry';

  switch (type) {
    case 'support_request':
    case 'technical_issue':
      return contactInfo.support_email || contactInfo.primary_email;

    case 'partnership_proposal':
    case 'research_collaboration':
    case 'media_inquiry':
      return contactInfo.partnerships_email || contactInfo.primary_email;

    default:
      return contactInfo.primary_email;
  }
}

// Usage
const recipientEmail = getRecipientEmail(safeRecord.submission_type, contactInfo);
console.log(`Routing ${safeRecord.submission_type} to: ${recipientEmail}`);
```

## Database Integration

All submissions stored in `contact_submissions` table with:
- `id` - Unique identifier
- `submission_type` - For routing
- `sender_email` - User contact
- `sender_name` - User name
- `subject` - Inquiry subject
- `message` - Full message
- `language` - For localized responses
- `priority` - Auto-assigned based on type
- `status` - Tracking (new/in_progress/resolved)
- `created_at` - Timestamp
- `metadata` - JSON for additional tracking

## Security Features

1. **RLS Policies:**
   - Anonymous users can INSERT (with validation)
   - Anonymous users can SELECT (for confirmation)
   - Authenticated users can view own submissions
   - Admins can view all submissions

2. **Email Visibility:**
   - Public: Hidden by default
   - Authenticated: Full access
   - Prevents email harvesting
   - Reduces spam vectors

3. **Input Validation:**
   - Client-side: Min 3 chars message
   - Server-side: Email format, required fields, enum types
   - Both layers enforce data quality

## Flow Diagram

```
User Submission
     ↓
Contact Form (with type selection)
     ↓
Database INSERT (with RLS validation)
     ↓
Edge Function: contact-notification
     ├─→ Send confirmation to user
     ├─→ Route to department email (based on type)
     └─→ Send copies to admins (if any)
     
Optional: Telegram notification
```

## Testing

Test the routing with:

```bash
# General inquiry → contact@tyt.foundation
curl -X POST "${SUPABASE_URL}/rest/v1/contact_submissions" \
  -H "Content-Type: application/json" \
  -d '{"submission_type":"general_inquiry","sender_name":"Test","sender_email":"test@example.com","subject":"Test","message":"Test message","language":"en"}'

# Technical support → support@tyt.foundation
curl -X POST "${SUPABASE_URL}/rest/v1/contact_submissions" \
  -H "Content-Type: application/json" \
  -d '{"submission_type":"technical_issue","sender_name":"Test","sender_email":"test@example.com","subject":"Bug","message":"Found a bug","language":"en"}'

# Partnership → partnerships@tyt.foundation
curl -X POST "${SUPABASE_URL}/rest/v1/contact_submissions" \
  -H "Content-Type: application/json" \
  -d '{"submission_type":"partnership_proposal","sender_name":"Partner","sender_email":"partner@example.com","subject":"Collaboration","message":"Let's work together","language":"en"}'
```

## Response Format

Edge Function now returns:

```json
{
  "success": true,
  "message": "Notifications sent",
  "routedTo": "support@tyt.foundation",
  "departmentNotificationSent": 1,
  "adminCopiesSent": 0,
  "totalRecipients": 1,
  "telegramSent": false
}
```

## Future Enhancements

1. **aOi Integration:**
   - Analyze inquiry patterns
   - Suggest FAQ entries
   - Auto-categorize complex inquiries
   - Generate response templates

2. **User Journey Tracking:**
   - Link submissions to user accounts
   - Build interaction timeline
   - Track resolution time by type
   - Measure satisfaction scores

3. **Advanced Routing:**
   - Load balancing between team members
   - Language-based routing
   - Time zone aware assignments
   - Priority escalation rules

## Build Status

**Build:** Successful
**Files Changed:** 2
- `src/pages/ContactPage.tsx`
- `supabase/functions/contact-notification/index.ts`

**Edge Function:** Deployed
**Database:** No migrations needed (existing schema sufficient)

## Related Documents

- `CONTACT_FORM_RLS_FIX.md` - Original RLS policy fix
- `EMAIL_SYSTEM_SETUP_COMPLETE.md` - Email infrastructure
- `AOI_INTEGRATION_COMPLETE.md` - aOi character integration
- `AOI_KNOWLEDGE_SCHEMA.md` - Knowledge base structure
