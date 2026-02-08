const UpdatedSnippet = require('../models/UpdatedSnippet');
const Snippet = require('../models/Snippet');
const Syntax = require('../models/Syntax');

// @desc    Create new updated snippet
// @route   POST /api/updated-snippets
// @access  Private
const createUpdatedSnippet = async (req, res) => {
  const { originalSnippetId, title, code, language, tags, syntax, interviewAnswer } = req.body;

  if (!originalSnippetId) {
    return res.status(400).json({ message: 'Original Snippet ID is required' });
  }

  try {
    const originalSnippet = await Snippet.findById(originalSnippetId);

    if (!originalSnippet) {
      return res.status(404).json({ message: 'Original Snippet not found' });
    }

    // Ensure user owns the original snippet
    if (originalSnippet.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this snippet' });
    }

    let syntaxId = originalSnippet.syntax;

    if (syntax) {
      // Check if syntax already exists or create new
      // Assuming syntax is passed as a string name from frontend
      let syntaxDoc = await Syntax.findOne({ name: syntax.trim() });
      if (!syntaxDoc) {
        syntaxDoc = await Syntax.create({ name: syntax.trim() });
      }
      syntaxId = syntaxDoc._id;
    }

    const count = await UpdatedSnippet.countDocuments({ originalSnippetId });

    const updatedSnippet = await UpdatedSnippet.create({
      user: req.user.id,
      originalSnippetId,
      title: title || originalSnippet.title,
      code: code || originalSnippet.code,
      language: language || originalSnippet.language,
      tags: tags || originalSnippet.tags,
      syntax: syntaxId,
      interviewAnswer: interviewAnswer || originalSnippet.interviewAnswer,
      version: count + 1
    });

    res.status(201).json(updatedSnippet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get updated snippets for a logged in user
// @route   GET /api/updated-snippets
// @access  Private
const getUpdatedSnippets = async (req, res) => {
  try {
    const snippets = await UpdatedSnippet.find({ user: req.user.id })
       .populate('originalSnippetId', 'title')
       .populate('syntax', 'name');
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUpdatedSnippet,
  getUpdatedSnippets,
};
