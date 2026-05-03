const prisma = require('../config/db');

exports.startTimer = async (req, res) => {
  const { taskId } = req.body;
  try {
    // Stop any currently running timers for this user first
    await prisma.timeLog.updateMany({
      where: { userId: req.user.userId, endTime: null },
      data: { endTime: new Date() }
    });

    const log = await prisma.timeLog.create({
      data: {
        taskId: parseInt(taskId),
        userId: req.user.userId,
        startTime: new Date()
      }
    });
    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error starting timer' });
  }
};

exports.stopTimer = async (req, res) => {
  const { id } = req.params;
  try {
    const log = await prisma.timeLog.findUnique({ where: { id: parseInt(id) } });
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const endTime = new Date();
    const duration = Math.floor((endTime - new Date(log.startTime)) / 1000);

    const updatedLog = await prisma.timeLog.update({
      where: { id: parseInt(id) },
      data: { endTime, duration }
    });
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error stopping timer' });
  }
};

exports.getTimeLogs = async (req, res) => {
  try {
    const logs = await prisma.timeLog.findMany({
      where: { userId: req.user.userId },
      include: { task: true },
      orderBy: { startTime: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time logs' });
  }
};

exports.getActiveTimer = async (req, res) => {
  try {
    const active = await prisma.timeLog.findFirst({
      where: { userId: req.user.userId, endTime: null },
      include: { task: true }
    });
    res.json(active);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active timer' });
  }
};
