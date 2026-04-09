import React, { useState } from 'react';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        onLogin(data.user);
      } else {
        const err = await res.json();
        setError(err.detail || 'Invalid username or password');
      }
    } catch (e) {
      setError('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen" style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EduCore<sup>+</sup>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your school</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%', 
                padding: '0.875rem 1rem 0.875rem 3rem', 
                borderRadius: '12px', 
                background: 'var(--surface)', 
                border: '1px solid var(--border)',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', 
                padding: '0.875rem 1rem 0.875rem 3rem', 
                borderRadius: '12px', 
                background: 'var(--surface)', 
                border: '1px solid var(--border)',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={20} />
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.875rem', background: 'rgba(239,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>EduCore+ School Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
