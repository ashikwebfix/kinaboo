import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Zap, Star, Check } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFavoritesStore from '../store/useFavoritesStore';
import toast from 'react-hot-toast';
import ExpressCheckoutModal from './ExpressCheckoutModal';
import { flyToCart } from '../utils/flyToCart';

const ProductCard = ({ product = {}, showRating = false }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [showExpressModal, setShowExpressModal] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const productId = product.id || product._id || '';
  const isProductFavorite = isFavorite(productId);

  const imageUrl = product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0 && !product.allowSellWithoutStock) return;
    
    const clickEvent = { currentTarget: e.currentTarget, clientX: e.clientX, clientY: e.clientY };
    addToCart(product);
    setIsAdded(true);
    toast.success('কার্টে যোগ করা হয়েছে', { icon: '🛍️' });

    flyToCart(clickEvent, imageUrl, () => {
      setIsCartOpen(true);
    });

    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    toast.success(
      isProductFavorite ? 'ফেভারিট থেকে রিমুভ করা হয়েছে' : 'ফেভারিটে যোগ করা হয়েছে',
      { icon: isProductFavorite ? '💔' : '❤️' }
    );
  };

  const handleExpressOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0 && !product.allowSellWithoutStock) return;
    setShowExpressModal(true);
  };

  // Pseudo rating calculation based on product identity for visual consistency
  const ratings = [4.8, 4.9, 5.0];
  const str = (productId || product.name || 'a').toString();
  const ratingIndex = (str.charCodeAt(0) + str.length) % 3;
  const rating = ratings[ratingIndex];
  const reviewsCount = 18 + (str.charCodeAt(str.length - 1) % 65);

  const regularPrice = Number(product.price) || 0;
  const currentPrice = product.sellPrice ? Number(product.sellPrice) : regularPrice;
  const hasDiscount = product.sellPrice && regularPrice > currentPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) 
    : 0;

  const isOutOfStock = product.stock <= 0 && !product.allowSellWithoutStock;

  return (
    <div className="product-card">
      {/* Media & Image Container */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Floating Badges */}
        <div className="product-badge-group">
          {discountPercent > 0 ? (
            <span className="product-badge-discount">-{discountPercent}%</span>
          ) : (
            <span className="product-badge-new">NEW</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`product-wishlist-btn ${isProductFavorite ? 'is-active' : ''}`}
          title={isProductFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart 
            size={16} 
            fill={isProductFavorite ? '#ef4444' : 'none'} 
            strokeWidth={isProductFavorite ? 0 : 2} 
          />
        </button>

        {/* Product Link Image */}
        <Link 
          to={`/product/${product.slug || productId}`} 
          className="product-card-media"
        >
          <img
            src={imageUrl}
            alt={product.name || 'Product'}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x400?text=Product';
            }}
          />
        </Link>
      </div>

      {/* Product Information Body */}
      <div className="product-card-body">
        <span className="product-card-category">
          {product.category || 'Collection'}
        </span>

        <Link 
          to={`/product/${product.slug || productId}`} 
          className="product-card-title"
          title={product.name}
        >
          {product.name}
        </Link>

        {showRating && (
          <div className="product-card-rating">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span className="product-rating-score">{rating.toFixed(1)}</span>
            <span className="product-rating-count">({reviewsCount})</span>
          </div>
        )}

        {/* Price Row */}
        <div className="product-card-price-row">
          <span className="product-current-price">
            ৳{currentPrice.toLocaleString('en-US')}
          </span>
          {hasDiscount && (
            <span className="product-old-price">
              ৳{regularPrice.toLocaleString('en-US')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            type="button"
            className="product-buy-now-btn"
            onClick={handleExpressOrder}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'স্টক শেষ' : 'অর্ডার করুন'}
          >
            <Zap size={14} fill={!isOutOfStock ? "currentColor" : "none"} />
            <span>{isOutOfStock ? 'স্টক শেষ' : 'অর্ডার করুন'}</span>
          </button>

          <button
            type="button"
            className={`product-add-cart-btn ${isAdded ? 'is-added' : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'স্টক শেষ' : 'কার্টে যোগ করুন'}
            aria-label="Add to cart"
          >
            {isAdded ? (
              <Check size={18} strokeWidth={2.5} />
            ) : (
              <ShoppingBag size={18} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {showExpressModal && (
        <ExpressCheckoutModal 
          product={product} 
          onClose={() => setShowExpressModal(false)} 
        />
      )}
    </div>
  );
};

export default ProductCard;

