import { Router } from 'express';
import { checklistController } from '../controllers/checklist.controller';
import { authenticate } from '../middlewares/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * @swagger
 * /api/trips/{tripId}/checklist:
 *   get:
 *     summary: Get or create checklist
 *     description: Get the checklist for a trip (creates one if it doesn't exist)
 *     tags: [Checklist]
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
 *         description: Checklist retrieved/created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     tripId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           label:
 *                             type: string
 *                           checked:
 *                             type: boolean
 *                           category:
 *                             type: string
 *                           checklistId:
 *                             type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', checklistController.get);

/**
 * @swagger
 * /api/trips/{tripId}/checklist/items:
 *   post:
 *     summary: Add checklist item
 *     description: Add a new item to the checklist
 *     tags: [Checklist]
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
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 example: Passport
 *               category:
 *                 type: string
 *                 default: General
 *                 example: Documents
 *     responses:
 *       201:
 *         description: Item added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/items', checklistController.addItem);

/**
 * @swagger
 * /api/trips/{tripId}/checklist/items/{itemId}:
 *   patch:
 *     summary: Toggle item checked status
 *     description: Toggle the checked status of a checklist item
 *     tags: [Checklist]
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
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checked
 *             properties:
 *               checked:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.patch('/items/:itemId', checklistController.toggleItem);

/**
 * @swagger
 * /api/trips/{tripId}/checklist/items/{itemId}:
 *   put:
 *     summary: Update checklist item
 *     description: Update the label and/or category of a checklist item
 *     tags: [Checklist]
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
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: Passport (Updated)
 *               category:
 *                 type: string
 *                 example: Important Documents
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.put('/items/:itemId', checklistController.updateItem);

/**
 * @swagger
 * /api/trips/{tripId}/checklist/items/{itemId}:
 *   delete:
 *     summary: Delete checklist item
 *     description: Remove an item from the checklist
 *     tags: [Checklist]
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
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Item not found
 */
router.delete('/items/:itemId', checklistController.deleteItem);

/**
 * @swagger
 * /api/trips/{tripId}/checklist/reset:
 *   post:
 *     summary: Reset checklist
 *     description: Uncheck all items in the checklist
 *     tags: [Checklist]
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
 *         description: Checklist reset successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Checklist not found
 */
router.post('/reset', checklistController.resetAll);

export default router;
