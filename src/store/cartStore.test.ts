import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';


const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add an item to the cart', () => {
    const product = { id: 1, name: 'Test Product', price: 100, category: 'Test', image: 'test.jpg' };
    useCartStore.getState().addItem(product);
    
    const { cart } = useCartStore.getState();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe(1);
    expect(cart[0].quantity).toBe(1);
  });

  it('should increment quantity if item already exists', () => {
    const product = { id: 1, name: 'Test Product', price: 100, category: 'Test', image: 'test.jpg' };
    useCartStore.getState().addItem(product);
    useCartStore.getState().addItem(product);
    
    const { cart } = useCartStore.getState();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const product = { id: 1, name: 'Test Product', price: 100, category: 'Test', image: 'test.jpg' };
    useCartStore.getState().addItem(product);
    
    const cartItemId = useCartStore.getState().cart[0].cartItemId;
    useCartStore.getState().removeItem(cartItemId);
    
    const { cart } = useCartStore.getState();
    expect(cart).toHaveLength(0);
  });
});