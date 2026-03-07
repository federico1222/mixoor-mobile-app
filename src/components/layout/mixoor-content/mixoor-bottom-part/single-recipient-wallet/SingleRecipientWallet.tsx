import WalletAddressInput from "@/src/components/common/WalletAddressInput";
import { useTransferInput } from "@/src/provider";
import { Text, YStack } from "tamagui";

export default function SingleRecipientWallet() {
  const {
    address: recipientAddress,
    setAddress: setRecipientAddress,
    setResolvedAddress,
  } = useTransferInput();

  return (
    <YStack flex={1}>
      <Text fontSize={14} color="#FAFAFA" fontWeight="500">
        Recipient Wallet
      </Text>

      <WalletAddressInput
        value={recipientAddress}
        onChange={setRecipientAddress}
        onResolvedAddress={setResolvedAddress}
        placeholder="Enter Your Wallet"
      />
    </YStack>
  );
}
