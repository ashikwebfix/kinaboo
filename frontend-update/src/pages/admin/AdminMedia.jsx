import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Copy, Check } from 'lucide-react';

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/login');
    fetchMedia();
  }, [navigate, token]);

  const fetchMedia = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/upload', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching media:", error);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await fetch(import.meta.env.VITE_API_URL + '/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      fetchMedia();
    } catch (error) {
      console.error("Error uploading media:", error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (window.confirm('Are you sure you want to delete this image? It will be removed from any product using it.')) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/upload/${filename}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMedia();
      } catch (error) {
        console.error("Error deleting media:", error);
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (loading) return <div>Loading media...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg">Media Library</h1>
        
        <div>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>
      </header>

      {media.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
          <p className="text-muted">No media files uploaded yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {media.map((file, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
              <div style={{ width: '100%', aspectRatio: '1', background: '#f3f4f6' }}>
                <img src={file.url} alt={file.filename} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              
              <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => copyToClipboard(file.url)}
                  title="Copy URL"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedUrl === file.url ? '#10b981' : 'var(--text-secondary)' }}
                >
                  {copiedUrl === file.url ? <Check size={18} /> : <Copy size={18} />}
                </button>

                <button 
                  onClick={() => handleDelete(file.filename)}
                  title="Delete Image"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
