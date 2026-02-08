const express = require('express');
const router = express.Router();
const {
  getUpdatedSnippets,
  createUpdatedSnippet,
} = require('../controllers/updatedSnippetController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: UpdatedSnippets
 *   description: Manage updated versions of snippets
 */

/**
 * @swagger
 * /api/updated-snippets:
 *   get:
 *     summary: Get all updated snippets for the logged-in user
 *     tags: [UpdatedSnippets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of updated snippets
 *   post:
 *     summary: Create a new updated snippet record
 *     tags: [UpdatedSnippets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalSnippetId
 *             properties:
 *               originalSnippetId:
 *                 type: string
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
 *               interviewAnswer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Updated snippet created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.route('/').get(protect, getUpdatedSnippets).post(protect, createUpdatedSnippet);

module.exports = router;
