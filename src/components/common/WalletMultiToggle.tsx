import { DEFAULT_INPUT } from "@/src/data";
import { TransferInput } from "@/src/types";
import { MinusIcon, PlusIcon } from "phosphor-react-native";
import type { Dispatch, SetStateAction } from "react";
import { Text, XStack, YStack } from "tamagui";

export default function WalletMultiToggle({
  children,
  isMultipleWallets,
  setIsMultipleWallets,
  setTransferInput,
}: {
  children: React.ReactNode;
  isMultipleWallets: boolean;
  setIsMultipleWallets: Dispatch<SetStateAction<boolean>>;
  setTransferInput: Dispatch<SetStateAction<TransferInput[]>>;
}) {
  return (
    <YStack gap={"$3"}>
      {children}

      <XStack
        gap={"$1"}
        items={"center"}
        cursor={"pointer"}
        justify={"flex-end"}
        onPress={() => {
          setTransferInput(DEFAULT_INPUT);
          setIsMultipleWallets(!isMultipleWallets);
        }}
      >
        {isMultipleWallets ? (
          <MinusIcon size={12} color="#CCCFF9" />
        ) : (
          <PlusIcon size={12} color="#CCCFF9" />
        )}

        <Text
          fontFamily={"$mono"}
          color={"$secondary"}
          style={{ textAlign: "end" }}
          fontSize={"$2"}
        >
          {isMultipleWallets
            ? `Transfer to a single wallet`
            : `Transfer to multiple wallets`}
        </Text>
      </XStack>
    </YStack>
  );
}
