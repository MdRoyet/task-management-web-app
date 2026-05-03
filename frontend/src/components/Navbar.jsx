import React from 'react';
import { Search, MessageSquare, Bell, ChevronDown, Calendar } from 'lucide-react';

export default function Navbar({ user }) {
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'Elisabeth Beck'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
          </div>
          <div className="nav-avatar" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
            {user?.name?.substring(0, 2).toUpperCase() || 'EB'}
          </div>
          <ChevronDown size={16} color="var(--text-muted)" />
        </div>
      </div>
    </nav>
  );
}
