// routes/projects.js
const express = require('express');
const router  = express.Router();
const Project = require('../models/Project');

// INDEX – list all projects for this user
router.get('/', async (req, res) => {
  const projects = await Project.find({ owner: req.session.userId });
  res.render('projects/index', { projects });
});

// NEW – show form
router.get('/new', (req, res) => {
  res.render('projects/new');
});

// CREATE – add project
router.post('/', async (req, res) => {
  const proj = new Project({ ...req.body, owner: req.session.userId });
  await proj.save();
  req.flash('success', 'Project created');
  res.redirect('/projects');
});

const Task = require('../models/Task');  // add at top, after Project require

// SHOW – project detail + its tasks
router.get('/:id', async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    owner: req.session.userId
  });
  if (!project) {
    req.flash('error', 'Project not found');
    return res.redirect('/projects');
  }
  const tasks = await Task.find({
    project: project._id,
    owner:   req.session.userId
  });
  res.render('projects/show', { project, tasks });
});

// EDIT – show edit form
router.get('/:id/edit', async (req, res) => {
  const proj = await Project.findOne({ _id: req.params.id, owner: req.session.userId });
  if (!proj) {
    req.flash('error', 'Project not found');
    return res.redirect('/projects');
  }
  res.render('projects/edit', { project: proj });
});

// UPDATE – apply edits
router.put('/:id', async (req, res) => {
  await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.session.userId },
    req.body
  );
  req.flash('success', 'Project updated');
  res.redirect('/projects');
});

// DELETE – remove project
router.delete('/:id', async (req, res) => {
  await Project.findOneAndDelete({ _id: req.params.id, owner: req.session.userId });
  req.flash('success', 'Project deleted');
  res.redirect('/projects');
});

module.exports = router;
