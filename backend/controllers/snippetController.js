const Snippet = require('../models/Snippet');
const Syntax = require('../models/Syntax');
const { analyzeCode } = require('../utils/codeAnalyzer');

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
    const { codeStructure, syntaxTokens } = analyzeCode(code);

    const snippet = await Snippet.create({
      title,
      code,
      language,
      tags,
      interviewAnswer,
      syntax: syntaxId,
      user: req.user.id,
      codeStructure,
      syntaxTokens,
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
    
    if (req.body.code) {
      const { codeStructure, syntaxTokens } = analyzeCode(req.body.code);
      updateData.codeStructure = codeStructure;
      updateData.syntaxTokens = syntaxTokens;
    }

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

// @desc    Get similar snippets based on structure
// @route   GET /api/snippets/:id/similar
// @access  Private
const getSimilarSnippets = async (req, res) => {
  try {
    const currentSnippet = await Snippet.findById(req.params.id);
    if (!currentSnippet) {
      res.status(404);
      throw new Error('Snippet not found');
    }

    // Find other snippets in the same language
    const otherSnippets = await Snippet.find({
      _id: { $ne: currentSnippet._id },
      language: currentSnippet.language
    });

    const scores = otherSnippets.map(snippet => {
      let score = 0;
      const matchedTokens = [];
      
      // Fallback for existing snippets created before structural analysis
      const snipStructure = snippet.codeStructure || analyzeCode(snippet.code)?.codeStructure;
      const currStructure = currentSnippet.codeStructure || analyzeCode(currentSnippet.code)?.codeStructure;

      if (currStructure && snipStructure) {
        // 1. Match Hooks (+2 for matching hook)
        currStructure.hooks.forEach(hook => {
          if (snipStructure.hooks && snipStructure.hooks.includes(hook)) {
            score += 2;
            matchedTokens.push(hook);
          }
        });

        // 2. Match Async Patterns (+2 for matching async pattern)
        currStructure.asyncPatterns.forEach(pattern => {
          if (snipStructure.asyncPatterns && snipStructure.asyncPatterns.includes(pattern)) {
            score += 2;
            matchedTokens.push(pattern === 'async' || pattern === 'await' ? 'async/await' : pattern);
          }
        });

        // 3. Match Loops (+1 for matching loop)
        currStructure.loops.forEach(loop => {
          if (snipStructure.loops && snipStructure.loops.includes(loop)) {
            score += 1;
            matchedTokens.push(`${loop} loop`);
          }
        });

        // 4. Match Conditionals (+1 for matching conditional)
        currStructure.conditionals.forEach(cond => {
          if (snipStructure.conditionals && snipStructure.conditionals.includes(cond)) {
            score += 1;
            matchedTokens.push(cond);
          }
        });
        
        // 5. Match function count (+2)
        if (currStructure.functions && snipStructure.functions &&
            currStructure.functions.length > 0 && 
            currStructure.functions.length === snipStructure.functions.length) {
          score += 2;
          matchedTokens.push('function count');
        }
      }

      return {
        snippet,
        score,
        matchedTokens: [...new Set(matchedTokens)]
      };
    });

    // Sort by score and take top 5
    const similarSnippets = scores
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => {
        const snippetObj = s.snippet.toObject();
        return {
          ...snippetObj,
          id: snippetObj._id,
          relevanceScore: s.score,
          matchedTokens: s.matchedTokens
        };
      });

    res.status(200).json(similarSnippets);
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
  getSimilarSnippets,
};
