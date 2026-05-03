import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function LoginPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        setUser(res.data.user);
        navigate('/');
      } else {
        await api.post('/auth/register', formData);
        setIsLogin(true); // Switch to login after register
        setFormData({ ...formData, password: '' }); // Clear password
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-panel auth-box">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div style={{ color: '#ef4444', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <input 
                type="text" 
                placeholder="Name" 
                className="glass-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="glass-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="glass-input"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="glass-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
}
