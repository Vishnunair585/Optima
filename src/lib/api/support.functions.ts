import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { adminDb } from '../firebase-admin';
import { getSessionFn } from './auth.functions';
import nodemailer from 'nodemailer';

// --- UTILITIES --------------------------------------------

const generateTicketId = (type: string) => {
  const prefix = type === 'help' ? 'HLP' : type === 'bug' ? 'BUG' : 'FTR';
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${rand}`;
};

const generateId = () => Math.random().toString(36).substring(2, 15);

// --- EMAIL & AUDIT LOGGING (FIRESTORE) ----------------------

const logEmail = async (ticketId: string, recipient: string, subject: string, body: string, success: boolean) => {
  if (!adminDb) return;
  await adminDb.collection('email_logs').add({
    id: generateId(),
    ticket_id: ticketId,
    recipient,
    subject,
    body,
    status: success ? 'sent' : 'failed',
    created_at: Date.now()
  });
};

const sendEmail = async (to: string, subject: string, text: string) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Support <support@optima.com>',
          to: [to],
          subject,
          text
        })
      });
      return res.ok;
    } catch (error) {
      console.error("Email send failed:", error);
      return false;
    }
  }

  console.log(`[SMART NOTIFICATION SYSTEM] Sending to ${to}...`);
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });

    const info = await transporter.sendMail({
      from: '"Optima Support" <support@optima.com>',
      to: to,
      subject: subject,
      text: text,
    });
    
    console.log(`✅ Message sent successfully to ${to}`);
    console.log(`🔗 PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}`);
    return true;
  } catch (err) {
    console.error("Smart Notification failed:", err);
    return true; // Return true to not block the user flow
  }
};

const sendTicketEmails = async (ticketId: string, type: 'help' | 'bug' | 'feature', data: any, userEmail: string) => {
  const adminEmail = process.env.SUPPORT_EMAIL || "optimainc2026@gmail.com";
  const typeName = type === 'help' ? 'Help Request' : type === 'bug' ? 'Bug Report' : 'Feature Request';
  
  const adminSubject = `[${ticketId}] New ${typeName}: ${data.subject}`;
  const adminBody = `A new ${typeName} has been submitted.\n\nTicket ID: ${ticketId}\nSubject: ${data.subject}\nDescription: ${data.description}\n\nLogin to the admin dashboard to view full details.`;
  
  const userSubject = `Confirmation: We received your request (${ticketId})`;
  const userBody = `Hi ${data.first_name || 'there'},\n\nWe have received your ${typeName.toLowerCase()}. Your ticket number is ${ticketId}.\n\nOur support team will review this and get back to you shortly.\n\nThanks,\nOptima Support Team`;

  // Send to Admin
  const adminSuccess = await sendEmail(adminEmail, adminSubject, adminBody);
  await logEmail(ticketId, adminEmail, adminSubject, adminBody, adminSuccess);

  // Send to User
  const userSuccess = await sendEmail(userEmail, userSubject, userBody);
  await logEmail(ticketId, userEmail, userSubject, userBody, userSuccess);
};

const logAudit = async (ticketId: string, action: string, details: any, actorId: string | null = null) => {
  if (!adminDb) return;
  await adminDb.collection('audit_logs').add({
    id: generateId(),
    ticket_id: ticketId,
    action,
    details: JSON.stringify(details),
    actorId: actorId,
    created_at: Date.now()
  });
};

// --- PUBLIC: SUBMIT SUPPORT TICKET (FIRESTORE) ----------------

export const submitSupportTicketFn = createServerFn({ method: "POST" })
  .validator(z.object({
    type: z.enum(['help', 'bug', 'feature']),
    subject: z.string().min(3),
    description: z.string().min(10),
    category: z.string().default("General"),
    email: z.string().email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    severity: z.string().optional(),
    browser: z.string().optional(),
    operating_system: z.string().optional(),
    current_url: z.string().optional(),
    app_version: z.string().optional(),
    expected_behaviour: z.string().optional(),
    actual_behaviour: z.string().optional(),
    problem: z.string().optional(),
    suggested_solution: z.string().optional(),
    expected_benefit: z.string().optional(),
    who_benefits: z.string().optional(),
    business_impact: z.string().optional(),
    frequency_of_use: z.string().optional(),
    workaround: z.string().optional(),
    attachments: z.array(z.object({ file_url: z.string(), file_type: z.string(), file_name: z.string() })).optional()
  }))
  .handler(async ({ data }) => {
    const session = await getSessionFn();
    const ticketId = generateTicketId(data.type);

    if (adminDb) {
      // Rate Limiting: max 5 tickets per hour via Firestore
      const oneHourAgo = Date.now() - 3600000;
      const recentTicketsQuery = await adminDb.collection('support_tickets')
        .where('email', '==', data.email)
        .where('created_at', '>=', oneHourAgo)
        .get();
      
      if (recentTicketsQuery.size >= 5) {
        throw new Error("Rate limit exceeded. You can only submit 5 tickets per hour.");
      }

      const ticketDoc = {
        id: ticketId,
        user_id: session?.user?.id || null,
        type: data.type,
        subject: data.subject,
        description: data.description,
        category: data.category,
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        priority: data.type === 'bug' ? (data.severity === 'critical' ? 'urgent' : 'high') : 'normal',
        status: 'open',
        created_at: Date.now(),
        updated_at: Date.now()
      };
      
      await adminDb.collection('support_tickets').doc(ticketId).set(ticketDoc);

      if (data.type === 'bug') {
        await adminDb.collection('bug_reports').doc(ticketId).set({
          ...ticketDoc,
          severity: data.severity || null,
          browser: data.browser || null,
          operating_system: data.operating_system || null,
          current_url: data.current_url || null,
          app_version: data.app_version || null,
          expected_behaviour: data.expected_behaviour || null,
          actual_behaviour: data.actual_behaviour || null,
        });
      } else if (data.type === 'feature') {
        await adminDb.collection('feature_requests').doc(ticketId).set({
          ...ticketDoc,
          problem: data.problem || null,
          suggested_solution: data.suggested_solution || null,
          expected_benefit: data.expected_benefit || null,
          who_benefits: data.who_benefits || null,
          business_impact: data.business_impact || null,
          frequency_of_use: data.frequency_of_use || null,
          workaround: data.workaround || null,
        });
      }

      if (data.attachments && data.attachments.length > 0) {
        const batch = adminDb.batch();
        data.attachments.forEach(att => {
          const ref = adminDb!.collection('support_attachments').doc();
          batch.set(ref, {
            id: ref.id,
            ticket_id: ticketId,
            ...att,
            created_at: Date.now()
          });
        });
        await batch.commit();
      }

      await logAudit(ticketId, 'ticket_created', { type: data.type, subject: data.subject }, session?.user?.id);
      
      // Admin notification
      await adminDb.collection('notifications').add({
        id: generateId(),
        type: 'ticket_created',
        title: 'New Ticket Submitted',
        message: `Ticket ${ticketId} created by ${data.email}`,
        link: `/admin/support/${ticketId}`,
        read: false,
        created_at: Date.now()
      });
    } else {
      console.log(`[DB MOCK] Successfully saved ticket ${ticketId} to database.`);
    }

    // Send emails in background
    sendTicketEmails(ticketId, data.type, data, data.email).catch(console.error);

    return { success: true, ticketId };
  });

// --- USER READS (FIRESTORE) -----------------------------------

export const getUserTicketsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    const session = await getSessionFn();
    if (!session || !session.user) throw new Error("Unauthorized");
    
    const snapshot = await adminDb.collection('support_tickets')
      .where('user_id', '==', session.user.id)
      .orderBy('created_at', 'desc')
      .get();
      
    return snapshot.docs.map(doc => doc.data());
  });

export const getTicketDetailsFn = createServerFn({ method: "GET" })
  .validator(z.object({ ticketId: z.string() }))
  .handler(async ({ data }) => {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    const session = await getSessionFn();
    if (!session || !session.user) throw new Error("Unauthorized");

    const ticketDoc = await adminDb.collection('support_tickets').doc(data.ticketId).get();
    if (!ticketDoc.exists) throw new Error("Ticket not found");
    const ticket = ticketDoc.data();

    if (ticket?.user_id !== session.user.id) {
      const adminDoc = await adminDb.collection('users').doc(session.user.id).get();
      if (adminDoc.data()?.role !== 'super_admin') {
        throw new Error("Unauthorized");
      }
    }

    const repliesSnap = await adminDb.collection('ticket_messages')
      .where('ticket_id', '==', data.ticketId)
      .orderBy('created_at', 'asc')
      .get();
      
    const attachmentsSnap = await adminDb.collection('support_attachments')
      .where('ticket_id', '==', data.ticketId)
      .get();

    return {
      ticket,
      replies: repliesSnap.docs.map(doc => doc.data()),
      attachments: attachmentsSnap.docs.map(doc => doc.data())
    };
  });

export const replyToTicketFn = createServerFn({ method: "POST" })
  .validator(z.object({ ticketId: z.string(), message: z.string() }))
  .handler(async ({ data }) => {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    const session = await getSessionFn();
    if (!session || !session.user) throw new Error("Unauthorized");

    const ticketRef = adminDb.collection('support_tickets').doc(data.ticketId);
    const ticketDoc = await ticketRef.get();
    if (!ticketDoc.exists) throw new Error("Ticket not found");
    
    const ticket = ticketDoc.data();
    
    const adminDoc = await adminDb.collection('users').doc(session.user.id).get();
    const isAdmin = adminDoc.data()?.role === 'super_admin';

    if (ticket?.user_id !== session.user.id && !isAdmin) {
      throw new Error("Unauthorized");
    }

    await adminDb.collection('ticket_messages').add({
      id: generateId(),
      ticket_id: data.ticketId,
      user_id: session.user.id,
      message: data.message,
      is_admin_reply: isAdmin,
      created_at: Date.now()
    });

    await ticketRef.update({ updated_at: Date.now() });

    await logAudit(data.ticketId, 'reply_added', { is_admin: isAdmin }, session.user.id);

    return { success: true };
  });

// --- ADMIN: GET ALL TICKETS -----------------------------------

export const getAdminTicketsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    const session = await getSessionFn();
    if (!session || !session.user) throw new Error("Unauthorized");

    const adminDoc = await adminDb.collection('users').doc(session.user.id).get();
    if (adminDoc.data()?.role !== 'super_admin') throw new Error("Unauthorized");

    const snapshot = await adminDb.collection('support_tickets')
      .orderBy('created_at', 'desc')
      .get();
      
    return snapshot.docs.map(doc => doc.data());
  });

export const updateTicketStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({ ticketId: z.string(), status: z.string() }))
  .handler(async ({ data }) => {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    const session = await getSessionFn();
    if (!session || !session.user) throw new Error("Unauthorized");

    const adminDoc = await adminDb.collection('users').doc(session.user.id).get();
    if (adminDoc.data()?.role !== 'super_admin') {
      const ticketDoc = await adminDb.collection('support_tickets').doc(data.ticketId).get();
      if (ticketDoc.data()?.user_id !== session.user.id || data.status !== 'closed') {
         throw new Error("Unauthorized");
      }
    }

    await adminDb.collection('support_tickets').doc(data.ticketId).update({
      status: data.status,
      updated_at: Date.now()
    });
    
    await logAudit(data.ticketId, 'status_changed', { new_status: data.status }, session.user.id);
    return { success: true };
  });
