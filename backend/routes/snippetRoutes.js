const express = require('express');
const router = express.Router();
const {
  getSnippets,
  createSnippet,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  getSimilarSnippets,
} = require('../controllers/snippetController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSnippets).post(protect, createSnippet);
router.route('/:id').get(protect, getSnippetById).put(protect, updateSnippet).delete(protect, deleteSnippet);
router.route('/:id/similar').get(protect, getSimilarSnippets);

module.exports = router;