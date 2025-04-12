const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();

// DB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pmapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'notagoodsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Flash & currentUser in locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error   = req.flash('error');
  res.locals.currentUser = req.session.userId;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));
app.use('/projects/:projectId/tasks', require('./routes/tasks'));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
