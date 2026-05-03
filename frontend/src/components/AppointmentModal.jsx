import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import api from '../services/api';

export default function AppointmentModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
    status: 'Confirmed'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    setLoading(true);
    try {
      const res = await api.post('/appointments', formData);
      console.log("Success:", res.data);
      onCreated();
      onClose();
      setFormData({ name: '', date: '', time: '', description: '', status: 'Confirmed' });
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Failed to create appointment. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>New Appointment</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Patient Name" 
              className="glass-input" 
              style={{ paddingLeft: '2.75rem' }}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Date (e.g. 14 Jan)" 
                className="glass-input" 
                style={{ paddingLeft: '2.75rem' }}
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required 
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Time (e.g. 10:30 AM)" 
                className="glass-input" 
                style={{ paddingLeft: '2.75rem' }}
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                required 
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <FileText size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
            <textarea 
              placeholder="Description" 
              className="glass-input" 
              style={{ paddingLeft: '2.75rem', minHeight: '100px', resize: 'none' }}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required 
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Confirmed' })}
              style={{ 
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)',
                background: formData.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                color: formData.status === 'Confirmed' ? '#22C55E' : 'var(--text-muted)',
                fontWeight: '600', cursor: 'pointer'
              }}
            >Confirmed</button>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Pending' })}
              style={{ 
                flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--glass-border)',
                background: formData.status === 'Pending' ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                color: formData.status === 'Pending' ? '#EAB308' : 'var(--text-muted)',
                fontWeight: '600', cursor: 'pointer'
              }}
            >Pending</button>
          </div>

          <button type="submit" className="glass-btn" style={{ height: '50px', fontSize: '1rem' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
