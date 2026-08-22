import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Image as ImageIcon, XCircle } from 'lucide-react';
import MediaPickerModal from '../../components/MediaPickerModal';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/login');
    fetchCategories();
  }, [navigate, token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCategories();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const openForm = (cat = null) => {
    if (cat) {
      setEditingId(cat.id);
      setTitle(cat.title);
      setSubtitle(cat.subtitle || '');
      setDescription(cat.description || '');
      setImage(cat.image || '');
    } else {
      setEditingId(null);
      setTitle(''); setSubtitle(''); setDescription(''); setImage('');
    }
    setIsFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const parsedData = { title, subtitle, description, image };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${import.meta.env.VITE_API_URL}/api/categories/${editingId}` : `${import.meta.env.VITE_API_URL}/api/categories`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(parsedData)
      });
      
      setIsFormOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert('Failed to save category.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg">Categories</h1>
        {!isFormOpen && (
          <button className="btn btn-primary" onClick={() => openForm()}>
            <Plus size={18} /> Add Category
          </button>
        )}
      </header>

      {isFormOpen ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 className="heading-lg">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            <button className="btn" onClick={() => setIsFormOpen(false)} style={{ padding: '0.5rem' }}><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Title</label><input required className="input-field" value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Subtitle</label><input className="input-field" value={subtitle} onChange={e => setSubtitle(e.target.value)} /></div>
            </div>

            <div><label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Description</label><textarea className="input-field" rows="3" value={description} onChange={e => setDescription(e.target.value)} /></div>

            {/* Media Section */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#f9fafb' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Category Image</h3>
              <div>
                {image ? (
                  <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    <img src={image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setImage('')} style={{ position:'absolute', top: 4, right: 4, background:'#fff', borderRadius:'50%', padding: 2, border:'none', cursor:'pointer' }}><XCircle size={16} color="#ef4444" /></button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={() => setIsMediaPickerOpen(true)} style={{ height: '120px', width: '120px', display: 'flex', flexDirection: 'column' }}>
                    <ImageIcon size={24} /> Select Image
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Save Category</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Subtitle</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {cat.image ? <img src={cat.image} alt={cat.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#e5e7eb' }}></div>}
                    <span style={{ fontWeight: '500' }}>{cat.title}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{cat.subtitle || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button className="btn" onClick={() => openForm(cat)} style={{ padding: '0.5rem', marginRight: '0.5rem' }}><Edit size={16} /></button>
                    <button className="btn" onClick={() => handleDelete(cat.id)} style={{ padding: '0.5rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MediaPickerModal 
        isOpen={isMediaPickerOpen} 
        onClose={() => setIsMediaPickerOpen(false)} 
        multiSelect={false}
        currentSelection={image}
        onSelect={(selection) => setImage(selection)}
      />
    </div>
  );
};

export default AdminCategories;
