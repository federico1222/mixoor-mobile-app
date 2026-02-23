import { useMobileWallet } from "@/src/context";
import { formatAddress } from "@/src/helpers";
import { useUserDetails } from "@/src/hooks/userUser";
import { useToast } from "@/src/provider";
import { isNoWalletsError } from "@/src/utils/detectWallets";
import { WalletIcon } from "phosphor-react-native";
import { useState } from "react";
import { Image, Spinner } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import InstallWalletModal from "../wallet/InstallWalletModal";
import { WalletMenu } from "../wallet/WalletMenu";

export default function RightPart() {
  const { toast } = useToast();
  const { data: userDetails } = useUserDetails();
  const { address, connect, disconnect, isConnected, walletInfo } =
    useMobileWallet();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error: any) {
      if (isNoWalletsError(error)) {
        setShowInstallModal(true);
      } else {
        toast({
          type: "error",
          title: "Connection Failed",
          description:
            error?.message || "Unable to connect to wallet. Please try again.",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <>
        <ConnectWalletButton
          title={isConnecting ? "Connecting..." : "Connect Wallet"}
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
      address={address}
      onDisconnect={disconnect}
      trigger={
        <ConnectWalletButton
          width={"auto"}
          maxH={40}
          rounded={"$2"}
          bg={"#5D44BE"}
          title={userDetails?.username || formatAddress(address, 3, 0, 3)}
        >
          {walletInfo?.icon ? (
            <Image
              src={walletInfo.icon}
              width={18}
              height={18}
              borderRadius={4}
            />
          ) : (
            <WalletIcon color="#CCCFF9" size={18} />
          )}
        </ConnectWalletButton>
      }
    />
  );
}
