import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useCartStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode });
    navigate('/placeorder');
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Shipping Details</h1>
          <p className="text-muted">Where should we deliver your order?</p>
        </div>

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Address</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>City</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Postal Code</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
