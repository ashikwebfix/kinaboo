import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Edit, Trash2, ShieldAlert } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', password: '', role: 'manager' });
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const currentUserRole = userInfo.role || 'customer';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEdit(true);
      setFormData({ id: user.id, name: user.name, email: user.email, password: '', role: user.role || 'customer' });
    } else {
      setIsEdit(false);
      setFormData({ id: '', name: '', email: '', password: '', role: 'manager' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEdit 
        ? `${import.meta.env.VITE_API_URL}/api/users/${formData.id}`
        : `${import.meta.env.VITE_API_URL}/api/users/admin`;
      
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error saving user');

      toast.success(isEdit ? 'User role updated successfully' : 'User created successfully');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === 'superadmin') return toast.error('Cannot delete superadmin');
    if (currentUserRole === 'admin' && role === 'admin') return toast.error('Admin cannot delete another admin');
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error deleting user');

        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Staff & Role Management</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem' }}>{user.name}</td>
              <td style={{ padding: '1rem' }}>{user.email}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                  background: user.role === 'superadmin' ? '#fee2e2' : user.role === 'admin' ? '#e0e7ff' : user.role === 'manager' ? '#dcfce7' : '#f1f5f9',
                  color: user.role === 'superadmin' ? '#991b1b' : user.role === 'admin' ? '#3730a3' : user.role === 'manager' ? '#166534' : '#475569'
                }}>
                  {user.role?.toUpperCase() || 'CUSTOMER'}
                </span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button onClick={() => handleOpenModal(user)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '1rem' }}>
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(user.id, user.role)} 
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    color: (user.role === 'superadmin' || (currentUserRole === 'admin' && user.role === 'admin')) ? '#cbd5e1' : '#ef4444' 
                  }}
                  disabled={user.role === 'superadmin' || (currentUserRole === 'admin' && user.role === 'admin')}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{isEdit ? 'Edit User Role' : 'Create Staff User'}</h3>
            <form onSubmit={handleSubmit}>
              {!isEdit && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                    <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%' }} />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                    <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ width: '100%' }} />
                  </div>
                </>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
                <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%' }}>
                  {currentUserRole === 'superadmin' && <option value="superadmin">Super Admin</option>}
                  {currentUserRole === 'superadmin' && <option value="admin">Admin</option>}
                  <option value="manager">Store Manager</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{isEdit ? 'New Password (Optional)' : 'Password'}</label>
                <input type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!isEdit} style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
