"use client";
import React, { useState } from 'react';
import { Package, Truck, Calendar, CreditCard, User, AlertCircle, MapPin, Map, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [pathaoData, setPathaoData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setOrderData(null);
    setPathaoData(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim() })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to track order');
      }

      setOrderData(data.order);
      setPathaoData(data.pathaoTracking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  let statusLogs = [];
  if (orderData?.statusLogs) {
    if (typeof orderData.statusLogs === 'string') {
      try { statusLogs = JSON.parse(orderData.statusLogs); } catch(e) {}
    } else if (Array.isArray(orderData.statusLogs)) {
      statusLogs = orderData.statusLogs;
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '65vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', border: '1px solid #eef2f6' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Map size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Track Your Order</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your order ID below to check the current status and delivery updates.</p>
        </div>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. 153"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '0 2rem', fontSize: '1rem', fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {orderData && (
          <div style={{ borderTop: '1px solid #eef2f6', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Order #{orderData.id}</h3>
                <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> {new Date(orderData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: '50px', 
                fontWeight: 600, 
                fontSize: '0.9rem',
                background: `${getStatusColor(orderData.status)}15`,
                color: getStatusColor(orderData.status)
              }}>
                {orderData.status}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> Customer
                </div>
                <div style={{ fontWeight: 600 }}>{orderData.name || 'N/A'}</div>
              </div>
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={16} /> Total & Payment
                </div>
                <div style={{ fontWeight: 600 }}>৳{Number(orderData.totalPrice).toFixed(2)} - {orderData.paymentMethod}</div>
              </div>
            </div>

            {(orderData.courierName || orderData.trackingNumber) && (
              <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '16px', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
                  <Truck size={20} /> Shipping Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Courier</span>
                    <span style={{ fontWeight: 600 }}>{orderData.courierName || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tracking Number</span>
                    <span style={{ fontWeight: 600 }}>{orderData.trackingNumber || 'N/A'}</span>
                  </div>
                </div>
                
                {pathaoData && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(59, 130, 246, 0.2)' }}>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>Pathao Live Status:</h5>
                    <div style={{ padding: '0.75rem 1rem', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #e2e8f0' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{pathaoData.order_status?.replace(/_/g, ' ') || 'Unknown'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Timeline */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Timeline</h4>
              
              <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid #e2e8f0' }}>
                {statusLogs.length > 0 ? (
                  statusLogs.map((log, idx) => (
                    <div key={idx} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                      <div style={{ 
                        position: 'absolute', 
                        left: '-1.5rem', 
                        top: '0.25rem', 
                        transform: 'translateX(-50%)',
                        width: '12px', 
                        height: '12px', 
                        background: getStatusColor(log.status),
                        borderRadius: '50%',
                        border: '2px solid #fff'
                      }}></div>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <strong style={{ color: getStatusColor(log.status) }}>{log.status}</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(log.date).toLocaleString()}
                          </span>
                        </div>
                        {log.note && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>{log.note}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No timeline events recorded yet.</p>
                )}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
