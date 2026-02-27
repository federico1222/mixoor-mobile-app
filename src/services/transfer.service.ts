import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";
import {
  DirectTransferResp,
  TransferPayload,
  TransferSparsedPayload,
  TransferSparsedResp,
} from "../types";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/transfer`;

/**
 * When we want a direct transfer from the BE
 *
 * @param data - transfer payload data
 * @returns the direct transfer response
 *
 * @throws error if fetch fails
 */
export async function directTransferFromBE(
  data: TransferPayload
): Promise<DirectTransferResp> {
  try {
    const resp = await fetch(`${BASE_URL}/direct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return await resp.json();
  } catch (error) {
    console.log("error calling direct transfer ->", error);
    throw error;
  }
}

/**
 * Transfers a previously deposited amount to a recipient
 *
 * Works to transfer the deposit a user previously made, unlike direct transfer
 *
 * @param data - deposit payload data
 * @returns sparsed transfer response
 *
 * @throws error if fetch fails
 */
export async function sparsedTransferFromBE(
  data: TransferSparsedPayload
): Promise<TransferSparsedResp> {
  try {
    const resp = await fetch(`${BASE_URL}/sparsed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await resp.json();
  } catch (error) {
    console.log("error calling sparsed transfer ->", error);
    throw error;
  }
}
