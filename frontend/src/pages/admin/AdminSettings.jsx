import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Truck, Plus, Trash2, Save, Navigation, GripVertical, LayoutTemplate, Image as ImageIcon, Tag, Box, Star, X, XCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MediaPickerModal from '../../components/MediaPickerModal';

const AdminSettings = () => {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [headerMenu, setHeaderMenu] = useState([]);
  const [trackingSettings, setTrackingSettings] = useState({ gtmId: '', fbPixelId: '', fbCapiToken: '', fbTestEventCode: '' });
  const [pathaoSettings, setPathaoSettings] = useState({ clientId: '', clientSecret: '', username: '', password: '', storeId: '', baseUrl: 'https://api-hermes.pathao.com' });
  const [generalSettings, setGeneralSettings] = useState({ maintenanceMode: false, maintenanceMessage: 'Site is under maintenance. We will be right back.' });
  const [storefrontUI, setStorefrontUI] = useState({
    heroBanners: [], promotionalBanners: [], trustBadges: [], superHourDeals: { productIds: [], endTime: '' },
    featuredProducts: { title: '', productIds: [] }, customSections: []
  });
  const [pickerType, setPickerType] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'storefront';
  
  const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;

  useEffect(() => {
    if (!token) navigate('/login');
    fetchSettings();
  }, [navigate, token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/delivery_methods', { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      setDeliveryMethods(data);

      const menuRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/header_menu', { headers: { Authorization: `Bearer ${token}` }});
      const menuData = await menuRes.json();
      setHeaderMenu(menuData);

      const trackingRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/tracking_settings', { headers: { Authorization: `Bearer ${token}` }});
      if (trackingRes.ok) {
        const trackingData = await trackingRes.json();
        if (trackingData) setTrackingSettings(trackingData);
      }

      const storefrontRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/storefront_ui', { headers: { Authorization: `Bearer ${token}` }});
      if (storefrontRes.ok) {
        const storefrontData = await storefrontRes.json();
        if (storefrontData) setStorefrontUI(storefrontData);
      }

      const pathaoRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/pathao_settings', { headers: { Authorization: `Bearer ${token}` }});
      if (pathaoRes.ok) {
        const pathaoData = await pathaoRes.json();
        if (pathaoData) setPathaoSettings(pathaoData);
      }

      const generalRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/general_settings', { headers: { Authorization: `Bearer ${token}` }});
      if (generalRes.ok) {
        const generalData = await generalRes.json();
        if (generalData) setGeneralSettings(generalData);
      }

      const prodRes = await fetch(import.meta.env.VITE_API_URL + '/api/products');
      const prodData = await prodRes.json();
      setAllProducts(Array.isArray(prodData) ? prodData : []);

      const catRes = await fetch(import.meta.env.VITE_API_URL + '/api/categories');
      const catData = await catRes.json();
      setAllCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = () => setDeliveryMethods([...deliveryMethods, { id: Date.now().toString(), name: '', charge: 0 }]);
  const handleRemoveMethod = (id) => setDeliveryMethods(deliveryMethods.filter(m => m.id !== id));
  const handleUpdateMethod = (id, field, value) => setDeliveryMethods(deliveryMethods.map(m => m.id === id ? { ...m, [field]: value } : m));

  const handleAddMenuItem = () => setHeaderMenu([...headerMenu, { id: Date.now().toString(), label: '', url: '/', icon: 'Home' }]);
  const handleRemoveMenuItem = (id) => setHeaderMenu(headerMenu.filter(m => m.id !== id));
  const handleUpdateMenuItem = (id, field, value) => setHeaderMenu(headerMenu.map(m => m.id === id ? { ...m, [field]: value } : m));

  const handleAddBanner = () => setStorefrontUI(prev => ({ ...prev, heroBanners: [...prev.heroBanners, { id: Date.now().toString(), image: '', title: '', subtitle: '', link: '/' }] }));
  const handleUpdateBanner = (id, field, value) => setStorefrontUI(prev => ({ ...prev, heroBanners: prev.heroBanners.map(b => b.id === id ? { ...b, [field]: value } : b) }));
  const handleRemoveBanner = (id) => setStorefrontUI(prev => ({ ...prev, heroBanners: prev.heroBanners.filter(b => b.id !== id) }));

  const handleAddPromoBanner = () => setStorefrontUI(prev => ({ ...prev, promotionalBanners: [...(prev.promotionalBanners || []), { id: Date.now().toString(), image: '', title: '', link: '/' }] }));
  const handleUpdatePromoBanner = (id, field, value) => setStorefrontUI(prev => ({ ...prev, promotionalBanners: (prev.promotionalBanners || []).map(b => b.id === id ? { ...b, [field]: value } : b) }));
  const handleRemovePromoBanner = (id) => setStorefrontUI(prev => ({ ...prev, promotionalBanners: (prev.promotionalBanners || []).filter(b => b.id !== id) }));

  const handleAddTrustBadge = () => setStorefrontUI(prev => ({ ...prev, trustBadges: [...(prev.trustBadges || []), { id: Date.now().toString(), text: '', icon: 'Star' }] }));
  const handleUpdateTrustBadge = (id, field, value) => setStorefrontUI(prev => ({ ...prev, trustBadges: (prev.trustBadges || []).map(b => b.id === id ? { ...b, [field]: value } : b) }));
  const handleRemoveTrustBadge = (id) => setStorefrontUI(prev => ({ ...prev, trustBadges: (prev.trustBadges || []).filter(b => b.id !== id) }));

  const toggleSuperHourProduct = (productId) => setStorefrontUI(prev => {
    const current = prev.superHourDeals.productIds || [];
    return { ...prev, superHourDeals: { ...prev.superHourDeals, productIds: current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId] } };
  });

  const toggleFeaturedProduct = (productId) => setStorefrontUI(prev => {
    const current = prev.featuredProducts.productIds || [];
    return { ...prev, featuredProducts: { ...prev.featuredProducts, productIds: current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId] } };
  });

  const handleAddCustomSection = () => setStorefrontUI(prev => ({ ...prev, customSections: [...prev.customSections, { id: Date.now().toString(), title: '', category: '', limit: 4 }] }));
  const handleUpdateCustomSection = (id, field, value) => setStorefrontUI(prev => ({ ...prev, customSections: prev.customSections.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  const handleRemoveCustomSection = (id) => setStorefrontUI(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res1 = await fetch(import.meta.env.VITE_API_URL + '/api/settings/delivery_methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: deliveryMethods })
      });
      const res2 = await fetch(import.meta.env.VITE_API_URL + '/api/settings/header_menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: headerMenu })
      });
      const res3 = await fetch(import.meta.env.VITE_API_URL + '/api/settings/tracking_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: trackingSettings })
      });
      const res4 = await fetch(import.meta.env.VITE_API_URL + '/api/settings/storefront_ui', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: storefrontUI })
      });
      const res5 = await fetch(import.meta.env.VITE_API_URL + '/api/settings/pathao_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: pathaoSettings })
      });
      const res6 = await fetch(import.meta.env.VITE_API_URL + '/api/settings/general_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value: generalSettings })
      });
      if (res1.ok && res2.ok && res3.ok && res4.ok && res5.ok && res6.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const availableIcons = [
    'Home', 'PackageSearch', 'Layers', 'Phone', 'Info', 'Star', 'ShoppingBag', 'Heart', 'Mail', 'Zap'
  ];

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={24} /> Store Settings
        </h1>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=general')}>General</button>
        <button className={`tab-btn ${activeTab === 'storefront' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=storefront')}>Storefront UI</button>
        <button className={`tab-btn ${activeTab === 'navigation' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=navigation')}>Navigation</button>
        <button className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=delivery')}>Delivery Rates</button>
        <button className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=tracking')}>Marketing</button>
        <button className={`tab-btn ${activeTab === 'courier' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=courier')}>Courier API</button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <SettingsIcon size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>General Settings</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Maintenance Mode</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>When enabled, customers will see a maintenance page. Only admins can view the site.</p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        style={{ display: 'none' }} 
                        checked={generalSettings.maintenanceMode} 
                        onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })} 
                      />
                      <div style={{ width: '44px', height: '24px', background: generalSettings.maintenanceMode ? 'var(--accent-primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                        <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: generalSettings.maintenanceMode ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
                      </div>
                    </label>
                  </div>
                  {generalSettings.maintenanceMode && (
                    <div className="animate-fade-in">
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Maintenance Message</label>
                      <textarea 
                        className="input-field" 
                        rows="3" 
                        value={generalSettings.maintenanceMessage} 
                        onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMessage: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storefront' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <LayoutTemplate size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Storefront UI Configurator</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Dynamically construct your homepage layout.
              </p>

              {/* 1. Hero Banners */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={18} /> Hero Banners
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {storefrontUI.heroBanners?.map((banner, index) => (
                    <div key={banner.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '1rem', left: '-1rem', background: 'var(--text-primary)', color: '#fff', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>{index + 1}</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Image</label>
                          {banner.image ? (
                            <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                              <img src={banner.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => handleUpdateBanner(banner.id, 'image', '')} style={{ position:'absolute', top: 4, right: 4, background:'#fff', borderRadius:'50%', padding: 4, border:'none', cursor:'pointer' }}><XCircle size={16} color="#ef4444" /></button>
                            </div>
                          ) : (
                            <button type="button" className="btn btn-secondary" onClick={() => setPickerType(`hero_${banner.id}`)} style={{ width: '100%', height: '80px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '2px dashed var(--border-color)', justifyContent: 'center' }}>
                              <ImageIcon size={18} /> Select Image
                            </button>
                          )}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Link URL</label>
                          <input className="input-field" value={banner.link} onChange={(e) => handleUpdateBanner(banner.id, 'link', e.target.value)} placeholder="/shop" style={{ background: '#fff' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Title</label>
                          <input className="input-field" value={banner.title} onChange={(e) => handleUpdateBanner(banner.id, 'title', e.target.value)} placeholder="e.g. Summer Collection" style={{ background: '#fff' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Subtitle</label>
                          <input className="input-field" value={banner.subtitle} onChange={(e) => handleUpdateBanner(banner.id, 'subtitle', e.target.value)} placeholder="e.g. Up to 50% Off" style={{ background: '#fff' }} />
                        </div>
                      </div>
                      <button className="btn btn-secondary" onClick={() => handleRemoveBanner(banner.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button className="btn btn-secondary" onClick={handleAddBanner} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Banner Slide
                  </button>
                </div>
              </div>

              {/* 1.5 Promotional Images (Under Hero) */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={18} /> Promotional Images (Under Hero)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(storefrontUI.promotionalBanners || []).map((banner, index) => (
                    <div key={banner.id} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '1rem', left: '-1rem', background: 'var(--text-primary)', color: '#fff', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>{index + 1}</span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Image</label>
                          {banner.image ? (
                            <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                              <img src={banner.image} alt="Promo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => handleUpdatePromoBanner(banner.id, 'image', '')} style={{ position:'absolute', top: 4, right: 4, background:'#fff', borderRadius:'50%', padding: 4, border:'none', cursor:'pointer' }}><XCircle size={16} color="#ef4444" /></button>
                            </div>
                          ) : (
                            <button type="button" className="btn btn-secondary" onClick={() => setPickerType(`promo_${banner.id}`)} style={{ width: '100%', height: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '2px dashed var(--border-color)', justifyContent: 'center' }}>
                              <ImageIcon size={18} /> Select Image
                            </button>
                          )}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Title</label>
                          <input className="input-field" value={banner.title} onChange={(e) => handleUpdatePromoBanner(banner.id, 'title', e.target.value)} placeholder="e.g. Smart Watches" style={{ background: '#fff' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Link URL</label>
                          <input className="input-field" value={banner.link} onChange={(e) => handleUpdatePromoBanner(banner.id, 'link', e.target.value)} placeholder="/shop" style={{ background: '#fff' }} />
                        </div>
                      </div>
                      <button className="btn btn-secondary" onClick={() => handleRemovePromoBanner(banner.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(storefrontUI.promotionalBanners || []).length < 3 && (
                    <button className="btn btn-secondary" onClick={handleAddPromoBanner} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={18} /> Add Promo Image
                    </button>
                  )}
                </div>
              </div>

              {/* 1.75 Trust Badges */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} /> Trust Badges (Under Promo)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(storefrontUI.trustBadges || []).map((badge) => (
                    <div key={badge.id} style={{ display: 'flex', gap: '1rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', alignItems: 'flex-end', position: 'relative' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Badge Text</label>
                        <input className="input-field" value={badge.text} onChange={(e) => handleUpdateTrustBadge(badge.id, 'text', e.target.value)} placeholder="e.g. Free Shipping" style={{ background: '#fff' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Icon</label>
                        <select className="input-field" value={badge.icon} onChange={(e) => handleUpdateTrustBadge(badge.id, 'icon', e.target.value)} style={{ background: '#fff' }}>
                          <option value="Star">Star</option>
                          <option value="Truck">Truck</option>
                          <option value="ShieldCheck">Shield</option>
                          <option value="RotateCcw">Return (Rotate)</option>
                          <option value="Trophy">Trophy</option>
                          <option value="Gem">Gem</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="ShoppingBag">Bag</option>
                        </select>
                      </div>
                      <button className="btn btn-secondary" onClick={() => handleRemoveTrustBadge(badge.id)} style={{ padding: '0.65rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {(storefrontUI.trustBadges || []).length < 4 && (
                    <button className="btn btn-secondary" onClick={handleAddTrustBadge} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Plus size={18} /> Add Trust Badge
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Super Hour Deals */}
              <div style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px dashed #f87171' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
                  ⚡ Super Hour Deals
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>End Time</label>
                    <input type="datetime-local" className="input-field" value={storefrontUI.superHourDeals?.endTime ? new Date(storefrontUI.superHourDeals.endTime).toISOString().slice(0,16) : ''} onChange={(e) => setStorefrontUI(prev => ({ ...prev, superHourDeals: { ...prev.superHourDeals, endTime: new Date(e.target.value).toISOString() } }))} style={{ background: '#fff', maxWidth: '300px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Select Products to Feature</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      {allProducts.map(product => (
                        <label key={`super-${product.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={storefrontUI.superHourDeals?.productIds?.includes(product.id) || false} onChange={() => toggleSuperHourProduct(product.id)} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Featured Products */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} /> Featured Products
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Section Title</label>
                    <input className="input-field" value={storefrontUI.featuredProducts?.title || ''} onChange={(e) => setStorefrontUI(prev => ({ ...prev, featuredProducts: { ...prev.featuredProducts, title: e.target.value } }))} placeholder="e.g. Recommended For You" style={{ background: '#fff', maxWidth: '400px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>Select Products</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      {allProducts.map(product => (
                        <label key={`feat-${product.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={storefrontUI.featuredProducts?.productIds?.includes(product.id) || false} onChange={() => toggleFeaturedProduct(product.id)} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Custom Sections */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Box size={18} /> Custom Category Sections
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {storefrontUI.customSections?.map((section) => (
                    <div key={section.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Section Title</label>
                        <input className="input-field" value={section.title} onChange={(e) => handleUpdateCustomSection(section.id, 'title', e.target.value)} placeholder="e.g. Latest in Fashion" style={{ background: '#fff' }} />
                      </div>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Category Filter</label>
                        <select className="input-field" value={section.category} onChange={(e) => handleUpdateCustomSection(section.id, 'category', e.target.value)} style={{ background: '#fff' }}>
                          <option value="">Select Category...</option>
                          {allCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Product Limit</label>
                        <input type="number" className="input-field" value={section.limit} onChange={(e) => handleUpdateCustomSection(section.id, 'limit', Number(e.target.value))} min="1" max="20" style={{ background: '#fff' }} />
                      </div>
                      <button className="btn btn-secondary" onClick={() => handleRemoveCustomSection(section.id)} style={{ padding: '0.65rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {storefrontUI.customSections?.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: '#f9fafb', borderRadius: '8px' }}>
                      No custom sections added yet.
                    </div>
                  )}
                  <button className="btn btn-secondary" onClick={handleAddCustomSection} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add Custom Section
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <Truck size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Delivery Methods</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Configure the delivery options available to customers during checkout.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {deliveryMethods.map((method, index) => (
                  <div key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ flex: 2 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Method Name</label>
                      <input 
                        className="input-field" 
                        value={method.name} 
                        onChange={(e) => handleUpdateMethod(method.id, 'name', e.target.value)}
                        placeholder="e.g. Inside Dhaka"
                        style={{ background: '#fff' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Charge (BDT)</label>
                      <input 
                        type="number"
                        className="input-field" 
                        value={method.charge} 
                        onChange={(e) => handleUpdateMethod(method.id, 'charge', Number(e.target.value))}
                        placeholder="60"
                        style={{ background: '#fff' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '60px' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleRemoveMethod(method.id)}
                        style={{ padding: '0.6rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}
                        title="Remove Method"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {deliveryMethods.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: '#f9fafb', borderRadius: '8px' }}>
                    No delivery methods configured.
                  </div>
                )}
                <button 
                  className="btn btn-secondary" 
                  onClick={handleAddMethod}
                  style={{ width: 'fit-content', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff' }}
                >
                  <Plus size={18} /> Add Delivery Method
                </button>
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <Navigation size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Header Menu Navigation</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Configure the dynamic menu items shown in the storefront header.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {headerMenu.map((item, index) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ cursor: 'grab', color: '#9ca3af' }}>
                      <GripVertical size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Label</label>
                      <input 
                        className="input-field" 
                        value={item.label} 
                        onChange={(e) => handleUpdateMenuItem(item.id, 'label', e.target.value)}
                        placeholder="e.g. Home"
                        style={{ background: '#fff' }}
                      />
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>URL Path</label>
                      <input 
                        className="input-field" 
                        value={item.url} 
                        onChange={(e) => handleUpdateMenuItem(item.id, 'url', e.target.value)}
                        placeholder="/shop"
                        style={{ background: '#fff' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Icon</label>
                      <select 
                        className="input-field" 
                        value={item.icon} 
                        onChange={(e) => handleUpdateMenuItem(item.id, 'icon', e.target.value)}
                        style={{ background: '#fff' }}
                      >
                        <option value="">No Icon</option>
                        {availableIcons.map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '60px' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleRemoveMenuItem(item.id)}
                        style={{ padding: '0.6rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}
                        title="Remove Menu Item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {headerMenu.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: '#f9fafb', borderRadius: '8px' }}>
                    No menu items configured.
                  </div>
                )}
                <button className="btn btn-secondary" onClick={handleAddMenuItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Add Menu Item
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <SettingsIcon size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Marketing & Tracking</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Configure Google Tag Manager and Facebook Pixel for analytics and conversions tracking.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Google Tag Manager ID</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. GTM-XXXXXXX" 
                    value={trackingSettings.gtmId || ''} 
                    onChange={e => setTrackingSettings({...trackingSettings, gtmId: e.target.value})} 
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Leave blank to disable GTM.</span>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Facebook Pixel ID</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. 1234567890" 
                    value={trackingSettings.fbPixelId || ''} 
                    onChange={e => setTrackingSettings({...trackingSettings, fbPixelId: e.target.value})} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Facebook Conversions API (CAPI) Access Token</label>
                  <textarea 
                    className="input-field" 
                    rows="3" 
                    placeholder="Paste your long access token here..." 
                    value={trackingSettings.fbCapiToken || ''} 
                    onChange={e => setTrackingSettings({...trackingSettings, fbCapiToken: e.target.value})} 
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Required for Server-Side Tracking. Generate this in Events Manager {'>'} Settings {'>'} Conversions API.
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Facebook Test Event Code (Optional)</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. TEST12345" 
                    style={{ width: '100%' }}
                    value={trackingSettings.fbTestEventCode || ''} 
                    onChange={e => setTrackingSettings({...trackingSettings, fbTestEventCode: e.target.value})} 
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Used for debugging CAPI events in Events Manager. Remove this in production.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courier' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <Truck size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pathao Courier API</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Configure Pathao API credentials to enable one-click consignment dispatch and live tracking.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '800px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Client ID</label>
                  <input className="input-field" placeholder="e.g. 1234" value={pathaoSettings.clientId || ''} onChange={e => setPathaoSettings({...pathaoSettings, clientId: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Client Secret</label>
                  <input className="input-field" type="password" placeholder="e.g. jx8s...9s1" value={pathaoSettings.clientSecret || ''} onChange={e => setPathaoSettings({...pathaoSettings, clientSecret: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
                  <input className="input-field" placeholder="email@example.com" value={pathaoSettings.username || ''} onChange={e => setPathaoSettings({...pathaoSettings, username: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                  <input className="input-field" type="password" placeholder="Password" value={pathaoSettings.password || ''} onChange={e => setPathaoSettings({...pathaoSettings, password: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Store ID</label>
                  <input className="input-field" placeholder="e.g. 54321" value={pathaoSettings.storeId || ''} onChange={e => setPathaoSettings({...pathaoSettings, storeId: e.target.value})} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Base URL</label>
                  <input className="input-field" placeholder="https://api-hermes.pathao.com" value={pathaoSettings.baseUrl || 'https://api-hermes.pathao.com'} onChange={e => setPathaoSettings({...pathaoSettings, baseUrl: e.target.value})} style={{ width: '100%' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Use Pathao's official live or sandbox URL.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        <MediaPickerModal 
          isOpen={!!pickerType} 
          onClose={() => setPickerType(null)} 
          multiSelect={false}
          onSelect={(selection) => {
            if (pickerType?.startsWith('hero_')) {
              const id = pickerType.split('_')[1];
              handleUpdateBanner(id, 'image', selection);
            } else if (pickerType?.startsWith('promo_')) {
              const id = pickerType.split('_')[1];
              handleUpdatePromoBanner(id, 'image', selection);
            }
            setPickerType(null);
          }}
        />
      </div>
  );
};

export default AdminSettings;
