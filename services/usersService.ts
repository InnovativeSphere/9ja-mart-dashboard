// services/usersService.ts
import { request } from "@/lib/api";

export interface MarketplaceUser {
  id: number;
  guid: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  isActive: boolean;
  isDeleted: boolean;
  dateCreated: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  productCount: number;
  orderCount: number;
}

export interface UsersListResponse {
  isSuccessful: boolean;
  message: string;
  data: {
    items: MarketplaceUser[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface UserDetailResponse {
  isSuccessful: boolean;
  message: string;
  data: {
    profile: {
      guid: string;
      fullName: string;
      username: string;
      email: string;
      subscriptionPlan: string;
      subscriptionStatus: string;
      paidEntitlements: string[];
    };
    activity: {
      productCount: number;
      activeProductCount: number;
      orderCount: number;
      productSalesCount: number;
      orderValueTotal: number;
    };
    recentProducts: unknown[];
    recentOrders: unknown[];
  };
}

export async function getUsers(params?: {
  SearchText?: string;
  Tier?: string;
  SubscriptionStatus?: string;
  IsActive?: boolean;
  PageNumber?: number;
  PageSize?: number;
}): Promise<UsersListResponse> {
  const query = new URLSearchParams();
  if (params?.SearchText) query.set("SearchText", params.SearchText);
  if (params?.Tier) query.set("Tier", params.Tier);
  if (params?.SubscriptionStatus) query.set("SubscriptionStatus", params.SubscriptionStatus);
  if (params?.IsActive !== undefined) query.set("IsActive", String(params.IsActive));
  if (params?.PageNumber) query.set("PageNumber", String(params.PageNumber));
  if (params?.PageSize) query.set("PageSize", String(params.PageSize));

  const qs = query.toString();
  try {
    const data = await request<UsersListResponse>(`/AdminMarketplaceUsers${qs ? `?${qs}` : ""}`);
    console.log(`[UsersService] ✅ ${data.data.items.length} users loaded.`);
    return data;
  } catch (error: any) {
    console.error("[UsersService] ❌ Failed to load users:", error.message);
    throw error;
  }
}

export async function getUserDetail(customerGuid: string): Promise<UserDetailResponse> {
  try {
    const data = await request<UserDetailResponse>(`/AdminMarketplaceUsers/${customerGuid}`);
    console.log("[UsersService] ✅ User detail loaded.");
    return data;
  } catch (error: any) {
    console.error("[UsersService] ❌ Failed to load user detail:", error.message);
    throw error;
  }
}