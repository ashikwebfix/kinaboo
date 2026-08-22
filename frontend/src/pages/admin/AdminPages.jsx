import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sections: [],
    isActive: true,
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        toast.error('Failed to fetch pages');
      }
    } catch (error) {
      toast.error('Error loading pages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page.id);
    setFormData({
      title: page.title,
      slug: page.slug,
      sections: page.sections || [],
      isActive: page.isActive,
    });
  };

  const handleAddNew = () => {
    setEditingPage('new');
    setFormData({
      title: '',
      slug: '',
      sections: [],
      isActive: true,
    });
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + `/api/pages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });
      if (res.ok) {
        toast.success('Page deleted');
        fetchPages();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting page');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPage === 'new' 
        ? `${import.meta.env.VITE_API_URL}/api/pages` 
        : `${import.meta.env.VITE_API_URL}/api/pages/${editingPage}`;
        
      const method = editingPage === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Page ${editingPage === 'new' ? 'created' : 'updated'} successfully`);
        setEditingPage(null);
        fetchPages();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to save page');
      }
    } catch (error) {
      toast.error('Error saving page');
    }
  };

  // --- Block Editor Functions ---

  const addSection = (type) => {
    let initialData = {};
    if (type === 'richtext') initialData = { html: '' };
    if (type === 'faq') initialData = { questions: [{ q: '', a: '' }] };
    if (type === 'contact_form') initialData = { email: '', phone: '', address: '' };
    if (type === 'about_hero') initialData = { headline: '', subheadline: '', imageUrl: '' };

    const newSection = {
      id: Date.now().toString(),
      type,
      data: initialData
    };
    setFormData({ ...formData, sections: [...formData.sections, newSection] });
  };

  const removeSection = (index) => {
    const newSections = [...formData.sections];
    newSections.splice(index, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const moveSection = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.sections.length - 1) return;
    
    const newSections = [...formData.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + (direction === 'up' ? -1 : 1)];
    newSections[index + (direction === 'up' ? -1 : 1)] = temp;
    setFormData({ ...formData, sections: newSections });
  };

  const updateSectionData = (index, newData) => {
    const newSections = [...formData.sections];
    newSections[index].data = newData;
    setFormData({ ...formData, sections: newSections });
  };

  const renderSectionEditor = (section, index) => {
    const { type, data } = section;

    return (
      <div key={section.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem', background: '#f8fafc' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: '8px 8px 0 0' }}>
          <strong style={{ textTransform: 'capitalize' }}>{type.replace('_', ' ')} Section</strong>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => moveSection(index, 'up')} disabled={index === 0} style={{ padding: '0.25rem', cursor: index === 0 ? 'not-allowed' : 'pointer' }}><ArrowUp size={16} /></button>
            <button type="button" onClick={() => moveSection(index, 'down')} disabled={index === formData.sections.length - 1} style={{ padding: '0.25rem', cursor: index === formData.sections.length - 1 ? 'not-allowed' : 'pointer' }}><ArrowDown size={16} /></button>
            <button type="button" onClick={() => removeSection(index)} style={{ padding: '0.25rem', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
          </div>
        </div>
        
        <div style={{ padding: '1rem' }}>
          {type === 'richtext' && (
            <JoditEditor
              value={data.html}
              config={{ readonly: false, height: 300 }}
              onBlur={newHtml => updateSectionData(index, { ...data, html: newHtml })}
            />
          )}

          {type === 'faq' && (
            <div>
              {data.questions.map((q, qIndex) => (
                <div key={qIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input 
                      className="input-field" 
                      placeholder="Question" 
                      value={q.q} 
                      onChange={(e) => {
                        const newQ = [...data.questions];
                        newQ[qIndex].q = e.target.value;
                        updateSectionData(index, { ...data, questions: newQ });
                      }}
                    />
                    <textarea 
                      className="input-field" 
                      placeholder="Answer" 
                      value={q.a} 
                      onChange={(e) => {
                        const newQ = [...data.questions];
                        newQ[qIndex].a = e.target.value;
                        updateSectionData(index, { ...data, questions: newQ });
                      }}
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newQ = [...data.questions];
                      newQ.splice(qIndex, 1);
                      updateSectionData(index, { ...data, questions: newQ });
                    }}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => updateSectionData(index, { ...data, questions: [...data.questions, { q: '', a: '' }] })}
              >
                + Add Question
              </button>
            </div>
          )}

          {type === 'contact_form' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email Address</label>
                <input className="input-field" value={data.email || ''} onChange={(e) => updateSectionData(index, { ...data, email: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Phone Number</label>
                <input className="input-field" value={data.phone || ''} onChange={(e) => updateSectionData(index, { ...data, phone: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Physical Address</label>
                <input className="input-field" value={data.address || ''} onChange={(e) => updateSectionData(index, { ...data, address: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Office Hours (HTML allowed)</label>
                <input className="input-field" value={data.officeHours || ''} onChange={(e) => updateSectionData(index, { ...data, officeHours: e.target.value })} style={{ width: '100%' }} placeholder="রবিবার - বৃহস্পতিবার: ১০টা - ৬টা<br/>শুক্রবার - শনিবার: বন্ধ" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Hero Headline</label>
                <input className="input-field" value={data.headline || ''} onChange={(e) => updateSectionData(index, { ...data, headline: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Hero Subheadline</label>
                <input className="input-field" value={data.subheadline || ''} onChange={(e) => updateSectionData(index, { ...data, subheadline: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Hero Image URL</label>
                <input className="input-field" value={data.heroImage || ''} onChange={(e) => updateSectionData(index, { ...data, heroImage: e.target.value })} style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {type === 'about_hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Headline</label>
                <input className="input-field" value={data.headline || ''} onChange={(e) => updateSectionData(index, { ...data, headline: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Subheadline</label>
                <input className="input-field" value={data.subheadline || ''} onChange={(e) => updateSectionData(index, { ...data, subheadline: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Image URL</label>
                <input className="input-field" value={data.heroImage || ''} onChange={(e) => updateSectionData(index, { ...data, heroImage: e.target.value })} style={{ width: '100%' }} placeholder="/uploads/..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Story Text (HTML allowed)</label>
                <textarea className="input-field" value={data.storyText || ''} onChange={(e) => updateSectionData(index, { ...data, storyText: e.target.value })} style={{ width: '100%', minHeight: '100px' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 1 Value</label>
                  <input className="input-field" value={data.stat1Value || ''} onChange={(e) => updateSectionData(index, { ...data, stat1Value: e.target.value })} style={{ width: '100%' }} placeholder="10k+" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 1 Label</label>
                  <input className="input-field" value={data.stat1Label || ''} onChange={(e) => updateSectionData(index, { ...data, stat1Label: e.target.value })} style={{ width: '100%' }} placeholder="সন্তুষ্ট গ্রাহক" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 2 Value</label>
                  <input className="input-field" value={data.stat2Value || ''} onChange={(e) => updateSectionData(index, { ...data, stat2Value: e.target.value })} style={{ width: '100%' }} placeholder="5+" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 2 Label</label>
                  <input className="input-field" value={data.stat2Label || ''} onChange={(e) => updateSectionData(index, { ...data, stat2Label: e.target.value })} style={{ width: '100%' }} placeholder="বছরের অভিজ্ঞতা" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 3 Value</label>
                  <input className="input-field" value={data.stat3Value || ''} onChange={(e) => updateSectionData(index, { ...data, stat3Value: e.target.value })} style={{ width: '100%' }} placeholder="100%" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 3 Label</label>
                  <input className="input-field" value={data.stat3Label || ''} onChange={(e) => updateSectionData(index, { ...data, stat3Label: e.target.value })} style={{ width: '100%' }} placeholder="গ্রাহক সন্তুষ্টি" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 4 Value</label>
                  <input className="input-field" value={data.stat4Value || ''} onChange={(e) => updateSectionData(index, { ...data, stat4Value: e.target.value })} style={{ width: '100%' }} placeholder="24/7" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Stat 4 Label</label>
                  <input className="input-field" value={data.stat4Label || ''} onChange={(e) => updateSectionData(index, { ...data, stat4Label: e.target.value })} style={{ width: '100%' }} placeholder="সাপোর্ট সুবিধা" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  if (loading && !editingPage) return <p>Loading pages...</p>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="heading-lg" style={{ color: 'var(--text-primary)' }}>Customer Service Pages</h2>
        {!editingPage && (
          <button className="btn btn-primary" onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add New Page
          </button>
        )}
      </div>

      {editingPage ? (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
            {editingPage === 'new' ? 'Create New Page' : 'Edit Page'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
                <input 
                  className="input-field" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Privacy Policy" 
                  required 
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>URL Slug</label>
                <input 
                  className="input-field" 
                  value={formData.slug} 
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-')})} 
                  placeholder="e.g. privacy-policy" 
                  required 
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ fontWeight: 500, fontSize: '1.1rem' }}>Page Sections</label>
                <select 
                  className="input-field" 
                  style={{ padding: '0.5rem', width: '200px' }}
                  onChange={(e) => {
                    if (e.target.value) {
                      addSection(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">+ Add Section</option>
                  <option value="richtext">Rich Text</option>
                  <option value="faq">FAQ (Accordion)</option>
                  <option value="contact_form">Contact Form</option>
                  <option value="about_hero">About Hero Banner</option>
                </select>
              </div>

              {formData.sections.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                  No sections added yet. Add a section above to start building this page.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formData.sections.map((section, index) => renderSectionEditor(section, index))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
              />
              <label htmlFor="isActive" style={{ fontWeight: 500 }}>Active (Visible on website)</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Page</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>URL Path</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{page.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <a 
                      href={`/pages/${page.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
                      onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      /pages/{page.slug}
                    </a>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {page.isActive ? <CheckCircle size={18} color="var(--accent-primary)" /> : <XCircle size={18} color="var(--text-secondary)" />}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <a href={`/pages/${page.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }} title="View Page">
                        <Eye size={18} />
                      </a>
                      <button onClick={() => handleEdit(page)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)' }} title="Edit Page">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(page.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No pages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
