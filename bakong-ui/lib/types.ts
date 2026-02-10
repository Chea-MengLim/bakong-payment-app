export interface StoreInfo {
  id: number;
  bakongAccountId: string;
  acquiringBank: string;
  bankAccountId: string;
  bankAccountName: string;
  mobileNumber: string;
  email: string;
  storeLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  priceAfterDiscount: number;
  imageUrl?: string;
  store: StoreInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: string;
  message: string;
  payload: T;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SellerRegistrationRequest {
  bakongAccountId: string;
  acquiringBank: string;
  bankAccountId: string;
  bankAccountName: string;
  mobileNumber: string;
  email: string;
  storeLabel: string;
}

export interface SellerRegistrationResponse {
  id: number;
  email: string;
  generatedPassword: string;
  storeLabel: string;
  createdAt: string;
}

export interface ProductRequest {
  name: string;
  price: number;
  priceAfterDiscount: number;
  imageUrl?: string;
}

export interface Seller {
  id: number;
  bakongAccountId: string;
  acquiringBank: string;
  bankAccountId: string;
  bankAccountName: string;
  mobileNumber: string;
  email: string;
  storeLabel: string;
  createdAt: string;
  updatedAt: string;
}
