import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Lock, HeadphonesIcon, ZoomIn, Maximize2, Minus, Plus, Home as HomeIcon, CheckCircle2, ShoppingBag, Zap, Sparkles } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import ExpressCheckoutModal from '../components/ExpressCheckoutModal';
import { Helmet } from 'react-helmet-async';
import { trackViewContent } from '../utils/tracking';
import { flyToCart } from '../utils/flyToCart';

const defaultCatalog = [
  {
    id: 1,
    name: 'Nimbus Wireless ANC Headphones with High-Res Audio',
    price: 18000,
    sellPrice: 14500,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    slug: 'nimbus-wireless-anc-headphones',
    description: 'Experience pure sonic brilliance with active noise cancellation and 40-hour ultra battery life.',
    keypoints: ['Active Noise Cancellation (ANC)', 'High-Resolution Audio Certified', '40 Hours Playtime', 'Ultra Soft Memory Foam Ear Cups']
  },
  {
    id: 2,
    name: 'Apex Chrono Smart Watch V2 (AMOLED Curved Display)',
    price: 7500,
    sellPrice: 5800,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    slug: 'apex-chrono-smart-watch',
    description: 'Track your health, calls, and workouts with a gorgeous 1.96-inch curved AMOLED display.',
    keypoints: ['Curved AMOLED Display', 'Bluetooth Calling & Voice Assistant', '100+ Sports Modes', '7-Day Battery Life']
  },
  {
    id: 3,
    name: 'Retro Classic Instant Film Camera (Vintage Edition)',
    price: 12000,
    sellPrice: 9200,
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800'],
    stock: 15,
    slug: 'retro-classic-instant-camera',
    description: 'Capture timeless memories instantly with vintage aesthetics and automatic exposure control.',
    keypoints: ['Instant Photo Printing', 'Automatic Exposure Control', 'Selfie Mirror & Close-Up Lens', 'Vintage Color Edition']
  },
  {
    id: 4,
    name: 'Aura Pro 4K Ultra Slim IPS Designer Monitor',
    price: 49999,
    sellPrice: 42999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&q=80&w=800'],
    stock: 10,
    slug: 'aura-pro-4k-monitor',
    description: 'Ultra-thin bezel 4K IPS display for creators and professionals with 99% DCI-P3 color accuracy.',
    keypoints: ['4K UHD (3840x2160) Resolution', '99% DCI-P3 Color Gamut', 'USB-C 90W Power Delivery', 'HDR 400 Support']
  },
  {
    id: 5,
    name: 'SonicFlow 360° Hi-Res Waterproof Bluetooth Speaker',
    price: 8500,
    sellPrice: 6999,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'],
    stock: 30,
    slug: 'sonicflow-bluetooth-speaker',
    description: 'Room-filling 360-degree sound with deep punchy bass and IPX7 waterproof rating.',
    keypoints: ['360° Omnidirectional Sound', 'IPX7 Waterproof & Dustproof', '24-Hour Battery Life', 'PartyBoost Stereo Pairing']
  },
  {
    id: 6,
    name: 'Urban Leather Minimalist Anti-Theft Backpack',
    price: 5900,
    sellPrice: 4600,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'],
    stock: 50,
    slug: 'urban-leather-backpack',
    description: 'Sleek premium water-resistant leather backpack with hidden anti-theft zippers and USB port.',
    keypoints: ['Premium Water-Resistant Leather', 'Hidden Anti-Theft Zippers', 'Integrated USB Charging Port', 'Dedicated 15.6" Laptop Compartment']
  },
  {
    id: 7,
    name: 'MagPulse Qi2 15W Magnetic Wireless Fast Charger',
    price: 3200,
    sellPrice: 2450,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800'],
    stock: 60,
    slug: 'magpulse-wireless-charger',
    description: 'Fast 15W magnetic wireless charging with smart temperature control and braided cable.',
    keypoints: ['Qi2 15W Ultra Fast Charging', 'Strong Magnetic Snap Alignment', 'Aircraft Grade Aluminum Body', 'Intelligent Heat Dissipation']
  },
  {
    id: 8,
    name: 'ErgoPro Mesh Breathable Executive Office Chair',
    price: 26500,
    sellPrice: 22000,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1580481077197-00994f1c1a96?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1580481077197-00994f1c1a96?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    slug: 'ergopro-executive-chair',
    description: 'Engineered for all-day comfort with dynamic lumbar support and 4D adjustable armrests.',
    keypoints: ['Dynamic Ergonomic Lumbar Support', 'Korean High-Elasticity Breathable Mesh', '4D Multi-Directional Armrests', 'Class 4 Heavy Duty Gas Lift']
  }
];

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [configSelections, setConfigSelections] = useState({});
  const [mixingQuantity, setMixingQuantity] = useState(1);
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  
  // Bundle States
  const [bundles, setBundles] = useState([]);
  const [comboBundle, setComboBundle] = useState(null);
  const [comboProducts, setComboProducts] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevImage(e);
      if (e.key === 'ArrowRight') handleNextImage(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, mainImage, product]);

  useEffect(() => {
    // Reset state on ID change
    setLoading(true);
    setProduct(null);
    setMainImage('');
    setQty(1);
    setSelectedVariations({});
    setConfigSelections({});
    setMixingQuantity(1);
    setFaqOpen(null);
    
    if (userInfo) {
      setQbName(userInfo.name || '');
      setQbPhone(userInfo.phone || '');
      setQbAddress(userInfo.address || '');
    }
    
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    const fetchProduct = async () => {
      try {
        let data = null;
        try {
          const res = await fetch(`${apiUrl}/api/products/${slug}`);
          if (res.ok) {
            data = await res.json();
          }
        } catch (_) {}

        // Fallback match against defaultCatalog if not in MySQL database
        if (!data) {
          const normalizedSlug = (slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          data = defaultCatalog.find(p => {
            const pSlug = (p.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return pSlug === normalizedSlug || pSlug.includes(normalizedSlug) || normalizedSlug.includes(pSlug) || String(p.id) === slug;
          });
        }

        if (!data) {
          toast.error('Product not found');
          setLoading(false);
          return;
        }
        setProduct(data);
        setMainImage(data.images && data.images.length > 0 ? data.images[0] : (data.image || 'https://placehold.co/400x400?text=No+Image'));
        trackViewContent(data);

        // Default to first bundle tier if available
        if (data.volumeBundles && data.volumeBundles.length > 0) {
          const sortedTiers = [...data.volumeBundles].sort((a, b) => a.qty - b.qty);
          setQty(sortedTiers[0].qty);
        }

        // Initialize variations
        if (data.variations) {
          const initialVariations = {};
          data.variations.forEach(v => {
            if (v.options && v.options.length > 0) initialVariations[v.name] = v.options[0];
          });
          setSelectedVariations(initialVariations);
        }

        // Initialize Configurator
        if (data.configurator && data.configurator.enabled) {
          const initialConfig = {};
          if (data.configurator.ingredients) {
            data.configurator.ingredients.forEach(ing => {
              initialConfig[ing.id] = ing.minQuantity || 0;
            });
          }
          setConfigSelections(initialConfig);
          setMixingQuantity(1);
        }

        // Fetch related products (same category)
        try {
          const allRes = await fetch(`${apiUrl}/api/products`);
          const allData = allRes.ok ? await allRes.json() : [];
          const productList = Array.isArray(allData) && allData.length > 0 ? allData : defaultCatalog;
          setRelatedProducts(productList.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4));

          // Fetch active bundles for this product
          const bundleRes = await fetch(`${apiUrl}/api/bundles/product/${data.id}`);
          if (bundleRes.ok) {
            const bundleData = await bundleRes.json();
            setBundles(bundleData);
            
            const cmbBundle = bundleData.find(b => b.type === 'combo');
            if (cmbBundle && cmbBundle.products) {
              setComboBundle(cmbBundle);
              const cProducts = productList.filter(p => cmbBundle.products.includes(p.id));
              setComboProducts(cProducts);
            }
          }
        } catch (_) {
          setRelatedProducts(defaultCatalog.filter(p => p.category === data.category && p.id !== data.id).slice(0, 4));
        }

        // Fetch delivery methods
        const dmRes = await fetch(`${apiUrl}/api/settings/delivery_methods`);
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

  const getConfiguratorPrice = () => {
    if (!product?.configurator?.enabled) return 0;
    let price = 0;
    (product.configurator.ingredients || []).forEach(ing => {
      const selectedQty = configSelections[ing.id] ?? (ing.minQuantity || 0);
      const extraQty = Math.max(0, selectedQty - (ing.minQuantity || 0));
      price += (ing.basePrice || 0) + (extraQty * (ing.increasePricePerUnit || 0));
    });
    return price * (mixingQuantity || 1);
  };

  const getBasePrice = () => Number(product?.sellPrice || product?.price || 0);
  const currentPrice = getBasePrice() + getConfiguratorPrice();

  const formatPrice = (amount) => {
    const num = Number(amount || 0);
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  const handleAddToCart = (e) => {
    // Check variation selections
    if (product.variations && product.variations.length > 0) {
      for (let v of product.variations) {
        if (!selectedVariations[v.name]) {
          toast.error(`Please select a ${v.name}`);
          return;
        }
      }
    }

    // Configurator validation
    if (product.configurator?.enabled) {
      const ings = product.configurator.ingredients || [];
      for (let ing of ings) {
        const selQty = configSelections[ing.id] ?? (ing.minQuantity || 0);
        if (selQty < (ing.minQuantity || 0)) {
          toast.error(`${ing.name} requires a minimum of ${ing.minQuantity}${ing.unitLabel || ''}`);
          return;
        }
        if (ing.maxQuantity && selQty > ing.maxQuantity) {
          toast.error(`${ing.name} maximum allowed is ${ing.maxQuantity}${ing.unitLabel || ''}`);
          return;
        }
      }
    }

    // Calculate Volume Tier Pricing
    let bundleDiscount = 0;
    if (product.volumeBundles && product.volumeBundles.length > 0) {
      const sortedTiers = [...product.volumeBundles].sort((a, b) => b.qty - a.qty);
      const appliedTier = sortedTiers.find(t => qty >= t.qty);
      if (appliedTier) {
        const basePrice = currentPrice;
        if (appliedTier.discountType === 'percentage') {
          bundleDiscount = (basePrice * appliedTier.discountValue) / 100;
        } else {
          bundleDiscount = appliedTier.discountValue / appliedTier.qty;
        }
      }
    }

    let finalVariations = { ...selectedVariations };
    if (product.configurator?.enabled) {
      const configParts = (product.configurator.ingredients || []).map(ing => {
        const selQty = configSelections[ing.id] ?? (ing.minQuantity || 0);
        return `${ing.name}: ${selQty}${ing.unitLabel || ''}`;
      });
      finalVariations['Mixer'] = configParts.join(', ');
      if (product.configurator.enableMixingQuantity && mixingQuantity > 1) {
        finalVariations['Mixing Qty'] = mixingQuantity.toString();
      }
    }

    addToCart({ 
      ...product, 
      sellPrice: currentPrice, 
      price: currentPrice, 
      qty, 
      selectedVariations: finalVariations, 
      bundleDiscount: Number(bundleDiscount.toFixed(2)) 
    });
    setIsAdded(true);
    
    // Trigger smooth fly to cart animation
    flyToCart(e, mainImage || product.image, () => {
      setIsCartOpen(true);
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleAddBundleToCart = (e) => {
    if (!comboBundle || comboProducts.length === 0) return;
    
    // Calculate total original price
    const mainPrice = currentPrice;
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

    let finalVariations = { ...selectedVariations };
    if (product.configurator?.enabled) {
      const configParts = (product.configurator.ingredients || []).map(ing => {
        const selQty = configSelections[ing.id] ?? (ing.minQuantity || 0);
        return `${ing.name}: ${selQty}${ing.unitLabel || ''}`;
      });
      finalVariations['Mixer'] = configParts.join(', ');
      if (product.configurator.enableMixingQuantity && mixingQuantity > 1) {
        finalVariations['Mixing Qty'] = mixingQuantity.toString();
      }
    }

    const discountedMainProduct = {
      ...product,
      sellPrice: currentPrice,
      price: currentPrice,
      selectedVariations: finalVariations,
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
    
    // Trigger smooth fly to cart animation
    flyToCart(e, mainImage || product.image, () => {
      setIsCartOpen(true);
    });

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

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (imagesList.length <= 1) return;
    const currentIndex = imagesList.indexOf(mainImage);
    const prevIndex = currentIndex <= 0 ? imagesList.length - 1 : currentIndex - 1;
    setMainImage(imagesList[prevIndex]);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (imagesList.length <= 1) return;
    const currentIndex = imagesList.indexOf(mainImage);
    const nextIndex = currentIndex >= imagesList.length - 1 ? 0 : currentIndex + 1;
    setMainImage(imagesList[nextIndex]);
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
      
      {/* Product Breadcrumb */}
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link to="/" className="breadcrumb-link">
              <HomeIcon size={14} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <ChevronRight size={13} />
          </li>
          <li className="breadcrumb-item">
            <Link to="/shop" className="breadcrumb-link">
              <span>Shop</span>
            </Link>
          </li>
          {product.category && (
            <>
              <li className="breadcrumb-separator" aria-hidden="true">
                <ChevronRight size={13} />
              </li>
              <li className="breadcrumb-item">
                <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="breadcrumb-link">
                  <span>{product.category}</span>
                </Link>
              </li>
            </>
          )}
          <li className="breadcrumb-separator" aria-hidden="true">
            <ChevronRight size={13} />
          </li>
          <li className="breadcrumb-item current" aria-current="page">
            <span>{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Top Section: Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginTop: '1rem', marginBottom: '4rem', alignItems: 'start' }}>
        
        {/* Left: Images */}
        <div className="desktop-sticky">
          <div 
            className={`product-main-image-container ${isHoverZooming ? 'zooming' : ''}`}
            onMouseEnter={(e) => {
              if (e.target.closest('.product-gallery-arrow') || e.target.closest('.product-gallery-counter')) return;
              setIsHoverZooming(true);
            }}
            onMouseLeave={() => {
              setIsHoverZooming(false);
              setZoomPosition({ x: 50, y: 50 });
            }}
            onMouseMove={(e) => {
              if (e.target.closest('.product-gallery-arrow') || e.target.closest('.product-gallery-counter')) {
                if (isHoverZooming) setIsHoverZooming(false);
                return;
              }
              if (!isHoverZooming) setIsHoverZooming(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoomPosition({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y))
              });
            }}
            style={{ 
              position: 'relative',
              width: '100%', 
              aspectRatio: '1', 
              borderRadius: '20px', 
              overflow: 'hidden', 
              border: '1px solid var(--border-color)', 
              marginBottom: '1rem', 
              background: '#ffffff', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isHoverZooming ? 'crosshair' : 'default'
            }}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isHoverZooming ? 'scale(2.3)' : 'scale(1)',
                transition: isHoverZooming ? 'transform-origin 0.04s ease-out, transform 0.2s ease-out' : 'transform 0.3s ease-out, opacity 0.2s ease',
                pointerEvents: 'none'
              }} 
            />

            {/* Quick Zoom Indicator Badge */}
            <div className={`product-zoom-hint ${isHoverZooming ? 'hidden' : ''}`}>
              <ZoomIn size={16} />
            </div>

            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  onMouseEnter={(e) => { e.stopPropagation(); setIsHoverZooming(false); }}
                  onMouseMove={(e) => { e.stopPropagation(); setIsHoverZooming(false); }}
                  className="product-gallery-arrow prev-arrow"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} strokeWidth={2.4} />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  onMouseEnter={(e) => { e.stopPropagation(); setIsHoverZooming(false); }}
                  onMouseMove={(e) => { e.stopPropagation(); setIsHoverZooming(false); }}
                  className="product-gallery-arrow next-arrow"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} strokeWidth={2.4} />
                </button>

                <div 
                  className="product-gallery-counter"
                  onMouseEnter={(e) => { e.stopPropagation(); setIsHoverZooming(false); }}
                  onMouseMove={(e) => { e.stopPropagation(); setIsHoverZooming(false); }}
                >
                  {(imagesList.indexOf(mainImage) >= 0 ? imagesList.indexOf(mainImage) : 0) + 1} / {imagesList.length}
                </div>
              </>
            )}
          </div>
          <div className="product-thumbs-strip">
            {imagesList.map((img, idx) => (
              <button
                type="button" 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`product-thumb-item ${mainImage === img ? 'active' : ''}`}
                aria-label={`View image ${idx + 1}`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="product-details-content">
          {/* Header Badges & Reviews */}
          <div className="product-meta-header">
            {product.category && (
              <span className="product-category-badge">{product.category}</span>
            )}

            <div className="product-reviews-badge">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.round(Number(product.rating || 4.9)) ? '#f59e0b' : '#e2e8f0'} 
                    color={i < Math.round(Number(product.rating || 4.9)) ? '#f59e0b' : '#cbd5e1'} 
                    size={14} 
                  />
                ))}
              </div>
              <span className="review-score">{Number(product.rating || 4.9).toFixed(1)}</span>
              <span className="review-count">({product.reviewsCount || product.numReviews || 124} Reviews)</span>
            </div>
          </div>

          <h1 className="product-main-title">{product.name}</h1>
          
          {/* Price Container */}
          <div className="product-price-container">
            <div className="price-main-wrap">
              <div className="price-current-group">
                <span className="price-current">{formatPrice(currentPrice)}</span>
                <span className="price-currency">BDT</span>
              </div>
              {product.sellPrice && Number(product.price) > Number(product.sellPrice) && !product.configurator?.enabled && (
                <div className="price-savings-group">
                  <span className="price-original">{formatPrice(product.price)} BDT</span>
                  <span className="price-discount-tag">
                    Save {Math.round(((Number(product.price) - Number(product.sellPrice)) / Number(product.price)) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* In Stock Badge directly below price */}
            <div className="price-stock-row" style={{ marginTop: '0.55rem' }}>
              {product.stock > 0 || product.allowSellWithoutStock ? (
                <span className="product-stock-badge in-stock">
                  <span className="stock-dot"></span> In Stock
                </span>
              ) : (
                <span className="product-stock-badge out-stock">Out of Stock</span>
              )}
            </div>
          </div>

          {product.description && (
            <p className="product-short-desc">
              {product.description}
            </p>
          )}

          {/* Keypoints Highlights */}
          {product.keypoints && product.keypoints.length > 0 && (
            <div className="product-keypoints-box">
              {product.keypoints.map((kp, idx) => (
                <div key={idx} className="product-keypoint-item">
                  <div className="keypoint-icon">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="keypoint-text">{kp}</span>
                </div>
              ))}
            </div>
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

          {/* Configurator Builder */}
          {product.configurator?.enabled && (
            <div style={{ marginBottom: '2.5rem', background: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '4px', height: '24px', background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>Customize Your Mix</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(product.configurator.ingredients || []).map(ing => {
                  const selQty = configSelections[ing.id] ?? (ing.minQuantity || 0);
                  const extraQty = Math.max(0, selQty - (ing.minQuantity || 0));
                  const ingPrice = (ing.basePrice || 0) + (extraQty * (ing.increasePricePerUnit || 0));
                  
                  return (
                    <div key={ing.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#fafaf9', borderRadius: '12px', border: '1px solid #f5f5f4', transition: 'all 0.2s' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{ing.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          +{ing.increasePricePerUnit} BDT per additional {ing.unitLabel}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                          <button 
                            style={{ padding: '0.6rem 0.85rem', background: 'none', border: 'none', cursor: selQty <= (ing.minQuantity || 0) ? 'not-allowed' : 'pointer', color: selQty <= (ing.minQuantity || 0) ? '#d1d5db' : 'var(--text-primary)', fontSize: '1.1rem', transition: 'background 0.2s' }}
                            onMouseOver={e => { if(selQty > (ing.minQuantity || 0)) e.target.style.background = '#f3f4f6' }}
                            onMouseOut={e => e.target.style.background = 'none'}
                            onClick={() => {
                              if (selQty > (ing.minQuantity || 0)) {
                                setConfigSelections(prev => ({ ...prev, [ing.id]: selQty - 1 }));
                              }
                            }}
                          >-</button>
                          <div style={{ padding: '0.5rem', minWidth: '45px', textAlign: 'center', fontWeight: '600', fontSize: '1rem', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', color: 'var(--text-primary)' }}>
                            {selQty}
                            <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)', marginLeft: '3px' }}>{ing.unitLabel}</span>
                          </div>
                          <button 
                            style={{ padding: '0.6rem 0.85rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '1.1rem', transition: 'background 0.2s' }}
                            onMouseOver={e => e.target.style.background = '#f3f4f6'}
                            onMouseOut={e => e.target.style.background = 'none'}
                            onClick={() => setConfigSelections(prev => ({ ...prev, [ing.id]: selQty + 1 }))}
                          >+</button>
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', minWidth: '75px', textAlign: 'right', color: 'var(--accent-primary)' }}>
                          {formatPrice(ingPrice)} ৳
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {product.configurator.enableMixingQuantity && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Total Mixing Quantity</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Multiplier for the entire custom mix</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--accent-primary)', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    <button 
                      style={{ padding: '0.6rem 1rem', background: 'rgba(37, 99, 235, 0.05)', border: 'none', cursor: mixingQuantity <= 1 ? 'not-allowed' : 'pointer', color: mixingQuantity <= 1 ? '#94a3b8' : 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: '600' }}
                      onClick={() => setMixingQuantity(prev => Math.max(1, prev - 1))}
                    >-</button>
                    <div style={{ padding: '0.5rem 1rem', minWidth: '55px', textAlign: 'center', fontWeight: '700', fontSize: '1.1rem', borderLeft: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)', color: 'var(--accent-primary)' }}>
                      {mixingQuantity}
                    </div>
                    <button 
                      style={{ padding: '0.6rem 1rem', background: 'rgba(37, 99, 235, 0.05)', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: '600' }}
                      onClick={() => setMixingQuantity(prev => prev + 1)}
                    >+</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Volume Bundles (Quantity Discounts) */}
          {product.volumeBundles && product.volumeBundles.length > 0 && (
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
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{formatPrice(currentPrice)} BDT</div>
                  </div>
                </label>

                {/* Bundle Rows */}
                {[...product.volumeBundles].sort((a,b) => a.qty - b.qty).map((tier, idx) => {
                  const basePrice = currentPrice;
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
                        <div style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatPrice(originalTotal)} BDT</div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{formatPrice(finalTotal)} BDT</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {!product.volumeBundles?.length && (
            <div className="product-quantity-section" style={{ marginBottom: '0.65rem' }}>
              <label className="product-quantity-label" style={{ display: 'block', fontWeight: '700', marginBottom: '0.35rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                পরিমাণ (Quantity)
              </label>

              <div className="product-quantity-stepper">
                <button
                  type="button"
                  className="qty-step-btn minus-btn"
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>

                <div className="qty-value-display">
                  <span>{qty}</span>
                </div>

                <button
                  type="button"
                  className="qty-step-btn plus-btn"
                  onClick={() => {
                    const max = product.allowSellWithoutStock ? 99 : (product.stock > 0 ? product.stock : 1);
                    setQty(prev => Math.min(max, prev + 1));
                  }}
                  disabled={!product.allowSellWithoutStock && product.stock > 0 && qty >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons (Both After Quantity Selector) */}
          <div className="product-actions-group">
            <button 
              className={`product-btn add-to-cart-btn ${isAdded ? 'added' : ''}`}
              disabled={product.stock <= 0 && !product.allowSellWithoutStock}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={19} />
              <span>{(product.stock <= 0 && !product.allowSellWithoutStock) ? 'স্টক শেষ' : (isAdded ? 'যোগ করা হয়েছে ✓' : 'কার্টে যোগ করুন')}</span>
            </button>
            
            <button 
              className="product-btn buy-now-btn" 
              disabled={product.stock <= 0 && !product.allowSellWithoutStock}
              onClick={handleBuyNow}
            >
              <Zap size={19} />
              <span>এখুনি কিনুন</span>
            </button>
          </div>

          {/* Product Quick Info Bar (Delivery & Trust Signals - Single Line) */}
          <div className="product-quick-info-bar">
            <div className="quick-info-item">
              <Truck size={16} className="quick-info-icon truck-animated" />
              <span>Delivery Timescale: <strong>2–3 Days</strong></span>
            </div>
            <div className="quick-info-divider">|</div>
            <div className="quick-info-item">
              <ShieldCheck size={16} className="quick-info-icon" />
              <span><strong>100% Authentic Product</strong></span>
            </div>
          </div>

          {/* Low Stock Indicator */}
          {product.stock > 0 && product.stock <= 20 && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px' }}>
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
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <Sparkles size={18} color="var(--accent-primary)" /> একসাথে কিনুন (Bundle Offer)
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {/* Main Product */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '80px' }}>
                  <img src={mainImage} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '2px solid var(--accent-primary)' }} />
                </div>
                
                {comboProducts.map((cp, idx) => (
                  <React.Fragment key={cp.id}>
                    <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: '300' }}>+</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '80px' }}>
                      <img src={cp.image || 'https://placehold.co/400x400?text=No+Image'} alt={cp.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    </div>
                  </React.Fragment>
                ))}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-primary)' }}><strong>এই পণ্যটি:</strong> {product.name}</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(product.sellPrice || product.price)} BDT</span>
                </div>
                {comboProducts.map(cp => (
                  <div key={cp.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cp.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatPrice(cp.sellPrice || cp.price)} BDT</span>
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
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>মোট দাম:</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{formatPrice(originalTotal)} BDT</div>
                        <div style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', fontWeight: 800 }}>{formatPrice(finalTotal)} BDT</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleAddBundleToCart}
                      className="product-btn buy-now-btn" 
                      style={{ width: '100%' }}
                    >
                      <ShoppingBag size={18} />
                      <span>বান্ডেল কার্টে যোগ করুন</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* CRO Trust Area */}
          <div className="product-trust-card">
            <div className="trust-grid">
              <div className="trust-item">
                <div className="trust-icon-box">
                  <Lock size={20} />
                </div>
                <span className="trust-label">নিরাপদ পেমেন্ট</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon-box">
                  <Truck size={20} />
                </div>
                <span className="trust-label">ফ্রি ও ফাস্ট শিপিং</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon-box">
                  <RotateCcw size={20} />
                </div>
                <span className="trust-label">সহজ রিটার্ন</span>
              </div>
              <div className="trust-item">
                <div className="trust-icon-box">
                  <HeadphonesIcon size={20} />
                </div>
                <span className="trust-label">২৪/৭ সাপোর্ট</span>
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
              <div key={sec.id} style={{ marginBottom: '3rem', background: '#ffffff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ float: isLeft ? 'left' : 'right', width: `${width}%`, minWidth: '250px', margin: isLeft ? '0 2rem 1rem 0' : '0 0 1rem 2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <img src={sec.image} alt="Feature" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                </div>
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sec.text }} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }} />
                <div style={{ clear: 'both' }}></div>
              </div>
            );
          } else {
            return (
              <div key={sec.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', marginBottom: '3rem', flexDirection: isLeft ? 'row' : 'row-reverse', background: '#ffffff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
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
              <div key={sec.id} style={{ marginBottom: '3rem', background: '#ffffff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ float: isLeft ? 'left' : 'right', width: `${width}%`, minWidth: '250px', margin: isLeft ? '0 2rem 1rem 0' : '0 0 1rem 2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <img src={sec.image} alt="Feature" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
                </div>
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: sec.text }} style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }} />
                <div style={{ clear: 'both' }}></div>
              </div>
            );
          } else {
            return (
              <div key={sec.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', marginBottom: '3rem', flexDirection: isLeft ? 'row' : 'row-reverse', background: '#ffffff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
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

      {/* Product Image Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="product-lightbox-modal"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product Image Preview"
        >
          {/* Top Bar */}
          <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-title-wrap">
              <span className="lightbox-title">{product.name}</span>
              <span className="lightbox-counter">
                {(imagesList.indexOf(mainImage) >= 0 ? imagesList.indexOf(mainImage) : 0) + 1} / {imagesList.length}
              </span>
            </div>
            <button 
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {imagesList.length > 1 && (
              <button 
                type="button" 
                className="lightbox-arrow lightbox-prev" 
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} strokeWidth={2.4} />
              </button>
            )}

            <div className="lightbox-image-wrapper">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="lightbox-main-img" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
              />
            </div>

            {imagesList.length > 1 && (
              <button 
                type="button" 
                className="lightbox-arrow lightbox-next" 
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={32} strokeWidth={2.4} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {imagesList.length > 1 && (
            <div className="lightbox-thumbnails" onClick={(e) => e.stopPropagation()}>
              {imagesList.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`lightbox-thumb ${mainImage === img ? 'active' : ''}`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
