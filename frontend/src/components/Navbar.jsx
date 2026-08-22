import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFavoritesStore from '../store/useFavoritesStore';

const Navbar = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const favorites = useFavoritesStore((state) => state.favorites);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  
  const [mounted, setMounted] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const fetchMenu = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/header_menu');
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(searchQuery)}`);
          if (res.ok) {
            const data = await res.json();
            setLiveResults(data.slice(0, 5));
            setShowDropdown(true);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setIsSearching(false);
        }
      }, 500);

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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!mounted) return null;

  return (
    <nav className="navbar" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
        
        {/* Left: Brand / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="Kinaboo" style={{ height: '40px' }} />
        </Link>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '500px', display: 'flex', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="পণ্য খুঁজুন..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.length >= 3 && liveResults.length > 0) setShowDropdown(true); }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="input-field" 
            style={{ paddingRight: '3rem', borderRadius: '9999px', background: '#f8fafc', border: '1px solid var(--border-color)' }} 
          />
          <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {isSearching ? <Icons.Loader size={20} className="animate-spin" /> : <Icons.Search size={20} />}
          </button>
          
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', zIndex: 50, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {liveResults.length > 0 ? (
                <div>
                  {liveResults.map(product => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.slug || product.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--text-primary)', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <img src={product.image || product.images?.[0] || 'https://placehold.co/50x50?text=No+Image'} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                        <div style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '600' }}>${Number(product.sellPrice || product.price).toFixed(2)}</div>
                      </div>
                    </Link>
                  ))}
                  <Link 
                    to={`/search?q=${encodeURIComponent(searchQuery)}`}
                    style={{ display: 'block', padding: '0.75rem 1rem', textAlign: 'center', background: '#f8fafc', color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}
                    onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    "{searchQuery}" এর সব রেজাল্ট দেখুন
                  </Link>
                </div>
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  No products found.
                </div>
              )}
            </div>
          )}
        </form>

        {/* Right: Menu & Actions */}
        <div className="nav-desktop-menu" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          
          {/* Dynamic Menu Items */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
            {menuItems.map(item => {
              const IconComponent = item.icon ? Icons[item.icon] : null;
              return (
                <Link key={item.id} to={item.url} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem' }}>
                  {IconComponent && <IconComponent size={18} />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Icons */}
          <div style={{ display: 'flex', gap: '0rem', alignItems: 'center' }}>
            {/* Account */}
            {userInfo && userInfo.token ? (
              <Link to="/profile" className="nav-link" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }} title="Account">
                <Icons.User size={22} />
              </Link>
            ) : (
              <Link to="/login" className="nav-link" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }} title="Login">
                <Icons.User size={22} />
              </Link>
            )}

            {/* Favorites */}
            <Link to={userInfo && userInfo.token ? "/profile" : "/login"} className="nav-link" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative' }} title="Favorites">
              <Icons.Heart size={22} />
              {favorites?.length > 0 && (
                <span style={{
                  position: 'absolute', top: '0', right: '0', background: 'var(--accent-secondary)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold'
                }}>
                  {favorites.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className="nav-link" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }} title="Cart">
              <Icons.ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '0', right: '0', background: 'var(--accent-secondary)', color: 'white',
                  borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Icons.Menu size={28} />
        </button>

      </div>

      {/* Mobile Menu Overlay */}
      <div className={`nav-mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* Mobile Menu Panel */}
      <div className={`nav-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="heading-lg" style={{ fontSize: '1.5rem' }}>Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Icons.X size={28} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {menuItems.map(item => {
              const IconComponent = item.icon ? Icons[item.icon] : null;
              return (
                <Link key={item.id} to={item.url} className="nav-link" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {IconComponent && <IconComponent size={20} />}
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {userInfo && userInfo.token ? (
              <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} title="Account">
                <Icons.User size={28} />
              </Link>
            ) : (
              <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} title="Login">
                <Icons.User size={28} />
              </Link>
            )}

            <Link to={userInfo && userInfo.token ? "/profile" : "/login"} className="nav-link" onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'relative' }} title="Favorites">
              <Icons.Heart size={28} />
              {favorites?.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px', background: 'var(--accent-secondary)', color: 'white',
                  borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold'
                }}>
                  {favorites.length}
                </span>
              )}
            </Link>

            <button onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }} className="nav-link" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }} title="Cart">
              <Icons.ShoppingCart size={28} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px', background: 'var(--accent-secondary)', color: 'white',
                  borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
