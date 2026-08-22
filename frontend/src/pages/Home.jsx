import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight, Smartphone, Shirt, Home as HomeIcon, Sparkles, Trophy, Gem, Star, Zap, Heart, ShoppingBag, PackageSearch } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';

const IconMap = {
  ShieldCheck, Truck, RotateCcw, Smartphone, Shirt, Home: HomeIcon, Sparkles, Trophy, Gem, Star, Zap, Heart, ShoppingBag, PackageSearch
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [uiConfig, setUiConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 59 });
  
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    { id: 1, text: 'ফ্রি শিপিং', icon: 'Truck' },
    { id: 2, text: 'নিরাপদ পেমেন্ট', icon: 'ShieldCheck' },
    { id: 3, text: '৩০-দিন রিটার্ন পলিসি', icon: 'RotateCcw' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, configRes] = await Promise.all([
          fetch(import.meta.env.VITE_API_URL + '/api/products'),
          fetch(import.meta.env.VITE_API_URL + '/api/settings/storefront_ui')
        ]);
        const prodData = await prodRes.json();
        const configData = await configRes.json();
        setProducts(Array.isArray(prodData) ? prodData : []);
        setUiConfig(configData);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setProducts([]);
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
        <div style={{ marginBottom: '4rem', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '500px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
          {uiConfig?.singleHeroImage ? (
            <a href={uiConfig?.singleHeroLink || '#'} style={{ display: 'block', width: '100%', height: '100%' }}>
              <img src={uiConfig.singleHeroImage} alt="Hero Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </a>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>No hero image configured</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            
            {/* Left: Carousel */}
            <div style={{ flex: '1 1 65%', minWidth: '300px', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '450px', background: '#f3f4f6', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              {(uiConfig?.heroBanners?.length > 0 ? uiConfig.heroBanners : slides).map((slide, idx) => (
                <div 
                  key={slide.id}
                  style={{
                    position: 'absolute', inset: 0, 
                    opacity: currentSlide === idx ? 1 : 0, 
                    transition: 'opacity 0.8s ease-in-out',
                    zIndex: currentSlide === idx ? 1 : 0
                  }}
                >
                  <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', display: 'block' }}>
                      {slide.subtitle}
                    </span>
                    <h2 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '2rem', maxWidth: '500px' }}>
                      {slide.title}
                    </h2>
                    <button className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '1rem 2.5rem', fontSize: '1.1rem' }} onClick={() => window.location.href = slide.link || '/shop'}>
                      এখুনি কিনুন
                    </button>
                  </div>
                </div>
              ))}

              {/* Carousel Controls */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? (uiConfig?.heroBanners?.length || slides.length) - 1 : prev - 1))}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % (uiConfig?.heroBanners?.length || slides.length))}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Right: Vertical Banner */}
            <div style={{ flex: '1 1 30%', minWidth: '250px', borderRadius: '16px', overflow: 'hidden', position: 'relative', height: '450px', background: 'var(--accent-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
               <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at top right, white, transparent 70%)' }}></div>
               <div style={{ position: 'relative', zIndex: 1 }}>
                 <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>স্পেশাল অফার</h3>
                 <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '2rem' }}>নতুন সব পণ্যে ২০% ছাড়!</p>
                 <button style={{ background: 'var(--accent-secondary)', color: 'var(--text-primary)', border: 'none', padding: '0.875rem 2rem', borderRadius: '99px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                   অফারটি গ্রহণ করুন
                 </button>
               </div>
            </div>
          </div>

          {/* 3 Promotional Images Under Hero */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {(uiConfig?.promotionalBanners?.length > 0 ? uiConfig.promotionalBanners : defaultPromos).map((promo, idx) => (
              <div 
                key={promo.id || idx} 
                style={{ height: '220px', borderRadius: '16px', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                onClick={() => window.location.href = promo.link || '/shop'}
              >
                 <img src={promo.image} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '1.5rem', pointerEvents: 'none' }}>
                   <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.5rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{promo.title}</h3>
                 </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trust Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '2rem 0', marginBottom: '4rem' }}>
        {(uiConfig?.trustBadges?.length > 0 ? uiConfig.trustBadges : defaultTrustBadges).map((badge, idx) => {
          const IconComp = IconMap[badge.icon] || IconMap.Star;
          return (
            <div key={badge.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'rgba(15, 81, 50, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                <IconComp size={24} color="var(--accent-primary)" />
              </div>
              <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{badge.text}</span>
            </div>
          );
        })}
      </div>

      {/* Super Hour Deals */}
      <div className="super-hour-container">
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 className="super-hour-title">
              ⚡ সুপার আওয়ার ডিলস
            </h2>
            <p className="super-hour-subtitle">
              সময় শেষ হওয়ার আগেই দারুণ সব অফারে আপনার পছন্দের পণ্যটি বুঝে নিন!
            </p>
          </div>
          
          <div className="super-hour-timer-wrap">
            <span style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', marginRight: '0.5rem' }}>Ends In:</span>
            <div style={{ display: 'flex', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'white', color: 'var(--accent-primary)', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: '1' }}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase' }}>Hrs</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center' }}>:</span>
              <div style={{ background: 'white', color: 'var(--accent-primary)', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: '1' }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase' }}>Min</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center' }}>:</span>
              <div style={{ background: 'var(--accent-secondary)', color: 'white', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: '1' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase' }}>Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button 
            onClick={() => scrollCarousel('left')}
            style={{ position: 'absolute', left: '-1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--accent-secondary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scrollCarousel('right')}
            style={{ position: 'absolute', right: '-1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'var(--accent-secondary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          >
            <ChevronRight size={24} />
          </button>

          <div 
            ref={carouselRef}
            className="super-hour-scroll" 
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ display: 'flex', alignItems: 'stretch', gap: '1.5rem', overflowX: 'auto', paddingBottom: '2rem', paddingRight: '2rem', margin: '0 -1rem', paddingLeft: '1rem', cursor: isDragging ? 'grabbing' : 'grab', scrollBehavior: isDragging ? 'auto' : 'smooth' }}
          >
            {loading ? (
              <div style={{ padding: '2rem', color: 'white' }}>Loading super deals...</div>
            ) : (
              products.filter(p => uiConfig?.superHourDeals?.productIds?.includes(p.id) || !uiConfig).map((product) => (
                <div key={product.id} style={{ minWidth: '260px', maxWidth: '260px', width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <ProductCard product={product} showRating={true} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="featured" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="heading-lg" style={{ margin: 0 }}>{uiConfig?.featuredProducts?.title || 'ফিচারড প্রোডাক্ট'}</h2>
            <div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>সব দেখুন</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="text-muted">Loading amazing products...</div>
          </div>
        ) : (
          <div className="featured-products-grid">
            {products.filter(p => uiConfig?.featuredProducts?.productIds?.includes(p.id) || !uiConfig).slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} showRating={true} />
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Custom Sections */}
      {uiConfig?.customSections?.map((section) => (
        <div key={section.id} style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="heading-lg" style={{ margin: 0 }}>{section.title}</h2>
              <div style={{ width: '80px', height: '4px', background: 'var(--accent-secondary)', marginTop: '0.75rem', borderRadius: '2px' }}></div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>সব দেখুন</button>
          </div>

          <div className="featured-products-grid">
            {products
              .filter(p => p.category === section.category)
              .slice(0, section.limit)
              .map((product) => (
                <ProductCard key={product.id} product={product} showRating={true} />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
};

export default Home;
