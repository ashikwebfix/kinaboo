import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Zap, Star, StarHalf, Check } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFavoritesStore from '../store/useFavoritesStore';
import toast from 'react-hot-toast';
import ExpressCheckoutModal from './ExpressCheckoutModal';
import { getImgUrl } from '../utils/imgPath';

const ProductCard = ({ product, showRating }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [isHovered, setIsHovered] = useState(false);
  const isProductFavorite = isFavorite(product.id || product._id);
  const [showExpressModal, setShowExpressModal] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Fake rating generation
  const ratings = [4, 4.5, 5];
  const str = (product.id || product._id || product.name || 'a').toString();
  const ratingIndex = (str.charCodeAt(0) + str.length) % 3;
  const rating = ratings[ratingIndex];
  const reviewsCount = 15 + (str.charCodeAt(str.length - 1) % 85);

  // Example placeholder for missing images to ensure design consistency
  const imageUrl = getImgUrl(product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800');

  const discountPercent = product.sellPrice && product.price > product.sellPrice 
    ? Math.round(((product.price - product.sellPrice) / product.price) * 100) 
    : 0;

  return (
    <div 
      className="product-card premium-card" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.08)' : '0 4px 6px rgba(0,0,0,0.02)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flex: 1,
        width: '100%',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'
      }}
    >
      {/* Top Left Badges */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ background: 'var(--accent-primary)', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '0.35rem 0.75rem', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          নতুন
        </span>
        {discountPercent > 0 && (
          <span style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '0.35rem 0.75rem', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {discountPercent}% ছাড়
          </span>
        )}
      </div>

      {/* Top Right Favorite Button */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
         <button 
           onClick={(e) => { 
             e.preventDefault(); 
             toggleFavorite(product);
             toast.success(isProductFavorite ? 'ফেভারিট থেকে রিমুভ করা হয়েছে' : 'ফেভারিটে যোগ করা হয়েছে', { icon: '❤️' });
           }} 
           style={{ 
             background: 'rgba(255,255,255,0.95)', border: 'none', width: '38px', height: '38px', 
             borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
             cursor: 'pointer', color: isProductFavorite ? '#ef4444' : 'var(--text-secondary)', 
             boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
             transform: isHovered ? 'scale(1)' : 'scale(0.9)',
             opacity: isHovered || isProductFavorite ? 1 : 0
           }}
           onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
           onMouseOut={e => e.currentTarget.style.transform = isHovered ? 'scale(1)' : 'scale(0.9)'}
         >
           <Heart size={18} fill={isProductFavorite ? '#ef4444' : 'none'} strokeWidth={isProductFavorite ? 0 : 2} />
         </button>
      </div>

      <Link to={`/product/${product.slug || product.id}`} style={{ display: 'block', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
        {/* Square 1:1 Aspect Ratio Container (20% height reduction from 4:5) */}
        <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f8f9fa' }}>
          <img 
            src={imageUrl} 
            alt={product.name}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover', 
              transform: isHovered ? 'scale(1.08)' : 'scale(1)', 
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
            }} 
          />
        </div>
        
        {/* Subtle Dark Overlay on Hover */}
        <div style={{ 
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)', 
          opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s', pointerEvents: 'none' 
        }}></div>
      </Link>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, background: '#fff' }}>
        <p className="pc-category" style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 0.5rem 0' }}>
          {product.category || 'Premium'}
        </p>
        
        <Link to={`/product/${product.slug || product.id}`} style={{ textDecoration: 'none', color: 'inherit', marginBottom: 'auto' }}>
          <h3 className="pc-title" style={{ fontSize: '1.05rem', fontWeight: '700', lineHeight: '1.4', margin: '0 0 1rem 0', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8em' }}>
            {product.name}
          </h3>
        </Link>
        
        {showRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(rating)) {
                return <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />;
              } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                return <StarHalf key={i} size={14} fill="#f59e0b" color="#f59e0b" />;
              } else {
                return <Star key={i} size={14} color="#d1d5db" />;
              }
            })}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.25rem', fontWeight: '600' }}>
              ({reviewsCount})
            </span>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem' }}>
            {product.sellPrice ? (
              <>
                <span className="pc-price" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>
                  {Number(product.sellPrice).toFixed(2)} BDT
                </span>
                <span className="pc-old-price" style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>
                  {Number(product.price).toFixed(2)} BDT
                </span>
              </>
            ) : (
              <span className="pc-price" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                {Number(product.price).toFixed(2)} BDT
              </span>
            )}
          </div>
          
          <button 
            title={product.stock <= 0 && !product.allowSellWithoutStock ? "স্টক শেষ" : "কার্টে যোগ করুন"}
            disabled={product.stock <= 0 && !product.allowSellWithoutStock}
            onMouseOver={e => !(product.stock <= 0 && !product.allowSellWithoutStock) && (e.currentTarget.style.color = isAdded ? 'var(--accent-primary)' : 'var(--accent-primary)')}
            onMouseOut={e => !(product.stock <= 0 && !product.allowSellWithoutStock) && (e.currentTarget.style.color = isAdded ? 'var(--accent-primary)' : 'var(--text-secondary)')}
            onClick={handleAddToCart}
            style={{ 
              background: 'transparent', 
              color: (product.stock <= 0 && !product.allowSellWithoutStock) ? '#d1d5db' : (isAdded ? 'var(--accent-primary)' : 'var(--text-secondary)'), 
              border: 'none', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: (product.stock <= 0 && !product.allowSellWithoutStock) ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
              transform: isAdded ? 'scale(1.1)' : 'scale(1)'
            }} 
          >
            {isAdded ? (
              <Check size={22} strokeWidth={3} />
            ) : (
              <ShoppingBag size={22} strokeWidth={2.5} />
            )}
          </button>
        </div>

        <button 
          className="pc-btn"
          style={{ 
            width: '100%',
            background: (product.stock <= 0 && !product.allowSellWithoutStock) ? '#f3f4f6' : (isHovered ? 'var(--accent-secondary)' : 'var(--bg-secondary)'), 
            color: (product.stock <= 0 && !product.allowSellWithoutStock) ? '#9ca3af' : (isHovered ? 'white' : 'var(--text-primary)'), 
            border: (product.stock <= 0 && !product.allowSellWithoutStock) ? '1px solid #e5e7eb' : (isHovered ? '1px solid var(--accent-secondary)' : '1px solid var(--border-color)'), 
            height: '44px', borderRadius: '8px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            cursor: (product.stock <= 0 && !product.allowSellWithoutStock) ? 'not-allowed' : 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: (product.stock <= 0 && !product.allowSellWithoutStock) ? 'none' : (isHovered ? '0 8px 15px rgba(249, 115, 22, 0.25)' : 'none'),
            fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase',
            marginTop: 'auto'
          }} 
          title={(product.stock <= 0 && !product.allowSellWithoutStock) ? "স্টক শেষ" : "এখুনি কিনুন"}
          disabled={product.stock <= 0 && !product.allowSellWithoutStock}
          onClick={(e) => {
            e.preventDefault();
            if (!(product.stock <= 0 && !product.allowSellWithoutStock)) setShowExpressModal(true);
          }}
        >
          <Zap size={16} fill={isHovered && !(product.stock <= 0 && !product.allowSellWithoutStock) ? "white" : "none"} /> {(product.stock <= 0 && !product.allowSellWithoutStock) ? "স্টক শেষ" : "এখুনি কিনুন"}
        </button>
      </div>

      {showExpressModal && (
        <ExpressCheckoutModal product={product} onClose={() => setShowExpressModal(false)} />
      )}
    </div>
  );
};

export default ProductCard;
