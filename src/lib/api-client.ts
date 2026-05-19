import { auth } from "@/lib/firebase";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Fetch wrapper that automatically attaches the Firebase ID token. Use it for
 * every call to our authenticated APIs (/api/analyze-*, /api/create-resume,
 * etc.). It throws ApiError on non-2xx so callers can branch on status (401 →
 * re-login, 402 → out of credits, 429 → rate limited).
 */
export async function authedFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const user = auth.currentUser;
  if (!user) throw new ApiError("Não autenticado", 401, null);
  const token = await user.getIdToken();

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, { ...init, headers });
}

/** authedFetch + JSON parse + throws ApiError on non-2xx. */
export async function authedFetchJson<T = unknown>(
  input: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await authedFetch(input, init);
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : null) || `Erro ${res.status}`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}
