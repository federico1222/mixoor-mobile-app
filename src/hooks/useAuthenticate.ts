import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBase58Codec, getUtf8Codec } from "@solana/kit";
import { useQueryClient } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useCallback, useRef, useState } from "react";
import { SESSION_COOKIE_KEY } from "../constants";
import { useAuth } from "../provider/auth-provider";
import {
  finishWalletAuth,
  logout,
  startWalletAuth,
} from "../services/auth.service";
import { clearTargetWallet } from "../utils/wallet-discovery";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export function isUserRejection(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("user rejected") ||
    msg.includes("user cancelled") ||
    msg.includes("user canceled")
  );
}

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [signingState, setSigningState] = useState<"idle" | "awaiting_wallet">("idle");
  const { connect, signMessage, account } = useMobileWallet();
  const { setAuthenticated } = useAuth();

  const lastErrorRef = useRef<Error | null>(null);

  const signIn = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const connected = account ?? (await withTimeout(connect(), 60_000, "Wallet connection"));
      const walletAddress = connected.address.toString();

      // Allow the OS to fully return focus from the wallet app
      // before making the next MWA request (fixes Samsung A55/A52)
      if (!account) {
        await delay(800);
      }

      const startResp = await withTimeout(
        startWalletAuth(walletAddress),
        30_000,
        "Authentication request"
      );
      const data = startResp?.data;

      if (data?.authenticated) {
        setAuthenticated(true);
        return true;
      }
      if (!data?.message) return false;

      const messageBytes = getUtf8Codec().encode(data.message);
      setSigningState("awaiting_wallet");
      const signatureBytes = await withTimeout(
        signMessage(Uint8Array.from(messageBytes)),
        60_000,
        "Wallet signing"
      );
      const signature = getBase58Codec().decode(signatureBytes);

      const finishResp = await withTimeout(
        finishWalletAuth({
          signerAddress: walletAddress,
          signature,
        }),
        30_000,
        "Authentication completion"
      );

      if (!finishResp?.success) return false;

      if (finishResp.sessionCookie) {
        await AsyncStorage.setItem(
          SESSION_COOKIE_KEY,
          finishResp.sessionCookie
        );
      }

      setAuthenticated(true);
      return true;
    } catch (error) {
      lastErrorRef.current = error instanceof Error ? error : new Error(String(error));
      return false;
    } finally {
      setSigningState("idle");
      setIsLoading(false);
    }
  }, [account, connect, signMessage, setAuthenticated]);

  return { signIn, isLoading, signingState, getLastError: () => lastErrorRef.current };
}

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const { disconnect } = useMobileWallet();
  const queryClient = useQueryClient();
  const { setAuthenticated } = useAuth();

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setAuthenticated(false);
    try {
      await logout();
    } catch {
    } finally {
      clearTargetWallet();
      await AsyncStorage.removeItem(SESSION_COOKIE_KEY);
      await AsyncStorage.removeItem("mixoor_connected_package");
      await disconnect();
      queryClient.invalidateQueries({ queryKey: ["startAuthMessage"] });
      queryClient.invalidateQueries({ queryKey: ["userDetails"] });
      queryClient.invalidateQueries({ queryKey: ["userTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["userDeposits"] });
      setIsLoading(false);
    }
  }, [disconnect, queryClient, setAuthenticated]);

  return { signOut, isLoading };
}
