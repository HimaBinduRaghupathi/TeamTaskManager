const User = require('../models/User');

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not retrieve profile.' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not retrieve users.' });
    }
  }
};

module.exports = userController;
