import { CheckCircleIcon } from "phosphor-react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import { Text, XStack } from "tamagui";

export default function StatusCell({ isSpent }: { isSpent: boolean }) {
  return (
    <XStack
      gap="$2"
      height={28}
      minW={95}
      rounded={8}
      justify="center"
      items="center"
      bg={isSpent ? "rgba(11, 18, 9, 1)" : "rgba(16, 15, 15, 1)"}
    >
      {isSpent ? (
        <CheckCircleIcon
          size={12}
          color="rgba(179, 219, 167, 1)"
          weight="fill"
        />
      ) : (
        <ActivityIndicator size={8} color="#6964EA" />
      )}
      <Text
        fontSize={12}
        color={isSpent ? "rgba(179, 219, 167, 1)" : "rgba(206, 208, 209, 1)"}
      >
        {isSpent ? "complete" : "pending"}
      </Text>
    </XStack>
  );
}
