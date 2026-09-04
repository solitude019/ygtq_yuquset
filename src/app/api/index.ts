const BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Product {
  id: number;
  product_no: string;
  name: string;
  category_id: number | null;
  category_name: string | null;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data.data as T;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

export const apiClient = {
  // Public
  getProducts(categoryId?: number): Promise<Product[]> {
    const query = categoryId ? `?category=${categoryId}` : '';
    return request<Product[]>(`/products${query}`);
  },

  getProduct(id: number): Promise<Product> {
    return request<Product>(`/products/${id}`);
  },

  getCategories(): Promise<Category[]> {
    return request<Category[]>('/categories');
  },

  // Auth
  login(username: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getAdminInfo(token: string): Promise<{ admin: AdminUser }> {
    return request<{ admin: AdminUser }>('/auth/me', {
      headers: authHeaders(token),
    });
  },

  // Products (admin)
  createProduct(token: string, product: Partial<Product>): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(product),
    });
  },

  updateProduct(token: string, id: number, product: Partial<Product>): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(product),
    });
  },

  deleteProduct(token: string, id: number): Promise<void> {
    return request<void>(`/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
  },

  deleteProducts(token: string, ids: number[]): Promise<{ deleted: number }> {
    return request<{ deleted: number }>('/products/batch-delete', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ ids }),
    });
  },

  // Categories (admin)
  createCategory(token: string, data: { name: string; description: string }): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  updateCategory(token: string, id: number, data: { name: string; description: string }): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  deleteCategory(token: string, id: number): Promise<void> {
    return request<void>(`/categories/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
  },
};
