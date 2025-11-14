import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const mixRequests = pgTable("mix_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterName: text("requester_name").notNull(),
  itemType: text("item_type").notNull(),
  itemName: text("item_name").notNull(),
  adjustment: integer("adjustment").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertMixRequestSchema = createInsertSchema(mixRequests).omit({
  id: true,
  timestamp: true,
}).extend({
  adjustment: z.number().int().min(-12).max(12).refine((val) => val !== 0, {
    message: "Adjustment cannot be zero",
  }),
});

export type InsertMixRequest = z.infer<typeof insertMixRequestSchema>;
export type MixRequest = typeof mixRequests.$inferSelect;
