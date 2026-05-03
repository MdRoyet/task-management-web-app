const prisma = require('../config/db');

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { ownerId: req.user.userId },
      include: { projects: true }
    });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createWorkspace = async (req, res) => {
  const { name, icon } = req.body;
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        icon,
        ownerId: req.user.userId
      }
    });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWorkspace = async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;
  try {
    const workspace = await prisma.workspace.update({
      where: { id: parseInt(id), ownerId: req.user.userId },
      data: { name, icon }
    });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWorkspace = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.workspace.delete({
      where: { id: parseInt(id), ownerId: req.user.userId }
    });
    res.json({ message: 'Workspace deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkspaceProjects = async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await prisma.project.findMany({
      where: { workspaceId: parseInt(id) },
      include: { tasks: true }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
