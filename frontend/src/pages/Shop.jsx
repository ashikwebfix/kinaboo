import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { ChevronRight, Filter, ChevronLeft, Loader, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState(searchParams.get('categories') ? searchParams.get('categories').split(',') : []);
  const [selectedTags, setSelectedTags] = useState(searchParams.get('tags') ? searchParams.get('tags').split(',') : []);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 2000);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  
  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (searchQuery) params.set('q', searchQuery);
    if (maxPrice < 2000) params.set('maxPrice', maxPrice);
    if (inStockOnly) params.set('inStock', 'true');
    if (sortBy !== 'featured') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [selectedCategories, selectedTags, searchQuery, maxPrice, inStockOnly, sortBy, setSearchParams]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

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

  // Filter logic (tags and categories fetched inside sidebar)

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by Tags
    if (selectedTags.length > 0) {
      result = result.filter(p => {
        let pTags = [];
        if (Array.isArray(p.tags)) pTags = p.tags;
        else if (typeof p.tags === 'string') {
          try { pTags = JSON.parse(p.tags); } catch(e) {}
        }
        // Match if product has at least one of the selected tags
        return selectedTags.some(t => pTags.includes(t));
      });
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // Filter by Price
    result = result.filter(p => {
      const price = Number(p.sellPrice || p.price);
      return price <= maxPrice;
    });

    // Filter by Stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => Number(a.sellPrice || a.price) - Number(b.sellPrice || b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => Number(b.sellPrice || b.price) - Number(a.sellPrice || a.price));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    return result;
  }, [products, selectedCategories, selectedTags, maxPrice, inStockOnly, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="container" style={{ padding: '2rem 2rem 5rem' }}>
        <Helmet>
        <title>Shop All Products | kinaboo.com</title>
        <meta name="description" content="Browse our complete collection of products. Filter by category, price, and tags to find exactly what you need." />
      </Helmet>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <Link to="/" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Shop</span>
      </div>

      {/* Shop Banner */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', marginBottom: '3rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
          alt="Shop Collection" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', margin: 0 }}>আমাদের কালেকশন দেখুন</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '500px' }}>আপনার জন্য বিশেষভাবে বাছাই করা সেরা পণ্যগুলো আবিষ্কার করুন।</p>
        </div>
      </div>

      <div className="shop-layout" style={{ position: 'relative' }}>
        
        {/* Mobile Sticky Sidebar Wrapper */}
        <div className={`mobile-sticky-filter ${isMobileFilterOpen ? 'open' : ''}`}>
          
          {/* Moved overlay inside the sticky wrapper so it shares the exact same stacking context, guaranteed to sit behind the filter but cover the screen */}
          <div 
            className="filter-overlay"
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>

          <div className="mobile-filter-btn-container">
            <button 
              className="mobile-filter-btn" 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              {isMobileFilterOpen ? <X size={20} /> : <Filter size={20} />}
            </button>
          </div>

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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage}
            showSearch={true}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
          />
        </div>

        {/* Main Content Area */}
        <main className="shop-main">
          
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--card-bg)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              দেখাচ্ছে {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} টি (মোট {filteredProducts.length} টি প্রোডাক্টের মধ্যে)
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>সাজান:</span>
              <select 
                className="input-field" 
                style={{ padding: '0.5rem 1rem', width: 'auto', background: '#f8fafc', fontWeight: '500', cursor: 'pointer' }}
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="featured">ফিচারড</option>
                <option value="newest">নতুন প্রোডাক্ট</option>
                <option value="price_asc">দাম: কম থেকে বেশি</option>
                <option value="price_desc">দাম: বেশি থেকে কম</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <Loader size={48} className="animate-spin" color="var(--accent-primary)" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="shop-grid">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showRating={true} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>আপনার সার্চ অনুযায়ী কোনো পণ্য পাওয়া যায়নি</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>আপনার প্রয়োজনীয় পণ্যটি পেতে অন্য কোনো ক্যাটাগরি বা দামের রেঞ্জ সিলেক্ট করে দেখুন।</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedTags([]);
                  setMaxPrice(2000);
                  setInStockOnly(false);
                  setCurrentPage(1);
                }}
              >
                সব ফিল্টার মুছে ফেলুন
              </button>
            </div>
          )}
          
        </main>
      </div>
    </div>
    </>
  );
};

export default Shop;
