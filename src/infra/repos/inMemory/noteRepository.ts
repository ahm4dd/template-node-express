import { randomUUID } from "crypto";
import { NoteRepository } from "../../../domain/repositories/noteRepository.ts";
import { Note } from "../../../domain/entities/note.ts";

/**
 * In-memory implementation of the NoteRepository. Useful for tests
 * and as a default until a real database is configured.
 */
export class InMemoryNoteRepository implements NoteRepository {
  private notes = new Map<string, Note>();

  async create(data: { title: string; body?: string }): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      id,
      title: data.title,
      body: data.body,
      createdAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }

  async findById(id: string): Promise<Note | null> {
    return this.notes.get(id) ?? null;
  }
}
