import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Mail, Lock, User, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function LoginPage({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, formData);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-wrapper" style={{ background: '#0B0F19', position: 'relative', overflow: 'hidden' }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(151, 228, 50, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>

      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '450px', padding: '3rem', zIndex: 1,
        border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '60px', height: '60px', background: 'var(--primary)', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 1.5rem' 
          }}>
            <Hexagon size={32} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Join the Future'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? 'Enter your details to access your workspace' : 'Create an account to start collaborating'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', 
            padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem',
            fontSize: '0.85rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="glass-input"
                style={{ paddingLeft: '3rem' }}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="glass-input"
              style={{ paddingLeft: '3rem' }}
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              className="glass-input"
              style={{ paddingLeft: '3rem' }}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="glass-btn" style={{ 
            marginTop: '1rem', height: '50px', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}>
            {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "New to TaskBoard? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create account' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
