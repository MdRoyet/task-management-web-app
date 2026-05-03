const prisma = require('../config/db');

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
    res.status(201).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating workspace' });
  }
};

exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { ownerId: req.user.userId }
    });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workspaces' });
  }
};

exports.updateWorkspace = async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;
  try {
    const workspace = await prisma.workspace.update({
      where: { id: parseInt(id) },
      data: { name, icon }
    });
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workspace' });
  }
};

exports.getWorkspaceProjects = async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await prisma.project.findMany({
      where: { workspaceId: parseInt(id) }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};
