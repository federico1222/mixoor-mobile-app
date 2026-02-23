import { MIXOOR_BACKEND_API_ENDPOINT } from "../config/env";
import { CreateUserPayload } from "../types/user";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/users`;

export async function sendFeedback(
  feedback: string,
  wallet?: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback, wallet }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to send feedback");
  }
}

export async function saveNewUser(data: CreateUserPayload) {
  const resp = await fetch(`${BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await resp.json();

  if (!resp.ok) {
    throw new Error(json.message);
  }

  return json;
}

export async function fetchUserDetails(address: string) {
  try {
    const resp = await fetch(`${BASE_URL}/address/${address}`);

    return await resp.json();
  } catch (error) {
    console.log("error fetching user details");
    throw error;
  }
}

export async function privateUserTransfers(
  userAddress: string,
  limit: number = 10,
  offset: number = 0,
  sortOrder: "asc" | "desc" = "desc"
) {
  try {
    const url = `${BASE_URL}/address/${userAddress}/transfers`;
    const resp = await fetch(
      `${url}?limit=${limit}&offset=${offset}&sortOrder=${sortOrder}`,
      {
        credentials: "include",
      }
    );

    return resp.json();
  } catch (error) {
    console.log("error fetching user deposits");
    throw error;
  }
}

export async function fetchUserDeposits(
  userAddress: string,
  status: "all" | "unspent" = "unspent"
) {
  try {
    const resp = await fetch(
      `${BASE_URL}/address/${userAddress}/deposits?status=${status}`,
      {
        credentials: "include",
      }
    );

    return resp.json();
  } catch (error) {
    console.log("error fetching user deposits");
    throw error;
  }
}
