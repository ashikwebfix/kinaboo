import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Tag, Star } from 'lucide-react';

/* ─── Inline Product Card (rendered when [product N] shortcode is found) ─── */
const InlineProductCard = ({ product }) => {
  const mainImg = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const sellPrice = Number(product.sellPrice || product.price || 0);
  const comparePrice = Number(product.comparePrice || product.regularPrice || 0);
  const discountPercent = comparePrice > sellPrice
    ? Math.round(((comparePrice - sellPrice) / comparePrice) * 100)
    : 0;

  return (
    <div className="blog-inline-product">
      {/* Header banner */}
      <div className="bip-header">
        <div className="bip-header-text">
          <span className="bip-eyebrow">Featured Product</span>
          <h3 className="bip-name">{product.name}</h3>
        </div>
        {discountPercent > 0 && (
          <div className="bip-discount-badge">
            <Tag size={12} />
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Image + Info row */}
      <div className="bip-body">
        {mainImg && (
          <div className="bip-img-wrap">
            <img src={mainImg} alt={product.name} className="bip-img" />
          </div>
        )}
        <div className="bip-info">
          {product.rating && (
            <div className="bip-stars">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color={s <= Math.round(product.rating) ? '#f59e0b' : '#cbd5e1'} />
              ))}
              <span className="bip-rating-count">({product.reviewCount || '100+'})</span>
            </div>
          )}
          <div className="bip-price-row">
            <span className="bip-sell-price">৳{sellPrice.toLocaleString()}</span>
            {comparePrice > sellPrice && (
              <span className="bip-compare-price">৳{comparePrice.toLocaleString()}</span>
            )}
          </div>
          {product.shortDescription && (
            <p className="bip-short-desc">{product.shortDescription}</p>
          )}
          <Link to={`/product/${product.slug}`} className="bip-buy-btn">
            <ShoppingBag size={16} />
            <span>এখনই কিনুন</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ─── Parse blog content for [product N] shortcodes ─── */
const renderBlogContent = (htmlContent, products) => {
  // Split on [product N] shortcodes (case-insensitive)
  const SHORTCODE_RE = /(\[product\s+(\d+)\])/gi;
  const parts = htmlContent.split(SHORTCODE_RE);
  // split result: [text, fullMatch, capGroup, text, fullMatch, capGroup, ...]
  const elements = [];
  let i = 0;
  while (i < parts.length) {
    const chunk = parts[i];
    // Check if this chunk is a shortcode full match (e.g. "[product 1]")
    if (/^\[product\s+\d+\]$/i.test(chunk)) {
      // Next part (i+1) is the capture group with the number — skip it
      const num = parseInt(parts[i + 1] || chunk.match(/\d+/)[0], 10);
      const product = products[num - 1]; // [product 1] → index 0
      if (product) {
        elements.push(<InlineProductCard key={`prod-${i}`} product={product} />);
      }
      i += 2; // skip full match + capture group
    } else if (chunk) {
      elements.push(
        <div
          key={`html-${i}`}
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: chunk }}
        />
      );
      i += 1;
    } else {
      i += 1;
    }
  }
  return elements;
};

