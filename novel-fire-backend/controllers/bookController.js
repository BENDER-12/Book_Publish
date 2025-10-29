const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const { search, genre } = req.query;
  const filter = {};
  if (search && String(search).trim()) {
    const s = String(search).trim();
    filter.$or = [
      { title: { $regex: s, $options: 'i' } },
      { author: { $regex: s, $options: 'i' } },
    ];
  }
  if (genre && String(genre).trim()) {
    filter.genres = String(genre).trim();
  }
  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json(books);
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('chapters');
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book);
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const { title, author, description, genres, tags } = req.body;
  
  // Parse genres if it's a JSON string (from FormData)
  let parsedGenres = genres;
  if (typeof genres === 'string') {
    try {
      parsedGenres = JSON.parse(genres);
    } catch (error) {
      parsedGenres = [genres]; // fallback to single genre array
    }
  }
  // Parse tags if provided
  let parsedTags = tags;
  if (typeof tags === 'string') {
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      parsedTags = [tags];
    }
  }
  
  const book = new Book({ title, author, description, genres: parsedGenres, tags: parsedTags, user: req.user._id });
  if (req.file) book.coverImage = req.file.filename;
  const created = await book.save();
  try {
    const me = await User.findById(req.user._id).select('followers name');
    const followerIds = (me?.followers || []).map((id) => String(id));
    // Active readers of this author in last 30 days
    const authorBooks = await Book.find({ user: req.user._id }).select('_id');
    const bookIds = authorBooks.map((b) => b._id);
    let activeReaderIds = [];
    if (bookIds.length) {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const entries = await LibraryEntry.find({ book: { $in: bookIds }, lastReadAt: { $gte: since } }).select('user');
      activeReaderIds = entries.map((e) => String(e.user));
    }
    const notifyIds = Array.from(new Set([...followerIds, ...activeReaderIds])).filter((id) => id !== String(req.user._id));
    if (notifyIds.length) {
      await Promise.all(
        notifyIds.map((uid) =>
          createNotification({
            userId: uid,
            type: 'author_new_book',
            title: 'New book published',
            body: `${me?.name || 'An author you follow'} published ${book.title}`,
            data: { bookId: created._id },
          })
        )
      );
    }
  } catch {}
  res.status(201).json(created);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private (owner)
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  if (book.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  const { title, author, description, genres, tags } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (description) book.description = description;
  if (genres) {
    // Parse genres if it's a JSON string (from FormData)
    let parsedGenres = genres;
    if (typeof genres === 'string') {
      try {
        parsedGenres = JSON.parse(genres);
      } catch (error) {
        parsedGenres = [genres]; // fallback to single genre array
      }
    }
    book.genres = parsedGenres;
  }
  if (tags) {
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
        parsedTags = [tags];
      }
    }
    book.tags = parsedTags;
  }
  if (req.file) book.coverImage = req.file.filename;
  const updated = await book.save();
  try {
    const entries = await LibraryEntry.find({ book: book._id }).select('user');
    const userIds = entries.map((e) => String(e.user));
    // Also notify active readers of this author (who read any of their books recently)
    const authorBooks = await Book.find({ user: book.user }).select('_id');
    const bookIds = authorBooks.map((b) => b._id);
    let activeReaderIds = [];
    if (bookIds.length) {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentEntries = await LibraryEntry.find({ book: { $in: bookIds }, lastReadAt: { $gte: since } }).select('user');
      activeReaderIds = recentEntries.map((e) => String(e.user));
    }
    const notifyIds = Array.from(new Set([...userIds, ...activeReaderIds])).filter((id) => id !== String(book.user));
    if (notifyIds.length) {
      await Promise.all(
        notifyIds.map((uid) =>
          createNotification({
            userId: uid,
            type: 'book_updated',
            title: 'Book updated',
            body: `${book.title} has new updates`,
            data: { bookId: book._id },
          })
        )
      );
    }
  } catch {}
  res.json(updated);
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (owner)
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  if (book.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book removed' });
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
