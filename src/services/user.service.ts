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
