import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

export default function WorkspaceModal({ isOpen, onClose, onWorkspaceCreated, workspaceToEdit = null }) {
  const [name, setName] = useState(workspaceToEdit?.name || '');
  const [icon, setIcon] = useState(workspaceToEdit?.icon || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIcon(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (workspaceToEdit) {
        const res = await api.put(`/workspaces/${workspaceToEdit.id}`, { name, icon });
        onWorkspaceCreated(res.data);
      } else {
        const res = await api.post('/workspaces', { name, icon });
        onWorkspaceCreated(res.data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving workspace', error);
      alert('Error saving workspace: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '1.5rem' }}>{workspaceToEdit ? 'Edit Workspace' : 'New Workspace'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{
                width: '80px', height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)',
                border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {icon ? (
                <img src={icon} alt="Workspace Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={32} color="var(--text-muted)" />
              )}
              <label style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)',
                padding: '4px', textAlign: 'center', cursor: 'pointer'
              }}>
                <Upload size={12} color="white" />
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Workspace Name</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Design Team, Marketing..."
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="glass-btn" disabled={loading}>
            {loading ? 'Saving...' : workspaceToEdit ? 'Save Changes' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
