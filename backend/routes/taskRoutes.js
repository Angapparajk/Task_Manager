const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { authenticateToken } = require('../middleware/auth');
const { validateTaskInput } = require('../middleware/validation');

// Apply authentication to all task routes
router.use(authenticateToken);

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter query
    let filter = { user: req.user._id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter)
      .sort(sortObj)
      .populate('user', 'name email');
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
});

// POST /api/tasks - Add a new task
router.post('/', validateTaskInput, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    const newTask = new Task({
      title,
      description: description || '',
      dueDate,
      priority,
      status: status || 'Pending',
      user: req.user._id
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error creating task', 
      error: error.message 
    });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateTaskInput, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;

    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found or unauthorized' 
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description: description || '', dueDate, priority, status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error updating task', 
      error: error.message 
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found or unauthorized' 
      });
    }

    await Task.findByIdAndDelete(id);

    res.json({ 
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Error deleting task', 
      error: error.message 
    });
  }
});

module.exports = router;