// services/dashboardService.ts
import { request } from "@/lib/api";

export interface DashboardOverviewResponse {
  isSuccessful: boolean;
  message: string;
  data: {
    generatedAtUtc?: string;
    fromUtc?: string;
    toUtc?: string;

    marketplaceUsers: {
      total: number;
      active: number;
      inactive: number;
      deleted?: number;
      createdInRange?: number;
      free: number;
      vendor: number;
      business: number;
    };

    products: {
      total: number;
      active: number;
      deleted?: number;
      outOfStock: number;
      flashDeals?: number;
      distressSales?: number;
      createdInRange?: number;
    };

    orders: {
      total: number;
      createdInRange?: number;
      grossMerchandiseValue: number;
      grossMerchandiseValueInRange?: number;
      transactionFeesInRange?: number;
      averageOrderValueInRange: number;
    };

    subscriptions?: {
      current: number;
      active: number;
      pendingPayment?: number;
      pastDue?: number;
      cancelling?: number;
      expired?: number;
      cancelled?: number;
      monthly: number;
      yearly: number;
      vendor: number;
      business: number;
      createdInRange?: number;
    };

    recentMarketplaceUsers: Array<{
      guid: string;
      fullName: string;
      email: string;
      subscriptionPlan: string;
    }>;

    recentProducts: any[];       // shape unknown from README – adjust as needed
    recentOrders: Array<{
      id: string;
      customerName: string;
      productName: string;
      amount: number;
      status: string;
      date: string;
    }>;
  };
}

export async function getDashboardOverview(params?: {
  FromUtc?: string;
  ToUtc?: string;
  RecentLimit?: number;
}): Promise<DashboardOverviewResponse> {
  const query = new URLSearchParams();
  if (params?.FromUtc) query.set("FromUtc", params.FromUtc);
  if (params?.ToUtc) query.set("ToUtc", params.ToUtc);
  if (params?.RecentLimit) query.set("RecentLimit", String(params.RecentLimit));

  const qs = query.toString();
  try {
    const data = await request<DashboardOverviewResponse>(
      `/AdminDashboard/Overview${qs ? `?${qs}` : ""}`
    );
    console.log("[DashboardService] ✅ Overview loaded.");
    return data;
  } catch (error: any) {
    console.error("[DashboardService] ❌ Failed to load overview:", error.message);
    throw error;
  }
}