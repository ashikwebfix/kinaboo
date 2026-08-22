import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@site.com'); // Pre-filled for demo
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        if (data.isAdmin || data.role === 'superadmin' || data.role === 'admin' || data.role === 'shopmanager') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error, please try again.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 150px)' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <LogIn size={20} /> Sign In
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Demo Admin: admin@site.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
