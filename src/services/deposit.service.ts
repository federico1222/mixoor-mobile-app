import { MIXOOR_BACKEND_API_ENDPOINT } from "../config/env";
import { DepositPayload } from "../types";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/deposit`;

// when we want the BE to handle the deposit
export async function depositFromBE(data: DepositPayload) {
  try {
    const resp = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await resp.json();

    if (!resp.ok) {
      throw new Error(result?.message || "Deposit failed");
    }

    return result;
  } catch (error) {
    console.error("error calling deposit", error);
    throw error;
  }
}
