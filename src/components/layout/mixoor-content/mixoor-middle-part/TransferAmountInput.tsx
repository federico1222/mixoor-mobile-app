import {
  MIN_RENT_EXEMPTION_SOL,
  MIN_SOL_UI_AMOUNT,
  MIN_USDC_DEPOSIT,
} from "@/src/constants";
import {
  calculateTransferFee,
  scaleToUIAmount,
} from "@/src/helpers/calculations";
import { useTokenSelection, useTransferInput } from "@/src/provider";
import { useMemo } from "react";
import { TextInput } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function TransferAmountInput() {
  const {
    totalAmount,
    setUiAmount,
    transferType,
    displayAmount,
    setDisplayAmount,
    isMultipleWallets,
    uiAmount,
  } = useTransferInput();

  const { selectedToken } = useTokenSelection();

  const handleChange = (value: string) => {
    setDisplayAmount(value);
    setUiAmount(value);
  };

  const handleMax = () => {
    if (!selectedToken) return;

    const balanceUi = scaleToUIAmount(
      selectedToken.balance,
      selectedToken.decimals ?? 0
    );

    const balanceNum = Number(balanceUi);

    if (!isFinite(balanceNum)) {
      setUiAmount("0");
      setDisplayAmount("0.00");
      return;
    }

    if (selectedToken.symbol === "SOL") {
      const fee = Number(calculateTransferFee(balanceNum) ?? 0);
      const maxAmount = Math.max(
        balanceNum - (fee + MIN_RENT_EXEMPTION_SOL),
        0
      );

      setUiAmount(maxAmount.toString());
      setDisplayAmount(maxAmount.toFixed(2));
    } else {
      setUiAmount(balanceNum.toString());
      setDisplayAmount(balanceNum.toFixed(2));
    }
  };

  const handleBlur = () => {
    const num = Number(uiAmount);
    if (isFinite(num)) {
      setDisplayAmount(num.toFixed(2));
    }
  };

  const handleFocus = () => {
    if (displayAmount === "0.00" || displayAmount === "0") {
      setDisplayAmount("");
    }
  };

  const validationError = useMemo(() => {
    if (!uiAmount || Number(uiAmount) === 0) return "";

    const amountNum = Number(uiAmount);

    if (selectedToken?.symbol === "USDC" && amountNum < MIN_USDC_DEPOSIT) {
      return `The minimum deposit for USDC is $${MIN_USDC_DEPOSIT}`;
    }

    if (selectedToken?.symbol === "SOL" && amountNum < MIN_SOL_UI_AMOUNT) {
      return `Minimum required SOL is ${MIN_SOL_UI_AMOUNT}`;
    }

    return "";
  }, [uiAmount, selectedToken]);

  return (
    <YStack
      flex={1}
      opacity={isMultipleWallets ? 0.4 : 1}
      borderBottomWidth={0.5}
      borderBottomColor={"$secondary"}
      position="relative"
      gap="$2"
    >
      <Text
        ml={isMultipleWallets ? "$4" : "$8"}
        fontSize={"$3"}
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

      <XStack items="center" gap="$2">
        <TextInput
          style={{
            flex: 1,
            height: 68,
            backgroundColor: "transparent",
            textAlign: "center",
            color: validationError ? "#F87171" : "#FFFFFF",
            fontFamily: "BeVietnam_700",
            paddingHorizontal: 10,
            fontSize: 40,
            outline: "none",
          }}
          keyboardType="numeric"
          editable={!(transferType !== "delayed" && isMultipleWallets)}
          placeholder={isMultipleWallets ? totalAmount.toFixed(2) : "0.00"}
          placeholderTextColor="rgba(250, 250, 250, 0.50)"
          value={isMultipleWallets ? totalAmount.toFixed(2) : displayAmount}
          onChangeText={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />

        <Button
          size="$2"
          onPress={handleMax}
          bg="$primary"
          disabled={transferType !== "delayed" && isMultipleWallets}
        >
          <Text fontWeight={500} color="$text" fontSize="$1">
            MAX
          </Text>
        </Button>
      </XStack>

      {validationError ? (
        <Text fontSize="$1" color="$danger" position="absolute" b={-18} r={2}>
          {validationError}
        </Text>
      ) : null}
    </YStack>
  );
}
