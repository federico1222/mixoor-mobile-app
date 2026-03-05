import { formatAddress } from "@/src/helpers";
import { isUserRejection, useSignIn, useSignOut } from "@/src/hooks/useAuthenticate";
import { useUserDetails } from "@/src/hooks/userUser";
import { useToast } from "@/src/provider";
import { WALLET_APPS, isNoWalletsError } from "@/src/utils/detectWallets";
import {
  clearTargetWallet,
  DetectedWallet,
  getAvailableWallets,
  setTargetWallet,
} from "@/src/utils/wallet-discovery";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { WalletIcon } from "phosphor-react-native";
import { useState } from "react";
import { Image as RNImage } from "react-native";
import { Spinner } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import InstallWalletModal from "../wallet/InstallWalletModal";
import WalletSelectorModal from "../wallet/WalletSelectorModal";
import { WalletMenu } from "../wallet/WalletMenu";

export default function RightPart() {
  const { toast } = useToast();
  const { data: userDetails } = useUserDetails();
  const { account } = useMobileWallet();
  const { signIn, signingState, getLastError } = useSignIn();
  const { signOut } = useSignOut();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [connectedPackage, setConnectedPackage] = useState<string | null>(null);

  const connectWithWallet = async (packageName?: string) => {
    setIsConnecting(true);

    if (packageName) {
      setTargetWallet(packageName);
    }

    const success = await signIn();

    clearTargetWallet();

    if (success && packageName) {
      setConnectedPackage(packageName);
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

  if (!account?.address) {
    return (
      <>
        <ConnectWalletButton
          title={
            signingState === "awaiting_wallet"
              ? "Check your wallet..."
              : isConnecting
              ? "Connecting..."
              : "Connect Wallet"
          }
          width={"auto"}
          maxH={40}
          rounded={"$2"}
          bg={"#5D44BE"}
          onPress={handleConnect}
          disabled={isConnecting}
          opacity={isConnecting ? 0.7 : 1}
        >
          {isConnecting ? (
            <Spinner size="small" color="#CCCFF9" />
          ) : (
            <WalletIcon color="#CCCFF9" size={18} />
          )}
        </ConnectWalletButton>

        <InstallWalletModal
          open={showInstallModal}
          onOpenChange={setShowInstallModal}
        />

        <WalletSelectorModal
          open={showSelectorModal}
          onOpenChange={setShowSelectorModal}
          wallets={detectedWallets}
          onSelectWallet={handleSelectWallet}
        />
      </>
    );
  }

  return (
    <WalletMenu
      address={account.address}
      onDisconnect={signOut}
      trigger={
        <ConnectWalletButton
          width={"auto"}
          maxH={40}
          rounded={"$2"}
          bg={"#5D44BE"}
          title={
            userDetails?.username || formatAddress(account.address, 3, 0, 3)
          }
        >
          {(() => {
            const walletApp = connectedPackage
              ? WALLET_APPS.find((w) => w.packageName === connectedPackage)
              : undefined;
            if (walletApp?.icon) {
              return (
                <RNImage
                  source={typeof walletApp.icon === "string" ? { uri: walletApp.icon } : walletApp.icon}
                  style={{ width: 18, height: 18, borderRadius: 4 }}
                />
              );
            }
            return <WalletIcon color="#CCCFF9" size={18} />;
          })()}
        </ConnectWalletButton>
      }
    />
  );
}
