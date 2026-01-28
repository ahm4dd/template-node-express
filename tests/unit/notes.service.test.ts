import { describe, it, expect } from "vitest";
import { NotesService } from "../../src/app/services/notes.service";
import { InMemoryNoteRepository } from "../../src/infra/repos/inMemory/noteRepository";

describe("NotesService", () => {
  it("creates and retrieves a note", async () => {
    const repo = new InMemoryNoteRepository();
    const service = new NotesService(repo);
    const created = await service.createNote({ title: "hello", body: "world" });
    const fetched = await service.getNote(created.id);
    expect(fetched).toEqual(created);
  });
});
