const mongoose = require('mongoose');

const syntaxSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a syntax name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Syntax', syntaxSchema);
