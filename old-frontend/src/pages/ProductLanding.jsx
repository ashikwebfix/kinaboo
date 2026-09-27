import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Truck, ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { trackViewContent, trackBeginCheckout, trackPurchase, getCookie } from '../utils/tracking';

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;

const ProductLanding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [faqOpen, setFaqOpen] = useState(null);
  const [isHoveringReviews, setIsHoveringReviews] = useState(false);
  const [isHoveringReels, setIsHoveringReels] = useState(false);
  
  const reelsCarouselRef = useRef(null);
  const reviewsCarouselRef = useRef(null);
  
  const scrollReels = (dir) => {
    const carousel = reelsCarouselRef.current;
    if (carousel) {
      const cardWidth = carousel.children[0]?.clientWidth || 250;
      carousel.scrollBy({ left: dir === 'left' ? -(cardWidth + 24) : (cardWidth + 24), behavior: 'smooth' });
    }
  };

  const scrollReviews = (dir) => {
    const carousel = reviewsCarouselRef.current;
    if (carousel) {
      const cardWidth = carousel.children[0]?.clientWidth || 300;
      carousel.scrollBy({ left: dir === 'left' ? -(cardWidth + 24) : (cardWidth + 24), behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHoveringReviews) return;
    const interval = setInterval(() => {
      scrollReviews('right');
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveringReviews]);

  useEffect(() => {
    if (isHoveringReels) return;
    const interval = setInterval(() => {
      scrollReels('right');
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveringReels]);

  // Form states
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [address, setAddress] = useState(userInfo?.address || '');
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          trackViewContent(data);
          
          // Track begin checkout immediately as it's a direct purchase page
          trackBeginCheckout(
            [{ ...data, qty: 1 }],
            data.sellPrice || data.price
          );
        } else {
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    const fetchMethods = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/settings/delivery_methods`);
        const data = await res.json();
        setDeliveryMethods(data);
        if (data.length > 0) {
          setSelectedMethodId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching delivery methods", error);
      }
    };
    fetchMethods();
  }, [slug, apiUrl]);

  // Abandoned Cart tracking for landing page
  useEffect(() => {
    if (product && phone && phone.replace(/[^0-9]/g, '').length >= 10) {
      const timer = setTimeout(async () => {
        try {
          await fetch(`${apiUrl}/api/abandoned-carts/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone,
              name,
              cartData: [{ ...product, qty }],
              totalValue: (product.sellPrice || product.price) * qty,
              fbp: getCookie('_fbp'),
              fbc: getCookie('_fbc')
            })
          });
        } catch (err) {}
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phone, name, product, qty, apiUrl]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedMethodId) {
      toast.error('অনুগ্রহ করে ডেলিভারির মাধ্যম নির্বাচন করুন।');
      return;
    }

    if (!bdPhoneRegex.test(phone)) {
      toast.error('অনুগ্রহ করে সঠিক মোবাইল নাম্বার দিন।');
      return;
    }

    if (address.trim().length < 4) {
      toast.error('অনুগ্রহ করে সম্পূর্ণ ঠিকানা দিন।');
      return;
    }

    setIsSubmitting(true);

    const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId);
    const shippingCost = selectedMethod ? Number(selectedMethod.charge) : 0;
    const itemsPrice = (product.sellPrice || product.price) * qty;
    const totalPrice = itemsPrice + shippingCost;

    const orderItem = {
      productId: product.id,
      qty,
      price: product.sellPrice || product.price,
      selectedVariations: {}
    };

    try {
      const orderData = {
        name,
        phone,
        shippingAddress: address,
        city: selectedMethod ? selectedMethod.name : 'Standard Delivery',
        postalCode: 'N/A',
        totalPrice,
        paymentMethod: 'Cash on Delivery',
        shippingCost,
        discount: 0,
        couponCode: null,
        orderItems: [orderItem],
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
      };

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const responseData = await res.json();
        trackPurchase(responseData, [{ ...product, qty }]);
        navigate(`/thank-you/${responseData.id}`);
      } else {
        toast.error('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।');
      }
    } catch (error) {
      console.error(error);
      toast.error('অর্ডার প্লেস করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId);
  const shippingCost = selectedMethod ? Number(selectedMethod.charge) : 0;
  const itemsPrice = (product.sellPrice || product.price) * qty;
  const totalPrice = itemsPrice + shippingCost;
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://placehold.co/800x800?text=No+Image');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Helmet>
        <title>{product.name} - কিনুন এখনই</title>
      </Helmet>

      {/* Main Container */}
      <style>{`
        .landing-container { display: flex; flex-direction: column; }
        .landing-left { padding-bottom: 2rem; min-width: 0; }
        .landing-right { background: #f8fafc; border-top: 2px solid #e2e8f0; }
        .reels-carousel::-webkit-scrollbar { display: none; }
        .reel-card { flex: 0 0 85%; scroll-snap-align: start; border-radius: 12px; overflow: hidden; aspect-ratio: 9/16; background: #000; }
        .reel-card iframe { width: 100%; height: 100%; border: none; }
        .reviews-carousel::-webkit-scrollbar { display: none; }
        .review-card { flex: 0 0 85%; scroll-snap-align: start; padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; display: flex; flex-direction: column; }
        
        .hero-section { padding: 1rem 1rem; text-align: center; background: linear-gradient(to bottom, #eff6ff, #fff); }
        .hero-title { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem; line-height: 1.25; }
        .hero-main-img-wrapper { max-width: 350px; margin: 0 auto 0.75rem; position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .hero-thumbs-wrapper { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; max-width: 350px; margin: 0 auto 0.75rem; }
        .hero-price-wrapper { display: flex; justify-content: center; align-items: baseline; gap: 0.5rem; margin-bottom: 1rem; }
        .hero-price { font-size: 1.8rem; font-weight: 800; color: var(--accent-primary); }
        .hero-compare-price { font-size: 1.1rem; color: #94a3b8; text-decoration: line-through; font-weight: 500; }
        .hero-btn { padding: 0.75rem; font-size: 1.1rem; width: 100%; max-width: 350px; margin: 0 auto; background: #ef4444; color: #fff; font-weight: 700; border-radius: 50px; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4); transition: transform 0.2s; }

        @media (min-width: 768px) {
          .reel-card, .review-card { flex: 0 0 calc(50% - 0.5rem); }
          .hero-section { padding: 2rem 1.5rem; }
          .hero-title { font-size: 1.8rem; margin-bottom: 1rem; line-height: 1.3; }
          .hero-main-img-wrapper { max-width: 500px; margin-bottom: 1.5rem; border-radius: 16px; }
          .hero-thumbs-wrapper { max-width: 500px; margin-bottom: 1.5rem; }
          .hero-price-wrapper { gap: 1rem; margin-bottom: 1.5rem; }
          .hero-price { font-size: 2.5rem; }
          .hero-compare-price { font-size: 1.25rem; }
          .hero-btn { padding: 1rem; font-size: 1.2rem; max-width: 400px; }
        }
        @media (min-width: 1024px) {
          .reel-card, .review-card { flex: 0 0 calc(25% - 0.75rem); }
        }
      `}</style>
      <div className="landing-container" style={{ width: '100%', maxWidth: '1366px', margin: '0 auto', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minHeight: '100vh' }}>
        
        <div className="landing-left">
          {/* Header / Hero */}
          <div className="hero-section">
          <h1 className="hero-title">
            {product.name}
          </h1>
          
          <div className="hero-main-img-wrapper">
            <img src={mainImage} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '350px', objectFit: 'contain' }} />
            {product.comparePrice > product.sellPrice && (
               <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                 SAVE {Math.round(((product.comparePrice - product.sellPrice) / product.comparePrice) * 100)}%
               </div>
            )}
          </div>

          {/* Multiple Images at the top */}
          {product.images && product.images.length > 1 && (
            <div className="hero-thumbs-wrapper">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.name} - image ${idx + 1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => {
                  const temp = [...product.images];
                  temp[idx] = product.images[0];
                  temp[0] = img;
                  setProduct({...product, images: temp});
                }} />
              ))}
            </div>
          )}

          <div className="hero-price-wrapper">
            <span className="hero-price">৳ {product.sellPrice || product.price}</span>
            {product.comparePrice > product.sellPrice && (
              <span className="hero-compare-price">৳ {product.comparePrice}</span>
            )}
          </div>

          <button 
            onClick={() => document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' })}
            className="hero-btn"
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            অর্ডার করতে ক্লিক করুন <ChevronRight size={24} />
          </button>
        </div>

        {/* Benefits Section */}
        <div style={{ padding: '2rem 1.5rem', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.25rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <Truck size={24} color="var(--accent-primary)" />
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>হোম ডেলিভারি</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.25rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <ShieldCheck size={24} color="#10b981" />
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>ক্যাশ অন ডেলিভারি</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.25rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <CheckCircle2 size={24} color="#3b82f6" />
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>অরজিনাল প্রোডাক্ট</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0.25rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <Star size={24} color="#f59e0b" />
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>সেরা মান</div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div style={{ padding: '2rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>প্রোডাক্টের বিবরণ</h2>
          
          {product.keypoints && product.keypoints.length > 0 && (
            <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: '1.5rem' }}>
              {product.keypoints.map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
                  <CheckCircle2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          
          {product.longDescription ? (
            <div 
              style={{ color: '#475569', lineHeight: 1.8, marginTop: '2rem' }}
              dangerouslySetInnerHTML={{ __html: product.longDescription }} 
            />
          ) : (
            <div 
              style={{ color: '#475569', lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          )}
        </div>

        {/* YouTube Reels */}
        {product.youtubeReels && product.youtubeReels.length > 0 && (
          <div style={{ padding: '0 1.5rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>প্রোডাক্ট ভিডিও</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => scrollReels('left')} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => scrollReels('right')} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={20} /></button>
              </div>
            </div>
            <div 
              ref={reelsCarouselRef} 
              className="reels-carousel" 
              style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', gap: '1rem', scrollbarWidth: 'none' }}
              onMouseEnter={() => setIsHoveringReels(true)}
              onMouseLeave={() => setIsHoveringReels(false)}
            >
              {product.youtubeReels.map((url, idx) => {
                let videoId = '';
                if (url.includes('shorts/')) videoId = url.split('shorts/')[1]?.split('?')[0];
                else if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
                else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
                if (!videoId) return null;
                return (
                  <div key={idx} className="reel-card">
                    <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?loop=1&playlist=${videoId}&autoplay=1&mute=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Reel" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div style={{ padding: '0 1.5rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>কাস্টমার রিভিউ</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => scrollReviews('left')} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => scrollReviews('right')} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={20} /></button>
              </div>
            </div>
            <div 
              ref={reviewsCarouselRef} 
              className="reviews-carousel" 
              style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', gap: '1rem', scrollbarWidth: 'none' }}
              onMouseEnter={() => setIsHoveringReviews(true)}
              onMouseLeave={() => setIsHoveringReviews(false)}
            >
              {product.reviews.map((rv, idx) => (
                <div key={idx} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{rv.name}</span>
                        <CheckCircle2 size={16} color="#22c55e" /> <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>Verified</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < rv.rating ? "#f59e0b" : "transparent"} color={i < rv.rating ? "#f59e0b" : "#cbd5e1"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#475569', lineHeight: '1.6', margin: 0, fontSize: '0.95rem', flex: 1 }}>{rv.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        </div> {/* End of landing-left */}

        {/* Checkout Form */}
        <div className="landing-right" id="order-form" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>অর্ডার কনফার্ম করতে ফর্মটি পূরণ করুন</h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করে অর্ডারটি কনফার্ম করবে।</p>
          </div>

          <form onSubmit={handlePlaceOrder} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {/* Quantity Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>পরিমাণ নির্বাচন করুন</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', width: 'fit-content', overflow: 'hidden' }}>
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#475569' }}>-</button>
                <span style={{ padding: '0.5rem 1.5rem', fontWeight: 600, color: '#1e293b' }}>{qty}</span>
                <button type="button" onClick={() => setQty(qty + 1)} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#475569' }}>+</button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>আপনার নাম *</label>
              <input required type="text" placeholder="সম্পূর্ণ নাম লিখুন" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>আপনার মোবাইল নাম্বার *</label>
              <input required type="tel" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>ডেলিভারি এরিয়া *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {deliveryMethods.map(m => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: selectedMethodId === m.id ? '2px solid var(--accent-primary)' : '1px solid #cbd5e1', borderRadius: '8px', background: selectedMethodId === m.id ? '#eff6ff' : '#fff', cursor: 'pointer' }}>
                    <input type="radio" name="deliveryMethod" value={m.id} checked={selectedMethodId === m.id} onChange={(e) => setSelectedMethodId(e.target.value)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{m.name}</div>
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>৳ {m.charge}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>সম্পূর্ণ ঠিকানা *</label>
              <textarea required rows="3" placeholder="গ্রাম/মহল্লা, থানা, জেলা" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', resize: 'vertical' }}></textarea>
            </div>

            {/* Order Summary */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px dashed #cbd5e1' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>অর্ডার সামারি</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#475569' }}>
                <span>প্রোডাক্ট প্রাইস ({qty}x):</span>
                <span style={{ fontWeight: 600 }}>৳ {itemsPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569' }}>
                <span>ডেলিভারি চার্জ:</span>
                <span style={{ fontWeight: 600 }}>৳ {shippingCost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', color: '#1e293b' }}>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>সর্বমোট বিল:</span>
                <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-primary)' }}>৳ {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ 
                width: '100%', padding: '1.25rem', background: isSubmitting ? '#94a3b8' : '#10b981', color: '#fff', 
                fontSize: '1.3rem', fontWeight: 800, borderRadius: '50px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                boxShadow: isSubmitting ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.4)', transition: 'background 0.2s'
              }}
            >
              {isSubmitting ? 'অপেক্ষা করুন...' : 'অর্ডার কনফার্ম করুন'}
            </button>
          </form>
        </div>

        {/* FAQs */}
        {product.faq && product.faq.length > 0 && (
          <div className="landing-faq-wrapper" style={{ padding: '3rem 1.5rem', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', marginBottom: '2rem', textAlign: 'center' }}>সাধারণ জিজ্ঞাসা (FAQ)</h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {product.faq.map((item, idx) => {
                const question = item.question || item.q;
                const answer = item.answer || item.a;
                if (!question) return null;
                return (
                  <div key={idx} style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <button 
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', background: 'transparent', border: 'none', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', color: '#1e293b' }}
                    >
                      {question}
                      {faqOpen === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {faqOpen === idx && (
                      <div style={{ paddingBottom: '1rem', color: '#475569', lineHeight: '1.6', fontSize: '1.05rem' }}>
                        {answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          &copy; {new Date().getFullYear()} - All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default ProductLanding;
