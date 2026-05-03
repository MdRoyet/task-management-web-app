import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, CheckCircle, Timer } from 'lucide-react';
import api from '../services/api';

export default function TimeTrackerModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

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
    if (seconds === 0) return '0h 0m 0s';
    if (!seconds) return 'Ongoing...';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const totalSeconds = logs.reduce((acc, log) => acc + (log.duration || 0), 0);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div className="glass-panel" style={{ 
        width: '600px', maxHeight: '80vh', overflow: 'hidden',
        padding: '2rem', position: 'relative', display: 'flex', flexDirection: 'column'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>

        <header style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Timer color="var(--primary)" /> Time Tracking
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review your recent activity and productivity logs.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Tracked</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>{formatDuration(totalSeconds)}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Sessions</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{logs.length}</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '1rem' }}>Activity History</h3>
          
          {loading ? (
            <p>Loading activity...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {logs.map(log => (
                <div 
                  key={log.id} 
                  style={{ 
                    background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px',
                    border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{log.task.title}</div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {new Date(log.startTime).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontWeight: '700', color: log.endTime ? 'var(--text-main)' : 'var(--primary)', fontSize: '0.9rem' }}>
                    {formatDuration(log.duration)}
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No activity logs yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
