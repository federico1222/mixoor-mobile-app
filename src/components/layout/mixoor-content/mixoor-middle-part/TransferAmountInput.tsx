import { useTransferInput } from "@/src/provider";
import { Button, Input, Text, XStack, YStack } from "tamagui";

export default function TransferAmountInput() {
  const {
    totalAmount,
    setUiAmount,
    transferType,
    displayAmount,
    setDisplayAmount,
    isMultipleWallets,
  } = useTransferInput();

  const handleChange = (value: string) => {
    setDisplayAmount(value);
    setUiAmount(value);
  };

  const handleMax = () => {};

  const handleBlur = () => {};

  const handleFocus = () => {};

  return (
    <YStack flex={1} borderBottomWidth={0.5} borderBottomColor={"$secondary"}>
      <Text
        l={"$5"}
        fontSize={"$3"}
        position="relative"
        fontFamily={"$mono"}
        color={"#FAFAFA"}
        fontWeight={500}
      >
        {transferType === "direct"
          ? isMultipleWallets
            ? "TOTAL sending amount"
            : "Sending Amount"
          : "Deposit Amount"}
      </Text>

      <XStack items={"center"} gap={"$2"}>
        <Input
          min={0}
          flex={1}
          height={68}
          border="none"
          keyboardType="numeric"
          bg={"transparent"}
          fontWeight={700}
          textAlign="center"
          color={"$text"}
          value={isMultipleWallets ? totalAmount.toFixed(2) : displayAmount}
          fontFamily="$heading"
          px={10}
          fontSize={40}
          disabled={
            transferType !== "delayed" && isMultipleWallets ? true : false
          }
          placeholder={isMultipleWallets ? totalAmount.toFixed(2) : "0.00"}
          onChangeText={(text) => handleChange(text)}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />

        <Button
          size={"$2"}
          onPress={handleMax}
          bg={"$primary"}
          disabled={
            transferType !== "delayed" && isMultipleWallets ? true : false
          }
        >
          <Text
            fontWeight={500}
            color={"$text"}
            fontSize={"$1"}
            position="relative"
            t={1}
          >
            MAX
          </Text>
        </Button>
      </XStack>
    </YStack>
  );
}
