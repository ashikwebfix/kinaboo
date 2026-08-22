import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { ChevronRight, Filter, ChevronLeft, Loader } from 'lucide-react';
import { trackSearch } from '../utils/tracking';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (query) trackSearch(query);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

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
    <div className="container animate-fade-in" style={{ padding: '2rem 2rem 5rem' }}>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <Link to="/" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--accent-primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Search Results</span>
      </div>

      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Search Results</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          {loading ? (
            <span>Searching for "{query}"...</span>
          ) : (
            <span>Found {products.length} matching product{products.length !== 1 ? 's' : ''} for "{query}"</span>
          )}
        </p>
      </div>

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
          setCurrentPage={setCurrentPage}
          showSearch={false}
        />

        {/* Main Content Area */}
        <main className="shop-main">
          
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--card-bg)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              Showing {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} results
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Sort By:</span>
              <select 
                className="input-field" 
                style={{ padding: '0.5rem 1rem', width: 'auto', background: '#f8fafc', fontWeight: '500', cursor: 'pointer' }}
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
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
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>No products match your filters</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Try adjusting your categories, tags, or price range.</p>
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
                Clear All Filters
              </button>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
