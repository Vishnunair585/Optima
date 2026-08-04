import { createServerFn } from '@tanstack/react-start';
import { createAdminServerFn, createProtectedServerFn } from './middleware';
import { adminDb } from '../firebase-admin';
import { getSessionFn } from './auth.functions';
import { SubmitBugRequestSchema, SubmitFeatureRequestSchema, SubmitContactRequestSchema, SupportTicket } from './support.schema';
import nodemailer from 'nodemailer';

const RATE_LIMIT_GUEST = 3;
const RATE_LIMIT_AUTH = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const generateTicketId = () => `OPT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

const checkRateLimit = async (identifier: string, isAuth: boolean) => {
  if (!adminDb) return;
  const now = Date.now();
  const limit = isAuth ? RATE_LIMIT_AUTH : RATE_LIMIT_GUEST;
  
  const snapshot = await adminDb.collection('rate_limits')
    .where('identifier', '==', identifier)
    .where('timestamp', '>', now - RATE_LIMIT_WINDOW_MS)
    .get();
    
  if (snapshot.size >= limit) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  await adminDb.collection('rate_limits').add({
    identifier,
    timestamp: now
  });
};

const sendHtmlEmail = async (to: string, subject: string, html: string) => {
  // 1. Try Resend API first if configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.SMTP_FROM || 'Optima Support <onboarding@resend.dev>',
          to: [to],
          subject,
          html
        })
      });
      return res.ok;
    } catch (e) {
      console.error("Resend error:", e);
    }
  }

  // 2. Try standard SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Optima Support" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html,
      });
      return true;
    } catch(e) {
      console.error("SMTP error:", e);
      return false;
    }
  }

  // 3. Fallback to ethereal for local dev testing
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await transporter.sendMail({
      from: '"Optima Dev" <support@optima.local>',
      to: to,
      subject: subject,
      html: html,
    });
    console.log(`🔗 PREVIEW EMAIL URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch(e) {
    console.error("Ethereal error:", e);
    return false;
  }
}

