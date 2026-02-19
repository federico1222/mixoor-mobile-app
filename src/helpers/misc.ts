import { SOLANA_RPC_ENDPOINT } from "../config/env";

/**
 * Returns chains config to send a transaction
 */
export function getClusterFromEndpoint() {
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
