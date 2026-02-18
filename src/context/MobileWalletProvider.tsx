// context/MobileWalletProvider.tsx
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import type { Address } from "@solana/kit";
import { PublicKey } from "@solana/web3.js";
import { createContext, useContext, useState, type ReactNode } from "react";
import { fromLegacyPublicKey } from "../utils";

interface WalletInfo {
  name: string;
  icon?: string;
}

interface MobileWalletContextType {
  address: Address | null;
  walletInfo: WalletInfo | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  loading: boolean;
}

const MobileWalletContext = createContext<MobileWalletContextType>({
  address: null,
  walletInfo: null,
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  loading: false,
});

export function MobileWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      setLoading(true);
      const result = await transact(async (wallet) => {
        const authResult = await wallet.authorize({
          cluster: "devnet",
          identity: {
            name: "Mixoor",
            uri: "https://mixoor.fun",
            icon: "favicon.ico",
          },
        });
        return authResult;
      });

      const base64Address = result.accounts[0].address;
      const addressBytes = Buffer.from(base64Address, "base64");

      const legacyPubkey = new PublicKey(addressBytes);
      const kitAddress = fromLegacyPublicKey(legacyPubkey);

      const walletLabel = result.accounts[0].label || "unknown-wallet";
      setWalletInfo({ name: walletLabel });
      setAddress(kitAddress);

      console.log("Connected to:", legacyPubkey.toBase58());
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setWalletInfo(null);
  };

  return (
    <MobileWalletContext.Provider
      value={{
        address,
        walletInfo,
        connect,
        disconnect,
        isConnected: !!address,
        loading,
      }}
    >
      {children}
    </MobileWalletContext.Provider>
  );
}

export const useMobileWallet = () => useContext(MobileWalletContext);
