import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";
import { getSessionCookieHeader } from "../helpers";
import { StartWalletAuthResp } from "../types";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/auth`;

async function fetchWithRetry(
  input: RequestInfo,
  init?: RequestInit,
  retries = 2,
  delayMs = 1000
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(input, init);
      if (!resp.ok && attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      return resp;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  throw new Error("fetchWithRetry: unreachable");
}

export async function startWalletAuth(
  address: string
): Promise<StartWalletAuthResp> {
  const resp = await fetchWithRetry(`${BASE_URL}/start/${address}`, {
    credentials: "include",
  });

  return resp.json();
}

export async function finishWalletAuth(data?: {
  signerAddress?: string;
  signature?: string;
}) {
  const resp = await fetchWithRetry(`${BASE_URL}/finish`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });

  const sessionCookie = resp.headers.get("set-cookie");
  const body = await resp.json();
  return { ...body, sessionCookie };
}

export async function logout() {
  const cookieHeader = await getSessionCookieHeader();
  const resp = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...cookieHeader,
    },
  });

  return resp.json();
}
