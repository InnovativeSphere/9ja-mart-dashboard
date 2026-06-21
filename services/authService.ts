import { request } from "@/lib/api";

// ---------- Types ----------
export interface SignInPayload {
  identifier: string;
  password: string;
}

export interface SignInResponse {
  isSuccessful: boolean;
  message: string;
  data?: {
    token: string;
  };
}

export interface AdminProfile {
 
  name: string;
  email: string;
}

// ---------- Service functions ----------

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  try {
    const data = await request<SignInResponse>("/AdminAuth/SignIn", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.data?.token) {
      localStorage.setItem("adminToken", data.data.token);
      console.log("[AuthService] ✅ SignIn successful — token stored.");
    }

    return data;
  } catch (error: any) {
    console.error("[AuthService] ❌ SignIn failed:", error.message);
    throw error;
  }
}


export function logout(): void {
  localStorage.removeItem("adminToken");
  console.log("[AuthService] 🚪 Logged out — token removed.");
}


export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken");
  }
  return null;
}


export async function getAdminProfile(): Promise<AdminProfile> {
  try {
    const data = await request<AdminProfile>("/AdminAuth/Profile"); // hypothetical endpoint
    console.log("[AuthService] ✅ Admin profile loaded.");
    return data;
  } catch (error: any) {
    console.error("[AuthService] ❌ Failed to load admin profile:", error.message);
    throw error;
  }
}