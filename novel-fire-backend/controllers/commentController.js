const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const Review = require('../models/Review');
const { createNotification } = require('./notificationController');

// GET /api/comments?targetType=book|chapter&targetId=:id
exports.list = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;
  if (!['book', 'chapter', 'review'].includes(targetType) || !targetId) {
    return res.status(400).json({ message: 'targetType and targetId are required' });
  }
  const items = await Comment.find({ targetType, targetId }).sort({ createdAt: -1 }).populate('user', 'name avatar');
  res.json(items);
});

// POST /api/comments { targetType, targetId, content, parentId? }
exports.create = asyncHandler(async (req, res) => {
  const { targetType, targetId, content, parentId } = req.body;
  if (!['book', 'chapter'].includes(targetType) || !targetId || !content) {
    return res.status(400).json({ message: 'targetType, targetId and content are required' });
  }
  const created = await Comment.create({ targetType, targetId, content, parentId: parentId || null, user: req.user._id });

  // Notify author and parent comment owner
  let authorId = null;
  if (targetType === 'book') {
    const book = await Book.findById(targetId).select('user title');
    authorId = book?.user;
    if (authorId && String(authorId) !== String(req.user._id)) {
      await createNotification({
        userId: authorId,
        type: 'new_comment',
        title: 'New comment on your book',
        body: `A reader commented on ${book?.title || 'your book'}`,
        data: { targetType, targetId, commentId: created._id },
      });
    }
  } else if (targetType === 'chapter') {
    const chapter = await Chapter.findById(targetId).select('book');
    if (chapter) {
      const book = await Book.findById(chapter.book).select('user title');
      authorId = book?.user;
      if (authorId && String(authorId) !== String(req.user._id)) {
        await createNotification({
          userId: authorId,
          type: 'new_comment',
          title: 'New comment on your chapter',
          body: `A reader commented on a chapter of ${book?.title || 'your book'}`,
          data: { targetType, targetId, commentId: created._id },
        });
      }
    }
  } else if (targetType === 'review') {
    const review = await Review.findById(targetId).select('user book');
    if (review && String(review.user) !== String(req.user._id)) {
      await createNotification({
        userId: review.user,
        type: 'review_reply',
        title: 'New reply to your review',
        body: 'Someone replied to your review.',
        data: { targetType, targetId, commentId: created._id, bookId: review.book },
      });
    }
  }

  if (parentId) {
    const parent = await Comment.findById(parentId).select('user');
    if (parent && String(parent.user) !== String(req.user._id)) {
      await createNotification({
        userId: parent.user,
        type: 'new_comment',
        title: 'New reply to your comment',
        body: 'Someone replied to your comment.',
        data: { targetType, targetId, commentId: created._id, parentId },
      });
    }
  }

  res.status(201).json(created);
});

// DELETE /api/comments/:id (owner or admin)
exports.remove = asyncHandler(async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Comment not found' });
  if (String(c.user) !== String(req.user._id) && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  await Comment.findByIdAndDelete(c._id);
  res.json({ success: true });
});
