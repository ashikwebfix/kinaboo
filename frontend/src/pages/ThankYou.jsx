import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Printer, MapPin, Phone, Mail } from 'lucide-react';

const ThankYou = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading invoice...</div>;
  }

  if (!order) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 className="heading-lg">Order Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We couldn't find the details for this order.</p>
        <Link to="/" className="btn btn-primary">Go to Homepage</Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <>
      <Helmet>
        <title>Order Successful - Invoice #{order.id} | Kinaboo</title>
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-container, #invoice-container * {
              visibility: visible;
            }
            #invoice-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
            }
            .no-print {
              display: none !important;
            }
            .page-wrapper {
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}</style>
      </Helmet>
      
      <div className="container" style={{ padding: '3rem 0', maxWidth: '900px' }}>
        
        {/* Success Header (Hidden in print) */}
        <div className="no-print" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CheckCircle size={64} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
          <h1 className="heading-lg" style={{ marginBottom: '0.5rem' }}>Thank You For Your Order!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Your order has been placed successfully. We will process it shortly.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Printer size={18} /> Print Invoice
            </button>
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="invoice-container" style={{ background: '#fff', borderRadius: '12px', padding: '3rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div>
              <img src="/logo.svg" alt="Kinaboo" style={{ height: '40px', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>INVOICE</h2>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                <strong>Order ID:</strong> #{order.id}<br/>
                <strong>Date:</strong> {orderDate}<br/>
                <strong>Status:</strong> {order.status === 'pending' ? 'Pending' : order.status}
              </div>
            </div>
            <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Kinaboo.com</h3>
              <p style={{ margin: '0.25rem 0' }}><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> House 12, Road 5, Dhanmondi, Dhaka</p>
              <p style={{ margin: '0.25rem 0' }}><Phone size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> +880 1712 345 678</p>
              <p style={{ margin: '0.25rem 0' }}><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> support@kinaboo.com</p>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Bill To / Ship To:</h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{order.name}</strong><br/>
              Phone: {order.phone}<br/>
              Address: {order.shippingAddress}<br/>
              {order.deliveryMethod && <span>Delivery Method: {order.deliveryMethod}<br/></span>}
              Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Item Description</th>
                  <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems && order.orderItems.map((item, idx) => {
                  const variations = typeof item.selectedVariations === 'string' ? JSON.parse(item.selectedVariations) : item.selectedVariations;
                  const itemPrice = Number(item.price) - Number(item.bundleDiscount || 0);
                  const itemTotal = itemPrice * item.qty;
                  
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.product?.name || 'Product'}</strong>
                        {variations && Object.keys(variations).length > 0 && (
                          <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            {Object.entries(variations).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </div>
                        )}
                        {Number(item.bundleDiscount) > 0 && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                            Bundle Discount applied
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.qty}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>৳ {itemPrice.toFixed(2)}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-primary)', fontWeight: '500' }}>৳ {itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>৳ {(Number(order.totalPrice) + Number(order.discount) - Number(order.shippingCost)).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                <span>Shipping:</span>
                <span>৳ {Number(order.shippingCost).toFixed(2)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                  <span>Discount:</span>
                  <span>- ৳ {Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              {Number(order.couponCode) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                  <span>Coupon ({order.couponCode}):</span>
                  <span>Applied</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '2px solid var(--border-color)', marginTop: '0.5rem', fontWeight: '700', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                <span>Total:</span>
                <span>৳ {Number(order.totalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <p>Thank you for shopping with Kinaboo!</p>
            <p>If you have any questions about this invoice, please contact our support team.</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default ThankYou;
