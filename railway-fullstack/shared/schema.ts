import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const savedNumbers = pgTable("saved_numbers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  contactName: text("contact_name"),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSavedNumberSchema = createInsertSchema(savedNumbers).pick({
  phoneNumber: true,
  contactName: true,
  sessionId: true,
});

export type InsertSavedNumber = z.infer<typeof insertSavedNumberSchema>;
export type SavedNumber = typeof savedNumbers.$inferSelect;

// Message generation types
export const messageGenerationSchema = z.object({
  category: z.enum(["sweet", "romantic", "poetic"]),
  includeEmojis: z.boolean().default(true),
  includeWeather: z.boolean().default(false),
  messageLength: z.enum(["short", "medium", "long"]).default("medium"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export type MessageGenerationRequest = z.infer<typeof messageGenerationSchema>;

export interface MessageGenerationResponse {
  message: string;
  category: string;
}
