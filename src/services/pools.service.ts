import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/pools`;

// fetch featured solana pools
export async function fetchFeaturedSolanaPools() {
  const resp = await fetch(`${BASE_URL}/featured`);
  return resp.json();
}
