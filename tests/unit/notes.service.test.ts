import { describe, it, expect } from "vitest";
import { NotesService } from "../../src/app/services/notes.service.js";
import { InMemoryNoteRepository } from "../../src/infra/repos/inMemory/noteRepository.js";
import type { DomainEvent, EventPublisher } from "../../src/domain/events/eventPublisher.js";

class TestPublisher implements EventPublisher {
  public events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}

describe("NotesService", () => {
  it("creates and retrieves a note", async () => {
    const repo = new InMemoryNoteRepository();
    const publisher = new TestPublisher();
    const service = new NotesService(repo, publisher);
    const created = await service.createNote({ title: "hello", body: "world" });
    const fetched = await service.getNote(created.id);
    expect(fetched).toEqual(created);
    expect(publisher.events[0]?.type).toBe("notes.created");
  });

  it("rejects empty titles", async () => {
    const repo = new InMemoryNoteRepository();
    const publisher = new TestPublisher();
    const service = new NotesService(repo, publisher);
    await expect(service.createNote({ title: "   " })).rejects.toThrow(
      "Title is required",
    );
  });
});
