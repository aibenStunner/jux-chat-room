CREATE TABLE IF NOT EXISTS "messageReactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "messageReactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"messageId" text NOT NULL,
	"userName" text NOT NULL,
	"reactionType" text NOT NULL,
	"createdAt" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"roomId" text NOT NULL,
	"userName" text NOT NULL,
	"text" text NOT NULL,
	"createdAt" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messageReactions" ADD CONSTRAINT "messageReactions_messageId_messages_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messageReactions" ADD CONSTRAINT "messageReactions_userName_users_name_fk" FOREIGN KEY ("userName") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_userName_users_name_fk" FOREIGN KEY ("userName") REFERENCES "public"."users"("name") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "messageReactions_messageId_userName_reactionType_index" ON "messageReactions" USING btree ("messageId","userName","reactionType");