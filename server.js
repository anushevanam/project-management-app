// server.js
const express         = require('express');
const mongoose        = require('mongoose');
const session         = require('express-session');
const flash           = require('connect-flash');
const methodOverride  = require('method-override');
const path            = require('path');
require('dotenv').config();

const app = express();

// DB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pmapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// View engine & static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Sessions & flash
app.use(session({
  secret: process.env.SESSION_SECRET || 'notagoodsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Make flash & currentUser available in all views
app.use((req, res, next) => {
  res.locals.success     = req.flash('success');
  res.locals.error       = req.flash('error');
  res.locals.currentUser = req.session.userId;
  next();
});

// Simple auth guard middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.flash('error', 'You must be logged in');
    return res.redirect('/login');
  }
  next();
}

// Public routes (register, login, logout)
app.use('/', require('./routes/auth'));

// Protected routes
app.use('/projects',        requireLogin, require('./routes/projects'));
app.use('/projects/:projectId/tasks', requireLogin, require('./routes/tasks'));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
 