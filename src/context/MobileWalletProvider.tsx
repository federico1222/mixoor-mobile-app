import AsyncStorage from "@react-native-async-storage/async-storage";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import type { Address } from "@solana/kit";
import { PublicKey } from "@solana/web3.js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getWalletIcon } from "../helpers";
import { getClusterFromEndpoint } from "../helpers/misc";
import { fromLegacyPublicKey } from "../utils";

interface WalletInfo {
  name: string;
  icon?: string;
}

interface MobileWalletContextType {
  address: Address | null;
  walletInfo: WalletInfo | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  loading: boolean;
}

const AUTH_TOKEN_KEY = "mwa_auth_token";

const MobileWalletContext = createContext<MobileWalletContextType>({
  address: null,
  walletInfo: null,
  connect: async () => {},
  disconnect: async () => {},
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

      const cachedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

      const result = await transact(async (wallet) => {
        try {
          return await wallet.authorize({
            identity: {
              name: "Mixoor",
              uri: "https://mixoor.fun",
              icon: "favicon.ico",
            },
            chain: getClusterFromEndpoint(),
            auth_token: cachedToken ?? undefined,
          });
        } catch {
          return await wallet.authorize({
            identity: {
              name: "Mixoor",
              uri: "https://mixoor.fun",
              icon: "favicon.ico",
            },
            chain: "solana:devnet",
          });
        }
      });

      if (result.auth_token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, result.auth_token);
      }

      const base64Address = result.accounts[0].address;
      const addressBytes = Buffer.from(base64Address, "base64");

      const legacyPubkey = new PublicKey(addressBytes);
      const kitAddress = fromLegacyPublicKey(legacyPubkey);

      setWalletInfo({
        name: result.accounts[0].label || "unknown-wallet",
        icon: getWalletIcon(result.accounts[0].label || ""),
      });

      setAddress(kitAddress);

      console.log("Connected to:", legacyPubkey.toBase58());
    } catch (error) {
      console.log("Error connecting wallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }

    setAddress(null);
    setWalletInfo(null);
  };

  useEffect(() => {
    const tryReconnect = async () => {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          await connect();
        } catch {}
      }
    };

    tryReconnect();
  }, []);

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
