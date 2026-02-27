import { createContext, ReactNode, useMemo } from "react";
import { SolanaCluster } from "@wallet-ui/react-native-kit";

export interface NetworkProviderContextValue {
  network: SolanaCluster;
  getExplorerUrl(path: string): string;
}

export const NetworkProviderContext =
  createContext<NetworkProviderContextValue>({} as NetworkProviderContextValue);

export function NetworkProvider({
  network,
  children,
}: {
  network: SolanaCluster;
  children: ReactNode;
}) {
  const value: NetworkProviderContextValue = useMemo(
    () => ({
      network,
      getExplorerUrl: (path: string) =>
        `https://explorer.solana.com/${path}${getExplorerUrlParam(network)}`,
    }),
    [network],
  );
  return (
    <NetworkProviderContext.Provider value={value}>
      {children}
    </NetworkProviderContext.Provider>
  );
}

function getExplorerUrlParam(network: SolanaCluster): string {
  switch (network.id) {
    case "solana:devnet":
      return `?cluster=devnet`;
    case "solana:testnet":
      return `?cluster=testnet`;
    case "solana:localnet":
      return `?cluster=custom&customUrl=${encodeURIComponent(network.url)}`;
    default:
      return "";
  }
}
