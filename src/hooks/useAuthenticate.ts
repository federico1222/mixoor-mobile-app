import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBase58Codec, getUtf8Codec } from "@solana/kit";
import { useQueryClient } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useCallback, useState } from "react";
import { SESSION_COOKIE_KEY } from "../constants";
import {
  finishWalletAuth,
  logout,
  startWalletAuth,
} from "../services/auth.service";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { connect, signMessage, account } = useMobileWallet();

  const signIn = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const connected = account ?? (await connect());
      const walletAddress = connected.address.toString();

      const startResp = await startWalletAuth(walletAddress);
      const data = startResp?.data;

      if (data?.authenticated) return true;
      if (!data?.message) return false;

      const messageBytes = getUtf8Codec().encode(data.message);
      const signatureBytes = await signMessage(Uint8Array.from(messageBytes));
      const signature = getBase58Codec().decode(signatureBytes);

      const finishResp = await finishWalletAuth({
        signerAddress: walletAddress,
        signature,
      });

      if (!finishResp?.success) return false;

      if (finishResp.sessionCookie) {
        await AsyncStorage.setItem(
          SESSION_COOKIE_KEY,
          finishResp.sessionCookie
        );
      }

      return true;
    } catch (error) {
      console.log("Sign in error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [account, connect, signMessage]);

  return { signIn, isLoading };
}

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const { disconnect } = useMobileWallet();
  const queryClient = useQueryClient();

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      await AsyncStorage.removeItem(SESSION_COOKIE_KEY);
      await disconnect();
      queryClient.invalidateQueries({ queryKey: ["startAuthMessage"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      queryClient.invalidateQueries({ queryKey: ["userTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["userDeposits"] });
      setIsLoading(false);
    }
  }, [disconnect, queryClient]);

  return { signOut, isLoading };
}
