import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";
import { DepositPayload } from "../types";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/deposit`;

// when we want the BE to handle the deposit
export async function depositFromBE(data: DepositPayload) {
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
}
