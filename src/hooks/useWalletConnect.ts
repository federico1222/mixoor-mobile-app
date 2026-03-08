import { useToast } from "@/src/provider";
import { WALLET_APPS, isNoWalletsError } from "@/src/utils/detectWallets";
import {
  clearTargetWallet,
  DetectedWallet,
  getAvailableWallets,
  setTargetWallet,
} from "@/src/utils/wallet-discovery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { isUserRejection, useSignIn } from "./useAuthenticate";

const CONNECTED_PACKAGE_KEY = "mixoor_connected_package";

export function useWalletConnect() {
  const { toast } = useToast();
  const { signIn, signingState, getLastError } = useSignIn();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [connectedPackage, setConnectedPackage] = useState<string | null>(null);

  // Restore persisted connected package once on mount
  useEffect(() => {
    AsyncStorage.getItem(CONNECTED_PACKAGE_KEY).then((pkg) => {
      if (pkg) {
        setConnectedPackage(pkg);
        setTargetWallet(pkg);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWithWallet = async (packageName?: string) => {
    setIsConnecting(true);

    if (packageName) {
      setTargetWallet(packageName);
    }

    const success = await signIn();

    // WS-7: Keep targetWallet set so subsequent transact() calls
    // also go to the same wallet. Only clear on disconnect.
    if (!success) {
      clearTargetWallet();
    }

    if (success && packageName) {
      setConnectedPackage(packageName);
      AsyncStorage.setItem(CONNECTED_PACKAGE_KEY, packageName);
    }

    if (!success) {
      const error = getLastError();

      if (isNoWalletsError(error)) {
        setShowInstallModal(true);
      } else if (!isUserRejection(error)) {
        const msg = error?.message?.toLowerCase() ?? "";
        const isTimeout = msg.includes("timed out");
        const isNetwork =
          msg.includes("network request failed") ||
          msg.includes("failed to fetch") ||
          msg.includes("network error");

        toast({
          type: "error",
          title: isTimeout
            ? "Wallet prompt not detected"
            : isNetwork
            ? "Network Error"
            : "Connection Failed",
          description: isTimeout
            ? "Open your wallet and approve the sign request, then try again."
            : isNetwork
            ? "Could not reach the server. Check your internet connection and try again."
            : error?.message || "Unable to connect to wallet. Please try again.",
          ...((isTimeout || isNetwork) && { action: { label: "Retry", onPress: handleConnect } }),
        });
      }
    }

    setIsConnecting(false);
  };

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      const wallets = await getAvailableWallets();

      if (wallets.length === 0) {
        setShowInstallModal(true);
        setIsConnecting(false);
        return;
      }

      if (wallets.length === 1) {
        await connectWithWallet(wallets[0].packageName);
        return;
      }

      // 2+ wallets: show selector
      setDetectedWallets(wallets);
      setShowSelectorModal(true);
      setIsConnecting(false);
    } catch {
      // Native module failed — fall back to default MWA flow
      await connectWithWallet();
    }
  };

  const handleSelectWallet = async (wallet: DetectedWallet) => {
    await connectWithWallet(wallet.packageName);
  };

  return {
    isConnecting,
    signingState,
    connectedPackage,
    showInstallModal,
    setShowInstallModal,
    showSelectorModal,
    setShowSelectorModal,
    detectedWallets,
    handleConnect,
    handleSelectWallet,
  };
}
