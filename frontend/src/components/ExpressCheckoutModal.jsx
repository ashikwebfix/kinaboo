import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackBeginCheckout, trackPurchase } from '../utils/tracking';

const ExpressCheckoutModal = ({ product, qty = 1, selectedVariations = {}, onClose }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [qbName, setQbName] = useState(userInfo?.name || '');
  const [qbPhone, setQbPhone] = useState(userInfo?.phone || '');
  const [qbAddress, setQbAddress] = useState(userInfo?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;

  useEffect(() => {
    if (qbPhone && bdPhoneRegex.test(qbPhone)) {
      const timer = setTimeout(async () => {
        try {
          await fetch(import.meta.env.VITE_API_URL + '/api/abandoned-carts/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: qbPhone,
              name: qbName,
              cartData: [{
                id: product.id,
                name: product.name,
                qty,
                price: product.sellPrice || product.price,
                selectedVariations,
                image: product.image || (product.images && product.images[0])
              }],
              totalValue: (product.sellPrice || product.price) * qty
            })
          });
        } catch (err) {}
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [qbPhone, qbName, product, qty, selectedVariations]);

  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      try {
        const dmRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/delivery_methods');
        if (dmRes.ok) {
          const dmData = await dmRes.json();
          setDeliveryMethods(dmData);
          if (dmData && dmData.length > 0) setSelectedMethodId(dmData[0].id);
        }
      } catch (error) {
        console.error("Error fetching delivery methods:", error);
      }
    };
    fetchDeliveryMethods();
  }, []);

  // Track InitiateCheckout when modal opens
  useEffect(() => {
    const price = product.sellPrice || product.price;
    trackBeginCheckout([{
      id: product.id,
      name: product.name,
      qty,
      price,
      selectedVariations
    }], price * qty);
  }, [product, qty, selectedVariations]);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const subtotal = (product.sellPrice || product.price) * qty;
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponInput.toUpperCase(),
          cartTotal: subtotal,
          items: [product],
          userEmail: userInfo?.email || ''
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
        setCouponInput('');
      } else {
        setCouponError(data.message || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Error validating coupon');
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
    setIsSubmitting(true);
    try {
      const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId);
      let bundleDiscountTotal = 0;
      if (product.volumeBundles && product.volumeBundles.length > 0) {
        const sortedTiers = [...product.volumeBundles].sort((a, b) => b.qty - a.qty);
        const appliedTier = sortedTiers.find(t => qty >= t.qty);
        if (appliedTier) {
          const basePrice = Number(product.sellPrice || product.price);
          if (appliedTier.discountType === 'percentage') {
            bundleDiscountTotal = ((basePrice * appliedTier.discountValue) / 100) * qty;
          } else {
            bundleDiscountTotal = (appliedTier.discountValue / appliedTier.qty) * qty;
          }
        }
      }
      const subtotal = ((product.sellPrice || product.price) * qty) - bundleDiscountTotal;
      let discount = 0;
      if (appliedCoupon) {
        discount = appliedCoupon.discountType === 'fixed' 
          ? appliedCoupon.discountValue 
          : (subtotal * (appliedCoupon.discountValue / 100));
      }
      const shippingCost = selectedMethod ? Number(selectedMethod.charge) : 0;
      const finalTotal = subtotal - discount + shippingCost;

      const orderData = {
        name: qbName,
        phone: qbPhone,
        shippingAddress: qbAddress,
        city: selectedMethod ? selectedMethod.name : 'Standard Delivery',
        postalCode: 'N/A',
        totalPrice: finalTotal,
        paymentMethod: 'Cash on Delivery',
        shippingCost,
        discount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        orderItems: [{
          productId: product.id,
          qty: qty,
          price: (product.sellPrice || product.price) - (bundleDiscountTotal / qty),
          selectedVariations
        }]
      };

      const headers = { 'Content-Type': 'application/json' };
      if (userInfo && userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      }

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const responseData = await res.json();
        // Track Purchase
        trackPurchase(responseData, [{
          id: product.id,
          name: product.name,
          qty,
          price: product.sellPrice || product.price,
          selectedVariations
        }]);

        onClose();
        // Redirect to the Thank You Invoice page
        navigate(`/thank-you/${responseData.id}`);
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error(error);
      alert('Error placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://placehold.co/80x80?text=No+Image');
  let bundleDiscountTotal = 0;
  if (product.volumeBundles && product.volumeBundles.length > 0) {
    const sortedTiers = [...product.volumeBundles].sort((a, b) => b.qty - a.qty);
    const appliedTier = sortedTiers.find(t => qty >= t.qty);
    if (appliedTier) {
      const basePrice = Number(product.sellPrice || product.price);
      if (appliedTier.discountType === 'percentage') {
        bundleDiscountTotal = ((basePrice * appliedTier.discountValue) / 100) * qty;
      } else {
        bundleDiscountTotal = (appliedTier.discountValue / appliedTier.qty) * qty;
      }
    }
  }
  const originalSubtotal = (product.sellPrice || product.price) * qty;
  const subtotal = originalSubtotal - bundleDiscountTotal;
  let discountDisplay = 0;
  if (appliedCoupon) {
    discountDisplay = appliedCoupon.discountType === 'fixed' 
      ? appliedCoupon.discountValue 
      : (subtotal * (appliedCoupon.discountValue / 100));
  }
  const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId);
  const shippingCostDisplay = selectedMethod ? Number(selectedMethod.charge) : 0;
  const finalTotalDisplay = subtotal - discountDisplay + shippingCostDisplay;

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-fade-in" style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '90%', maxWidth: '450px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f3f4f6', border: 'none', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#1f2937'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <X size={20} />
        </button>
        
        <h2 className="heading-md" style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Express Checkout</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img src={mainImage} alt={product.name} style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{product.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Qty: {qty}</div>
            {bundleDiscountTotal > 0 && (
              <div style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Combo Discount Applied: -{bundleDiscountTotal.toFixed(2)} BDT</div>
            )}
            <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
              {subtotal.toFixed(2)} BDT
            </div>
          </div>
        </div>

        <form onSubmit={handleQuickBuySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Full Name</label>
            <input required className="input-field" placeholder="Enter your full name" value={qbName} onChange={e => setQbName(e.target.value)} style={{ padding: '0.875rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Phone Number</label>
            <input 
              required 
              type="tel" 
              className="input-field" 
              placeholder="e.g. 017XXXXXXXX" 
              value={qbPhone} 
              onChange={e => setQbPhone(e.target.value)} 
              onBlur={() => {
                if (qbPhone && /^(?:\+88|88)?01[3-9]\d{8}$/.test(qbPhone)) {
                  fetch(import.meta.env.VITE_API_URL + '/api/abandoned-carts/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      phone: qbPhone,
                      name: qbName,
                      cartData: [{
                        id: product.id,
                        name: product.name,
                        qty,
                        price: product.sellPrice || product.price,
                        selectedVariations,
                        image: product.image || (product.images && product.images[0])
                      }],
                      totalValue: (product.sellPrice || product.price) * qty
                    })
                  }).catch(() => {});
                }
              }}
              style={{ padding: '0.875rem' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Delivery Method</label>
            <select className="input-field" value={selectedMethodId} onChange={e => setSelectedMethodId(e.target.value)} style={{ padding: '0.875rem' }}>
              {deliveryMethods.map(m => (
                <option key={m.id} value={m.id}>{m.name} (+{m.charge} BDT)</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Full Delivery Address</label>
            <textarea required className="input-field" rows="3" placeholder="House/Flat, Road, Area, City" value={qbAddress} onChange={e => setQbAddress(e.target.value)} style={{ padding: '0.875rem', resize: 'none' }} />
          </div>

          <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>Have a Coupon?</label>
            {appliedCoupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 600 }}>{appliedCoupon.code} Applied (-{discountDisplay.toFixed(2)} BDT)</div>
                <button type="button" onClick={removeCoupon} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input-field" placeholder="Enter code" value={couponInput} onChange={e => setCouponInput(e.target.value)} style={{ padding: '0.75rem', flex: 1 }} />
                <button type="button" className="btn btn-secondary" onClick={handleApplyCoupon} disabled={validatingCoupon} style={{ padding: '0.75rem 1rem' }}>
                  {validatingCoupon ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{couponError}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{finalTotalDisplay.toFixed(2)} BDT</span>
          </div>

          <div style={{ background: '#f0fdf4', color: '#166534', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Truck size={18} /> Cash on Delivery Available
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem', borderRadius: '8px', fontWeight: 600, background: 'var(--accent-primary)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : `Confirm Order - ${finalTotalDisplay.toFixed(2)} BDT`}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ExpressCheckoutModal;
