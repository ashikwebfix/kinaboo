import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { MapPin, User, ChevronLeft, Truck } from 'lucide-react';
import { trackBeginCheckout, trackPurchase } from '../utils/tracking';

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [name, setName] = useState(userInfo?.name || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [address, setAddress] = useState(userInfo?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }

    const fetchMethods = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/delivery_methods');
        const data = await res.json();
        setDeliveryMethods(data);
      } catch (error) {
        console.error("Error fetching delivery methods", error);
      }
    };
    fetchMethods();
    
    if (cartItems.length > 0) {
      const itemsPrice = cartItems.reduce((acc, item) => acc + (item.sellPrice || item.price) * item.qty, 0);
      trackBeginCheckout(cartItems, itemsPrice);
    }
  }, [navigate, cartItems]);

  useEffect(() => {
    // Abandoned Cart Tracking
    if (cartItems.length > 0 && phone && bdPhoneRegex.test(phone)) {
      const timer = setTimeout(async () => {
        try {
          await fetch(import.meta.env.VITE_API_URL + '/api/abandoned-carts/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone,
              name,
              cartData: cartItems,
              totalValue: cartItems.reduce((acc, item) => acc + (item.sellPrice || item.price) * item.qty, 0)
            })
          });
        } catch (err) {
          // Silent failure
        }
      }, 2000); // Debounce for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [phone, name, cartItems]);

  const selectedMethod = deliveryMethods.find(m => m.id === selectedMethodId);
  const shippingCost = selectedMethod ? Number(selectedMethod.charge) : 0;
  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.sellPrice || item.price) * item.qty, 0);
  const totalBundleDiscount = cartItems.reduce((acc, item) => acc + (item.bundleDiscount || 0) * item.qty, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    discountAmount = appliedDiscount.type === 'fixed'
      ? appliedDiscount.value
      : ((itemsPrice - totalBundleDiscount) * (appliedDiscount.value / 100)); // Apply coupon on discounted total
  }
  const totalDiscount = totalBundleDiscount + discountAmount;
  const totalPrice = itemsPrice - totalDiscount + shippingCost;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: couponCode.toUpperCase(),
          cartTotal: itemsPrice,
          items: cartItems,
          userEmail: userInfo?.email || ''
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setAppliedDiscount({
          type: data.discountType,
          value: data.discountValue
        });
        setAppliedCoupon(data.code);
        setCouponSuccess(`Coupon applied: ${data.discountType === 'fixed' ? data.discountValue + ' BDT' : data.discountValue + '%'} OFF`);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setAppliedDiscount(null);
        setAppliedCoupon('');
      }
    } catch (error) {
      setCouponError('Error applying coupon');
      setAppliedDiscount(null);
      setAppliedCoupon('');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedMethodId) {
      alert('অনুগ্রহ করে ডেলিভারির মাধ্যম নির্বাচন করুন। (Please select a delivery method)');
      return;
    }

    if (!bdPhoneRegex.test(phone)) {
      toast.error('Please enter a valid Bangladeshi phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        name,
        phone,
        shippingAddress: address,
        city: selectedMethod ? selectedMethod.name : 'Standard Delivery',
        postalCode: 'N/A',
        totalPrice,
        paymentMethod: 'Cash on Delivery',
        shippingCost,
        discount: totalDiscount,
        couponCode: appliedCoupon || null,
        orderItems: cartItems.map(item => ({
          productId: item.id,
          qty: item.qty,
          price: item.sellPrice || item.price,
          selectedVariations: item.selectedVariations
        }))
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
        trackPurchase(responseData, cartItems);
        clearCart();
        // Redirect to the Thank You Invoice page
        navigate(`/thank-you/${responseData.id}`);
      } else {
        alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।');
      }
    } catch (error) {
      console.error(error);
      alert('অর্ডার প্লেস করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row', width: '100vw', margin: 0, padding: 0 }}>
      
      {/* Left Column (Main Form) */}
      <div style={{ flex: '1 1 55%', padding: '4rem 5%', display: 'flex', justifyContent: 'flex-end', background: '#ffffff' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <img src="/logo.svg" alt="Kinaboo" style={{ height: '48px' }} />
          </div>
          
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Contact Section */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: '#1f2937' }}>যোগাযোগের তথ্য</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <input required className="input-field" placeholder="সম্পূর্ণ নাম" value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.875rem' }} />
                <input 
                  required 
                  className="input-field" 
                  placeholder="ফোন নাম্বার" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  onBlur={() => {
                    if (phone && /^(?:\+88|88)?01[3-9]\d{8}$/.test(phone)) {
                      fetch(import.meta.env.VITE_API_URL + '/api/abandoned-carts/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          phone,
                          name,
                          cartData: cartItems,
                          totalValue: cartItems.reduce((acc, item) => acc + (item.sellPrice || item.price) * item.qty, 0)
                        })
                      }).catch(() => {});
                    }
                  }}
                  style={{ padding: '0.875rem' }} 
                />
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: '#1f2937' }}>ডেলিভারির ঠিকানা</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  {deliveryMethods.map(m => (
                    <label 
                      key={m.id} 
                      style={{ 
                        border: selectedMethodId === m.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)', 
                        borderRadius: '12px', 
                        padding: '1rem', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        flexDirection: 'column',
                        backgroundColor: selectedMethodId === m.id ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedMethodId === m.id ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value={m.id} 
                        checked={selectedMethodId === m.id} 
                        onChange={e => setSelectedMethodId(e.target.value)} 
                        style={{ display: 'none' }} 
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</span>
                        <div style={{ 
                          width: '18px', height: '18px', borderRadius: '50%', 
                          border: selectedMethodId === m.id ? '5px solid var(--accent-primary)' : '2px solid var(--border-color)',
                          backgroundColor: '#fff',
                          transition: 'all 0.2s ease'
                        }}></div>
                      </div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>৳ {m.charge}</span>
                    </label>
                  ))}
                </div>
                <textarea required className="input-field" rows="3" placeholder="সম্পূর্ণ ঠিকানা (বাড়ি, রাস্তা, এলাকা, শহর)" value={address} onChange={e => setAddress(e.target.value)} style={{ padding: '0.875rem', resize: 'none' }} />
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: '#1f2937' }}>পেমেন্ট মাধ্যম</h2>
              <div style={{ border: '1px solid var(--accent-primary)', background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
                </div>
                <span style={{ fontWeight: 500, color: '#0f172a' }}>ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে পেমেন্ট করুন)</span>
              </div>
            </section>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>
                <ChevronLeft size={18} /> কার্টে ফিরে যান
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting || cartItems.some(i => i.stock <= 0 && !i.allowSellWithoutStock)}
                style={{ padding: '1.25rem 2rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '8px', background: 'var(--accent-primary)' }}
              >
                {isSubmitting ? 'প্রসেসিং...' : (cartItems.some(i => i.stock <= 0 && !i.allowSellWithoutStock) ? 'কার্টে স্টক বিহীন পণ্য আছে' : 'অর্ডার কনফার্ম করুন')}
              </button>
            </div>

          </form>

          <div style={{ marginTop: '3rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', color: '#9ca3af', fontSize: '0.85rem' }}>
            All rights reserved kinaboo.com
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar Summary) */}
      <div style={{ flex: '1 1 45%', padding: '4rem 5%', background: '#f9fafb', borderLeft: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ maxWidth: '450px', width: '100%', position: 'sticky', top: '4rem', height: 'fit-content' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.cartId || item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden', background: '#fff' }}>
                    <img src={item.image || 'https://placehold.co/400x400?text=No+Image'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'rgba(113,113,122,0.9)', color: '#fff', fontSize: '0.75rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 500 }}>
                    {item.qty}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#374151', fontSize: '0.95rem' }}>{item.name}</div>
                  {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>
                      {Object.values(item.selectedVariations).join(' / ')}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 500, color: '#374151', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span>{Number((item.sellPrice || item.price) * item.qty).toFixed(2)} BDT</span>
                  {item.originalPrice && item.originalPrice > (item.sellPrice || item.price) && (
                    <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.8rem' }}>
                      {Number(item.originalPrice * item.qty).toFixed(2)} BDT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

            {/* Promo Code Section */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  className="input-field" 
                  placeholder="ডিসকাউন্ট কোড" 
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value)} 
                  style={{ background: '#fff', flex: 1, padding: '0.75rem' }} 
                  disabled={appliedDiscount !== null}
                />
                <button 
                  type="submit" 
                  className="btn btn-secondary" 
                  style={{ background: appliedDiscount !== null ? '#e5e7eb' : '#fff' }}
                  disabled={appliedDiscount !== null || !couponCode}
                >
                  প্রয়োগ করুন
                </button>
              </form>
              {couponError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{couponError}</p>}
              {couponSuccess && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.5rem' }}>{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>সাবটোটাল</span>
                <span>{itemsPrice.toLocaleString()} BDT</span>
              </div>
              {totalBundleDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>বান্ডেল ডিসকাউন্ট</span>
                  <span>-{totalBundleDiscount.toLocaleString()} BDT</span>
                </div>
              )}
              {appliedDiscount !== null && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                  <span>ডিসকাউন্ট ({appliedCoupon})</span>
                  <span>-{discountAmount.toLocaleString()} BDT</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>ডেলিভারি চার্জ</span>
                <span>{shippingCost > 0 ? `${shippingCost.toLocaleString()} BDT` : 'ফ্রি'}</span>
              </div>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 500, color: '#1f2937' }}>সর্বমোট</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>
                <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280', marginRight: '0.5rem' }}>BDT</span>
                {totalPrice.toLocaleString()} BDT
              </span>
            </div>

        </div>
      </div>

    </div>
  );
};

export default Checkout;
