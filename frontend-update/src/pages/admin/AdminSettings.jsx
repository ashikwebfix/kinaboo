import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Truck, Plus, Trash2, Save, Navigation, GripVertical, LayoutTemplate, Image as ImageIcon, Tag, Box, Star, X, XCircle, Sparkles, Layers, Eye, EyeOff, Check, Flame } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MediaPickerModal from '../../components/MediaPickerModal';

const AdminSettings = () => {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [headerMenu, setHeaderMenu] = useState([]);
  const [trackingSettings, setTrackingSettings] = useState({ gtmId: '', fbPixelId: '', fbCapiToken: '', fbTestEventCode: '' });
  const [pathaoSettings, setPathaoSettings] = useState({ clientId: '', clientSecret: '', username: '', password: '', storeId: '', baseUrl: 'https://api-hermes.pathao.com' });
  const [generalSettings, setGeneralSettings] = useState({ maintenanceMode: false, maintenanceMessage: 'Site is under maintenance. We will be right back.' });
  const [storefrontUI, setStorefrontUI] = useState({
    heroType: 'multi', singleHeroImage: '', singleHeroLink: '',
    heroBanners: [], promotionalBanners: [], trustBadges: [], superHourDeals: { productIds: [], endTime: '' },
    featuredProducts: { title: '', productIds: [] }, customSections: [],
    editorialShowcase: {
      enabled: true,
      title: 'Elevate Your Style With Bold Fashion',
      centerBtnText: 'Explore Collections',
      centerBtnLink: '/shop?category=Fashion',
      card1Img: '', card1Link: '/shop?category=Fashion',
      card2Img: '', card2Link: '/shop?category=Fashion',
      card3Img: '', card3Link: '/shop?category=Fashion',
      card4Img: '', card4Link: '/shop',
      card5Img: '', card5Link: '/shop?category=Fashion',
      card6Img: '', card6Link: '/shop?category=Fashion',
      card7Img: '', card7Link: '/shop?category=Fashion'
    },
    promoBentoShowcase: {
      enabled: true,
      card1Img: '', card1Link: '/shop?category=Electronics',
      card2Img: '', card2Link: '/shop?category=Groceries',
      card3Img: '', card3Link: '/shop?category=Groceries',
      card4Img: '', card4Link: '/shop?category=Health+%26+Beauty'
    }
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
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/delivery_methods', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDeliveryMethods(data);

      const menuRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/header_menu', { headers: { Authorization: `Bearer ${token}` } });
      const menuData = await menuRes.json();
      setHeaderMenu(menuData);

      const trackingRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/tracking_settings', { headers: { Authorization: `Bearer ${token}` } });
      if (trackingRes.ok) {
        const trackingData = await trackingRes.json();
        if (trackingData) setTrackingSettings(trackingData);
      }

      const storefrontRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/storefront_ui', { headers: { Authorization: `Bearer ${token}` } });
      if (storefrontRes.ok) {
        const storefrontData = await storefrontRes.json();
        if (storefrontData) setStorefrontUI(storefrontData);
      }

      const pathaoRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/pathao_settings', { headers: { Authorization: `Bearer ${token}` } });
      if (pathaoRes.ok) {
        const pathaoData = await pathaoRes.json();
        if (pathaoData) setPathaoSettings(pathaoData);
      }

      const generalRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/general_settings', { headers: { Authorization: `Bearer ${token}` } });
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

  const toggleDealsCategory = (categoryName) => setStorefrontUI(prev => {
    const current = prev.dealsCategories || [];
    const updated = current.includes(categoryName)
      ? current.filter(c => c !== categoryName)
      : [...current, categoryName];
    return { ...prev, dealsCategories: updated };
  });

  const toggleDealsProduct = (productId) => setStorefrontUI(prev => {
    const current = prev.dealsSection?.productIds || [];
    const updated = current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId];
    return {
      ...prev,
      dealsSection: {
        ...(prev.dealsSection || {}),
        productIds: updated
      }
    };
  });

  const toggleTrendingProduct = (productId) => setStorefrontUI(prev => {
    const current = prev.trendingProducts?.productIds || [];
    const updated = current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId];
    return {
      ...prev,
      trendingProducts: {
        ...(prev.trendingProducts || {}),
        productIds: updated
      }
    };
  });

  const handleAddPopularCategory = () => setStorefrontUI(prev => ({
    ...prev,
    popularCategories: {
      ...(prev.popularCategories || {}),
      items: [
        ...((prev.popularCategories?.items) || []),
        { id: Date.now().toString(), name: '', image: '', link: '' }
      ]
    }
  }));

  const handleUpdatePopularCategory = (id, field, value) => setStorefrontUI(prev => ({
    ...prev,
    popularCategories: {
      ...(prev.popularCategories || {}),
      items: (prev.popularCategories?.items || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }
  }));

  const handleRemovePopularCategory = (id) => setStorefrontUI(prev => ({
    ...prev,
    popularCategories: {
      ...(prev.popularCategories || {}),
      items: (prev.popularCategories?.items || []).filter(item => item.id !== id)
    }
  }));

  const togglePopularCategorySelect = (categoryName) => setStorefrontUI(prev => {
    const current = prev.popularCategories?.selectedCategoryNames || [];
    const updated = current.includes(categoryName)
      ? current.filter(c => c !== categoryName)
      : [...current, categoryName];
    return {
      ...prev,
      popularCategories: {
        ...(prev.popularCategories || {}),
        selectedCategoryNames: updated
      }
    };
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
                      value={generalSettings.maintenanceMessage || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMessage: e.target.value })}
                      style={{ width: '100%', background: '#fff' }}
                    />
                  </div>
                )}
              </div>

              {/* Top Announcement Bar Settings */}
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      Top Announcement Bar (শীর্ষ ঘোষণা বার)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
                      হেডারের উপরের অফার বা নোটিফিকেশন বারটি কাস্টমাইজ করুন।
                    </p>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      style={{ display: 'none' }}
                      checked={generalSettings.showAnnouncementBar !== false}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, showAnnouncementBar: e.target.checked })}
                    />
                    <div style={{ width: '44px', height: '24px', background: generalSettings.showAnnouncementBar !== false ? 'var(--accent-primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                      <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: generalSettings.showAnnouncementBar !== false ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {generalSettings.showAnnouncementBar !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </div>

                {generalSettings.showAnnouncementBar !== false && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Offer Badge Text</label>
                        <input
                          className="input-field"
                          placeholder="FLASH SALE"
                          value={generalSettings.announcementBadge || ''}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, announcementBadge: e.target.value })}
                          style={{ width: '100%', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Announcement Offer Message</label>
                        <input
                          className="input-field"
                          placeholder="✨ Free Shipping on Orders Over ৳999 | Use Code: KINABOO"
                          value={generalSettings.announcementText || ''}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, announcementText: e.target.value })}
                          style={{ width: '100%', background: '#fff' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Track Order Button Label</label>
                        <input
                          className="input-field"
                          placeholder="Track Order"
                          value={generalSettings.trackOrderLabel || ''}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, trackOrderLabel: e.target.value })}
                          style={{ width: '100%', background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Help Center Button Label</label>
                        <input
                          className="input-field"
                          placeholder="Help Center"
                          value={generalSettings.helpCenterLabel || ''}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, helpCenterLabel: e.target.value })}
                          style={{ width: '100%', background: '#fff' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Store Profile & Contact Information */}
              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  Store Contact & Footer Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Brand / Store Name</label>
                    <input
                      className="input-field"
                      placeholder="Kinaboo"
                      value={generalSettings.siteName || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      style={{ width: '100%', background: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Store Bio / Footer About Text</label>
                    <textarea
                      className="input-field"
                      rows="2"
                      placeholder="আপনার পছন্দের সব পণ্য এক জায়গায়..."
                      value={generalSettings.storeBio || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, storeBio: e.target.value })}
                      style={{ width: '100%', background: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Hotline / Phone Number</label>
                      <input
                        className="input-field"
                        placeholder="০১৩৫৪-৫৫৭৪৭৭"
                        value={generalSettings.phone || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Support Email</label>
                      <input
                        className="input-field"
                        placeholder="support@kinaboo.com"
                        value={generalSettings.email || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Store Address</label>
                    <input
                      className="input-field"
                      placeholder="হাউস ৫৩, রোড ১১, গুলশান ২, ঢাকা-১২১২"
                      value={generalSettings.address || ''}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                      style={{ width: '100%', background: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Facebook Page URL</label>
                      <input
                        className="input-field"
                        placeholder="https://facebook.com/kinaboo"
                        value={generalSettings.facebook || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, facebook: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Instagram Profile URL</label>
                      <input
                        className="input-field"
                        placeholder="https://instagram.com/kinaboo"
                        value={generalSettings.instagram || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, instagram: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>YouTube Channel URL</label>
                      <input
                        className="input-field"
                        placeholder="https://youtube.com/@kinaboo"
                        value={generalSettings.youtube || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, youtube: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.9rem' }}>Twitter / X URL</label>
                      <input
                        className="input-field"
                        placeholder="https://twitter.com/kinaboo"
                        value={generalSettings.twitter || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, twitter: e.target.value })}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                </div>
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

            {/* Hero Section Layout Toggle */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutTemplate size={18} /> Hero Layout Style
              </h3>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="heroType"
                    checked={storefrontUI.heroType !== 'single'}
                    onChange={() => setStorefrontUI(prev => ({ ...prev, heroType: 'multi' }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Multi Image (Carousel + Promos)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="heroType"
                    checked={storefrontUI.heroType === 'single'}
                    onChange={() => setStorefrontUI(prev => ({ ...prev, heroType: 'single' }))}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Single Image (Full Width)</span>
                </label>
              </div>
            </div>

            {storefrontUI.heroType === 'single' && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={18} /> Single Hero Image
                </h3>
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '500px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Image</label>
                      {storefrontUI.singleHeroImage ? (
                        <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={storefrontUI.singleHeroImage} alt="Single Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setStorefrontUI(prev => ({ ...prev, singleHeroImage: '' }))} style={{ position: 'absolute', top: 4, right: 4, background: '#fff', borderRadius: '50%', padding: 4, border: 'none', cursor: 'pointer' }}><XCircle size={16} color="#ef4444" /></button>
                        </div>
                      ) : (
                        <button type="button" className="btn btn-secondary" onClick={() => setPickerType('single_hero')} style={{ width: '100%', height: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '2px dashed var(--border-color)', justifyContent: 'center' }}>
                          <ImageIcon size={18} /> Select Image
                        </button>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Link URL (Optional)</label>
                      <input className="input-field" value={storefrontUI.singleHeroLink || ''} onChange={(e) => setStorefrontUI(prev => ({ ...prev, singleHeroLink: e.target.value }))} placeholder="/shop" style={{ background: '#fff' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Hero Banners */}
            {storefrontUI.heroType !== 'single' && (
              <>
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
                                <button type="button" onClick={() => handleUpdateBanner(banner.id, 'image', '')} style={{ position: 'absolute', top: 4, right: 4, background: '#fff', borderRadius: '50%', padding: 4, border: 'none', cursor: 'pointer' }}><XCircle size={16} color="#ef4444" /></button>
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
                                <button type="button" onClick={() => handleUpdatePromoBanner(banner.id, 'image', '')} style={{ position: 'absolute', top: 4, right: 4, background: '#fff', borderRadius: '50%', padding: 4, border: 'none', cursor: 'pointer' }}><XCircle size={16} color="#ef4444" /></button>
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
              </>
            )}

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

            {/* Explore Popular Categories Story Circle Manager */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Layers size={18} color="var(--accent-primary)" /> Explore Popular Categories (জনপ্রিয় ক্যাটাগরি সার্কেল)
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    style={{ display: 'none' }}
                    checked={storefrontUI.popularCategories?.enabled !== false}
                    onChange={(e) => setStorefrontUI(prev => ({
                      ...prev,
                      popularCategories: {
                        ...(prev.popularCategories || {}),
                        enabled: e.target.checked
                      }
                    }))}
                  />
                  <div style={{ width: '44px', height: '24px', background: storefrontUI.popularCategories?.enabled !== false ? 'var(--accent-primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: storefrontUI.popularCategories?.enabled !== false ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {storefrontUI.popularCategories?.enabled !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              {storefrontUI.popularCategories?.enabled !== false && (
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Title & View All */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Section Title</label>
                      <input
                        className="input-field"
                        value={storefrontUI.popularCategories?.title || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, popularCategories: { ...(prev.popularCategories || {}), title: e.target.value } }))}
                        placeholder="Explore Popular Categories"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Button Text</label>
                      <input
                        className="input-field"
                        value={storefrontUI.popularCategories?.viewAllText || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, popularCategories: { ...(prev.popularCategories || {}), viewAllText: e.target.value } }))}
                        placeholder="View All"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>View All Destination Link</label>
                      <input
                        className="input-field"
                        value={storefrontUI.popularCategories?.viewAllLink || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, popularCategories: { ...(prev.popularCategories || {}), viewAllLink: e.target.value } }))}
                        placeholder="/shop"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Quick Category Multi-Select */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                        Select Categories from Store (ক্যাটাগরি সিলেক্ট করুন)
                      </label>
                      {storefrontUI.popularCategories?.selectedCategoryNames?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setStorefrontUI(prev => ({ ...prev, popularCategories: { ...(prev.popularCategories || {}), selectedCategoryNames: [] } }))}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          রিসেট (সকল ক্যাটাগরি দেখান)
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      {allCategories.map(cat => {
                        const name = cat.name || cat.title;
                        const isSelected = storefrontUI.popularCategories?.selectedCategoryNames?.includes(name);
                        return (
                          <button
                            key={`pop-cat-select-${cat.id || name}`}
                            type="button"
                            onClick={() => togglePopularCategorySelect(name)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.85rem',
                              fontWeight: isSelected ? 700 : 500,
                              background: isSelected ? 'var(--accent-primary)' : '#f1f5f9',
                              color: isSelected ? '#ffffff' : '#334155',
                              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid #cbd5e1',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            {isSelected && <Check size={14} />}
                            <span>{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Category Items with Image Picker */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'block' }}>
                          Custom Category Circles & Images (কাস্টম সার্কেল ইমেজ ও লিংক)
                        </label>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Optional: Add custom images and custom display titles for your category story circles.
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddPopularCategory}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        <Plus size={15} /> Add Category Circle
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {(storefrontUI.popularCategories?.items || []).map((item, idx) => (
                        <div key={item.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-primary)', flexShrink: 0, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <ImageIcon size={18} color="#94a3b8" />
                            )}
                          </div>

                          <input
                            className="input-field"
                            value={item.name}
                            onChange={(e) => handleUpdatePopularCategory(item.id, 'name', e.target.value)}
                            placeholder="Category Name (e.g. Electronics)"
                            style={{ flex: '1.2', minWidth: '130px', fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
                          />

                          <div style={{ display: 'flex', gap: '0.35rem', flex: '2', minWidth: '200px' }}>
                            <input
                              className="input-field"
                              value={item.image}
                              onChange={(e) => handleUpdatePopularCategory(item.id, 'image', e.target.value)}
                              placeholder="Image URL"
                              style={{ flex: 1, fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setPickerType(`popular_cat_${item.id}`)}
                              style={{ padding: '0.45rem 0.65rem' }}
                              title="Pick from Media Library"
                            >
                              <ImageIcon size={15} />
                            </button>
                          </div>

                          <input
                            className="input-field"
                            value={item.link || ''}
                            onChange={(e) => handleUpdatePopularCategory(item.id, 'link', e.target.value)}
                            placeholder="/shop?category=Electronics"
                            style={{ flex: '1.5', minWidth: '150px', fontSize: '0.85rem', padding: '0.45rem 0.65rem' }}
                          />

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleRemovePopularCategory(item.id)}
                            style={{ padding: '0.45rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Super Hour Deals */}
            <div style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px dashed #f87171' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c' }}>
                ⚡ Super Hour Deals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>End Time</label>
                  <input type="datetime-local" className="input-field" value={storefrontUI.superHourDeals?.endTime ? new Date(storefrontUI.superHourDeals.endTime).toISOString().slice(0, 16) : ''} onChange={(e) => setStorefrontUI(prev => ({ ...prev, superHourDeals: { ...prev.superHourDeals, endTime: new Date(e.target.value).toISOString() } }))} style={{ background: '#fff', maxWidth: '300px' }} />
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

                {/* Slider Mode Toggle (Left & Right Slides) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1f2937' }}>Dual-Direction Product Slider</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>One row slides from right and one row slides from left with hover-to-pause.</div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={storefrontUI.featuredProducts?.sliderEnabled !== false}
                      onChange={(e) => setStorefrontUI(prev => ({
                        ...prev,
                        featuredProducts: {
                          ...(prev.featuredProducts || {}),
                          sliderEnabled: e.target.checked
                        }
                      }))}
                    />
                    <span style={{ color: storefrontUI.featuredProducts?.sliderEnabled !== false ? 'var(--accent-primary)' : '#6b7280' }}>
                      {storefrontUI.featuredProducts?.sliderEnabled !== false ? 'Slide Animation ON' : 'Grid Mode (OFF)'}
                    </span>
                  </label>
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

            {/* Trending / New Arrival Products Showcase (After Bento Banners) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Sparkles size={18} color="var(--accent-primary)" /> New Arrivals / Trending Products (বেন্টো ব্যানারের পরের প্রডাক্ট সেকশন)
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    style={{ display: 'none' }}
                    checked={storefrontUI.trendingProducts?.enabled !== false}
                    onChange={(e) => setStorefrontUI(prev => ({
                      ...prev,
                      trendingProducts: {
                        ...(prev.trendingProducts || {}),
                        enabled: e.target.checked
                      }
                    }))}
                  />
                  <div style={{ width: '44px', height: '24px', background: storefrontUI.trendingProducts?.enabled !== false ? 'var(--accent-primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: storefrontUI.trendingProducts?.enabled !== false ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {storefrontUI.trendingProducts?.enabled !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              {storefrontUI.trendingProducts?.enabled !== false && (
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Section Title</label>
                      <input
                        className="input-field"
                        value={storefrontUI.trendingProducts?.title || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, trendingProducts: { ...(prev.trendingProducts || {}), title: e.target.value } }))}
                        placeholder="নতুন কালেকশন"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Category Filter</label>
                      <select
                        className="input-field"
                        value={storefrontUI.trendingProducts?.category || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, trendingProducts: { ...(prev.trendingProducts || {}), category: e.target.value } }))}
                        style={{ width: '100%', background: '#fff' }}
                      >
                        <option value="">All Categories (সকল ক্যাটাগরি)</option>
                        {allCategories.map(cat => {
                          const name = cat.name || cat.title;
                          return <option key={`trend-cat-${cat.id || name}`} value={name}>{name}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Button Text</label>
                      <input
                        className="input-field"
                        value={storefrontUI.trendingProducts?.buttonText || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, trendingProducts: { ...(prev.trendingProducts || {}), buttonText: e.target.value } }))}
                        placeholder="সব দেখুন"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Max Limit</label>
                      <input
                        type="number"
                        className="input-field"
                        value={storefrontUI.trendingProducts?.limit || 8}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, trendingProducts: { ...(prev.trendingProducts || {}), limit: Number(e.target.value) } }))}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1f2937' }}>Display Mode</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Choose between standard 4-column grid or dual-direction step slider.</div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={storefrontUI.trendingProducts?.sliderEnabled === true}
                        onChange={(e) => setStorefrontUI(prev => ({
                          ...prev,
                          trendingProducts: {
                            ...(prev.trendingProducts || {}),
                            sliderEnabled: e.target.checked
                          }
                        }))}
                      />
                      <span style={{ color: storefrontUI.trendingProducts?.sliderEnabled ? 'var(--accent-primary)' : '#6b7280' }}>
                        {storefrontUI.trendingProducts?.sliderEnabled ? 'Slide Animation ON' : 'Grid Mode (Standard)'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Select Specific Products (Optional)</label>
                      {storefrontUI.trendingProducts?.productIds?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setStorefrontUI(prev => ({ ...prev, trendingProducts: { ...(prev.trendingProducts || {}), productIds: [] } }))}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          রিসেট (সকল সাম্প্রতিক পণ্য)
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      {allProducts.map(product => (
                        <label key={`trend-admin-${product.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={storefrontUI.trendingProducts?.productIds?.includes(product.id) || false} onChange={() => toggleTrendingProduct(product.id)} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deals You Can't Miss Section & Category Filter Manager */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Flame size={18} color="#f97316" /> Deals You Can't Miss (ক্যাটাগরি ডিলস সেকশন)
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    style={{ display: 'none' }}
                    checked={storefrontUI.dealsSection?.enabled !== false}
                    onChange={(e) => setStorefrontUI(prev => ({
                      ...prev,
                      dealsSection: {
                        ...(prev.dealsSection || {}),
                        enabled: e.target.checked
                      }
                    }))}
                  />
                  <div style={{ width: '44px', height: '24px', background: storefrontUI.dealsSection?.enabled !== false ? 'var(--accent-primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: storefrontUI.dealsSection?.enabled !== false ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {storefrontUI.dealsSection?.enabled !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              {storefrontUI.dealsSection?.enabled !== false && (
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Title, Subtitle, Button Text & Limit */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Section Title</label>
                      <input
                        className="input-field"
                        value={storefrontUI.dealsSection?.title || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, dealsSection: { ...(prev.dealsSection || {}), title: e.target.value } }))}
                        placeholder="🔥 Deals You Can't Miss"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Section Subtitle</label>
                      <input
                        className="input-field"
                        value={storefrontUI.dealsSection?.subtitle || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, dealsSection: { ...(prev.dealsSection || {}), subtitle: e.target.value } }))}
                        placeholder="ক্যাটাগরি ভিত্তিক আকর্ষণীয় ছাড় ও সেরা হট ডিলসসমূহ"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>View All Text</label>
                      <input
                        className="input-field"
                        value={storefrontUI.dealsSection?.viewAllText || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, dealsSection: { ...(prev.dealsSection || {}), viewAllText: e.target.value } }))}
                        placeholder="সব দেখুন"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Max Limit</label>
                      <input
                        type="number"
                        className="input-field"
                        value={storefrontUI.dealsSection?.limit || 8}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, dealsSection: { ...(prev.dealsSection || {}), limit: Number(e.target.value) } }))}
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* 1. Category Tabs Selection */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        1. Select Category Tabs to Show (ক্যাটাগরি ট্যাব ফিল্টার)
                      </label>
                      {storefrontUI.dealsCategories && storefrontUI.dealsCategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setStorefrontUI(prev => ({ ...prev, dealsCategories: [] }))}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          রিসেট (অটোমেটিক সকল ক্যাটাগরি)
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      কোন কোন ক্যাটাগরি ট্যাবে দেখাতে চান তা টিক দিন। (কিছুই সিলেক্ট না করলে অটোমেটিক সকল সক্রিয় ক্যাটাগরি দেখাবে)।
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem', maxHeight: '160px', overflowY: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      {allCategories.map(cat => {
                        const catName = cat.name || cat.title;
                        const isSelected = storefrontUI.dealsCategories?.includes(catName) || false;
                        return (
                          <label key={`deal-cat-${cat.id || catName}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDealsCategory(catName)}
                            />
                            <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                              {catName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Specific Products Assignment */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        2. Assign Specific Deals Products (নির্দিষ্ট ডিলস পণ্য নির্ধারণ)
                      </label>
                      {storefrontUI.dealsSection?.productIds && storefrontUI.dealsSection.productIds.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                            {storefrontUI.dealsSection.productIds.length} টি নির্দিষ্ট পণ্য সিলেক্ট করা আছে
                          </span>
                          <button
                            type="button"
                            onClick={() => setStorefrontUI(prev => ({ ...prev, dealsSection: { ...(prev.dealsSection || {}), productIds: [] } }))}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            রিসেট (সকল পণ্য থেকে ক্যাটাগরি ফিল্টার)
                          </button>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      আপনি চাইলে নির্দিষ্ট কিছু পণ্যকে ডিলস সেকশনে দেখানোর জন্য টিক দিতে পারেন। কোনো পণ্য সিলেক্ট না থাকলে আপনার সকল পণ্য থেকে অটোমেটিক ক্যাটাগরি অনুযায়ী পণ্য প্রদর্শিত হবে।
                    </p>

                    <div style={{ marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="পণ্য খুঁজুন..."
                        value={dealsProductSearch}
                        onChange={(e) => setDealsProductSearch(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '100%', background: '#fff' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem', maxHeight: '190px', overflowY: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      {allProducts
                        .filter(p => !dealsProductSearch || p.name.toLowerCase().includes(dealsProductSearch.toLowerCase()) || p.category?.toLowerCase().includes(dealsProductSearch.toLowerCase()))
                        .map(product => {
                          const isSelected = storefrontUI.dealsSection?.productIds?.includes(product.id) || false;
                          return (
                            <label key={`deal-prod-${product.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', background: isSelected ? '#fff7ed' : 'transparent', padding: '0.25rem 0.4rem', borderRadius: '4px' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleDealsProduct(product.id)}
                              />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                                {product.name} ({product.category || 'General'})
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Marketing Showcase Banner */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Sparkles size={18} color="var(--accent-primary)" /> Marketing Showcase Banner (মার্কেটিং ব্যানার)
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    style={{ display: 'none' }}
                    checked={storefrontUI.marketingBanner?.enabled !== false}
                    onChange={(e) => setStorefrontUI(prev => ({
                      ...prev,
                      marketingBanner: {
                        ...(prev.marketingBanner || {}),
                        enabled: e.target.checked
                      }
                    }))}
                  />
                  <div style={{ width: '44px', height: '24px', background: storefrontUI.marketingBanner?.enabled !== false ? 'var(--accent-primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: storefrontUI.marketingBanner?.enabled !== false ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {storefrontUI.marketingBanner?.enabled !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              {storefrontUI.marketingBanner?.enabled !== false && (
                <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Badge, Title & Description */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Badge Text (ট্যাগলাইন ব্যাজ)</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.badgeText || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), badgeText: e.target.value } }))}
                        placeholder="KINABOO EXCLUSIVE"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Main Title (প্রধান শিরোনাম)</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.title || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), title: e.target.value } }))}
                        placeholder="Upgrade Your Lifestyle With Premium Gadgets"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Short Description (বিবরণ)</label>
                    <textarea
                      className="input-field"
                      rows="2"
                      value={storefrontUI.marketingBanner?.description || ''}
                      onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), description: e.target.value } }))}
                      placeholder="১০০% অথেনটিক গ্যাজেট, লাইফস্টাইল ও ট্রেন্ডি টেক পণ্য সারা দেশে দ্রুততম ক্যাশ অন ডেলিভারিতে।"
                      style={{ width: '100%', background: '#fff', resize: 'vertical' }}
                    />
                  </div>

                  {/* Image & Target Link */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Showcase Image (পণ্য ইমেজ)</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {storefrontUI.marketingBanner?.image && (
                          <img
                            src={storefrontUI.marketingBanner.image}
                            alt="Preview"
                            style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#fff' }}
                          />
                        )}
                        <input
                          className="input-field"
                          value={storefrontUI.marketingBanner?.image || ''}
                          onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), image: e.target.value } }))}
                          placeholder="/marketing_products_clean.png"
                          style={{ flex: 1, background: '#fff' }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setPickerType('marketing_banner')}
                          style={{ padding: '0.5rem 0.75rem', background: '#fff' }}
                          title="মিডিয়া লাইব্রেরি থেকে ইমেজ সিলেক্ট করুন"
                        >
                          <ImageIcon size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Target Link URL (ক্লিক লিংক)</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.link || '/shop'}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), link: e.target.value } }))}
                        placeholder="/shop"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Button Text & Tagline */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Button CTA Text (বাটন টেক্সট)</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.buttonText || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), buttonText: e.target.value } }))}
                        placeholder="Shop Now"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Tagline / Categories Subtitle</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.tagline || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), tagline: e.target.value } }))}
                        placeholder="Gaming • Components • Accessories"
                        style={{ width: '100%', background: '#fff' }}
                      />
                    </div>
                  </div>

                  {/* Perks */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>Perk 1</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.perk1 || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), perk1: e.target.value } }))}
                        placeholder="১০০% অরিজিনাল"
                        style={{ width: '100%', background: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>Perk 2</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.perk2 || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), perk2: e.target.value } }))}
                        placeholder="ক্যাশ অন ডেলিভারি"
                        style={{ width: '100%', background: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem' }}>Perk 3</label>
                      <input
                        className="input-field"
                        value={storefrontUI.marketingBanner?.perk3 || ''}
                        onChange={(e) => setStorefrontUI(prev => ({ ...prev, marketingBanner: { ...(prev.marketingBanner || {}), perk3: e.target.value } }))}
                        placeholder="সহজ রিটার্ন"
                        style={{ width: '100%', background: '#fff', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}
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
                      <input type="number" className="input-field" value={section.limit || 8} onChange={(e) => handleUpdateCustomSection(section.id, 'limit', Number(e.target.value))} min="1" max="30" style={{ background: '#fff' }} />
                    </div>
                    <div style={{ flex: 1.2 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>Display Style</label>
                      <select
                        className="input-field"
                        value={section.displayMode || 'slideshow'}
                        onChange={(e) => handleUpdateCustomSection(section.id, 'displayMode', e.target.value)}
                        style={{ background: '#fff' }}
                      >
                        <option value="slideshow">Smooth Slideshow</option>
                        <option value="grid">Standard Grid</option>
                      </select>
                    </div>
                    <button className="btn btn-secondary" onClick={() => handleRemoveCustomSection(section.id)} style={{ padding: '0.65rem', color: '#ef4444', borderColor: 'transparent', background: 'rgba(239, 68, 68, 0.1)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {storefrontUI.customSections?.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: '#f9fafb', borderRadius: '8px' }}>
                    No custom sections added yet. Click "+ Add Custom Section" below to create one.
                  </div>
                )}
                <button className="btn btn-secondary" onClick={handleAddCustomSection} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Add Custom Section
                </button>
              </div>
            </div>

            {/* 5. Editorial Fashion Showcase Section */}
            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Sparkles size={18} color="var(--accent-primary)" /> Editorial Fashion Showcase
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={storefrontUI.editorialShowcase?.enabled !== false}
                    onChange={(e) => setStorefrontUI(prev => ({
                      ...prev,
                      editorialShowcase: {
                        ...(prev.editorialShowcase || {}),
                        enabled: e.target.checked
                      }
                    }))}
                  />
                  <span>{storefrontUI.editorialShowcase?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Section Title</label>
                    <input
                      className="input-field"
                      value={storefrontUI.editorialShowcase?.title || ''}
                      onChange={(e) => setStorefrontUI(prev => ({
                        ...prev,
                        editorialShowcase: { ...(prev.editorialShowcase || {}), title: e.target.value }
                      }))}
                      placeholder="Elevate Your Style With Bold Fashion"
                      style={{ background: '#fff', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Center Button Text</label>
                    <input
                      className="input-field"
                      value={storefrontUI.editorialShowcase?.centerBtnText || ''}
                      onChange={(e) => setStorefrontUI(prev => ({
                        ...prev,
                        editorialShowcase: { ...(prev.editorialShowcase || {}), centerBtnText: e.target.value }
                      }))}
                      placeholder="Explore Collections"
                      style={{ background: '#fff', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Center Button Link</label>
                    <input
                      className="input-field"
                      value={storefrontUI.editorialShowcase?.centerBtnLink || ''}
                      onChange={(e) => setStorefrontUI(prev => ({
                        ...prev,
                        editorialShowcase: { ...(prev.editorialShowcase || {}), centerBtnLink: e.target.value }
                      }))}
                      placeholder="/shop?category=Fashion"
                      style={{ background: '#fff', width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Collage Images & Links (7 Cards)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {[
                      { num: 1, label: 'Col 1 Top (Arch Tall)', defaultImg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
                      { num: 2, label: 'Col 1 Bottom (Rounded)', defaultImg: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800' },
                      { num: 3, label: 'Col 2 (Tall Left)', defaultImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800' },
                      { num: 4, label: 'Col 3 (Center Square)', defaultImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800' },
                      { num: 5, label: 'Col 4 (Tall Right)', defaultImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
                      { num: 6, label: 'Col 5 Top (Mint)', defaultImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
                      { num: 7, label: 'Col 5 Bottom (Forest)', defaultImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' }
                    ].map((item) => {
                      const imgKey = `card${item.num}Img`;
                      const linkKey = `card${item.num}Link`;
                      const currentImg = storefrontUI.editorialShowcase?.[imgKey] || item.defaultImg;
                      const currentLink = storefrontUI.editorialShowcase?.[linkKey] || '/shop?category=Fashion';

                      return (
                        <div key={item.num} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>Card {item.num}: {item.label}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#f3f4f6', flexShrink: 0, border: '1px solid #e5e7eb' }}>
                              <img src={currentImg} alt={`Card ${item.num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Img'; }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setPickerType(`editorial_${imgKey}`)}
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                              >
                                <ImageIcon size={13} /> Select Image
                              </button>
                              <input
                                className="input-field"
                                value={storefrontUI.editorialShowcase?.[imgKey] || ''}
                                onChange={(e) => setStorefrontUI(prev => ({
                                  ...prev,
                                  editorialShowcase: { ...(prev.editorialShowcase || {}), [imgKey]: e.target.value }
                                }))}
                                placeholder="Or paste image URL"
                                style={{ fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Click URL / Link</label>
                            <input
                              className="input-field"
                              value={storefrontUI.editorialShowcase?.[linkKey] || ''}
                              onChange={(e) => setStorefrontUI(prev => ({
                                ...prev,
                                editorialShowcase: { ...(prev.editorialShowcase || {}), [linkKey]: e.target.value }
                              }))}
                              placeholder="/shop?category=Fashion"
                              style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', width: '100%' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 7. Promotional Bento Banner Showcase (After Featured Products) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Layers size={18} color="var(--accent-primary)" /> Promotional Bento Showcase (After Featured Products)
                </h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={storefrontUI.promoBentoShowcase?.enabled !== false}
                    onChange={(e) => setStorefrontUI(prev => ({
                      ...prev,
                      promoBentoShowcase: {
                        ...(prev.promoBentoShowcase || {}),
                        enabled: e.target.checked
                      }
                    }))}
                  />
                  <span>{storefrontUI.promoBentoShowcase?.enabled !== false ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Configure the 3-column banner showcase placed directly after the Featured Products section.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {[
                    { key: 'card1', label: 'Card 1 (Left - Large Banner)', defaultImg: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800' },
                    { key: 'card2', label: 'Card 2 (Middle - Top Horizontal)', defaultImg: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800' },
                    { key: 'card3', label: 'Card 3 (Middle - Bottom Horizontal)', defaultImg: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800' },
                    { key: 'card4', label: 'Card 4 (Right - Tall Portrait)', defaultImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800' }
                  ].map((item) => {
                    const imgKey = `${item.key}Img`;
                    const linkKey = `${item.key}Link`;
                    const currentImg = storefrontUI.promoBentoShowcase?.[imgKey] || item.defaultImg;
                    const currentLink = storefrontUI.promoBentoShowcase?.[linkKey] || '/shop';

                    return (
                      <div key={item.key} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{item.label}</span>

                        <div style={{ width: '100%', height: '110px', borderRadius: '6px', overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                          <img src={currentImg} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>Image URL</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                              className="input-field"
                              value={storefrontUI.promoBentoShowcase?.[imgKey] || ''}
                              onChange={(e) => setStorefrontUI(prev => ({
                                ...prev,
                                promoBentoShowcase: { ...(prev.promoBentoShowcase || {}), [imgKey]: e.target.value }
                              }))}
                              placeholder="Paste URL or Pick Media"
                              style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                            />
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setPickerType(`promo_bento_${imgKey}`)}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            >
                              Pick
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginBottom: '0.25rem' }}>Redirect Link</label>
                          <input
                            className="input-field"
                            value={storefrontUI.promoBentoShowcase?.[linkKey] || ''}
                            onChange={(e) => setStorefrontUI(prev => ({
                              ...prev,
                              promoBentoShowcase: { ...(prev.promoBentoShowcase || {}), [linkKey]: e.target.value }
                            }))}
                            placeholder="/shop?category=Electronics"
                            style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  onChange={e => setTrackingSettings({ ...trackingSettings, gtmId: e.target.value })}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>Leave blank to disable GTM.</span>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Facebook Pixel ID</label>
                <input
                  className="input-field"
                  placeholder="e.g. 1234567890"
                  value={trackingSettings.fbPixelId || ''}
                  onChange={e => setTrackingSettings({ ...trackingSettings, fbPixelId: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Facebook Conversions API (CAPI) Access Token</label>
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Paste your long access token here..."
                  value={trackingSettings.fbCapiToken || ''}
                  onChange={e => setTrackingSettings({ ...trackingSettings, fbCapiToken: e.target.value })}
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
                  onChange={e => setTrackingSettings({ ...trackingSettings, fbTestEventCode: e.target.value })}
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
                <input className="input-field" placeholder="e.g. 1234" value={pathaoSettings.clientId || ''} onChange={e => setPathaoSettings({ ...pathaoSettings, clientId: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Client Secret</label>
                <input className="input-field" type="password" placeholder="e.g. jx8s...9s1" value={pathaoSettings.clientSecret || ''} onChange={e => setPathaoSettings({ ...pathaoSettings, clientSecret: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
                <input className="input-field" placeholder="email@example.com" value={pathaoSettings.username || ''} onChange={e => setPathaoSettings({ ...pathaoSettings, username: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                <input className="input-field" type="password" placeholder="Password" value={pathaoSettings.password || ''} onChange={e => setPathaoSettings({ ...pathaoSettings, password: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Store ID</label>
                <input className="input-field" placeholder="e.g. 54321" value={pathaoSettings.storeId || ''} onChange={e => setPathaoSettings({ ...pathaoSettings, storeId: e.target.value })} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Base URL</label>
                <input className="input-field" placeholder="https://api-hermes.pathao.com" value={pathaoSettings.baseUrl || 'https://api-hermes.pathao.com'} onChange={e => setPathaoSettings({ ...pathaoSettings, baseUrl: e.target.value })} style={{ width: '100%' }} />
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
          } else if (pickerType === 'single_hero') {
            setStorefrontUI(prev => ({ ...prev, singleHeroImage: selection }));
          } else if (pickerType?.startsWith('editorial_')) {
            const cardKey = pickerType.replace('editorial_', '');
            setStorefrontUI(prev => ({
              ...prev,
              editorialShowcase: {
                ...(prev.editorialShowcase || {}),
                [cardKey]: selection
              }
            }));
          } else if (pickerType?.startsWith('promo_bento_')) {
            const cardKey = pickerType.replace('promo_bento_', '');
            setStorefrontUI(prev => ({
              ...prev,
              promoBentoShowcase: {
                ...(prev.promoBentoShowcase || {}),
                [cardKey]: selection
              }
            }));
          } else if (pickerType === 'marketing_banner') {
            setStorefrontUI(prev => ({
              ...prev,
              marketingBanner: {
                ...(prev.marketingBanner || {}),
                image: selection
              }
            }));
          } else if (pickerType?.startsWith('popular_cat_')) {
            const id = pickerType.replace('popular_cat_', '');
            handleUpdatePopularCategory(id, 'image', selection);
          }
          setPickerType(null);
        }}
      />
    </div>
  );
};

export default AdminSettings;
