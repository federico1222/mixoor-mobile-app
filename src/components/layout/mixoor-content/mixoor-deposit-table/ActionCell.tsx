import { UserDeposits } from "@/src/types/user";
import { ArrowSquareOutIcon } from "phosphor-react-native";
import { useState } from "react";
import { Linking, Pressable } from "react-native";
import { Text, XStack } from "tamagui";
import WithdrawModal from "./withdraw-modal/WithdrawModal";

export default function ActionCell({ item }: { item: UserDeposits }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (item.isSpent) {
    return (
      <XStack justify="center" items="center">
        <Pressable
          onPress={() => Linking.openURL(item.txSignature || "")}
          hitSlop={8}
        >
          <ArrowSquareOutIcon size={16} color="#CACCFC" />
        </Pressable>
      </XStack>
    );
  }

  return (
    <XStack justify="center" items="center">
      <Pressable
        onPress={() => setIsModalOpen(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          borderWidth: 1,
          borderColor: "#5D44BE",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
        })}
      >
        <Text color="#CACCFC" fontSize={12} fontWeight="500">
          Withdraw
        </Text>
      </Pressable>

      <WithdrawModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        depositDetails={item}
      />
    </XStack>
  );
}
