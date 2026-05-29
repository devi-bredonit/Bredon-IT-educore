import React, { useState } from 'react';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const resp = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (resp.ok) {
        const data = await resp.json();
        // Store school info if available
        const userData = {
          ...data.user,
          token: data.token,
          school_info: data.school_info
        };
        onLogin(userData);
      } else {
        const errData = await resp.json();
        setError(errData.detail || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for demo purposes if backend is down
      if (username === 'admin' && password === 'admin') {
        console.log('Using fallback demo login');
        const demoUser = {
          id: 1,
          username: 'admin',
          profile_name: 'Demo Admin',
          role: 'Super Admin',
          school_id: 1,
          school_info: {
            id: 1,
            name: 'EduCore International School (Demo)',
            academic_year: '2024-2025'
          }
        };
        onLogin(demoUser);
      } else {
        setError('Connection failed. Please ensure backend is running or use admin/admin for demo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255, 255, 255, 0.7)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(to right, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EduCore<sup>+</sup>
            </h1>
          </Link>
          <p style={{ color: 'var(--text-muted)' }}>Premium School Management MVP</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                borderRadius: '12px',
                background: 'white',
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                borderRadius: '12px',
                background: 'white',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span style={{ fontWeight: 700 }}>Enter Dashboard</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text)' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Super Admin • Corporate • Admin
          </p>
          <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }}></div>
          <p>
            New institution? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid var(--primary)', paddingBottom: '2px', marginLeft: '0.5rem' }}>Register your school</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
