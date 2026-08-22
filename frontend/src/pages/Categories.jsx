import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Loader } from 'lucide-react';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { Helmet } from 'react-helmet-async';

const Categories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sidebar Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterSearchQuery, setFilterSearchQuery] = useState('');

  // Redirect to Shop on filter change
  useEffect(() => {
    if (selectedCategories.length > 0 || selectedTags.length > 0 || maxPrice < 2000 || inStockOnly || filterSearchQuery) {
      const params = new URLSearchParams();
      if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      if (filterSearchQuery) params.set('q', filterSearchQuery);
      if (maxPrice < 2000) params.set('maxPrice', maxPrice);
      if (inStockOnly) params.set('inStock', 'true');
      navigate(`/shop?${params.toString()}`);
    }
  }, [selectedCategories, selectedTags, maxPrice, inStockOnly, filterSearchQuery, navigate]);

  // Extract unique categories and map them to their first product's image
  const categoriesList = useMemo(() => {
    const categoryMap = new Map();
    products.forEach(p => {
      if (p.category && !categoryMap.has(p.category)) {
        categoryMap.set(p.category, p.image); // Use the first product's image as the category cover
      }
    });

    return Array.from(categoryMap.entries()).map(([name, image]) => ({
      name,
      image,
      itemCount: products.filter(p => p.category === name).length
    }));
  }, [products]);

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesList;
    return categoriesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [categoriesList, searchQuery]);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 2rem 5rem' }}>
      <Helmet>
        <title>Categories | kinaboo.com</title>
        <meta name="description" content="Explore our wide range of product categories." />
        <meta property="og:title" content="Categories | kinaboo.com" />
        <meta property="og:description" content="Explore our wide range of product categories." />
        <meta property="og:image" content={`${window.location.origin}/favicon.svg`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <Link to="/" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Categories</span>
      </div>

      {/* Banner & Search Section */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', minHeight: '300px', marginBottom: '3rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <img 
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000" 
          alt="Categories" 
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, objectFit: 'cover' }} 
        />
        <div style={{ position: 'relative', height: '100%', minHeight: '300px', background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4))', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', margin: '0 0 1rem 0' }}>Explore Categories</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px' }}>
            Find exactly what you're looking for by browsing our extensive range of product categories.
          </p>
          
          <div style={{ position: 'relative', maxWidth: '500px', width: '100%' }}>
            <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '3rem', paddingRight: '1rem', background: 'rgba(255, 255, 255, 0.95)', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
      </div>

      {/* Categories Layout */}
      <div className="shop-layout">
        
        {/* Sidebar Filters */}
        <ProductFilterSidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          searchQuery={filterSearchQuery}
          setSearchQuery={setFilterSearchQuery}
          showSearch={true}
        />

        {/* Main Content Area */}
        <main className="shop-main">
          {/* Categories Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <Loader size={48} className="animate-spin" color="var(--accent-primary)" />
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid-cols-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {filteredCategories.map((category) => (
                <div 
                  key={category.name}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(category.name)}`)}
                  className="glass"
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    aspectRatio: '4/3'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 25px rgba(0,0,0,0.1)';
                    e.currentTarget.querySelector('.cat-overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%)';
                    e.currentTarget.querySelector('.cat-img').style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05)';
                    e.currentTarget.querySelector('.cat-overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)';
                    e.currentTarget.querySelector('.cat-img').style.transform = 'scale(1)';
                  }}
                >
                  <img 
                    src={category.image || 'https://placehold.co/400x400?text=No+Image'} 
                    alt={category.name}
                    className="cat-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <div 
                    className="cat-overlay"
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'flex-end', 
                      padding: '1.5rem',
                      transition: 'background 0.3s ease'
                    }}
                  >
                    <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.25rem 0' }}>{category.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>{category.itemCount} Product{category.itemCount !== 1 && 's'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>No categories found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any categories matching "{searchQuery}".</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;
