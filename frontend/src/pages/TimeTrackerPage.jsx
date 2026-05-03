import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, Calendar, CheckCircle } from 'lucide-react';

export default function TimeTrackerPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/time/logs');
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Ongoing...';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const totalSeconds = logs.reduce((acc, log) => acc + (log.duration || 0), 0);

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Time Tracking</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor your productivity across projects.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <Clock size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.5rem' }}>{formatDuration(totalSeconds)}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Time Tracked</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <CheckCircle size={24} color="var(--status-done-border)" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.5rem' }}>{logs.length}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Completed Sessions</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Logs</h2>
        {loading ? (
          <p>Loading logs...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map(log => (
              <div 
                key={log.id} 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '1rem', borderBottom: '1px solid var(--glass-border)' 
                }}
              >
                <div>
                  <h4 style={{ fontWeight: '600' }}>{log.task.title}</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {new Date(log.startTime).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: log.endTime ? 'var(--text-main)' : 'var(--primary)' }}>
                  {formatDuration(log.duration)}
                </div>
              </div>
            ))}
            {logs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No time logs found yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
