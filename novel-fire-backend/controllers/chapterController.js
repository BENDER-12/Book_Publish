const asyncHandler = require('express-async-handler');
const Chapter = require('../models/Chapter');
const Book = require('../models/Book');
const User = require('../models/User');
const LibraryEntry = require('../models/LibraryEntry');
const { createNotification } = require('./notificationController');

// @desc    Get chapters for a book
// @route   GET /api/chapters/book/:bookId
// @access  Public
const getChaptersByBook = asyncHandler(async (req, res) => {
  const chapters = await Chapter.find({ book: req.params.bookId });
  res.json(chapters);
});

// @desc    Create a chapter
// @route   POST /api/chapters
// @access  Private (only book owner)
const createChapter = asyncHandler(async (req, res) => {
  const { title, content, book } = req.body;
  const parent = await Book.findById(book);
  if (!parent) {
    res.status(404);
    throw new Error('Book not found');
  }
  if (parent.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to add chapter to this book');
  }
  try {
    const me = await User.findById(req.user._id).select('followers name');
    const followerIds = (me?.followers || []).map((id) => String(id));
    const entries = await LibraryEntry.find({ book: parent._id }).select('user');
    const readerIds = entries.map((e) => String(e.user));
    // Active readers of this author (recent lastReadAt on any of their books)
    const authorBooks = await Book.find({ user: req.user._id }).select('_id');
    const bookIds = authorBooks.map((b) => b._id);
    let activeReaderIds = [];
    if (bookIds.length) {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentEntries = await LibraryEntry.find({ book: { $in: bookIds }, lastReadAt: { $gte: since } }).select('user');
      activeReaderIds = recentEntries.map((e) => String(e.user));
    }
    const targets = Array.from(new Set([...followerIds, ...readerIds, ...activeReaderIds])).filter(
      (id) => id !== String(req.user._id)
    );
    await Promise.all(
      targets.map((uid) =>
        createNotification({
          type: 'NEW_CHAPTER',
          user: uid,
          book: parent._id,
          chapter: title,
          author: me.name,
        })
      )
    );
  } catch (error) {
    console.error(error);
  }
  const chapter = new Chapter({ title, content, book, user: req.user._id });
  const created = await chapter.save();
  parent.chaptersCount = (parent.chaptersCount || 0) + 1;
  await parent.save();
  res.status(201).json(created);
});

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private (owner)
const updateChapter = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    res.status(404);
    throw new Error('Chapter not found');
  }
  const book = await Book.findById(chapter.book);
  if (book.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  const { title, content } = req.body;
  if (title) chapter.title = title;
  if (content) chapter.content = content;
  const updated = await chapter.save();
  res.json(updated);
});

// @desc    Delete chapter
// @route   DELETE /api/chapters/:id
// @access  Private (owner)
const deleteChapter = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    res.status(404);
    throw new Error('Chapter not found');
  }
  const book = await Book.findById(chapter.book);
  if (book.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await chapter.remove();
  book.chaptersCount = Math.max(0, (book.chaptersCount || 1) - 1);
  await book.save();
  res.json({ message: 'Chapter removed' });
});

module.exports = { getChaptersByBook, createChapter, updateChapter, deleteChapter };
