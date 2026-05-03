import React, { useState } from 'react';
import { Search, FileText, Bell, LogOut, Hexagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Navbar({ user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      if (setUser) setUser(null);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-brand">
        <div className="navbar-brand-icon">
          <Hexagon size={16} color="white" fill="white" />
        </div>
        TaskBoard
      </div>

      <div className="navbar-search">
        <Search size={16} />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="navbar-actions">
        <button className="nav-icon-btn">
          <FileText size={18} />
        </button>
        <button className="nav-icon-btn">
          <Bell size={18} />
        </button>
        
        <div style={{ position: 'relative' }}>
          <div 
            className="nav-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials(user?.name)}
          </div>

          {showDropdown && (
            <div className="glass-panel" style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
              padding: '0.5rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.25rem',
              minWidth: '150px'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.25rem' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <div 
                className="nav-item" 
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#ef4444' }}
                onClick={handleLogout}
              >
                <LogOut size={14} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
