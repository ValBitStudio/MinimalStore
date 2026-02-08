import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  wishlist: Product[];
  isOpen: boolean;
  toggleWishlist: (product: Product) => void;
  toggleWishlistSidebar: () => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      wishlist: [],
      isOpen: false,
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((item) => item.id === product.id);
          if (exists) {
            return {
              wishlist: state.wishlist.filter((item) => item.id !== product.id),
            };
          }
          return { wishlist: [...state.wishlist, product] };
        }),
      toggleWishlistSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'ecommerce-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);