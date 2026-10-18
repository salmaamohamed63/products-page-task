export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const API_URL = "https://dummyjson.com/products";

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  return response.json() as Promise<T>;
}

export function getProducts({ limit, skip, search, category }: { limit: number; skip: number; search: string; category: string }) {
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  const endpoint = search.trim()
    ? `${API_URL}/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}`
    : `${API_URL}?${params.toString()}`;
  return request<ProductResponse>(endpoint);
}

export function getProduct(id: string) {
  return request<Product>(`${API_URL}/${encodeURIComponent(id)}`);
}