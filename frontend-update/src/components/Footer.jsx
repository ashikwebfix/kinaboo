import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [footerInfo, setFooterInfo] = useState({
    siteName: 'Kinaboo',
    storeBio: 'কিনতে চাই? Kinaboo! আপনার পছন্দের সব অথেনটিক গ্যাজেট, লাইফস্টাইল ও ট্রেন্ডি পণ্য এক জায়গায়। সারা দেশে দ্রুততম ক্যাশ অন ডেলিভারি।',
    address: 'হাউস ৫৩, রোড ১১, গুলশান ২, ঢাকা-১২১২',
    phone: '০১৩৫৪-৫৫৭৪৭৭',
    email: 'support@kinaboo.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    twitter: 'https://twitter.com'
  });

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || '') + '/api/settings/general_settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          setFooterInfo(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('সঠিক ইমেইল এড্রেস প্রদান করুন');
      return;
    }
    setSubscribed(true);
    toast.success('সাবস্ক্রিপশন সফল হয়েছে! ধন্যবাদ।', { icon: '🎉' });
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="modern-footer">
      {/* 1. Value Proposition Perks Strip */}
      <div className="footer-perks-strip">
        <div className="container">
          <div className="footer-perks-grid">
            <div className="footer-perk-item">
              <div className="footer-perk-icon-wrap">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="footer-perk-title">ফ্রি ও ফাস্ট শিপিং</h4>
                <p className="footer-perk-sub">নির্দিষ্ট অর্ডারে দ্রুত হোম ডেলিভারি</p>
              </div>
            </div>

            <div className="footer-perk-item">
              <div className="footer-perk-icon-wrap">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="footer-perk-title">১০০% সুরক্ষিত পেমেন্ট</h4>
                <p className="footer-perk-sub">ক্যাশ অন ডেলিভারি ও নিরাপদ গেটওয়ে</p>
              </div>
            </div>

            <div className="footer-perk-item">
              <div className="footer-perk-icon-wrap">
                <RotateCcw size={22} />
              </div>
              <div>
                <h4 className="footer-perk-title">সহজ রিটার্ন পলিসি</h4>
                <p className="footer-perk-sub">নির্ভরযোগ্য এক্সচেঞ্জ ও রিপ্লেসমেন্ট</p>
              </div>
            </div>

            <div className="footer-perk-item">
              <div className="footer-perk-icon-wrap">
                <Headphones size={22} />
              </div>
              <div>
                <h4 className="footer-perk-title">২৪/৭ সার্বক্ষণিক সাপোর্ট</h4>
                <p className="footer-perk-sub">যেকোনো তথ্যে পাশে আছে আমাদের টিম</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="footer-main-section">
        <div className="container">
          <div className="footer-main-grid">
            
            {/* Column 1: Brand Info & Socials */}
            <div className="footer-brand-col">
              <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img src="/logo-white.svg" alt={footerInfo.siteName || "Kinaboo"} className="footer-brand-logo" />
              </Link>
              <p className="footer-brand-text">
                {footerInfo.storeBio}
              </p>
              
              <div className="footer-social-links">
                {/* Facebook */}
                <a href={footerInfo.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                {/* Instagram */}
                <a href={footerInfo.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* YouTube */}
                <a href={footerInfo.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                {/* Twitter / X */}
                <a href={footerInfo.twitter || "https://twitter.com"} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="footer-col-title">কুইক লিংক</h3>
              <ul className="footer-nav-list">
                <li><Link to="/" className="footer-nav-link"><ChevronRight size={14} /> হোম</Link></li>
                <li><Link to="/shop" className="footer-nav-link"><ChevronRight size={14} /> শপ ও কালেকশন</Link></li>
                <li><Link to="/shop?sort=discount" className="footer-nav-link"><ChevronRight size={14} /> স্পেশাল অফার ডিলস</Link></li>
                <li><Link to="/pages/about-us" className="footer-nav-link"><ChevronRight size={14} /> আমাদের সম্পর্কে</Link></li>
                <li><Link to="/pages/contact" className="footer-nav-link"><ChevronRight size={14} /> যোগাযোগ</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div>
              <h3 className="footer-col-title">কাস্টমার সার্ভিস</h3>
              <ul className="footer-nav-list">
                <li><Link to="/pages/order-tracking" className="footer-nav-link"><ChevronRight size={14} /> অর্ডার ট্র্যাকিং</Link></li>
                <li><Link to="/pages/return-exchange" className="footer-nav-link"><ChevronRight size={14} /> রিটার্ন ও এক্সচেঞ্জ পলিসি</Link></li>
                <li><Link to="/pages/shipping-info" className="footer-nav-link"><ChevronRight size={14} /> শিপিং ও ডেলিভারি তথ্য</Link></li>
                <li><Link to="/pages/faq" className="footer-nav-link"><ChevronRight size={14} /> সাধারণ জিজ্ঞাসা (FAQ)</Link></li>
                <li><Link to="/pages/privacy-policy" className="footer-nav-link"><ChevronRight size={14} /> প্রাইভেসি পলিসি</Link></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Contact */}
            <div>
              <h3 className="footer-col-title">যোগাযোগ ও অফার</h3>
              <div className="footer-newsletter-box">
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                  লেটেস্ট কালেকশন ও স্পেশাল প্রোমো কোড পেতে সাবস্ক্রাইব করুন।
                </p>
                <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-input-wrap">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল দিন..." 
                    className="footer-newsletter-input"
                  />
                  <button type="submit" className="footer-newsletter-submit-btn">
                    {subscribed ? <Check size={16} /> : 'সাবস্ক্রাইব'}
                  </button>
                </form>
              </div>

              <div className="footer-contact-items">
                <div className="footer-contact-item">
                  <MapPin size={16} className="footer-contact-icon" />
                  <span>{footerInfo.address}</span>
                </div>
                <a href={`tel:${footerInfo.phone ? footerInfo.phone.replace(/[^0-9+]/g, '') : '01354557477'}`} className="footer-contact-item">
                  <Phone size={16} className="footer-contact-icon" />
                  <span>{footerInfo.phone} (Hotline)</span>
                </a>
                <a href={`mailto:${footerInfo.email || 'support@kinaboo.com'}`} className="footer-contact-item">
                  <Mail size={16} className="footer-contact-icon" />
                  <span>{footerInfo.email}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Payment Methods Bar */}
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} <strong style={{ color: '#ffffff' }}>{footerInfo.siteName || "Kinaboo.com"}</strong>. All rights reserved.
            </p>

            <div className="footer-payment-badges">
              <span className="footer-pay-badge">💳 bKash</span>
              <span className="footer-pay-badge">📱 Nagad</span>
              <span className="footer-pay-badge">🚀 Rocket</span>
              <span className="footer-pay-badge">🔒 VISA</span>
              <span className="footer-pay-badge">🌐 Mastercard</span>
              <span className="footer-pay-badge">📦 Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
