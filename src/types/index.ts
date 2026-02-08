// c:\Users\JRV\Desktop\e-commerce\src\types\index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description?: string;
  discount?: number;
  isNew?: boolean;
  inStock?: boolean;
  availableSizes?: string[];
  availableColors?: string[];
  priceModifiers?: {
    size?: Record<string, number>;
    color?: Record<string, number>;
  };
  rating?: number;
  reviews?: number;

  color?: string | null;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  size: string | null;
  color?: string | null;
}
