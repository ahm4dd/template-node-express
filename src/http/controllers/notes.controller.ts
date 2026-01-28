import { Request, Response } from "express";
import { NotesService } from "../../app/services/notes.service.ts";
import { createNoteSchema } from "../../app/dto/notes.ts";
import { ValidationError, NotFoundError } from "../../shared/errors.ts";

// In a real app you would inject the service via DI. For this simple
// example we instantiate it here.
const notesService = new NotesService();

export const notesController = {
  async create(req: Request, res: Response) {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(JSON.stringify(parsed.error.issues));
    }
    const note = await notesService.createNote(parsed.data);
    return res.status(201).json(note);
  },

  async getOne(req: Request, res: Response) {
    const id = req.params.id;
    const note = await notesService.getNote(id);
    if (!note) {
      throw new NotFoundError("Note not found");
    }
    return res.json(note);
  },
};
