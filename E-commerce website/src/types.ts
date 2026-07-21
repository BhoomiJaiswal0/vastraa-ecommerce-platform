export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "Clothing" | "Electronics" | "Home & Living" | "Accessories";
  description: string;
  details: string[];
  image: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviews: number;
  stock: number;
  badge?: "New" | "Sale" | "Bestseller";
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  date: string;
  address: ShippingAddress;
  paymentLast4: string;
}

export type Page =
  | "shop"
  | "product"
  | "wishlist"
  | "checkout"
  | "order-success"
  | "account"
  | "orders";