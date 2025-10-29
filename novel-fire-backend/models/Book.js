const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    author: { type: String },
    description: { type: String },
    genres: [{ type: String }],
    tags: [{ type: String }],
    coverImage: { type: String },

    chaptersCount: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for chapters
bookSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'book',
  options: { sort: { order: 1 } } // Sort by chapter order
});

module.exports = mongoose.model('Book', bookSchema);
