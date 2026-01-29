import { Router, type RequestHandler } from "express";
import { NotesController } from "../controllers/notes.controller.js";

type NotesRouteDependencies = {
  notesController: NotesController;
  requireSession: RequestHandler;
};

export function createNotesRoutes({
  notesController,
  requireSession,
}: NotesRouteDependencies) {
  const router = Router();

  router.post("/notes", notesController.create.bind(notesController));
  router.post(
    "/notes/private",
    requireSession,
    notesController.createPrivate.bind(notesController),
  );
  router.get("/notes/:id", notesController.getOne.bind(notesController));

  return router;
}
