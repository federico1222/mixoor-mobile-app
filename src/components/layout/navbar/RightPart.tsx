import { useMobileWallet } from "@/src/context";
import { formatAddress } from "@/src/helpers";
import { WalletIcon } from "phosphor-react-native";
import React from "react";
import ConnectWalletButton from "../wallet/ConnectWalletButton";
import { WalletMenu } from "../wallet/WalletMenu";

export default function RightPart() {
  const { address, connect, disconnect, isConnected } = useMobileWallet();

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
          title={formatAddress(address, 4, 0, 4) || ""}
        >
          <WalletIcon color="#CCCFF9" size={18} />
        </ConnectWalletButton>
      }
    />
  );
}
