const mongoose = require('mongoose');

const updatedSnippetSchema = mongoose.Schema(
  {
    originalSnippetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Snippet',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Please add some code'],
    },
    language: {
      type: String,
      default: 'javascript',
    },
    tags: {
      type: [String],
      default: [],
    },
    syntax: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Syntax',
    },
    interviewAnswer: {
      type: String,
      maxlength: [1000, 'Answer can not be more than 1000 characters'],
    },
    version: {
      type: Number,
      default: 1, 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UpdatedSnippet', updatedSnippetSchema);
