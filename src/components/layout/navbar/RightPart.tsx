import { useMobileWallet } from "@/src/context";
import { formatAddress } from "@/src/helpers";
import { useUserDetails } from "@/src/hooks/userUser";
import { WalletIcon } from "phosphor-react-native";
import { Image } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import { WalletMenu } from "../wallet/WalletMenu";

export default function RightPart() {
  const { data: userDetails } = useUserDetails();
  const { address, connect, disconnect, isConnected, walletInfo } =
    useMobileWallet();

  if (!isConnected || !address) {
    return (
      <ConnectWalletButton
        title="Connect Wallet"
        width={"auto"}
        maxH={40}
        rounded={"$2"}
        bg={"#5D44BE"}
        onPress={connect}
      >
        <WalletIcon color="#CCCFF9" size={18} />
      </ConnectWalletButton>
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
            <Image src={walletInfo.icon} width={18} height={18} />
          ) : (
            <WalletIcon color="#CCCFF9" size={18} />
          )}
        </ConnectWalletButton>
      }
    />
  );
}
