import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FileText, Plus, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import MultiSelectModal from '../../components/MultiSelectModal';
import MediaPickerModal from '../../components/MediaPickerModal';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [linkedProductIds, setLinkedProductIds] = useState([]);
  const [author, setAuthor] = useState('Admin');
  const [status, setStatus] = useState('published');

  const [allProducts, setAllProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const joditTargetRef = useRef(null);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || ''}${url}`;
  };

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchBlogs();
    fetchProducts();
  }, [navigate, token]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/products');
      const data = await res.json();
      if (res.ok) setAllProducts(data.products || data || []);
    } catch (e) {
      console.error('Failed to fetch products', e);
    }
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setImage('');
    setContent('');
    setLinkedProductIds([]);
    setAuthor('Admin');
    setStatus('published');
    setShowForm(true);
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title || '');
    setSlug(blog.slug || '');
    setImage(blog.image || '');
    setContent(blog.content || '');
    setLinkedProductIds(blog.linkedProductIds || []);
    setAuthor(blog.author || 'Admin');
    setStatus(blog.status || 'published');
    setShowForm(true);
  };

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (!editingId) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title, slug, image, content, linkedProductIds, author, status
      };

      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/blogs/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/blogs`;
        
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowForm(false);
        fetchBlogs();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error saving blog');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchBlogs();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Write your blog content here...',
    height: 400,
    uploader: { insertImageAsBase64URI: true },
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize',
      {
        name: 'customImage',
        iconURL: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
        exec: function(editor) {
          editor.s.save();
          joditTargetRef.current = editor;
          setIsMediaModalOpen('jodit');
        },
        tooltip: 'Insert Image from Library'
      }
    ]
  }), []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={28} /> Blogs
        </h1>
        {!showForm && (
          <button onClick={handleCreateNew} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Blog
          </button>
        )}
      </div>

      {showForm ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <button onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* General Information Card */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>General Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Blog Title</label>
                  <input type="text" className="form-input" value={title} onChange={handleTitleChange} required placeholder="Enter a catchy title..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>URL Slug</label>
                  <input type="text" className="form-input" value={slug} onChange={e => setSlug(e.target.value)} required placeholder="blog-title" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Status</label>
                  <select className="form-input" value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Featured Image</label>
                  {image ? (
                    <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={getImageUrl(image)} alt="Featured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => setImage('')} style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>×</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsMediaModalOpen('main')} style={{ width: '100%', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                      <ImageIcon size={32} />
                      <span style={{ fontWeight: 500 }}>Click to select an image</span>
                    </button>
                  )}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>Sidebar Products</label>
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1rem 0' }}>Select the products you want to feature in the sidebar of this blog post.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button type="button" onClick={() => setIsProductModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        Browse Products ({linkedProductIds.length})
                      </button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3b82f6' }}>
                        {linkedProductIds.length} Linked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Editor Card */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>Article Content</h3>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <JoditEditor 
                  value={content} 
                  config={joditConfig}
                  onBlur={newContent => setContent(newContent)} 
                />
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ background: '#fff', padding: '1.5rem 2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>Discard Changes</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600 }}>Save & Publish</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {blogs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No blogs found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>Image</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>Title</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: '#334155' }}>Status</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: '#334155', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      {blog.image ? (
                        <img src={getImageUrl(blog.image)} alt={blog.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '60px', height: '40px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{blog.title}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 500, background: blog.status === 'published' ? '#dcfce7' : '#f1f5f9', color: blog.status === 'published' ? '#166534' : '#475569' }}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }} title="Preview">
                          <FileText size={18} />
                        </a>
                        <button onClick={() => handleEdit(blog)} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Edit">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(blog.id)} className="btn btn-danger" style={{ padding: '0.5rem' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modals */}
      <MultiSelectModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        onSave={(ids) => setLinkedProductIds(ids)} 
        items={allProducts} 
        selectedItems={linkedProductIds} 
        title="Select Linked Products" 
        itemKey="id" 
        itemLabel="name" 
        itemImage="images"
        itemSubtitle="sku"
      />

      <MediaPickerModal 
        isOpen={!!isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)} 
        multiSelect={false}
        currentSelection={isMediaModalOpen === 'main' ? image : ''}
        onSelect={(selection) => {
          if (isMediaModalOpen === 'main') {
            setImage(selection);
          } else if (isMediaModalOpen === 'jodit' && joditTargetRef.current) {
            const editor = joditTargetRef.current;
            editor.s.restore();
            if (selection) {
              editor.s.insertHTML(`<img src="${selection}" style="max-width: 100%; border-radius: 8px;" />`);
            }
          }
          setIsMediaModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminBlogs;
