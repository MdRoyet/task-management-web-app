import React, { useState } from 'react';
import { Search, MessageSquare, Bell, ChevronDown, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Navbar({ user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      if (setUser) setUser(null);
      // Hard redirect to home page to clear any stale state
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      // Fail-safe redirect even if request fails
      window.location.href = '/';
    }
  };

  const formatDate = () => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <nav className="top-navbar" style={{ padding: '0 3rem' }}>
      <div className="navbar-search" style={{ flex: '0 1 350px' }}>
        <Search size={18} />
        <input 
          type="text" 
          placeholder="Search" 
          style={{ 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '12px', 
            padding: '0.75rem 1rem 0.75rem 2.75rem' 
          }} 
        />
      </div>

      <div className="navbar-actions" style={{ gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nav-icon-btn" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <MessageSquare size={20} />
          </button>
          <button className="nav-icon-btn" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Bell size={20} />
          </button>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          padding: '0.6rem 1.25rem', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          <Calendar size={16} />
          {formatDate()}
        </div>

        <div style={{ position: 'relative' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'Elisabeth Beck'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
            </div>
            <div className="nav-avatar" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
              {user?.name?.substring(0, 2).toUpperCase() || 'EB'}
            </div>
            <ChevronDown size={16} color="var(--text-muted)" />
          </div>

          {showDropdown && (
            <div className="glass-panel" style={{
              position: 'absolute', top: '120%', right: 0, 
              padding: '0.5rem', zIndex: 100, display: 'flex', 
              flexDirection: 'column', gap: '0.25rem', minWidth: '180px',
              border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div 
                className="nav-item" 
                style={{ 
                  padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#EF4444', 
                  display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Logout triggered");
                  handleLogout();
                }}
              >
                <LogOut size={16} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
