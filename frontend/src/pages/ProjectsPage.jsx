import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Layout, Search, Filter, FolderPlus, Trash2, ExternalLink } from 'lucide-react';
import api from '../services/api';

const ProjectCard = ({ id, name, workspaceName, taskCount, onDelete }) => (
  <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.03)', transition: 'transform 0.2s' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: '40px', height: '40px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Layout size={20} color="var(--primary)" />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => window.location.href = `/board/${id}`} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <ExternalLink size={18} />
        </button>
        <button onClick={() => onDelete(id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
    
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{name}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{workspaceName}</p>
    </div>

    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{taskCount}</span> Tasks
      </div>
      <div style={{ display: 'flex', WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)', maskImage: 'linear-gradient(to right, transparent, black 20%)' }}>
         {[1,2,3].map(i => (
           <img key={i} src={`https://i.pravatar.cc/100?u=${i+id}`} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--glass-bg)', marginLeft: i === 1 ? 0 : '-8px' }} alt="" />
         ))}
      </div>
    </div>
  </div>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', workspaceId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [wRes, pRes] = await Promise.all([
        api.get('/workspaces'),
        api.get('/projects')
      ]);
      setWorkspaces(wRes.data);
      setProjects(pRes.data);
      if (wRes.data.length > 0) {
        setNewProject(prev => ({ ...prev, workspaceId: wRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', workspaceId: workspaces[0]?.id || '' });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and organize your team workspaces</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <FolderPlus size={20} /> Create New Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="navbar-search" style={{ flex: '0 1 400px' }}>
          <Search size={18} />
          <input type="text" placeholder="Search projects..." className="glass-input" style={{ paddingLeft: '2.75rem' }} />
        </div>
        <button className="nav-icon-btn" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <Filter size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            id={project.id}
            name={project.name}
            workspaceName={workspaces.find(w => w.id === project.workspaceId)?.name || 'General'}
            taskCount={project.tasks?.length || 0}
            onDelete={handleDeleteProject}
          />
        ))}
        {projects.length === 0 && !loading && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <Layout size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
            <h3>No projects found</h3>
            <p>Create your first project to get started</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>New Project</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Project Name</label>
                <input 
                  className="glass-input" 
                  placeholder="e.g. Mobile App Redesign"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Workspace</label>
                <select 
                  className="glass-input"
                  style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
                  value={newProject.workspaceId}
                  onChange={e => setNewProject({...newProject, workspaceId: e.target.value})}
                  required
                >
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id} style={{ background: '#1a1d23' }}>{w.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="glass-btn" style={{ height: '50px', marginTop: '1rem' }}>
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper X icon for modal
const X = ({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
