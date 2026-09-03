import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import ExpressCheckoutModal from './ExpressCheckoutModal';

const SideCart = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, getCartTotal } = useCartStore();
  const [showExpressModal, setShowExpressModal] = useState(false);
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('sidecart-overlay')) {
      setIsCartOpen(false);
    }
  };

  const handleCheckout = () => {
    setShowExpressModal(true);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  if (!isCartOpen && !showExpressModal) return null;

  const totalItemCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  const rawSubtotal = typeof getCartTotal === 'function' ? getCartTotal() : 0;
  const subtotal = typeof rawSubtotal === 'number' ? rawSubtotal : Number(rawSubtotal) || 0;

  const drawerContent = (
    <>
      {isCartOpen && (
        <div 
          className="sidecart-overlay" 
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          style={{ zIndex: 999999 }}
        >
          <div 
            className="sidecart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sidecart-header">
              <div className="sidecart-header-title">
                <div className="sidecart-icon-badge">
                  <ShoppingBag size={18} />
                </div>
                <h2 className="sidecart-title-text">My Shopping Cart</h2>
                {totalItemCount > 0 && (
                  <span className="sidecart-count-pill">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setIsCartOpen(false)} 
                className="sidecart-close-btn"
                title="Close Cart"
                aria-label="Close Shopping Cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping / Value Proposition Banner */}
            <div className="sidecart-perk-banner">
              <Sparkles size={16} />
              <span>অরিজিনাল প্রোডাক্ট ও দ্রুততম ক্যাশ অন ডেলিভারি</span>
            </div>

            {/* Cart Items List */}
            <div className="sidecart-body">
              {cartItems.length === 0 ? (
                <div className="sidecart-empty-wrap">
                  <div className="sidecart-empty-icon-box">
                    <ShoppingBag size={38} />
                  </div>
                  <h3 className="sidecart-empty-title">আপনার কার্ট খালি</h3>
                  <p className="sidecart-empty-text">আপনার পছন্দের প্রোডাক্টগুলো কার্টে যোগ করুন।</p>
                  <button 
                    type="button"
                    onClick={() => { setIsCartOpen(false); navigate('/shop'); }} 
                    className="btn btn-primary"
                    style={{ borderRadius: '10px', padding: '0.75rem 1.75rem' }}
                  >
                    শপিং শুরু করুন
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemKey = item.cartId || item.id || item._id;
                  const price = Number(item.sellPrice || item.price || 0);
                  const discount = item.bundleDiscount || 0;
                  const finalPrice = Math.max(0, price - discount);
                  const image = item.image || (item.images && item.images[0]) || 'https://placehold.co/150x150?text=Product';

                  return (
                    <div key={itemKey} className="sidecart-item-card">
                      {/* Thumbnail */}
                      <div className="sidecart-item-img-wrap">
                        <img 
                          src={image} 
                          alt={item.name} 
                          className="sidecart-item-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/150x150?text=Product';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="sidecart-item-info">
                        <div>
                          <h4 className="sidecart-item-name" title={item.name}>
                            {item.name}
                          </h4>

                          {/* Selected Variations / Modifiers */}
                          {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                            <div className="sidecart-item-variations">
                              {Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                            </div>
                          )}

                          {/* Unit / Final Price */}
                          <div className="sidecart-item-price-row">
                            <span className="sidecart-item-price">
                              ৳{finalPrice.toLocaleString()}
                            </span>
                            {discount > 0 && (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                ৳{price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions: Stepper + Trash */}
                        <div className="sidecart-item-actions">
                          <div className="sidecart-qty-stepper">
                            <button 
                              type="button"
                              onClick={() => updateCartQuantity(itemKey, Math.max(1, (item.qty || 1) - 1))}
                              className="sidecart-qty-btn"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="sidecart-qty-val">{item.qty || 1}</span>
                            <button 
                              type="button"
                              onClick={() => updateCartQuantity(itemKey, (item.qty || 1) + 1)}
                              className="sidecart-qty-btn"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button 
                            type="button"
                            onClick={() => removeFromCart(itemKey)} 
                            className="sidecart-remove-btn"
                            title="Remove Item"
                            aria-label="Remove Item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Action Area */}
            {cartItems.length > 0 && (
              <div className="sidecart-footer">
                <div className="sidecart-subtotal-row">
                  <span className="sidecart-subtotal-label">Subtotal:</span>
                  <span className="sidecart-subtotal-amount">৳{subtotal.toLocaleString()}</span>
                </div>
                
                <p className="sidecart-vat-note">ট্যাক্স ও ডেলিভারি চার্জ চেকআউটের সময় যুক্ত হবে</p>

                <div className="sidecart-footer-btn-row">
                  <button 
                    type="button"
                    onClick={handleViewCart} 
                    className="sidecart-viewcart-btn"
                  >
                    View Cart
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleCheckout} 
                    className="sidecart-checkout-btn"
                  >
                    <span>Checkout</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="sidecart-trust-row">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} color="#10b981" /> 100% Safe Checkout
                  </span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Truck size={14} color="var(--accent-primary)" /> Express Delivery
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showExpressModal && (
        <ExpressCheckoutModal 
          cartItems={cartItems} 
          onClose={() => setShowExpressModal(false)} 
        />
      )}
    </>
  );

  return createPortal(drawerContent, document.body);
};

export default SideCart;
