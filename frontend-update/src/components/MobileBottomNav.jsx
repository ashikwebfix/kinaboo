import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFavoritesStore from '../store/useFavoritesStore';

const MobileBottomNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const favorites = useFavoritesStore((state) => state.favorites);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (!mounted) return null;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <div className="nav-icon-wrapper">
          <Home size={21} strokeWidth={isActive('/') ? 2.4 : 1.9} />
        </div>
        <span className="nav-label">Home</span>
      </Link>

      <Link to="/shop" className={`nav-item ${isActive('/shop') ? 'active' : ''}`}>
        <div className="nav-icon-wrapper">
          <ShoppingBag size={21} strokeWidth={isActive('/shop') ? 2.4 : 1.9} />
        </div>
        <span className="nav-label">Shop</span>
      </Link>

      <Link 
        to={userInfo && userInfo.token ? "/profile" : "/login"} 
        className={`nav-item ${isActive('/favorites') ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <Heart size={21} strokeWidth={isActive('/favorites') ? 2.4 : 1.9} />
          {favorites?.length > 0 && (
            <span className="nav-badge wishlist-badge">
              {favorites.length}
            </span>
          )}
        </div>
        <span className="nav-label">Wishlist</span>
      </Link>

      <button 
        type="button"
        id="mobile-nav-cart-btn" 
        onClick={() => setIsCartOpen(true)} 
        className="nav-item cart-nav-item" 
        aria-label="Shopping Cart"
      >
        <div className="nav-icon-wrapper">
          <ShoppingCart size={21} strokeWidth={1.9} />
          {cartItemCount > 0 && (
            <span className="nav-badge cart-badge">
              {cartItemCount}
            </span>
          )}
        </div>
        <span className="nav-label">Cart</span>
      </button>

      <Link 
        to={userInfo && userInfo.token ? "/profile" : "/login"} 
        className={`nav-item ${isActive('/profile') || isActive('/login') ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <User size={21} strokeWidth={isActive('/profile') || isActive('/login') ? 2.4 : 1.9} />
        </div>
        <span className="nav-label">{userInfo && userInfo.token ? 'Account' : 'Login'}</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
