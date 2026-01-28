import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, type DbClient } from "../../db/index.js";
import { notes } from "../../db/schema.js";
import { NoteRepository } from "../../../domain/repositories/noteRepository.js";
import { Note } from "../../../domain/entities/note.js";

export class PostgresNoteRepository implements NoteRepository {
  constructor(private readonly dbClient: DbClient = db) {}

  async create(data: { title: string; body?: string }): Promise<Note> {
    const id = randomUUID();
    const [created] = await this.dbClient
      .insert(notes)
      .values({
        id,
        title: data.title,
        body: data.body,
      })
      .returning();
    return {
      ...created,
      body: created.body ?? undefined,
    };
  }

  async findById(id: string): Promise<Note | null> {
    const [found] = await this.dbClient
      .select()
      .from(notes)
      .where(eq(notes.id, id))
      .limit(1);
    if (!found) {
      return null;
    }
    return {
      ...found,
      body: found.body ?? undefined,
    };
  }
}
