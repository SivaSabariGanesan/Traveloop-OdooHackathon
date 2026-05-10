import { Router } from 'express';
import { noteController } from '../controllers/note.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createNoteSchema, updateNoteSchema } from '../validators/note.validator';

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * @swagger
 * /api/trips/{tripId}/notes:
 *   get:
 *     summary: Get all notes for a trip
 *     description: Retrieve all journal notes for a specific trip, sorted by creation date (newest first)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       bookmarked:
 *                         type: boolean
 *                       tripId:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', noteController.getAll);

/**
 * @swagger
 * /api/trips/{tripId}/notes:
 *   post:
 *     summary: Create a new note
 *     description: Create a journal note for a trip
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: Day 1 - Arrival in Paris
 *               body:
 *                 type: string
 *                 example: Arrived at the hotel. The weather is perfect and the city is beautiful!
 *               bookmarked:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createNoteSchema), noteController.create);

/**
 * @swagger
 * /api/trips/{tripId}/notes/{noteId}:
 *   patch:
 *     summary: Update a note
 *     description: Update an existing note (only owner can update)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               body:
 *                 type: string
 *               bookmarked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         description: Note not found
 */
router.patch('/:noteId', validate(updateNoteSchema), noteController.update);

/**
 * @swagger
 * /api/trips/{tripId}/notes/{noteId}:
 *   delete:
 *     summary: Delete a note
 *     description: Delete a note (only owner can delete)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         description: Note not found
 */
router.delete('/:noteId', noteController.delete);

/**
 * @swagger
 * /api/trips/{tripId}/notes/{noteId}/bookmark:
 *   patch:
 *     summary: Toggle note bookmark
 *     description: Toggle the bookmarked status of a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Bookmark toggled successfully
 *       403:
 *         description: Forbidden - not the owner
 *       404:
 *         description: Note not found
 */
router.patch('/:noteId/bookmark', noteController.toggleBookmark);

export default router;