/* ─── Main BlogView Component ─── */
const BlogView = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkedProducts, setLinkedProducts] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, and Mac equivalents
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.metaKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${slug}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBlog(data);
      
      if (data.linkedProductIds && data.linkedProductIds.length > 0) {
        fetchProducts(data.linkedProductIds);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchProducts = async (ids) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      const allProducts = data.products || data || [];
      const filtered = allProducts.filter(p => ids.includes(p.id));
      setLinkedProducts(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!blog) {
    return <div style={{ padding: '4rem 2rem', textAlign: 'center', fontSize: '1.5rem', color: '#64748b' }}>Blog not found.</div>;
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Check if the blog content contains any product shortcodes
  const hasShortcodes = /\[product\s+\d+\]/i.test(blog.content || '');

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Advertorial
      </div>
      
      <div style={{ maxWidth: '1366px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <style>{`
          .blog-layout { display: flex; flex-direction: column; gap: 3rem; }
          .blog-main { flex: 1; }
          .blog-sidebar { width: 100%; max-width: 350px; margin: 0 auto; }
          .blog-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5rem 0; }
          .blog-content p { line-height: 1.8; color: #334155; font-size: 1.1rem; margin-bottom: 1.5rem; }
          .blog-content h2, .blog-content h3 { color: #1e293b; margin-top: 2rem; margin-bottom: 1rem; }
          .blog-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
          .blog-content li { margin-bottom: 0.5rem; color: #334155; font-size: 1.1rem; }
          
          @keyframes scalePulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.6); }
            40% { transform: scale(1.06); box-shadow: 0 0 18px 8px rgba(0,0,0,0.25); }
            70% { transform: scale(1.03); box-shadow: 0 0 10px 4px rgba(0,0,0,0.15); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          }

          .blog-cta-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #000;
            color: #fff;
            padding: 1.1rem 1.5rem;
            font-weight: 800;
            font-size: 1.05rem;
            border-radius: 0;
            border: none;
            width: 100%;
            cursor: pointer;
            animation: scalePulse 1.6s ease-in-out infinite;
            letter-spacing: 0.02em;
            text-decoration: none;
          }

          .blog-cta-btn:hover {
            background: #111;
          }

          /* ── Inline Product Card (shortcode rendered) ── */
          .blog-inline-product {
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
            margin: 2.5rem 0;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            background: #fff;
          }

          .bip-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 1.25rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }

          .bip-eyebrow {
            display: block;
            font-size: 0.7rem;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 0.3rem;
          }

          .bip-name {
            font-size: 1.2rem;
            font-weight: 800;
            color: #fff;
            margin: 0;
            line-height: 1.3;
          }

          .bip-discount-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            background: #FF6A3D;
            color: #fff;
            font-size: 0.78rem;
            font-weight: 800;
            padding: 0.4rem 0.75rem;
            border-radius: 9999px;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .bip-body {
            display: flex;
            gap: 0;
            align-items: stretch;
          }

          .bip-img-wrap {
            width: 200px;
            flex-shrink: 0;
            background: #f8fafc;
            overflow: hidden;
          }

          .bip-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .bip-info {
            flex: 1;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            justify-content: center;
          }

          .bip-stars {
            display: flex;
            align-items: center;
            gap: 0.2rem;
          }

          .bip-rating-count {
            font-size: 0.78rem;
            color: #94a3b8;
            margin-left: 0.35rem;
          }

          .bip-price-row {
            display: flex;
            align-items: baseline;
            gap: 0.75rem;
          }

          .bip-sell-price {
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
          }

          .bip-compare-price {
            font-size: 1rem;
            color: #94a3b8;
            text-decoration: line-through;
          }

          .bip-short-desc {
            font-size: 0.9rem;
            color: #64748b;
            line-height: 1.6;
            margin: 0;
          }

          .bip-buy-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            background: #000;
            color: #fff;
            padding: 0.85rem 1.75rem;
            font-weight: 800;
            font-size: 1rem;
            border-radius: 8px;
            text-decoration: none;
            animation: scalePulse 1.8s ease-in-out infinite;
            margin-top: 0.25rem;
            align-self: flex-start;
            letter-spacing: 0.03em;
          }

          .bip-buy-btn:hover {
            background: #1e293b;
            animation: none;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          }

          @media (max-width: 600px) {
            .bip-body { flex-direction: column; }
            .bip-img-wrap { width: 100%; height: 220px; }
            .bip-buy-btn { align-self: stretch; justify-content: center; }
          }

          @media (min-width: 1024px) {
            .blog-layout { flex-direction: row; gap: 4rem; }
            .blog-sidebar { position: sticky; top: 2rem; align-self: start; }
          }
        `}</style>
        
        <div className="blog-layout">
          {/* Main Content */}
          <main className="blog-main">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.2, marginBottom: '0.5rem' }}>
              {blog.title}
            </h1>
            
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>{blog.author || 'Admin'}</span>
              <span>—</span>
              <span>{formattedDate}</span>
            </div>

            {blog.image && (
              <img src={blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_URL || ''}${blog.image}`} alt={blog.title} style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            )}

            {/* Render content: parse [product N] shortcodes if any */}
            {hasShortcodes && linkedProducts.length > 0
              ? renderBlogContent(blog.content, linkedProducts)
              : <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
            }
          </main>

          {/* Sidebar — only shown when there are NO inline shortcodes */}
          {!hasShortcodes && (
            <aside className="blog-sidebar">
              {linkedProducts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {linkedProducts.map(product => {
                    const mainImg = product.images && product.images.length > 0 ? product.images[0] : product.image;
                    const discountPercent = product.comparePrice > product.sellPrice 
                      ? Math.round(((product.comparePrice - product.sellPrice) / product.comparePrice) * 100) 
                      : 0;

                    return (
                      <Link key={product.id} to={`/product/${product.slug}`} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}>
                        <div style={{ background: '#000', padding: '1.5rem', color: '#fff', textAlign: 'center' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                            Say goodbye to pain and sweat with {product.name}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0 }}>Pain-free and sweat-free</p>
                        </div>
                        
                        <img src={mainImg} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        
                        {discountPercent > 0 && (
                          <div style={{ background: '#fff', padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000', marginBottom: '0' }}>
                              GET {discountPercent}% OFF
                            </div>
                          </div>
                        )}

                        <div className="blog-cta-btn">
                          <span>স্টক আছে কিনা দেখুন</span>
                          <ArrowRight size={18} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogView;
