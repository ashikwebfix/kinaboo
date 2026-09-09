import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, Smartphone, Shirt, Home as HomeIcon, Sparkles, Trophy, Gem, Star, Zap, Heart, ShoppingBag, PackageSearch, ArrowUpRight, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';

const IconMap = {
  ShieldCheck, Truck, RotateCcw, Smartphone, Shirt, Home: HomeIcon, Sparkles, Trophy, Gem, Star, Zap, Heart, ShoppingBag, PackageSearch
};

/* Dual-Direction Step Slideshow Component (Smooth Hardware Accelerated) */
const DualDirectionStepSlideshow = ({ products }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Split into 2 rows: Top row (even index), Bottom row (odd index)
  const topProducts = products.filter((_, i) => i % 2 === 0);
  const bottomProducts = products.filter((_, i) => i % 2 !== 0);

  // Group into pages of 4 for responsive view
  const groupIntoPages = (items, pageSize = 4) => {
    const pages = [];
    for (let i = 0; i < items.length; i += pageSize) {
      pages.push(items.slice(i, i + pageSize));
    }
    return pages;
  };

  const row1Pages = groupIntoPages(topProducts, 4);
  const row2Pages = groupIntoPages(bottomProducts, 4);

  const totalPages = Math.max(row1Pages.length, row2Pages.length, 1);

  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % totalPages);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  const handlePrev = () => {
    setSlideIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setSlideIndex((prev) => (prev + 1) % totalPages);
  };

  // Row 1 goes forward (slideIndex), Row 2 goes backward (totalPages - 1 - slideIndex) for modern dual-motion
  const row1Index = slideIndex % (row1Pages.length || 1);
  const row2Index = (totalPages - 1 - slideIndex) % (row2Pages.length || 1);

  return (
    <div
      className="smooth-slideshow-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Controls */}
      {totalPages > 1 && (
        <div className="smooth-slideshow-controls">
          <button
            type="button"
            onClick={handlePrev}
            className="smooth-arrow-btn prev-btn"
            aria-label="Previous Products"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="smooth-page-indicator">
            {slideIndex + 1} / {totalPages}
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="smooth-arrow-btn next-btn"
            aria-label="Next Products"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Row 1: Left-to-Right Flow */}
      <div className="smooth-slideshow-track-wrapper">
        <div
          className="smooth-slideshow-track"
          style={{ transform: `translate3d(-${row1Index * 100}%, 0, 0)` }}
        >
          {row1Pages.map((page, pIdx) => (
            <div key={`r1-page-${pIdx}`} className="smooth-slideshow-page">
              {page.map((prod, idx) => (
                <ProductCard key={`r1-${pIdx}-${prod.id}-${idx}`} product={prod} showRating={true} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right-to-Left Flow */}
      <div className="smooth-slideshow-track-wrapper" style={{ marginTop: '1.25rem' }}>
        <div
          className="smooth-slideshow-track reverse"
          style={{ transform: `translate3d(-${row2Index * 100}%, 0, 0)` }}
        >
          {row2Pages.map((page, pIdx) => (
            <div key={`r2-page-${pIdx}`} className="smooth-slideshow-page">
              {page.map((prod, idx) => (
                <ProductCard key={`r2-${pIdx}-${prod.id}-${idx}`} product={prod} showRating={true} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function useScrollReveal(threshold = 0.1) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
      }
    }, { threshold, rootMargin: '0px 0px -40px 0px' });

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}


const generateInitialLayout = (data) => {
  if (data?.layout) return data.layout;
  const layout = [];
  if (data) {
    layout.push({ id: 'hero-1', type: 'hero', active: true, data: { heroType: data.heroType || 'multi', singleHeroImage: data.singleHeroImage, singleHeroLink: data.singleHeroLink, heroBanners: data.heroBanners || [], promotionalBanners: data.promotionalBanners || [] } });
    layout.push({ id: 'trust-1', type: 'trust_badges', active: true, data: { trustBadges: data.trustBadges || [] } });
    if (data.popularCategories) layout.push({ id: 'popular-1', type: 'popular_categories', active: data.popularCategories.enabled !== false, data: data.popularCategories });
    if (data.superHourDeals) layout.push({ id: 'super-1', type: 'super_hour', active: true, data: data.superHourDeals });
    if (data.editorialShowcase) layout.push({ id: 'editorial-1', type: 'editorial', active: data.editorialShowcase.enabled !== false, data: data.editorialShowcase });
    if (data.dealsSection) layout.push({ id: 'deals-1', type: 'deals', active: data.dealsSection.enabled !== false, data: data.dealsSection });
    if (data.featuredProducts) layout.push({ id: 'featured-1', type: 'featured', active: true, data: data.featuredProducts });
    if (data.promoBentoShowcase) layout.push({ id: 'bento-1', type: 'promo_bento', active: data.promoBentoShowcase.enabled !== false, data: data.promoBentoShowcase });
    if (data.trendingProducts) layout.push({ id: 'trending-1', type: 'trending', active: data.trendingProducts.enabled !== false, data: data.trendingProducts });
    if (data.customSections && data.customSections.length > 0) {
      data.customSections.forEach((sec, i) => layout.push({ id: `custom-${i}`, type: 'custom', active: true, data: sec }));
    }
  }
  return layout;
};

const FaqSection = ({ data, id }) => {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <section key={id} className="faq-section-container">
      <div className="faq-left-col">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eef2ff', padding: '0.5rem 1rem', borderRadius: '20px', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> FAQ
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.1 }}>{data.title || 'Frequently Asked Questions'}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {data.subtitle || 'Find answers to common questions about our products and services.'}
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/contact'} style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>Contact Support</button>
      </div>
      
      <div className="faq-right-col">
        {(data.items || []).map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={item.id || index} 
              style={{ background: '#fff', borderRadius: '16px', border: isOpen ? '2px solid var(--accent-primary)' : '1px solid #e5e7eb', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: isOpen ? '0 10px 25px -5px rgba(79, 70, 229, 0.1)' : 'none' }}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', fontWeight: 600, color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)', fontSize: '1.1rem' }}>
                <span>{item.question}</span>
                <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', display: 'flex' }}>
                  <ChevronDown size={20} />
                </span>
              </div>
              <div style={{ maxHeight: isOpen ? '500px' : '0', opacity: isOpen ? 1 : 0, transition: 'all 0.3s ease', padding: isOpen ? '0 1.5rem 1.5rem' : '0 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const Home = () => {
  const [editorialRef, editorialInView] = useScrollReveal(0.08);
  const [bentoRef, bentoInView] = useScrollReveal(0.08);
  const [products, setProducts] = useState([]);
  const [activeDealsCategory, setActiveDealsCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [uiConfig, setUiConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 59 });

  // Dynamic Deals Categories from Admin Settings or real database categories
  const dealsCategories = useMemo(() => {
    if (uiConfig?.dealsCategories && Array.isArray(uiConfig.dealsCategories) && uiConfig.dealsCategories.length > 0) {
      return ['All', ...uiConfig.dealsCategories];
    }
    const productCatNames = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    if (productCatNames.length > 0) {
      return ['All', ...productCatNames];
    }
    const catNames = categories.map(c => c.name || c.title).filter(Boolean);
    if (catNames.length > 0) {
      return ['All', ...catNames];
    }
    return ['All', 'Electronics', 'Fashion', 'Wearables', 'Gadgets', 'Photography'];
  }, [uiConfig, products, categories]);

  const carouselRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  const defaultPopularCategories = [
    { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Fashion', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Luxury', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300' },
    { id: 4, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=300' },
    { id: 5, name: 'Health & Beauty', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300' },
    { id: 6, name: 'Groceries', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300' },
    { id: 7, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300' },
    { id: 8, name: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300' },
  ];

  const slides = [
    { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000', title: 'Summer Collection', subtitle: 'Up to 50% Off' },
    { id: 2, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000', title: 'New Arrivals', subtitle: 'Shop the Latest Trends' },
    { id: 3, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000', title: 'Exclusive Accessories', subtitle: 'Premium Quality' },
  ];

  const defaultPromos = [
    { id: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', title: 'স্মার্ট ওয়াচ', link: '/shop' },
    { id: 2, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800', title: 'ডিজিটাল ক্যামেরা', link: '/shop' },
    { id: 3, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', title: 'অডিও গ্যাজেটস', link: '/shop' }
  ];

  const defaultTrustBadges = [
    { id: 1, text: 'ফ্রি ও ফাস্ট শিপিং', subtext: 'নির্দিষ্ট অর্ডারে দ্রুততম হোম ডেলিভারি', icon: 'Truck' },
    { id: 2, text: '১০০% নিরাপদ পেমেন্ট', subtext: 'ক্যাশ অন ডেলিভারি ও অনলাইন পেমেন্ট', icon: 'ShieldCheck' },
    { id: 3, text: 'সহজ রিটার্ন পলিসি', subtext: '৩০ দিনের নির্ভরযোগ্য এক্সচেঞ্জ গ্যারান্টি', icon: 'RotateCcw' },
    { id: 4, text: '২৪/৭ সার্বক্ষণিক সাপোর্ট', subtext: 'যেকোনো সহায়তায় আমাদের টিম প্রস্তুত', icon: 'Sparkles' }
  ];

  const defaultProducts = [
    {
      id: 1,
      name: 'Nimbus Wireless ANC Headphones with High-Res Audio',
      price: 18000,
      sellPrice: 14500,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      stock: 25,
      slug: 'nimbus-wireless-anc-headphones'
    },
    {
      id: 2,
      name: 'Apex Chrono Smart Watch V2 (AMOLED Curved Display)',
      price: 7500,
      sellPrice: 5800,
      category: 'Wearables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      stock: 40,
      slug: 'apex-chrono-smart-watch'
    },
    {
      id: 3,
      name: 'Retro Classic Instant Film Camera (Vintage Edition)',
      price: 12000,
      sellPrice: 9200,
      category: 'Photography',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      stock: 15,
      slug: 'retro-classic-instant-camera'
    },
    {
      id: 4,
      name: 'Aura Pro 4K Ultra Slim IPS Designer Monitor',
      price: 49999,
      sellPrice: 42999,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?auto=format&fit=crop&q=80&w=800',
      stock: 10,
      slug: 'aura-pro-4k-monitor'
    },
    {
      id: 5,
      name: 'SonicFlow 360° Hi-Res Waterproof Bluetooth Speaker',
      price: 8500,
      sellPrice: 6999,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
      stock: 30,
      slug: 'sonicflow-bluetooth-speaker'
    },
    {
      id: 6,
      name: 'Urban Leather Minimalist Anti-Theft Backpack',
      price: 5900,
      sellPrice: 4600,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
      stock: 50,
      slug: 'urban-leather-backpack'
    },
    {
      id: 7,
      name: 'MagPulse Qi2 15W Magnetic Wireless Fast Charger',
      price: 3200,
      sellPrice: 2450,
      category: 'Gadgets',
      image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
      stock: 60,
      slug: 'magpulse-wireless-charger'
    },
    {
      id: 8,
      name: 'ErgoPro Mesh Breathable Executive Office Chair',
      price: 26500,
      sellPrice: 22000,
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1580481077197-00994f1c1a96?auto=format&fit=crop&q=80&w=800',
      stock: 12,
      slug: 'ergopro-executive-chair'
    }
  ];

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const fetchData = async () => {
      try {
        const [prodRes, configRes, catRes] = await Promise.all([
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/settings/storefront_ui`),
          fetch(`${apiUrl}/api/categories`).catch(() => null)
        ]);
        const prodData = await prodRes.json();
        const configData = await configRes.json();
        const catData = catRes ? await catRes.json().catch(() => []) : [];

        setProducts(Array.isArray(prodData) ? prodData : []);
        if (configData) configData.layout = generateInitialLayout(configData);
        setUiConfig(configData);
        setCategories(Array.isArray(catData) && catData.length > 0 ? catData : defaultPopularCategories);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setProducts([]);
        setCategories(defaultPopularCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const bannersLength = uiConfig?.heroBanners?.length || slides.length;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannersLength);
    }, 5000);
    return () => clearInterval(timer);
  }, [uiConfig?.heroBanners?.length, slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 5; // Reset for demo
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340; // width + gap
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <Helmet>
        <title>Home | kinaboo.com</title>
        <meta name="description" content="পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।" />
        <meta property="og:title" content="Home | kinaboo.com" />
        <meta property="og:description" content="পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।" />
        <meta property="og:image" content={`${window.location.origin}/favicon.svg`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>


      {uiConfig?.layout?.map((section) => {
        if (section.active === false) return null;
        const data = section.data || {};
        
        switch (section.type) {
          case 'hero':
            return (
              <div key={section.id}>
                {data.heroType === 'single' ? (
                  <div style={{ marginBottom: '3.5rem', borderRadius: '20px', overflow: 'hidden', position: 'relative', width: '100%', height: 'auto', boxShadow: '0 10px 25px -5px rgba(43,45,66,0.1)' }}>
                    {data.singleHeroImage ? (
                      <a href={data.singleHeroLink || '#'} style={{ display: 'block', width: '100%', height: 'auto' }}>
                        <img src={data.singleHeroImage} alt="Hero Banner" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </a>
                    ) : (
                      <div style={{ width: '100%', height: '480px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'var(--text-secondary)' }}>No hero image configured</span></div>
                    )}
                  </div>
                ) : (
                  <section className="modern-hero-section">
                    <div className="modern-hero-grid">
                      <div className="hero-carousel-card">
                        {(data.heroBanners?.length > 0 ? data.heroBanners : slides).map((slide, idx) => (
                          <div key={slide.id || idx} className={`hero-slide-item ${currentSlide === idx ? 'active' : ''}`}>
                            <img src={slide.image} alt={slide.title} className="hero-slide-image" />
                            <div className="hero-slide-overlay">
                              <div className="hero-badge-pill"><span className="hero-pulse-dot"></span><span>{slide.subtitle || '✨ New Season Drops'}</span></div>
                              <h2 className="hero-slide-title">{slide.title}</h2>
                              <p className="hero-slide-subtitle">Discover authentic premium collection with fast delivery & guaranteed quality.</p>
                              <div className="hero-action-row">
                                <button className="hero-cta-btn-primary" onClick={() => window.location.href = slide.link || '/shop'}><span>এখুনি কিনুন</span><ChevronRight size={18} /></button>
                                <button className="hero-cta-btn-secondary" onClick={() => window.location.href = '/shop'}><span>সব পণ্য দেখুন</span></button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button className="hero-nav-arrow prev" onClick={() => setCurrentSlide((prev) => (prev === 0 ? (data.heroBanners?.length || slides.length) - 1 : prev - 1))}><ChevronLeft size={22} /></button>
                        <button className="hero-nav-arrow next" onClick={() => setCurrentSlide((prev) => (prev + 1) % (data.heroBanners?.length || slides.length))}><ChevronRight size={22} /></button>
                        <div className="hero-dots-container">
                          {(data.heroBanners?.length > 0 ? data.heroBanners : slides).map((_, dotIdx) => (
                            <button key={dotIdx} className={`hero-dot-pill ${currentSlide === dotIdx ? 'active' : ''}`} onClick={() => setCurrentSlide(dotIdx)} />
                          ))}
                        </div>
                      </div>
                      <div className="hero-special-offer-card">
                        <div className="hero-offer-glow-1"></div><div className="hero-offer-glow-2"></div>
                        <div className="hero-offer-top"><div className="hero-offer-badge"><span>⚡ LIMITED TIME OFFER</span></div></div>
                        <div className="hero-offer-center">
                          <h3 className="hero-offer-title">স্পেশাল মেগা অফার</h3>
                          <p className="hero-offer-subtitle">নতুন সব ট্রেন্ডি পণ্যে ফ্ল্যাট ২০% থেকে ৫০% পর্যন্ত আকর্ষণীয় ছাড়!</p>
                          <div className="hero-offer-timer-box">
                            <div className="offer-timer-item"><span className="offer-timer-digit">{String(timeLeft.hours).padStart(2, '0')}</span><span className="offer-timer-unit">Hours</span></div><span className="offer-timer-divider">:</span>
                            <div className="offer-timer-item"><span className="offer-timer-digit">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="offer-timer-unit">Mins</span></div><span className="offer-timer-divider">:</span>
                            <div className="offer-timer-item"><span className="offer-timer-digit">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="offer-timer-unit">Secs</span></div>
                          </div>
                        </div>
                        <div className="hero-offer-bottom"><button className="hero-offer-cta-btn" onClick={() => window.location.href = '/shop?sort=discount'}><span>অফারটি গ্রহণ করুন</span><ChevronRight size={18} /></button></div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            );

          case 'trust_badges':
            return (
              <section key={section.id} className="trust-badges-section">
                <div className="trust-badges-grid">
                  {(data.trustBadges?.length > 0 ? data.trustBadges : defaultTrustBadges).map((badge, idx) => {
                    const IconComponent = IconMap[badge.icon] || Star;
                    return (
                      <div key={badge.id || idx} className="trust-card">
                        <div className="trust-icon-box"><IconComponent size={24} /></div>
                        <div className="trust-content"><h4 className="trust-title">{badge.text}</h4>{badge.subtext && <p className="trust-subtitle">{badge.subtext}</p>}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'popular_categories':
            return (
              <section key={section.id} className="popular-categories-section">
                <div className="popular-categories-header">
                  <h2 className="popular-categories-title">{data.title || 'Explore Popular Categories'}</h2>
                  <a href={data.viewAllLink || '/shop'} className="popular-categories-view-all"><span>{data.viewAllText || 'View All'}</span><ChevronRight size={16} /></a>
                </div>
                <div className="popular-categories-slider-wrap">
                  <button type="button" className="popular-categories-nav-btn prev" onClick={() => scrollCategories('left')}><ChevronLeft size={18} /></button>
                  <div ref={categoryScrollRef} className="popular-categories-scroll">
                    {(() => {
                      if (data.items && data.items.length > 0) {
                        return data.items.map((cat, idx) => {
                          const catName = cat.name || 'Category';
                          const catImg = cat.image || defaultPopularCategories[idx % defaultPopularCategories.length]?.image;
                          const catLink = cat.link || `/shop?category=${encodeURIComponent(catName)}`;
                          return (
                            <a key={cat.id || idx} href={catLink} className="popular-category-item">
                              <div className="popular-category-circle"><img src={catImg} alt={catName} className="popular-category-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150?text=Category'; }} /></div>
                              <span className="popular-category-name" title={catName}>{catName}</span>
                            </a>
                          );
                        });
                      }
                      const baseCats = categories.length > 0 ? categories : defaultPopularCategories;
                      const filteredCats = (data.selectedCategoryNames && data.selectedCategoryNames.length > 0) ? baseCats.filter(c => data.selectedCategoryNames.includes(c.name || c.title)) : baseCats;
                      return filteredCats.map((cat, idx) => {
                        const catName = cat.name || cat.title || 'Category';
                        const catImg = cat.image || defaultPopularCategories[idx % defaultPopularCategories.length]?.image;
                        return (
                          <a key={cat.id || idx} href={`/shop?category=${encodeURIComponent(catName)}`} className="popular-category-item">
                            <div className="popular-category-circle"><img src={catImg} alt={catName} className="popular-category-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150?text=Category'; }} /></div>
                            <span className="popular-category-name" title={catName}>{catName}</span>
                          </a>
                        );
                      });
                    })()}
                  </div>
                  <button type="button" className="popular-categories-nav-btn next" onClick={() => scrollCategories('right')}><ChevronRight size={18} /></button>
                </div>
              </section>
            );

          case 'super_hour':
            return (
              <section key={section.id} className="super-hour-container">
                <div className="super-hour-glow-1"></div><div className="super-hour-glow-2"></div><div className="super-hour-glow-3"></div>
                <div className="super-hour-header">
                  <div className="super-hour-header-left">
                    <div className="super-hour-tag"><span className="super-hour-pulse-dot"></span><span>LIMITED TIME OFFER • ফ্ল্যাশ সেল</span></div>
                    <h2 className="super-hour-title"><span className="super-hour-icon-wrap">⚡</span><span>সুপার আওয়ার ডিলস</span></h2>
                    <p className="super-hour-subtitle">সময় শেষ হওয়ার আগেই আকর্ষণীয় ছাড়ে আপনার পছন্দের গ্যাজেট ও ফ্যাশন বুঝে নিন!</p>
                  </div>
                  <div className="super-hour-header-right">
                    <div className="super-hour-timer-card">
                      <div className="timer-label"><Clock size={14} className="timer-icon" /><span>অফার শেষ হতে বাকি</span></div>
                      <div className="timer-digits-row">
                        <div className="timer-digit-box"><span className="digit-val">{String(timeLeft.hours).padStart(2, '0')}</span><span className="digit-label">ঘণ্টা</span></div><span className="timer-separator">:</span>
                        <div className="timer-digit-box"><span className="digit-val">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="digit-label">মিনিট</span></div><span className="timer-separator">:</span>
                        <div className="timer-digit-box pulse-sec"><span className="digit-val">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="digit-label">সেকেন্ড</span></div>
                      </div>
                    </div>
                    <div className="super-hour-nav-controls">
                      <button type="button" className="super-hour-nav-btn" onClick={() => scrollCarousel('left')}><ChevronLeft size={22} /></button>
                      <button type="button" className="super-hour-nav-btn" onClick={() => scrollCarousel('right')}><ChevronRight size={22} /></button>
                    </div>
                  </div>
                </div>
                <div className="super-hour-slider-wrapper">
                  <div ref={carouselRef} className="super-hour-scroll" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
                    {loading ? <div className="super-hour-loading"><p>ডিল লোড হচ্ছে...</p></div> : (products.length > 0 ? (data.productIds?.length > 0 ? products.filter(p => data.productIds.includes(p.id)) : products) : defaultProducts).map((product) => (
                      <div key={product.id} className="super-hour-card-item"><ProductCard product={product} showRating={true} /></div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'editorial':
            return (
              <section key={section.id} ref={editorialRef} className={`editorial-showcase-section ${editorialInView ? 'in-view' : ''}`}>
                <div className="editorial-header"><div className="editorial-title-wrap"><h2 className="editorial-main-title">{data.title || 'Elevate Your Style With Bold Fashion'}</h2></div></div>
                <div className="editorial-grid">
                  <div className="editorial-col">
                    <a href={data.card1Link || '/shop?category=Fashion'} className="editorial-card shape-arch-top theme-orange" style={{ height: '340px' }}><img src={data.card1Img || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'} alt="Fashion 1" className="editorial-card-img" /></a>
                    <a href={data.card2Link || '/shop?category=Fashion'} className="editorial-card shape-rounded-lg theme-amber" style={{ height: '140px' }}><img src={data.card2Img || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'} alt="Fashion 2" className="editorial-card-img" /></a>
                  </div>
                  <div className="editorial-col">
                    <a href={data.card3Link || '/shop?category=Fashion'} className="editorial-card shape-tab-left theme-lime" style={{ height: '495px' }}><img src={data.card3Img || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800'} alt="Fashion 3" className="editorial-card-img" /></a>
                  </div>
                  <div className="editorial-col editorial-center-col">
                    <div className="starburst-icon-wrap"><Sparkles size={28} /></div>
                    <a href={data.card4Link || '/shop'} className="editorial-card shape-square-center theme-yellow" style={{ width: '100%', height: '320px' }}><img src={data.card4Img || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'} alt="Fashion 4" className="editorial-card-img" /></a>
                    <a href={data.centerBtnLink || '/shop'} className="editorial-explore-btn" style={{ textDecoration: 'none' }}><span>{data.centerBtnText || 'Explore Collections'}</span><ArrowUpRight size={18} /></a>
                  </div>
                  <div className="editorial-col">
                    <a href={data.card5Link || '/shop?category=Fashion'} className="editorial-card shape-tab-right theme-sky" style={{ height: '495px' }}><img src={data.card5Img || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'} alt="Fashion 5" className="editorial-card-img" /></a>
                  </div>
                  <div className="editorial-col">
                    <a href={data.card6Link || '/shop?category=Fashion'} className="editorial-card shape-tab-left theme-mint" style={{ height: '340px' }}><img src={data.card6Img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'} alt="Fashion 6" className="editorial-card-img" /></a>
                    <a href={data.card7Link || '/shop?category=Fashion'} className="editorial-card shape-rounded-lg theme-forest" style={{ height: '140px' }}><img src={data.card7Img || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'} alt="Fashion 7" className="editorial-card-img" /></a>
                  </div>
                </div>
              </section>
            );

          case 'deals':
            return (
              <section key={section.id} className="deals-section">
                <div className="deals-section-header">
                  <div className="deals-title-wrap">
                    <h2 className="deals-main-title"><span>{data.title || '🔥 Deals You Can\'t Miss'}</span></h2>
                    <p className="deals-subtitle">{data.subtitle || 'ক্যাটাগরি ভিত্তিক আকর্ষণীয় ছাড় ও সেরা হট ডিলসসমূহ'}</p>
                  </div>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', fontWeight: '600' }} onClick={() => window.location.href = `/shop?category=${encodeURIComponent(activeDealsCategory === 'All' ? '' : activeDealsCategory)}`}>{data.viewAllText || 'সব দেখুন'}</button>
                </div>
                <div className="deals-category-tabs">
                  {dealsCategories.map((catName) => (
                    <button key={catName} type="button" className={`deals-tab-btn ${activeDealsCategory === catName ? 'active' : ''}`} onClick={() => setActiveDealsCategory(catName)}>{catName === 'All' ? '⚡ All Deals' : catName}</button>
                  ))}
                </div>
                <div className="featured-products-grid">
                  {(() => {
                    const allAvailableProducts = products.length > 0 ? products : defaultProducts;
                    const assignedIds = data.productIds || [];
                    const sourcePool = assignedIds.length > 0 ? allAvailableProducts.filter(p => assignedIds.includes(p.id)) : allAvailableProducts;
                    const filteredList = sourcePool.filter(p => { if (activeDealsCategory === 'All') return true; return p.category?.toLowerCase() === activeDealsCategory.toLowerCase(); });
                    return filteredList.slice(0, Number(data.limit) || 8).map((product) => <ProductCard key={product.id} product={product} showRating={true} />);
                  })()}
                </div>
              </section>
            );

          case 'featured':
            return (
              <div key={section.id} id="featured" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                  <div><h2 className="heading-lg" style={{ margin: 0 }}>{data.title || 'ফিচারড প্রোডাক্ট'}</h2><div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div></div>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => window.location.href = '/shop'}>সব দেখুন</button>
                </div>
                {loading ? <div style={{ textAlign: 'center', padding: '4rem' }}><div className="text-muted">Loading amazing products...</div></div> : (() => {
                  let featList = [];
                  if (products.length > 0) {
                    if (data.productIds?.length > 0) featList = products.filter(p => data.productIds.includes(p.id));
                    else featList = [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                  } else { featList = defaultProducts; }
                  featList = featList.slice(0, data.limit || 12);
                  if (data.sliderEnabled !== false) return <DualDirectionStepSlideshow products={featList} />;
                  return <div className="featured-products-grid">{featList.map((product) => <ProductCard key={product.id} product={product} showRating={true} />)}</div>;
                })()}
              </div>
            );

          case 'promo_bento':
            return (
              <section key={section.id} ref={bentoRef} className={`bento-banners-section ${bentoInView ? 'in-view' : ''}`} style={{ marginBottom: '3.5rem' }}>
                <div className="bento-banners-grid">
                  <div className="bento-col-left"><a href={data.card1Link || '/shop'} className="bento-banner-card card-large"><img src={data.card1Img || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'} alt="Bento 1" className="bento-banner-img" onError={(e) => e.target.src = 'https://placehold.co/400x400'}/></a></div>
                  <div className="bento-col-middle">
                    <a href={data.card2Link || '/shop'} className="bento-banner-card card-horizontal"><img src={data.card2Img || 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800'} alt="Bento 2" className="bento-banner-img" onError={(e) => e.target.src = 'https://placehold.co/400x200'}/></a>
                    <a href={data.card3Link || '/shop'} className="bento-banner-card card-horizontal"><img src={data.card3Img || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800'} alt="Bento 3" className="bento-banner-img" onError={(e) => e.target.src = 'https://placehold.co/400x200'}/></a>
                  </div>
                  <div className="bento-col-right"><a href={data.card4Link || '/shop'} className="bento-banner-card card-tall"><img src={data.card4Img || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'} alt="Bento 4" className="bento-banner-img" onError={(e) => e.target.src = 'https://placehold.co/200x400'}/></a></div>
                </div>
              </section>
            );

          case 'trending':
            return (
              <div key={section.id} id="trending-products" style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                  <div><h2 className="heading-lg" style={{ margin: 0 }}>{data.title || 'নতুন কালেকশন'}</h2><div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div></div>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => window.location.href = (data.buttonLink || '/shop')}>{data.buttonText || 'সব দেখুন'}</button>
                </div>
                {loading ? <div style={{ textAlign: 'center', padding: '4rem' }}><div className="text-muted">Loading amazing products...</div></div> : (() => {
                  let basePool = products.length > 0 ? products : defaultProducts;
                  if (data.category) basePool = basePool.filter(p => p.category?.toLowerCase() === data.category.toLowerCase());
                  const trendList = (basePool.length > 0 ? (data.productIds?.length > 0 ? basePool.filter(p => data.productIds.includes(p.id)) : basePool) : defaultProducts);
                  if (data.sliderEnabled) return <DualDirectionStepSlideshow products={trendList} />;
                  return <div className="featured-products-grid">{trendList.slice(0, Number(data.limit) || 8).map((product) => <ProductCard key={`trend-${product.id}`} product={product} showRating={true} />)}</div>;
                })()}
              </div>
            );

          case 'faq':
            return <FaqSection key={section.id} data={data} id={section.id} />;

          case 'custom':
            const sectionProducts = (products.length > 0 ? products : defaultProducts).filter(p => !data.category || p.category?.toLowerCase() === data.category?.toLowerCase()).slice(0, data.limit || 12);
            return (
              <div key={section.id} style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                  <div><h2 className="heading-lg" style={{ margin: 0 }}>{data.title}</h2><div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div></div>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => window.location.href = `/shop?category=${encodeURIComponent(data.category || '')}`}>সব দেখুন</button>
                </div>
                {data.displayMode !== 'grid' && sectionProducts.length > 3 ? (
                  <DualDirectionStepSlideshow products={sectionProducts} />
                ) : (
                  <div className="featured-products-grid">{sectionProducts.slice(0, data.limit || 8).map((product) => <ProductCard key={product.id} product={product} showRating={true} />)}</div>
                )}
              </div>
            );

          case 'product_grid':
            return (() => {
              let gridList = products.length > 0 ? [...products] : [...defaultProducts];
              
              if (data.productIds && data.productIds.length > 0) {
                 gridList = gridList.filter(p => data.productIds.includes(p.id));
              }

              switch (data.queryType) {
                case 'latest':
                  gridList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                  break;
                case 'oldest':
                  gridList.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                  break;
                case 'price_low_high':
                  gridList.sort((a, b) => (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0));
                  break;
                case 'price_high_low':
                  gridList.sort((a, b) => (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0));
                  break;
                case 'highest_rated':
                  gridList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                  break;
                default:
                  break;
              }

              const displayList = gridList.slice(0, data.limit || 8);

              return (
                <div key={section.id} style={{ marginBottom: '4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                      <h2 className="heading-lg" style={{ margin: 0 }}>{data.title || 'Products'}</h2>
                      <div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => window.location.href = '/shop'}>সব দেখুন</button>
                  </div>
                  {data.sliderEnabled ? (
                    <DualDirectionStepSlideshow products={displayList} />
                  ) : (
                    <div className="featured-products-grid">
                      {displayList.map((product) => <ProductCard key={`pg-${product.id}`} product={product} showRating={true} />)}
                    </div>
                  )}
                </div>
              );
            })();

          default:
            return null;
        }
      })}

    </div>
  );
};

export default Home;
