import { formatAddress } from "@/src/helpers";
import { useSignOut } from "@/src/hooks/useAuthenticate";
import { useWalletConnect } from "@/src/hooks/useWalletConnect";
import { useUserDetails } from "@/src/hooks/userUser";
import { WALLET_APPS } from "@/src/utils/detectWallets";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { WalletIcon } from "phosphor-react-native";
import { Image as RNImage } from "react-native";
import { Spinner } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import InstallWalletModal from "../wallet/InstallWalletModal";
import WalletSelectorModal from "../wallet/WalletSelectorModal";
import { WalletMenu } from "../wallet/WalletMenu";

export default function RightPart() {
  const { data: userDetails } = useUserDetails();
  const { account } = useMobileWallet();
  const { signOut } = useSignOut();

  const {
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
  } = useWalletConnect();

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
