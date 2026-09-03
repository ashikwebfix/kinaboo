import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, Smartphone, Shirt, Home as HomeIcon, Sparkles, Trophy, Gem, Star, Zap, Heart, ShoppingBag, PackageSearch, ArrowUpRight, Clock } from 'lucide-react';
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

      {/* Hero Section */}
      {uiConfig?.heroType === 'single' ? (
        <div style={{ marginBottom: '3.5rem', borderRadius: '20px', overflow: 'hidden', position: 'relative', width: '100%', height: 'auto', boxShadow: '0 10px 25px -5px rgba(43,45,66,0.1)' }}>
          {uiConfig?.singleHeroImage ? (
            <a href={uiConfig?.singleHeroLink || '#'} style={{ display: 'block', width: '100%', height: 'auto' }}>
              <img src={uiConfig.singleHeroImage} alt="Hero Banner" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </a>
          ) : (
            <div style={{ width: '100%', height: '480px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>No hero image configured</span>
            </div>
          )}
        </div>
      ) : (
        <section className="modern-hero-section">
          {/* Top Hero Grid: Left Carousel (2 cols) + Right Special Offer Card (1 col) */}
          <div className="modern-hero-grid">

            {/* Left: Main Hero Carousel Card */}
            <div className="hero-carousel-card">
              {(uiConfig?.heroBanners?.length > 0 ? uiConfig.heroBanners : slides).map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`hero-slide-item ${currentSlide === idx ? 'active' : ''}`}
                >
                  <img src={slide.image} alt={slide.title} className="hero-slide-image" />

                  {/* Glassmorphic Layered Text Overlay */}
                  <div className="hero-slide-overlay">
                    <div className="hero-badge-pill">
                      <span className="hero-pulse-dot"></span>
                      <span>{slide.subtitle || '✨ New Season Drops'}</span>
                    </div>

                    <h2 className="hero-slide-title">
                      {slide.title}
                    </h2>

                    <p className="hero-slide-subtitle">
                      Discover authentic premium collection with fast delivery & guaranteed quality.
                    </p>

                    <div className="hero-action-row">
                      <button
                        className="hero-cta-btn-primary"
                        onClick={() => window.location.href = slide.link || '/shop'}
                      >
                        <span>এখুনি কিনুন</span>
                        <ChevronRight size={18} />
                      </button>
                      <button
                        className="hero-cta-btn-secondary"
                        onClick={() => window.location.href = '/shop'}
                      >
                        <span>সব পণ্য দেখুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Carousel Controls */}
              <button
                className="hero-nav-arrow prev"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? (uiConfig?.heroBanners?.length || slides.length) - 1 : prev - 1))}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                className="hero-nav-arrow next"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % (uiConfig?.heroBanners?.length || slides.length))}
                aria-label="Next Slide"
              >
                <ChevronRight size={22} />
              </button>

              {/* Slide Indicator Pills */}
              <div className="hero-dots-container">
                {(uiConfig?.heroBanners?.length > 0 ? uiConfig.heroBanners : slides).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    className={`hero-dot-pill ${currentSlide === dotIdx ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Modern Special Offer Card with Live Countdown Widget */}
            <div className="hero-special-offer-card">
              <div className="hero-offer-glow-1"></div>
              <div className="hero-offer-glow-2"></div>

              {/* Card Top */}
              <div className="hero-offer-top">
                <div className="hero-offer-badge">
                  <span>⚡ LIMITED TIME OFFER</span>
                </div>
              </div>

              {/* Card Center */}
              <div className="hero-offer-center">
                <h3 className="hero-offer-title">স্পেশাল মেগা অফার</h3>
                <p className="hero-offer-subtitle">নতুন সব ট্রেন্ডি পণ্যে ফ্ল্যাট ২০% থেকে ৫০% পর্যন্ত আকর্ষণীয় ছাড়!</p>

                {/* Live Mini Countdown Widget */}
                <div className="hero-offer-timer-box">
                  <div className="offer-timer-item">
                    <span className="offer-timer-digit">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="offer-timer-unit">Hours</span>
                  </div>
                  <span className="offer-timer-divider">:</span>
                  <div className="offer-timer-item">
                    <span className="offer-timer-digit">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="offer-timer-unit">Mins</span>
                  </div>
                  <span className="offer-timer-divider">:</span>
                  <div className="offer-timer-item">
                    <span className="offer-timer-digit">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="offer-timer-unit">Secs</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom Button */}
              <div className="hero-offer-bottom">
                <button
                  className="hero-offer-cta-btn"
                  onClick={() => window.location.href = '/shop?sort=discount'}
                >
                  <span>অফারটি গ্রহণ করুন</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Explore Popular Categories Circle Showcase */}
      {uiConfig?.popularCategories?.enabled !== false && (
        <section className="popular-categories-section">
          <div className="popular-categories-header">
            <h2 className="popular-categories-title">
              {uiConfig?.popularCategories?.title || 'Explore Popular Categories'}
            </h2>
            <a href={uiConfig?.popularCategories?.viewAllLink || '/shop'} className="popular-categories-view-all">
              <span>{uiConfig?.popularCategories?.viewAllText || 'View All'}</span>
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="popular-categories-slider-wrap">
            <button
              type="button"
              className="popular-categories-nav-btn prev"
              onClick={() => scrollCategories('left')}
              aria-label="Previous categories"
            >
              <ChevronLeft size={18} />
            </button>

            <div ref={categoryScrollRef} className="popular-categories-scroll">
              {(() => {
                // 1. Custom category items configured by admin
                if (uiConfig?.popularCategories?.items && uiConfig.popularCategories.items.length > 0) {
                  return uiConfig.popularCategories.items.map((cat, idx) => {
                    const catName = cat.name || 'Category';
                    const catImg = cat.image || defaultPopularCategories[idx % defaultPopularCategories.length]?.image;
                    const catLink = cat.link || `/shop?category=${encodeURIComponent(catName)}`;

                    return (
                      <a
                        key={cat.id || idx}
                        href={catLink}
                        className="popular-category-item"
                      >
                        <div className="popular-category-circle">
                          <img
                            src={catImg}
                            alt={catName}
                            className="popular-category-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/150x150?text=Category';
                            }}
                          />
                        </div>
                        <span className="popular-category-name" title={catName}>
                          {catName}
                        </span>
                      </a>
                    );
                  });
                }

                // 2. Filtered or sorted from database categories
                const baseCats = categories.length > 0 ? categories : defaultPopularCategories;
                const filteredCats = (uiConfig?.popularCategories?.selectedCategoryNames && uiConfig.popularCategories.selectedCategoryNames.length > 0)
                  ? baseCats.filter(c => uiConfig.popularCategories.selectedCategoryNames.includes(c.name || c.title))
                  : baseCats;

                return filteredCats.map((cat, idx) => {
                  const catName = cat.name || cat.title || 'Category';
                  const catImg = cat.image || defaultPopularCategories[idx % defaultPopularCategories.length]?.image;

                  return (
                    <a
                      key={cat.id || idx}
                      href={`/shop?category=${encodeURIComponent(catName)}`}
                      className="popular-category-item"
                    >
                      <div className="popular-category-circle">
                        <img
                          src={catImg}
                          alt={catName}
                          className="popular-category-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/150x150?text=Category';
                          }}
                        />
                      </div>
                      <span className="popular-category-name" title={catName}>
                        {catName}
                      </span>
                    </a>
                  );
                });
              })()}
            </div>

            <button
              type="button"
              className="popular-categories-nav-btn next"
              onClick={() => scrollCategories('right')}
              aria-label="Next categories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* Super Hour Deals - Ultra Luxury Modern Redesign */}
      <section className="super-hour-container">
        {/* Ambient Decorative Lighting */}
        <div className="super-hour-glow-1"></div>
        <div className="super-hour-glow-2"></div>
        <div className="super-hour-glow-3"></div>

        <div className="super-hour-header">
          <div className="super-hour-header-left">
            <div className="super-hour-tag">
              <span className="super-hour-pulse-dot"></span>
              <span>LIMITED TIME OFFER • ফ্ল্যাশ সেল</span>
            </div>
            <h2 className="super-hour-title">
              <span className="super-hour-icon-wrap">⚡</span>
              <span>সুপার আওয়ার ডিলস</span>
            </h2>
            <p className="super-hour-subtitle">
              সময় শেষ হওয়ার আগেই আকর্ষণীয় ছাড়ে আপনার পছন্দের গ্যাজেট ও ফ্যাশন বুঝে নিন!
            </p>
          </div>

          <div className="super-hour-header-right">
            {/* Countdown Timer */}
            <div className="super-hour-timer-card">
              <div className="timer-label">
                <Clock size={14} className="timer-icon" />
                <span>অফার শেষ হতে বাকি</span>
              </div>
              <div className="timer-digits-row">
                <div className="timer-digit-box">
                  <span className="digit-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="digit-label">ঘণ্টা</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="timer-digit-box">
                  <span className="digit-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="digit-label">মিনিট</span>
                </div>
                <span className="timer-separator">:</span>
                <div className="timer-digit-box pulse-sec">
                  <span className="digit-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="digit-label">সেকেন্ড</span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="super-hour-nav-controls">
              <button
                type="button"
                className="super-hour-nav-btn"
                onClick={() => scrollCarousel('left')}
                title="Previous"
                aria-label="Previous deals"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="super-hour-nav-btn"
                onClick={() => scrollCarousel('right')}
                title="Next"
                aria-label="Next deals"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider */}
        <div className="super-hour-slider-wrapper">
          <div
            ref={carouselRef}
            className="super-hour-scroll"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {loading ? (
              <div className="super-hour-loading">
                <p>ডিল লোড হচ্ছে...</p>
              </div>
            ) : (
              (products.length > 0
                ? (uiConfig?.superHourDeals?.productIds?.length > 0 ? products.filter(p => uiConfig.superHourDeals.productIds.includes(p.id)) : products)
                : defaultProducts
              ).map((product) => (
                <div key={product.id} className="super-hour-card-item">
                  <ProductCard product={product} showRating={true} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Editorial Fashion Showcase (Matching Design Reference) */}
      {uiConfig?.editorialShowcase?.enabled !== false && (
        <section ref={editorialRef} className={`editorial-showcase-section ${editorialInView ? 'in-view' : ''}`}>
          <div className="editorial-header">
            {/* Center Main Headline */}
            <div className="editorial-title-wrap">
              <h2 className="editorial-main-title">
                {uiConfig?.editorialShowcase?.title || 'Elevate Your Style With Bold Fashion'}
              </h2>
            </div>
          </div>

          {/* 5-Column Dynamic Collage Grid */}
          <div className="editorial-grid">

            {/* Column 1: Orange Tall Top + Amber Bottom */}
            <div className="editorial-col">
              <a
                href={uiConfig?.editorialShowcase?.card1Link || '/shop?category=Fashion'}
                className="editorial-card shape-arch-top theme-orange"
                style={{ height: '340px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card1Img || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 1"
                  className="editorial-card-img"
                />
              </a>
              <a
                href={uiConfig?.editorialShowcase?.card2Link || '/shop?category=Fashion'}
                className="editorial-card shape-rounded-lg theme-amber"
                style={{ height: '140px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card2Img || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 2"
                  className="editorial-card-img"
                />
              </a>
            </div>

            {/* Column 2: Lime Green Emerald Coat Tall */}
            <div className="editorial-col">
              <a
                href={uiConfig?.editorialShowcase?.card3Link || '/shop?category=Fashion'}
                className="editorial-card shape-tab-left theme-lime"
                style={{ height: '495px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card3Img || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 3"
                  className="editorial-card-img"
                />
              </a>
            </div>

            {/* Column 3 (Center): Center Card + Starburst + Explore Collections Button */}
            <div className="editorial-col editorial-center-col">
              <div className="starburst-icon-wrap">
                <Sparkles size={28} />
              </div>

              <a
                href={uiConfig?.editorialShowcase?.card4Link || '/shop'}
                className="editorial-card shape-square-center theme-yellow"
                style={{ width: '100%', height: '320px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card4Img || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 4"
                  className="editorial-card-img"
                />
              </a>

              <a
                href={uiConfig?.editorialShowcase?.centerBtnLink || '/shop'}
                className="editorial-explore-btn"
                style={{ textDecoration: 'none' }}
              >
                <span>{uiConfig?.editorialShowcase?.centerBtnText || 'Explore Collections'}</span>
                <ArrowUpRight size={18} />
              </a>
            </div>

            {/* Column 4: Sky Blue Tracksuit Tall */}
            <div className="editorial-col">
              <a
                href={uiConfig?.editorialShowcase?.card5Link || '/shop?category=Fashion'}
                className="editorial-card shape-tab-right theme-sky"
                style={{ height: '495px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card5Img || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 5"
                  className="editorial-card-img"
                />
              </a>
            </div>

            {/* Column 5: Top + Bottom */}
            <div className="editorial-col">
              <a
                href={uiConfig?.editorialShowcase?.card6Link || '/shop?category=Fashion'}
                className="editorial-card shape-tab-left theme-mint"
                style={{ height: '340px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card6Img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 6"
                  className="editorial-card-img"
                />
              </a>
              <a
                href={uiConfig?.editorialShowcase?.card7Link || '/shop?category=Fashion'}
                className="editorial-card shape-rounded-lg theme-forest"
                style={{ height: '140px' }}
              >
                <img
                  src={uiConfig?.editorialShowcase?.card7Img || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'}
                  alt="Fashion Showcase 7"
                  className="editorial-card-img"
                />
              </a>
            </div>

          </div>
        </section>
      )}

      {/* Category-Wise Deals: Deals You Can't Miss */}
      {uiConfig?.dealsSection?.enabled !== false && (
        <section className="deals-section">
          <div className="deals-section-header">
            <div className="deals-title-wrap">
              <h2 className="deals-main-title">
                <span>{uiConfig?.dealsSection?.title || '🔥 Deals You Can\'t Miss'}</span>
              </h2>
              <p className="deals-subtitle">
                {uiConfig?.dealsSection?.subtitle || 'ক্যাটাগরি ভিত্তিক আকর্ষণীয় ছাড় ও সেরা হট ডিলসসমূহ'}
              </p>
            </div>

            <button
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1.5rem', fontWeight: '600' }}
              onClick={() => window.location.href = `/shop?category=${encodeURIComponent(activeDealsCategory === 'All' ? '' : activeDealsCategory)}`}
            >
              {uiConfig?.dealsSection?.viewAllText || 'সব দেখুন'}
            </button>
          </div>

          {/* Category Tabs Filter */}
          <div className="deals-category-tabs">
            {dealsCategories.map((catName) => (
              <button
                key={catName}
                type="button"
                className={`deals-tab-btn ${activeDealsCategory === catName ? 'active' : ''}`}
                onClick={() => setActiveDealsCategory(catName)}
              >
                {catName === 'All' ? '⚡ All Deals' : catName}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="featured-products-grid">
            {(() => {
              const allAvailableProducts = products.length > 0 ? products : defaultProducts;
              const assignedIds = uiConfig?.dealsSection?.productIds || [];
              const sourcePool = assignedIds.length > 0
                ? allAvailableProducts.filter(p => assignedIds.includes(p.id))
                : allAvailableProducts;

              const filteredList = sourcePool.filter(p => {
                if (activeDealsCategory === 'All') return true;
                return p.category?.toLowerCase() === activeDealsCategory.toLowerCase();
              });

              const limit = Number(uiConfig?.dealsSection?.limit) || 8;

              return filteredList.slice(0, limit).map((product) => (
                <ProductCard key={product.id} product={product} showRating={true} />
              ));
            })()}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <div id="featured" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="heading-lg" style={{ margin: 0 }}>{uiConfig?.featuredProducts?.title || 'ফিচারড প্রোডাক্ট'}</h2>
            <div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => window.location.href = '/shop'}>সব দেখুন</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="text-muted">Loading amazing products...</div>
          </div>
        ) : (
          (() => {
            const featList = (products.length > 0
              ? (uiConfig?.featuredProducts?.productIds?.length > 0 ? products.filter(p => uiConfig.featuredProducts.productIds.includes(p.id)) : products)
              : defaultProducts
            );

            const isSliderOn = uiConfig?.featuredProducts?.sliderEnabled !== false;

            if (isSliderOn) {
              return <DualDirectionStepSlideshow products={featList} />;
            }

            return (
              <div className="featured-products-grid">
                {featList.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} showRating={true} />
                ))}
              </div>
            );
          })()
        )}
      </div>

      {/* 3-Column Promotional Bento Banner Showcase */}
      {uiConfig?.promoBentoShowcase?.enabled !== false && (
        <section ref={bentoRef} className={`bento-banners-section ${bentoInView ? 'in-view' : ''}`} style={{ marginBottom: '3.5rem' }}>
          <div className="bento-banners-grid">

            {/* Left Column: Large Square Banner (Headphones & Keyboard) */}
            <div className="bento-col-left">
              <a
                href={uiConfig?.promoBentoShowcase?.card1Link || '/shop?category=Electronics'}
                className="bento-banner-card card-large"
              >
                <img
                  src={uiConfig?.promoBentoShowcase?.card1Img || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'}
                  alt="Headphones & Electronics"
                  className="bento-banner-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </a>
            </div>

            {/* Middle Column: 2 Stacked Horizontal Banners */}
            <div className="bento-col-middle">
              <a
                href={uiConfig?.promoBentoShowcase?.card2Link || '/shop?category=Appliances'}
                className="bento-banner-card card-horizontal"
              >
                <img
                  src={uiConfig?.promoBentoShowcase?.card2Img || 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800'}
                  alt="Home & Appliances"
                  className="bento-banner-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </a>

              <a
                href={uiConfig?.promoBentoShowcase?.card3Link || '/shop?category=Groceries'}
                className="bento-banner-card card-horizontal"
              >
                <img
                  src={uiConfig?.promoBentoShowcase?.card3Img || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800'}
                  alt="Daily Essentials"
                  className="bento-banner-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </a>
            </div>

            {/* Right Column: Tall Vertical Portrait Banner (Cosmetics & Skincare) */}
            <div className="bento-col-right">
              <a
                href={uiConfig?.promoBentoShowcase?.card4Link || '/shop?category=Health+%26+Beauty'}
                className="bento-banner-card card-tall"
              >
                <img
                  src={uiConfig?.promoBentoShowcase?.card4Img || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'}
                  alt="Cosmetics & Skincare"
                  className="bento-banner-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </a>
            </div>

          </div>
        </section>
      )}

      {/* Trending / New Arrival Products (After Bento Banners Grid) */}
      {uiConfig?.trendingProducts?.enabled !== false && (
        <div id="trending-products" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="heading-lg" style={{ margin: 0 }}>
                {uiConfig?.trendingProducts?.title || 'নতুন কালেকশন'}
              </h2>
              <div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div>
            </div>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1.5rem' }}
              onClick={() => window.location.href = (uiConfig?.trendingProducts?.buttonLink || '/shop')}
            >
              {uiConfig?.trendingProducts?.buttonText || 'সব দেখুন'}
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div className="text-muted">Loading amazing products...</div>
            </div>
          ) : (
            (() => {
              const catFilter = uiConfig?.trendingProducts?.category;
              let basePool = products.length > 0 ? products : defaultProducts;

              if (catFilter) {
                basePool = basePool.filter(p => p.category?.toLowerCase() === catFilter.toLowerCase());
              }

              const trendList = (basePool.length > 0
                ? (uiConfig?.trendingProducts?.productIds?.length > 0
                  ? basePool.filter(p => uiConfig.trendingProducts.productIds.includes(p.id))
                  : (uiConfig?.featuredProducts?.productIds?.length > 0
                    ? basePool.filter(p => !uiConfig.featuredProducts.productIds.includes(p.id))
                    : basePool)
                )
                : defaultProducts
              );

              const isSliderOn = uiConfig?.trendingProducts?.sliderEnabled === true;

              if (isSliderOn) {
                return <DualDirectionStepSlideshow products={trendList} />;
              }

              const displayLimit = Number(uiConfig?.trendingProducts?.limit) || 8;

              return (
                <div className="featured-products-grid">
                  {trendList.slice(0, displayLimit).map((product) => (
                    <ProductCard key={`trend-${product.id}`} product={product} showRating={true} />
                  ))}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* Dynamic Custom Sections */}
      {uiConfig?.customSections?.map((section) => {
        const sectionProducts = (products.length > 0 ? products : defaultProducts)
          .filter(p => !section.category || p.category?.toLowerCase() === section.category?.toLowerCase())
          .slice(0, section.limit || 12);

        const isCustomSlider = section.displayMode !== 'grid';

        return (
          <div key={section.id} style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h2 className="heading-lg" style={{ margin: 0 }}>{section.title}</h2>
                <div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }} onClick={() => window.location.href = `/shop?category=${encodeURIComponent(section.category || '')}`}>সব দেখুন</button>
            </div>

            {isCustomSlider && sectionProducts.length > 3 ? (
              <DualDirectionStepSlideshow products={sectionProducts} />
            ) : (
              <div className="featured-products-grid">
                {sectionProducts.slice(0, section.limit || 8).map((product) => (
                  <ProductCard key={product.id} product={product} showRating={true} />
                ))}
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
};

export default Home;
