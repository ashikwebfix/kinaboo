import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  Star, 
  Zap, 
  Users, 
  PackageCheck 
} from 'lucide-react';

/* ==========================================================================
   ABOUT US HERO & STORY SECTION
   ========================================================================== */
const FullAboutSection = ({ data, generalSettings }) => {
  const siteName = generalSettings?.siteName || "Kinaboo";
  const storeBio = generalSettings?.storeBio || "আপনার নির্ভরযোগ্য অনলাইন শপিং পার্টনার। প্রিমিয়াম কোয়ালিটি ও সেরা দামে ট্রেন্ডিং সব পণ্য ঘরে বসেই পেয়ে যান।";

  const headline = data?.headline || `${siteName} - আমাদের গল্প ও অনুপ্রেরণা`;
  const subheadline = data?.subheadline || storeBio;
  const heroImage = data?.heroImage || data?.imageUrl || "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="about-page-container">
      
      {/* 1. Hero Showcase Banner */}
      <div style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        minHeight: '380px',
        marginBottom: '3.5rem',
        boxShadow: '0 20px 40px -15px rgba(43, 45, 66, 0.15)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <img 
          src={heroImage} 
          alt={headline} 
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'absolute', 
            inset: 0, 
            objectFit: 'cover' 
          }} 
        />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(105deg, rgba(43, 45, 66, 0.92) 0%, rgba(43, 45, 66, 0.8) 50%, rgba(43, 45, 66, 0.4) 100%)',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: 'clamp(2rem, 5vw, 4.5rem)' 
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'rgba(255, 106, 61, 0.2)', 
            border: '1px solid rgba(255, 106, 61, 0.4)', 
            color: '#ff9a7b', 
            padding: '0.35rem 0.85rem', 
            borderRadius: '9999px', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            width: 'fit-content'
          }}>
            <Sparkles size={14} /> Welcome to {siteName}
          </div>

          <h1 style={{ 
            color: '#ffffff', 
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', 
            fontWeight: 800, 
            margin: '0 0 1rem 0', 
            lineHeight: 1.2,
            letterSpacing: '-0.5px'
          }}>
            {headline}
          </h1>

          <p style={{ 
            color: '#cbd5e1', 
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', 
            maxWidth: '650px', 
            lineHeight: 1.7,
            margin: 0
          }}>
            {subheadline}
          </p>
        </div>
      </div>

      {/* 2. Brand Story & Statistics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '3rem', 
        alignItems: 'center',
        marginBottom: '4.5rem' 
      }}>
        <div>
          <div style={{ 
            display: 'inline-block', 
            color: 'var(--accent-primary)', 
            fontWeight: 800, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            marginBottom: '0.5rem' 
          }}>
            Who We Are
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1.25rem 0', letterSpacing: '-0.3px' }}>
            আমরা কারা ও কেন আমরা আলাদা?
          </h2>
          
          <div 
            style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.02rem' }} 
            dangerouslySetInnerHTML={{ 
              __html: data?.storyText || `
                <p style="margin-bottom: 1.2rem;">
                  <strong>${siteName}</strong> প্রতিষ্ঠিত হয়েছে একটি স্পষ্ট দর্শন নিয়ে: বাংলাদেশের প্রতিটি প্রান্তে প্রিমিয়াম কোয়ালিটি ও শতভাগ জেনুইন প্রোডাক্ট পৌঁছে দেওয়া, সবচেয়ে দ্রুততম ক্যাশ অন ডেলিভারি সুবিধার মাধ্যমে।
                </p>
                <p style="margin-bottom: 1.2rem;">
                  আমরা কোনো আপোষহীন মধ্যস্বত্বভোগী ছাড়া সরাসরি প্রস্তুতকারক ও ভেরিফায়েড ডিস্ট্রিবিউটরদের থেকে প্রোডাক্ট সোর্স করি। এর ফলে আমাদের গ্রাহকরা পান সর্বোচ্চ মান এবং সবচেয়ে সাশ্রয়ী মূল্য।
                </p>
                <p>
                  আমাদের মূল লক্ষ্য কেবল পণ্য বিক্রি নয়, বরং প্রতিটি অর্ডারে ক্রেতার মুখে হাসি ফোটানো এবং একটি নির্ভেজাল অনলাইন শপিং অভিজ্ঞতা নিশ্চিত করা।
                </p>
              ` 
            }} 
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '12px', fontWeight: 700 }}>
              আমাদের প্রোডাক্ট দেখুন <ChevronRight size={16} />
            </Link>
            <Link to="/pages/contact" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 600 }}>
              যোগাযোগ করুন
            </Link>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ 
            padding: '2rem 1.5rem', 
            borderRadius: '20px', 
            textAlign: 'center', 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem', borderRadius: '12px', background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0 0 0.25rem 0' }}>
              {data?.stat1Value || '15,000+'}
            </h3>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
              {data?.stat1Label || 'সন্তুষ্ট গ্রাহক'}
            </p>
          </div>

          <div style={{ 
            padding: '2rem 1.5rem', 
            borderRadius: '20px', 
            textAlign: 'center', 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={24} />
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', margin: '0 0 0.25rem 0' }}>
              {data?.stat2Value || '100%'}
            </h3>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
              {data?.stat2Label || 'জেনুইন প্রোডাক্ট'}
            </p>
          </div>

          <div style={{ 
            padding: '2rem 1.5rem', 
            borderRadius: '20px', 
            textAlign: 'center', 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', margin: '0 0 0.25rem 0' }}>
              {data?.stat3Value || '24-48h'}
            </h3>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
              {data?.stat3Label || 'ফাস্ট ডেলিভারি'}
            </p>
          </div>

          <div style={{ 
            padding: '2rem 1.5rem', 
            borderRadius: '20px', 
            textAlign: 'center', 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.75rem', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={24} />
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#eab308', margin: '0 0 0.25rem 0' }}>
              {data?.stat4Value || '4.9/5'}
            </h3>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
              {data?.stat4Label || 'কাস্টমার রেটিং'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Core Values & Commitments */}
      <div style={{ 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', 
        borderRadius: '24px', 
        padding: 'clamp(2rem, 5vw, 4rem)',
        border: '1px solid #eef2f6',
        marginBottom: '2rem'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Our Values
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.4rem 0 0.75rem 0' }}>
            আমাদের মূল অঙ্গীকার
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            যেসব মূল নীতি ও আদর্শের উপর ভিত্তি করে আমরা প্রতিদিন আপনাদের সেবায় কাজ করি।
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
          <div style={{ 
            padding: '2.25rem 1.75rem', 
            borderRadius: '20px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ width: '56px', height: '56px', background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>১০০% জেনুইন কোয়ালিটি</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>আমরা শুধুমাত্র যাচাইকৃত সেরা মানের অথেনটিক প্রোডাক্ট সরবরাহ করি।</p>
          </div>
          
          <div style={{ 
            padding: '2.25rem 1.75rem', 
            borderRadius: '20px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ width: '56px', height: '56px', background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Truck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>ক্যাশ অন ডেলিভারি</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ নিশ্চিন্তে মূল্য পরিশোধের সুবিধা।</p>
          </div>
          
          <div style={{ 
            padding: '2.25rem 1.75rem', 
            borderRadius: '20px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ width: '56px', height: '56px', background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>২৪/৭ কাস্টমার সাপোর্ট</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>অর্ডারের শুরু থেকে ডেলিভারি পর্যন্ত যেকোনো প্রয়োজনে ডেডিকেটেড হেল্পলাইন।</p>
          </div>

          <div style={{ 
            padding: '2.25rem 1.75rem', 
            borderRadius: '20px', 
            background: '#ffffff', 
            border: '1px solid #e2e8f0', 
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <div style={{ width: '56px', height: '56px', background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>ইজি রিটার্ন পলিসি</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>কোনো সমস্যা হলে দ্রুততম সময়ে রিপ্লেসমেন্ট ও রিটার্ন সুবিধা।</p>
          </div>
        </div>
      </div>

    </div>
  );
};

/* ==========================================================================
   RICH TEXT SECTION
   ========================================================================== */
const RichTextSection = ({ data }) => {
  if (!data?.html) return null;
  return (
    <div 
      className="page-content" 
      dangerouslySetInnerHTML={{ __html: data.html }} 
      style={{ margin: '2rem 0', lineHeight: '1.85', color: '#334155', fontSize: '1.05rem' }}
    />
  );
};

/* ==========================================================================
   FULL FAQ PAGE SECTION (SEARCHABLE & CATEGORIZED)
   ========================================================================== */
const FullFaqPageSection = ({ data, generalSettings }) => {
  const siteName = generalSettings?.siteName || "Kinaboo";
  const phone = generalSettings?.phone || "+880 1700-000000";
  const email = generalSettings?.email || "support@kinaboo.com";

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState(0);

  const defaultCategoryFaqs = [
    {
      category: 'order',
      categoryName: '📦 অর্ডার ও ডেলিভারি',
      q: 'অর্ডার করার সহজ নিয়ম কি?',
      a: `ওয়েবসাইটে পছন্দের প্রোডাক্টের নিচে "অর্ডার করুন" বাটনে ক্লিক করে আপনার নাম, মোবাইল নাম্বার এবং ডেলিভারি ঠিকানা লিখে সাবমিট করলেই অর্ডার কনফার্ম হয়ে যাবে। কোনো জটিল রেজিস্ট্রেশনের প্রয়োজন নেই।`
    },
    {
      category: 'order',
      categoryName: '📦 অর্ডার ও ডেলিভারি',
      q: 'ডেলিভারি পেতে কত দিন সময় লাগে?',
      a: 'ঢাকার মেট্রো এলাকায় ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৩ কার্যদিবসের মধ্যে দ্রুততম হোম ডেলিভারি সম্পন্ন করা হয়।'
    },
    {
      category: 'order',
      categoryName: '📦 অর্ডার ও ডেলিভারি',
      q: 'ডেলিভারি চার্জ কত?',
      a: 'ঢাকার ভিতরে নিয়মিত ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকার বাইরে ১২০ টাকা। এছাড়া স্পেশাল ক্যাম্পেইনে ফ্রি শিপিং সুবিধা পাওয়া যায়।'
    },
    {
      category: 'payment',
      categoryName: '💳 পেমেন্ট ও ক্যাশ অন ডেলিভারি',
      q: 'আমি কি পণ্য হাতে পেয়ে টাকা দিতে পারবো?',
      a: 'হ্যাঁ! সারা বাংলাদেশের যেকোনো প্রান্ত থেকে আপনি ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধায় পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করতে পারবেন।'
    },
    {
      category: 'payment',
      categoryName: '💳 পেমেন্ট ও ক্যাশ অন ডেলিভারি',
      q: 'বিকাশ বা কার্ডে কি পেমেন্ট করা যাবে?',
      a: 'হ্যাঁ, ক্যাশ অন ডেলিভারির পাশাপাশি বিকাশ, নগদ, রকেট এবং ভিসা/মাস্টারকার্ডের মাধ্যমে সম্পূর্ণ নিরাপদ ডিজিটাল পেমেন্ট করার সুযোগ রয়েছে।'
    },
    {
      category: 'return',
      categoryName: '🔄 রিটার্ন ও এক্সচেঞ্জ',
      q: 'পণ্য পছন্দ না হলে বা সাইজে সমস্যা হলে কি এক্সচেঞ্জ করা যাবে?',
      a: 'হ্যাঁ, পণ্য হাতে পাওয়ার পর ৭ দিনের মধ্যে যেকোনো সাইজ বা কালার এক্সচেঞ্জ করতে পারবেন। আমাদের সাপোর্ট নাম্বারে যোগাযোগ করলেই এক্সচেঞ্জ প্রসেস শুরু করা হবে।'
    },
    {
      category: 'return',
      categoryName: '🔄 রিটার্ন ও এক্সচেঞ্জ',
      q: 'ভাঙ্গা বা ত্রুটিযুক্ত প্রোডাক্ট পেলে কি করণীয়?',
      a: 'পার্সেল রিসিভ করার সময় ডেলিভারি ম্যানের সামনে চেক করুন। কোনো সমস্যা দেখতে পেলে সাথে সাথে ছবি তুলে আমাদের হেল্পলাইনে জানালে কোনো অতিরিক্ত খরচ ছাড়াই নতুন ফ্রেশ প্রোডাক্ট দেওয়া হবে।'
    },
    {
      category: 'quality',
      categoryName: '🛡️ প্রোডাক্ট কোয়ালিটি ও ওয়ারেন্টি',
      q: `${siteName}-এর প্রোডাক্টগুলো কি ১০০% অরিজিনাল?`,
      a: `হ্যাঁ, শতভাগ নিশ্চিত থাকুন। ${siteName}-এর প্রতিটি পণ্য সরাসরি ভেরিফায়েড ব্র্যান্ড ও প্রস্তুতকারক থেকে সংগৃহীত। আমরা কোনো নিম্নমানের বা ফেক প্রোডাক্ট বিক্রি করি না।`
    },
    {
      category: 'quality',
      categoryName: '🛡️ প্রোডাক্ট কোয়ালিটি ও ওয়ারেন্টি',
      q: 'প্রোডাক্টে কি কোনো অফিসিয়াল ওয়ারেন্টি আছে?',
      a: 'নির্দিষ্ট ইলেকট্রনিক্স ও গ্যাজেট আইটেমের সাথে ব্র্যান্ডের অফিসিয়াল ওয়ারেন্টি প্রদান করা হয় যা প্রোডাক্টের বিস্তারিত বিবরণীতে উল্লেখ থাকে।'
    }
  ];

  const rawQuestions = data?.questions || data?.faqs || [];
  const allFaqs = rawQuestions.length > 0
    ? rawQuestions.map((item, i) => ({
        category: 'custom',
        categoryName: '💡 সাধারণ প্রশ্ন',
        q: item.question || item.q,
        a: item.answer || item.a
      }))
    : defaultCategoryFaqs;

  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page-container">
      {/* 1. Hero Search Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '24px',
        padding: 'clamp(2.5rem, 5vw, 4rem)',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(255,106,61,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          background: 'rgba(255, 106, 61, 0.2)', 
          border: '1px solid rgba(255, 106, 61, 0.4)', 
          color: '#ff9a7b', 
          padding: '0.35rem 0.85rem', 
          borderRadius: '9999px', 
          fontSize: '0.82rem', 
          fontWeight: 700, 
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} /> Help Center & FAQ
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 0.75rem 0', lineHeight: 1.2 }}>
          সাধারণ জিজ্ঞাসা ও উত্তর
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          আপনার যেকোনো প্রশ্ন বা তথ্যের উত্তর খুব সহজেই খুঁজে নিন।
        </p>

        {/* Live Search Box */}
        <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখে সার্চ করুন (যেমন: ডেলিভারি, বিকাশ, রিটার্ন)..."
            style={{
              width: '100%',
              padding: '1rem 1.25rem 1rem 3rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#ffffff',
              color: '#1e293b',
              fontSize: '0.98rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}
          />
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            🔍
          </span>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: activeCategory === 'all' ? 'var(--accent-primary)' : '#e2e8f0',
            background: activeCategory === 'all' ? 'var(--accent-primary)' : '#ffffff',
            color: activeCategory === 'all' ? '#ffffff' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ⚡ সব প্রশ্ন
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('order')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: activeCategory === 'order' ? 'var(--accent-primary)' : '#e2e8f0',
            background: activeCategory === 'order' ? 'var(--accent-primary)' : '#ffffff',
            color: activeCategory === 'order' ? '#ffffff' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📦 অর্ডার ও ডেলিভারি
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('payment')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: activeCategory === 'payment' ? 'var(--accent-primary)' : '#e2e8f0',
            background: activeCategory === 'payment' ? 'var(--accent-primary)' : '#ffffff',
            color: activeCategory === 'payment' ? '#ffffff' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          💳 পেমেন্ট ও COD
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('return')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: activeCategory === 'return' ? 'var(--accent-primary)' : '#e2e8f0',
            background: activeCategory === 'return' ? 'var(--accent-primary)' : '#ffffff',
            color: activeCategory === 'return' ? '#ffffff' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🔄 রিটার্ন ও এক্সচেঞ্জ
        </button>

        <button
          type="button"
          onClick={() => setActiveCategory('quality')}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid',
            borderColor: activeCategory === 'quality' ? 'var(--accent-primary)' : '#e2e8f0',
            background: activeCategory === 'quality' ? 'var(--accent-primary)' : '#ffffff',
            color: activeCategory === 'quality' ? '#ffffff' : 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🛡️ কোয়ালিটি ও ওয়ারেন্টি
        </button>
      </div>

      {/* 3. Accordions List */}
      <div style={{ maxWidth: '820px', margin: '0 auto 4rem auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                style={{ 
                  border: '1px solid', 
                  borderColor: isOpen ? 'rgba(255,106,61,0.3)' : '#e2e8f0', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  background: '#ffffff', 
                  boxShadow: isOpen ? '0 8px 20px rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.25s ease' 
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 1.5rem',
                    background: isOpen ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.25s ease', 
                      color: isOpen ? 'var(--accent-primary)' : '#94a3b8', 
                      flexShrink: 0,
                      marginLeft: '1rem' 
                    }} 
                  />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.35rem 1.5rem', background: '#f8fafc', color: '#475569', lineHeight: '1.75', fontSize: '0.98rem', borderTop: '1px solid #f1f5f9' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>কোনো ফলাফল পাওয়া যায়নি</p>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>অন্য কোনো কীওয়ার্ড দিয়ে সার্চ করার চেষ্টা করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।</p>
          </div>
        )}
      </div>

      {/* 4. Still Have Questions Support Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,106,61,0.08) 0%, rgba(255,81,47,0.04) 100%)', 
        border: '1px solid rgba(255,106,61,0.25)', 
        borderRadius: '20px', 
        padding: '2.25rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1.5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
            আপনার প্রশ্নের উত্তর খুঁজে পাননি?
          </h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            আমাদের কাস্টমার কেয়ার প্রতিনিধি যেকোনো তথ্যের জন্য সবসময় প্রস্তুত আছেন।
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href={`tel:${phone.replace(/[\s-]+/g, '')}`} className="btn btn-primary" style={{ padding: '0.8rem 1.6rem', borderRadius: '12px', fontWeight: 700 }}>
            <Phone size={16} /> কল করুন: {phone}
          </a>
          <a href={`mailto:${email}`} className="btn btn-secondary" style={{ padding: '0.8rem 1.6rem', borderRadius: '12px', fontWeight: 600 }}>
            <Mail size={16} /> ইমেইল করুন
          </a>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   CONTACT FORM SECTION
   ========================================================================== */
const ContactFormSection = ({ data, generalSettings }) => {
  const [submitted, setSubmitted] = useState(false);

  const phone = data?.phone || generalSettings?.phone || "+880 1700-000000";
  const email = data?.email || generalSettings?.email || "support@kinaboo.com";
  const address = data?.address || generalSettings?.address || "ঢাকা, বাংলাদেশ";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', margin: '3rem 0', alignItems: 'start' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          {data?.title || 'যোগাযোগ করুন'}
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: '1.65' }}>
          {data?.subtitle || 'যেকোনো প্রশ্ন, অর্ডার সংক্রান্ত তথ্য বা সহযোগিতার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।'}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #eef2f6' }}>
            <div style={{ background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>অফিসের ঠিকানা</div>
              <div style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem' }}>{address}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #eef2f6' }}>
            <div style={{ background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>ফোন নাম্বার</div>
              <a href={`tel:${phone.replace(/[\s-]+/g, '')}`} style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>{phone}</a>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #eef2f6' }}>
            <div style={{ background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>ইমেইল এড্রেস</div>
              <a href={`mailto:${email}`} style={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>{email}</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Box */}
      <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 15px 35px -10px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          আমাদের মেসেজ পাঠান
        </h3>

        {submitted ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', color: '#166534' }}>
            <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontWeight: 700, margin: '0 0 0.25rem 0' }}>ধন্যবাদ! আপনার মেসেজটি গৃহীত হয়েছে।</h4>
            <p style={{ fontSize: '0.9rem', margin: 0, color: '#15803d' }}>আমাদের সাপোর্ট টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>আপনার পুরো নাম</label>
              <input type="text" className="input-field" placeholder="নাম লিখুন" required style={{ padding: '0.8rem 1rem', borderRadius: '10px', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>ফোন নাম্বার / ইমেইল</label>
              <input type="text" className="input-field" placeholder="017XXXXXXXX বা example@mail.com" required style={{ padding: '0.8rem 1rem', borderRadius: '10px', width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>মেসেজ</label>
              <textarea className="input-field" rows="4" placeholder="আপনার বার্তা লিখুন..." required style={{ padding: '0.8rem 1rem', borderRadius: '10px', width: '100%', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: '12px', background: 'var(--accent-gradient)' }}>
              মেসেজ পাঠান
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   RETURN & EXCHANGE POLICY SECTION
   ========================================================================== */
const ReturnExchangeSection = ({ generalSettings }) => {
  const siteName = generalSettings?.siteName || "Kinaboo";
  const phone = generalSettings?.phone || "+880 1700-000000";
  const email = generalSettings?.email || "support@kinaboo.com";
  const [openFaq, setOpenFaq] = useState(0);

  const policyFaqs = [
    {
      q: 'কত দিনের মধ্যে রিটার্ন বা এক্সচেঞ্জ রিকোয়েস্ট করা যাবে?',
      a: 'পণ্য হাতে পাওয়ার পর সর্বোচ্চ ৭ (সাত) দিনের মধ্যে আপনি রিটার্ন বা এক্সচেঞ্জের জন্য আমাদের সাথে যোগাযোগ করতে পারবেন।'
    },
    {
      q: 'ডেলিভারি চার্জ কি আমাকে দিতে হবে?',
      a: 'যদি আপনি ভুল প্রোডাক্ট, ত্রুটিযুক্ত (Defective/Damaged) প্রোডাক্ট পান, তবে সম্পূর্ণ ডেলিভারি চার্জ আমরা বহন করবো। আর যদি নিজস্ব পছন্দের পরিবর্তন বা সাইজ এক্সচেঞ্জ করতে চান, তবে স্ট্যান্ডার্ড রিটার্ন ডেলিভারি চার্জ প্রযোজ্য হবে।'
    },
    {
      q: 'রিফান্ডের টাকা কতদিনের মধ্যে ফেরত পাওয়া যায়?',
      a: 'আমাদের ওয়্যারহাউসে রিটার্নকৃত প্রোডাক্টটি পৌঁছে কোয়ালিটি চেকিং সম্পন্ন হওয়ার পর ৩ থেকে ৫ কর্মদিবসের মধ্যে আপনার বিকাশ/নগদ বা ব্যাংক একাউন্টে রিফান্ড প্রদান করা হয়।'
    },
    {
      q: 'কোন কোন ক্ষেত্রে প্রোডাক্ট রিটার্নযোগ্য নয়?',
      a: '১. ব্যবহৃত, ধোয়া বা কোনো প্রকার ক্ষতিসাধন করা প্রোডাক্ট। ২. প্রোডাক্টের অরিজিনাল ট্যাগ, বারকোড বা প্যাকেজিং না থাকলে। ৩. ইনটিমেট অ্যাপারেল বা স্পেশাল কাস্টমাইজড আইটেমস।'
    }
  ];

  return (
    <div className="return-policy-container">
      {/* 1. Header Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '24px',
        padding: 'clamp(2rem, 5vw, 3.5rem)',
        color: '#ffffff',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255,106,61,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          background: 'rgba(255, 106, 61, 0.2)', 
          border: '1px solid rgba(255, 106, 61, 0.4)', 
          color: '#ff9a7b', 
          padding: '0.35rem 0.85rem', 
          borderRadius: '9999px', 
          fontSize: '0.82rem', 
          fontWeight: 700, 
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} /> {siteName} Guarantee
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem 0', lineHeight: 1.2 }}>
          রিটার্ন ও এক্সচেঞ্জ পলিসি
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '680px', lineHeight: 1.7, margin: 0 }}>
          {siteName}-এ আপনার প্রতিটি কেনাকাটা যেন হয় শতভাগ নিরাপদ ও তৃপ্তিদায়ক। কোনো প্রোডাক্টে সমস্যা হলে আপনি অতি সহজে এক্সচেঞ্জ বা রিটার্ন করতে পারবেন।
        </p>
      </div>

      {/* 2. Four Fast Guarantee Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div style={{ padding: '1.75rem', borderRadius: '18px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 106, 61, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>৭ দিনের সহজ রিটার্ন</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>পণ্য রিসিভ করার পর ৭ দিনের মধ্যে যেকোনো ত্রুটির ক্ষেত্রে এক্সচেঞ্জ রিকোয়েস্ট করুন।</p>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '18px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>১০০% জেনুইন রিপ্লেসমেন্ট</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>ভুল সাইজ বা ডিফেক্টিভ পণ্যের ক্ষেত্রে দ্রুত নতুন ফ্রেশ প্রোডাক্ট দেওয়া হবে।</p>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '18px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Truck size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>ডোরস্টেপ পিকআপ</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>আমাদের কুরিয়ার টিম আপনার বাসা থেকেই রিটার্ন পার্সেলটি সংগ্রহ করবে।</p>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '18px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Clock size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>দ্রুততম রিফান্ড</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>পণ্য চেক হওয়ার ৩-৫ কার্যদিবসের মধ্যে বিকাশ/ব্যাংক একাউন্টে রিফান্ড সম্পন্ন।</p>
        </div>
      </div>

      {/* 3. Three-Step Process */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
          ৩টি সহজ ধাপে রিটার্ন বা এক্সচেঞ্জ করুন
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#ffffff', position: 'relative' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255, 106, 61, 0.2)', position: 'absolute', top: '1rem', right: '1.5rem' }}>01</span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>১. আমাদের সাথে যোগাযোগ করুন</h4>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              প্রোডাক্টের সমস্যা বা সাইজ মিসম্যাচের ছবি/ভিডিও তুলে আমাদের হেল্পলাইন নাম্বার বা WhatsApp-এ পাঠান।
            </p>
          </div>

          <div style={{ padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#ffffff', position: 'relative' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255, 106, 61, 0.2)', position: 'absolute', top: '1rem', right: '1.5rem' }}>02</span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>২. পার্সেল হ্যান্ডওভার করুন</h4>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              প্রোডাক্টটি এর মূল বক্স ও ট্যাগসহ কুরিয়ার প্রতিনিধির কাছে হস্তান্তর করুন।
            </p>
          </div>

          <div style={{ padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#ffffff', position: 'relative' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255, 106, 61, 0.2)', position: 'absolute', top: '1rem', right: '1.5rem' }}>03</span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>৩. নতুন পণ্য বা রিফান্ড গ্রহণ</h4>
            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              কোয়ালিটি চেক শেষে আপনার ঠিকানায় নতুন পণ্য পাঠিয়ে দেওয়া হবে অথবা রিফান্ড প্রদান করা হবে।
            </p>
          </div>
        </div>
      </div>

      {/* 4. Support Contact Callout */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255,106,61,0.08) 0%, rgba(255,81,47,0.04) 100%)', 
        border: '1px solid rgba(255,106,61,0.25)', 
        borderRadius: '20px', 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1.5rem',
        marginBottom: '3.5rem' 
      }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
            রিটার্ন বা এক্সচেঞ্জ সংক্রান্ত সাহায্য প্রয়োজন?
          </h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
            আমাদের কাস্টমার কেয়ার টিম আপনাকে তাৎক্ষণিক সাহায্য করতে প্রস্তুত।
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href={`tel:${phone.replace(/[\s-]+/g, '')}`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700 }}>
            <Phone size={16} /> কল করুন: {phone}
          </a>
          <a href={`mailto:${email}`} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 600 }}>
            <Mail size={16} /> ইমেইল করুন
          </a>
        </div>
      </div>

      {/* 5. Policy FAQs Accordion */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
          সাধারণ জিজ্ঞাসা (FAQ)
        </h2>

        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {policyFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', background: '#ffffff' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.15rem 1.35rem',
                    background: isOpen ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease', color: 'var(--accent-primary)', flexShrink: 0 }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.35rem 1.25rem', background: '#f8fafc', color: '#64748b', lineHeight: '1.7', fontSize: '0.95rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN DYNAMIC PAGE COMPONENT
   ========================================================================== */
const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageAndSettings = async () => {
      try {
        setLoading(true);
        setError('');
        const apiUrl = import.meta.env.VITE_API_URL || '';
        
        const [pageRes, genRes] = await Promise.all([
          fetch(`${apiUrl}/api/pages/${slug}`).catch(() => null),
          fetch(`${apiUrl}/api/settings/general_settings`).catch(() => null)
        ]);

        if (genRes && genRes.ok) {
          const genData = await genRes.json();
          setGeneralSettings(genData);
        }

        if (pageRes && pageRes.ok) {
          const data = await pageRes.json();
          setPage(data);
        } else {
          // If slug is about-us, return-exchange, faq, or contact, provide elegant automatic fallback data
          if (slug === 'about-us') {
            setPage({
              title: 'About Us',
              slug: 'about-us',
              sections: [{ type: 'about_hero', data: {} }]
            });
          } else if (slug === 'return-exchange') {
            setPage({
              title: 'রিটার্ন ও এক্সচেঞ্জ পলিসি',
              slug: 'return-exchange',
              sections: [{ type: 'return_exchange', data: {} }]
            });
          } else if (slug === 'faq') {
            setPage({
              title: 'সাধারণ জিজ্ঞাসা (FAQ)',
              slug: 'faq',
              sections: [{ type: 'faq', data: {} }]
            });
          } else if (slug === 'contact') {
            setPage({
              title: 'Contact Us',
              slug: 'contact',
              sections: [{ type: 'contact_form', data: {} }]
            });
          } else {
            setError('Page not found');
          }
        }
      } catch (err) {
        if (slug === 'about-us') {
          setPage({
            title: 'About Us',
            slug: 'about-us',
            sections: [{ type: 'about_hero', data: {} }]
          });
        } else if (slug === 'return-exchange') {
          setPage({
            title: 'রিটার্ন ও এক্সচেঞ্জ পলিসি',
            slug: 'return-exchange',
            sections: [{ type: 'return_exchange', data: {} }]
          });
        } else if (slug === 'faq') {
          setPage({
            title: 'সাধারণ জিজ্ঞাসা (FAQ)',
            slug: 'faq',
            sections: [{ type: 'faq', data: {} }]
          });
        } else {
          setError('Error loading page');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageAndSettings();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '42px', height: '42px', border: '3px solid #e2e8f0', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <p style={{ color: '#64748b', fontWeight: 600 }}>লোডিং হচ্ছে...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container" style={{ padding: '5rem 0', minHeight: '60vh', textAlign: 'center' }}>
        <Helmet>
          <title>Page Not Found - Kinaboo</title>
        </Helmet>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>পেজটি খুঁজে পাওয়া যায়নি</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: 1.6 }}>আপনি যে পেজটি খুঁজছেন তা স্থানান্তরিত বা মুছে ফেলা হয়েছে।</p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '12px', fontWeight: 700 }}>
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const isFullWidthPage = slug === 'about-us' || slug === 'return-exchange' || slug === 'faq' || page.sections?.some(s => s.type === 'about_hero' || s.type === 'return_exchange');

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem', minHeight: '65vh' }}>
      <Helmet>
        <title>{page.title} - {generalSettings?.siteName || 'Kinaboo'}</title>
        <meta name="description" content={`${page.title} | ${generalSettings?.storeBio || 'Kinaboo Ecommerce'}`} />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.75rem' }}>
        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>হোম</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{page.title}</span>
      </div>
      
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '24px', 
        padding: isFullWidthPage ? '1.5rem' : '2.5rem', 
        border: '1px solid #eef2f6', 
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)' 
      }}>
        {!isFullWidthPage && (
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            color: 'var(--text-primary)', 
            marginBottom: '1.75rem', 
            paddingBottom: '1rem', 
            borderBottom: '1px solid #f1f5f9' 
          }}>
            {page.title}
          </h1>
        )}
        
        {slug === 'faq' ? (
          <FullFaqPageSection data={page.sections?.find(s => s.type === 'faq')?.data || {}} generalSettings={generalSettings} />
        ) : slug === 'return-exchange' && (!page.sections || page.sections.length === 0 || (page.sections.length === 1 && page.sections[0].type === 'richtext' && page.sections[0].data?.html?.includes('আমাদের রিটার্ন'))) ? (
          <ReturnExchangeSection generalSettings={generalSettings} />
        ) : page.sections && page.sections.length > 0 ? (
          <div>
            {page.sections.map((section, index) => {
              switch (section.type) {
                case 'about_hero':
                  return <FullAboutSection key={section.id || index} data={section.data} generalSettings={generalSettings} />;
                case 'return_exchange':
                  return <ReturnExchangeSection key={section.id || index} generalSettings={generalSettings} />;
                case 'richtext':
                  return <RichTextSection key={section.id || index} data={section.data} />;
                case 'faq':
                  return <FullFaqPageSection key={section.id || index} data={section.data} generalSettings={generalSettings} />;
                case 'contact_form':
                  return <ContactFormSection key={section.id || index} data={section.data} generalSettings={generalSettings} />;
                default:
                  return null;
              }
            })}
          </div>
        ) : (
          <FullAboutSection data={{}} generalSettings={generalSettings} />
        )}
      </div>
    </div>
  );
};

export default DynamicPage;
