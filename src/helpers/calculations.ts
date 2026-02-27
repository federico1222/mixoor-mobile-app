import { AssetType } from "./misc";
import { Lamports } from "@solana/kit";
import {
  SYSTEM_ACCOUNT_CREATION_FEE_LAMPORTS,
  TOKEN_CREATION_FEE_LAMPORTS,
} from "../constants";

/**
 * Calculates the fee for a transfer based on the sending amount
 *
 * @param amount - The amount to send
 * @param feeBps - Fee in basis points (default: 15 = 0.15%)
 * @returns The calculated fee ui amount
 */
export function calculateTransferFee(
  amount?: number | string,
  feeBps: number = 15,
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
  formatted = true,
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

/**
 * Scales UI amount to token amount.
 *
 * @param uiAmount - ui amount to scale to token amount
 * @param decimals - decimals to apply in scaling
 *
 * @returns scaled amount in UI
 */
export function scaleToTokenAmount(uiAmount: string, decimals: number): bigint {
  if (!uiAmount) throw new Error("missing contribution amount");

  const [whole = "0", fraction = ""] = uiAmount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);

  return BigInt(whole + paddedFraction);
}

/**
 * Calculates tx cost and ata creation for spl asset types
 *
 * @param assetType - Type of asset being transferred
 * @param recipientsLength - Number of recipients
 * @returns Total transaction cost in lamports
 */
export function calculateTransactionFeeLamports(
  assetType: AssetType,
  recipientsLength = 1,
): bigint {
  const TX_FEE_PER_RECIPIENT = 6_000n;
  const recipients = BigInt(recipientsLength);

  const txFees = TX_FEE_PER_RECIPIENT * recipients;
  const accountCreationFee =
    assetType === AssetType.SplToken
      ? TOKEN_CREATION_FEE_LAMPORTS
      : SYSTEM_ACCOUNT_CREATION_FEE_LAMPORTS;

  return accountCreationFee * recipients + txFees;
}
