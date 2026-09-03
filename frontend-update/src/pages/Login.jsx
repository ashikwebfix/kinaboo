import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || '') + '/api/users/login';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
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
        setError(data.message || 'ইমেইল বা পাসওয়ার্ড সঠিক নয় (Invalid credentials)');
      }
    } catch (err) {
      setError('সার্ভারে সংযোগ করতে সমস্যা হচ্ছে। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@site.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div 
      style={{ 
        minHeight: 'calc(100vh - 120px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '3rem 1.5rem',
        background: 'radial-gradient(circle at top, rgba(255, 106, 61, 0.05) 0%, #f8fafc 70%)'
      }}
      className="animate-fade-in"
    >
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
          background: '#ffffff', 
          borderRadius: '24px', 
          padding: '2.75rem 2.25rem', 
          boxShadow: '0 20px 45px -10px rgba(43, 45, 66, 0.08)',
          border: '1px solid #eef2f6',
          position: 'relative'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
            <img src="/logo.svg" alt="Kinaboo" style={{ height: '44px' }} />
          </Link>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0', letterSpacing: '-0.4px' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
            আপনার অ্যাকাউন্টে লগইন করুন
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            className="animate-fade-in"
            style={{ 
              padding: '0.85rem 1rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              color: '#dc2626', 
              borderRadius: '12px', 
              marginBottom: '1.5rem', 
              fontSize: '0.88rem',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Email Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
              <Mail size={15} color="var(--accent-primary)" />
              <span>ইমেইল এড্রেস (Email Address)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="input-field" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem', 
                  borderRadius: '12px', 
                  fontSize: '0.95rem',
                  border: '1.5px solid #e2e8f0',
                  background: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
              <Lock size={15} color="var(--accent-primary)" />
              <span>পাসওয়ার্ড (Password)</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 2.75rem 0.85rem 1rem', 
                  borderRadius: '12px', 
                  fontSize: '0.95rem',
                  border: '1.5px solid #e2e8f0',
                  background: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.95rem 1.5rem', 
              fontSize: '1.05rem', 
              fontWeight: 700, 
              borderRadius: '12px', 
              marginTop: '0.5rem',
              background: 'var(--accent-gradient)',
              boxShadow: '0 4px 15px rgba(255, 106, 61, 0.35)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span>সাইন ইন হচ্ছে...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>সাইন ইন করুন (Sign In)</span>
              </>
            )}
          </button>
        </form>

        {/* Security Trust Note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>১০০% সুরক্ষিত ও এনক্রিপ্টেড সংযোগ</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
