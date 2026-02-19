import { Lamports } from "@solana/kit";

/**
 * Calculates the fee for a transfer based on the sending amount
 *
 * @param amount - The amount to send
 * @param feeBps - Fee in basis points (default: 15 = 0.15%)
 * @returns The calculated fee ui amount
 */
export function calculateTransferFee(
  amount?: number | string,
  feeBps: number = 15
): string | null {
  if (amount === undefined || amount === null || amount === "") {
    return null;
  }

  const numAmount = typeof amount === "string" ? Number(amount) : amount;

  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return null;
  }

  const fee = (numAmount * feeBps) / 10000;
  return fee.toFixed(6);
}

/**
 * Scales a token amount to UI readable amount
 *
 * @param tokenAmount - amount to scale to UI
 * @param decimals - decimals to apply in scaling
 * @param formatted - if true, returns locale-formatted string (e.g. "5,500"); if false, returns raw number
 *
 * @returns scaled amount as formatted string or raw number
 */
export function scaleToUIAmount(
  tokenAmount: number | string | Lamports | bigint | undefined,
  decimals: number,
  formatted = true
) {
  if (tokenAmount === undefined || tokenAmount === null || tokenAmount === "") {
    return formatted ? "0" : 0;
  }

  const num = Number(tokenAmount);
  if (!Number.isFinite(num)) {
    return formatted ? "0" : 0;
  }

  const scaled = num / Math.pow(10, decimals);

  if (!formatted) {
    return scaled;
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(scaled);
}
