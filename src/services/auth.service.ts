import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";
import { getSessionCookieHeader } from "../helpers";
import { StartWalletAuthResp } from "../types";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/auth`;

export async function startWalletAuth(
  address: string,
): Promise<StartWalletAuthResp> {
  try {
    const resp = await fetch(`${BASE_URL}/start/${address}`, {
      credentials: "include",
    });

    return resp.json();
  } catch (error) {
    console.error("error initiating auth ->", error);
    throw error;
  }
}

export async function finishWalletAuth(data?: {
  signerAddress?: string;
  signature?: string;
}) {
  try {
    const resp = await fetch(`${BASE_URL}/finish`, {
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
  } catch (error) {
    console.error("error completing auth ->", error);
    throw error;
  }
}

export async function logout() {
  try {
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
  } catch (error) {
    console.error("error signing out ->", error);
    throw error;
  }
}
