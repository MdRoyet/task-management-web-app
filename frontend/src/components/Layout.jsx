import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, user, setUser }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 'var(--sidebar-width)' }}>
        <Navbar user={user} setUser={setUser} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
