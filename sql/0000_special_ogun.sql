CREATE TABLE IF NOT EXISTS "cms_client" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_" jsonb,
	"identity_" jsonb NOT NULL,
	"user_uuid" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "cms_client_user_uuid_unique" UNIQUE("user_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"likes" jsonb,
	"comments" jsonb,
	"backlinks" jsonb,
	"shares" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_reactionshistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"type" text NOT NULL,
	"ip" text NOT NULL,
	"member_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"email_" text NOT NULL,
	"phone_no" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_payments" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"body" jsonb NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"stage" text NOT NULL,
	"user_uuid" uuid NOT NULL,
	"billing_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_basiclog" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" json NOT NULL,
	"user_uuid" uuid NOT NULL,
	"time" timestamp DEFAULT now(),
	"result" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms_resources_tmp" (
	"id" serial PRIMARY KEY NOT NULL,
	"uri" varchar(32) NOT NULL,
	"chunk" text NOT NULL,
	"i" integer NOT NULL,
	"user_uuid" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "unikUnit" UNIQUE("uri","i")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_client" ADD CONSTRAINT "cms_client_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_interactions" ADD CONSTRAINT "cms_interactions_post_id_cms_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "cms_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_reactionshistory" ADD CONSTRAINT "cms_reactionshistory_post_id_cms_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "cms_posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_reactionshistory" ADD CONSTRAINT "cms_reactionshistory_member_id_cms_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "cms_members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_members" ADD CONSTRAINT "cms_members_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_posts" ADD CONSTRAINT "cms_posts_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_posts" ADD CONSTRAINT "cms_posts_billing_id_cms_payments_id_fk" FOREIGN KEY ("billing_id") REFERENCES "cms_payments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_basiclog" ADD CONSTRAINT "cms_basiclog_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cms_resources_tmp" ADD CONSTRAINT "cms_resources_tmp_user_uuid_users_id_fk" FOREIGN KEY ("user_uuid") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
