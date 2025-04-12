// routes/tasks.js
const express = require('express');
const router  = express.Router({ mergeParams: true });
const Task    = require('../models/Task');

// NEW – form to add a task to a project
router.get('/new', (req, res) => {
  res.render('tasks/new', { projectId: req.params.projectId });
});

// CREATE – add the task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    project: req.params.projectId,
    owner: req.session.userId
  });
  await task.save();
  req.flash('success', 'Task added');
  res.redirect(`/projects/${req.params.projectId}`);
});

// EDIT – form to edit a task
router.get('/:taskId/edit', async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    owner: req.session.userId
  });
  res.render('tasks/edit', { projectId: req.params.projectId, task });
});

// UPDATE – apply edits
router.put('/:taskId', async (req, res) => {
  await Task.findOneAndUpdate(
    { _id: req.params.taskId, owner: req.session.userId },
    { title: req.body.title, completed: req.body.completed === 'on' }
  );
  req.flash('success', 'Task updated');
  res.redirect(`/projects/${req.params.projectId}`);
});

// DELETE – remove task
router.delete('/:taskId', async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.taskId,
    owner: req.session.userId
  });
  req.flash('success', 'Task deleted');
  res.redirect(`/projects/${req.params.projectId}`);
});

module.exports = router;
