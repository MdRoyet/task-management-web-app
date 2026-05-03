import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Square, Clock } from 'lucide-react';
import api from '../services/api';
import socket from '../services/socket';

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, timerRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get('/time/active')
        ]);
        setProject(projectRes.data);
        setTasks(projectRes.data.tasks || []);
        setActiveTimer(timerRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
        navigate('/');
      }
    };
    fetchData();

    socket.emit('join_project', id);
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
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    socket.emit('move_task', { taskId, status: newStatus, projectId: id });
  };

  const startTimer = async (taskId) => {
    try {
      const res = await api.post('/time/start', { taskId });
      setActiveTimer(res.data);
    } catch (err) {
      console.error('Error starting timer', err);
    }
  };

  const stopTimer = async (logId) => {
    try {
      await api.put(`/time/stop/${logId}`);
      setActiveTimer(null);
    } catch (err) {
      console.error('Error stopping timer', err);
    }
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: '500', marginBottom: '1rem' }}>{task.title}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {activeTimer?.taskId === task.id ? (
                        <button 
                          onClick={() => stopTimer(activeTimer.id)} 
                          style={{ background: 'var(--status-todo)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Square size={16} fill="white" color="white" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => startTimer(task.id)} 
                          style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Play size={16} fill="white" color="white" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {activeTimer?.taskId === task.id ? 'Tracking...' : 'Idle'}
                    </div>
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
                          {c.title}
                        </button>
                      ))}
                    </div>
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
