import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    // Fetch project and tasks
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error('Error fetching project', err);
        navigate('/');
      }
    };
    fetchProject();

    // Socket.io room join
    socket.emit('join_project', id);

    // Listen for real-time task updates
    socket.on('task_updated', (updatedTask) => {
      setTasks((prevTasks) => 
        prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
    });

    return () => {
      socket.emit('leave_project', id);
      socket.off('task_updated');
    };
  }, [id, navigate]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await api.post('/tasks', { title: newTaskTitle, status: 'TODO', projectId: id });
      setTasks([...tasks, res.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Error creating task', err);
    }
  };

  const handleMoveTask = (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    // Emit via socket
    socket.emit('move_task', { taskId, status: newStatus, projectId: id });
  };

  if (!project) return <div className="container">Loading...</div>;

  const columns = [
    { title: 'To Do', status: 'TODO', colorClass: '--status-todo' },
    { title: 'In Progress', status: 'IN_PROGRESS', colorClass: '--status-in-progress' },
    { title: 'Done', status: 'DONE', colorClass: '--status-done' }
  ];

  return (
    <div className="container" style={{ maxWidth: '1400px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="glass-btn" 
            style={{ padding: '8px 16px', marginBottom: '1rem', background: 'transparent', border: '1px solid var(--glass-border)' }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: '2.5rem' }}>{project.name}</h1>
        </div>
      </header>

      <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '500px' }}>
        <input 
          type="text" 
          placeholder="New Task..." 
          className="glass-input"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
        />
        <button type="submit" className="glass-btn">Add Task</button>
      </form>

      <div className="board-container">
        {columns.map(col => (
          <div key={col.status} className="glass-panel kanban-column">
            <h2 style={{ fontSize: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              {col.title} ({tasks.filter(t => t.status === col.status).length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '500px' }}>
              {tasks.filter(t => t.status === col.status).map(task => (
                <div 
                  key={task.id} 
                  className="kanban-task"
                  style={{ 
                    background: `var(${col.colorClass})`, 
                    border: `1px solid var(${col.colorClass}-border)` 
                  }}
                >
                  <p style={{ fontWeight: '500', marginBottom: '1rem' }}>{task.title}</p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {columns.map(c => c.status !== task.status && (
                      <button 
                        key={c.status}
                        onClick={() => handleMoveTask(task.id, c.status)}
                        style={{ 
                          background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' 
                        }}
                      >
                        Move to {c.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
