const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const user = await User.findOne({ username: username.toUpperCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check account lock
    if (user.isLocked()) {
      const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        user.failedLoginAttempts = 0;
        await user.save();
        return res.status(423).json({
          success: false,
          message: 'Too many failed attempts. Account locked for 15 minutes.',
        });
      }

      await user.save();
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. ${5 - user.failedLoginAttempts} attempt(s) remaining.`,
      });
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    // Fetch profile based on role
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id })
        .select('-__v')
        .populate('mentor', 'name email mobile designation');
    } else if (user.role === 'faculty') {
      profile = await Faculty.findOne({ user: user._id })
        .select('-__v');
    } else if (user.role === 'admin') {
      profile = { name: 'System Administrator' };
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
        email: user.email,
        mobile: user.mobile,
      },
      profile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Change password (required on first login)
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(400).json({
        success: false,
        message: 'Password change is disabled. Your Date of Birth is your password.',
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 8 characters with uppercase, lowercase, number and special character.',
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let profile = null;
    if (req.user.role === 'student') {
      profile = await Student.findOne({ user: req.user._id })
        .select('-__v')
        .populate('mentor', 'name email mobile designation department');
    } else if (req.user.role === 'faculty') {
      profile = await Faculty.findOne({ user: req.user._id })
        .select('-__v');
    } else if (req.user.role === 'admin') {
      profile = { name: 'System Administrator' };
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role,
        isFirstLogin: req.user.isFirstLogin,
        email: req.user.email,
        mobile: req.user.mobile,
        lastLogin: req.user.lastLogin,
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login, changePassword, getMe };
