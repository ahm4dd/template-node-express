import { describe, it, expect } from "vitest";
import { NotesService } from "../../src/app/services/notes.service";

describe("NotesService", () => {
  it("creates and retrieves a note", async () => {
    const service = new NotesService();
    const created = await service.createNote({ title: "hello", body: "world" });
    const fetched = await service.getNote(created.id);
    expect(fetched).toEqual(created);
  });
});
