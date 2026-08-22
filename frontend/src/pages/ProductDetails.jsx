import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Star, ChevronDown, ChevronUp, X, Lock, HeadphonesIcon } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import ExpressCheckoutModal from '../components/ExpressCheckoutModal';
import { Helmet } from 'react-helmet-async';
import { trackViewContent } from '../utils/tracking';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [faqOpen, setFaqOpen] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [qbName, setQbName] = useState('');
  const [qbPhone, setQbPhone] = useState('');
  const [qbAddress, setQbAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  
  // Bundle States
  const [bundles, setBundles] = useState([]);
  const [comboBundle, setComboBundle] = useState(null);
  const [comboProducts, setComboProducts] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    // Reset state on ID change
    setLoading(true);
    setProduct(null);
    setMainImage('');
    setQty(1);
    setSelectedVariations({});
    setFaqOpen(null);
    
    if (userInfo) {
      setQbName(userInfo.name || '');
      setQbPhone(userInfo.phone || '');
      setQbAddress(userInfo.address || '');
    }
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${slug}`);
        if (!res.ok) {
          toast.error('Product not found');
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : (data.image || 'https://placehold.co/400x400?text=No+Image'));
        trackViewContent(data);

        // Initialize variations
        if (data.variations) {
          const initialVariations = {};
          data.variations.forEach(v => {
            if (v.options && v.options.length > 0) initialVariations[v.name] = v.options[0];
          });
          setSelectedVariations(initialVariations);
        }

        // Fetch related products (same category)
        const allRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const allData = await allRes.json();
        setRelatedProducts(allData.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4));

        // Fetch active bundles for this product
        const bundleRes = await fetch(`${import.meta.env.VITE_API_URL}/api/bundles/product/${data.id}`);
        if (bundleRes.ok) {
          const bundleData = await bundleRes.json();
          setBundles(bundleData);
          
          const cmbBundle = bundleData.find(b => b.type === 'combo');
          if (cmbBundle && cmbBundle.products) {
            setComboBundle(cmbBundle);
            const cProducts = allData.filter(p => cmbBundle.products.includes(p.id));
            setComboProducts(cProducts);
          }
        }

        // Fetch delivery methods
        const dmRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/delivery_methods');
        const dmData = await dmRes.json();
        setDeliveryMethods(dmData);
        if (dmData && dmData.length > 0) setSelectedMethodId(dmData[0].id);

      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    let bundleDiscount = 0;
    if (product.volumeBundles && product.volumeBundles.length > 0) {
      const sortedTiers = [...product.volumeBundles].sort((a, b) => b.qty - a.qty);
      const appliedTier = sortedTiers.find(t => qty >= t.qty);
      if (appliedTier) {
        const basePrice = Number(product.sellPrice || product.price);
        if (appliedTier.discountType === 'percentage') {
          bundleDiscount = (basePrice * appliedTier.discountValue) / 100;
        } else {
          bundleDiscount = appliedTier.discountValue / appliedTier.qty;
        }
      }
    }

    addToCart({ ...product, qty, selectedVariations, bundleDiscount: Number(bundleDiscount.toFixed(2)) });
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddBundleToCart = () => {
    if (!comboBundle || comboProducts.length === 0) return;
    
    // Calculate total original price
    const mainPrice = Number(product.sellPrice || product.price);
    const comboPrice = comboProducts.reduce((acc, p) => acc + Number(p.sellPrice || p.price), 0);
    const totalOriginalPrice = mainPrice + comboPrice;
    
    // Calculate discount amount
    let discountAmount = 0;
    if (comboBundle.discountType === 'percentage') {
      discountAmount = (totalOriginalPrice * comboBundle.discountValue) / 100;
    } else {
      discountAmount = comboBundle.discountValue;
    }
    
    // Calculate proportional discount for each item
    const discountRatio = discountAmount / totalOriginalPrice;
    
    const bundleCartIdSuffix = `_bundle_${Date.now()}`;
    const discountedMainProduct = {
      ...product,
      cartId: `${product.id}${bundleCartIdSuffix}`,
      bundleDiscount: Number((mainPrice * discountRatio).toFixed(2)),
      name: `${product.name} (Bundle Deal)`
    };
    addToCart(discountedMainProduct, 1);
    
    comboProducts.forEach(cp => {
      const pPrice = Number(cp.sellPrice || cp.price);
      const discountedCp = {
        ...cp,
        cartId: `${cp.id}${bundleCartIdSuffix}`,
        bundleDiscount: Number((pPrice * discountRatio).toFixed(2)),
        name: `${cp.name} (Bundle Deal)`
      };
      addToCart(discountedCp, 1);
    });
    
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    setIsQuickBuyOpen(true);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="text-muted">Loading product...</div></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="text-muted">Product not found.</div></div>;

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image || 'https://placehold.co/400x400?text=No+Image'];

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": imagesList,
    "description": product.description,
    "sku": product.sku || product.id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "BDT",
      "price": product.sellPrice || product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 || product.allowSellWithoutStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html || '';
    return tmp.textContent || tmp.innerText || "";
  };

  const getOgImage = () => {
    const siteUrl = window.location.origin;
    if (!mainImage || mainImage.includes('placehold.co')) {
      return `${siteUrl}/logo.svg`;
    }
    if (mainImage.startsWith('http')) {
      return mainImage;
    }
    return `${siteUrl}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
  };

  const ogDesc = stripHtml(product.description).substring(0, 200) + (product.description?.length > 200 ? '...' : '');

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <Helmet>
        <title>{product.name} | kinaboo.com</title>
        <meta name="description" content={ogDesc} />
        <meta property="og:title" content={`${product.name} | kinaboo.com`} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content={getOgImage()} />
        <meta property="og:image:alt" content={product.name} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>
      
      {/* Top Section: Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginTop: '2rem', marginBottom: '4rem' }}>
        
        {/* Left: Images */}
        <div>
          <div style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <img src={mainImage} alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {imagesList.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(img)}
                style={{ 
                  width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                  border: mainImage === img ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)'
                }}
              >
                <img src={img} alt={`Thumb ${idx}`} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div>
          {/* Reviews (Static CRO element) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', marginBottom: '1rem' }}>
            <Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} />
            <span className="text-muted" style={{ fontSize: '0.9rem', marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>(124 Reviews)</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', marginBottom: '1.5rem' }}>
            {product.sellPrice ? (
              <>
                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{Number(product.sellPrice).toFixed(2)} BDT</span>
                <span style={{ fontSize: '1.25rem', textDecoration: 'line-through', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{Number(product.price).toFixed(2)} BDT</span>
              </>
            ) : (
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{Number(product.price).toFixed(2)} BDT</span>
            )}
          </div>

          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {product.description}
          </p>

          {/* Keypoints */}
          {product.keypoints && product.keypoints.length > 0 && (
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              {product.keypoints.map((kp, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>{kp}</li>
              ))}
            </ul>
          )}

          {/* Variations */}
          {product.variations && product.variations.map((v, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>{v.name}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {v.options.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setSelectedVariations({...selectedVariations, [v.name]: opt})}
                    style={{
                      padding: '0.5rem 1.5rem',
                      borderRadius: '8px',
                      border: selectedVariations[v.name] === opt ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: selectedVariations[v.name] === opt ? 'rgba(37, 99, 235, 0.1)' : '#fff',
                      color: selectedVariations[v.name] === opt ? 'var(--accent-primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Volume Bundles (Quantity Discounts) */}
          {product.volumeBundles && product.volumeBundles.length > 0 ? (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '1rem', fontSize: '1.1rem' }}>পরিমাণ নির্বাচন করুন (Combo Offer)</label>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                
                {/* Default Buy 1 Row */}
                <label 
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '1rem', background: '#fff', borderRadius: '8px', 
                    border: qty === 1 ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                  }}
                >
                  {qty === 1 && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-primary)' }}></div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="radio" name="qtySelect" checked={qty === 1} onChange={() => setQty(1)} style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px', flexShrink: 0 }} />
                    <img src={mainImage} alt={product.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontWeight: 600 }}>1 পিস কিনুন</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{Number(product.sellPrice || product.price).toFixed(2)} BDT</div>
                  </div>
                </label>

                {/* Bundle Rows */}
                {[...product.volumeBundles].sort((a,b) => a.qty - b.qty).map((tier, idx) => {
                  const basePrice = Number(product.sellPrice || product.price);
                  const originalTotal = basePrice * tier.qty;
                  let discountTotal = 0;
                  if (tier.discountType === 'percentage') {
                    discountTotal = (originalTotal * tier.discountValue) / 100;
                  } else {
                    discountTotal = tier.discountValue;
                  }
                  const finalTotal = originalTotal - discountTotal;

                  return (
                    <label 
                      key={idx} 
                      style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                        padding: '1rem', background: '#fff', borderRadius: '8px', 
                        border: qty === tier.qty ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
                      }}
                    >
                      {qty === tier.qty && <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-primary)' }}></div>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input type="radio" name="qtySelect" checked={qty === tier.qty} onChange={() => setQty(tier.qty)} style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px', flexShrink: 0 }} />
                        {tier.image && (
                          <img src={tier.image} alt="Bundle" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', flexShrink: 0 }} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 600 }}>{tier.qty} পিস কিনুন</span>
                            {tier.text && (
                              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {tier.text}
                              </span>
                            )}
                          </div>
                          <span style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 600 }}>
                            {tier.discountType === 'percentage' ? `${tier.discountValue}% ছাড়` : `${tier.discountValue} BDT ছাড়`}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{originalTotal.toFixed(2)} BDT</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{finalTotal.toFixed(2)} BDT</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '600' }}>পরিমাণ</label>
                <select className="input-field" style={{ width: '100px' }} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {[...Array(product.allowSellWithoutStock ? 10 : (product.stock > 0 ? Math.min(product.stock, 10) : 0)).keys()].map(x => (
                    <option key={x+1} value={x+1}>{x+1}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flexDirection: 'row', marginBottom: '2rem' }}>
            <button 
              className="btn" 
              disabled={product.stock <= 0 && !product.allowSellWithoutStock}
              onClick={handleAddToCart}
              style={{ 
                background: isAdded ? 'var(--accent-primary)' : 'var(--bg-secondary)', 
                color: isAdded ? 'white' : 'var(--text-primary)', 
                border: isAdded ? '2px solid var(--accent-primary)' : '2px solid var(--text-primary)',
                padding: '1rem', fontSize: '1.1rem', fontWeight: '600', flex: 1,
                transition: 'all 0.3s'
              }}
            >
              {(product.stock <= 0 && !product.allowSellWithoutStock) ? 'স্টক শেষ' : (isAdded ? 'কার্টে যোগ করা হয়েছে ✓' : 'কার্টে যোগ করুন')}
            </button>
            
            <button 
              className="btn btn-primary" 
              disabled={product.stock <= 0 && !product.allowSellWithoutStock}
              onClick={handleBuyNow}
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: '600', flex: 1 }}
            >
              এখুনি কিনুন
            </button>
          </div>

          {/* Low Stock Indicator */}
          {product.stock > 0 && product.stock <= 20 && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: '600', color: '#be123c' }}>
                <span>🔥 দ্রুত করুন! আর মাত্র {product.stock} টি স্টকে আছে।</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#ffe4e6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(product.stock / 20) * 100}%`, height: '100%', background: '#e11d48', transition: 'width 0.5s ease-in-out' }}></div>
              </div>
            </div>
          )}

          {/* Frequently Bought Together (Combo Bundle) */}
          {comboBundle && comboProducts.length > 0 && (
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>✨</span> একসাথে কিনুন
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {/* Main Product */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '80px' }}>
                  <img src={mainImage} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--accent-primary)' }} />
                </div>
                
                {comboProducts.map((cp, idx) => (
                  <React.Fragment key={cp.id}>
                    <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>+</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '80px' }}>
                      <img src={cp.image || 'https://placehold.co/400x400?text=No+Image'} alt={cp.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                    </div>
                  </React.Fragment>
                ))}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-primary)' }}><strong>এই পণ্যটি:</strong> {product.name}</span>
                  <span style={{ fontWeight: 600 }}>{Number(product.sellPrice || product.price).toFixed(2)} BDT</span>
                </div>
                {comboProducts.map(cp => (
                  <div key={cp.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cp.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{Number(cp.sellPrice || cp.price).toFixed(2)} BDT</span>
                  </div>
                ))}
              </div>
              
              {(() => {
                const originalTotal = Number(product.sellPrice || product.price) + comboProducts.reduce((acc, p) => acc + Number(p.sellPrice || p.price), 0);
                const discountValue = comboBundle.discountType === 'percentage' 
                  ? (originalTotal * comboBundle.discountValue) / 100 
                  : comboBundle.discountValue;
                const finalTotal = originalTotal - discountValue;
                
                return (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>মোট দাম:</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{originalTotal.toFixed(2)} BDT</div>
                        <div style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: 700 }}>{finalTotal.toFixed(2)} BDT</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleAddBundleToCart}
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '0.75rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                      বান্ডেল কার্টে যোগ করুন
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* CRO Trust Area fully redesigned */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Lock size={22} color="var(--accent-primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>নিরাপদ পেমেন্ট</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <Truck size={22} color="var(--accent-primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>দ্রুত ডেলিভারি</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <RotateCcw size={22} color="var(--accent-primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>রিটার্ন পলিসি</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <HeadphonesIcon size={22} color="var(--accent-primary)" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>২৪/৭ সাপোর্ট</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4rem 0' }} />

      {/* Bottom Section */}
      <div style={{ width: '100%', margin: '0 auto' }}>
        
        {/* Before Sections */}
        {product.imageTextSections && product.imageTextSections.filter(s => s.orderType === 'before').map(sec => {
          const width = sec.imageWidth || 50;
          const isWrap = sec.wrapText;
          const isLeft = sec.imagePosition === 'left';
          
          if (isWrap) {
            return (
              <div key={sec.id} style={{ marginBottom: '4rem' }}>
                <div style={{ float: isLeft ? 'left' : 'right', width: `${width}%`, minWidth: '250px', margin: isLeft ? '0 2rem 1rem 0' : '0 0 1rem 2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <img src={sec.image} alt="Feature" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                </div>
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sec.text }} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }} />
                <div style={{ clear: 'both' }}></div>
              </div>
            );
          } else {
            return (
              <div key={sec.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', marginBottom: '4rem', flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                <div style={{ flex: `1 1 calc(${width}% - 1.5rem)`, minWidth: '300px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <img src={sec.image} alt="Feature" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: `1 1 calc(${100 - width}% - 1.5rem)`, minWidth: '300px' }}>
                  <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sec.text }} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }} />
                </div>
              </div>
            );
          }
        })}

        {/* Full Description */}
        {product.longDescription && (
          <div style={{ marginBottom: '4rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>প্রোডাক্টের বিবরণ</h2>
            <div 
              className="rich-text-content"
              style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          </div>
        )}

        {/* After Sections */}
        {product.imageTextSections && product.imageTextSections.filter(s => s.orderType === 'after').map(sec => {
          const width = sec.imageWidth || 50;
          const isWrap = sec.wrapText;
          const isLeft = sec.imagePosition === 'left';
          
          if (isWrap) {
            return (
              <div key={sec.id} style={{ marginBottom: '4rem' }}>
                <div style={{ float: isLeft ? 'left' : 'right', width: `${width}%`, minWidth: '250px', margin: isLeft ? '0 2rem 1rem 0' : '0 0 1rem 2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <img src={sec.image} alt="Feature" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                </div>
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sec.text }} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }} />
                <div style={{ clear: 'both' }}></div>
              </div>
            );
          } else {
            return (
              <div key={sec.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', marginBottom: '4rem', flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                <div style={{ flex: `1 1 calc(${width}% - 1.5rem)`, minWidth: '300px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <img src={sec.image} alt="Feature" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: `1 1 calc(${100 - width}% - 1.5rem)`, minWidth: '300px' }}>
                  <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sec.text }} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }} />
                </div>
              </div>
            );
          }
        })}

        {/* FAQs */}
        {product.faq && product.faq.some(item => item.question && item.question.trim() !== '') && (
          <div style={{ marginBottom: '4rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>সাধারণ জিজ্ঞাসা (FAQ)</h2>
            <div>
              {product.faq.map((item, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                  <button 
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)' }}
                  >
                    {item.question}
                    {faqOpen === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {faqOpen === idx && (
                    <div style={{ paddingBottom: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 className="heading-lg" style={{ marginBottom: '2rem' }}>আপনার জন্য আরও কিছু পণ্য</h2>
          <div className="grid-cols-auto">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Buy Modal */}
      {isQuickBuyOpen && (
        <ExpressCheckoutModal 
          product={product} 
          qty={qty} 
          selectedVariations={selectedVariations} 
          onClose={() => setIsQuickBuyOpen(false)} 
        />
      )}

    </div>
  );
};

export default ProductDetails;
