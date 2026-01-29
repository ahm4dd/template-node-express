import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Notes table definition (Drizzle schema).
export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Row types inferred from the schema.
export type NoteRow = typeof notes.$inferSelect;
export type NewNoteRow = typeof notes.$inferInsert;
