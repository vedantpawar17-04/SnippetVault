/**
 * Code Analyzer Utility
 * Extracts structural elements from code using regex for similarity matching.
 */

const analyzeCode = (code) => {
  if (!code) return null;

  // 1. Normalize Code (for extraction/comparison)
  // Remove comments (single line and multi-line)
  const noComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
  
  // Standardize whitespace and convert to lowercase for uniform comparison
  const normalized = noComments.toLowerCase().replace(/\s+/g, ' ');

  // 2. Extract Structured Elements
  const structure = {
    functions: [],
    hooks: [],
    asyncPatterns: [],
    loops: [],
    conditionals: [],
    imports: [],
    returns: []
  };

  // Extract React Hooks (useEffect, useState, etc.)
  const hookRegex = /use[a-z]\w*/g;
  const hooksFound = normalized.match(hookRegex) || [];
  structure.hooks = [...new Set(hooksFound)];

  // Extract Async patterns
  const asyncKeywords = ['async', 'await', 'try', 'catch'];
  structure.asyncPatterns = asyncKeywords.filter(k => normalized.includes(k));

  // Extract Loops
  const loopKeywords = ['for', 'while'];
  structure.loops = loopKeywords.filter(k => normalized.includes(k));
  if (normalized.includes('.map(')) structure.loops.push('map');

  // Extract Conditionals
  const conditionalKeywords = ['if', 'switch', 'else'];
  structure.conditionals = conditionalKeywords.filter(k => normalized.includes(k));

  // Extract Imports
  const importLines = noComments.match(/import\s+.*?from\s+['"].*?['"]/g) || [];
  structure.imports = importLines;

  // Extract Function names
  // Basic function declarations: function name()
  const funcDeclRegex = /function\s+([a-zA-Z0-9_$]+)/g;
  let match;
  while ((match = funcDeclRegex.exec(noComments)) !== null) {
    structure.functions.push(match[1]);
  }
  // Arrow functions: const name = () =>
  const arrowFuncRegex = /(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\(.*\)|[a-zA-Z0-9_$]+)\s*=>/g;
  while ((match = arrowFuncRegex.exec(noComments)) !== null) {
    structure.functions.push(match[1]);
  }
  
  structure.functions = [...new Set(structure.functions)];

  // Return statements
  if (normalized.includes('return')) {
    structure.returns = ['return'];
  }

  // 3. Generate Syntax Tokens
  // Simple tokenization of lowercase normalized code, removing common noise
  const tokens = normalized
    .split(/[^a-z0-9]/)
    .filter(t => t.length > 2 && !['const', 'let', 'var', 'from', 'import', 'export', 'default'].includes(t));
  
  const syntaxTokens = [...new Set(tokens)].slice(0, 50); // Limit to top 50 tokens

  return { codeStructure: structure, syntaxTokens };
};

module.exports = { analyzeCode };
