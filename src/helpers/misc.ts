import {
  createSolanaDevnet,
  createSolanaMainnet,
  createSolanaTestnet,
} from "@wallet-ui/core";
import { SOLANA_RPC_ENDPOINT, SOLANA_RPC_SUBSCRIPTIONS_ENDPOINT } from "../config";

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
