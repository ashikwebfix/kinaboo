import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Truck, User, Phone, MapPin, Tag, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackBeginCheckout, trackPurchase } from '../utils/tracking';
import useCartStore from '../store/useCartStore';

const defaultDeliveryOptions = [
  { id: 'inside-dhaka', name: 'ঢাকার ভিতরে', charge: 60 },
  { id: 'outside-dhaka', name: 'ঢাকার বাইরে', charge: 120 }
];

const ExpressCheckoutModal = ({ product, qty = 1, selectedVariations = {}, cartItems: propCartItems, onClose }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const clearCart = useCartStore((state) => state.clearCart);

  // Normalize items
  const isMultiItem = Boolean(propCartItems && propCartItems.length > 0);
  const items = isMultiItem ? propCartItems : (product ? [product] : []);

  const [qbName, setQbName] = useState(userInfo?.name || '');
  const [qbPhone, setQbPhone] = useState(userInfo?.phone || '');
  const [qbAddress, setQbAddress] = useState(userInfo?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethods, setDeliveryMethods] = useState(defaultDeliveryOptions);
  const [selectedMethodId, setSelectedMethodId] = useState('inside-dhaka');
  
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;

  // Calculate Subtotals & Discounts
  let rawSubtotal = 0;
  let totalBundleDiscount = 0;

  if (isMultiItem) {
    items.forEach(item => {
      const itemQty = item.qty || 1;
      const basePrice = Number(item.sellPrice || item.price || 0);
      rawSubtotal += basePrice * itemQty;
      totalBundleDiscount += (item.bundleDiscount || 0) * itemQty;
    });
  } else if (product) {
    const basePrice = Number(product.sellPrice || product.price || 0);
    rawSubtotal = basePrice * qty;
    if (product.volumeBundles && product.volumeBundles.length > 0) {
      const sortedTiers = [...product.volumeBundles].sort((a, b) => b.qty - a.qty);
      const appliedTier = sortedTiers.find(t => qty >= t.qty);
      if (appliedTier) {
        if (appliedTier.discountType === 'percentage') {
          totalBundleDiscount = ((basePrice * appliedTier.discountValue) / 100) * qty;
        } else {
          totalBundleDiscount = (appliedTier.discountValue / appliedTier.qty) * qty;
        }
      }
    }
  }

  const subtotal = Math.max(0, rawSubtotal - totalBundleDiscount);

  let discountDisplay = 0;
  if (appliedCoupon) {
    discountDisplay = appliedCoupon.discountType === 'fixed' 
      ? appliedCoupon.discountValue 
      : (subtotal * (appliedCoupon.discountValue / 100));
  }

  const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId) || deliveryMethods[0];
  const shippingCostDisplay = selectedMethod ? Number(selectedMethod.charge) : 60;
  const finalTotalDisplay = Math.max(0, subtotal - discountDisplay + shippingCostDisplay);

  // Fetch Delivery Methods from API with fallback
  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      try {
        const dmRes = await fetch((import.meta.env.VITE_API_URL || '') + '/api/settings/delivery_methods');
        if (dmRes.ok) {
          const dmData = await dmRes.json();
          if (Array.isArray(dmData) && dmData.length > 0) {
            setDeliveryMethods(dmData);
            setSelectedMethodId(dmData[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching delivery methods:", error);
      }
    };
    fetchDeliveryMethods();
  }, []);

  // Abandoned Cart Tracking
  useEffect(() => {
    if (qbPhone && bdPhoneRegex.test(qbPhone) && items.length > 0) {
      const timer = setTimeout(async () => {
        try {
          const trackingPayload = isMultiItem ? items.map(item => ({
            id: item.id || item.cartId,
            name: item.name,
            qty: item.qty || 1,
            price: item.sellPrice || item.price,
            selectedVariations: item.selectedVariations || {},
            image: item.image || (item.images && item.images[0])
          })) : [{
            id: product.id,
            name: product.name,
            qty,
            price: product.sellPrice || product.price,
            selectedVariations,
            image: product.image || (product.images && product.images[0])
          }];

          await fetch((import.meta.env.VITE_API_URL || '') + '/api/abandoned-carts/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: qbPhone,
              name: qbName,
              cartData: trackingPayload,
              totalValue: subtotal
            })
          });
        } catch (err) {}
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [qbPhone, qbName, items, isMultiItem, product, qty, selectedVariations, subtotal]);

  // Track InitiateCheckout when modal opens
  useEffect(() => {
    if (items.length > 0) {
      const trackingItems = isMultiItem ? items.map(i => ({
        id: i.id || i.cartId,
        name: i.name,
        qty: i.qty || 1,
        price: i.sellPrice || i.price,
        selectedVariations: i.selectedVariations || {}
      })) : [{
        id: product.id,
        name: product.name,
        qty,
        price: product.sellPrice || product.price,
        selectedVariations
      }];
      trackBeginCheckout(trackingItems, subtotal);
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponInput.trim().toUpperCase(),
          cartTotal: subtotal,
          items: items,
          userEmail: userInfo?.email || ''
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'কুপন কোডটি সঠিক নয়');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('কুপন যাচাই করতে সমস্যা হয়েছে');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleQuickBuySubmit = async (e) => {
    e.preventDefault();

    if (!selectedMethodId) {
      alert('অনুগ্রহ করে ডেলিভারির মাধ্যম নির্বাচন করুন।');
      return;
    }

    if (qbAddress.trim().length < 4) {
      alert('অনুগ্রহ করে সম্পূর্ণ ঠিকানা দিন (কমপক্ষে ৪ অক্ষর)।');
      return;
    }

    setIsSubmitting(true);
    try {
      const currentMethod = deliveryMethods.find(m => m.id === selectedMethodId) || deliveryMethods[0];
      const shippingCost = currentMethod ? Number(currentMethod.charge) : 60;
      const discount = discountDisplay;
      const finalTotal = finalTotalDisplay;

      const orderItemsPayload = isMultiItem ? items.map(item => ({
        productId: item.id || item.cartId || item._id,
        qty: item.qty || 1,
        price: Number(item.sellPrice || item.price) - (item.bundleDiscount || 0),
        selectedVariations: item.selectedVariations || {}
      })) : [{
        productId: product.id,
        qty: qty,
        price: (product.sellPrice || product.price) - (totalBundleDiscount / qty),
        selectedVariations
      }];

      const orderData = {
        name: qbName,
        phone: qbPhone,
        shippingAddress: qbAddress,
        city: currentMethod ? currentMethod.name : 'ঢাকার ভিতরে',
        postalCode: 'N/A',
        totalPrice: finalTotal,
        paymentMethod: 'Cash on Delivery',
        shippingCost,
        discount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        orderItems: orderItemsPayload
      };

      const headers = { 'Content-Type': 'application/json' };
      if (userInfo && userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }

      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const responseData = await res.json();
        
        // Track Purchase
        trackPurchase(responseData, isMultiItem ? items : [{
          id: product.id,
          name: product.name,
          qty,
          price: product.sellPrice || product.price,
          selectedVariations
        }]);

        if (isMultiItem && typeof clearCart === 'function') {
          clearCart();
        }

        onClose();
        // Redirect to Thank You invoice page
        navigate(`/thank-you/${responseData.id}`);
      } else {
        alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (error) {
      console.error(error);
      alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  const modalContent = (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        background: 'rgba(15, 23, 42, 0.65)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)', 
        zIndex: 999999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="animate-fade-in" 
        style={{ 
          background: '#ffffff', 
          borderRadius: '20px', 
          padding: '1.75rem 1.85rem', 
          width: '100%', 
          maxWidth: '470px', 
          position: 'relative', 
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          border: '1px solid #f1f5f9'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '1.25rem', 
            right: '1.25rem', 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            cursor: 'pointer', 
            borderRadius: '50%', 
            width: '34px', 
            height: '34px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#64748b', 
            transition: 'all 0.2s ease' 
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'none'; }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
            <Zap size={15} /> দ্রুত অর্ডার করুন
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
            Express Checkout
          </h2>
        </div>
        
        {/* Product Items Summary Card */}
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid #eef2f6', 
          borderRadius: '14px', 
          padding: '0.85rem', 
          marginBottom: '1.25rem', 
          maxHeight: '150px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.65rem' 
        }}>
          {items.map((item, idx) => {
            const itemImage = item.image || (item.images && item.images[0]) || 'https://placehold.co/100x100?text=Product';
            const itemUnitPrice = Number(item.sellPrice || item.price || 0) - (item.bundleDiscount || 0);
            const itemQty = item.qty || qty || 1;

            return (
              <div key={item.id || item.cartId || idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img 
                  src={itemImage} 
                  alt={item.name} 
                  style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', background: '#fff', flexShrink: 0 }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
                    <span>Qty: {itemQty}</span>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <span>• {Object.values(item.selectedVariations).join(', ')}</span>
                    )}
                  </div>
                </div>
                <div style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                  ৳{(itemUnitPrice * itemQty).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleQuickBuySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          
          {/* Name Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
              <User size={14} color="var(--accent-primary)" />
              <span>আপনার নাম (Full Name) <span style={{ color: '#ef4444' }}>*</span></span>
            </label>
            <input 
              required 
              className="input-field" 
              placeholder="আপনার পুরো নাম লিখুন" 
              value={qbName} 
              onChange={e => setQbName(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '10px', fontSize: '0.92rem', background: '#ffffff' }} 
            />
          </div>

          {/* Phone Field */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
              <Phone size={14} color="var(--accent-primary)" />
              <span>মোবাইল নাম্বার (Phone Number) <span style={{ color: '#ef4444' }}>*</span></span>
            </label>
            <input 
              required 
              type="tel" 
              className="input-field" 
              placeholder="017XXXXXXXX" 
              value={qbPhone} 
              onChange={e => setQbPhone(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '10px', fontSize: '0.92rem', background: '#ffffff' }} 
            />
          </div>

          {/* Delivery Method Selector Cards */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
              <Truck size={14} color="var(--accent-primary)" />
              <span>ডেলিভারি লোকেশন (Delivery Location) <span style={{ color: '#ef4444' }}>*</span></span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {deliveryMethods.map(m => {
                const isChecked = (selectedMethodId === m.id) || (deliveryMethods.length === 1);
                return (
                  <label 
                    key={m.id} 
                    style={{ 
                      border: isChecked ? '2px solid var(--accent-primary)' : '1px solid #e2e8f0', 
                      borderRadius: '10px', 
                      padding: '0.75rem 0.85rem', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '0.6rem',
                      backgroundColor: isChecked ? 'rgba(255, 106, 61, 0.05)' : '#ffffff',
                      boxShadow: isChecked ? '0 2px 8px rgba(255, 106, 61, 0.12)' : 'none',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="modalDeliveryMethod" 
                      value={m.id} 
                      checked={isChecked} 
                      onChange={() => setSelectedMethodId(m.id)} 
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} 
                    />
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      border: isChecked ? '5px solid var(--accent-primary)' : '2px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.name}
                      </div>
                      <div style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 800 }}>
                        ৳{m.charge}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Full Delivery Address */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
              <MapPin size={14} color="var(--accent-primary)" />
              <span>সম্পূর্ণ ঠিকানা (Full Delivery Address) <span style={{ color: '#ef4444' }}>*</span></span>
            </label>
            <textarea 
              required 
              minLength={4} 
              className="input-field" 
              rows="2" 
              placeholder="বাসা/ফ্ল্যাট নং, রোড নং, এলাকা ও থানার নাম" 
              value={qbAddress} 
              onChange={e => setQbAddress(e.target.value)} 
              style={{ width: '100%', padding: '0.75rem 0.95rem', borderRadius: '10px', fontSize: '0.92rem', background: '#ffffff', resize: 'none' }} 
            />
          </div>

          {/* Coupon Code Section */}
          <div style={{ background: '#f8fafc', padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #eef2f6' }}>
            {appliedCoupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dcfce7', color: '#166534', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={15} /> {appliedCoupon.code} কুপন সফল (-৳{discountDisplay.toLocaleString()})
                </div>
                <button type="button" onClick={removeCoupon} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input 
                  className="input-field" 
                  placeholder="কুপন কোড দিন..." 
                  value={couponInput} 
                  onChange={e => setCouponInput(e.target.value)} 
                  style={{ padding: '0.55rem 0.75rem', flex: 1, fontSize: '0.85rem', borderRadius: '8px', background: '#fff' }} 
                />
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleApplyCoupon} 
                  disabled={validatingCoupon} 
                  style={{ padding: '0.55rem 0.95rem', fontSize: '0.85rem', borderRadius: '8px', whiteSpace: 'nowrap' }}
                >
                  {validatingCoupon ? 'যাচাই...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>{couponError}</div>}
          </div>

          {/* Pricing Calculation Summary */}
          <div style={{ padding: '0.5rem 0.25rem 0.25rem 0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.88rem', color: '#64748b' }}>
              <span>সাবটোটাল:</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>৳{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem', color: '#64748b' }}>
              <span>ডেলিভারি চার্জ:</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>৳{shippingCostDisplay.toLocaleString()}</span>
            </div>
            {discountDisplay > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem', color: '#16a34a', fontWeight: 600 }}>
                <span>কুপন ছাড়:</span>
                <span>-৳{discountDisplay.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>সর্বমোট (Total):</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>
                ৳{finalTotalDisplay.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Cash on Delivery Badge */}
          <div style={{ 
            background: '#f0fdf4', 
            color: '#166534', 
            padding: '0.65rem 0.85rem', 
            borderRadius: '10px', 
            border: '1px solid #bbf7d0', 
            textAlign: 'center', 
            fontWeight: 600, 
            fontSize: '0.82rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.4rem' 
          }}>
            <ShieldCheck size={16} color="#16a34a" /> 
            <span>ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)</span>
          </div>
          
          {/* Submit CTA */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              padding: '0.95rem 1.25rem', 
              fontSize: '1.05rem', 
              borderRadius: '12px', 
              fontWeight: 700, 
              background: 'var(--accent-gradient)',
              boxShadow: '0 4px 15px rgba(255, 106, 61, 0.35)',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'অর্ডার প্রসেসিং হচ্ছে...' : `অর্ডার কনফার্ম করুন • ৳${finalTotalDisplay.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ExpressCheckoutModal;
