const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Library = require('../models/Library');
const { createNotification } = require('./notificationController');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.username = req.body.username ?? user.username;
    user.bio = req.body.bio ?? user.bio;
    user.avatar = req.body.avatar ?? user.avatar;
    if (req.body.social && typeof req.body.social === 'object') {
      user.social = {
        ...user.social,
        ...req.body.social,
      };
    }
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      social: updatedUser.social,
      isAdmin: updatedUser.isAdmin,
      createdAt: updatedUser.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get followers of a user
// @route   GET /api/users/:id/followers
// @access  Public
const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('followers', '-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user.followers || []);
});

// @desc    Get following of a user
// @route   GET /api/users/:id/following
// @access  Public
const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('following', '-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user.following || []);
});

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === String(req.user._id)) {
    res.status(400);
    throw new Error('Cannot follow yourself');
  }
  const me = await User.findById(req.user._id);
  const target = await User.findById(targetId);
  if (!target) {
    res.status(404);
    throw new Error('Target user not found');
  }
  // Add if not already following
  if (!me.following.some((id) => String(id) === String(target._id))) {
    me.following.push(target._id);
  }
  if (!target.followers.some((id) => String(id) === String(me._id))) {
    target.followers.push(me._id);
  }
  await me.save();
  await target.save();
  // Notify target user
  try {
    await createNotification({
      userId: target._id,
      type: 'new_follower',
      title: 'New follower',
      body: `${me.name || 'A user'} started following you`,
      data: { followerId: me._id },
    });
  } catch {}
  res.status(200).json({ message: 'Followed', following: me.following });
});

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === String(req.user._id)) {
    res.status(400);
    throw new Error('Cannot unfollow yourself');
  }
  const me = await User.findById(req.user._id);
  const target = await User.findById(targetId);
  if (!target) {
    res.status(404);
    throw new Error('Target user not found');
  }
  me.following = me.following.filter((id) => String(id) !== String(target._id));
  target.followers = target.followers.filter((id) => String(id) !== String(me._id));
  await me.save();
  await target.save();
  res.status(200).json({ message: 'Unfollowed', following: me.following });
});

// @desc    Dashboard stats for current user
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [booksCount, reviewsCount, library, me] = await Promise.all([
    Book.countDocuments({ user: userId }),
    Review.countDocuments({ user: userId }),
    Library.findOne({ user: userId }).select('books'),
    User.findById(userId).select('followers following'),
  ]);

  res.json({
    booksCount,
    reviewsCount,
    libraryCount: library?.books?.length || 0,
    followersCount: me?.followers?.length || 0,
    followingCount: me?.following?.length || 0,
  });
});

module.exports = { getProfile, updateProfile, getFollowers, getFollowing, followUser, unfollowUser, getDashboard };
