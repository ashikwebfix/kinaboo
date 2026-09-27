import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight, ArrowLeft, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  const rawSubtotal = cartItems.reduce((acc, item) => acc + (Number(item.sellPrice || item.price) * (item.qty || 1)), 0);
  const totalBundleDiscount = cartItems.reduce((acc, item) => acc + ((item.bundleDiscount || 0) * (item.qty || 1)), 0);
  const finalTotal = Math.max(0, rawSubtotal - totalBundleDiscount);

  return (
    <div className="cart-page-wrapper animate-fade-in">
      {/* Header */}
      <div className="cart-page-header">
        <div className="cart-header-title-wrap">
          <h1 className="cart-page-title">শপিং কার্ট</h1>
          {totalItemsCount > 0 && (
            <span className="cart-items-count-badge">
              {totalItemsCount} টি পণ্য কার্টে আছে
            </span>
          )}
        </div>
        
        <Link to="/shop" className="cart-continue-link">
          <ArrowLeft size={16} />
          <span>আরও পণ্য দেখুন</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-card">
          <div className="cart-empty-icon-wrap">
            <ShoppingBag size={44} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            আপনার কার্টটি বর্তমানে খালি
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', fontSize: '0.95rem' }}>
            আপনার পছন্দের চমৎকার সব গ্যাজেট ও ফ্যাশন পণ্য খুঁজে পেতে আমাদের শপে ঘুরে আসুন।
          </p>
          <Link 
            to="/shop" 
            className="btn btn-primary" 
            style={{ borderRadius: '12px', padding: '0.85rem 2.25rem', fontSize: '1rem', fontWeight: 600 }}
          >
            শপিং শুরু করুন
          </Link>
        </div>
      ) : (
        <div className="cart-page-layout">
          {/* Left Column: Cart Items */}
          <div className="cart-items-container">
            {/* Desktop Table Header */}
            <div className="cart-table-header">
              <span>পণ্য</span>
              <span>মূল্য</span>
              <span style={{ textAlign: 'center' }}>পরিমাণ</span>
              <span>মোট</span>
              <span></span>
            </div>

            {/* Cart Item Cards */}
            {cartItems.map((item) => {
              const itemKey = item.cartId || item.id || item._id;
              const unitPrice = Number(item.sellPrice || item.price || 0);
              const discount = item.bundleDiscount || 0;
              const finalUnitPrice = Math.max(0, unitPrice - discount);
              const itemTotal = finalUnitPrice * (item.qty || 1);
              const image = item.image || (item.images && item.images[0]) || 'https://placehold.co/200x200?text=Product';

              return (
                <div key={itemKey} className="cart-item-row">
                  {/* Product Details */}
                  <div className="cart-item-product-col">
                    <div className="cart-item-img-thumb">
                      <img 
                        src={image} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/200x200?text=Product';
                        }}
                      />
                    </div>
                    
                    <div className="cart-item-meta">
                      <Link to={`/product/${item.slug || item.id}`} className="cart-item-title-link">
                        {item.name}
                      </Link>
                      
                      {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                        <div className="cart-item-var-pills">
                          {Object.entries(item.selectedVariations).map(([k, v]) => (
                            <span key={k} className="cart-item-var-pill">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stock warning */}
                      {item.stock <= 0 && !item.allowSellWithoutStock && (
                        <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                          ⚠️ আউট অব স্টক
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="cart-item-unit-price">
                    ৳{finalUnitPrice.toLocaleString()}
                    {discount > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ৳{unitPrice.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="sidecart-qty-stepper">
                      <button 
                        type="button"
                        onClick={() => updateCartQuantity(itemKey, Math.max(1, (item.qty || 1) - 1))}
                        className="sidecart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="sidecart-qty-val">{item.qty || 1}</span>
                      <button 
                        type="button"
                        onClick={() => updateCartQuantity(itemKey, Math.min(10, (item.qty || 1) + 1))}
                        className="sidecart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="cart-item-total-price">
                    ৳{itemTotal.toLocaleString()}
                  </div>

                  {/* Delete Action */}
                  <div>
                    <button 
                      type="button"
                      onClick={() => removeFromCart(itemKey)} 
                      className="sidecart-remove-btn"
                      title="কার্ট থেকে মুছুন"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-box">
            <h2 className="cart-summary-title">অর্ডার সামারি</h2>

            <div className="cart-summary-row">
              <span>সাবটোটাল ({totalItemsCount} টি পণ্য)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>৳{rawSubtotal.toLocaleString()}</span>
            </div>

            {totalBundleDiscount > 0 && (
              <div className="cart-summary-row discount">
                <span>বান্ডেল ও অফার ছাড়</span>
                <span>-৳{totalBundleDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="cart-summary-row">
              <span>ডেলিভারি চার্জ</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>চেকআউটে যুক্ত হবে</span>
            </div>

            <div className="cart-summary-divider"></div>

            <div className="cart-summary-total-row">
              <span className="cart-summary-total-label">সর্বমোট</span>
              <span className="cart-summary-total-val">৳{finalTotal.toLocaleString()}</span>
            </div>

            <button 
              className="cart-checkout-cta-btn" 
              onClick={checkoutHandler}
              disabled={cartItems.some(i => i.stock <= 0 && !i.allowSellWithoutStock)}
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <ArrowRight size={18} />
            </button>

            {/* Trust and Safety Badges */}
            <div className="cart-guarantee-box">
              <div className="cart-guarantee-item">
                <ShieldCheck size={16} color="#10b981" />
                <span>১০০% নিরাপদ ও এনক্রিপ্টেড পেমেন্ট</span>
              </div>
              <div className="cart-guarantee-item">
                <Truck size={16} color="var(--accent-primary)" />
                <span>দ্রুততম ক্যাশ অন ডেলিভারি সুবিধা</span>
              </div>
              <div className="cart-guarantee-item">
                <RotateCcw size={16} color="#3b82f6" />
                <span>সহজ রিটার্ন ও এক্সচেঞ্জ পলিসি</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
