import { Signature } from "@solana/kit";
import { Client } from "@wallet-ui/react-native-kit";

export async function confirmTransactionStatus(
  client: Client,
  signatures: Signature[],
) {
  return (
    await client.rpc
      .getSignatureStatuses(signatures, {
        searchTransactionHistory: true,
      })
      .send()
  ).value;
}

export async function confirmTransactionStatusWithRetry(
  client: Client,
  signatures: Signature[],
  options: {
    maxRetries?: number;
    retryDelay?: number;
  } = {},
) {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const statuses = await confirmTransactionStatus(client, signatures);

      // Check if all statuses are non-null (confirmed)
      const allConfirmed = statuses.every((status) => status !== null);

      if (allConfirmed) {
        return statuses;
      }

      // If not all confirmed and we have retries left, wait and retry
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      // If we exhausted retries, return what we have
      return statuses;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError || new Error("Failed to confirm transaction status");
}
