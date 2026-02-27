import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/proxy`;

// check risk/maliciousness of address using the range api
// https://docs.range.org/risk-api/risk/get-address-risk-score#risk-scoring-logic
export async function checkAddressWithRangeApi(address: string) {
  try {
    const resp = await fetch(`${BASE_URL}/range/${address}`, {
      credentials: "include",
    });

    return resp.json();
  } catch (error) {
    console.log("error checking risk level");
    throw error;
  }
}
