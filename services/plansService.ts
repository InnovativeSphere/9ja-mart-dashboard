// services/plansService.ts
import { request } from "@/lib/api";

// ---------- Types matching the API ----------
export interface CreatePlanPayload {
  plan: string;                // "Vendor" | "Business"
  billingInterval: string;     // "Monthly" | "Yearly"
  displayName: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  sortOrder: number;
  entitlements: string[];
  featureSummary: string[];
}

export interface PlanListItem extends CreatePlanPayload {
  id: number;
  // The API may also return extra fields like createdAt, etc.
}

export interface PlansListResponse {
  isSuccessful: boolean;
  message: string;
  data: PlanListItem[];
}

// ---------- Service functions ----------

export async function getPlans(): Promise<PlansListResponse> {
  try {
    const data = await request<PlansListResponse>("/SubscriptionPlan");
    console.log("[PlansService] ✅ Plans loaded.");
    return data;
  } catch (error: any) {
    console.error("[PlansService] ❌ Failed to load plans:", error.message);
    throw error;
  }
}

export async function createPlan(payload: CreatePlanPayload): Promise<any> {
  try {
    const data = await request("/SubscriptionPlan", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log("[PlansService] ✅ Plan created.");
    return data;
  } catch (error: any) {
    console.error("[PlansService] ❌ Failed to create plan:", error.message);
    throw error;
  }
}

export async function updatePlan(
  identifier: { plan: string; billingInterval: string },
  updates: Partial<CreatePlanPayload> & { updateExistingSubscriptions?: boolean }
): Promise<any> {
  try {
    const payload = {
      plan: identifier.plan,                    // e.g. "Vendor"
      billingInterval: identifier.billingInterval, // e.g. "Monthly"
      displayName: updates.displayName ?? null,
      price: updates.price ?? null,
      currency: updates.currency ?? null,
      isAvailable: updates.isAvailable ?? null,
      sortOrder: updates.sortOrder ?? null,
      updateExistingSubscriptions: updates.updateExistingSubscriptions ?? false,
      entitlements: updates.entitlements ?? [""],
      featureSummary: updates.featureSummary ?? [""],
    };

    const data = await request("/SubscriptionPlan", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    console.log("[PlansService] ✅ Plan updated.");
    return data;
  } catch (error: any) {
    console.error("[PlansService] ❌ Failed to update plan:", error.message);
    throw error;
  }
}