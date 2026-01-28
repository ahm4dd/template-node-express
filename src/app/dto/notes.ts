import { z } from "zod";

/**
 * Schema for creating a note. Title is required; body is optional.
 */
export const createNoteSchema = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;