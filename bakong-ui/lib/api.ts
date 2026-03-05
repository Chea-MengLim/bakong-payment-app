import { ApiResponse, Product, SellerRegistrationRequest, SellerRegistrationResponse, ProductRequest, Seller, CheckBakongAccountResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: ApiResponse<Product[]> = await response.json();
    return data.payload || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(productId: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data: ApiResponse<Product> = await response.json();
    return data.payload;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getProductsBySeller(sellerId: number): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/seller/${sellerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: ApiResponse<Product[]> = await response.json();
    return data.payload || [];
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    throw error;
  }
}

/** Check if a Bakong account exists. responseCode 0 = exists, 1 = not found. */
export async function checkBakongAccount(accountId: string): Promise<CheckBakongAccountResponse> {
  const response = await fetch(`${API_BASE_URL}/khqr/check-bakong-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accountId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || `Failed to check Bakong account: ${response.statusText}`);
  }

  return response.json();
}

export async function registerSeller(request: SellerRegistrationRequest): Promise<SellerRegistrationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sellers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || errorData?.message || `Failed to register seller: ${response.statusText}`);
    }

    const data: ApiResponse<SellerRegistrationResponse> = await response.json();
    return data.payload;
  } catch (error) {
    console.error('Error registering seller:', error);
    throw error;
  }
}

export async function createProduct(sellerId: number, request: ProductRequest): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/seller/${sellerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to create product: ${response.statusText}`);
    }

    const data: ApiResponse<Product> = await response.json();
    return data.payload;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function getAllSellers(): Promise<Seller[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sellers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sellers: ${response.statusText}`);
    }

    const data: ApiResponse<Seller[]> = await response.json();
    return data.payload || [];
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
}
