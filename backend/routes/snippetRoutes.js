const express = require('express');
const router = express.Router();
const {
  getSnippets,
  createSnippet,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} = require('../controllers/snippetController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Snippets
 *   description: Manage code snippets
 */

/**
 * @swagger
 * /api/snippets:
 *   get:
 *     summary: Get all snippets for the logged-in user
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user snippets
 *   post:
 *     summary: Create a new snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - code
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               syntax:
 *                 type: string
 *                 description: The user-defined syntax type (e.g. Loop, Hook)
 *               interviewAnswer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Snippet created
 *       400:
 *         description: Invalid input
 */
router.route('/').get(protect, getSnippets).post(protect, createSnippet);

/**
 * @swagger
 * /api/snippets/{id}:
 *   get:
 *     summary: Get a snippet by ID
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The snippet ID
 *     responses:
 *       200:
 *         description: The snippet description
 *       404:
 *         description: The snippet was not found
 *   put:
 *     summary: Update a snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The snippet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               syntax:
 *                 type: string
 *               isFavorite:
 *                 type: boolean
 *               interviewAnswer:
 *                 type: string
 *     responses:
 *       200:
 *         description: The snippet was updated
 *       404:
 *         description: The snippet was not found
 *   delete:
 *     summary: Delete a snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The snippet ID
 *     responses:
 *       200:
 *         description: The snippet was deleted
 *       404:
 *         description: The snippet was not found
 */
router.route('/:id').get(protect, getSnippetById).put(protect, updateSnippet).delete(protect, deleteSnippet);

module.exports = router;