import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { stopController, activityController } from '../controllers/itinerary.controller';
import {
  createStopSchema,
  updateStopSchema,
  reorderStopsSchema,
  createActivitySchema,
  updateActivitySchema,
  reorderActivitiesSchema,
} from '../validators/itinerary.validator';

const router = Router({ mergeParams: true });

// All itinerary routes require authentication
router.use(authenticate);

// ─── Stop Routes  /api/trips/:tripId/stops ────────────────────────────────────

/**
 * @swagger
 * /api/trips/{tripId}/stops:
 *   get:
 *     summary: Get all stops for a trip
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of stops ordered by position
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Trip not found
 */
router.get('/', stopController.getAll);

/**
 * @swagger
 * /api/trips/{tripId}/stops:
 *   post:
 *     summary: Add a stop to a trip
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - city
 *               - arrivalDate
 *               - departureDate
 *             properties:
 *               city:
 *                 type: string
 *                 example: Paris
 *               country:
 *                 type: string
 *                 example: France
 *               placeId:
 *                 type: string
 *               arrivalDate:
 *                 type: string
 *                 format: date-time
 *               departureDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Stop created
 *       400:
 *         description: Validation error
 */
router.post('/', validate(createStopSchema), stopController.create);

/**
 * @swagger
 * /api/trips/{tripId}/stops/reorder:
 *   patch:
 *     summary: Reorder stops within a trip
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Stops reordered, returns updated list
 */
router.patch('/reorder', validate(reorderStopsSchema), stopController.reorder);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}:
 *   get:
 *     summary: Get a single stop
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stop details with activities
 *       404:
 *         description: Stop not found
 */
router.get('/:stopId', stopController.getById);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}:
 *   patch:
 *     summary: Update a stop
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stop updated
 */
router.patch('/:stopId', validate(updateStopSchema), stopController.update);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}:
 *   delete:
 *     summary: Delete a stop (and re-normalizes remaining order)
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stop deleted
 */
router.delete('/:stopId', stopController.delete);

// ─── Activity Routes  /api/trips/:tripId/stops/:stopId/activities ─────────────

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}/activities:
 *   get:
 *     summary: Get all activities for a stop
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of activities ordered by position
 */
router.get('/:stopId/activities', activityController.getAll);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}/activities:
 *   post:
 *     summary: Add an activity to a stop
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eiffel Tower Visit
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               cost:
 *                 type: number
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Activity created
 */
router.post('/:stopId/activities', validate(createActivitySchema), activityController.create);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}/activities/reorder:
 *   patch:
 *     summary: Reorder activities within a stop
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activities reordered
 */
router.patch('/:stopId/activities/reorder', validate(reorderActivitiesSchema), activityController.reorder);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}/activities/{activityId}:
 *   get:
 *     summary: Get a single activity
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity details
 */
router.get('/:stopId/activities/:activityId', activityController.getById);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}/activities/{activityId}:
 *   patch:
 *     summary: Update an activity
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity updated
 */
router.patch('/:stopId/activities/:activityId', validate(updateActivitySchema), activityController.update);

/**
 * @swagger
 * /api/trips/{tripId}/stops/{stopId}/activities/{activityId}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [Itinerary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stopId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity deleted
 */
router.delete('/:stopId/activities/:activityId', activityController.delete);

export default router;
