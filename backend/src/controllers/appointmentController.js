const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createAppointment = async (req, res) => {
  const { name, date, time, description, status } = req.body;
  try {
    const appointment = await prisma.appointment.create({
      data: {
        name,
        date,
        time,
        description,
        status: status || 'Confirmed',
        userId: req.user.userId
      }
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({
      where: { 
        id: parseInt(id),
        userId: req.user.userId 
      }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
