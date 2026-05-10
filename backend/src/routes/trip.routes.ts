import { Router } from 'express';
import { tripController } from '../controllers/trip.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createTripSchema, updateTripSchema } from '../validators/trip.validator';

const router = Router();

// All trip routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips for authenticated user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips grouped by status
 *       401:
 *         description: Unauthorized
 */
router.get('/', tripController.getAll);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a single trip by ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip details
 *       404:
 *         description: Trip not found
 *       403:
 *         description: Forbidden
 */
router.get('/:id', tripController.getById);

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Vacation 2026
 *               placeId:
 *                 type: string
 *                 example: place_123
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-15
 *               description:
 *                 type: string
 *                 example: A relaxing beach vacation
 *               coverPhoto:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validate(createTripSchema), tripController.create);

/**
 * @swagger
 * /api/trips/{id}:
 *   patch:
 *     summary: Update a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               coverPhoto:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 *       403:
 *         description: Forbidden
 */
router.patch('/:id', validate(updateTripSchema), tripController.update);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', tripController.delete);

export default router;
