import { TransferType } from "@/src/types";
import { ArrowsLeftRight, ShieldCheck } from "phosphor-react-native";
import type { Dispatch, SetStateAction } from "react";
import { Text, XStack, YStack } from "tamagui";

interface TransferSelectorProps {
  transferType: TransferType;
  setTransferType: Dispatch<SetStateAction<TransferType>>;
}

export default function TransferSelector({
  transferType,
  setTransferType,
}: TransferSelectorProps) {
  return (
    <YStack gap={35}>
      <XStack
        p={8}
        rounded={12}
        bg="transparent"
        borderWidth={1}
        borderColor="#27272A"
        width="100%"
      >
        <XStack
          flex={1}
          rounded={"$2"}
          p={"$2"}
          justify={"center"}
          items={"center"}
          gap={"$2"}
          bg={
            transferType === "direct"
              ? "rgba(64, 53, 122, 0.15)"
              : "transparent"
          }
          onPress={() => setTransferType("direct")}
          pressStyle={{ opacity: 0.8 }}
        >
          <ShieldCheck color="#CACCFC" size={16} />

          <Text
            position="relative"
            t={2}
            color={
              transferType === "direct" ? "$text" : "rgba(250, 250, 250, 0.5)"
            }
            fontWeight={transferType === "direct" ? "500" : "400"}
            fontSize={16}
          >
            Direct
          </Text>
        </XStack>

        <XStack
          flex={1}
          rounded={"$2"}
          p={"$2"}
          justify={"center"}
          items={"center"}
          gap={"$2"}
          bg={
            transferType === "delayed"
              ? "rgba(64, 53, 122, 0.15)"
              : "transparent"
          }
          onPress={() => setTransferType("delayed")}
          pressStyle={{ opacity: 0.8 }}
        >
          <ArrowsLeftRight color="#CACCFC" size={16} />
          <Text
            color={
              transferType === "delayed" ? "$text" : "rgba(250, 250, 250, 0.5)"
            }
            fontWeight={transferType === "delayed" ? "500" : "400"}
            fontSize={16}
          >
            Delayed
          </Text>
        </XStack>
      </XStack>

      {/* Description Text */}
      <Text color="rgba(250, 250, 250, 0.5)" fontSize={"$3"} fontWeight={400}>
        {transferType === "direct"
          ? `Send funds privately to another wallet through Mixoor Program, making it untraceable. Transfer is completed in a few seconds.`
          : `Deposit funds in Mixoor Smart Contract and withdraw later when you decide to the recipient wallet, so no one can manually detect your private transfer checking timestamps.`}
      </Text>
    </YStack>
  );
}
