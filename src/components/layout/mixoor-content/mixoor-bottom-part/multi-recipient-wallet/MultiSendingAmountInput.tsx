import { WRAPPED_SOL_MINT_TOKEN_PROGRAM } from "@/src/constants";
import { useMobileWallet } from "@/src/context";
import { getMinAmount, getMintAddress, transformIpfsLink } from "@/src/helpers";
import { scaleToUIAmount } from "@/src/helpers/calculations";
import {
  useUserSolBalance,
  useUserSPLTokenBalance,
} from "@/src/hooks/useUserBalance";
import { useTokenSelection, useTransferInput } from "@/src/provider";
import { TransferInput } from "@/src/types";
import { TOKEN_PROGRAM_ADDRESS } from "@solana-program/token";
import { address } from "@solana/kit";
import { Trash, Warning } from "phosphor-react-native";
import { useCallback, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Button, Image, Spinner, Text, XStack, YStack } from "tamagui";

interface MultiSendingAmountInputProps {
  item: TransferInput;
  onChange: (value: string) => void;
  handleRemove: (index: number | undefined) => void;
  placeholder?: string;
  index?: number;
}

export default function MultiSendingAmountInput({
  onChange,
  index,
  item,
  handleRemove,
  placeholder = "Enter Sending Amount",
}: MultiSendingAmountInputProps) {
  const { selectedToken } = useTokenSelection();
  const { address: selectedWalletAccount } = useMobileWallet();

  const { totalAmount } = useTransferInput();

  const [error, setError] = useState<string>("");

  const inputId = `recipient-wallet-${index || 0}`;
  const mintAddress = getMintAddress(selectedToken);

  const isSol =
    mintAddress.toString() === WRAPPED_SOL_MINT_TOKEN_PROGRAM.toString();

  const solBalanceQuery = useUserSolBalance();
  const splBalanceQuery = useUserSPLTokenBalance(
    mintAddress,
    address(selectedToken?.tokenProgram ?? TOKEN_PROGRAM_ADDRESS)
  );

  const { data: tokenBalance, isLoading } = isSol
    ? solBalanceQuery
    : splBalanceQuery;

  const tokenBalanceUI = scaleToUIAmount(
    tokenBalance,
    selectedToken?.decimals ?? 0
  );

  const handleHalfClick = useCallback(() => {
    const balanceNum = Number(tokenBalanceUI);
    if (!Number.isFinite(balanceNum) || balanceNum <= 0) return;

    const minAmount = getMinAmount(isSol, selectedToken?.symbol);
    const half = balanceNum / 2;

    if (half < (minAmount ?? 0)) {
      setError(
        `Minimum amount is ${minAmount} ${selectedToken?.symbol || "SOL"}`
      );
      return;
    }

    onChange(half.toFixed(9));
    setError("");
  }, [tokenBalanceUI, onChange, selectedToken, isSol]);

  const handleMaxClick = useCallback(() => {
    const balanceNum = Number(tokenBalanceUI);
    if (!Number.isFinite(balanceNum) || balanceNum <= 0) return;

    const minAmount = getMinAmount(isSol, selectedToken?.symbol);

    if (balanceNum < (minAmount ?? 0)) {
      setError(
        `Minimum amount is ${minAmount} ${selectedToken?.symbol || "SOL"}`
      );
      return;
    }

    onChange(balanceNum.toFixed(9));
    setError("");
  }, [tokenBalanceUI, onChange, selectedToken, isSol]);

  const handleInputChange = (value: string) => {
    onChange(value);

    const inputAmount = Number(value);
    const balanceNum = Number(tokenBalanceUI);

    if (!Number.isFinite(inputAmount)) {
      setError("");
      return;
    }

    const minAmount = getMinAmount(isSol, selectedToken?.symbol);

    if (inputAmount > 0 && inputAmount < (minAmount ?? 0)) {
      setError(
        `Minimum amount is ${minAmount} ${selectedToken?.symbol || "SOL"}`
      );
      return;
    }

    if (!Number.isFinite(balanceNum)) {
      setError("Cannot verify balance. Please try again.");
      return;
    }

    const previousAmount = Number(item.uiAmount || 0);
    const amountDifference = inputAmount - previousAmount;
    const newTotal = totalAmount + amountDifference;

    if (inputAmount > balanceNum) {
      setError(
        `Amount exceeds balance. Available: ${balanceNum.toFixed(2)} ${
          selectedToken?.symbol || "SOL"
        }`
      );
    } else if (newTotal > balanceNum) {
      setError(
        `Total amount exceeds balance. Total: ${newTotal.toFixed(
          2
        )}, Available: ${balanceNum.toFixed(2)} ${
          selectedToken?.symbol || "SOL"
        }`
      );
    } else {
      setError("");
    }
  };

  useEffect(() => {
    const inputAmount = Number(item.uiAmount);
    const balance = Number(tokenBalanceUI);

    if (!Number.isFinite(inputAmount)) {
      setError("");
      return;
    }

    const minAmount = getMinAmount(isSol, selectedToken?.symbol);

    if (inputAmount > 0 && inputAmount < (minAmount ?? 0)) {
      setError(
        `Minimum amount is ${minAmount} ${selectedToken?.symbol || "SOL"}`
      );
      return;
    }

    if (!Number.isFinite(balance)) {
      return;
    }

    if (inputAmount > balance) {
      setError(
        `Amount exceeds balance. Available: ${balance.toFixed(2)} ${
          selectedToken?.symbol || "SOL"
        }`
      );
    } else if (totalAmount > balance) {
      setError(
        `Total amount exceeds balance. Total: ${totalAmount.toFixed(
          2
        )}, Available: ${balance.toFixed(2)} ${selectedToken?.symbol || "SOL"}`
      );
    } else {
      setError("");
    }
  }, [item.uiAmount, tokenBalanceUI, totalAmount, selectedToken, isSol]);

  useEffect(() => {
    setError("");
  }, [selectedToken]);

  return (
    <XStack gap="$3">
      <YStack gap="$3" flex={1}>
        {/* Input Field */}
        <YStack position="relative">
          <XStack
            py="$2"
            px="$3"
            items="center"
            borderWidth={1}
            borderColor={error ? "#E53E3E" : "#27272A"}
            rounded="$3"
            height={44}
          >
            {/* Token Icon or Spinner */}
            {isLoading ? (
              <Spinner size="small" color="#5D44BE" />
            ) : isSol ? (
              <Image
                width={20}
                height={20}
                objectFit="contain"
                src={require("../../../../../assets/img/sol.png")}
              />
            ) : (
              <Image
                source={{
                  uri: transformIpfsLink(
                    selectedToken?.image ||
                      selectedToken?.imageUri ||
                      selectedToken?.uri
                  ),
                }}
                width={20}
                height={20}
                borderRadius={100}
              />
            )}

            {/* Input */}
            <TextInput
              style={{
                flex: 1,
                marginLeft: 12,
                height: 100,
                backgroundColor: "transparent",
                fontSize: 13,
                color: "#FAFAFA",
                fontFamily: "Noto_400",
                outline: "none",
              }}
              keyboardType="numeric"
              placeholder={placeholder}
              placeholderTextColor="rgba(250, 250, 250, 0.50)"
              value={item.uiAmount || ""}
              onChangeText={handleInputChange}
            />
          </XStack>

          {error && (
            <XStack
              mt={10}
              gap="$3"
              items="center"
              bg="#2B0010"
              p="$2.5"
              rounded="$2"
            >
              <Warning size={14} color="#EFB2CE" weight="fill" />
              <Text fontSize={12} color="#EFB2CE" flex={1}>
                {error}
              </Text>
            </XStack>
          )}
        </YStack>

        {/* HALF/MAX Button */}
        <XStack justify="space-between" items="center">
          <Text fontSize={12} fontWeight="400" color="#BBBBBB">
            Balance {selectedWalletAccount ? tokenBalanceUI : 0}{" "}
            {selectedToken?.symbol || "SOL"}
          </Text>

          <XStack gap="$2">
            <Button
              size="$2"
              width={47}
              height={24}
              bg={"$primary"}
              onPress={handleHalfClick}
              disabled={!tokenBalanceUI || isLoading}
              disabledStyle={{ opacity: 0.5 }}
            >
              <Text fontSize={11} fontWeight="500" color={"$text"}>
                HALF
              </Text>
            </Button>

            <Button
              size="$2"
              width={47}
              height={24}
              bg={"$primary"}
              onPress={handleMaxClick}
              disabled={!tokenBalanceUI || isLoading}
              disabledStyle={{ opacity: 0.5 }}
            >
              <Text fontSize={11} fontWeight="500" color={"$text"}>
                MAX
              </Text>
            </Button>
          </XStack>
        </XStack>
      </YStack>

      {/* Delete Button */}
      <Button size="$3" py="$2" onPress={() => handleRemove(index)} chromeless>
        <Trash size={18} color="#BBBBBB" />
      </Button>
    </XStack>
  );
}
