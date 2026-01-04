import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactSubmission {
  id: string;
  submission_type: string;
  sender_name: string;
  sender_email: string;
  sender_organization?: string;
  subject: string;
  message: string;
  language: string;
  priority: string;
  created_at: string;
}

interface ContactInfo {
  primary_email: string;
  support_email: string | null;
  partnerships_email: string | null;
  press_email: string | null;
  primary_phone: string | null;
  whatsapp_number: string | null;
  telegram_username: string | null;
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

    <p>Dear ${data.sender_name},</p>

    <p>We have received your message and will respond within <strong>24-48 hours</strong>.</p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Your Message Details:</h3>
      <p style="margin: 8px 0;"><strong>Subject:</strong> ${data.subject}</p>
      <p style="margin: 8px 0;"><strong>Type:</strong> ${data.submission_type.replace(/_/g, ' ')}</p>
      <p style="margin: 8px 0;"><strong>Priority:</strong> ${data.priority}</p>
      <p style="margin: 8px 0;"><strong>Reference ID:</strong> <code>${data.id.substring(0, 8)}</code></p>
    </div>

    <p>If you have urgent matters or questions, please don't hesitate to contact us directly at:</p>
    <ul style="list-style: none; padding: 0;">
      <li>📧 <a href="mailto:${contactInfo.primary_email}" style="color: #667eea;">${contactInfo.primary_email}</a></li>
      ${contactInfo.support_email ? `<li>🆘 <a href="mailto:${contactInfo.support_email}" style="color: #667eea;">${contactInfo.support_email}</a></li>` : ''}
      ${contactInfo.partnerships_email ? `<li>💼 <a href="mailto:${contactInfo.partnerships_email}" style="color: #667eea;">${contactInfo.partnerships_email}</a></li>` : ''}
    </ul>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="font-size: 14px; color: #666;">
      <strong>About TYT Foundation:</strong><br>
      We combine Web3 technology with transparent funding to advance pediatric brain tumor research and support affected families.
    </p>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        TYT Foundation | <a href="https://tyt.foundation" style="color: #667eea;">tyt.foundation</a>
      </p>
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        Every transaction supports children's brain cancer research
      </p>
    </div>
  </div>
</body>
</html>
      `,
    },
    adminAlert: {
      subject: (data: ContactSubmission) => `🔔 New ${data.priority.toUpperCase()} Contact: ${data.submission_type}`,
      html: (data: ContactSubmission) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: monospace; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: ${data.priority === 'urgent' ? '#dc3545' : data.priority === 'high' ? '#fd7e14' : '#0d6efd'}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin: 0;">🔔 New Contact Submission</h2>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Priority: <strong>${data.priority.toUpperCase()}</strong></p>
  </div>

  <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold; width: 150px;">ID</td>
      <td style="padding: 12px;"><code>${data.id}</code></td>
    </tr>
    <tr>
      <td style="padding: 12px; font-weight: bold;">Type</td>
      <td style="padding: 12px;">${data.submission_type.replace(/_/g, ' ').toUpperCase()}</td>
    </tr>
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold;">From</td>
      <td style="padding: 12px;">
        <strong>${data.sender_name}</strong><br>
        <a href="mailto:${data.sender_email}">${data.sender_email}</a>
        ${data.sender_organization ? `<br>🏢 ${data.sender_organization}` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding: 12px; font-weight: bold;">Subject</td>
      <td style="padding: 12px;"><strong>${data.subject}</strong></td>
    </tr>
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold; vertical-align: top;">Message</td>
      <td style="padding: 12px; white-space: pre-wrap;">${data.message}</td>
    </tr>
    <tr>
      <td style="padding: 12px; font-weight: bold;">Language</td>
      <td style="padding: 12px;">${data.language.toUpperCase()}</td>
    </tr>
    <tr style="background: #e9ecef;">
      <td style="padding: 12px; font-weight: bold;">Received</td>
      <td style="padding: 12px;">${new Date(data.created_at).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      })}</td>
    </tr>
  </table>

  <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
    <p style="margin: 0; font-weight: bold;">⚡ Action Required</p>
    <p style="margin: 10px 0 0 0;">
      Log in to <a href="https://xshwjuwyuwrrxbrzccka.supabase.co" style="color: #0d6efd;">Supabase Dashboard</a> to respond.
    </p>
  </div>

  <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; font-size: 12px; color: #666;">
    <p style="margin: 0;"><strong>Quick SQL to view:</strong></p>
    <pre style="background: white; padding: 10px; border-radius: 4px; overflow-x: auto; margin: 10px 0 0 0;">SELECT * FROM contact_submissions WHERE id = '${data.id}';</pre>
  </div>
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

    <p>Уважаемый(ая) ${data.sender_name},</p>

    <p>Мы получили ваше сообщение и ответим в течение <strong>24-48 часов</strong>.</p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Детали вашего сообщения:</h3>
      <p style="margin: 8px 0;"><strong>Тема:</strong> ${data.subject}</p>
      <p style="margin: 8px 0;"><strong>Тип:</strong> ${data.submission_type.replace(/_/g, ' ')}</p>
      <p style="margin: 8px 0;"><strong>Приоритет:</strong> ${data.priority}</p>
      <p style="margin: 8px 0;"><strong>ID обращения:</strong> <code>${data.id.substring(0, 8)}</code></p>
    </div>

    <p>Если у вас срочные вопросы, свяжитесь с нами напрямую:</p>
    <ul style="list-style: none; padding: 0;">
      <li>📧 <a href="mailto:${contactInfo.primary_email}" style="color: #667eea;">${contactInfo.primary_email}</a></li>
      ${contactInfo.support_email ? `<li>🆘 <a href="mailto:${contactInfo.support_email}" style="color: #667eea;">${contactInfo.support_email}</a></li>` : ''}
      ${contactInfo.partnerships_email ? `<li>💼 <a href="mailto:${contactInfo.partnerships_email}" style="color: #667eea;">${contactInfo.partnerships_email}</a></li>` : ''}
    </ul>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

    <p style="font-size: 14px; color: #666;">
      <strong>О TYT Foundation:</strong><br>
      Мы объединяем Web3-технологии с прозрачным финансированием для продвижения исследований опухолей мозга у детей и поддержки семей.
    </p>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        TYT Foundation | <a href="https://tyt.foundation" style="color: #667eea;">tyt.foundation</a>
      </p>
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        Каждая транзакция поддерживает исследования опухолей мозга у детей
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
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { record }: { record: ContactSubmission } = await req.json();

    if (!record || !record.id) {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseFunctionUrl = `${supabaseUrl}/functions/v1/send-email`;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch contact info from database with NULL safety
    const contactInfoResponse = await fetch(
      `${supabaseUrl}/rest/v1/foundation_contact_info?select=primary_email,support_email,partnerships_email,press_email,primary_phone,whatsapp_number,telegram_username&is_active=eq.true&limit=1`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    const contactInfoData = await contactInfoResponse.json();
    const contactInfo: ContactInfo = contactInfoData[0] || {
      primary_email: 'contact@tyt.foundation',
      support_email: null,
      partnerships_email: null,
      press_email: null,
      primary_phone: null,
      whatsapp_number: null,
      telegram_username: null,
    };

    // Ensure NULL safety with fallbacks
    const safeContactInfo: ContactInfo = {
      primary_email: contactInfo.primary_email || 'contact@tyt.foundation',
      support_email: contactInfo.support_email || null,
      partnerships_email: contactInfo.partnerships_email || null,
      press_email: contactInfo.press_email || null,
      primary_phone: contactInfo.primary_phone || null,
      whatsapp_number: contactInfo.whatsapp_number || null,
      telegram_username: contactInfo.telegram_username || null,
    };

    const language = record.language || 'en';
    const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.en;

    // 1. Send confirmation email to user
    const confirmationResponse = await fetch(supabaseFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        to: record.sender_email,
        subject: template.confirmation.subject,
        html: template.confirmation.html(record, safeContactInfo),
        submissionId: record.id,
      }),
    });

    const confirmationResult = await confirmationResponse.json();
    console.log("Confirmation email result:", confirmationResult);

    // 2. Send alert to admins
    // Get admin emails from database with NULL safety
    const adminsResponse = await fetch(
      `${supabaseUrl}/rest/v1/admin_users?select=contact_email&is_active=eq.true`,
      {
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    const admins = await adminsResponse.json();
    const adminEmails = admins
      .map((admin: { contact_email: string | null }) => admin.contact_email)
      .filter((email: string | null): email is string => !!email && email.trim() !== '');

    // Send to all admins
    for (const adminEmail of adminEmails) {
      await fetch(supabaseFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: adminEmail,
          subject: emailTemplates.en.adminAlert.subject(record),
          html: emailTemplates.en.adminAlert.html(record),
          submissionId: record.id,
        }),
      });
    }

    // If no admins found, send to default admin email
    if (adminEmails.length === 0) {
      await fetch(supabaseFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: safeContactInfo.primary_email,
          subject: emailTemplates.en.adminAlert.subject(record),
          html: emailTemplates.en.adminAlert.html(record),
          submissionId: record.id,
        }),
      });
    }

    // 3. Send Telegram notification to admins (if configured)
    let telegramSent = false;
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");

    if (telegramBotToken && telegramChatId) {
      try {
        const priorityEmoji = {
          urgent: "🚨",
          high: "⚠️",
          normal: "📬",
          low: "📝"
        }[record.priority] || "📬";

        const typeEmoji = {
          general_inquiry: "💬",
          support_request: "🆘",
          partnership_proposal: "🤝",
          donation_inquiry: "💰",
          research_collaboration: "🔬",
          media_inquiry: "📰",
          volunteer: "🙋",
          technical_issue: "⚙️",
          feedback: "💭"
        }[record.submission_type] || "📬";

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

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: telegramMessage,
              parse_mode: "Markdown",
              disable_web_page_preview: true,
            }),
          }
        );

        if (telegramResponse.ok) {
          telegramSent = true;
          console.log("Telegram notification sent successfully");
        } else {
          const errorData = await telegramResponse.json();
          console.error("Telegram API error:", errorData);
        }
      } catch (telegramError) {
        console.error("Telegram notification failed:", telegramError);
      }
    } else {
      console.log("Telegram not configured (TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID missing)");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notifications sent",
        confirmationSent: confirmationResult.success,
        adminAlertsSent: adminEmails.length || 1,
        telegramSent: telegramSent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
