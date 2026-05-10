import { Router } from 'express';
import { invoiceController } from '../controllers/invoice.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  upsertInvoiceSchema,
  addInvoiceItemSchema,
  updateInvoiceItemSchema,
} from '../validators/invoice.validator';

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * @swagger
 * /api/trips/{tripId}/invoice:
 *   get:
 *     summary: Get invoice
 *     description: Get the invoice for a trip with all expense items
 *     tags: [Invoice]
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
 *         description: Invoice retrieved successfully
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
 *                     totalBudget:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [PENDING, PAID]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           category:
 *                             type: string
 *                           description:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           unitCost:
 *                             type: number
 *                           amount:
 *                             type: number
 *                           invoiceId:
 *                             type: string
 *                     trip:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Invoice not found
 *       401:
 *         description: Unauthorized
 */
router.get('/', invoiceController.get);

/**
 * @swagger
 * /api/trips/{tripId}/invoice:
 *   put:
 *     summary: Set invoice budget
 *     description: Set or update the total budget for the trip
 *     tags: [Invoice]
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
 *               - totalBudget
 *             properties:
 *               totalBudget:
 *                 type: number
 *                 minimum: 0
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Budget set successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/', validate(upsertInvoiceSchema), invoiceController.setBudget);

/**
 * @swagger
 * /api/trips/{tripId}/invoice/items:
 *   post:
 *     summary: Add expense item
 *     description: Add a new expense item to the invoice (amount is auto-calculated)
 *     tags: [Invoice]
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
 *               - category
 *               - description
 *               - quantity
 *               - unitCost
 *             properties:
 *               category:
 *                 type: string
 *                 example: Accommodation
 *               description:
 *                 type: string
 *                 example: Hotel Paris - 5 nights
 *               quantity:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 5
 *               unitCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 150
 *     responses:
 *       201:
 *         description: Item added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/items', validate(addInvoiceItemSchema), invoiceController.addItem);

/**
 * @swagger
 * /api/trips/{tripId}/invoice/items/{itemId}:
 *   patch:
 *     summary: Update expense item
 *     description: Update an expense item (amount is auto-recalculated)
 *     tags: [Invoice]
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
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 0.01
 *               unitCost:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/items/:itemId',
  validate(updateInvoiceItemSchema),
  invoiceController.updateItem
);

/**
 * @swagger
 * /api/trips/{tripId}/invoice/items/{itemId}:
 *   delete:
 *     summary: Delete expense item
 *     description: Remove an expense item from the invoice
 *     tags: [Invoice]
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
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/items/:itemId', invoiceController.deleteItem);

/**
 * @swagger
 * /api/trips/{tripId}/invoice/status/paid:
 *   patch:
 *     summary: Mark invoice as paid
 *     description: Change invoice status from PENDING to PAID
 *     tags: [Invoice]
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
 *         description: Invoice marked as paid
 *       404:
 *         description: Invoice not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/status/paid', invoiceController.markPaid);

/**
 * @swagger
 * /api/trips/{tripId}/invoice/export/pdf:
 *   get:
 *     summary: Export invoice as PDF
 *     description: Download a professionally formatted PDF invoice with budget summary and itemized expenses
 *     tags: [Invoice]
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
 *         description: PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Invoice not found
 *       401:
 *         description: Unauthorized
 */
router.get('/export/pdf', invoiceController.exportPDF);

/**
 * @swagger
 * /api/trips/{tripId}/invoice/send-email:
 *   post:
 *     summary: Send invoice via email
 *     description: Send the invoice as a PDF attachment to the authenticated user's email address
 *     tags: [Invoice]
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
 *         description: Invoice sent successfully
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
 *                     message:
 *                       type: string
 *                       example: Invoice sent to your email
 *       404:
 *         description: Invoice or trip not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to send email
 */
router.post('/send-email', invoiceController.sendEmail);

export default router;