const processTicket = async (ticket: SupportTicket) => {
  if (!adminDb) {
    console.warn("Database not initialized. Mocking ticket save and emails for:", ticket.title);
    return ticket.ticketNumber;
  }

  // 1. DB Save MUST occur before sending emails
  await adminDb.collection('support_tickets').doc(ticket.id).set(ticket);

  // 2. Audit Log
  await adminDb.collection('audit_logs').add({
    id: generateTicketId() + '-log',
    ticketId: ticket.id,
    action: 'Ticket Created',
    actorId: ticket.userId || 'system',
    actorName: ticket.userName,
    timestamp: Date.now()
  });

  // 3. Analytics
  await adminDb.collection('analytics_events').add({
    type: 'support_ticket_created',
    ticketType: ticket.ticketType,
    timestamp: Date.now()
  });

  const adminEmail = process.env.SUPPORT_EMAIL || 'optimainc2026@gmail.com';
  
  const adminHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 24px;">New ${ticket.ticketType} Request</h2>
        <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background-color: #f1f5f9; color: #475569; border-radius: 999px; font-size: 12px; font-weight: 600; font-family: monospace;">${ticket.ticketNumber}</span>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 120px;">Priority</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: ${ticket.priority === 'Critical' ? '#ef4444' : ticket.priority === 'High' ? '#f59e0b' : '#3b82f6'}; font-weight: 600;">${ticket.priority}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Category</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">${ticket.category}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Submitted By</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">
            ${ticket.userName} <br/>
            <a href="mailto:${ticket.userEmail}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">${ticket.userEmail}</a>
          </td>
        </tr>
        ${ticket.company ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Company</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">${ticket.company}</td>
        </tr>` : ''}
        ${ticket.operatingSystem || ticket.browser ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Environment</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${ticket.operatingSystem} / ${ticket.browser} / v${ticket.appVersion}</td>
        </tr>` : ''}
        ${ticket.currentPage ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Origin URL</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;"><a href="${ticket.currentPage}" style="color: #3b82f6; text-decoration: none; font-size: 14px;">${ticket.currentPage}</a></td>
        </tr>` : ''}
      </table>

      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 16px;">${ticket.title}</h4>
        <div style="color: #334155; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${ticket.description}</div>
      </div>
      
      ${ticket.expectedBehaviour ? `
      <div style="margin-top: 16px; padding: 16px; border-left: 4px solid #10b981; background-color: #f0fdf4;">
        <strong style="color: #065f46; display: block; margin-bottom: 8px; font-size: 14px;">Expected Behavior:</strong>
        <div style="color: #064e3b; font-size: 14px;">${ticket.expectedBehaviour}</div>
      </div>
      <div style="margin-top: 8px; padding: 16px; border-left: 4px solid #ef4444; background-color: #fef2f2;">
        <strong style="color: #991b1b; display: block; margin-bottom: 8px; font-size: 14px;">Actual Behavior:</strong>
        <div style="color: #7f1d1d; font-size: 14px;">${ticket.actualBehaviour}</div>
      </div>
      ` : ''}
      
      ${ticket.proposedSolution ? `
      <div style="margin-top: 16px; padding: 16px; border-left: 4px solid #3b82f6; background-color: #eff6ff;">
        <strong style="color: #1e40af; display: block; margin-bottom: 8px; font-size: 14px;">Suggested Solution:</strong>
        <div style="color: #1e3a8a; font-size: 14px;">${ticket.proposedSolution}</div>
      </div>
      ` : ''}
    </div>
  `;

  const userHtml = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0066ff; margin-top: 0;">Optima</h2>
      <h3 style="color: #0f172a; font-size: 20px;">We've received your request!</h3>
      <p style="color: #334155; font-size: 16px; line-height: 1.5;">Hi ${ticket.userName.split(' ')[0]},</p>
      <p style="color: #334155; font-size: 16px; line-height: 1.5;">Thank you for reaching out to us. We have successfully received your <b>${ticket.ticketType}</b> submission.</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">TICKET NUMBER</p>
        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-family: monospace; font-weight: 600;">${ticket.ticketNumber}</p>
        
        <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px;">STATUS</p>
        <p style="margin: 0 0 16px 0; color: #3b82f6; font-size: 15px; font-weight: 500;">${ticket.status} &bull; Expected Response: 24-48 Hours</p>
      </div>
      
      <p style="color: #334155; font-size: 16px; line-height: 1.5;">Our support team will review your submission and get back to you shortly. If you need to add any additional context, simply reply directly to this email.</p>
      
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 32px 0;"/>
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">Optima Inc. &copy; ${new Date().getFullYear()}</p>
    </div>
  `;

  // Do not block response waiting for email, but await for the log creation
  const adminSent = await sendHtmlEmail(adminEmail, `[NEW ${ticket.ticketType.toUpperCase()}] ${ticket.title}`, adminHtml);
  const userSent = await sendHtmlEmail(ticket.userEmail, `We've received your request (${ticket.ticketNumber})`, userHtml);

  // 5. Log Emails
  await adminDb.collection('email_logs').add({ ticket_id: ticket.id, recipient: adminEmail, status: adminSent ? 'sent' : 'failed', created_at: Date.now() });
  await adminDb.collection('email_logs').add({ ticket_id: ticket.id, recipient: ticket.userEmail, status: userSent ? 'sent' : 'failed', created_at: Date.now() });
  
  if (!adminSent || !userSent) {
     await adminDb.collection('audit_logs').add({ ticketId: ticket.id, action: 'Email Failed', actorId: 'system', actorName: 'System', timestamp: Date.now() });
  }

  return ticket.ticketNumber;
}

export const submitBugReportFn = createServerFn({ method: "POST" })
  .validator(SubmitBugRequestSchema)
  .handler(async ({ data }) => {
  const session = await getSessionFn();
  
  await checkRateLimit(session?.uid || 'guest', !!session);

  const ticketNumber = generateTicketId();
  const ticket: SupportTicket = {
    id: ticketNumber,
    ticketNumber,
    ticketType: 'Bug',
    status: 'Open',
    priority: data.severity.toLowerCase().includes('critical') ? 'Critical' : data.severity.toLowerCase().includes('high') ? 'High' : 'Medium',
    title: data.title,
    description: data.description,
    category: data.category,
    userId: session?.uid || null,
    userEmail: session?.email || 'guest@example.com',
    userName: session?.email?.split('@')[0] || 'Guest User',
    browser: data.browser,
    operatingSystem: data.os,
    appVersion: data.app_version,
    currentPage: data.url,
    expectedBehaviour: data.expected_behaviour,
    actualBehaviour: data.actual_behaviour,
    attachments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastReplyAt: Date.now(),
  };

  await processTicket(ticket);
  return { success: true, ticket_id: ticketNumber };
});

export const submitFeatureRequestFn = createServerFn({ method: "POST" })
  .validator(SubmitFeatureRequestSchema)
  .handler(async ({ data }) => {
  const session = await getSessionFn();
  
  await checkRateLimit(session?.uid || 'guest', !!session);

  const ticketNumber = generateTicketId();
  const ticket: SupportTicket = {
    id: ticketNumber,
    ticketNumber,
    ticketType: 'Feature',
    status: 'Open',
    priority: data.priority.toLowerCase().includes('critical') ? 'Critical' : data.priority.toLowerCase().includes('high') ? 'High' : 'Medium',
    title: data.title,
    description: data.description,
    category: data.category,
    userId: session?.uid || null,
    userEmail: session?.email || 'guest@example.com',
    userName: session?.email?.split('@')[0] || 'Guest User',
    proposedSolution: data.suggested_solution,
    businessValue: data.business_impact,
    attachments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastReplyAt: Date.now(),
  };

  await processTicket(ticket);
  return { success: true, ticket_id: ticketNumber };
});

export const submitSupportTicketFn = createServerFn({ method: "POST" })
  .validator(SubmitContactRequestSchema)
  .handler(async ({ data }) => {
  const session = await getSessionFn();
  
  await checkRateLimit(session?.uid || data.email, !!session);

  const ticketNumber = generateTicketId();
  const ticket: SupportTicket = {
    id: ticketNumber,
    ticketNumber,
    ticketType: data.category === 'bug' ? 'Bug' : data.category === 'feature' ? 'Feature' : 'Contact',
    status: 'Open',
    priority: 'Medium',
    title: data.subject,
    description: data.message,
    category: data.category,
    userId: session?.uid || null,
    userEmail: data.email,
    userName: `${data.firstName} ${data.lastName}`,
    company: data.company,
    attachments: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastReplyAt: Date.now(),
  };

  await processTicket(ticket);
  return { success: true, ticket_id: ticketNumber };
});

export const getAdminTicketsFn = createAdminServerFn({ method: "GET" }).handler(async () => { return []; });
export const updateTicketStatusFn = createAdminServerFn({ method: "POST" }).handler(async () => { return { success: true }; });
export const replyToTicketFn = createProtectedServerFn({ method: "POST" }).handler(async () => { return { success: true }; });
export const getUserTicketsFn = createProtectedServerFn({ method: "GET" }).handler(async () => { return []; });
export const getTicketDetailsFn = createProtectedServerFn({ method: "GET" }).handler(async () => { return null; });
