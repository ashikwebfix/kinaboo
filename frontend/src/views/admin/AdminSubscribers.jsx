"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Trash2 } from 'lucide-react';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const res = await fetch('/api/subscribers', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to load subscribers');
      
      setSubscribers(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        const res = await fetch(`/api/subscribers/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to delete subscriber');
        }

        setSubscribers(subscribers.filter(sub => sub.id !== id));
        toast.success('Subscriber deleted');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error('No subscribers to export');
      return;
    }

    const headers = ['Email', 'Subscribed At'];
    const csvData = subscribers.map(sub => [
      sub.email,
      new Date(sub.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><Mail className="inline-icon" /> Subscribers</h1>
        <button className="admin-btn-primary" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Loading subscribers...</div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Subscribed Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">No subscribers found</td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.email}</td>
                    <td>{new Date(sub.createdAt).toLocaleString()}</td>
                    <td>
                      <button 
                        className="admin-btn-danger" 
                        onClick={() => handleDelete(sub.id)}
                        title="Delete Subscriber"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
