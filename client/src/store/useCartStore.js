import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return { items: newItems };
          }
          
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      
      removeCoupon: () => set({ coupon: null }),

      // Selectors/Computed values exposed as functions in Zustand
      getItemCount: () => {
        return get().items.reduce((total, item) => total + (item?.quantity || item?.qty || 1), 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          if (!item) return total;
          const price = item.product?.discountPrice || item.product?.price || item.price || 0;
          const qty = item.quantity || item.qty || 1;
          return total + (price * qty);
        }, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon) return 0;
        
        if (coupon.discountType === 'percentage') {
          const val = (subtotal * coupon.discountValue) / 100;
          return coupon.maxDiscount ? Math.min(val, coupon.maxDiscount) : val;
        }
        return coupon.discountValue;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal() - get().getDiscount();
        if (subtotal === 0) return 0;
        // Load freeShippingAbove & shippingCharge from localStorage pre-seeded settings or use fallback
        const savedSettings = localStorage.getItem('settings-storage');
        let freeShippingAbove = 999;
        let shippingCharge = 50;
        if (savedSettings) {
          try {
            const { state } = JSON.parse(savedSettings);
            if (state && state.freeShippingAbove) freeShippingAbove = Number(state.freeShippingAbove);
            if (state && state.shippingCharge) shippingCharge = Number(state.shippingCharge);
          } catch(e) {}
        }
        return subtotal >= freeShippingAbove ? 0 : shippingCharge;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return subtotal - discount + shipping;
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
