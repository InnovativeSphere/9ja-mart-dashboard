// services/productsService.ts

const PRODUCTS_BASE = "https://intellisales.ng/api";

async function productRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  const res = await fetch(`${PRODUCTS_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    },
  });

  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  if (!res.ok || data.isSuccessful === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data as T;
}

// ---------- Types ----------
export interface ProductItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  isAvailable: boolean;           // 👈 added
  images: string[];               // 👈 changed from single imageUrl
  createdAt?: string;
  updatedAt?: string;
  sku?: string;
}

export interface ProductsListResponse {
  isSuccessful: boolean;
  message: string;
  data: {
    items: ProductItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface ProductDetailResponse {
  isSuccessful: boolean;
  message: string;
  data: ProductItem;
}

// ---------- Service functions ----------

export async function getProducts(params?: {
  PageNumber?: number;
  PageSize?: number;
  IsAvailable?: boolean;
  IsUnavailable?: boolean;
  Category?: string;
}): Promise<ProductsListResponse> {
  const query = new URLSearchParams();
  if (params?.PageNumber) query.set("PageNumber", String(params.PageNumber));
  if (params?.PageSize) query.set("PageSize", String(params.PageSize));
  if (params?.IsAvailable !== undefined) query.set("IsAvailable", String(params.IsAvailable));
  if (params?.IsUnavailable !== undefined) query.set("IsUnavailable", String(params.IsUnavailable));
  if (params?.Category) query.set("Category", params.Category);

  const qs = query.toString();
  try {
    const data = await productRequest<ProductsListResponse>(
      `/Product/GetMarketplaceProducts${qs ? `?${qs}` : ""}`
    );
    console.log(`[ProductsService] ✅ ${data.data?.items?.length || 0} products loaded.`);
    return data;
  } catch (error: any) {
    console.error("[ProductsService] ❌ Failed to load products:", error.message);
    throw error;
  }
}

export async function getProductById(productId: number): Promise<ProductDetailResponse> {
  try {
    const data = await productRequest<ProductDetailResponse>(
      `/Product/GetOneMarketplaceProduct/${productId}`
    );
    console.log("[ProductsService] ✅ Product detail loaded.");
    return data;
  } catch (error: any) {
    console.error("[ProductsService] ❌ Failed to load product detail:", error.message);
    throw error;
  }
}

export async function deleteProduct(productId: number): Promise<any> {
  try {
    const data = await productRequest(`/Product/MarketplaceDeleteCustomerProduct/${productId}`, {  // 👈 fixed endpoint
      method: "DELETE",
    });
    console.log("[ProductsService] ✅ Product deleted.");
    return data;
  } catch (error: any) {
    console.error("[ProductsService] ❌ Failed to delete product:", error.message);
    throw error;
  }
}