const prisma = require('../config/db');

exports.getProjects = async (req, res) => {
  const { workspaceId } = req.query;
  try {
    const projects = await prisma.project.findMany({
      where: { 
        workspaceId: workspaceId ? parseInt(workspaceId) : undefined,
        workspace: { ownerId: req.user.userId }
      },
      include: { tasks: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { tasks: true }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  const { name, workspaceId } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        workspaceId: parseInt(workspaceId)
      }
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
