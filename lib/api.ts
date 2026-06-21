// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Read token only on the client (localStorage is undefined during SSR)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || ""
      : "";

  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    },
  });

  const data = await res.json();

  if (!res.ok || data.isSuccessful === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data as T;
}

export { request };