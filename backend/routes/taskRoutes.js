const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Task = require('../models/Task');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { name, description, startDate, endDate, totalTask } = req.body;
    try {
        const newTask = new Task({ name, description, startDate, endDate, totalTask, userId: req.user.id });
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ startDate: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    
    const { status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        task.status = status;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this task' });
        }

        await Task.deleteOne({ _id: req.params.id });

        res.json({ message: 'Task deleted successfully' });

    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
