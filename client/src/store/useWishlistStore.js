import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const id = product._id || product.id;
          if (state.items.find((p) => (p._id || p.id) === id)) {
            return state;
          }
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => (p._id || p.id) !== productId)
        }));
      },

      toggleItem: (product) => {
        set((state) => {
          const id = product._id || product.id;
          const exists = state.items.find((p) => (p._id || p.id) === id);
          if (exists) {
            return { items: state.items.filter((p) => (p._id || p.id) !== id) };
          }
          return { items: [...state.items, product] };
        });
      },

      // Alias so both ProductCard and ProductDetail can use the same name
      toggleWishlist: (product) => {
        set((state) => {
          const id = product._id || product.id;
          const exists = state.items.find((p) => (p._id || p.id) === id);
          if (exists) {
            return { items: state.items.filter((p) => (p._id || p.id) !== id) };
          }
          return { items: [...state.items, product] };
        });
      },

      isInWishlist: (productId) => {
        return !!get().items.find((p) => (p._id || p.id) === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
