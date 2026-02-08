import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Camiseta Básica White', 
    price: 25, 
    category: 'Camisetas', 
    availableSizes: ['S', 'M', 'L', 'XL'], 
    availableColors: ['Blanco', 'Negro'], 
    inStock: true, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    isNew: true,
    priceModifiers: {
      size: { 'XL': 5 },
      color: { 'Negro': 2 }
    },
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1693242804347-38b4382b3c4d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 2,
    name: 'Pantalón Chino Beige',
    price: 55,
    category: 'Pantalones',
    availableSizes: ['M', 'L', 'XL'],
    availableColors: ['Beige'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    discount: 20,
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 3,
    name: 'Camiseta Oversize Black',
    price: 30,
    category: 'Camisetas',
    availableSizes: ['S', 'XL'],
    availableColors: ['Negro'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 4,
    name: 'Gorra Minimal',
    price: 20,
    category: 'Accesorios',
    availableSizes: [],
    availableColors: ['Negro', 'Beige', 'Blanco'],
    inStock: false,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    isNew: true,
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575428652377-a2697242636b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 5,
    name: 'Jeans Slim Fit',
    price: 60,
    category: 'Pantalones',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Negro', 'Blanco'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 6,
    name: 'Calcetines Pack',
    price: 15,
    category: 'Accesorios',
    availableSizes: ['M', 'L'],
    availableColors: ['Blanco', 'Beige'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 7,
    name: 'Chaqueta Denim',
    price: 85,
    category: 'Chaquetas',
    availableSizes: ['S', 'M', 'L'],
    availableColors: ['Azul'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1614699745279-2c61bd9d46b5?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    ]
  },
  {
    id: 8,
    name: 'Mochila Urbana',
    price: 45,
    category: 'Accesorios',
    availableSizes: [],
    availableColors: ['Negro', 'Gris'],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    priceModifiers: {},
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ]
  }
];