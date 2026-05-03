import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, ClipboardList, Calendar, 
  BarChart2, UserCircle, HelpCircle, Settings, LogOut,
  Hexagon
} from 'lucide-react';
import api from '../services/api';

export default function Sidebar({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      if (setUser) setUser(null);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Projects', path: '/' },
    { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart2, label: 'Statistics', path: '/stats' },
    { icon: UserCircle, label: 'Staff', path: '/staff' },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
        <div style={{ width: '45px', height: '45px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <Hexagon size={24} color="white" fill="white" />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              title={item.label}
            >
              <item.icon size={24} />
            </div>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
        {bottomItems.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{ padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
            title={item.label}
          >
            <item.icon size={24} />
          </div>
        ))}
        <div
          className="nav-item"
          onClick={handleLogout}
          style={{ padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', color: '#EF4444' }}
          title="Logout"
        >
          <LogOut size={24} />
        </div>
      </div>
    </aside>
  );
}
