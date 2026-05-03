const prisma = require('../config/db');

exports.createProject = async (req, res) => {
  const { name, workspaceId } = req.body;
  try {
    const project = await prisma.project.create({
      data: { name, workspaceId: parseInt(workspaceId) }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { tasks: true } // Return tasks with the project
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
};
