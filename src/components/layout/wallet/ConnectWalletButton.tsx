import React from "react";
import { Button, ButtonProps, Text, XStack } from "tamagui";

export default function ConnectWalletButton({
  onPress,
  children,
  title,
  ...props
}: {
  title: string | undefined | React.ReactNode;
  onPress?: () => void;
  children: React.ReactNode;
} & ButtonProps) {
  return (
    <Button
      height={48}
      gap={"$2"}
      bg={"#2E204F"}
      rounded={"$3"}
      outline={"none"}
      onPress={onPress}
      {...props}
    >
      <XStack minW={20} minH={20} maxW={20} maxH={20} position="relative" t={1}>
        {children}
      </XStack>

      <Text
        fontWeight={500}
        fontSize={"$1"}
        color={"$secondary"}
        position="relative"
        t={2}
      >
        {title}
      </Text>
    </Button>
  );
}
