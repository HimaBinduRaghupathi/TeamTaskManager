const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);

module.exports = router;
