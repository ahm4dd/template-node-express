import { Request, Response } from "express";
import { NotesService } from "../../app/services/notes.service.js";
import { createNoteSchema } from "../../app/dto/notes.js";
import { ValidationError, NotFoundError } from "../../shared/errors.js";

/**
 * Notes HTTP controller.
 *
 * This class is constructed with its dependencies, so tests can
 * provide fakes and the composition root decides the wiring.
 */
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  create = async (req: Request, res: Response) => {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(JSON.stringify(parsed.error.issues));
    }
    const note = await this.notesService.createNote(parsed.data);
    return res.status(201).json(note);
  };

  getOne = async (req: Request, res: Response) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
      throw new ValidationError("Missing note id");
    }
    const note = await this.notesService.getNote(id);
    if (!note) {
      throw new NotFoundError("Note not found");
    }
    return res.json(note);
  };
}
