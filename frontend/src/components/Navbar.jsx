import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFavoritesStore from '../store/useFavoritesStore';

const Navbar = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + ((item.sellPrice || item.price || 0) * item.qty), 0);
  const favorites = useFavoritesStore((state) => state.favorites);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  
  const [userInfo, setUserInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Sync user from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) setUserInfo(JSON.parse(stored));
    } catch {
      setUserInfo(null);
    }
  }, [location.pathname]);

  // Scroll detection for sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [generalSettings, setGeneralSettings] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const trendingSearches = ['Smart Watch', 'Headphones', 'Polo Shirt', 'Backpack', 'Earbuds', 'Gadgets'];

  // Fetch Menu Items, Categories, General Settings & Suggested Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const [menuRes, catRes, genRes, prodRes] = await Promise.all([
          fetch(apiUrl + '/api/settings/header_menu').catch(() => null),
          fetch(apiUrl + '/api/categories').catch(() => null),
          fetch(apiUrl + '/api/settings/general_settings').catch(() => null),
          fetch(apiUrl + '/api/products').catch(() => null)
        ]);

        if (menuRes && menuRes.ok) {
          const data = await menuRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setMenuItems(data);
          }
        }
        if (catRes && catRes.ok) {
          const data = await catRes.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
        if (genRes && genRes.ok) {
          const data = await genRes.json();
          setGeneralSettings(data);
        }
        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData)) {
            setSuggestedProducts(prodData.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };
    fetchData();
  }, []);

  // Live search debounce
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            setLiveResults(Array.isArray(data) ? data.slice(0, 6) : []);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setIsSearching(false);
        }
      }, 350);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setShowDropdown(false);
      setLiveResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setIsMobileSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  if (!mounted) return null;

  // Default menu fallback if no API items set
  const displayMenuItems = menuItems.length > 0 ? menuItems : [
    { id: '1', label: 'Home', url: '/', icon: 'Home' },
    { id: '2', label: 'Shop All', url: '/shop', icon: 'ShoppingBag' },
    { id: '3', label: 'Categories', url: '/categories', icon: 'Grid' },
  ];

  return (
    <header className={`modern-header ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* 1. Top Announcement Bar */}
      {generalSettings?.showAnnouncementBar !== false && (
        <div className="header-top-bar">
          <div className="header-container header-top-content">
            <div className="top-bar-left">
              {generalSettings?.announcementBadge && (
                <span className="top-bar-badge">{generalSettings.announcementBadge}</span>
              )}
              <p className="top-bar-text">
                {generalSettings?.announcementText || '✨ Free Shipping on Orders Over ৳999 | Use Code: KINABOO'}
              </p>
            </div>
            <div className="top-bar-right">
              <Link to="/shipping" className="top-bar-link">
                <Icons.Truck size={13} />
                <span>{generalSettings?.trackOrderLabel || 'Track Order'}</span>
              </Link>
              <span className="top-bar-separator"></span>
              <a href={`tel:${(generalSettings?.phone || '+8801700000000').replace(/[\s-]+/g, '')}`} className="top-bar-link">
                <Icons.PhoneCall size={13} />
                <span>{generalSettings?.phone || '+880 1700-000000'}</span>
              </a>
              <span className="top-bar-separator"></span>
              <Link to="/profile" className="top-bar-link">
                <Icons.HelpCircle size={13} />
                <span>{generalSettings?.helpCenterLabel || 'Help Center'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Header */}
      <div className="header-main">
        <div className="header-container header-main-content">
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Icons.Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="brand-logo-link">
            <img src="/logo.svg" alt="Kinaboo" className="brand-logo-img" />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="header-search-wrapper" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="header-search-form">
              <div className="search-icon-box">
                {isSearching ? (
                  <Icons.Loader2 size={18} className="search-spin-icon" />
                ) : (
                  <Icons.Search size={18} />
                )}
              </div>
              <input
                type="text"
                className="header-search-input"
                placeholder="Search for authentic gadgets, fashion, shoes & more..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onClick={() => setShowDropdown(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear Search"
                >
                  <Icons.X size={16} />
                </button>
              )}
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </form>

            {/* Live Autocomplete / Suggestions Dropdown */}
            {showDropdown && (
              <div className="search-dropdown-menu">
                {searchQuery.trim().length >= 2 ? (
                  liveResults.length > 0 ? (
                    <div className="search-results-list">
                      <div className="search-dropdown-header">
                        <span>Products Found ({liveResults.length})</span>
                        <span className="search-shortcut-hint">Press Enter to view all</span>
                      </div>
                      {liveResults.map((product) => {
                        const price = Number(product.sellPrice || product.price || 0);
                        const originalPrice = Number(product.regularPrice || product.originalPrice || 0);
                        const hasDiscount = originalPrice > price;

                        return (
                          <Link
                            key={product.id || product._id}
                            to={`/product/${product.slug || product.id}`}
                            className="search-result-item"
                            onClick={() => setShowDropdown(false)}
                          >
                            <img
                              src={product.image || product.images?.[0] || 'https://placehold.co/80x80?text=Product'}
                              alt={product.name}
                              className="search-result-img"
                            />
                            <div className="search-result-info">
                              <span className="search-result-title">{product.name}</span>
                              <div className="search-result-meta">
                                <span className="search-result-price">৳{price.toLocaleString()}</span>
                                {hasDiscount && (
                                  <span className="search-result-old-price">৳{originalPrice.toLocaleString()}</span>
                                )}
                                {product.category && (
                                  <span className="search-result-category">{product.category}</span>
                                )}
                              </div>
                            </div>
                            <Icons.ChevronRight size={16} className="search-result-arrow" />
                          </Link>
                        );
                      })}
                      <Link
                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="search-view-all-btn"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>View all results for "{searchQuery}"</span>
                        <Icons.ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div className="search-no-results">
                      <Icons.PackageSearch size={32} />
                      <p>No products found for "{searchQuery}"</p>
                      <span>Try checking for spelling errors or searching for a broader term.</span>
                    </div>
                  )
                ) : (
                  /* Initial Click / Focus: Suggested Products & Trending Tags */
                  <div className="search-suggestions-panel">
                    {/* Trending Searches */}
                    <div className="search-trending-section">
                      <div className="search-dropdown-header" style={{ background: 'transparent', padding: '0.25rem 0', border: 'none' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                          <Icons.TrendingUp size={14} /> Trending Searches
                        </span>
                      </div>
                      <div className="search-trending-tags">
                        {trendingSearches.map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="search-trend-chip"
                            onClick={() => {
                              setSearchQuery(tag);
                              navigate(`/search?q=${encodeURIComponent(tag)}`);
                              setShowDropdown(false);
                            }}
                          >
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Products */}
                    {suggestedProducts.length > 0 && (
                      <div className="search-suggested-section" style={{ marginTop: '0.5rem' }}>
                        <div className="search-dropdown-header">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Icons.Sparkles size={14} color="#f59e0b" /> Suggested Products
                          </span>
                          <span className="search-shortcut-hint">Popular Right Now</span>
                        </div>
                        <div className="search-results-list">
                          {suggestedProducts.map((product) => {
                            const price = Number(product.sellPrice || product.price || 0);
                            const originalPrice = Number(product.regularPrice || product.originalPrice || 0);
                            const hasDiscount = originalPrice > price;

                            return (
                              <Link
                                key={`sug-${product.id || product._id}`}
                                to={`/product/${product.slug || product.id}`}
                                className="search-result-item"
                                onClick={() => setShowDropdown(false)}
                              >
                                <img
                                  src={product.image || product.images?.[0] || 'https://placehold.co/80x80?text=Product'}
                                  alt={product.name}
                                  className="search-result-img"
                                />
                                <div className="search-result-info">
                                  <span className="search-result-title">{product.name}</span>
                                  <div className="search-result-meta">
                                    <span className="search-result-price">৳{price.toLocaleString()}</span>
                                    {hasDiscount && (
                                      <span className="search-result-old-price">৳{originalPrice.toLocaleString()}</span>
                                    )}
                                    {product.category && (
                                      <span className="search-result-category">{product.category}</span>
                                    )}
                                  </div>
                                </div>
                                <Icons.ChevronRight size={16} className="search-result-arrow" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="header-actions">
            {/* Mobile Search Toggle */}
            <button
              className="action-btn mobile-search-toggle"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle Search"
            >
              <Icons.Search size={22} />
            </button>

            {/* Wishlist */}
            <Link
              to={userInfo ? "/profile?tab=wishlist" : "/login"}
              className="action-btn wishlist-action-btn"
              title="My Wishlist"
            >
              <div className="action-icon-wrap">
                <Icons.Heart size={22} />
                {favorites?.length > 0 && (
                  <span className="action-badge wishlist-badge">{favorites.length}</span>
                )}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Account / User Menu */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              {userInfo ? (
                <>
                  <button
                    className="action-btn user-logged-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="User Account Menu"
                  >
                    <div className="action-icon-wrap user-avatar-wrap">
                      <div className="user-avatar-initial">
                        {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : <Icons.User size={18} />}
                      </div>
                    </div>
                    <div className="user-info-text">
                      <span className="user-greeting">Hello,</span>
                      <span className="user-name-display">{userInfo.name?.split(' ')[0] || 'Account'}</span>
                    </div>
                    <Icons.ChevronDown size={14} className={`user-caret ${isUserMenuOpen ? 'open' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="user-dropdown-card">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{userInfo.name || 'Customer'}</p>
                        <p className="user-dropdown-email">{userInfo.email || userInfo.phone || ''}</p>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <Link to="/profile" className="user-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <Icons.User size={16} />
                        <span>My Profile</span>
                      </Link>
                      <Link to="/profile?tab=orders" className="user-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <Icons.Package size={16} />
                        <span>My Orders</span>
                      </Link>
                      <Link to="/profile?tab=wishlist" className="user-dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                        <Icons.Heart size={16} />
                        <span>Wishlist</span>
                      </Link>
                      {userInfo.role === 'admin' && (
                        <Link to="/admin" className="user-dropdown-item admin-item" onClick={() => setIsUserMenuOpen(false)}>
                          <Icons.ShieldCheck size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <div className="user-dropdown-divider"></div>
                      <button className="user-dropdown-item logout-item" onClick={handleLogout}>
                        <Icons.LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="action-btn" title="Sign In">
                  <div className="action-icon-wrap">
                    <Icons.User size={22} />
                  </div>
                  <div className="user-info-text">
                    <span className="user-greeting">Sign In</span>
                    <span className="user-name-display">Account</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Cart Drawer Trigger Button */}
            <button
              type="button"
              id="nav-cart-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCartOpen(true);
              }}
              className="action-btn cart-trigger-btn"
              title="Shopping Cart"
              aria-label="Open Shopping Cart"
              style={{ cursor: 'pointer' }}
            >
              <div className="action-icon-wrap" style={{ pointerEvents: 'none' }}>
                <Icons.ShoppingBag size={22} />
                {cartItemCount > 0 && (
                  <span className="action-badge cart-badge">{cartItemCount}</span>
                )}
              </div>
              <div className="cart-text-wrap" style={{ pointerEvents: 'none' }}>
                <span className="cart-sublabel">Cart</span>
                <span className="cart-total-amount">৳{cartTotal.toLocaleString()}</span>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchOpen && (
          <div className="mobile-search-expand-bar">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <Icons.Search size={18} className="mobile-search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <button
                type="button"
                className="mobile-search-close"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <Icons.X size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Sub-Navigation Bar (Categories & Quick Links) */}
      <div className="header-sub-nav">
        <div className="header-container header-sub-content">
          
          {/* Categories Mega Dropdown Button */}
          <div className="category-dropdown-container" ref={categoryMenuRef}>
            <button
              className="category-trigger-btn"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              aria-label="Browse All Categories"
            >
              <Icons.Grid size={18} />
              <span>All Categories</span>
              <Icons.ChevronDown size={15} className={`category-caret ${isCategoryMenuOpen ? 'open' : ''}`} />
            </button>

            {/* Categories Popup Menu */}
            {isCategoryMenuOpen && (
              <div className="category-dropdown-card">
                {categories.length > 0 ? (
                  <div className="category-menu-grid">
                    {categories.slice(0, 10).map((cat) => (
                      <Link
                        key={cat.id || cat._id}
                        to={`/shop?category=${encodeURIComponent(cat.title || cat.name)}`}
                        className="category-menu-item"
                        onClick={() => setIsCategoryMenuOpen(false)}
                      >
                        {cat.image ? (
                          <img src={cat.image} alt={cat.title || cat.name} className="cat-menu-icon-img" />
                        ) : (
                          <div className="cat-menu-icon-fallback">
                            <Icons.Sparkles size={15} />
                          </div>
                        )}
                        <span className="cat-menu-name">{cat.title || cat.name}</span>
                        <Icons.ChevronRight size={14} className="cat-menu-arrow" />
                      </Link>
                    ))}
                    <Link
                      to="/categories"
                      className="category-menu-view-all"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <span>Explore All Categories</span>
                      <Icons.ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="category-menu-grid">
                    <Link to="/shop" className="category-menu-item" onClick={() => setIsCategoryMenuOpen(false)}>
                      <Icons.Smartphone size={16} /> <span>Electronics & Gadgets</span>
                    </Link>
                    <Link to="/shop" className="category-menu-item" onClick={() => setIsCategoryMenuOpen(false)}>
                      <Icons.Shirt size={16} /> <span>Men's & Women's Fashion</span>
                    </Link>
                    <Link to="/shop" className="category-menu-item" onClick={() => setIsCategoryMenuOpen(false)}>
                      <Icons.Home size={16} /> <span>Home & Living</span>
                    </Link>
                    <Link to="/shop" className="category-menu-item" onClick={() => setIsCategoryMenuOpen(false)}>
                      <Icons.Sparkles size={16} /> <span>Beauty & Health</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="header-nav-links">
            {displayMenuItems.map((item) => {
              const IconComp = item.icon && Icons[item.icon] ? Icons[item.icon] : null;
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`sub-nav-link ${isActive ? 'active' : ''}`}
                >
                  {IconComp && <IconComp size={16} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Highlight Promo Tag */}
          <div className="header-sub-promo">
            <Link to="/shop?sort=discount" className="flash-deals-badge-link">
              <span className="flash-flame-icon">🔥</span>
              <span className="flash-deals-text">Flash Deals</span>
              <span className="flash-deals-chip">Up to 60% Off</span>
            </Link>
          </div>

        </div>
      </div>

      {/* 4. Mobile Drawer Navigation */}
      <div 
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className={`mobile-drawer-panel ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo.svg" alt="Kinaboo" style={{ height: '34px' }} />
          </Link>
          <button
            className="mobile-drawer-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <Icons.X size={24} />
          </button>
        </div>

        {/* User Status Bar in Drawer */}
        <div className="mobile-drawer-user-card">
          {userInfo ? (
            <div className="drawer-user-info">
              <div className="drawer-user-avatar">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="drawer-user-details">
                <p className="drawer-user-name">{userInfo.name || 'Customer'}</p>
                <Link 
                  to="/profile" 
                  className="drawer-user-profile-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View Profile →
                </Link>
              </div>
            </div>
          ) : (
            <div className="drawer-guest-box">
              <div>
                <p className="drawer-guest-title">Welcome to {generalSettings?.siteName || 'Kinaboo'}</p>
                <p className="drawer-guest-sub">Sign in for a tailored experience</p>
              </div>
              <Link
                to="/login"
                className="drawer-login-cta-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="mobile-drawer-body">
          <p className="drawer-section-title">Navigation</p>
          <div className="drawer-nav-list">
            {displayMenuItems.map((item) => {
              const IconComp = item.icon && Icons[item.icon] ? Icons[item.icon] : Icons.ChevronRight;
              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className="drawer-nav-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="drawer-nav-item-left">
                    <div className="drawer-item-icon-box">
                      <IconComp size={16} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <Icons.ChevronRight size={16} className="drawer-item-arrow" />
                </Link>
              );
            })}
            <Link
              to="/shop?sort=discount"
              className="drawer-nav-item highlight-deals"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="drawer-nav-item-left">
                <div className="drawer-item-icon-box">
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>🔥</span>
                </div>
                <span>Flash Deals</span>
              </div>
              <span className="drawer-deal-chip">Hot</span>
            </Link>
          </div>

          {/* Quick Categories */}
          {categories.length > 0 && (
            <>
              <p className="drawer-section-title" style={{ marginTop: '1.25rem' }}>Top Categories</p>
              <div className="drawer-cat-grid">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id || cat._id}
                    to={`/shop?category=${encodeURIComponent(cat.title || cat.name)}`}
                    className="drawer-cat-pill"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{cat.title || cat.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Support Info */}
          <div className="drawer-footer-support">
            <p className="drawer-section-title" style={{ margin: 0 }}>Need Help?</p>
            <a href={`tel:${(generalSettings?.phone || '+8801700000000').replace(/[\s-]+/g, '')}`} className="drawer-contact-row">
              <Icons.PhoneCall size={16} />
              <span>{generalSettings?.phone || '+880 1700-000000'}</span>
            </a>
            <div className="drawer-contact-row">
              <Icons.Truck size={16} />
              <span>Fast 24-48h Delivery</span>
            </div>
            <div className="drawer-contact-row">
              <Icons.ShieldCheck size={16} />
              <span>100% Authentic Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
