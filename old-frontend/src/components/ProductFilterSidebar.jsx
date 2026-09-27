import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Check, 
  Layers, 
  Tag, 
  PackageCheck, 
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';

const ProductFilterSidebar = ({
  products = [],
  selectedCategories = [],
  setSelectedCategories,
  selectedTags = [],
  setSelectedTags,
  maxPrice = 5000,
  setMaxPrice,
  inStockOnly = false,
  setInStockOnly,
  searchQuery = '',
  setSearchQuery,
  setCurrentPage,
  showSearch = true,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [globalProducts, setGlobalProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    // Fetch products and categories in parallel
    Promise.all([
      fetch(`${apiUrl}/api/products`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${apiUrl}/api/categories`).then(r => r.ok ? r.json() : []).catch(() => [])
    ]).then(([productsData, categoriesData]) => {
      if (Array.isArray(productsData) && productsData.length > 0) {
        setGlobalProducts(productsData);
      }
      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        setCategoriesList(categoriesData);
      }
    }).catch(err => console.error("Filter data fetch error:", err));
  }, []);

  // Use passed products or fetched products
  const activeProductsList = useMemo(() => {
    return (products && products.length > 0) ? products : globalProducts;
  }, [products, globalProducts]);

  // Compute dynamic max price from products
  const computedMaxLimit = useMemo(() => {
    if (!activeProductsList || activeProductsList.length === 0) return 5000;
    const highest = Math.max(...activeProductsList.map(p => Number(p.price || 0)));
    return highest > 0 ? Math.ceil(highest / 500) * 500 : 5000;
  }, [activeProductsList]);

  // Auto-discover all categories from database products and category collections
  const categoriesWithCount = useMemo(() => {
    const countMap = {};
    activeProductsList.forEach(p => {
      if (p.category) {
        const catName = typeof p.category === 'string' ? p.category.trim() : (p.category.name || '');
        if (catName) {
          countMap[catName] = (countMap[catName] || 0) + 1;
        }
      }
    });

    // Merge names from categoriesList and active products
    const namesSet = new Set([
      ...categoriesList.map(c => (typeof c === 'string' ? c : (c.name || c.title))?.trim()).filter(Boolean),
      ...Object.keys(countMap)
    ]);

    // If still empty (e.g. initial load before db populates), provide default discoverable list
    if (namesSet.size === 0) {
      ['Electronics', 'Fashion', 'Audio', 'Gadgets', 'Wearables'].forEach(c => namesSet.add(c));
    }

    return Array.from(namesSet).map(name => ({
      name,
      count: countMap[name] || 0
    })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [activeProductsList, categoriesList]);

  // Compute tags with count
  const allTagsWithCount = useMemo(() => {
    const tagMap = {};
    activeProductsList.forEach(p => {
      let pTags = [];
      if (Array.isArray(p.tags)) {
        pTags = p.tags;
      } else if (typeof p.tags === 'string') {
        try { 
          pTags = JSON.parse(p.tags); 
        } catch(e) {
          pTags = p.tags.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      pTags.forEach(t => {
        if (t && typeof t === 'string') {
          const cleanTag = t.trim();
          tagMap[cleanTag] = (tagMap[cleanTag] || 0) + 1;
        }
      });
    });

    return Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [activeProductsList]);

  // Active filters count
  const activeFiltersCount = (
    selectedCategories.length +
    selectedTags.length +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (maxPrice < computedMaxLimit ? 1 : 0)
  );

  // Toggle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    if (setCurrentPage) setCurrentPage(1);
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    if (setCurrentPage) setCurrentPage(1);
  };

  // Reset all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    if (showSearch && setSearchQuery) setSearchQuery('');
    setMaxPrice(computedMaxLimit);
    setInStockOnly(false);
    if (setCurrentPage) setCurrentPage(1);
  };

  const filteredCategoriesDisplay = categoriesWithCount.filter(c => 
    !categorySearch || c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <aside className={`shop-sidebar modern-filter-sidebar ${isMobileOpen ? 'open' : ''}`}>
      {/* 1. Header with Active Filter Badge & Quick Reset */}
      <div className="filter-header-card">
        <div className="filter-header-left">
          <div className="filter-icon-box">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h2 className="filter-main-title">ফিল্টার</h2>
            <span className="filter-subtitle">পছন্দের পণ্য খুঁজুন</span>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="active-filters-pill">
              {activeFiltersCount}
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="quick-reset-btn"
              title="রিসেট করুন"
            >
              <RotateCcw size={13} />
              <span>রিসেট</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Search Keyword Filter */}
      {showSearch && setSearchQuery && (
        <div className="modern-filter-group">
          <label className="filter-group-label">
            <Search size={15} />
            <span>কীওয়ার্ড সার্চ</span>
          </label>
          <div className="filter-search-box">
            <Search size={16} className="search-box-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="পণ্য বা মডেল লিখুন..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (setCurrentPage) setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Price Range Slider */}
      <div className="modern-filter-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <label className="filter-group-label" style={{ margin: 0 }}>
            <span>বাজেট ও দামের রেঞ্জ</span>
          </label>
          <span className="price-tag-value">
            ৳ {maxPrice.toLocaleString()}
          </span>
        </div>

        <div className="price-slider-container">
          <input
            type="range"
            min="0"
            max={computedMaxLimit}
            step="50"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              if (setCurrentPage) setCurrentPage(1);
            }}
            className="modern-range-input"
          />
        </div>

        <div className="price-range-limits">
          <span className="price-limit-badge">৳ 0</span>
          <span className="price-limit-badge">৳ {computedMaxLimit.toLocaleString()}+</span>
        </div>
      </div>

      {/* 4. Categories Filter */}
      <div className="modern-filter-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <label className="filter-group-label" style={{ margin: 0 }}>
            <Layers size={15} />
            <span>ক্যাটাগরি</span>
          </label>
          {selectedCategories.length > 0 && (
            <button 
              type="button" 
              onClick={() => setSelectedCategories([])}
              className="section-clear-link"
            >
              মুছে ফেলুন ({selectedCategories.length})
            </button>
          )}
        </div>

        {categoriesWithCount.length > 6 && (
          <div className="category-mini-search">
            <input
              type="text"
              placeholder="ক্যাটাগরি খুঁজুন..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="mini-search-input"
            />
          </div>
        )}

        <div className="filter-categories-list custom-scrollbar">
          {filteredCategoriesDisplay.length > 0 ? (
            filteredCategoriesDisplay.map(({ name, count }) => {
              const isChecked = selectedCategories.includes(name);
              return (
                <label 
                  key={name} 
                  className={`modern-category-item ${isChecked ? 'active' : ''}`}
                >
                  <div className="category-check-left">
                    <div className={`custom-checkbox-box ${isChecked ? 'checked' : ''}`}>
                      {isChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="category-item-name">{name}</span>
                  </div>
                  {count > 0 && (
                    <span className="category-item-count">{count}</span>
                  )}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(name)}
                    style={{ display: 'none' }}
                  />
                </label>
              );
            })
          ) : (
            <div className="filter-empty-state">
              কোনো ক্যাটাগরি পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>

      {/* 5. Tags / Features Pills */}
      {allTagsWithCount.length > 0 && (
        <div className="modern-filter-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <label className="filter-group-label" style={{ margin: 0 }}>
              <Tag size={15} />
              <span>পপুলার ট্যাগ</span>
            </label>
            {selectedTags.length > 0 && (
              <button 
                type="button" 
                onClick={() => setSelectedTags([])}
                className="section-clear-link"
              >
                মুছুন
              </button>
            )}
          </div>

          <div className="filter-tags-grid">
            {allTagsWithCount.slice(0, 14).map(({ tag, count }) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`modern-tag-chip ${isSelected ? 'active' : ''}`}
                >
                  <span>{tag}</span>
                  {count > 0 && <span className="tag-count-dot">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Stock Availability */}
      <div className="modern-filter-group" style={{ marginBottom: '1.25rem' }}>
        <label className="filter-group-label">
          <PackageCheck size={15} />
          <span>স্টক ও প্রাপ্যতা</span>
        </label>
        
        <label className={`stock-toggle-card ${inStockOnly ? 'active' : ''}`}>
          <div className="stock-toggle-left">
            <span className="stock-toggle-title">শুধুমাত্র স্টকে থাকা পণ্য</span>
            <span className="stock-toggle-desc">সরাসরি ডেলিভারিযোগ্য আইটেম</span>
          </div>
          <div className={`toggle-switch-ui ${inStockOnly ? 'on' : ''}`}>
            <div className="toggle-switch-handle"></div>
          </div>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              if (setCurrentPage) setCurrentPage(1);
            }}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* 7. Footer Reset All Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          className="filter-clear-all-btn"
          onClick={clearFilters}
        >
          <RotateCcw size={16} />
          <span>সব ফিল্টার মুছে ফেলুন</span>
        </button>
      )}
    </aside>
  );
};

export default ProductFilterSidebar;

