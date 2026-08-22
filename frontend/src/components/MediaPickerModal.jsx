import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, CheckCircle2 } from 'lucide-react';

const MediaPickerModal = ({ isOpen, onClose, onSelect, multiSelect = false, currentSelection = [] }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Normalize currentSelection to an array of URLs
  const initialSelection = Array.isArray(currentSelection) ? currentSelection : (currentSelection ? [currentSelection] : []);
  const [selected, setSelected] = useState(initialSelection);
  
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  const isVideo = (url) => /\.(mp4|webm|mkv|avi)$/i.test(url);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelected(initialSelection);
      fetchMedia();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, currentSelection]);

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
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (url) => {
    if (multiSelect) {
      setSelected(prev => 
        prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
      );
    } else {
      setSelected([url]);
    }
  };

  const handleConfirm = () => {
    if (multiSelect) {
      onSelect(selected);
    } else {
      onSelect(selected[0] || '');
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'var(--bg-secondary)', width: '100%', maxWidth: '900px', height: '85vh', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        <header style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="heading-lg" style={{ fontSize: '1.25rem', margin: 0 }}>Select Media</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>
              <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload New'}
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={20} /></button>
          </div>
        </header>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {loading ? (
            <p>Loading media...</p>
          ) : media.length === 0 ? (
            <p>No media found. Upload some images.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
              {media.map((file, idx) => {
                const isSelected = selected.includes(file.url);
                return (
                  <div 
                    key={idx} 
                    onClick={() => toggleSelect(file.url)}
                    style={{ 
                      width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', position: 'relative',
                      border: isSelected ? '3px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: '#000'
                    }}
                  >
                    {isVideo(file.url) ? (
                      <video src={file.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                    ) : (
                      <img src={file.url} alt="media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '4px', right: '4px', background: '#fff', borderRadius: '50%', color: 'var(--accent-primary)', display: 'flex' }}>
                        <CheckCircle2 size={20} fill="currentColor" color="#fff" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Select {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </footer>

      </div>
    </div>,
    document.body
  );
};

export default MediaPickerModal;
