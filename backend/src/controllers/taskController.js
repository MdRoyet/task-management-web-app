const prisma = require('../config/db');

exports.createTask = async (req, res) => {
  const { title, status, projectId } = req.body;
  try {
    const task = await prisma.task.create({
      data: { title, status, projectId: parseInt(projectId) }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
