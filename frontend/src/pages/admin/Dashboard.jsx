import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, DollarSign, Truck } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, users: 0, revenue: 0, pathaoActive: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const { token, isAdmin } = JSON.parse(userInfo);
    if (!isAdmin) {
      navigate('/');
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch(import.meta.env.VITE_API_URL + '/api/products'),
          fetch(import.meta.env.VITE_API_URL + '/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch(import.meta.env.VITE_API_URL + '/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const products = await productsRes.json();
        const users = await usersRes.json();
        const orders = await ordersRes.json();

        let revenue = 0;
        let pathaoActive = 0;
        
        if (Array.isArray(orders)) {
          revenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? Number(o.totalPrice) : 0), 0);
          pathaoActive = orders.filter(o => o.courierName?.toLowerCase() === 'pathao' && (o.status === 'Shipped' || o.status === 'Processing')).length;
        }
        
        setStats({ products: products.length, users: users.length, revenue, pathaoActive });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="heading-lg">Overview</h1>
        <p className="text-muted">Welcome to your admin dashboard</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px', color: '#60a5fa' }}>
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Total Revenue</p>
            <h3 style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.revenue.toLocaleString()} BDT</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(167, 139, 250, 0.2)', borderRadius: '12px', color: '#a78bfa' }}>
            <Package size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Products</p>
            <h3 style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.products}</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.2)', borderRadius: '12px', color: '#34d399' }}>
            <Users size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Customers</p>
            <h3 style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.users}</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(225, 29, 72, 0.1)', borderRadius: '12px', color: '#e11d48' }}>
            <Truck size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Active Pathao Parcels</p>
            <h3 style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.pathaoActive}</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
