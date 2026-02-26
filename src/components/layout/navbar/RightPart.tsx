import { formatAddress } from "@/src/helpers";
import { useUserDetails } from "@/src/hooks/userUser";
import { WalletIcon } from "phosphor-react-native";
import { Image } from "tamagui";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import { WalletMenu } from "../wallet/WalletMenu";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { useSignIn, useSignOut } from "@/src/hooks/useAuthenticate";

export default function RightPart() {
  const { data: userDetails } = useUserDetails();
  const { account } = useMobileWallet();
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  if (!account || !account?.address) {
    return (
      <ConnectWalletButton
        title="Connect Wallet"
        width={"auto"}
        maxH={40}
        rounded={"$2"}
        bg={"#5D44BE"}
        onPress={signIn}
      >
        <WalletIcon color="#CCCFF9" size={18} />
      </ConnectWalletButton>
    );
  }

  return (
    <WalletMenu
      address={account?.address}
      onDisconnect={signOut}
      trigger={
        <ConnectWalletButton
          width={"auto"}
          maxH={40}
          rounded={"$2"}
          bg={"#5D44BE"}
          title={
            userDetails?.username || formatAddress(account?.address, 3, 0, 3)
          }
        >
          {account?.icon ? (
            <Image src={account?.icon} width={18} height={18} />
          ) : (
            <WalletIcon color="#CCCFF9" size={18} />
          )}
        </ConnectWalletButton>
      }
    />
  );
}
