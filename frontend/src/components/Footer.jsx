import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#f8fafc', paddingTop: '4rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand & About */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <img src="/logo.svg" alt="Kinaboo" style={{ height: '40px' }} />
            </Link>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              কিনতে চাই? Kinaboo! আপনার পছন্দের সব পণ্য এক জায়গায়! ✅ ট্রেন্ডিং গ্যাজেট, কিচেন, বেবি আইটেম ও আরও অনেক কিছু 🚚 সারা দেশে ক্যাশ অন ডেলিভারি
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Footer Links Wrapper (2-column on mobile) */}
          <div className="footer-links-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
            {/* Quick Links */}
            <div style={{ flex: '1 1 150px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>কুইক লিংক</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>হোম</Link></li>
                <li><Link to="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>শপ</Link></li>
                <li><Link to="/categories" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>ক্যাটাগরি সমূহ</Link></li>
                <li><Link to="/pages/about-us" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>আমাদের সম্পর্কে</Link></li>
                <li><Link to="/pages/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>যোগাযোগ</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div style={{ flex: '1 1 150px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>কাস্টমার সার্ভিস</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><Link to="/pages/order-tracking" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>অর্ডার ট্র্যাকিং</Link></li>
                <li><Link to="/pages/return-exchange" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>রিটার্ন ও এক্সচেঞ্জ</Link></li>
                <li><Link to="/pages/shipping-info" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>শিপিং ইনফো</Link></li>
                <li><Link to="/pages/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>সাধারণ প্রশ্ন</Link></li>
                <li><Link to="/pages/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>প্রাইভেসি পলিসি</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>আমাদের সাথে থাকুন</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>নতুন প্রোডাক্ট ও স্পেশাল অফার পেতে সাবস্ক্রাইব করুন।</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
              <button className="btn btn-primary" style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
                সাবস্ক্রাইব
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <span>Rd 53, Gulshan 2, Dhaka, Bangladesh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--accent-primary)" />
                <span>01354-557477</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--accent-primary)" />
                <span>support@kinaboo.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid var(--border-color)', background: '#ffffff', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} kinaboo.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
