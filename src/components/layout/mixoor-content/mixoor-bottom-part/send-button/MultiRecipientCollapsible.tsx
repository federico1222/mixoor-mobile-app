import { formatAddress } from "@/src/helpers";
import type { TransferInput } from "@/src/types";
import { CaretDown, WallIcon } from "phosphor-react-native";
import { useState } from "react";
import { Square, Text, XStack, YStack } from "tamagui";

export default function MultiRecipientCollapsible({
  transferInput,
  symbol,
}: {
  transferInput: TransferInput[];
  symbol: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <YStack borderBottomWidth={1} borderBottomColor="#27272A">
      {/* Trigger */}
      <XStack
        py="$4"
        justify="space-between"
        items="center"
        pressStyle={{ opacity: 0.7 }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text fontSize={18} color="#FAFAFA">
          No. of recipients:
        </Text>

        <XStack gap="$2" items="center">
          <WallIcon />

          <Text fontSize={24} fontWeight="700" color="#FAFAFA">
            {transferInput.length}
          </Text>

          <Square rotate={isOpen ? "180deg" : "0deg"}>
            <CaretDown size={20} color="#FAFAFA" weight="bold" />
          </Square>
        </XStack>
      </XStack>

      {/* Content */}
      {isOpen && (
        <YStack
          enterStyle={{ opacity: 0, y: -10 }}
          exitStyle={{ opacity: 0, y: -10 }}
        >
          {transferInput.map((item, ix) => (
            <XStack key={ix} justify="space-between" py="$2.5">
              <Text fontSize={14} color="#FAFAFA">
                {formatAddress(item?.address, 3, 0, 3) || `No set`}
              </Text>

              <XStack gap="$1" items="baseline">
                <Text fontSize={14} fontWeight="700" color="#FAFAFA">
                  {Number(item.uiAmount).toFixed(3)}
                </Text>

                <Text fontSize={12} color="rgba(250, 250, 250, 0.50)">
                  {symbol || ""}
                </Text>
              </XStack>
            </XStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
}
