/**
 * Utility functions for triggering Google Tag Manager and Facebook Pixel events.
 * Now includes full Server-Side CAPI tracking support with deduplication.
 */

const generateEventId = () => {
  return 'evt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

const getCookie = (name) => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return undefined;
};

const sendCAPI = async (eventName, eventData, eventId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    await fetch(`${apiUrl}/api/analytics/capi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventName,
        eventData,
        eventId,
        eventSourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
      })
    });
  } catch (error) {
    console.error('CAPI fetch error:', error);
  }
};

// Helper to push to dataLayer (GTM)
export const pushToDataLayer = (data) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Helper to push to fbq (Facebook Pixel) with deduplication eventID
export const pushToFbq = (event, eventName, data, eventId) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const options = eventId ? { eventID: eventId } : undefined;
    window.fbq(event, eventName, data || {}, options);
  }
};

export const trackPageView = (url) => {
  const eventId = generateEventId();
  const data = { page_path: url };
  pushToDataLayer({ event: 'page_view', ...data, event_id: eventId });
  pushToFbq('track', 'PageView', data, eventId);
  sendCAPI('PageView', data, eventId);
};

export const trackViewContent = (product) => {
  if (!product) return;
  const price = product.sellPrice || product.price || 0;
  const productId = product.id || product._id;
  const eventId = generateEventId();
  
  // GTM
  pushToDataLayer({
    event: 'view_item',
    event_id: eventId,
    ecommerce: {
      items: [{
        item_name: product.name,
        item_id: productId,
        price: price,
        item_category: product.categoryId || '',
      }]
    }
  });

  const fbData = {
    content_name: product.name,
    content_ids: [productId],
    content_type: 'product',
    value: price,
    currency: 'BDT'
  };

  // FB Web + CAPI
  pushToFbq('track', 'ViewContent', fbData, eventId);
  sendCAPI('ViewContent', fbData, eventId);
};

export const trackAddToCart = (product, qty = 1) => {
  if (!product) return;
  const price = product.sellPrice || product.price || 0;
  const productId = product.id || product._id;
  const eventId = generateEventId();

  // GTM
  pushToDataLayer({
    event: 'add_to_cart',
    event_id: eventId,
    ecommerce: {
      items: [{
        item_name: product.name,
        item_id: productId,
        price: price,
        quantity: qty
      }]
    }
  });

  const fbData = {
    content_name: product.name,
    content_ids: [productId],
    content_type: 'product',
    value: price * qty,
    currency: 'BDT'
  };

  // FB Web + CAPI
  pushToFbq('track', 'AddToCart', fbData, eventId);
  sendCAPI('AddToCart', fbData, eventId);
};

export const trackAddToWishlist = (product) => {
  if (!product) return;
  const price = product.sellPrice || product.price || 0;
  const productId = product.id || product._id;
  const eventId = generateEventId();

  // GTM
  pushToDataLayer({
    event: 'add_to_wishlist',
    event_id: eventId,
    ecommerce: {
      items: [{
        item_name: product.name,
        item_id: productId,
        price: price
      }]
    }
  });

  const fbData = {
    content_name: product.name,
    content_ids: [productId],
    content_type: 'product',
    value: price,
    currency: 'BDT'
  };

  // FB Web + CAPI
  pushToFbq('track', 'AddToWishlist', fbData, eventId);
  sendCAPI('AddToWishlist', fbData, eventId);
};

export const trackBeginCheckout = (cartItems, totalPrice) => {
  if (!cartItems || cartItems.length === 0) return;
  const eventId = generateEventId();

  // GTM
  pushToDataLayer({
    event: 'begin_checkout',
    event_id: eventId,
    ecommerce: {
      value: totalPrice,
      currency: 'BDT',
      items: cartItems.map(item => ({
        item_name: item.name,
        item_id: item.productId || item.id,
        price: item.price,
        quantity: item.qty
      }))
    }
  });

  const fbData = {
    content_ids: cartItems.map(item => item.productId || item.id),
    content_type: 'product',
    value: totalPrice,
    currency: 'BDT',
    num_items: cartItems.length
  };

  // FB Web + CAPI
  pushToFbq('track', 'InitiateCheckout', fbData, eventId);
  sendCAPI('InitiateCheckout', fbData, eventId);
};

export const trackSearch = (query) => {
  if (!query) return;
  const eventId = generateEventId();

  // GTM
  pushToDataLayer({
    event: 'search',
    event_id: eventId,
    search_term: query
  });

  const fbData = {
    search_string: query
  };

  // FB Web + CAPI
  pushToFbq('track', 'Search', fbData, eventId);
  sendCAPI('Search', fbData, eventId);
};

export const trackPurchase = (order, cartItems) => {
  if (!order) return;
  
  // order.id is unique per purchase, so we can use it as the deduplication eventId!
  const eventId = 'purchase_' + order.id;

  // GTM
  pushToDataLayer({
    event: 'purchase',
    event_id: eventId,
    ecommerce: {
      transaction_id: order.id,
      value: order.totalPrice,
      currency: 'BDT',
      items: cartItems.map(item => ({
        item_name: item.name,
        item_id: item.productId || item.id,
        price: item.price,
        quantity: item.qty
      }))
    }
  });

  const fbData = {
    content_ids: cartItems.map(item => item.productId || item.id),
    content_type: 'product',
    value: order.totalPrice,
    currency: 'BDT'
  };

  // FB Web
  pushToFbq('track', 'Purchase', fbData, eventId);
  
  // Since orderController handles CAPI for Purchase, we don't call sendCAPI here.
};
