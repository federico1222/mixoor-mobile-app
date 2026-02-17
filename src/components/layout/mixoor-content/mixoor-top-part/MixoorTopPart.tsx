import { useTransferInput } from "@/src/provider";
import React from "react";
import { Text, XStack, YStack } from "tamagui";
import MixoorHowToUse from "./MixoorHowToUse";
import TransferSelector from "./TransferSelector";

export default function MixoorTopPart() {
  const { transferType, setTransferType } = useTransferInput();

  return (
    <YStack width={"100%"} gap={"$7"}>
      <XStack gap={"$3"}>
        <Text
          fontFamily={"$body"}
          fontWeight={"$7"}
          color={"$text"}
          fontSize={"$4"}
        >
          Send Privately
        </Text>

        {/* How To Use */}
        <MixoorHowToUse />
      </XStack>

      <TransferSelector
        transferType={transferType}
        setTransferType={setTransferType}
      />
    </YStack>
  );
}
