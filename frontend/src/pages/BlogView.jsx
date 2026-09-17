import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

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

          .action-btn {
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

            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          </main>

          {/* Sidebar */}
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

                      <div className="action-btn">
                        <span>স্টক আছে কিনা দেখুন</span>
                        <ArrowRight size={18} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
