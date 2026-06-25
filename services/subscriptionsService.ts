import { request } from "@/lib/api";

// ---------- Types ----------
export interface SubscriptionItem {
  id?: number;
  customerGuid: string;
  customerName?: string;
  plan: string;               // "Vendor" | "Business"
  billingInterval: string;    // "Monthly" | "Yearly"
  status: string;             // "Active", "PastDue", "Cancelled", etc.
  startDate?: string;
  endDate?: string;
  paystackReference?: string;
  renewalDate?: string;
  isCurrent?: boolean;
}

export interface CurrentSubscriptionResponse {
  isSuccessful: boolean;
  message: string;
  data: SubscriptionItem;
}

export interface SubscriptionHistoryResponse {
  isSuccessful: boolean;
  message: string;
  data: SubscriptionItem[];
}

export interface GrantSubscriptionPayload {
  customerGuid: string;
  plan: string;               // "Vendor" | "Business"
  billingInterval: string;    // "Monthly" | "Yearly"
  subscriptionExpiresAtUtc?: string;
  reason?: string;
}

export interface CancelSubscriptionPayload {
  customerGuid: string;
  reason?: string;
}

export interface ExpireSubscriptionPayload {
  customerGuid: string;
  reason?: string;
}

export interface ChangePlanPayload {
  customerGuid: string;
  plan: string;               // "Vendor" | "Business"  ← now string
  billingInterval: string;    // "Monthly" | "Yearly"   ← now string
}

// ---------- Service functions ----------

export async function getCustomerSubscription(customerGuid: string): Promise<CurrentSubscriptionResponse> {
  try {
    const data = await request<CurrentSubscriptionResponse>(`/AdminSubscription/Current?CustomerGuid=${customerGuid}`);
    console.log("[SubscriptionsService] ✅ Current subscription loaded.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to load current subscription:", error.message);
    throw error;
  }
}

export async function getSubscriptionHistory(customerGuid: string): Promise<SubscriptionHistoryResponse> {
  try {
    const data = await request<SubscriptionHistoryResponse>(`/AdminSubscription/History?CustomerGuid=${customerGuid}`);
    console.log("[SubscriptionsService] ✅ Subscription history loaded.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to load history:", error.message);
    throw error;
  }
}

export async function grantSubscription(payload: GrantSubscriptionPayload): Promise<any> {
  try {
    const data = await request("/AdminSubscription/Grant", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log("[SubscriptionsService] ✅ Subscription granted.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to grant subscription:", error.message);
    throw error;
  }
}

export async function cancelSubscription(payload: CancelSubscriptionPayload): Promise<any> {
  try {
    const data = await request("/AdminSubscription/Cancel", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log("[SubscriptionsService] ✅ Subscription cancelled.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to cancel subscription:", error.message);
    throw error;
  }
}

export async function expireSubscription(payload: ExpireSubscriptionPayload): Promise<any> {
  try {
    const data = await request("/AdminSubscription/Expire", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log("[SubscriptionsService] ✅ Subscription expired.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to expire subscription:", error.message);
    throw error;
  }
}

export async function changeSubscriptionPlan(payload: ChangePlanPayload): Promise<any> {
  try {
    const data = await request("/AdminSubscription/ChangePlan", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log("[SubscriptionsService] ✅ Plan changed.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to change plan:", error.message);
    throw error;
  }
}

export async function confirmSubscription(reference: string): Promise<any> {
  try {
    const data = await request("/AdminSubscription/Confirm", {
      method: "POST",
      body: JSON.stringify({ reference }),
    });
    console.log("[SubscriptionsService] ✅ Subscription confirmed.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to confirm subscription:", error.message);
    throw error;
  }
}

export async function resumeRenewal(customerGuid: string): Promise<any> {
  try {
    const data = await request("/AdminSubscription/ResumeRenewal", {
      method: "POST",
      body: JSON.stringify({ customerGuid }),
    });
    console.log("[SubscriptionsService] ✅ Renewal resumed.");
    return data;
  } catch (error: any) {
    console.error("[SubscriptionsService] ❌ Failed to resume renewal:", error.message);
    throw error;
  }
}