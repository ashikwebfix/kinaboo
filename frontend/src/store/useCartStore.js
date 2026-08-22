import { create } from 'zustand';
import { trackAddToCart } from '../utils/tracking';

// Try to load cart from local storage on initial load
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
};

const loadShippingFromStorage = () => {
  const storedShipping = localStorage.getItem('shippingAddress');
  return storedShipping ? JSON.parse(storedShipping) : {};
};

const useCartStore = create((set, get) => ({
  cartItems: loadCartFromStorage(),
  shippingAddress: loadShippingFromStorage(),
  isCartOpen: false,

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  addToCart: (product, qty = 1) => {
    const { cartItems } = get();
    const itemKey = product.cartId || product.id;
    const existItem = cartItems.find((x) => (x.cartId || x.id) === itemKey);

    let newCartItems;
    if (existItem) {
      newCartItems = cartItems.map((x) => {
        if ((x.cartId || x.id) === itemKey) {
          const newQty = x.qty + qty;
          let newBundleDiscount = 0;
          if (x.volumeBundles && x.volumeBundles.length > 0) {
            const sortedTiers = [...x.volumeBundles].sort((a, b) => b.qty - a.qty);
            const appliedTier = sortedTiers.find(t => newQty >= t.qty);
            if (appliedTier) {
              const basePrice = Number(x.sellPrice || x.price);
              if (appliedTier.discountType === 'percentage') {
                newBundleDiscount = (basePrice * appliedTier.discountValue) / 100;
              } else {
                newBundleDiscount = appliedTier.discountValue / appliedTier.qty;
              }
            }
          }
          const isFrequentlyBoughtTogether = String(x.cartId).includes('_bundle_');
          const finalBundleDiscount = isFrequentlyBoughtTogether ? x.bundleDiscount : newBundleDiscount;
          
          return { ...x, qty: newQty, price: product.price, sellPrice: product.sellPrice, bundleDiscount: finalBundleDiscount };
        }
        return x;
      });
    } else {
      newCartItems = [...cartItems, { ...product, qty }];
    }

    set({ cartItems: newCartItems });
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    
    try {
      trackAddToCart(product, qty);
    } catch (err) {
      console.error('Failed to track add to cart', err);
    }
  },

  removeFromCart: (identifier) => {
    const { cartItems } = get();
    // identifier can be either cartId or id
    const newCartItems = cartItems.filter((x) => (x.cartId || x.id) !== identifier);
    set({ cartItems: newCartItems });
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  },

  updateCartQuantity: (identifier, qty) => {
    const { cartItems } = get();
    const newCartItems = cartItems.map((x) => {
      if ((x.cartId || x.id) === identifier) {
        // Recalculate bundle discount if it's a volume bundle product
        let newBundleDiscount = 0;
        if (x.volumeBundles && x.volumeBundles.length > 0) {
          const sortedTiers = [...x.volumeBundles].sort((a, b) => b.qty - a.qty);
          const appliedTier = sortedTiers.find(t => qty >= t.qty);
          if (appliedTier) {
            const basePrice = Number(x.sellPrice || x.price);
            if (appliedTier.discountType === 'percentage') {
              newBundleDiscount = (basePrice * appliedTier.discountValue) / 100;
            } else {
              newBundleDiscount = appliedTier.discountValue / appliedTier.qty;
            }
          }
        }
        
        // If it's a combo bundle (Frequently Bought Together), we don't change its discount
        // We know it's a Volume Bundle if it has volumeBundles array. But wait, what if it was added via frequently bought together?
        // Usually Frequently Bought Together adds a unique cartId suffix `_bundle_`.
        const isFrequentlyBoughtTogether = String(x.cartId).includes('_bundle_');
        const finalBundleDiscount = isFrequentlyBoughtTogether ? x.bundleDiscount : newBundleDiscount;

        return { ...x, qty, bundleDiscount: finalBundleDiscount };
      }
      return x;
    });
    set({ cartItems: newCartItems });
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  },

  saveShippingAddress: (data) => {
    set({ shippingAddress: data });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  },

  clearCart: () => {
    set({ cartItems: [] });
    localStorage.removeItem('cartItems');
  },

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((acc, item) => {
      const price = item.sellPrice || item.price;
      const discount = item.bundleDiscount || 0;
      return acc + (price - discount) * item.qty;
    }, 0).toFixed(2);
  }
}));

export default useCartStore;
