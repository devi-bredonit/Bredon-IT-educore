import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use mock user data based on common roles
    const mockUser = {
      username: username,
      role: username === 'superadmin' ? 'Super Admin' : 
            username === 'corporate' ? 'Corporate User' : 
            'Administrator',
      profile_name: username === 'superadmin' ? 'System Administrator' : 'Client Admin'
    };
    onLogin(mockUser);
  };

  return (
    <div className="login-screen" style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: 'linear-gradient(to bottom right, #0f172a, #1e293b)'
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
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)',
                color: 'white',
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
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            <span>Sign In</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Login with <strong>superadmin</strong>, <strong>corporate</strong>, or <strong>admin</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
