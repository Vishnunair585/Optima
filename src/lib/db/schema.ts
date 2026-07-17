import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  avatar: text("avatar"),
  email_verified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
  onboarded: integer("onboarded", { mode: "boolean" }).default(false).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
  ip_address: text("ip_address"),
  device_info: text("device_info"),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const userProfiles = sqliteTable("user_profiles", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  full_name: text("full_name").notNull(),
  username: text("username").notNull().unique(),
  avatar_url: text("avatar_url"),
  user_type: text("user_type").notNull(), // Student, Developer, Founder, etc.
  experience_level: text("experience_level").notNull(), // Beginner, Intermediate, Advanced
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const userPreferences = sqliteTable("user_preferences", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  goals: text("goals").notNull(), // JSON array
  favorite_tools: text("favorite_tools").notNull(), // JSON array
  categories: text("categories").notNull(), // JSON array
});

export const toolComparisons = sqliteTable("tool_comparisons", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  comparison_name: text("comparison_name").notNull(),
  tool_ids: text("tool_ids").notNull(), // JSON array of tool names
  slug: text("slug").notNull().unique(), // e.g. "chatgpt-vs-claude-vs-gemini"
  view_count: integer("view_count").default(0).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const stacks = sqliteTable("stacks", {
  id: text("id").primaryKey(), // UUID
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goal: text("goal").notNull(),
  category: text("category").notNull(),
  difficulty_level: text("difficulty_level").notNull(), // Beginner, Intermediate, Advanced
  is_public: integer("is_public", { mode: "boolean" }).default(true).notNull(),
  likes_count: integer("likes_count").default(0).notNull(),
  views_count: integer("views_count").default(0).notNull(),
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const stackTools = sqliteTable("stack_tools", {
  id: text("id").primaryKey(), // UUID
  stack_id: text("stack_id").notNull().references(() => stacks.id, { onDelete: "cascade" }),
  tool_id: text("tool_id").notNull(), // Tool name or identifier
  position: integer("position").notNull(), // Sequence order
  purpose: text("purpose").notNull(), // Custom purpose defined by user
});

export const stackLikes = sqliteTable("stack_likes", {
  id: text("id").primaryKey(),
  stack_id: text("stack_id").notNull().references(() => stacks.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const stackBookmarks = sqliteTable("stack_bookmarks", {
  id: text("id").primaryKey(),
  stack_id: text("stack_id").notNull().references(() => stacks.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const stackComments = sqliteTable("stack_comments", {
  id: text("id").primaryKey(),
  stack_id: text("stack_id").notNull().references(() => stacks.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parent_id: text("parent_id"), // references stack_comments.id for nested replies
  content: text("content").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(), // UUID
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  event_name: text("event_name").notNull(),
  page_url: text("page_url").notNull(),
  session_id: text("session_id").notNull(),
  metadata: text("metadata").notNull(), // JSON string representation
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const userSessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(), // Session ID UUID
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  session_start: integer("session_start", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  session_end: integer("session_end", { mode: "timestamp" }),
  device: text("device").notNull(),
  browser: text("browser").notNull(),
  country: text("country").notNull(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(), // UUID
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripe_customer_id: text("stripe_customer_id").notNull(),
  stripe_subscription_id: text("stripe_subscription_id"),
  plan_name: text("plan_name").default("Free").notNull(), // Free, Pro, Team
  status: text("status").default("active").notNull(), // active, trialing, past_due, canceled
  billing_cycle: text("billing_cycle").default("monthly").notNull(), // monthly, yearly
  current_period_start: integer("current_period_start", { mode: "timestamp" }).notNull(),
  current_period_end: integer("current_period_end", { mode: "timestamp" }).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const userUsage = sqliteTable("user_usage", {
  id: text("id").primaryKey(), // UUID
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  period_start: integer("period_start", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  period_end: integer("period_end", { mode: "timestamp" }).notNull(),
  comparisons_count: integer("comparisons_count").default(0).notNull(),
  stacks_count: integer("stacks_count").default(0).notNull(),
  saved_tools_count: integer("saved_tools_count").default(0).notNull(),
  premium_feature_count: integer("premium_feature_count").default(0).notNull(),
  reset_at: integer("reset_at", { mode: "timestamp" }).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const usageEvents = sqliteTable("usage_events", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  feature: text("feature").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  plan_name: text("plan_name").notNull(),
  metadata: text("metadata").default("{}").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const paymentHistory = sqliteTable("payment_history", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  stripe_invoice_id: text("stripe_invoice_id").unique(),
  stripe_payment_intent_id: text("stripe_payment_intent_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
  amount_paid: integer("amount_paid").default(0).notNull(),
  currency: text("currency").default("usd").notNull(),
  status: text("status").notNull(),
  hosted_invoice_url: text("hosted_invoice_url"),
  invoice_pdf: text("invoice_pdf"),
  paid_at: integer("paid_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const billingEvents = sqliteTable("billing_events", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  event_name: text("event_name").notNull(),
  stripe_event_id: text("stripe_event_id").unique(),
  metadata: text("metadata").default("{}").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const coupons = sqliteTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  stripe_coupon_id: text("stripe_coupon_id"),
  stripe_promotion_code_id: text("stripe_promotion_code_id"),
  discount_type: text("discount_type").notNull(), // percent, amount, referral
  discount_value: integer("discount_value").notNull(),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  max_redemptions: integer("max_redemptions"),
  redeemed_count: integer("redeemed_count").default(0).notNull(),
  expires_at: integer("expires_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const teamWorkspaces = sqliteTable("team_workspaces", {
  id: text("id").primaryKey(),
  owner_user_id: text("owner_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscription_id: text("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  seats_purchased: integer("seats_purchased").default(1).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  workspace_id: text("workspace_id").notNull().references(() => teamWorkspaces.id, { onDelete: "cascade" }),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  role: text("role").default("member").notNull(), // owner, admin, member
  status: text("status").default("invited").notNull(), // invited, active, removed
  invited_at: integer("invited_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  joined_at: integer("joined_at", { mode: "timestamp" }),
});

export const emailNotifications = sqliteTable("email_notifications", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull(),
  type: text("type").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").default("queued").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  sent_at: integer("sent_at", { mode: "timestamp" }),
});

export const referralCodes = sqliteTable("referral_codes", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  code: text("code").notNull().unique(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const referrals = sqliteTable("referrals", {
  id: text("id").primaryKey(),
  referrer_user_id: text("referrer_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referred_user_id: text("referred_user_id").references(() => users.id, { onDelete: "set null" }),
  referral_code: text("referral_code").notNull(),
  status: text("status").default("pending").notNull(),
  reward_granted: integer("reward_granted", { mode: "boolean" }).default(false).notNull(),
  revenue_cents: integer("revenue_cents").default(0).notNull(),
  ip_address: text("ip_address"),
  fingerprint: text("fingerprint"),
  qualified_at: integer("qualified_at", { mode: "timestamp" }),
  converted_at: integer("converted_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const referralClicks = sqliteTable("referral_clicks", {
  id: text("id").primaryKey(),
  referral_code: text("referral_code").notNull(),
  referrer_user_id: text("referrer_user_id").references(() => users.id, { onDelete: "set null" }),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  session_id: text("session_id"),
  is_vpn_suspected: integer("is_vpn_suspected", { mode: "boolean" }).default(false).notNull(),
  converted: integer("converted", { mode: "boolean" }).default(false).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const referralRewardMilestones = sqliteTable("referral_reward_milestones", {
  id: text("id").primaryKey(),
  referral_count: integer("referral_count").notNull(),
  reward_type: text("reward_type").notNull(),
  reward_value: integer("reward_value").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const referralRewardsGranted = sqliteTable("referral_rewards_granted", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  milestone_id: text("milestone_id").references(() => referralRewardMilestones.id, { onDelete: "set null" }),
  reward_type: text("reward_type").notNull(),
  reward_value: integer("reward_value").notNull(),
  granted_at: integer("granted_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const userBadges = sqliteTable("user_badges", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badge_key: text("badge_key").notNull(),
  earned_at: integer("earned_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const referralFraudAlerts = sqliteTable("referral_fraud_alerts", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  referral_id: text("referral_id").references(() => referrals.id, { onDelete: "set null" }),
  alert_type: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  metadata: text("metadata").default("{}").notNull(),
  resolved: integer("resolved", { mode: "boolean" }).default(false).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const emailVerificationTokens = sqliteTable("email_verification_tokens", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const referralInvites = sqliteTable("referral_invites", {
  id: text("id").primaryKey(),
  referrer_user_id: text("referrer_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  status: text("status").default("sent").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Monitoring & Observability Tables ────────────────────────────────

export const systemLogs = sqliteTable("system_logs", {
  id: text("id").primaryKey(),
  event_type: text("event_type").notNull(), // login, signup, oauth, admin_action, db_operation, subscription, security
  severity: text("severity").notNull().default("info"), // debug, info, warn, error, critical
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  description: text("description").notNull(),
  metadata: text("metadata").default("{}").notNull(), // JSON
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  action: text("action").notNull(), // tool.created, tool.updated, tool.deleted, user.role_changed, subscription.changed, admin.changed
  entity_type: text("entity_type").notNull(), // tool, user, subscription, comparison, stack
  entity_id: text("entity_id").notNull(),
  actor_id: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  changes: text("changes").default("{}").notNull(), // JSON diff
  ip_address: text("ip_address"),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const securityEvents = sqliteTable("security_events", {
  id: text("id").primaryKey(),
  event_type: text("event_type").notNull(), // brute_force, suspicious_login, repeated_failure, unauthorized_access
  severity: text("severity").notNull().default("warn"), // warn, critical
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  ip_address: text("ip_address").notNull(),
  description: text("description").notNull(),
  metadata: text("metadata").default("{}").notNull(), // JSON
  resolved: integer("resolved", { mode: "boolean" }).default(false).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const backupLogs = sqliteTable("backup_logs", {
  id: text("id").primaryKey(),
  backup_type: text("backup_type").notNull(), // daily, weekly, monthly
  status: text("status").notNull().default("running"), // running, completed, failed
  file_path: text("file_path"),
  file_size_bytes: integer("file_size_bytes"),
  rows_backed_up: integer("rows_backed_up"),
  error_message: text("error_message"),
  started_at: integer("started_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  completed_at: integer("completed_at", { mode: "timestamp" }),
});

export const alertHistory = sqliteTable("alert_history", {
  id: text("id").primaryKey(),
  alert_type: text("alert_type").notNull(), // downtime, error_spike, traffic_spike, security_incident, stripe_failure
  severity: text("severity").notNull().default("warn"), // info, warn, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  metadata: text("metadata").default("{}").notNull(), // JSON
  channels: text("channels").default("[]").notNull(), // JSON array ["email","slack","discord"]
  delivered: integer("delivered", { mode: "boolean" }).default(false).notNull(),
  acknowledged_at: integer("acknowledged_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Helpdesk & Ticketing System ────────────────────────────────

export const supportTickets = sqliteTable("support_tickets", {
  id: text("id").primaryKey(), // e.g. OPT-HLP-2026-000152
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }), // Nullable if guest allows
  type: text("type").notNull(), // 'help', 'bug', 'feature'
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("new").notNull(), // 'new', 'open', 'investigating', 'waiting_for_user', 'resolved', 'closed', 'archived'
  priority: text("priority").default("normal").notNull(), // 'low', 'normal', 'high', 'urgent'
  category: text("category").notNull().default("General"),
  email: text("email").notNull(), // Contact email
  first_name: text("first_name"),
  last_name: text("last_name"),
  assigned_to: text("assigned_to").references(() => users.id, { onDelete: "set null" }), // Admin
  resolved_at: integer("resolved_at", { mode: "timestamp" }),
  closed_at: integer("closed_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const bugReports = sqliteTable("bug_reports", {
  ticket_id: text("ticket_id").primaryKey().references(() => supportTickets.id, { onDelete: "cascade" }),
  severity: text("severity").notNull(), // 'critical', 'major', 'minor', 'cosmetic'
  browser: text("browser"),
  operating_system: text("operating_system"),
  current_url: text("current_url"),
  app_version: text("app_version"),
  expected_behaviour: text("expected_behaviour"),
  actual_behaviour: text("actual_behaviour"),
});

export const featureRequests = sqliteTable("feature_requests", {
  ticket_id: text("ticket_id").primaryKey().references(() => supportTickets.id, { onDelete: "cascade" }),
  problem: text("problem"),
  suggested_solution: text("suggested_solution"),
  expected_benefit: text("expected_benefit"),
  who_benefits: text("who_benefits"),
  business_impact: text("business_impact"),
  frequency_of_use: text("frequency_of_use"),
  workaround: text("workaround"),
  votes_count: integer("votes_count").default(0).notNull(),
});

export const supportAttachments = sqliteTable("support_attachments", {
  id: text("id").primaryKey(),
  ticket_id: text("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  file_url: text("file_url").notNull(),
  file_type: text("file_type").notNull(),
  file_name: text("file_name").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const supportEmailLogs = sqliteTable("support_email_logs", {
  id: text("id").primaryKey(),
  ticket_id: text("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull(), // 'sent', 'failed', 'retrying'
  error_message: text("error_message"),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const supportAuditLogs = sqliteTable("support_audit_logs", {
  id: text("id").primaryKey(),
  ticket_id: text("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // 'status_changed', 'assigned', 'note_added', 'email_sent', 'created'
  actor_id: text("actor_id").references(() => users.id, { onDelete: "set null" }), // Admin/System/User
  details: text("details").notNull(), // JSON
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const ticketReplies = sqliteTable("ticket_replies", {
  id: text("id").primaryKey(),
  ticket_id: text("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }), // null if system auto-reply
  message: text("message").notNull(),
  is_internal_note: integer("is_internal_note", { mode: "boolean" }).default(false).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const featureVotes = sqliteTable("feature_votes", {
  id: text("id").primaryKey(),
  ticket_id: text("ticket_id").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  user_id: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Changelog System ────────────────────────────────

export const changelogReleases = sqliteTable("changelog_releases", {
  id: text("id").primaryKey(), // UUID
  version: text("version").notNull().unique(), // e.g. v2.5.0
  release_name: text("release_name").notNull(),
  release_date: integer("release_date", { mode: "timestamp" }).notNull(),
  type: text("type").notNull(), // major, minor, patch, hotfix, security, performance, ai_update
  impact: text("impact").notNull(), // low, medium, high, breaking
  author_id: text("author_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").default("draft").notNull(), // draft, published, scheduled, archived
  
  // Content Sections (Markdown)
  overview: text("overview").notNull(),
  new_features: text("new_features"),
  improvements: text("improvements"),
  bug_fixes: text("bug_fixes"),
  performance_optimizations: text("performance_optimizations"),
  security_enhancements: text("security_enhancements"),
  breaking_changes: text("breaking_changes"),
  migration_notes: text("migration_notes"),
  deprecated_features: text("deprecated_features"),
  known_issues: text("known_issues"),
  upcoming_features: text("upcoming_features"),
  
  // SEO & Metadata
  seo_title: text("seo_title"),
  meta_description: text("meta_description"),
  cover_image_url: text("cover_image_url"),
  
  // JSON arrays for categories and tags
  categories: text("categories").default("[]").notNull(),
  tags: text("tags").default("[]").notNull(),
  
  views_count: integer("views_count").default(0).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const changelogSubscribers = sqliteTable("changelog_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Newsletter System ────────────────────────────────

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  verified: integer("verified", { mode: "boolean" }).default(false).notNull(),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  preferences: text("preferences").default("{}").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const newsletterCampaigns = sqliteTable("newsletter_campaigns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").default("[]").notNull(),
  status: text("status").default("draft").notNull(),
  scheduled_at: integer("scheduled_at", { mode: "timestamp" }),
  sent_at: integer("sent_at", { mode: "timestamp" }),
  sent_count: integer("sent_count").default(0).notNull(),
  open_count: integer("open_count").default(0).notNull(),
  click_count: integer("click_count").default(0).notNull(),
  author_id: text("author_id").references(() => users.id, { onDelete: "set null" }),
  cover_image: text("cover_image"),
  read_time: integer("read_time").default(3).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Help Center ────────────────────────────────

export const helpArticles = sqliteTable("help_articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").default("[]").notNull(),
  status: text("status").default("draft").notNull(),
  author_id: text("author_id").references(() => users.id, { onDelete: "set null" }),
  read_time: integer("read_time").default(5).notNull(),
  views_count: integer("views_count").default(0).notNull(),
  helpful_count: integer("helpful_count").default(0).notNull(),
  not_helpful_count: integer("not_helpful_count").default(0).notNull(),
  related_articles: text("related_articles").default("[]").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── System Status ────────────────────────────────

export const statusServices = sqliteTable("status_services", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  status: text("status").default("operational").notNull(),
  sort_order: integer("sort_order").default(0).notNull(),
  uptime_24h: text("uptime_24h").default("100.0").notNull(),
  uptime_7d: text("uptime_7d").default("100.0").notNull(),
  uptime_30d: text("uptime_30d").default("100.0").notNull(),
  uptime_90d: text("uptime_90d").default("100.0").notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const statusIncidents = sqliteTable("status_incidents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  status: text("status").default("investigating").notNull(),
  affected_services: text("affected_services").default("[]").notNull(),
  timeline: text("timeline").default("[]").notNull(),
  root_cause: text("root_cause"),
  started_at: integer("started_at", { mode: "timestamp" }).notNull(),
  resolved_at: integer("resolved_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const statusSubscribers = sqliteTable("status_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  user_id: text("user_id").references(() => users.id, { onDelete: "set null" }),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Ecosystem: Resources (Blog, Docs, Tutorials) ──────────────

export const contentArticles = sqliteTable("content_articles", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // 'blog', 'doc', 'tutorial'
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").default("[]").notNull(),
  status: text("status").default("draft").notNull(),
  author_id: text("author_id").references(() => users.id, { onDelete: "set null" }),
  cover_image: text("cover_image"),
  read_time: integer("read_time").default(5).notNull(),
  difficulty: text("difficulty"), // For tutorials
  views_count: integer("views_count").default(0).notNull(),
  likes_count: integer("likes_count").default(0).notNull(),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  published_at: integer("published_at", { mode: "timestamp" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const contentComments = sqliteTable("content_comments", {
  id: text("id").primaryKey(),
  article_id: text("article_id").references(() => contentArticles.id, { onDelete: "cascade" }).notNull(),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ─── Ecosystem: Legal & Compliance ─────────────────────────────

export const legalPolicies = sqliteTable("legal_policies", {
  id: text("id").primaryKey(),
  type: text("type").notNull().unique(), // 'privacy', 'terms', 'cookie', etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  version: text("version").notNull(),
  status: text("status").default("draft").notNull(), // 'draft', 'published', 'archived'
  effective_date: integer("effective_date", { mode: "timestamp" }).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const consentLogs = sqliteTable("consent_logs", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  consent_type: text("consent_type").notNull(), // 'cookie_essential', 'cookie_analytics', 'terms_v1', etc.
  consented: integer("consented", { mode: "boolean" }).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});


// NOTE: Community Hub and Support Bug/Feature tracking have been unified into the Helpdesk & Ticketing System above.

// ─── AI Market Intelligence Engine ──────────────────────────

export const intelligenceSources = sqliteTable("intelligence_sources", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // "rss", "api", "github", "html"
  is_active: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  frequency_minutes: integer("frequency_minutes").default(60).notNull(),
  last_run_at: integer("last_run_at", { mode: "timestamp" }),
  error_count: integer("error_count").default(0).notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const crawlerJobs = sqliteTable("crawler_jobs", {
  id: text("id").primaryKey(),
  source_id: text("source_id").references(() => intelligenceSources.id, { onDelete: "cascade" }).notNull(),
  status: text("status").default("pending").notNull(), // "pending", "running", "completed", "failed"
  retry_count: integer("retry_count").default(0).notNull(),
  next_run_at: integer("next_run_at", { mode: "timestamp" }).notNull(),
  logs: text("logs"),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const intelligenceNewsArticles = sqliteTable("intelligence_news_articles", {
  id: text("id").primaryKey(),
  headline: text("headline").notNull(),
  summary: text("summary").notNull(),
  source_url: text("source_url").notNull().unique(),
  author: text("author"),
  published_date: integer("published_date", { mode: "timestamp" }),
  tags: text("tags").notNull(), // JSON array
  sentiment: text("sentiment"),
  status: text("status").default("pending").notNull(), // "pending", "approved", "rejected"
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const intelligenceApprovalQueue = sqliteTable("intelligence_approval_queue", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // "tool", "news", "update"
  title: text("title").notNull(),
  data: text("data").notNull(), // JSON string payload
  source_url: text("source_url"),
  status: text("status").default("pending").notNull(), // "pending", "approved", "rejected"
  confidence_score: integer("confidence_score").default(0),
  reviewed_by: text("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  created_at: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});export const communityFeatureRequests = sqliteTable('community_feature_requests', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  problem: text('problem').notNull(),
  solution: text('solution').notNull(),
  expected_benefit: text('expected_benefit').notNull(),
  who_benefits: text('who_benefits').notNull(),
  category: text('category').notNull(),
  priority: text('priority').notNull(),
  business_impact: text('business_impact').notNull(),
  frequency_of_use: text('frequency_of_use').notNull(),
  workaround: text('workaround').notNull(),
  attachments: text('attachments').notNull(),
  mockups: text('mockups').notNull(),
  reference_links: text('reference_links').notNull(),
  status: text('status').notNull(),
  votes_count: integer('votes_count').notNull(),
  user_id: text('user_id').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const communityVotes = sqliteTable('community_votes', {
  id: text('id').primaryKey(),
  request_id: text('request_id').notNull(),
  user_id: text('user_id').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const creatorProfiles = sqliteTable('creator_profiles', {
  id: text('id').primaryKey(),
  bio: text('bio').notNull(),
  reputation_score: integer('reputation_score').notNull(),
  is_verified: integer('is_verified', { mode: 'boolean' }).notNull(),
  user_id: text('user_id').notNull(),
});

export const creatorBadges = sqliteTable('creator_badges', {
  id: text('id').primaryKey(),
  badge_name: text('badge_name').notNull(),
  user_id: text('user_id').notNull(),
});

export const communityFeatureFollows = sqliteTable('community_feature_follows', {
  id: text('id').primaryKey(),
  feature_id: text('feature_id').notNull(),
  user_id: text('user_id').notNull(),
});

export const communityFeatureBookmarks = sqliteTable('community_feature_bookmarks', {
  id: text('id').primaryKey(),
  feature_id: text('feature_id').notNull(),
  user_id: text('user_id').notNull(),
});

export const aiTools = sqliteTable('ai_tools', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  vendor: text('vendor').notNull(),
  category: text('category').notNull(),
  price: text('price').notNull(),
  has_free_tier: integer('has_free_tier', { mode: 'boolean' }).notNull(),
  popularity_score: integer('popularity_score').notNull(),
  growth_score: integer('growth_score').notNull(),
  review_score: integer('review_score').notNull(),
  reliability_score: integer('reliability_score').notNull(),
  overall_score: real('overall_score'),
  trend_indicator: text('trend_indicator').notNull(),
  color: text('color').notNull(),
  last_verified_at: text('last_verified_at').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updated_at: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

