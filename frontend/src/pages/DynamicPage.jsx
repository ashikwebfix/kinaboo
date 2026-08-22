import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Mail, Phone, MapPin, Clock, Shield, Truck, Award, CheckCircle } from 'lucide-react';

const FullAboutSection = ({ data }) => {
  return (
    <div style={{ padding: '0 0 5rem' }}>
      
      {/* Hero Section */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '350px', marginBottom: '4rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <img 
          src={data.heroImage || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000"} 
          alt="About Us" 
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, objectFit: 'cover' }} 
        />
        <div style={{ position: 'relative', height: '100%', minHeight: '350px', background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.4))', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', margin: '0 0 1rem 0' }}>{data.headline || 'আমাদের গল্প'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
            {data.subheadline || 'আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি ঘরে সেরা মানের ও ট্রেন্ডিং সব পণ্য পৌঁছে দেওয়া। আমরা নিশ্চিত করি সেরা মান, সাশ্রয়ী মূল্য এবং চমৎকার কাস্টমার সার্ভিস।'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
        <div>
          <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>আমরা কারা</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1.5rem' }} dangerouslySetInnerHTML={{ __html: data.storyText || 'kinaboo.com প্রতিষ্ঠিত হয়েছে একটি স্পষ্ট লক্ষ্য নিয়ে: বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং ক্রেতাবান্ধব ই-কমার্স প্ল্যাটফর্ম হওয়া, যেখানে পাওয়া যাবে ট্রেন্ডিং সব প্রোডাক্ট সবচেয়ে সাশ্রয়ী মূল্যে。<br/><br/>আমরা ক্রেতাদের চাহিদা খুব ভালোভাবে বুঝি। তাই সেরা প্রস্তুতকারকদের থেকে সরাসরি সংগ্রহ করে আমরা মানসম্মত প্রোডাক্ট পৌঁছে দিচ্ছি সারা দেশে।' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{data.stat1Value || '10k+'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{data.stat1Label || 'সন্তুষ্ট গ্রাহক'}</p>
          </div>
          <div style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{data.stat2Value || '5+'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{data.stat2Label || 'বছরের অভিজ্ঞতা'}</p>
          </div>
          <div style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{data.stat3Value || '100%'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{data.stat3Label || 'গ্রাহক সন্তুষ্টি'}</p>
          </div>
          <div style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{data.stat4Value || '24/7'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{data.stat4Label || 'সাপোর্ট সুবিধা'}</p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div style={{ background: '#f8fafc', margin: '0 -3rem -3rem', padding: '5rem 3rem', borderTop: '1px solid var(--border-color)', borderRadius: '0 0 12px 12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>আমাদের মূল নীতি</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            আমাদের মূল নীতি ও আদর্শই আমাদের ব্রান্ডকে সামনের দিকে এগিয়ে নিয়ে যাচ্ছে।
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center', background: '#fff', border: '1px solid var(--border-color)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='none'}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Shield size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>গুণগত মান সবার আগে</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>আমরা পণ্যের গুণগত মানের সাথে কখনোই আপোষ করি না।</p>
          </div>
          
          <div style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center', background: '#fff', border: '1px solid var(--border-color)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='none'}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Truck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>দ্রুত ডেলিভারি</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>আপনার অর্ডারকৃত পণ্য দ্রুত ও নিরাপদে পৌঁছে দিতে আমরা বদ্ধপরিকর।</p>
          </div>
          
          <div style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center', background: '#fff', border: '1px solid var(--border-color)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='none'}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>২৪/৭ সাপোর্ট</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>যেকোনো প্রয়োজনে আমাদের ডেডিকেটেড সাপোর্ট টিম সব সময় আপনার পাশে আছে।</p>
          </div>

          <div style={{ padding: '2.5rem', borderRadius: '16px', textAlign: 'center', background: '#fff', border: '1px solid var(--border-color)', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='none'}>
            <div style={{ width: '60px', height: '60px', background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>নতুনত্ব</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>আমরা প্রতিনিয়ত আমাদের প্রোডাক্ট ও কাস্টমার সার্ভিস উন্নত করার নতুন উপায় খুঁজি।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RichTextSection = ({ data }) => {
  return (
    <div 
      className="page-content" 
      dangerouslySetInnerHTML={{ __html: data.html }} 
      style={{ margin: '2rem 0', lineHeight: '1.8', color: 'var(--text-primary)', fontSize: '1.05rem' }}
    />
  );
};

const FaqSection = ({ data }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = data.faqs || [];
  
  if (faqs.length === 0) return null;
  return (
    <div style={{ margin: '3rem 0' }}>
      {data.title && <h2 className="heading-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>{data.title}</h2>}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: openIdx === idx ? '#f8fafc' : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '1.05rem', color: 'var(--text-primary)' }}
            >
              {faq.question}
              <ChevronDown size={20} style={{ transform: openIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>
            {openIdx === idx && (
              <div style={{ padding: '0 1.25rem 1.25rem', background: '#f8fafc', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactFormSection = ({ data }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', margin: '3rem 0' }}>
      <div>
        {data.title && <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>{data.title}</h2>}
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          {data.subtitle || 'যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন। আমাদের সাপোর্ট টিম সবসময় প্রস্তুত আপনাকে সাহায্য করতে।'}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', padding: '1rem', borderRadius: '50%' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>অফিসের ঠিকানা</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{data.address || 'বাড়ী নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা-১২০৯'}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', padding: '1rem', borderRadius: '50%' }}>
              <Phone size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>ফোন নাম্বার</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{data.phone || '+880 1712 345 678'}</p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{data.phone2 || '+880 1912 345 678'}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ background: 'rgba(6, 78, 59, 0.1)', color: 'var(--accent-primary)', padding: '1rem', borderRadius: '50%' }}>
              <Mail size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>ইমেইল</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{data.email || 'support@kinaboo.com'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>মেসেজ পাঠান</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>আপনার নাম</label>
            <input type="text" className="input-field" placeholder="নাম লিখুন" required />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>ইমেইল অথবা ফোন</label>
            <input type="text" className="input-field" placeholder="ইমেইল বা ফোন নাম্বার" required />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>মেসেজ</label>
            <textarea className="input-field" rows="4" placeholder="আপনার মেসেজ লিখুন..." required style={{ resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            সেন্ড করুন
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(import.meta.env.VITE_API_URL + `/api/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        } else {
          setError('Page not found');
        }
      } catch (err) {
        setError('Error loading page');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container" style={{ padding: '4rem 0', minHeight: '50vh', textAlign: 'center' }}>
        <Helmet>
          <title>Page Not Found - Kinaboo</title>
        </Helmet>
        <h2>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 0', minHeight: '60vh' }}>
      <Helmet>
        <title>{page.title} - Kinaboo</title>
      </Helmet>
      
      <div style={{ background: '#fff', borderRadius: '12px', padding: '3rem', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h1 className="heading-lg" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          {page.title}
        </h1>
        
        {page.sections && page.sections.length > 0 ? (
          <div>
            {page.sections.map((section, index) => {
              switch (section.type) {
                case 'richtext':
                  return <RichTextSection key={section.id || index} data={section.data} />;
                case 'faq':
                  return <FaqSection key={section.id || index} data={section.data} />;
                case 'contact_form':
                  return <ContactFormSection key={section.id || index} data={section.data} />;
                case 'about_hero':
                  return <FullAboutSection key={section.id || index} data={section.data} />;
                default:
                  return null;
              }
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>This page has no content yet.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicPage;
