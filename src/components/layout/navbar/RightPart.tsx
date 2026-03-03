import { formatAddress, getWalletIcon } from "@/src/helpers";
import { isUserRejection, useSignIn, useSignOut } from "@/src/hooks/useAuthenticate";
import { useUserDetails } from "@/src/hooks/userUser";
import { useToast } from "@/src/provider";
import { isNoWalletsError } from "@/src/utils/detectWallets";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { WalletIcon } from "phosphor-react-native";
import { useState } from "react";
import { Image, Spinner } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import InstallWalletModal from "../wallet/InstallWalletModal";
import { WalletMenu } from "../wallet/WalletMenu";

export default function RightPart() {
  const { toast } = useToast();
  const { data: userDetails } = useUserDetails();
  const { account } = useMobileWallet();
  const { signIn, signingState, getLastError } = useSignIn();
  const { signOut } = useSignOut();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    const success = await signIn();

    if (!success) {
      const error = getLastError();

      if (isNoWalletsError(error)) {
        setShowInstallModal(true);
      } else if (!isUserRejection(error)) {
        const isTimeout = error?.message?.includes("timed out");
        toast({
          type: "error",
          title: isTimeout ? "Wallet prompt not detected" : "Connection Failed",
          description: isTimeout
            ? "Open your wallet and approve the sign request, then try again."
            : error?.message || "Unable to connect to wallet. Please try again.",
          ...(isTimeout && { action: { label: "Retry", onPress: handleConnect } }),
        });
      }
    }

    setIsConnecting(false);
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
          {account?.label ? (
            <Image src={getWalletIcon(account.label)} width={18} height={18} />
          ) : (
            <WalletIcon color="#CCCFF9" size={18} />
          )}
        </ConnectWalletButton>
      }
    />
  );
}
