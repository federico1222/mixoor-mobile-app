import {
  SOL_TOKEN_CONSTANT,
  USDC_MINT,
  USDC_TOKEN_CONSTANT,
} from "@/src/constants";
import {
  useUserSolBalance,
  useUserSPLTokenBalance,
} from "@/src/hooks/useUserBalance";
import { useTokenSelection } from "@/src/provider";
import { UserToken } from "@/src/provider/token-provider";
import { CaretDown } from "phosphor-react-native";
import { useState } from "react";
import { Image, Text, XStack, YStack } from "tamagui";
import TransferAmountInput from "./TransferAmountInput";

const TOKEN_IMAGES: Record<string, any> = {
  SOL: require("../../../../assets/img/sol.png"),
  USDC: require("../../../../assets/img/usdc.png"),
};

const AVAILABLE_TOKENS = [SOL_TOKEN_CONSTANT, USDC_TOKEN_CONSTANT];

export default function MixoorMiddlePart() {
  const { selectedToken, setSelectedToken } = useTokenSelection();
  const [showSelector, setShowSelector] = useState(false);

  const { data: solBalance } = useUserSolBalance();
  const { data: usdcBalance } = useUserSPLTokenBalance(USDC_MINT);

  const getBalanceForToken = (token: Omit<UserToken, "balance">) => {
    if (token.symbol === "SOL") return solBalance ?? 0;
    if (token.symbol === "USDC") return usdcBalance ?? 0;
    return 0;
  };

  const handleSelectToken = (token: Omit<UserToken, "balance">) => {
    setSelectedToken({ ...token, balance: getBalanceForToken(token) });
    setShowSelector(false);
  };

  const currentSymbol = selectedToken?.symbol ?? "SOL";

  return (
    <YStack gap="$2">
      <XStack gap={"$3"} items={"center"}>
        <XStack
          width={52}
          height={52}
          items={"center"}
          justify={"center"}
          bg={"rgba(64, 53, 122, 0.15)"}
          rounded={18}
          gap="$1"
          onPress={() => setShowSelector(!showSelector)}
          pressStyle={{ opacity: 0.7 }}
          cursor="pointer"
        >
          <Image
            width={25}
            height={25}
            objectFit="contain"
            src={TOKEN_IMAGES[currentSymbol] ?? TOKEN_IMAGES.SOL}
          />
          <CaretDown size={12} color="#CACCFC" />
        </XStack>

        <TransferAmountInput />
      </XStack>

      {showSelector && (
        <YStack
          position="absolute"
          t={58}
          l={0}
          r={0}
          zIndex={100}
          bg="#1A1A2E"
          rounded={12}
          borderWidth={1}
          borderColor="#27272A"
          overflow="hidden"
          elevation={10}
        >
          {AVAILABLE_TOKENS.map((token) => (
            <XStack
              key={token.symbol}
              p="$3"
              gap="$3"
              items="center"
              bg={
                currentSymbol === token.symbol
                  ? "rgba(64, 53, 122, 0.25)"
                  : "transparent"
              }
              onPress={() => handleSelectToken(token)}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
            >
              <Image
                width={24}
                height={24}
                objectFit="contain"
                src={TOKEN_IMAGES[token.symbol]}
              />
              <YStack>
                <Text color="$text" fontSize="$3" fontWeight="500">
                  {token.symbol}
                </Text>
                <Text color="rgba(250, 250, 250, 0.5)" fontSize="$1">
                  {token.name}
                </Text>
              </YStack>
            </XStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
}
