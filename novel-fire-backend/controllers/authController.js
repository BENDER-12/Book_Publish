const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { generateOTPWithExpiry, validateOTP } = require('../utils/otpUtils');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');

// @desc    Register new user (Step 1: Send OTP)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate OTP
  const { otp, expiresAt } = generateOTPWithExpiry(10); // 10 minutes expiry

  // Create user with OTP (not verified yet)
  const assignedRole = ['reader', 'author'].includes(role) ? role : 'reader';
  const user = await User.create({ 
    name, 
    email, 
    password,
    role: assignedRole,
    otp,
    otpExpires: expiresAt,
    isEmailVerified: false
  });

  if (user) {
    // Send OTP email
    try {
      console.log('[Auth] Sending OTP to:', email);
      await sendOTPEmail(email, otp, name);
      console.log('[Auth] sendOTPEmail OK for:', email);
      res.status(201).json({
        message: 'Registration successful! Please check your email for verification code.',
        userId: user._id,
        email: user.email,
        requiresVerification: true
      });
    } catch (emailError) {
      console.error('[Auth] sendOTPEmail FAILED:', emailError?.message || emailError);
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      res.status(500);
      throw new Error('Failed to send verification email. Please try again.');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    res.status(400);
    throw new Error('User ID and OTP are required');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Validate OTP
  const isValidOTP = validateOTP(otp, user.otp, user.otpExpires);
  if (!isValidOTP) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  // Update user as verified and clear OTP
  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Send welcome email (don't wait for it)
  sendWelcomeEmail(user.email, user.name).catch(console.error);

  // Generate token and return user data
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'reader',
    token: generateToken(user._id),
    message: 'Email verified successfully!'
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new OTP
  const { otp, expiresAt } = generateOTPWithExpiry(10);

  // Update user with new OTP
  user.otp = otp;
  user.otpExpires = expiresAt;
  await user.save();

  // Send new OTP email
  try {
    await sendOTPEmail(user.email, otp, user.name);
    res.status(200).json({
      message: 'New verification code sent to your email'
    });
  } catch (emailError) {
    res.status(500);
    throw new Error('Failed to send verification email. Please try again.');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Check if email is verified
    if (!user.isEmailVerified) {
      res.status(401);
      throw new Error('Please verify your email before logging in. Check your inbox for verification code.');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'reader',
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { register, verifyOTP, resendOTP, login };
