import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage({ user, setUser }) {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    window.addEventListener('workspaceChanged', fetchProjects);
    
    // Fallback for first-time load
    const timer = setTimeout(() => {
      fetchProjects();
    }, 1000);

    return () => {
      window.removeEventListener('workspaceChanged', fetchProjects);
      clearTimeout(timer);
    };
  }, []);

  const fetchProjects = async () => {
    const workspaceId = localStorage.getItem('activeWorkspaceId');
    if (!workspaceId) return;
    
    try {
      const res = await api.get(`/workspaces/${workspaceId}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects', err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const workspaceId = localStorage.getItem('activeWorkspaceId');
    
    try {
      const res = await api.post('/projects', { 
        name: newProjectName,
        workspaceId: parseInt(workspaceId)
      });
      setProjects([...projects, res.data]);
      setNewProjectName('');
    } catch (err) {
      console.error('Error creating project', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}!</p>
        </div>
        <button onClick={handleLogout} className="glass-btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
          Logout
        </button>
      </header>

      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Create New Project</h2>
        <form onSubmit={createProject} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Project Name..." 
            className="glass-input"
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
          />
          <button type="submit" className="glass-btn">Create</button>
        </form>
      </section>

      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => (
            <div 
              key={project.id} 
              className="glass-panel" 
              style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(`/board/${project.id}`)}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {projects.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No projects found. Create one above!</p>
          )}
        </div>
      </section>
    </div>
  );
}
