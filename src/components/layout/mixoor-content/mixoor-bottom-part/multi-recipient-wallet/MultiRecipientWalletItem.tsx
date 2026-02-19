import { TransferInput } from "@/src/types";
import { Text, YStack } from "tamagui";
import MultiRecipientWalletInput from "./MultiRecipientWalletInput";
import MultiSendingAmountInput from "./MultiSendingAmountInput";

export default function MultiRecipientWalletItem({
  ix,
  item,
  handleRemove,
  onAmountChange,
  onAddressChange,
  onResolvedAddressChange,
}: {
  ix: number;
  item: TransferInput;
  handleRemove: (index: number | undefined) => void;
  onAddressChange: (address: string) => void;
  onAmountChange: (amount: string) => void;
  onResolvedAddressChange: (resolved: string | undefined) => void;
}) {
  return (
    <YStack flex={1} gap={"$3"} items={"flex-start"}>
      {/* Recipient Component */}
      <YStack width={"100%"} flex={2} gap={"$3"}>
        <Text fontWeight={400} fontSize={"$2"}>{`#${
          ix + 1
        } Recipient Wallet`}</Text>

        <MultiRecipientWalletInput
          index={ix}
          value={item.address || ""}
          onChange={onAddressChange}
          onResolvedAddress={onResolvedAddressChange}
          placeholder="Enter Recipient Wallet"
        />
      </YStack>

      {/* Sending Amount Component */}
      <YStack width={"100%"} flex={2} gap={"$3"}>
        <Text fontWeight={400} fontSize={"$2"}>{`#${
          ix + 1
        } Sending Amount`}</Text>

        <MultiSendingAmountInput
          index={ix}
          item={item}
          onChange={onAmountChange}
          handleRemove={handleRemove}
          placeholder="Enter Sending Amount"
        />
      </YStack>
    </YStack>
  );
}
