import React from 'react';
import { Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Maintenance = ({ message }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <Helmet>
        <title>Under Maintenance</title>
      </Helmet>
      
      <div style={{
        background: '#fff',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'rgba(6, 78, 59, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem auto',
          color: 'var(--accent-primary)'
        }}>
          <Settings size={40} className="animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        
        <h1 className="heading-xl" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          We'll be back soon!
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          {message || 'Sorry for the inconvenience but we are performing some maintenance at the moment. We will be back online shortly!'}
        </p>
      </div>
    </div>
  );
};

export default Maintenance;
