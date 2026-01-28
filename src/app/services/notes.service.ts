import { NoteRepository } from "../../domain/repositories/noteRepository.ts";
import { InMemoryNoteRepository } from "../../infra/repos/inMemory/noteRepository.ts";
import { Note } from "../../domain/entities/note.ts";

/**
 * Application service for notes. Coordinates domain logic and
 * persistence via the repository abstraction.
 */
export class NotesService {
  private readonly repo: NoteRepository;

  constructor(repo?: NoteRepository) {
    this.repo = repo ?? new InMemoryNoteRepository();
  }

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
