import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>শপিং কার্ট</h1>

      {cartItems.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>আপনার কার্ট খালি</h2>
          <Link to="/" className="btn btn-primary">শপিং করুন</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {cartItems.map((item) => {
            const itemKey = item.cartId || item.id;
            return (
              <div key={itemKey} className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img src={item.image || 'https://placehold.co/400x400?text=No+Image'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                      <Link to={`/product/${item.slug || item.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }} className="hover-text-accent">
                        {item.name}
                      </Link>
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      {item.selectedVariations && Object.entries(item.selectedVariations).map(([k, v]) => (
                        <span key={k} style={{ marginRight: '1rem', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {(item.sellPrice || item.price)} BDT
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <button onClick={() => updateCartQuantity(itemKey, Math.max(1, item.qty - 1))} className="btn-icon" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateCartQuantity(itemKey, Math.min(10, item.qty + 1))} className="btn-icon" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(itemKey)} className="btn-icon hover-text-danger" style={{ color: '#ef4444' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>অর্ডার সামারি</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            <span>সাবটোটাল ({cartItems.reduce((acc, item) => acc + item.qty, 0)} টি পণ্য)</span>
            <span style={{ fontWeight: '700' }}>
              {cartItems.reduce((acc, item) => acc + (item.sellPrice || item.price) * item.qty, 0).toFixed(2)} BDT
            </span>
          </div>
          
          {cartItems.some(item => item.bundleDiscount) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem', color: '#16a34a' }}>
              <span>বান্ডেল ডিসকাউন্ট</span>
              <span style={{ fontWeight: '700' }}>
                -{cartItems.reduce((acc, item) => acc + (item.bundleDiscount || 0) * item.qty, 0).toFixed(2)} BDT
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '1.25rem', fontWeight: '700' }}>
            <span>সর্বমোট</span>
            <span className="text-gradient">
              {(cartItems.reduce((acc, item) => acc + (item.sellPrice || item.price) * item.qty, 0) - cartItems.reduce((acc, item) => acc + (item.bundleDiscount || 0) * item.qty, 0)).toFixed(2)} BDT
            </span>
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={checkoutHandler} disabled={cartItems.some(i => i.stock <= 0 && !i.allowSellWithoutStock)}>
            চেকআউটে যান
          </button>
        </div>
      </div>
      )}
    </div>
  );
};

export default Cart;
