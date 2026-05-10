const Task = require('../models/Task');
const Project = require('../models/Project');

const taskController = {
  createTask: async (req, res) => {
    try {
      const { title, description, projectId, priority } = req.body;
      const assignedTo = req.body.assignedTo ?? req.body.assigned_to;
      const dueDate = req.body.dueDate ?? req.body.due_date;

      if (!title || !projectId) {
        return res.status(400).json({ error: 'Title and project are required.' });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      if (project.creator_id !== req.userId) {
        return res.status(403).json({ error: 'Only project owner can create tasks.' });
      }

      const task = await Task.create({
        title,
        description,
        projectId,
        assignedTo,
        status: 'To Do',
        priority: priority || 'Medium',
        dueDate: dueDate || null
      });
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not create task.' });
    }
  },

  getTasks: async (req, res) => {
    try {
      const tasks = await Task.getAllForUser(req.userId);
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not load tasks.' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const fields = {};
      const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'assigned_to'];
      allowed.forEach((key) => {
        if (req.body[key] !== undefined) {
          fields[key] = req.body[key];
        }
      });
      if (req.body.dueDate !== undefined) {
        fields.due_date = req.body.dueDate;
      }
      if (req.body.assignedTo !== undefined) {
        fields.assigned_to = req.body.assignedTo;
      }

      const existing = await Task.getById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      const project = await Project.findById(existing.project_id);
      const isOwner = project && project.creator_id === req.userId;
      const isAssignee = existing.assigned_to === req.userId;
      if (!isOwner && !isAssignee) {
        return res.status(403).json({ error: 'Not authorized to update this task.' });
      }

      const result = await Task.update(id, fields);
      if (result && result.changes === 0) {
        return res.status(400).json({ error: 'No task updates were applied.' });
      }
      const updatedTask = await Task.getById(id);
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not update task.' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await Task.getById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Task not found.' });
      }
      const project = await Project.findById(existing.project_id);
      if (!project || project.creator_id !== req.userId) {
        return res.status(403).json({ error: 'Only project owner can delete this task.' });
      }
      const result = await Task.delete(id);
      res.json({ deleted: result.deleted });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not delete task.' });
    }
  }
};

module.exports = taskController;
