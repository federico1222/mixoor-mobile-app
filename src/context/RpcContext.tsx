import {
  type Rpc,
  type RpcSubscriptions,
  type SolanaRpcApiMainnet,
  type SolanaRpcSubscriptionsApi,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
} from "@solana/kit";
import { createContext } from "react";
import {
  SOLANA_RPC_ENDPOINT,
  SOLANA_RPC_SUBSCRIPTIONS_ENDPOINT,
} from "../config";

export const RpcContext = createContext<{
  rpc: Rpc<SolanaRpcApiMainnet>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
}>({
  rpc: createSolanaRpc(SOLANA_RPC_ENDPOINT!),
  rpcSubscriptions: createSolanaRpcSubscriptions(
    SOLANA_RPC_SUBSCRIPTIONS_ENDPOINT
  ),
});
