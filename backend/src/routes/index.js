const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const workspaceController = require('../controllers/workspaceController');
const timeController = require('../controllers/timeController');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');

router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authMiddleware, authController.me);

// Workspace Routes
router.post('/workspaces', authMiddleware, workspaceController.createWorkspace);
router.get('/workspaces', authMiddleware, workspaceController.getWorkspaces);
router.put('/workspaces/:id', authMiddleware, workspaceController.updateWorkspace);
router.delete('/workspaces/:id', authMiddleware, workspaceController.deleteWorkspace);
router.get('/workspaces/:id/projects', authMiddleware, workspaceController.getWorkspaceProjects);

// Time Routes
router.post('/time/start', authMiddleware, timeController.startTimer);
router.put('/time/stop/:id', authMiddleware, timeController.stopTimer);
router.get('/time/logs', authMiddleware, timeController.getTimeLogs);
router.get('/time/active', authMiddleware, timeController.getActiveTimer);

// Project Routes (Protected)
router.post('/projects', authMiddleware, projectController.createProject);
router.get('/projects', authMiddleware, projectController.getProjects);
router.get('/projects/:id', authMiddleware, projectController.getProjectById);

// Task Routes (Protected)
router.post('/tasks', authMiddleware, taskController.createTask);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

// Appointment Routes (Protected)
router.post('/appointments', authMiddleware, appointmentController.createAppointment);
router.get('/appointments', authMiddleware, appointmentController.getAppointments);
router.delete('/appointments/:id', authMiddleware, appointmentController.deleteAppointment);

module.exports = router;
