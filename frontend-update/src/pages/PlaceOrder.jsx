import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const PlaceOrder = () => {
  const { cartItems, shippingAddress, getCartTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const placeOrderHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const orderData = {
        orderItems: cartItems.map(item => ({ productId: item.id, qty: item.qty, price: item.price })),
        shippingAddress: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        totalPrice: getCartTotal()
      };

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        const data = await res.json();
        setError(data.message || 'Error placing order');
      }
    } catch (err) {
      setError('Server error, please try again.');
    }
  };

  if (success) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '4rem', borderRadius: '24px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', fontSize: '2rem' }}>✓</div>
          <h1 className="heading-lg" style={{ marginBottom: '1rem' }}>Order Placed!</h1>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>Thank you for your purchase. Your order is being processed.</p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="heading-lg" style={{ marginBottom: '2rem' }}>Order Summary</h1>

      {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Shipping</h2>
            <p className="text-muted">
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}
            </p>
          </div>

          <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Order Items</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: index !== cartItems.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: index !== cartItems.length - 1 ? '1rem' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={item.image || 'https://placehold.co/400x400?text=No+Image'} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.qty} x {item.price} BDT
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {item.originalPrice.toFixed(2)} BDT
                      </span>
                    )}
                    = {(item.qty * item.price).toFixed(2)} BDT
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Total</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
            <span>Final Price</span>
            <span className="text-gradient">{getCartTotal()} BDT</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={placeOrderHandler}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
