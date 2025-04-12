const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Show register
router.get('/register', (req, res) => res.render('auth/register'));

// Handle register
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    req.session.userId = user._id;
    req.flash('success', 'Welcome!');
    res.redirect('/projects');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
});

// Show login
router.get('/login', (req, res) => res.render('auth/login'));

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.validatePassword(password)) {
    req.session.userId = user._id;
    req.flash('success', 'Welcome back!');
    return res.redirect('/projects');
  }
  req.flash('error', 'Invalid credentials');
  res.redirect('/login');
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
