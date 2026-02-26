import {
  createSolanaDevnet,
  createSolanaMainnet,
  createSolanaTestnet,
} from "@wallet-ui/core";
import {
  SOLANA_RPC_ENDPOINT,
  SOLANA_RPC_SUBSCRIPTIONS_ENDPOINT,
} from "../config";
import {
  WRAPPED_SOL_MINT_TOKEN_2022_PROGRAM,
  WRAPPED_SOL_MINT_TOKEN_PROGRAM,
} from "../constants";
import {
  address,
  Address,
  lamports,
  TransactionSendingSigner,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

export enum AssetType {
  Sol = 0,
  SplToken = 1,
}

export function getSolanaNetwork() {
  const url = SOLANA_RPC_ENDPOINT ?? "https://api.mainnet-beta.solana.com";
  const urlWs = SOLANA_RPC_SUBSCRIPTIONS_ENDPOINT;

  if (url.includes("devnet")) return createSolanaDevnet({ url, urlWs });
  if (url.includes("testnet")) return createSolanaTestnet({ url, urlWs });
  return createSolanaMainnet({ url, urlWs });
}

/**
 * Returns the Solana cluster ID derived from the RPC endpoint
 */
export function getSolanaClusterId() {
  if (!SOLANA_RPC_ENDPOINT) return;

  switch (true) {
    case SOLANA_RPC_ENDPOINT.includes("mainnet"):
      return "solana:mainnet";
    case SOLANA_RPC_ENDPOINT.includes("devnet"):
      return "solana:devnet";
    case SOLANA_RPC_ENDPOINT.includes("testnet"):
      return "solana:testnet";
    case SOLANA_RPC_ENDPOINT.includes("localhost"):
      return "solana:localhost";

    default:
      return "solana:mainnet";
  }
}

export function determineAssetType(mint: Address | string) {
  return mint === WRAPPED_SOL_MINT_TOKEN_PROGRAM ||
    mint === WRAPPED_SOL_MINT_TOKEN_2022_PROGRAM
    ? AssetType.Sol
    : AssetType.SplToken;
}

/// ------------------------------------- instructions
export async function transferLamportsInstruction(
  args: {
    source: TransactionSendingSigner;
    destination: string;
    amount: bigint;
  }, // in lamports
) {
  const { source, destination, amount } = args;
  return getTransferSolInstruction({
    source,
    destination: address(destination),
    amount: lamports(amount),
  });
}
