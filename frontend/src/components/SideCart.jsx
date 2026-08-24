import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { getImgUrl } from '../utils/imgPath';
import useCartStore from '../store/useCartStore';

const SideCart = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('sidecart-overlay')) {
      setIsCartOpen(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  if (!isCartOpen) return null;

  return (
    <div 
      className="sidecart-overlay" 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        background: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
        display: 'flex', justifyContent: 'flex-end'
      }}
    >
      <div 
        style={{
          width: '100%', maxWidth: '400px', height: '100%', background: '#fff',
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          animation: 'slideInRight 0.3s forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} /> My Cart
          </h2>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Your cart is empty.</p>
              <button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => {
                const itemKey = item.cartId || item.id;
                const price = Number(item.sellPrice || item.price);
                const discount = item.bundleDiscount || 0;
                const finalPrice = price - discount;
                const image = item.image || (item.images && item.images[0]) || 'https://placehold.co/100x100?text=No+Image';

                return (
                  <div key={itemKey} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <img src={getImgUrl(image)} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 }}>{item.name}</h4>
                        {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </div>
                        )}
                        <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                          ৳{finalPrice.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                          <button 
                            onClick={() => updateCartQuantity(itemKey, Math.max(1, item.qty - 1))}
                            style={{ background: '#f8fafc', border: 'none', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                          ><Minus size={14} /></button>
                          <span style={{ padding: '0 0.75rem', fontSize: '0.9rem', fontWeight: 500 }}>{item.qty}</span>
                          <button 
                            onClick={() => updateCartQuantity(itemKey, item.qty + 1)}
                            style={{ background: '#f8fafc', border: 'none', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                          ><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(itemKey)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Subtotal:</span>
              <span style={{ color: 'var(--accent-primary)' }}>৳{getCartTotal()}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleViewCart} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                View Cart
              </button>
              <button onClick={handleCheckout} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SideCart;
