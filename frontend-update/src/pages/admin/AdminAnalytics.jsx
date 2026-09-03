import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Users, MousePointer2, Activity, Map, Eye, TrendingUp, ShoppingBag, MapPin, Package } from 'lucide-react';

// Fix for default leaflet icons not showing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [heatmapUrl, setHeatmapUrl] = useState('/');
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/admin/login');
    fetchStats();
    
    // Poll for live users every 30s
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [navigate, token]);

  const fetchStats = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const loadHeatmap = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/dashboard?heatmapUrl=${encodeURIComponent(heatmapUrl)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClicks(data.clicks || []);
    } catch (error) {
      console.error('Error loading heatmap:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Analytics Engine...</div>;
  if (!stats) return <div style={{ padding: '2rem', color: '#ef4444' }}>Error: Could not connect to Analytics Engine.</div>;

  const validMapMarkers = stats.activeVisitors.filter(v => v.lat && v.lon && v.lat !== 0);

  return (
    <div className="animate-fade-in" style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={28} color="var(--accent-primary)" /> Live Analytics & Tracking
        </h1>
      </header>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}>
            <Users size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Active Users (Live)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.activeCount} <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '12px' }}>
            <Eye size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Pageviews (Today)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.pageviews}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Map Widget */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Map size={20} /> Live User Locations
          </h2>
          <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <MapContainer center={[23.6850, 90.3563]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              {validMapMarkers.map(v => (
                <Marker key={v.id} position={[v.lat, v.lon]}>
                  <Popup>
                    <strong>{v.city}, {v.country}</strong><br/>
                    IP: {v.ipAddress}<br/>
                    Last Active: {new Date(v.lastActive).toLocaleTimeString()}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Heatmap Widget */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MousePointer2 size={20} /> Click Heatmap Engine
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                value={heatmapUrl} 
                onChange={e => setHeatmapUrl(e.target.value)} 
                placeholder="Enter path e.g. /shop"
                style={{ width: '250px' }}
              />
              <button className="btn btn-primary" onClick={loadHeatmap}>Generate Heatmap</button>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            This tool visualizes where users are clicking on the specified page. It renders an aggregate overlay of coordinates.
          </p>

          <div style={{ position: 'relative', height: '600px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc' }}>
            {/* We render an iframe of the actual site to overlay the clicks onto */}
            <iframe 
              src={`${window.location.origin}${heatmapUrl}`} 
              title="Heatmap Target"
              style={{ width: '100%', height: '100%', border: 'none', opacity: 0.5, pointerEvents: 'none' }}
            />
            
            {/* The Heatmap Overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
              {clicks.map((c, i) => {
                // Calculate percentage based positioning so it scales responsively over the iframe
                const leftPercent = (c.x / c.screenWidth) * 100;
                const topPercent = (c.y / c.screenHeight) * 100;
                
                // Only render if it fits reasonably within view
                if (topPercent > 100) return null; 

                return (
                  <div 
                    key={i} 
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: '20px',
                      height: '20px',
                      background: 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0) 70%)',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                );
              })}
              {clicks.length === 0 && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.9)', padding: '1rem 2rem', borderRadius: '20px', fontWeight: 600 }}>
                  No click data for this URL.
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {clicks.length} data points.
          </div>
        </div>

        {/* New Analytics Reports */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Max Visited Products */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} /> Top Visited Products
            </h2>
            {stats.maxVisitedProducts && stats.maxVisitedProducts.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.maxVisitedProducts.map((item, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.product.image && <img src={item.product.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />}
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.product.name}</span>
                    </div>
                    <span style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{item.visitCount} visits</span>
                  </li>
                ))}
              </ul>
            ) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No visit data available.</p>}
          </div>

          {/* Max Selling Products */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} /> Top Selling Products
            </h2>
            {stats.maxSellingProducts && stats.maxSellingProducts.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.maxSellingProducts.map((item, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.product?.image && <img src={item.product.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />}
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.product?.name || 'Unknown'}</span>
                    </div>
                    <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{item.totalSold} sold</span>
                  </li>
                ))}
              </ul>
            ) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No sales data available.</p>}
          </div>

          {/* Visitors By Location */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Visitors by Location
            </h2>
            {stats.visitorsByLocation && stats.visitorsByLocation.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.visitorsByLocation.map((loc, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{loc.city !== 'Unknown' ? `${loc.city}, ` : ''}{loc.country}</span>
                    <span style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>{loc.count}</span>
                  </li>
                ))}
              </ul>
            ) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No location data available.</p>}
          </div>

          {/* Trending Daily */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} /> Daily Trending (Pageviews)
            </h2>
            {stats.trendingData && stats.trendingData.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '150px', marginTop: '1rem' }}>
                {stats.trendingData.map((d, i) => {
                  const maxViews = Math.max(...stats.trendingData.map(t => t.views));
                  const heightPercent = maxViews > 0 ? (d.views / maxViews) * 100 : 0;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.views}</div>
                      <div style={{ width: '100%', height: '100%', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${heightPercent}%`, background: '#3b82f6', borderRadius: '4px' }} title={`${d.date}: ${d.views} views`}></div>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No trending data available.</p>}
          </div>

        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </div>
  );
};

export default AdminAnalytics;
