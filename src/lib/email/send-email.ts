import nodemailer from "nodemailer";
import { env } from "../env.server";

const smtpHost = env.SMTP_HOST || "smtp.resend.com";
const smtpPort = env.SMTP_PORT || 465;
const smtpUser = env.SMTP_USER || "resend";
const smtpPass = env.EMAIL_PROVIDER_API_KEY || env.SMTP_PASS;
const fromEmail = env.EMAIL_FROM || env.SMTP_FROM || "Optima Support <noreply@optima.app>";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (smtpHost && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
  }

  return transporter;
}

export async function sendEmail(to: string, subject: string, body: string, isHtml: boolean = false) {
  const t = getTransporter();

  const htmlTemplate = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #6366f1;">Optima Support</h2>
      <div style="color: #333; line-height: 1.6;">
        ${isHtml ? body : body.replace(/\n/g, '<br>')}
      </div>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="font-size: 12px; color: #888;">
        Optima - AI Discovery & Intelligence Platform<br>
        <a href="https://optima.app" style="color: #6366f1; text-decoration: none;">optima.app</a>
      </p>
    </div>
  `;

  if (t) {
    try {
      await t.sendMail({
        from: fromEmail,
        to,
        subject,
        text: body,
        html: htmlTemplate,
      });
      console.log(`[EMAIL] Sent to ${to}: ${subject}`);
      return true;
    } catch (err) {
      console.error(`[EMAIL] Failed to send to ${to}:`, err);
      return false;
    }
  }

  // Fallback: log to console
  console.log("=".repeat(60));
  console.log(`[EMAIL FALLBACK] To: ${to}`);
  console.log(`[EMAIL FALLBACK] Subject: ${subject}`);
  console.log(`[EMAIL FALLBACK] Body:\n${body}`);
  console.log("=".repeat(60));
  return true;
}

export function isEmailConfigured() {
  return !!(smtpHost && smtpUser && smtpPass);
}
