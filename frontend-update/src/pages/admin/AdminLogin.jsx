import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@site.com');
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
        if (data.isAdmin || data.role === 'superadmin' || data.role === 'admin' || data.role === 'shopmanager') {
          localStorage.setItem('userInfo', JSON.stringify(data));
          navigate('/admin');
        } else {
          setError('Access denied: You do not have administrator privileges.');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error, please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '3rem', borderRadius: '16px', width: '100%', maxWidth: '450px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <ShieldAlert size={32} color="#38bdf8" />
            </div>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>Admin Portal</h1>
          <p style={{ color: '#94a3b8' }}>Secure access for authorized personnel only</p>
        </div>

        {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#cbd5e1' }}>Admin Email</label>
            <input 
              type="email" 
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#f8fafc', outline: 'none' }} 
              placeholder="admin@site.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#cbd5e1' }}>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#f8fafc', outline: 'none' }} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
