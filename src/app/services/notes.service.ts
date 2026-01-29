import { NoteRepository } from "../../domain/repositories/noteRepository.js";
import { Note } from "../../domain/entities/note.js";
import { EventPublisher } from "../../domain/events/eventPublisher.js";
import { ValidationError } from "../../shared/errors.js";
import { NOTE_BODY_MAX, NOTE_TITLE_MAX } from "../dto/notes.js";

/**
 * Application service for notes. Coordinates domain logic and
 * persistence via the repository abstraction.
 */
export class NotesService {
  constructor(
    private readonly repo: NoteRepository,
    private readonly publisher: EventPublisher,
  ) {}

  /**
   * Creates a new note.
   */
  async createNote(data: { title: string; body?: string }): Promise<Note> {
    // Normalize and validate input.
    const title = data.title.trim();
    if (!title) {
      throw new ValidationError("Title is required");
    }
    if (title.length > NOTE_TITLE_MAX) {
      throw new ValidationError(`Title must be <= ${NOTE_TITLE_MAX} characters`);
    }
    const body = data.body?.trim();
    if (body && body.length > NOTE_BODY_MAX) {
      throw new ValidationError(`Body must be <= ${NOTE_BODY_MAX} characters`);
    }
    const normalizedBody = body && body.length > 0 ? body : undefined;

    // Persist the note.
    const note = await this.repo.create({ title, body: normalizedBody });

    // Publish a domain event for downstream consumers.
    await this.publisher.publish({
      type: "notes.created",
      payload: { id: note.id },
    });

    return note;
  }

  /**
   * Retrieves a note by id.
   */
  async getNote(id: string): Promise<Note | null> {
    return this.repo.findById(id);
  }
}
