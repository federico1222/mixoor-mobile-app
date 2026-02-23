import { MIXOOR_BACKEND_API_ENDPOINT } from "../config";

export const BASE_URL = `${MIXOOR_BACKEND_API_ENDPOINT}/auth`;

export async function logout() {
  try {
    const resp = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return resp.json();
  } catch (error) {
    console.log("error signing out ->", error);
    throw error;
  }
}
