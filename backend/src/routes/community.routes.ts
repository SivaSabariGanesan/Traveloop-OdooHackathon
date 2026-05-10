import { Router } from 'express';
import { communityController } from '../controllers/community.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createPostSchema } from '../validators/community.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/community:
 *   get:
 *     summary: Get community posts
 *     description: Retrieve paginated list of community posts with user information
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
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
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           body:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *                             nullable: true
 *                           likes:
 *                             type: integer
 *                           userId:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', communityController.getAll);

/**
 * @swagger
 * /api/community:
 *   post:
 *     summary: Create a post
 *     description: Create a new community post to share travel experiences
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 maxLength: 2000
 *                 example: Just returned from an amazing trip to Bali! The beaches were incredible 🏖️
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validate(createPostSchema), communityController.create);

/**
 * @swagger
 * /api/community/{postId}/like:
 *   post:
 *     summary: Like a post
 *     description: Increment the like counter for a post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:postId/like', communityController.like);

/**
 * @swagger
 * /api/community/{postId}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete your own post (only author can delete)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Forbidden - not the author
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:postId', communityController.delete);

export default router;
