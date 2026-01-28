/**
 * Domain representation of a note.
 *
 * Entities should encapsulate business invariants. For this simple
 * example there are no behaviors on the entity.
 */
export interface Note {
  id: string;
  title: string;
  body?: string;
  createdAt: Date;
}