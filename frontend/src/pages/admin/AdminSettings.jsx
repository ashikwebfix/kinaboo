import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Truck, Plus, Trash2, Save, Navigation, GripVertical, LayoutTemplate, Image as ImageIcon, Tag, Box, Star, X, XCircle, Sparkles, Layers, Eye, EyeOff, Check, Flame } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MediaPickerModal from '../../components/MediaPickerModal';
import StorefrontBuilder from './StorefrontBuilder';

const generateInitialLayout = (data) => {
  if (data.layout) return data.layout; // Already migrated
  const layout = [];
  
  layout.push({ id: `hero-${Date.now()}`, type: 'hero', active: true, data: { heroType: data.heroType || 'multi', singleHeroImage: data.singleHeroImage, singleHeroLink: data.singleHeroLink, heroBanners: data.heroBanners || [], promotionalBanners: data.promotionalBanners || [] } });
  layout.push({ id: `trust-${Date.now()}`, type: 'trust_badges', active: true, data: { trustBadges: data.trustBadges || [] } });
  
  if (data.popularCategories) layout.push({ id: `popular-${Date.now()}`, type: 'popular_categories', active: data.popularCategories.enabled !== false, data: data.popularCategories });
  if (data.superHourDeals) layout.push({ id: `super-${Date.now()}`, type: 'super_hour', active: true, data: data.superHourDeals });
  if (data.editorialShowcase) layout.push({ id: `editorial-${Date.now()}`, type: 'editorial', active: data.editorialShowcase.enabled !== false, data: data.editorialShowcase });
  if (data.dealsSection) layout.push({ id: `deals-${Date.now()}`, type: 'deals', active: data.dealsSection.enabled !== false, data: data.dealsSection });
  if (data.featuredProducts) layout.push({ id: `featured-${Date.now()}`, type: 'featured', active: true, data: data.featuredProducts });
  if (data.promoBentoShowcase) layout.push({ id: `bento-${Date.now()}`, type: 'promo_bento', active: data.promoBentoShowcase.enabled !== false, data: data.promoBentoShowcase });
  if (data.trendingProducts) layout.push({ id: `trending-${Date.now()}`, type: 'trending', active: data.trendingProducts.enabled !== false, data: data.trendingProducts });
  
  if (data.customSections && data.customSections.length > 0) {
    data.customSections.forEach((sec, i) => layout.push({ id: `custom-${Date.now()}-${i}`, type: 'custom', active: true, data: sec }));
  }
  
  return layout;
};

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
  const [dealsProductSearch, setDealsProductSearch] = useState('');
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
        if (storefrontData) {
          storefrontData.layout = generateInitialLayout(storefrontData);
          setStorefrontUI(storefrontData);
        }
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

  const handleAddBanner = () => setStorefrontUI(prev => ({ ...prev, heroBanners: [...(prev.heroBanners || []), { id: Date.now().toString(), image: '', title: '', subtitle: '', link: '/' }] }));
  const handleUpdateBanner = (id, field, value) => setStorefrontUI(prev => ({ ...prev, heroBanners: (prev.heroBanners || []).map(b => String(b.id) === String(id) ? { ...b, [field]: value } : b) }));
  const handleRemoveBanner = (id) => setStorefrontUI(prev => ({ ...prev, heroBanners: (prev.heroBanners || []).filter(b => String(b.id) !== String(id)) }));

  const handleAddPromoBanner = () => setStorefrontUI(prev => ({ ...prev, promotionalBanners: [...(prev.promotionalBanners || []), { id: Date.now().toString(), image: '', title: '', link: '/' }] }));
  const handleUpdatePromoBanner = (id, field, value) => setStorefrontUI(prev => ({ ...prev, promotionalBanners: (prev.promotionalBanners || []).map(b => String(b.id) === String(id) ? { ...b, [field]: value } : b) }));
  const handleRemovePromoBanner = (id) => setStorefrontUI(prev => ({ ...prev, promotionalBanners: (prev.promotionalBanners || []).filter(b => String(b.id) !== String(id)) }));


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
      items: (prev.popularCategories?.items || []).map(item => String(item.id) === String(id) ? { ...item, [field]: value } : item)
    }
  }));

  const handleRemovePopularCategory = (id) => setStorefrontUI(prev => ({
    ...prev,
    popularCategories: {
      ...(prev.popularCategories || {}),
      items: (prev.popularCategories?.items || []).filter(item => String(item.id) !== String(id))
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
            
            <StorefrontBuilder 
              layout={storefrontUI.layout || []} 
              onChange={layout => setStorefrontUI(prev => ({...prev, layout}))}
              setPickerType={setPickerType}
              allProducts={allProducts}
              allCategories={allCategories}
            />
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
          } else if (pickerType?.startsWith('promo_bento_')) {
            const cardKey = pickerType.replace('promo_bento_', '');
            setStorefrontUI(prev => ({
              ...prev,
              promoBentoShowcase: {
                ...(prev.promoBentoShowcase || {}),
                [cardKey]: selection
              }
            }));
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
