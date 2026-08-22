import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, X, Image as ImageIcon, XCircle, Save, ArrowLeft } from 'lucide-react';
import JoditEditor from 'jodit-react';
import MediaPickerModal from '../../components/MediaPickerModal';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  
  const [pickerType, setPickerType] = useState(null); // 'main', 'gallery', 'section_x', 'jodit'
  const joditTargetRef = useRef(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState(0);
  const [allowSellWithoutStock, setAllowSellWithoutStock] = useState(false);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [keypoints, setKeypoints] = useState(''); 
  const [variations, setVariations] = useState([]);
  const [faq, setFaq] = useState([]);
  const [longDescription, setLongDescription] = useState('');
  const [imageTextSections, setImageTextSections] = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('published');
  const [volumeBundles, setVolumeBundles] = useState([]);

  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/login');
    fetchCategories();
    
    if (isEditing) {
      fetchProduct();
    }
  }, [id, navigate, token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/categories');
      const data = await res.json();
      setFetchedCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      const product = await res.json();
      
      setName(product.name);
      setDescription(product.description || '');
      setSku(product.sku || '');
      setCategory(product.category);
      setPrice(product.price);
      setSellPrice(product.sellPrice || '');
      setStock(product.stock);
      setAllowSellWithoutStock(product.allowSellWithoutStock || false);
      setImage(product.image || '');
      setImages(product.images || []);
      setKeypoints(product.keypoints ? product.keypoints.join(', ') : '');
      setVariations(product.variations || []);
      setFaq(product.faq || []);
      setLongDescription(product.longDescription || '');
      setImageTextSections(product.imageTextSections || []);
      setTags(product.tags || []);
      setStatus(product.status || 'published');
      setVolumeBundles(product.volumeBundles || []);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const parsedData = {
      name, sku, category, price: Number(price), stock: Number(stock), allowSellWithoutStock, image, images, variations, faq, description, longDescription, imageTextSections, tags, status, volumeBundles,
      sellPrice: sellPrice ? Number(sellPrice) : null,
      keypoints: keypoints.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${import.meta.env.VITE_API_URL}/api/products/${id}` : `${import.meta.env.VITE_API_URL}/api/products`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(parsedData)
      });
      
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      alert('Failed to save product.');
    }
  };

  // --- Variation Handlers ---
  const addVariation = () => setVariations([...variations, { name: '', options: [] }]);
  const removeVariation = (idx) => setVariations(variations.filter((_, i) => i !== idx));
  const updateVariationName = (idx, val) => {
    const newVars = [...variations];
    newVars[idx].name = val;
    setVariations(newVars);
  };
  const addOption = (idx, e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newVars = [...variations];
      if (!newVars[idx].options.includes(e.target.value.trim())) {
        newVars[idx].options.push(e.target.value.trim());
        setVariations(newVars);
      }
      e.target.value = '';
    }
  };
  const removeOption = (varIdx, optIdx) => {
    const newVars = [...variations];
    newVars[varIdx].options = newVars[varIdx].options.filter((_, i) => i !== optIdx);
    setVariations(newVars);
  };

  // --- Tag Handlers ---
  const addTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      if (!tags.includes(e.target.value.trim())) {
        setTags([...tags, e.target.value.trim()]);
      }
      e.target.value = '';
    }
  };
  const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

  // --- Volume Bundles Handlers ---
  const addVolumeBundle = () => {
    setVolumeBundles([...volumeBundles, { qty: 2, discountType: 'percentage', discountValue: 0, text: '', image: '' }]);
  };
  const removeVolumeBundle = (idx) => {
    setVolumeBundles(volumeBundles.filter((_, i) => i !== idx));
  };
  const updateVolumeBundle = (idx, field, val) => {
    const newBundles = [...volumeBundles];
    newBundles[idx][field] = val;
    setVolumeBundles(newBundles);
  };

  // --- FAQ Handlers ---
  const addFaq = () => setFaq([...faq, { question: '', answer: '' }]);
  const removeFaq = (idx) => setFaq(faq.filter((_, i) => i !== idx));
  const updateFaq = (idx, field, val) => {
    const newFaq = [...faq];
    newFaq[idx][field] = val;
    setFaq(newFaq);
  };

  // --- Image Text Sections Handlers ---
  const addImageTextSection = () => {
    setImageTextSections([...imageTextSections, {
      id: Date.now().toString(),
      orderType: 'before',
      imagePosition: 'left',
      wrapText: false,
      imageWidth: 50,
      text: '',
      image: ''
    }]);
  };
  const removeImageTextSection = (id) => {
    setImageTextSections(imageTextSections.filter(s => s.id !== id));
  };
  const updateImageTextSection = (id, field, val) => {
    setImageTextSections(imageTextSections.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const joditConfigSection = useMemo(() => ({
    minHeight: 150,
    buttons: ['source', '|', 'bold', 'strikethrough', 'underline', 'italic', '|', 'ul', 'ol', '|', 'outdent', 'indent',  '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'insertMedia', 'table', 'link', '|', 'align', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize'],
    extraButtons: [
      {
        name: 'insertMedia',
        icon: 'image',
        tooltip: 'Insert Media from Library',
        exec: function(editor) {
          editor.s.save();
          joditTargetRef.current = editor;
          setPickerType('jodit');
        }
      }
    ]
  }), []);

  const joditConfigMain = useMemo(() => ({
    minHeight: 400,
    buttons: ['source', '|', 'bold', 'strikethrough', 'underline', 'italic', '|', 'ul', 'ol', '|', 'outdent', 'indent',  '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'insertMedia', 'table', 'link', '|', 'align', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize'],
    extraButtons: [
      {
        name: 'insertMedia',
        icon: 'image',
        tooltip: 'Insert Media from Library',
        exec: function(editor) {
          editor.s.save();
          joditTargetRef.current = editor;
          setPickerType('jodit');
        }
      }
    ]
  }), []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="heading-lg" style={{ margin: 0 }}>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </header>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* LEFT COLUMN: Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Basic Info */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Title</label>
                  <input required className="input-field" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>SKU (Optional)</label>
                  <input className="input-field" value={sku} onChange={e => setSku(e.target.value)} placeholder="e.g. PROD-123" />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Short Description</label>
                <textarea required className="input-field" rows="3" value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div><label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Price (BDT)</label><input required type="number" step="0.01" className="input-field" value={price} onChange={e => setPrice(e.target.value)} /></div>
                <div><label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Sell Price (BDT)</label><input type="number" step="0.01" className="input-field" value={sellPrice} onChange={e => setSellPrice(e.target.value)} /></div>
                <div>
                  <label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Stock</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input required type="number" className="input-field" value={stock} onChange={e => setStock(e.target.value)} style={{ width: '80px' }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={allowSellWithoutStock} onChange={e => setAllowSellWithoutStock(e.target.checked)} />
                      Allow sell without stock
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Variations Builder */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Variations</h3>
                <button type="button" className="btn btn-secondary" onClick={addVariation} style={{ padding: '0.5rem 1rem' }}><Plus size={16} /> Add Type</button>
              </div>
              
              {variations.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem' }}>No variations added.</p>}
              
              {variations.map((v, vIdx) => (
                <div key={vIdx} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <input className="input-field" placeholder="Type (e.g. Size)" value={v.name} onChange={(e) => updateVariationName(vIdx, e.target.value)} style={{ width: '200px' }} />
                    <button type="button" onClick={() => removeVariation(vIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {v.options.map((opt, oIdx) => (
                      <span key={oIdx} style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {opt} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeOption(vIdx, oIdx)} />
                      </span>
                    ))}
                    <input type="text" className="input-field" placeholder="Type option & press Enter" onKeyDown={(e) => addOption(vIdx, e)} style={{ width: '200px', padding: '0.35rem 0.75rem', fontSize: '0.875rem' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Volume Bundles Builder */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Combo Bundles (Quantity Discounts)</h3>
                <button type="button" className="btn btn-secondary" onClick={addVolumeBundle} style={{ padding: '0.5rem 1rem' }}><Plus size={16} /> Add Tier</button>
              </div>
              
              {volumeBundles.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem' }}>No combo bundles added.</p>}
              
              {volumeBundles.map((b, bIdx) => (
                <div key={bIdx} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <button type="button" onClick={() => removeVolumeBundle(bIdx)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Quantity</label>
                      <input type="number" className="input-field" value={b.qty} onChange={e => updateVolumeBundle(bIdx, 'qty', Number(e.target.value))} min="2" />
                    </div>
                    <div>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Discount Type</label>
                      <select className="input-field" value={b.discountType} onChange={e => updateVolumeBundle(bIdx, 'discountType', e.target.value)}>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Discount Value</label>
                      <input type="number" step="0.01" className="input-field" value={b.discountValue} onChange={e => updateVolumeBundle(bIdx, 'discountValue', Number(e.target.value))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Title / Badge Text (Optional)</label>
                      <input type="text" className="input-field" value={b.text || ''} onChange={e => updateVolumeBundle(bIdx, 'text', e.target.value)} placeholder="e.g. Most Popular!" />
                    </div>
                    <div>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Image (Optional)</label>
                      {b.image ? (
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={b.image} alt="Bundle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={() => updateVolumeBundle(bIdx, 'image', '')} style={{ position:'absolute', top: 2, right: 2, background:'#fff', borderRadius:'50%', padding: 2, border:'none', cursor:'pointer' }}><XCircle size={14} color="#ef4444" /></button>
                        </div>
                      ) : (
                        <button type="button" className="btn btn-secondary" onClick={() => setPickerType(`bundle_${bIdx}`)} style={{ width: '80px', height: '80px', display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '2px dashed var(--border-color)', padding: 0, justifyContent: 'center' }}>
                          <ImageIcon size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Builder */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Frequently Asked Questions</h3>
                <button type="button" className="btn btn-secondary" onClick={addFaq} style={{ padding: '0.5rem 1rem' }}><Plus size={16} /> Add FAQ</button>
              </div>
              
              {faq.map((f, idx) => (
                <div key={idx} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <button type="button" onClick={() => removeFaq(idx)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Question</label>
                  <input className="input-field" value={f.question} onChange={e => updateFaq(idx, 'question', e.target.value)} style={{ marginBottom: '1rem' }} />
                  <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Answer</label>
                  <textarea className="input-field" rows="2" value={f.answer} onChange={e => updateFaq(idx, 'answer', e.target.value)} />
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Keypoints (comma separated)</label>
              <input className="input-field" value={keypoints} onChange={e => setKeypoints(e.target.value)} placeholder="e.g. 30-hour battery, Active Noise Cancelling" />
            </div>

            {/* Image + Text Sections Builder */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Image + Text Sections</h3>
                <button type="button" className="btn btn-secondary" onClick={addImageTextSection} style={{ padding: '0.5rem 1rem' }}><Plus size={16} /> Add Section</button>
              </div>
              
              {imageTextSections.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem' }}>No sections added.</p>}
              
              {imageTextSections.map((sec) => (
                <div key={sec.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <button type="button" onClick={() => removeImageTextSection(sec.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Placement</label>
                      <select className="input-field" value={sec.orderType} onChange={e => updateImageTextSection(sec.id, 'orderType', e.target.value)}>
                        <option value="before">Before Description</option>
                        <option value="after">After Description</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Image Position</label>
                      <select className="input-field" value={sec.imagePosition} onChange={e => updateImageTextSection(sec.id, 'imagePosition', e.target.value)}>
                        <option value="left">Image on Left</option>
                        <option value="right">Image on Right</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Text Wrapping</label>
                      <select className="input-field" value={sec.wrapText ? 'yes' : 'no'} onChange={e => updateImageTextSection(sec.id, 'wrapText', e.target.value === 'yes')}>
                        <option value="no">Separate Columns</option>
                        <option value="yes">Wrap Text Around Image</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Image Width: {sec.imageWidth || 50}%</label>
                      <input type="range" min="10" max="100" step="5" value={sec.imageWidth || 50} onChange={e => updateImageTextSection(sec.id, 'imageWidth', Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                    </div>
                  </div>
                  
                  <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Section Image</label>
                  {sec.image ? (
                    <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                      <img src={sec.image} alt="Section" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => updateImageTextSection(sec.id, 'image', '')} style={{ position:'absolute', top: 4, right: 4, background:'#fff', borderRadius:'50%', padding: 4, border:'none', cursor:'pointer' }}><XCircle size={16} color="#ef4444" /></button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={() => setPickerType(`section_${sec.id}`)} style={{ width: '150px', height: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '2px dashed var(--border-color)', marginBottom: '1rem', justifyContent: 'center' }}>
                      <ImageIcon size={24} /> Add Image
                    </button>
                  )}

                  <label style={{display:'block',marginBottom:'.25rem',fontWeight:500, fontSize:'0.9rem'}}>Section Content</label>
                  <div style={{ background: '#fff', marginBottom: '1rem' }}>
                    <JoditEditor 
                      value={sec.text} 
                      config={joditConfigSection} 
                      onBlur={newContent => updateImageTextSection(sec.id, 'text', newContent)} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Rich Text Editor */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <label style={{display:'block',marginBottom:'.5rem',fontWeight:600}}>Long Description</label>
              <div style={{ background: '#fff' }}>
                <JoditEditor 
                  value={longDescription} 
                  config={joditConfigMain}
                  onBlur={newContent => setLongDescription(newContent)} 
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Settings & Media */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Publish Box */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Status</h3>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: '1.5rem' }}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={18} /> Save Product
              </button>
            </div>

            {/* Category Box */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Category</h3>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                {fetchedCategories.map(cat => (
                  <option key={cat.id} value={cat.title}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* Tags Box */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Tags (SEO)</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {tags.map((tag, idx) => (
                  <span key={idx} style={{ background: '#e5e7eb', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {tag} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeTag(idx)} />
                  </span>
                ))}
              </div>
              <input type="text" className="input-field" placeholder="Add tag & press Enter" onKeyDown={addTag} />
            </div>

            {/* Thumbnail Box */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Thumbnail</h3>
              {image ? (
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                  <img src={image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setImage('')} style={{ position:'absolute', top: 8, right: 8, background:'#fff', borderRadius:'50%', padding: 4, border:'none', cursor:'pointer' }}><XCircle size={20} color="#ef4444" /></button>
                </div>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={() => setPickerType('main')} style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '2px dashed var(--border-color)' }}>
                  <ImageIcon size={24} /> Select Thumbnail
                </button>
              )}
            </div>

            {/* Gallery Box */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>Product Gallery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setImages(images.filter(i => i !== img))} style={{ position:'absolute', top: 2, right: 2, background:'#fff', borderRadius:'50%', padding: 2, border:'none', cursor:'pointer' }}><XCircle size={14} color="#ef4444" /></button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={() => setPickerType('gallery')} style={{ width: '100%', aspectRatio: '1', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '2px dashed var(--border-color)' }}>
                  <Plus size={20} /> Add
                </button>
              </div>
            </div>

          </div>

        </div>
      </form>

      <MediaPickerModal 
        isOpen={!!pickerType} 
        onClose={() => setPickerType(null)} 
        multiSelect={pickerType === 'gallery'}
        currentSelection={pickerType === 'main' ? image : (pickerType === 'gallery' ? images : '')}
        onSelect={(selection) => {
          if (pickerType === 'main') setImage(selection);
          else if (pickerType === 'gallery') setImages(selection);
          else if (pickerType?.startsWith('section_')) {
            const secId = pickerType.split('_')[1];
            updateImageTextSection(secId, 'image', selection);
          } else if (pickerType?.startsWith('bundle_')) {
            const bIdx = parseInt(pickerType.split('_')[1]);
            updateVolumeBundle(bIdx, 'image', selection);
          } else if (pickerType === 'jodit' && joditTargetRef.current) {
            const editor = joditTargetRef.current;
            editor.s.restore();
            const isVideo = /\.(mp4|webm|mkv|avi)$/i.test(selection);
            if (isVideo) {
              editor.s.insertHTML(`<video src="${selection}" controls style="max-width: 100%; border-radius: 8px;"></video>`);
            } else {
              editor.s.insertHTML(`<img src="${selection}" style="max-width: 100%; border-radius: 8px;" />`);
            }
            joditTargetRef.current = null;
          }
        }}
      />
    </div>
  );
};

export default AdminProductForm;
