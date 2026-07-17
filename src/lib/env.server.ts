import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).default("sqlite.db"),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Auth / Admin
  ADMIN_EMAILS: z.string().optional(),
  ADMIN_USER_IDS: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SUPPORT_EMAIL: z.string().default("sugargenius585@gmail.com"),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Monitoring / Sentry
  SENTRY_DSN: z.string().optional(),
  APP_ENV: z.string().default("development"),
  APP_VERSION: z.string().default("1.0.0"),
  BUILD_NUMBER: z.string().default("dev"),
  COMMIT_HASH: z.string().default("unknown"),

  // Backups
  BACKUP_DIR: z.string().default("./backups"),

  // Alerts
  ALERT_EMAIL: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),
  DISCORD_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),
}).catchall(z.string().optional()); // Allow dynamic keys like GOOGLE_CLIENT_ID, PRICE_PRO_MONTHLY

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
