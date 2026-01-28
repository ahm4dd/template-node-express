import { NoteRepository } from "../../domain/repositories/noteRepository.js";
import { Note } from "../../domain/entities/note.js";

/**
 * Application service for notes. Coordinates domain logic and
 * persistence via the repository abstraction.
 */
export class NotesService {
  constructor(private readonly repo: NoteRepository) {}

  /**
   * Creates a new note.
   */
  async createNote(data: { title: string; body?: string }): Promise<Note> {
    return this.repo.create(data);
  }

  /**
   * Retrieves a note by id.
   */
  async getNote(id: string): Promise<Note | null> {
    return this.repo.findById(id);
  }
}
