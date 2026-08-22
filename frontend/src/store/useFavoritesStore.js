import { create } from 'zustand';
import { trackAddToWishlist } from '../utils/tracking';

const useFavoritesStore = create((set, get) => ({
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  
  toggleFavorite: (product) => {
    const currentFavorites = get().favorites;
    const isFavorite = currentFavorites.find((p) => p.id === product.id || p._id === product.id);
    
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = currentFavorites.filter((p) => p.id !== product.id && p._id !== product.id);
    } else {
      updatedFavorites = [...currentFavorites, product];
      try {
        trackAddToWishlist(product);
      } catch (err) {
        console.error('Failed to track wishlist:', err);
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    set({ favorites: updatedFavorites });
  },
  
  isFavorite: (productId) => {
    return get().favorites.some((p) => p.id === productId || p._id === productId);
  }
}));

export default useFavoritesStore;
