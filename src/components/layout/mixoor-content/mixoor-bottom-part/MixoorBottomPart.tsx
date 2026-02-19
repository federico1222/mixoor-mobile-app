import WalletMultiToggle from "@/src/components/common/WalletMultiToggle";
import { useTransferInput } from "@/src/provider";
import { useEffect } from "react";
import { YStack } from "tamagui";
import MultiRecipientWallet from "./multi-recipient-wallet/MultiRecipientWallet";
import SendButton from "./send-button/SendButton";
import SingleRecipientWallet from "./single-recipient-wallet/SingleRecipientWallet";

export default function MixoorBottomPart() {
  const {
    isMultipleWallets,
    setIsMultipleWallets,
    transferType,
    transferInput,
    setTransferInput,
  } = useTransferInput();

  useEffect(() => {
    if (transferInput.length === 0 && isMultipleWallets) {
      setIsMultipleWallets(false);
    }
  }, [transferInput, isMultipleWallets, setIsMultipleWallets]);

  return (
    <YStack width={"100%"} gap={"$6"}>
      {transferType === "direct" && (
        <WalletMultiToggle
          setTransferInput={setTransferInput}
          isMultipleWallets={isMultipleWallets}
          setIsMultipleWallets={setIsMultipleWallets}
        >
          {/* Multiple Wallet */}
          {isMultipleWallets && <MultiRecipientWallet />}

          {/* Single Wallet */}
          {!isMultipleWallets && <SingleRecipientWallet />}
        </WalletMultiToggle>
      )}

      {/* SendButton */}
      <SendButton />
    </YStack>
  );
}
