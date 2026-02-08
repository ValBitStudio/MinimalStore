import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '../types';

export interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addItem: (product: Product, size?: string | null) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isOpen: false,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (product, size = null) => {
        const { cart } = get();
        const colorSuffix = product.color ? `-${product.color}` : '';
        const cartItemId = size ? `${product.id}-${size}${colorSuffix}` : `${product.id}${colorSuffix}`;
        const existingItem = cart.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            ...product,
            quantity: 1,
            size,
            cartItemId,
            color: product.color || null
          };
          set({ cart: [...cart, newItem] });
        }
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          cart: state.cart.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'ecommerce-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const selectTotalItems = (state: CartState) => 
  state.cart.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: CartState) => 
  state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectCartOpen = (state: CartState) => state.isOpen;