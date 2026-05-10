const Project = require('../models/Project');

const projectController = {
  createProject: async (req, res) => {
    try {
      const { name, description } = req.body;
      const creatorId = req.userId;

      if (!name?.trim()) {
        return res.status(400).json({ error: 'Project name is required' });
      }

      const project = await Project.create(name.trim(), description || '', creatorId);
      res.status(201).json({ project });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  },

  getProjects: async (req, res) => {
    try {
      const projects = await Project.getAllByUser(req.userId);
      res.json({ projects });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Failed to load projects' });
    }
  },

  getProject: async (req, res) => {
    try {
      const project = await Project.getById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ project });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Failed to load project' });
    }
  }
};

module.exports = projectController;
