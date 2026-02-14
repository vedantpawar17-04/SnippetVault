const Snippet = require('../models/Snippet');
const Syntax = require('../models/Syntax');

// @desc    Get all snippets
// @route   GET /api/snippets
// @access  Private
const getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({})
      .populate('user', 'name email')
      .populate('syntax');
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single snippet
// @route   GET /api/snippets/:id
// @access  Private
const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
      .populate('user', 'name email')
      .populate('syntax');

    if (!snippet) {
      res.status(404);
      throw new Error('Snippet not found');
    }

    res.status(200).json(snippet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res) => {
  const { title, code, language, tags, interviewAnswer, syntax } = req.body;

  if (!title || !code) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  let syntaxId = null;
  if (syntax) {
    let syntaxDoc = await Syntax.findOne({ name: syntax });
    if (!syntaxDoc) {
      syntaxDoc = await Syntax.create({ name: syntax });
    }
    syntaxId = syntaxDoc._id;
  }

  try {
    const snippet = await Snippet.create({
      title,
      code,
      language,
      tags,
      interviewAnswer,
      syntax: syntaxId,
      user: req.user.id,
    });
    
    // Populate user and syntax for the returned snippet
    const populatedSnippet = await Snippet.findById(snippet._id)
      .populate('user', 'name email')
      .populate('syntax');
    res.status(201).json(populatedSnippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      res.status(404);
      throw new Error('Snippet not found');
    }

    const isOwner = snippet.user.toString() === req.user.id;
    const isOnlyFavoriting = Object.keys(req.body).length === 1 && req.body.hasOwnProperty('isFavorite');

    if (!isOwner && !isOnlyFavoriting) {
      res.status(401);
      throw new Error('User not authorized');
    }

    let updateData = req.body;
    
    if (req.body.syntax) {
       let syntaxDoc = await Syntax.findOne({ name: req.body.syntax });
       if (!syntaxDoc) {
         syntaxDoc = await Syntax.create({ name: req.body.syntax });
       }
       updateData = { ...req.body, syntax: syntaxDoc._id };
    }

    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    )
    .populate('user', 'name email')
    .populate('syntax');
    res.status(200).json(updatedSnippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      res.status(404);
      throw new Error('Snippet not found');
    }

    if (snippet.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await snippet.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  getSnippetById,
};
