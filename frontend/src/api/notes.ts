import api from './axios';

export interface Note {
  id: string;
  title: string;
  body: string;
  bookmarked: boolean;
  tripId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  body: string;
  bookmarked?: boolean;
}

export interface UpdateNotePayload {
  title?: string;
  body?: string;
  bookmarked?: boolean;
}

export const notesApi = {
  /** GET /api/trips/:tripId/notes */
  getAll: (tripId: string) =>
    api.get<{ status: string; data: Note[] }>(`/trips/${tripId}/notes`),

  /** POST /api/trips/:tripId/notes */
  create: (tripId: string, payload: CreateNotePayload) =>
    api.post<{ status: string; data: Note }>(`/trips/${tripId}/notes`, payload),

  /** PATCH /api/trips/:tripId/notes/:noteId */
  update: (tripId: string, noteId: string, payload: UpdateNotePayload) =>
    api.patch<{ status: string; data: Note }>(`/trips/${tripId}/notes/${noteId}`, payload),

  /** DELETE /api/trips/:tripId/notes/:noteId */
  delete: (tripId: string, noteId: string) =>
    api.delete(`/trips/${tripId}/notes/${noteId}`),

  /** PATCH /api/trips/:tripId/notes/:noteId/bookmark */
  toggleBookmark: (tripId: string, noteId: string) =>
    api.patch<{ status: string; data: Note }>(`/trips/${tripId}/notes/${noteId}/bookmark`),
};
