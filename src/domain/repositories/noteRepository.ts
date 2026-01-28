import { Note } from "../entities/note.js";

/**
 * Abstraction for note persistence. Application code depends on
 * this interface rather than any specific database. Implementations
 * live under infra/repo and can target Postgres, in-memory, etc.
 */
export interface NoteRepository {
  create(data: { title: string; body?: string }): Promise<Note>;
  findById(id: string): Promise<Note | null>;
}
