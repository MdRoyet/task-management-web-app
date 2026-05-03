import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  UserPlus, 
  FileText, 
  Send, 
  Clock, 
  BookOpen,
  Search,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkspaceModal from './WorkspaceModal';
import api from '../services/api';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <Icon />
    <span>{label}</span>
  </div>
);

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      setWorkspaces(res.data);
      
      const storedId = localStorage.getItem('activeWorkspaceId');
      const active = res.data.find(w => w.id === parseInt(storedId)) || res.data[0];
      
      if (active) {
        setActiveWorkspace(active);
        localStorage.setItem('activeWorkspaceId', active.id);
        setTimeout(() => {
          window.dispatchEvent(new Event('workspaceChanged'));
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching workspaces', error);
    }
  };

  const handleWorkspaceCreated = (newWorkspace) => {
    setWorkspaces(prev => [...prev.filter(w => w.id !== newWorkspace.id), newWorkspace]);
    setActiveWorkspace(newWorkspace);
    localStorage.setItem('activeWorkspaceId', newWorkspace.id);
    window.dispatchEvent(new Event('workspaceChanged'));
  };

  const switchWorkspace = (workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem('activeWorkspaceId', workspace.id);
    setShowDropdown(false);
    window.dispatchEvent(new Event('workspaceChanged'));
    navigate('/');
  };

  const isDashboard = location.pathname === '/';
  const isBoard = location.pathname.startsWith('/board/');

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ position: 'relative' }}>
        <div className="workspace-switcher" onClick={() => setShowDropdown(!showDropdown)}>
          {activeWorkspace?.icon ? (
            <img src={activeWorkspace.icon} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
          ) : (
            <div className="workspace-icon">{activeWorkspace?.name?.substring(0, 2).toUpperCase() || '??'}</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Workspace</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{activeWorkspace?.name || 'Loading...'}</div>
          </div>
          <ChevronDown size={16} color="var(--text-muted)" />
        </div>

        {showDropdown && (
          <div className="glass-panel" style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
            padding: '0.5rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.25rem'
          }}>
            {workspaces.map(w => (
              <div 
                key={w.id} 
                className={`nav-item ${activeWorkspace?.id === w.id ? 'active' : ''}`}
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                onClick={() => switchWorkspace(w)}
              >
                {w.name}
              </div>
            ))}
            <div 
              className="nav-item" 
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--primary)', borderTop: '1px solid var(--glass-border)', marginTop: '0.25rem' }}
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); setShowDropdown(false); }}
            >
              <Plus size={14} /> Add Workspace
            </div>
          </div>
        )}
      </div>

      <WorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onWorkspaceCreated={handleWorkspaceCreated}
      />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={16} 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
          />
          <input 
            type="text" 
            placeholder="Search" 
            className="glass-input" 
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }} 
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div>
          <h3 className="nav-section-title">Main</h3>
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={isDashboard} 
            onClick={() => navigate('/')} 
          />
          <NavItem icon={Users} label="Client" />
          <NavItem icon={Briefcase} label="Projects" active={isBoard} />
          <NavItem icon={CheckSquare} label="Tasks" />
          <NavItem icon={UserPlus} label="Invite Team" />
        </div>

        <div>
          <h3 className="nav-section-title">Tools</h3>
          <NavItem icon={FileText} label="Invoices" />
          <NavItem icon={Send} label="Proposals" />
          <NavItem icon={FileText} label="Contracts" />
          <NavItem icon={Clock} label="Time Tracking" />
          <NavItem icon={BookOpen} label="Services" />
        </div>
      </nav>
    </aside>
  );
}
