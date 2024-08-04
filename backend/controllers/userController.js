const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({ name, email, password: hashedPassword });
    if (!user) {
      res.status(500);
      throw new Error('User creation failed');
    }

    const token = generateToken(user._id);
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500);
    throw new Error(`User registration failed: ${error.message}`);
  }
});

// Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password }); // Log the incoming request

  // Find the user by email
  const user = await User.findOne({ email });
  console.log('User found:', user); // Log user data

  if (!user) {
    console.error('No user found with this email:', email);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch); // Log password match result

  if (!isMatch) {
    console.error('Password mismatch for user:', email);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Generate and send the token
  const token = generateToken(user._id);
  res.json({ _id: user._id, name: user.name, email: user.email, token });
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email
  });
});

// Generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'OT+KomBqsOS2zin9D+IHKwufeSMlsYpHg4+iIaUdWHc=';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
