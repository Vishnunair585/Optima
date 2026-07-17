CREATE TABLE `ai_tools` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`vendor` text NOT NULL,
	`category` text NOT NULL,
	`price` text NOT NULL,
	`has_free_tier` integer NOT NULL,
	`popularity_score` integer NOT NULL,
	`growth_score` integer NOT NULL,
	`review_score` integer NOT NULL,
	`reliability_score` integer NOT NULL,
	`overall_score` real,
	`trend_indicator` text NOT NULL,
	`color` text NOT NULL,
	`last_verified_at` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `community_feature_bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`feature_id` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `community_feature_follows` (
	`id` text PRIMARY KEY NOT NULL,
	`feature_id` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `community_feature_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`problem` text NOT NULL,
	`solution` text NOT NULL,
	`expected_benefit` text NOT NULL,
	`who_benefits` text NOT NULL,
	`category` text NOT NULL,
	`priority` text NOT NULL,
	`business_impact` text NOT NULL,
	`frequency_of_use` text NOT NULL,
	`workaround` text NOT NULL,
	`attachments` text NOT NULL,
	`mockups` text NOT NULL,
	`reference_links` text NOT NULL,
	`status` text NOT NULL,
	`votes_count` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `community_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `crawler_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`retry_count` integer DEFAULT 0 NOT NULL,
	`next_run_at` integer NOT NULL,
	`logs` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `intelligence_sources`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `creator_badges` (
	`id` text PRIMARY KEY NOT NULL,
	`badge_name` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creator_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`bio` text NOT NULL,
	`reputation_score` integer NOT NULL,
	`is_verified` integer NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `intelligence_approval_queue` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`data` text NOT NULL,
	`source_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`confidence_score` integer DEFAULT 0,
	`reviewed_by` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `intelligence_news_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`headline` text NOT NULL,
	`summary` text NOT NULL,
	`source_url` text NOT NULL,
	`author` text,
	`published_date` integer,
	`tags` text NOT NULL,
	`sentiment` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `intelligence_news_articles_source_url_unique` ON `intelligence_news_articles` (`source_url`);--> statement-breakpoint
CREATE TABLE `intelligence_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`frequency_minutes` integer DEFAULT 60 NOT NULL,
	`last_run_at` integer,
	`error_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `bug_reports` ADD `expected_behaviour` text;--> statement-breakpoint
ALTER TABLE `bug_reports` ADD `actual_behaviour` text;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `closed_at` integer;