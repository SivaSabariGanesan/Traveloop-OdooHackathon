import { noteRepo } from '../repositories/note.repo';
import { AppError } from '../utils/AppError';

export const noteService = {
  getAll: (tripId: string) => noteRepo.findAllByTrip(tripId),

  create: (userId: string, tripId: string, data: any) =>
    noteRepo.create({ ...data, userId, tripId }),

  update: async (userId: string, noteId: string, data: any) => {
    const note = await noteRepo.findById(noteId);
    if (!note) throw new AppError('Note not found', 404);
    if (note.userId !== userId) throw new AppError('Forbidden', 403);
    return noteRepo.update(noteId, data);
  },

  delete: async (userId: string, noteId: string) => {
    const note = await noteRepo.findById(noteId);
    if (!note) throw new AppError('Note not found', 404);
    if (note.userId !== userId) throw new AppError('Forbidden', 403);
    return noteRepo.delete(noteId);
  },

  toggleBookmark: async (userId: string, noteId: string) => {
    const note = await noteRepo.findById(noteId);
    if (!note) throw new AppError('Note not found', 404);
    if (note.userId !== userId) throw new AppError('Forbidden', 403);
    return noteRepo.update(noteId, { bookmarked: !note.bookmarked });
  },
};
