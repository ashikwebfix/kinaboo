import React, { useState, useEffect } from 'react';
import { Shield, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFraudProtection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    blockTimePhone: 5,
    blockTimeIp: 5
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/fraud_protection', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.value) {
          setSettings(data.value);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/fraud_protection', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: settings })
      });

      if (res.ok) {
        toast.success('Fraud protection settings updated');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Shield size={28} color="var(--accent-primary)" />
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>Fraud Protection</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
        
        <div style={{ background: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>How this works:</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
              When enabled, the system will actively block suspicious duplicate orders. If a customer attempts to place multiple orders within the specified time limits, the system will reject the order and ask them to wait. This helps prevent bot attacks, spam, and fake cash-on-delivery orders.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>Enable Fraud Protection</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Turn on active blocking of suspicious orders.</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={settings.enabled} 
                onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }}
              />
            </label>
          </div>

          <div style={{ opacity: settings.enabled ? 1 : 0.5, pointerEvents: settings.enabled ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Same Phone Number Block (Minutes)</label>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Blocks orders if the same phone number attempts to buy the same product again within this timeframe.
              </p>
              <input 
                type="number" 
                className="form-control" 
                value={settings.blockTimePhone} 
                onChange={(e) => setSettings({...settings, blockTimePhone: parseInt(e.target.value) || 0})}
                min="1"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Same Network/Browser Block (Minutes)</label>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Blocks all orders from the same IP address and Browser if they occur within this timeframe.
              </p>
              <input 
                type="number" 
                className="form-control" 
                value={settings.blockTimeIp} 
                onChange={(e) => setSettings({...settings, blockTimeIp: parseInt(e.target.value) || 0})}
                min="1"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFraudProtection;
