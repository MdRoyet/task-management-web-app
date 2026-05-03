const prisma = require('../config/db');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Allow user to join a specific project's room for targeted broadcasts
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`User ${socket.id} joined room: project_${projectId}`);
    });

    // Handle task movement
    socket.on('move_task', async ({ taskId, status, projectId }) => {
      try {
        // 1. Update the task status in PostgreSQL using Prisma
        const updatedTask = await prisma.task.update({
          where: { id: parseInt(taskId, 10) },
          data: { status }
        });

        // 2. Broadcast the 'task_updated' event to all users in the project's room
        // io.to() emits to everyone in the room (including the sender).
        // Alternatively, use socket.to().emit() to send to everyone EXCEPT the sender.
        io.to(`project_${projectId}`).emit('task_updated', updatedTask);
        
        console.log(`Task ${taskId} moved to ${status} in project ${projectId}`);
      } catch (error) {
        console.error(`Error updating task ${taskId}:`, error);
        // Inform the user that the operation failed
        socket.emit('error', { message: 'Failed to update task status' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
