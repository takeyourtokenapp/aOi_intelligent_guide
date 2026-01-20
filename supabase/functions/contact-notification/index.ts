import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactSubmission {
  id?: string;
  submission_type?: string;
  sender_name?: string;
  sender_email?: string;
  sender_organization?: string;
  subject?: string;
  message?: string;
  language?: string;
  priority?: string;
  created_at?: string;
}

interface ContactInfo {
  primary_email: string;
  support_email: string | null;
  partnerships_email: string | null;
  press_email: string | null;
}

// Email routing based on submission type
function getRecipientEmail(submissionType: string, contactInfo: ContactInfo): string {
  const type = submissionType || 'general_inquiry';

  // Route to specialized emails based on type
  switch (type) {
    case 'support_request':
    case 'technical_issue':
      return contactInfo.support_email || contactInfo.primary_email;

    case 'partnership_proposal':
    case 'research_collaboration':
    case 'media_inquiry':
      // High-priority research collaboration requests go to partnerships
      return contactInfo.partnerships_email || contactInfo.primary_email;

    case 'general_inquiry':
    case 'donation_inquiry':
    case 'volunteer':
    case 'feedback':
    default:
      return contactInfo.primary_email;
  }
}

const emailTemplates = {
  en: {
    confirmation: {
      subject: "We received your message - TYT Foundation",
      html: (data: ContactSubmission, contactInfo: ContactInfo) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">TYT Foundation</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Children's Brain Cancer Research & Support</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #667eea; margin-top: 0;">Thank you for contacting us!</h2>

    <p>Dear ${data.sender_name || 'friend'},</p>

    <p>We have received your message and will respond within <strong>24-48 hours</strong>.</p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Your Message Details:</h3>
      <p style="margin: 8px 0;"><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
      <p style="margin: 8px 0;"><strong>Type:</strong> ${(data.submission_type || 'general').replace(/_/g, ' ')}</p>
      <p style="margin: 8px 0;"><strong>Reference ID:</strong> <code>${(data.id || '').substring(0, 8)}</code></p>
    </div>

    <p>If you have urgent matters, please contact us at:</p>
    <ul style="list-style: none; padding: 0;">
      <li>📧 <a href="mailto:${contactInfo.primary_email}" style="color: #667eea;">${contactInfo.primary_email}</a></li>
      ${contactInfo.support_email ? `<li>🆘 <a href="mailto:${contactInfo.support_email}" style="color: #667eea;">${contactInfo.support_email}</a></li>` : ''}
    </ul>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        TYT Foundation | <a href="https://tyt.foundation" style="color: #667eea;">tyt.foundation</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
    adminAlert: {
      subject: (data: ContactSubmission) => `🔔 New Contact: ${data.submission_type || 'general'}`,
      html: (data: ContactSubmission) => `
<!DOCTYPE html>
<html>
<body style="font-family: monospace; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: #0d6efd; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin: 0;">🔔 New Contact Submission</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px;">
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold; width: 150px;">ID</td>
      <td style="padding: 12px;"><code>${data.id}</code></td>
    </tr>
    <tr>
      <td style="padding: 12px; font-weight: bold;">Type</td>
      <td style="padding: 12px;">${(data.submission_type || 'general').replace(/_/g, ' ').toUpperCase()}</td>
    </tr>
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold;">From</td>
      <td style="padding: 12px;">
        <strong>${data.sender_name || 'Anonymous'}</strong><br>
        <a href="mailto:${data.sender_email}">${data.sender_email}</a>
        ${data.sender_organization ? `<br>🏢 ${data.sender_organization}` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; font-weight: bold;">Subject</td>
      <td style="padding: 12px;"><strong>${data.subject || 'No subject'}</strong></td>
    </tr>
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold; vertical-align: top;">Message</td>
      <td style="padding: 12px; white-space: pre-wrap;">${data.message || 'No message'}</td>
    </tr>
  </table>
</body>
</html>
      `,
    },
  },
  ru: {
    confirmation: {
      subject: "Мы получили ваше сообщение - TYT Foundation",
      html: (data: ContactSubmission, contactInfo: ContactInfo) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">TYT Foundation</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Исследования и поддержка детей с опухолями мозга</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #667eea; margin-top: 0;">Спасибо за обращение!</h2>

    <p>Уважаемый(ая) ${data.sender_name || 'друг'},</p>

    <p>Мы получили ваше сообщение и ответим в течение <strong>24-48 часов</strong>.</p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Детали вашего сообщения:</h3>
      <p style="margin: 8px 0;"><strong>Тема:</strong> ${data.subject || 'Без темы'}</p>
      <p style="margin: 8px 0;"><strong>Тип:</strong> ${(data.submission_type || 'general').replace(/_/g, ' ')}</p>
      <p style="margin: 8px 0;"><strong>ID обращения:</strong> <code>${(data.id || '').substring(0, 8)}</code></p>
    </div>

    <p>Если у вас срочные вопросы, свяжитесь с нами:</p>
    <ul style="list-style: none; padding: 0;">
      <li>📧 <a href="mailto:${contactInfo.primary_email}" style="color: #667eea;">${contactInfo.primary_email}</a></li>
      ${contactInfo.support_email ? `<li>🆘 <a href="mailto:${contactInfo.support_email}" style="color: #667eea;">${contactInfo.support_email}</a></li>` : ''}
    </ul>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        TYT Foundation | <a href="https://tyt.foundation" style="color: #667eea;">tyt.foundation</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const record: ContactSubmission = body.record || body;

    console.log("📬 Processing contact submission:", record.id);

    if (!record || !record.sender_email || !record.subject) {
      console.error("❌ Invalid payload:", JSON.stringify(body));
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeRecord: ContactSubmission = {
      id: record.id || crypto.randomUUID(),
      submission_type: record.submission_type || 'general_inquiry',
      sender_name: record.sender_name || 'Anonymous',
      sender_email: record.sender_email,
      sender_organization: record.sender_organization,
      subject: record.subject,
      message: record.message || '',
      language: record.language || 'en',
      priority: record.priority || 'normal',
      created_at: record.created_at || new Date().toISOString(),
    };

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sendEmailUrl = `${supabaseUrl}/functions/v1/send-email`;

    // Get contact info
    const contactInfoResponse = await fetch(
      `${supabaseUrl}/rest/v1/foundation_contact_info?select=primary_email,support_email,partnerships_email,press_email&is_active=eq.true&limit=1`,
      { headers: { "apikey": supabaseAnonKey, "Authorization": `Bearer ${supabaseAnonKey}` } }
    );

    const contactInfoData = await contactInfoResponse.json();
    const contactInfo: ContactInfo = contactInfoData[0] || {
      primary_email: 'contact@tyt.foundation',
      support_email: null,
      partnerships_email: null,
      press_email: null,
    };

    const language = safeRecord.language || 'en';
    const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.en;

    // 1. Send confirmation to sender
    console.log("📧 Sending confirmation to:", safeRecord.sender_email);
    try {
      await fetch(sendEmailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: safeRecord.sender_email,
          subject: template.confirmation.subject,
          html: template.confirmation.html(safeRecord, contactInfo),
          submissionId: safeRecord.id,
        }),
      });
      console.log("✅ Confirmation sent");
    } catch (error) {
      console.error("❌ Confirmation failed:", error);
    }

    // 2. Route and send notification to appropriate department
    const recipientEmail = getRecipientEmail(safeRecord.submission_type, contactInfo);
    console.log(`📧 Routing ${safeRecord.submission_type} to: ${recipientEmail}`);

    try {
      await fetch(sendEmailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: emailTemplates.en.adminAlert.subject(safeRecord),
          html: emailTemplates.en.adminAlert.html(safeRecord),
          submissionId: safeRecord.id,
        }),
      });
      console.log(`✅ Department notification sent to: ${recipientEmail}`);
    } catch (error) {
      console.error(`❌ Failed to send department notification:`, error);
    }

    // 3. Also send to active admins (as CC / backup)
    console.log("🔍 Fetching active admins...");
    const adminsResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_users?select=contact_email&is_active=eq.true`,
      { headers: { "apikey": supabaseServiceKey, "Authorization": `Bearer ${supabaseServiceKey}` } }
    );

    const admins = await adminsResponse.json();
    const adminEmails = admins
      .map((admin: { contact_email: string | null }) => admin.contact_email)
      .filter((email: string | null): email is string =>
        !!email && email.trim() !== '' && email !== recipientEmail // Don't duplicate to same email
      );

    console.log(`👥 Found ${adminEmails.length} additional admin(s):`, adminEmails);

    // Send to all unique admins
    if (adminEmails.length > 0) {
      const emailPromises = adminEmails.map(adminEmail =>
        fetch(sendEmailUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            to: adminEmail,
            subject: emailTemplates.en.adminAlert.subject(safeRecord),
            html: emailTemplates.en.adminAlert.html(safeRecord),
            submissionId: safeRecord.id,
          }),
        }).then(() => console.log(`✅ Admin copy sent to: ${adminEmail}`))
          .catch(err => console.error(`❌ Failed to send to ${adminEmail}:`, err))
      );

      await Promise.allSettled(emailPromises);
    }

    // 4. Optional Telegram notification
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");
    let telegramSent = false;

    if (telegramBotToken && telegramChatId) {
      try {
        const telegramMessage = `🔔 *New Contact*\n\n` +
          `👤 ${safeRecord.sender_name}\n` +
          `📧 ${safeRecord.sender_email}\n` +
          `📋 ${safeRecord.subject}\n\n` +
          `ID: \`${safeRecord.id.substring(0, 8)}\``;

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramMessage,
              parse_mode: "Markdown",
            }),
          }
        );

        if (telegramResponse.ok) {
          telegramSent = true;
          console.log("✅ Telegram notification sent");
        }
      } catch (error) {
        console.error("❌ Telegram failed:", error);
      }
    }

    console.log("✅ All notifications processed");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notifications sent",
        routedTo: recipientEmail,
        departmentNotificationSent: 1,
        adminCopiesSent: adminEmails.length,
        totalRecipients: 1 + adminEmails.length,
        telegramSent,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});