"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/blogs`);
        if (res.ok) {
          const data = await res.json();
          // Filter out unpublished or empty blogs just in case
          const publishedBlogs = data.filter(b => b.status === 'published' || !b.status);
          setBlogs(publishedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';

  return (
    <>
      <Helmet>
        <title>Blog | kinaboo.com</title>
        <meta name="description" content="Read our latest updates, guides, and tips." />
      </Helmet>

      <div className="page-header" style={{ padding: '60px 20px', background: 'var(--card-bg, #fff)', textAlign: 'center', borderBottom: '1px solid var(--border-color, #eaeaea)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-color, #222)' }}>
          Our Blog
        </h1>
        <p style={{ color: 'var(--text-muted, #666)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Latest news, tips, and updates.
        </p>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#666' }}>Loading articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <BookOpen size={48} style={{ margin: '0 auto', color: '#ccc', marginBottom: '20px' }} />
            <h2>No Articles Yet</h2>
            <p style={{ color: '#666' }}>Check back later for new updates!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {blogs.map((blog) => {
              const excerpt = stripHtml(blog.content);
              
              // Handle image URL
              let imageUrl = blog.image;
              if (imageUrl && !imageUrl.startsWith('http')) {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                imageUrl = `${apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
              }

              return (
                <div key={blog.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--card-bg, #fff)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color, #eaeaea)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }} className="blog-card"
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {imageUrl ? (
                    <Link href={`/blog/${blog.slug}`} style={{ display: 'block', height: '220px', overflow: 'hidden' }}>
                      <img 
                        src={imageUrl} 
                        alt={blog.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </Link>
                  ) : (
                    <Link href={`/blog/${blog.slug}`} style={{ display: 'flex', height: '220px', background: '#f5f5f5', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={48} color="#ccc" />
                    </Link>
                  )}
                  
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '15px', color: '#888', fontSize: '0.85rem', marginBottom: '15px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={14} />
                        {blog.author || 'Admin'}
                      </span>
                    </div>
                    
                    <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.3' }}>
                        {blog.title}
                      </h2>
                    </Link>
                    
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                      {excerpt.length > 150 ? excerpt.substring(0, 150) + '...' : excerpt}
                    </p>
                    
                    <Link href={`/blog/${blog.slug}`} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: 'var(--primary-color, #000)', 
                      fontWeight: '600',
                      textDecoration: 'none',
                      marginTop: 'auto'
                    }}>
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          border-top-color: #000;
          animation: spin 1s ease-in-out infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default BlogList;
